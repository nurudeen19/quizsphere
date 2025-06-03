<template>
  <div v-if="loadError" class="text-center text-red-600 font-bold py-8">{{ loadError }}</div>
  <div v-else class="topic-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 py-8 px-4">
    <div v-for="topic in topics" :key="topic.topic" class="topic-card-new bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center p-6 transition-transform duration-150 hover:-translate-y-1 hover:shadow-2xl">
      <div class="avatar-wrapper mb-4">
        <img :src="topic.image || `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic.title)}`" @error="onImageError($event, topic.title)" alt="Topic image" class="avatar-img w-20 h-20 object-cover rounded-full border-4 border-blue-100 shadow" />
      </div>
      <h2 class="text-xl font-semibold text-gray-800 mb-1 text-center">{{ topic.title }}</h2>
      <p class="text-gray-500 text-sm mb-4 text-center min-h-[32px]">{{ topic.description || 'Test your knowledge on this topic.' }}</p>
      <QuizButton
        v-if="getQuizState(topic.topic)"
        :label="'Continue Quiz'"
        colorClass="bg-yellow-400 hover:bg-yellow-500 text-gray-900"
        :aria="`Continue quiz for ${topic.title}`"
        :click="() => $emit('select', topic)"
      />
      <QuizButton
        v-else
        :label="'Start Quiz'"
        colorClass="''"
        :aria="`Start quiz for ${topic.title}`"
        :click="() => $emit('select', topic)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import QuizButton from './QuizButton.vue'

function onImageError(event, title) {
  // Fallback to Unsplash if Wikimedia fails
  event.target.src = `https://source.unsplash.com/featured/256x256/?${encodeURIComponent(title)}`;
}

function getQuizState(topicKey) {
  const stateStr = localStorage.getItem(`quizsphere-quiz-state-${topicKey}`)
  if (!stateStr) return false
  try {
    const state = JSON.parse(stateStr)
    // Check if the quiz is for this topic
    if (state.topic !== topicKey) return false
    // If there are no questions, don't show continue
    if (!state.questions || !state.questions.length) return false
    // If the user has ever started the quiz, show continue (even if completed)
    return true
  } catch {
    return false
  }
}

const topics = ref([])
const loadError = ref("")

onMounted(async () => {
  try {
    const res = await fetch('/src/data/topics.json')
    if (!res.ok) throw new Error('Failed to load topics')
    topics.value = await res.json()
  } catch (e) {
    loadError.value = 'Failed to load topics. Please try again later.'
  }
})
</script>

<!-- Styles moved to style.css -->
