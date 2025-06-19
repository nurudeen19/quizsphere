import { mount, flushPromises } from '@vue/test-utils';
import QuizView from '../../src/components/QuizView.vue';

const mockQuestions = [
  {
    question: 'What is Kubernetes?',
    options: [
      'A programming language',
      'A container orchestration platform',
      'A web server',
      'A database'
    ],
    answer: [1],
    explanation:
      'Kubernetes is an open-source platform for automating container operations.'
  },
  {
    question: 'What is a Pod?',
    options: [
      'A type of service',
      'The smallest deployable unit',
      'A storage volume',
      'A network policy'
    ],
    answer: [1],
    explanation: 'A Pod is the smallest deployable unit in Kubernetes.'
  },
  {
    question: 'What is a Service?',
    options: [
      'A way to expose an application',
      'A type of volume',
      'A node in the cluster',
      'A container image'
    ],
    answer: [0],
    explanation: 'A Service exposes an application running on a set of Pods.'
  },
  {
    question: 'What is etcd?',
    options: [
      'A distributed key-value store',
      'A container runtime',
      'A network policy',
      'A pod controller'
    ],
    answer: [0],
    explanation: 'etcd is a distributed key-value store used for Kubernetes state.'
  }
];

vi.mock('../../src/quiz/quiz-utils.js', () => {
  return {
    fetchQuestions: vi.fn((file, opts = {}) => {
      // Simulate paging: return only the correct slice for the requested chapter
      let page = 0, size = 2;
      if (file && file.includes('?')) {
        const params = new URLSearchParams(file.split('?')[1]);
        page = parseInt(params.get('page') || '0', 10);
        size = parseInt(params.get('size') || '2', 10);
      } else {
        page = opts.page || 0;
        size = opts.size || 2;
      }
      return Promise.resolve(mockQuestions.slice(page * size, (page + 1) * size));
    }),
    PAGE_SIZE: 2,
    getQuizQuestionsPage: (questions, chapterNum, size) => {
      return mockQuestions.slice(chapterNum * size, (chapterNum + 1) * size);
    }
  };
});

// Mock localStorage for test environment
if (typeof window === 'undefined') {
  global.localStorage = {
    store: {},
    getItem(key) { return this.store[key] || null; },
    setItem(key, value) { this.store[key] = value.toString(); },
    removeItem(key) { delete this.store[key]; },
    clear() { this.store = {}; }
  };
}

