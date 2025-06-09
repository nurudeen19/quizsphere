// QuizView.spec.js
// Unit tests for QuizView.vue (Vue 3 + Vite + Jest + @vue/test-utils)
// Covers edge cases and core quiz logic

import { mount } from '@vue/test-utils'
import QuizView from '../../src/components/QuizView.vue'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockTopic = {
  topic: 'kubernetes',
  title: 'Kubernetes',
  file: '/data/kubernetes.json',
}

const mockQuestions = [
  { q: 'Q1', options: ['A', 'B', 'C'], answers: [0] },
  { q: 'Q2', options: ['A', 'B', 'C'], answers: [1] },
  { q: 'Q3', options: ['A', 'B', 'C'], answers: [2] },
]

// Mock fetch for questions
beforeEach(() => {
  localStorage.clear();
  globalThis.fetch = vi.fn((file) => {
    // Match the normalized file path as used in QuizView.vue
    if (file && (file.endsWith('/data/kubernetes.json') || file.endsWith('/data/other.json'))) {
      return Promise.resolve({ json: () => Promise.resolve(JSON.parse(JSON.stringify(mockQuestions))) });
    }
    return Promise.resolve({ json: () => Promise.resolve([]) });
  });
})

afterEach(() => {
  vi.restoreAllMocks();
})

describe('QuizView.vue', () => {
  it('renders quiz and handles single correct answer', async () => {
    const wrapper = mount(QuizView, { props: { topic: mockTopic } })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Kubernetes')
    const radios = wrapper.findAll('input[type="radio"]')
    expect(radios.length).toBeGreaterThan(0)
    await radios[0].setValue()
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Correct!')
    const nextBtn = wrapper.find('.next-btn')
    expect(nextBtn.exists()).toBe(true)
    await nextBtn.trigger('click')
    expect(wrapper.text()).toContain('Q2')
  })

  it('handles wrong answer and feedback', async () => {
    const wrapper = mount(QuizView, { props: { topic: mockTopic } })
    await wrapper.vm.$nextTick()
    const radios = wrapper.findAll('input[type="radio"]')
    expect(radios.length).toBeGreaterThan(1)
    await radios[1].setValue()
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Wrong!')
  })

  it('handles multiple correct answers (checkbox)', async () => {
    const multiQuestions = [
      { q: 'Qmulti', options: ['A', 'B', 'C'], answers: [0, 2] }
    ];
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve(JSON.parse(JSON.stringify(multiQuestions))) }));
    const wrapper = mount(QuizView, { props: { topic: mockTopic } });
    await wrapper.vm.$nextTick();
    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    expect(checkboxes.length).toBe(3);
    await checkboxes[0].setChecked();
    await checkboxes[1].setChecked(false);
    await checkboxes[2].setChecked();
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.text()).toContain('Correct!');
    globalThis.fetch = originalFetch;
  })

  it('shows error if no valid questions', async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve([]) }))
    const wrapper = mount(QuizView, { props: { topic: mockTopic } })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('No valid questions available for this topic. Please check back later.')
  })

  it('handles edge case: malformed question data', async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve([{ q: 'Bad', options: null, answers: null }]) }))
    const wrapper = mount(QuizView, { props: { topic: mockTopic } })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('No valid questions available for this topic. Please check back later.')
  })

  it('handles edge case: all questions answered', async () => {
    const wrapper = mount(QuizView, { props: { topic: mockTopic } })
    await wrapper.vm.$nextTick()
    for (let i = 0; i < mockQuestions.length; i++) {
      const radios = wrapper.findAll('input[type="radio"]')
      expect(radios.length).toBeGreaterThan(0)
      await radios[0].setValue()
      await wrapper.find('form').trigger('submit.prevent')
      const nextBtn = wrapper.find('.next-btn')
      expect(nextBtn.exists()).toBe(true)
      await nextBtn.trigger('click')
    }
    expect(wrapper.text()).toMatch(/Chapter (\d+ )?Complete/)
  })

  it('handles restart chapter resets score and state', async () => {
    const wrapper = mount(QuizView, { props: { topic: mockTopic } })
    await wrapper.vm.$nextTick()
    const radios = wrapper.findAll('input[type="radio"]')
    if (radios.length > 0) {
      await radios[0].setValue()
      await wrapper.find('form').trigger('submit.prevent')
      const nextBtn = wrapper.find('.next-btn')
      if (nextBtn.exists()) await nextBtn.trigger('click')
    }
    // Restart chapter
    const restartBtn = wrapper.findAll('button').find(btn => btn.text().toLowerCase().includes('restart'))
    expect(restartBtn).toBeTruthy()
    await restartBtn.trigger('click')
    expect(wrapper.text()).toContain('Question 1 of')
    expect(wrapper.vm.score).toBe(0)
    expect(wrapper.vm.current).toBe(0)
  })

  it('handles edge case: switching topics resets state', async () => {
    const wrapper = mount(QuizView, { props: { topic: mockTopic } })
    await wrapper.vm.$nextTick()
    const radios = wrapper.findAll('input[type="radio"]')
    if (radios.length > 0) {
      await radios[0].setValue()
      await wrapper.find('form').trigger('submit.prevent')
    }
    // Switch topic to 'other', which will also return mockQuestions
    await wrapper.setProps({ topic: { ...mockTopic, topic: 'other', title: 'Other', file: '/data/other.json' } })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Other')
    expect(wrapper.vm.current).toBe(0)
  })
})
