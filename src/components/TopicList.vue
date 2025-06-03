<template>
  <div class="topic-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 py-8 px-4">
    <div v-for="topic in topics" :key="topic.topic" class="topic-card-new bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center p-6 transition-transform duration-150 hover:-translate-y-1 hover:shadow-2xl">
      <div class="avatar-wrapper mb-4">
        <img :src="topic.image || '/vite.svg'" alt="Topic image" class="avatar-img w-20 h-20 object-cover rounded-full border-4 border-blue-100 shadow" />
      </div>
      <h2 class="text-xl font-semibold text-gray-800 mb-1 text-center">{{ topic.title }}</h2>
      <p class="text-gray-500 text-sm mb-4 text-center min-h-[32px]">{{ topic.description || 'Test your knowledge on this topic.' }}</p>
      <button
        v-if="getQuizState(topic.topic)"
        @click="$emit('select', topic)"
        class="start-quiz-btn-new px-6 py-3 rounded-full font-bold text-base flex items-center justify-center gap-2 mt-auto transition-all mx-auto w-auto min-w-[140px] bg-yellow-400 hover:bg-yellow-500 text-gray-900"
      >
        <span class="icon-wrapper-new flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-300 text-white shadow">
          <i class="fas fa-play"></i>
        </span>
        <span>Continue Quiz</span>
      </button>
      <button
        v-else
        @click="$emit('select', topic)"
        class="start-quiz-btn-new px-6 py-3 rounded-full font-bold text-base flex items-center justify-center gap-2 mt-auto transition-all mx-auto w-auto min-w-[140px]"
      >
        <span class="icon-wrapper-new flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow">
          <i class="fas fa-play"></i>
        </span>
        <span>Start Quiz</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

function getQuizState(topicKey) {
  const stateStr = localStorage.getItem(`quizsphere-quiz-state-${topicKey}`)
  if (!stateStr) return false
  try {
    const state = JSON.parse(stateStr)
    // Check if the quiz is for this topic
    if (state.topic !== topicKey) return false
    // If there are no questions, don't show continue
    if (!state.questions || !state.questions.length) return false
    // Only show continue if the user has submitted at least one answer
    if (typeof state.answered !== 'boolean' || state.current === 0) return false
    // If the quiz is not finished (current < questions.length), show continue
    if (state.current < state.questions.length) return true
    // If chapters are used, check if any chapter is not completed
    const chaptersStr = localStorage.getItem(`quizsphere-chapter-states-${topicKey}`)
    if (chaptersStr) {
      const chapters = JSON.parse(chaptersStr)
      const totalChapters = Math.ceil(state.questions.length / (state.chapterSize || 10)) || 1
      for (let i = 0; i < totalChapters; i++) {
        if ((!chapters[i] || !chapters[i].completed) && (chapters[i]?.score > 0 || state.current > 0)) return true
      }
    }
    // Otherwise, quiz is fully completed
    return false
  } catch {
    return false
  }
}

const topics = ref([])

onMounted(async () => {
  const res = await fetch('/src/data/topics.json')
  topics.value = await res.json()
})
</script>

<!-- Styles moved to style.css -->
