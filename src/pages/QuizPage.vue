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
import { fetchTopic } from '../services/page-utils'
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
      
      // Parse quiz configuration from query parameters
      if (route.query) {
        settings.value = {
          difficulty: route.query.difficulty || 'mixed',
          questionCount: parseInt(route.query.questionCount) || 25,
          timedQuiz: route.query.timedQuiz === 'true',
          timeLimit: route.query.timeLimit ? parseInt(route.query.timeLimit) : null,
          allowOvertime: route.query.allowOvertime !== 'false',
          // Legacy settings for compatibility
          questionsPerChapter: parseInt(route.query.questionCount) || 10,
          timePerQuestion: route.query.timeLimit ? Math.floor((parseInt(route.query.timeLimit) * 60) / parseInt(route.query.questionCount)) : 60,
          showTimer: route.query.timedQuiz === 'true'
        }
      }
      
      // Update document title for SEO
      document.title = `${topic.value.title} Quiz | QuizSphere`
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `Test your knowledge of ${topic.value.title} with interactive quizzes. ` +
          `Practice ${settings.value.questionCount} questions${settings.value.timedQuiz ? ` in ${settings.value.timeLimit} minutes` : ''}.`)
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
    // Save results to localStorage for persistence
    const quizResults = {
      topicKey: topic.value.topic_key,
      topicTitle: topic.value.title,
      score: results.score,
      totalQuestions: results.totalQuestions,
      correctAnswers: results.correctAnswers,
      completedAt: new Date().toISOString(),
      difficulty: settings.value.difficulty,
      timeLimit: settings.value.timeLimit,
      timeTaken: results.timeTaken
    }
    
    // Store in localStorage
    const existingResults = JSON.parse(localStorage.getItem('quizsphere-quiz-results') || '[]')
    existingResults.unshift(quizResults) // Add to beginning
    localStorage.setItem('quizsphere-quiz-results', JSON.stringify(existingResults.slice(0, 10))) // Keep only last 10 results
    
    console.log('Quiz completed:', results)
    
    // Redirect to the topic page with results
    router.push({
      name: 'topic',
      params: { topicSlug: topic.value.slug },
      query: { 
        completed: 'true', 
        score: Math.round(results.score),
        questions: results.totalQuestions,
        correct: results.correctAnswers
      }
    })
  } catch (error) {
    handleError(error)
  }
}
</script>
