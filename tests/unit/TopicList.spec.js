import { mount, flushPromises } from '@vue/test-utils';
import TopicList from '../../src/components/TopicList.vue';

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
});
