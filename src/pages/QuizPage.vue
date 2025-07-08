# Vue Quiz Page Component
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
    <div class="container mx-auto px-4">
      <QuizView
        v-if="topic && questions.length > 0"
        :topic="topic"
        :questions="questions"
        :settings="settings"
        @complete="handleQuizComplete"
      />
      <div v-else class="flex justify-center items-center min-h-[60vh]">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-6"></div>
          <div class="text-2xl text-blue-600 font-semibold mb-2">
            {{ topic ? 'Loading questions...' : 'Loading quiz...' }}
          </div>
          <div class="text-gray-500">
            {{ topic ? 'Preparing your personalized quiz experience' : 'Setting up your quiz environment' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchTopic } from '../services/page-utils'
import { StorageService } from '../services/storage.js'
import { QuizAPI } from '../services/quiz-api.js'
import QuizView from '../components/quiz/QuizView.vue'

const route = useRoute()
const router = useRouter()
const handleError = inject('handleError')
const topic = ref(null)
const questions = ref([])
const settings = ref({})

// Utility function to get quiz settings from the most efficient source
const getQuizSettings = () => {
  const savedSession = StorageService.getQuizSession()
  const hasValidSession = savedSession && savedSession.topicKey === route.params.topicKey
  
  if (hasValidSession) {
    //console.log('Using localStorage settings (most efficient)')
    return {
      source: 'localStorage',
      settings: {
        ...savedSession.config,
        // Ensure legacy compatibility
        questionsPerChapter: savedSession.config.questionCount || 10,
        timePerQuestion: savedSession.config.enableTimer ? 
          Math.floor((savedSession.config.timerDuration * 60) / savedSession.config.questionCount) : 60,
        showTimer: savedSession.config.enableTimer
      }
    }
  }
  
  //console.log('Using route parameters (fallback)')
  return {
    source: 'routeParams',
    settings: {
      type: route.query.type || 'quick',
      difficulty: route.query.difficulty || 'mixed',
      questionCount: parseInt(route.query.questionCount) || 25,
      enableTimer: route.query.enableTimer === 'true',
      timerDuration: route.query.timerDuration ? parseInt(route.query.timerDuration) : 15,
      showFeedback: route.query.showFeedback !== 'false',
      showExplanations: route.query.showExplanations !== 'false',
      allowOvertime: route.query.allowOvertime !== 'false',
      
      // Legacy settings for compatibility
      questionsPerChapter: parseInt(route.query.questionCount) || 10,
      timePerQuestion: route.query.enableTimer === 'true' ? 
        Math.floor((parseInt(route.query.timerDuration || 15) * 60) / parseInt(route.query.questionCount || 25)) : 60,
      showTimer: route.query.enableTimer === 'true'
    }
  }
}

onMounted(async () => {
  try {
    // First, load the topic
    const response = await fetchTopic(route.params.topicKey)
    if (response.status === 'success' && response.data) {
      topic.value = {
        ...response.data,
        topic: response.data.topic_key
      }
      
      // Get quiz settings from the most efficient source
      const { source, settings: quizSettings } = getQuizSettings()
      settings.value = quizSettings
      
      // If settings came from route params, save them for future efficiency
      if (source === 'routeParams') {
        StorageService.saveQuizSession({
          topicKey: topic.value.topic_key,
          topicTitle: topic.value.title,
          config: settings.value,
          startedAt: new Date().toISOString()
        })
        //console.log('Saved route parameter settings to localStorage for future efficiency')
      }
      
      // Check if we have questions in session first
      const currentSession = StorageService.getQuizSession()
      const hasStoredQuestions = currentSession && 
                                currentSession.topicKey === topic.value.topic_key && 
                                currentSession.questions && 
                                currentSession.questions.length > 0
      
      if (hasStoredQuestions) {
        questions.value = currentSession.questions
      } else {
        // Fetch questions from the backend
        try {
          const questionsResponse = await QuizAPI.fetchQuestions(topic.value.topic_key, {
            questionCount: settings.value.questionCount,
            difficulty: settings.value.difficulty !== 'mixed' ? settings.value.difficulty : null,
            round: route.query.round || 1, // Use round from query or default to 1
            topicArea: route.query.topicArea || null
          })
          
          if (questionsResponse.success && questionsResponse.questions.length > 0) {
            // Use questions as returned by backend
            questions.value = questionsResponse.questions
            
            // Store questions in session for future use
            StorageService.saveQuizSession({
              ...currentSession,
              questions: questions.value,
              questionsLoaded: true,
              questionsCount: questions.value.length,
              lastAccessed: new Date().toISOString()
            })
            
            //console.log(`Loaded and stored ${questions.value.length} questions from backend`)
          } else {
            throw new Error('No questions available for this topic')
          }
        } catch (questionsError) {
          console.error('Error loading questions:', questionsError)
          handleError(new Error('Failed to load quiz questions. Please try again.'))
          setTimeout(() => {
            router.push({ name: 'topic', params: { topicSlug: topic.value.slug } })
          }, 2000)
          return
        }
      }
      
      // Update document title for SEO
      document.title = `${topic.value.title} Quiz | QuizSphere`
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `Test your knowledge of ${topic.value.title} with interactive quizzes. ` +
          `Practice ${settings.value.questionCount} questions${settings.value.enableTimer ? ` in ${settings.value.timerDuration} minutes` : ''}.`)
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
    // Update quiz statistics using StorageService
    StorageService.updateQuizStats(topic.value.topic_key, {
      score: results.score,
      totalQuestions: results.totalQuestions,
      correctAnswers: results.correctAnswers,
      difficulty: settings.value.difficulty,
      timeTaken: results.timeTaken
    })
    
    // Clear the current quiz session
    StorageService.clearQuizSession()
    
    //console.log('Quiz completed:', results)
    
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
