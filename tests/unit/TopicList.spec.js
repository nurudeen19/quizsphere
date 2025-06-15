import { mount, flushPromises } from '@vue/test-utils';
import TopicList from '../../src/components/TopicList.vue';
import QuizButton from '../../src/components/QuizButton.vue';

describe('TopicList.vue', () => {
  const mockTopics = [
    {
      topic: 'kubernetes',
      file: 'data/kubernetes.json',
      title: 'Kubernetes',
      image: 'https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg',
      description: 'Master Kubernetes concepts, architecture, and operations.',
      level: 'Intermediate',
      badge: 'Cloud Native',
      questionsCount: 218,
      areas: ['Pods', 'Services']
    },
    {
      topic: 'docker',
      file: 'data/docker.json',
      title: 'Docker',
      image: 'https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png',
      description: 'Master Docker fundamentals.',
      level: 'Intermediate',
      badge: 'Container',
      questionsCount: 129,
      areas: ['Images', 'Containers']
    }
  ];

  beforeEach(() => {
    global.fetch = vi.fn((url) => {
      if (url.includes('topics.json')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(mockTopics) });
      }
      // For question file fetches, return empty array
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders all topics from topics.json', async () => {
    const wrapper = mount(TopicList, { global: { stubs: ['QuizButton', 'router-link'] } });
    await flushPromises();
    mockTopics.forEach(topic => {
      expect(wrapper.text()).toContain(topic.title);
    });
  });

  it('renders topic badges and levels', async () => {
    const wrapper = mount(TopicList, { global: { stubs: ['QuizButton', 'router-link'] } });
    await flushPromises();
    mockTopics.forEach(topic => {
      expect(wrapper.text()).toContain(topic.badge);
      expect(wrapper.text()).toContain(topic.level);
    });
  });

  it('renders topic images', async () => {
    const wrapper = mount(TopicList, { global: { stubs: ['QuizButton', 'router-link'] } });
    await flushPromises();
    const images = wrapper.findAll('img');
    expect(images.length).toBeGreaterThan(0);
    mockTopics.forEach(topic => {
      expect(images.some(img => img.attributes('src') === topic.image)).toBe(true);
    });
  });

  it('renders correct question counts', async () => {
    const wrapper = mount(TopicList, { global: { stubs: ['QuizButton', 'router-link'] } });
    await flushPromises();
    mockTopics.forEach(topic => {
      expect(wrapper.text()).toContain(String(topic.questionsCount));
    });
  });

  it('renders no topic cards if topics list is empty', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }));
    const wrapper = mount(TopicList, { global: { stubs: ['QuizButton', 'router-link'] } });
    await flushPromises();
    expect(wrapper.findAll('.topic-card-ghcert').length).toBe(0);
  });

  it('shows error message if fetch fails', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: false }));
    const wrapper = mount(TopicList, { global: { stubs: ['QuizButton', 'router-link'] } });
    await flushPromises();
    expect(wrapper.text()).toContain('Failed to load topics');
  });

  it('renders with missing/partial topic data', async () => {
    const partialTopics = [{ topic: 'test', title: 'Test' }];
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(partialTopics) }));
    const wrapper = mount(TopicList, { global: { stubs: ['QuizButton', 'router-link'] } });
    await flushPromises();
    expect(wrapper.text()).toContain('Test');
    // Should fallback to default badge and level
    expect(wrapper.text()).toContain('Quiz');
    expect(wrapper.text()).toContain('Intermediate');
  });

  it('renders fallback image if image fails to load', async () => {
    const wrapper = mount(TopicList, { global: { stubs: ['QuizButton', 'router-link'] } });
    await flushPromises();
    const img = wrapper.find('img');
    // Simulate error event
    await img.trigger('error');
    expect(img.attributes('src')).toContain('unsplash');
  });

  it('renders Continue Quiz button if quiz state exists', async () => {
    localStorage.setItem('quizsphere-quiz-state-kubernetes', JSON.stringify({ topic: 'kubernetes', questions: [1,2,3] }));
    const wrapper = mount(TopicList, { global: { components: { QuizButton }, stubs: ['router-link'] } });
    await flushPromises();
    const btns = wrapper.findAllComponents(QuizButton);
    expect(btns.some(btn => btn.text().includes('Continue Quiz'))).toBe(true);
  });

  it('renders Start Quiz button if no quiz state exists', async () => {
    const wrapper = mount(TopicList, { global: { components: { QuizButton }, stubs: ['router-link'] } });
    await flushPromises();
    const btns = wrapper.findAllComponents(QuizButton);
    expect(btns.some(btn => btn.text().includes('Start Quiz'))).toBe(true);
  });

  it('does not render areas list if areas is empty or missing', async () => {
    const noAreasTopics = [{ topic: 'test', title: 'Test', questionsCount: 1 }];
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(noAreasTopics) }));
    const wrapper = mount(TopicList, { global: { stubs: ['QuizButton', 'router-link'] } });
    await flushPromises();
    expect(wrapper.find('.topic-areas-animated').exists()).toBe(false);
  });

  it('all images have alt text', async () => {
    const wrapper = mount(TopicList, { global: { stubs: ['QuizButton', 'router-link'] } });
    await flushPromises();
    wrapper.findAll('img').forEach(img => {
      expect(img.attributes('alt')).toBeDefined();
      expect(img.attributes('alt').length).toBeGreaterThan(0);
    });
  });

  it('all quiz buttons have correct aria-labels', async () => {
    const wrapper = mount(TopicList, { global: { stubs: ['QuizButton', 'router-link'] } });
    await flushPromises();
    const btns = wrapper.findAllComponents({ name: 'QuizButton' });
    mockTopics.forEach(topic => {
      expect(
        btns.some(btn => btn.attributes('aria')?.includes(topic.title))
      ).toBe(true);
    });
  });
});
