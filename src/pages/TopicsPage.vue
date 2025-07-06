<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
    <!-- Page Header -->
    <header class="bg-white/80 backdrop-blur-sm border-b border-blue-100 py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">Explore Topics</h1>
        <p class="text-lg text-blue-600">Choose from our comprehensive collection of tech topics</p>
      </div>
    </header>

    <main class="py-8">
      <div v-if="isLoading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        <p class="mt-2 text-blue-700">Loading topics...</p>
      </div>
      
      <div v-else-if="loadError" class="text-center text-red-600 font-bold py-8">{{ loadError }}</div>
      
      <div v-else class="container mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <TopicCard
            v-for="topic in topics"
            :key="topic.topic"
            :topic="topic"
            @select="$emit('selectTopic', topic)"
          />
        </div>
      </div>
    </main>

    <!-- SEO Footer -->
    <footer class="w-full text-center py-4 sm:py-6 mt-6 sm:mt-8 text-xs sm:text-sm text-blue-800 bg-gradient-to-r from-cyan-50 via-blue-100 to-blue-200 border-t border-blue-200">
      <span>
        🚀 If you found QuizSphere helpful, please <a href="https://github.com/nurudeen19/quizsphere" target="_blank" rel="noopener" class="text-blue-700 underline font-semibold hover:text-blue-900">star our GitHub repo</a> and help others discover this free resource!
      </span>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import { fetchTopics } from '../services/page-utils';
import TopicCard from '../components/topics/TopicCard.vue'

const emit = defineEmits(['selectTopic'])
const topics = ref([])
const loadError = ref("")
const isLoading = ref(true)

// SEO metadata
useHead({
  title: 'Explore Topics - QuizSphere',
  meta: [
    {
      name: 'description',
      content: 'Browse our comprehensive collection of tech topics. Practice and master cloud computing, programming, DevOps, and more through interactive quizzes.'
    },
    {
      property: 'og:title',
      content: 'Explore Topics - QuizSphere'
    },
    {
      property: 'og:description',
      content: 'Browse our comprehensive collection of tech topics. Practice and master cloud computing, programming, DevOps, and more through interactive quizzes.'
    }
  ]
})

onMounted(async () => {
  try {
    isLoading.value = true
    const response = await fetchTopics()
    
    if (response.status === 'success' && response.data) {
      topics.value = response.data.map(topic => ({
        ...topic,
        topic: topic.topic_key,
        badge: topic.badge || 'Quiz',
        level: topic.level || 'Intermediate',
        description: topic.description || 'This quiz covers the following key areas:',
        areas: topic.topic_areas || [],
        questionsCount: topic.questions_count || 0,
        image: topic.icon || `https://source.unsplash.com/featured/400x300/?${encodeURIComponent(topic.title)}`
      }))
    } else {
      throw new Error(response.message || 'Failed to load topics data')
    }
  } catch (error) {
    console.error('Failed to fetch topics:', error)
    loadError.value = error.response?.data?.message || error.message || 'Failed to load topics. Please try again later.'
  } finally {
    isLoading.value = false
  }
})
</script>
