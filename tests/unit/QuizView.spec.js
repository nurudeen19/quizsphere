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
  // Clear localStorage to avoid state pollution between tests
  localStorage.clear();
  global.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve([...mockQuestions]) }))
})

afterEach(() => {
  vi.restoreAllMocks();
})

describe('QuizView.vue', () => {
  it('renders quiz and handles single correct answer', async () => {
    const wrapper = mount(QuizView, { props: { topic: mockTopic } })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Kubernetes')
    // Select correct answer for Q1
    await wrapper.find('input[type="radio"]').setValue()
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Correct!')
    // Click next
    await wrapper.find('.next-btn').trigger('click')
    expect(wrapper.text()).toContain('Q2')
  })

  it('handles wrong answer and feedback', async () => {
    const wrapper = mount(QuizView, { props: { topic: mockTopic } })
    await wrapper.vm.$nextTick()
    // Select wrong answer for Q1
    await wrapper.findAll('input[type="radio"]')[1].setValue()
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Wrong!')
  })

  it('handles multiple correct answers (checkbox)', async () => {
    const multiQuestions = [
      { q: 'Qmulti', options: ['A', 'B', 'C'], answers: [0, 2] }
    ]
    fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(multiQuestions) }))
    const wrapper = mount(QuizView, { props: { topic: mockTopic } })
    await wrapper.vm.$nextTick()
    // Select both correct checkboxes
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    await checkboxes[0].setChecked()
    await checkboxes[1].setChecked(false)
    await checkboxes[2].setChecked()
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Correct!')
  })

  it('shows error if no valid questions', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve([]) }))
    const wrapper = mount(QuizView, { props: { topic: mockTopic } })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('No valid questions available')
  })

  it('handles edge case: malformed question data', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve([{ q: 'Bad', options: null, answers: null }]) }))
    const wrapper = mount(QuizView, { props: { topic: mockTopic } })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Invalid or corrupt question data')
  })

  it('handles edge case: all questions answered', async () => {
    const wrapper = mount(QuizView, { props: { topic: mockTopic } })
    await wrapper.vm.$nextTick()
    // Simulate answering all questions
    for (let i = 0; i < mockQuestions.length; i++) {
      await wrapper.find('input[type="radio"]').setValue()
      await wrapper.find('form').trigger('submit.prevent')
      await wrapper.find('.next-btn').trigger('click')
    }
    expect(wrapper.text()).toContain('Chapter Complete')
  })

  it('handles restart chapter resets score and state', async () => {
    const wrapper = mount(QuizView, { props: { topic: mockTopic } })
    await wrapper.vm.$nextTick()
    // Answer one question
    await wrapper.find('input[type="radio"]').setValue()
    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.find('.next-btn').trigger('click')
    // Restart chapter
    await wrapper.find('button').trigger('click') // Restart Chapter button
    expect(wrapper.text()).toContain('Question 1 of')
    expect(wrapper.vm.score).toBe(0)
    expect(wrapper.vm.current).toBe(0)
  })

  it('handles edge case: switching topics resets state', async () => {
    const wrapper = mount(QuizView, { props: { topic: mockTopic } })
    await wrapper.vm.$nextTick()
    // Only try to answer if there is a question rendered
    const radios = wrapper.findAll('input[type="radio"]')
    if (radios.length > 0) {
      await radios[0].setValue()
      await wrapper.find('form').trigger('submit.prevent')
    }
    // Switch topic
    await wrapper.setProps({ topic: { ...mockTopic, topic: 'other', title: 'Other', file: '/data/other.json' } })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Other')
    expect(wrapper.vm.current).toBe(0)
  })
})
