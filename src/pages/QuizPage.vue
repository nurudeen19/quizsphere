<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
    <div class="container mx-auto px-4">
      <QuizView
        v-if="topic && questions.length > 0"
        :topic="topic"
        :questions="questions"
        :settings="settings"
        :current-round="currentRound"
        :resume-from-index="resumeFromIndex"
        @complete="handleQuizComplete"
        @round-complete="handleRoundComplete"
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
const currentRound = ref(1)
const resumeFromIndex = ref(0)

// Utility function to get quiz settings from the most efficient source
const getQuizSettings = () => {
  const savedSession = StorageService.getQuizSession()
  const hasValidSession = savedSession && savedSession.topicKey === route.params.topicKey
  
  if (hasValidSession) {
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
      }
      
      // Check if we have questions in session first
      const currentSession = StorageService.getQuizSession()
      const hasStoredQuestions = currentSession && 
                                currentSession.topicKey === topic.value.topic_key && 
                                currentSession.questions && 
                                currentSession.questions.length > 0 &&
                                !currentSession.completed

      // Get current round number
      const requestedRound = parseInt(route.query.round) || 1
      const latestRound = StorageService.getLatestRoundNumber(topic.value.topic_key)
      currentRound.value = requestedRound
      
      if (hasStoredQuestions && StorageService.canResumeSession()) {
        // Resume existing session
        questions.value = currentSession.questions
        resumeFromIndex.value = currentSession.currentQuestionIndex || 0
        currentRound.value = currentSession.round || 1
      } else {
        // Fetch questions from the backend
        try {
          // Get previously answered question IDs to exclude
          const previousRounds = StorageService.getQuizRounds(topic.value.topic_key)
          const excludeIds = previousRounds
            .filter(round => round.round < currentRound.value)
            .flatMap(round => round.questionIds || [])

          const questionsResponse = await QuizAPI.fetchQuestions(topic.value.topic_key, {
            questionCount: settings.value.questionCount,
            difficulty: settings.value.difficulty !== 'mixed' ? settings.value.difficulty : null,
            round: currentRound.value,
            topicArea: route.query.topicArea || null,
            excludeIds
          })
          
          if (questionsResponse.success && questionsResponse.questions.length > 0) {
            // Use questions as returned by backend
            questions.value = questionsResponse.questions
            resumeFromIndex.value = 0
            
            // Store questions in session for future use
            StorageService.saveQuizSession({
              topicKey: topic.value.topic_key,
              topicTitle: topic.value.title,
              config: settings.value,
              questions: questions.value,
              questionsLoaded: true,
              questionsCount: questions.value.length,
              currentQuestionIndex: 0,
              round: currentRound.value,
              completed: false,
              startedAt: new Date().toISOString(),
              lastAccessed: new Date().toISOString()
            })
          } else {
            throw new Error('No questions available for this topic and round')
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

const handleRoundComplete = (roundData) => {
  try {
    console.log('Round completed:', roundData)
    
    // Check if user wants to continue to next round
    // This could be handled by showing a modal or redirecting
    
    // For now, just log the completion
    console.log(`Round ${roundData.round} completed with score: ${Math.round(roundData.score)}%`)
  } catch (error) {
    handleError(error)
  }
}

const handleQuizComplete = (results) => {
  try {
    // Clear the current quiz session
    StorageService.clearQuizSession()
    
    // Log completion for debugging
    console.log('Quiz completed:', results)
    
    // Don't auto-redirect - let the user manually navigate from the completion page
    // The completion summary will be shown in QuizView component
  } catch (error) {
    handleError(error)
  }
}
</script>
