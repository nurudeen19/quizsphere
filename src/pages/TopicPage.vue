<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8">
    <div class="container mx-auto px-4">
      <div v-if="topic" class="bg-white rounded-lg shadow-lg p-8">
        <header class="mb-8">
          <h1 class="text-4xl font-bold text-blue-800 mb-4">{{ topic.title }}</h1>
          <p class="text-gray-600 text-lg">{{ topic.description }}</p>
        </header>

        <div class="grid md:grid-cols-2 gap-8 mb-8">
          <div class="stats bg-gray-50 p-6 rounded-lg">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Topic Stats</h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="stat">
                <div class="text-sm text-gray-600">Total Questions</div>
                <div class="text-2xl font-bold text-blue-600">
                  {{ topic.questions_count }}
                </div>
              </div>
              <div class="stat">
                <div class="text-sm text-gray-600">Chapters</div>
                <div class="text-2xl font-bold text-blue-600">
                  {{ topic.chapters?.length || 0 }}
                </div>
              </div>
            </div>
          </div>

          <div class="difficulty bg-gray-50 p-6 rounded-lg">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Difficulty Level</h2>
            <div class="flex items-center space-x-2">
              <div 
                v-for="i in 5" 
                :key="i"
                :class="[
                  'w-8 h-2 rounded',
                  i <= topic.difficulty ? 'bg-blue-600' : 'bg-gray-300'
                ]"
              ></div>
              <span class="ml-2 text-gray-600">
                {{ getDifficultyLabel(topic.difficulty) }}
              </span>
            </div>
          </div>
        </div>

        <div class="chapters mb-8" v-if="topic.chapters?.length">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Chapters</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div
              v-for="chapter in topic.chapters"
              :key="chapter.id"
              class="chapter bg-gray-50 p-4 rounded-lg"
            >
              <h3 class="font-medium text-gray-800">{{ chapter.title }}</h3>
              <p class="text-sm text-gray-600 mt-1">
                {{ chapter.questions_count }} questions
              </p>
            </div>
          </div>
        </div>

        <div class="text-center">
          <router-link
            :to="{ name: 'quiz', params: { topicKey: topic.topic_key }}"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Start Quiz
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </router-link>
        </div>
      </div>

      <div v-else class="flex justify-center items-center min-h-[60vh]">
        <div class="animate-pulse text-blue-600">Loading topic...</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchTopic } from '../services/page-utils'

const route = useRoute()
const topic = ref(null)

onMounted(async () => {
  try {
    const response = await fetchTopic(route.params.topicSlug)
    if (response.status === 'success' && response.data) {
      topic.value = response.data
      
      // Update document title for SEO
      document.title = `${topic.value.title} | QuizSphere`
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `Learn about ${topic.value.title}. ` +
          `Practice with ${topic.value.questions_count} questions across ` +
          `${topic.value.chapters?.length || 0} chapters.`)
      }
    }
  } catch (error) {
    console.error('Failed to fetch topic:', error)
  }
})

function getDifficultyLabel(difficulty) {
  const labels = {
    1: 'Beginner',
    2: 'Easy',
    3: 'Intermediate',
    4: 'Advanced',
    5: 'Expert'
  }
  return labels[difficulty] || 'Unknown'
}
</script>
