# Vue Quiz Page Component
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8">
    <div class="container mx-auto px-4">
      <QuizView
        v-if="topic"
        :topic="topic"
        :settings="settings"
        @complete="handleQuizComplete"
      />
      <div v-else class="flex justify-center items-center min-h-[60vh]">
        <div class="animate-pulse text-blue-600">Loading quiz...</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchTopic } from '../quiz/quiz-utils'
import QuizView from '../components/quiz/QuizView.vue'

const route = useRoute()
const router = useRouter()
const handleError = inject('handleError')
const topic = ref(null)
const settings = ref({
  questionsPerChapter: 10,
  timePerQuestion: 60,
  showTimer: true
})

onMounted(async () => {
  try {
    const response = await fetchTopic(route.params.topicKey)
    if (response.status === 'success' && response.data) {
      topic.value = {
        ...response.data,
        topic: response.data.topic_key
      }
      
      // Update document title for SEO
      document.title = `${topic.value.title} Quiz | QuizSphere`
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `Test your knowledge of ${topic.value.title} with interactive quizzes. ` +
          `Practice ${topic.value.questions_count} questions across multiple chapters.`)
      }
    } else {
      throw new Error('Failed to load quiz topic')
    }
  } catch (error) {
    handleError(error)
    // Redirect to topics page after error
    setTimeout(() => {
      router.push('/topics')
    }, 2000)
  }
})

const handleQuizComplete = (results) => {
  try {
    // TODO: Save results to localStorage or backend
    console.log('Quiz completed:', results)
    
    // Redirect to the topic page with results
    router.push({
      name: 'topic',
      params: { topicKey: topic.value.topic_key },
      query: { completed: 'true', score: Math.round(results.score) }
    })
  } catch (error) {
    handleError(error)
  }
}
</script>