describe('QuizView.vue', () => {
  const topic = { title: 'Kubernetes', topic: 'kubernetes' };

  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the first quiz question and its options', async () => {
    const wrapper = mount(QuizView, {
      props: { topic },
      global: { stubs: ['router-link', 'QuizButton'] }
    });
    await flushPromises();
    const questionText = wrapper.find('.question-text').text();
    expect(questionText).toContain('What is Kubernetes?');
    [
      'A programming language',
      'A container orchestration platform',
      'A web server',
      'A database'
    ].forEach(opt => {
      expect(wrapper.text()).toContain(opt);
    });
    expect(wrapper.text()).not.toContain('What is a Pod?');
  });

  it('shows progress and question count for the first question', async () => {
    const wrapper = mount(QuizView, {
      props: { topic },
      global: { stubs: ['router-link', 'QuizButton'] }
    });
    await flushPromises();
    expect(wrapper.text()).toMatch(/Question\s*1\s*of\s*2/);
  });

  it('shows explanation after answering the first question', async () => {
    const wrapper = mount(QuizView, {
      props: { topic },
      global: { stubs: ['router-link', 'QuizButton'] }
    });
    await flushPromises();
    const firstOption = wrapper.findAll('input[type="radio"]').at(1);
    await firstOption.setValue();
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.text()).toContain(
      'Kubernetes is an open-source platform for automating container operations.'
    );
    // Should show feedback and next button
    expect(wrapper.find('.feedback').exists()).toBe(true);
    expect(wrapper.find('.next-btn-wrapper').exists()).toBe(true);
  });

  it('shows selection warning if no option is selected', async () => {
    const wrapper = mount(QuizView, {
      props: { topic },
      global: { stubs: ['router-link', 'QuizButton'] }
    });
    await flushPromises();
    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();
    expect(wrapper.find('.selection-warning').exists()).toBe(true);
    expect(wrapper.text()).toContain('Please select at least one option');
  });

  it('shows completion message and stats after finishing all chapters', async () => {
    localStorage.clear();
    const wrapper = mount(QuizView, {
      props: { topic },
      global: { stubs: ['router-link', 'QuizButton'] }
    });
    await flushPromises();
    // Complete first chapter (2 questions)
    for (let i = 0; i < 2; i++) {
      let correctOption = wrapper.findAll('input[type="radio"]').at(mockQuestions[i].answer[0]);
      await correctOption.setValue();
      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();
      let nextBtn = wrapper.findAll('button').find(btn => btn.text().toLowerCase().includes('next'));
      if (nextBtn) {
        await nextBtn.trigger('click');
        await flushPromises();
      }
    }
    // Continue to next chapter
    let continueBtn = wrapper.findAll('button').find(btn => btn.text().toLowerCase().includes('continue'));
    if (continueBtn) {
      await continueBtn.trigger('click');
      await flushPromises();
    }
    // Complete second chapter (next 2 questions)
    for (let i = 2; i < 4; i++) {
      let correctOption = wrapper.findAll('input[type="radio"]').at(mockQuestions[i].answer[0]);
      await correctOption.setValue();
      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();
      let nextBtn = wrapper.findAll('button').find(btn => btn.text().toLowerCase().includes('next'));
      if (nextBtn) {
        await nextBtn.trigger('click');
        await flushPromises();
      }
    }
    // After last question in final chapter, check for completion message and stats
    await flushPromises();
    await new Promise(r => setTimeout(r, 300));
    await flushPromises();
    const congrats = wrapper.find('.congrats-section');
    expect(congrats.exists()).toBe(true);
    expect(wrapper.text().toLowerCase()).toContain('congratulations');
    // Stats card should be visible
    expect(wrapper.find('.stats-card').exists()).toBe(true);
    expect(wrapper.text()).toContain('Overall');
    expect(wrapper.text()).toContain('Chapter 1');
    expect(wrapper.text()).toContain('Chapter 2');
  });

  it('resets all state and stats when Start Fresh is clicked', async () => {
    localStorage.clear();
    const wrapper = mount(QuizView, {
      props: { topic },
      global: { stubs: ['router-link', 'QuizButton'] }
    });
    await flushPromises();
    // Complete first chapter (2 questions)
    for (let i = 0; i < 2; i++) {
      let correctOption = wrapper.findAll('input[type="radio"]').at(mockQuestions[i].answer[0]);
      await correctOption.setValue();
      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();
      let nextBtn = wrapper.findAll('button').find(btn => btn.text().toLowerCase().includes('next'));
      if (nextBtn) {
        await nextBtn.trigger('click');
        await flushPromises();
      }
    }
    // Continue to next chapter
    let continueBtn = wrapper.findAll('button').find(btn => btn.text().toLowerCase().includes('continue'));
    if (continueBtn) {
      await continueBtn.trigger('click');
      await flushPromises();
    }
    // Complete second chapter (next 2 questions)
    for (let i = 2; i < 4; i++) {
      let correctOption = wrapper.findAll('input[type="radio"]').at(mockQuestions[i].answer[0]);
      await correctOption.setValue();
      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();
      let nextBtn = wrapper.findAll('button').find(btn => btn.text().toLowerCase().includes('next'));
      if (nextBtn) {
        await nextBtn.trigger('click');
        await flushPromises();
      }
    }
    // After completion, click Start Fresh
    await flushPromises();
    let startFreshBtn = wrapper.findAll('button').find(btn => btn.text().toLowerCase().includes('start fresh'));
    expect(startFreshBtn.exists()).toBe(true);
    await startFreshBtn.trigger('click');
    await flushPromises();
    // Should be back to first question
    expect(wrapper.find('.question-text').text()).toContain('What is Kubernetes?');
    expect(wrapper.text()).toMatch(/Question\s*1\s*of\s*2/);
    // Stats card should not show completed chapters
    expect(wrapper.find('.stats-card').exists()).toBe(false);
  });
});
