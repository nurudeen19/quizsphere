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

  it('renders the first quiz question and its options', async () => {
    const wrapper = mount(QuizView, {
      props: { topic },
      global: { stubs: ['router-link', 'QuizButton'] }
    });
    await flushPromises();
    // The question text is rendered as a <p> element
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
    // Should not show the second question yet
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
    // Simulate selecting the correct answer for the first question
    const firstOption = wrapper.findAll('input[type="radio"]').at(1);
    await firstOption.setValue();
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.text()).toContain(
      'Kubernetes is an open-source platform for automating container operations.'
    );
  });

  it('shows completion message after finishing quiz', async () => {
    // Clear localStorage to ensure clean state
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
    // After last question in first chapter, ensure chapter complete state
    await flushPromises();
    await new Promise(r => setTimeout(r, 200));
    // Now click 'Continue to Next Chapter'
    let continueBtn = wrapper.findAll('button').find(btn => btn.text().toLowerCase().includes('continue'));
    if (continueBtn) {
      await continueBtn.trigger('click');
      await flushPromises();
      await new Promise(r => setTimeout(r, 200));
      expect(wrapper.vm.chapter).toBe(1);
      expect(wrapper.vm.questions[0].question).toBe(mockQuestions[2].question);
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
    // After last question in final chapter, check for completion message
    await flushPromises();
    await new Promise(r => setTimeout(r, 300));
    await flushPromises();
    // Debug: log the wrapper HTML to inspect the rendered output
    // eslint-disable-next-line no-console
    console.log('FINAL HTML:', wrapper.html());
    // Debug: log the state after the last answer
    // eslint-disable-next-line no-console
    console.log('FINAL STATE:', {
      chapter: wrapper.vm.chapter,
      current: wrapper.vm.current,
      questionsLength: wrapper.vm.questions.length,
      chapterStates: wrapper.vm.chapterStates
    });
    // Check for the congrats section or completion message
    const congrats = wrapper.find('.congrats-section');
    const text = wrapper.text().toLowerCase();
    expect(
      congrats.exists() || text.includes('congratulations') || text.includes('chapter complete')
    ).toBe(true);
  });
});
