<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8">
    <div class="container mx-auto px-4">
      <!-- Quiz Completion Success Message -->
      <div v-if="route.query.completed === 'true'" class="mb-8">
        <div class="bg-green-50 border border-green-200 rounded-lg p-6 shadow-sm">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-green-800">Quiz Completed Successfully! 🎉</h3>
              <p class="text-green-700 mt-1">
                You scored {{ route.query.score }}% ({{ route.query.correct }}/{{ route.query.questions }} correct)
                <span v-if="route.query.score >= 80" class="ml-2 text-green-600 font-medium">- Excellent work!</span>
                <span v-else-if="route.query.score >= 60" class="ml-2 text-green-600 font-medium">- Good job!</span>
                <span v-else class="ml-2 text-blue-600 font-medium">- Keep practicing!</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="topic" class="space-y-8">
        <!-- Hero Section -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-12 text-white">
            <div class="flex items-center space-x-4 mb-4">
              <div class="flex-shrink-0">
                <img 
                  v-if="topic.icon" 
                  :src="topic.icon" 
                  :alt="topic.title"
                  class="w-16 h-16 object-contain"
                />
                <div v-else class="text-4xl">📚</div>
              </div>
              <div>
                <h1 class="text-4xl font-bold">{{ topic.title }}</h1>
                <p class="text-blue-100 text-lg mt-2">{{ topic.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats and Topic Areas -->
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Topic Overview</h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="stat flex items-center space-x-3">
                <div class="bg-blue-100 text-blue-600 p-2 rounded-full">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div class="text-sm text-gray-600">Total Questions</div>
                  <div class="text-2xl font-bold text-blue-600">{{ topic.questions_count }}</div>
                </div>
              </div>
              <div class="stat flex items-center space-x-3">
                <div class="bg-green-100 text-green-600 p-2 rounded-full">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <div class="text-sm text-gray-600">Topic Areas</div>
                  <div class="text-2xl font-bold text-green-600">{{ topic.topic_areas?.length || 0 }}</div>
                </div>
              </div>
            </div>
            
            <!-- Difficulty Breakdown -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <h3 class="text-sm font-medium text-gray-700 mb-3">Questions by Difficulty</h3>
              <div class="grid grid-cols-3 gap-3">
                <div class="text-center">
                  <div class="text-lg font-bold text-green-600">{{ topic.beginner_questions_count || 0 }}</div>
                  <div class="text-xs text-gray-500">Beginner</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-blue-600">{{ topic.intermediate_questions_count || 0 }}</div>
                  <div class="text-xs text-gray-500">Intermediate</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-red-600">{{ topic.advance_questions_count || 0 }}</div>
                  <div class="text-xs text-gray-500">Advanced</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Topic Areas -->
          <div class="bg-white rounded-lg shadow-lg p-6" v-if="topic.topic_areas?.length">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Topic Areas</h2>
            <div class="space-y-3 max-h-64 overflow-y-auto">
              <div
                v-for="area in topic.topic_areas"
                :key="area.id"
                class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium text-gray-800">{{ area.name }}</span>
                  <span class="text-sm text-gray-500 font-medium">{{ area.questions_count || 0 }} questions</span>
                </div>
                <p v-if="area.description" class="text-sm text-gray-600 mb-2">{{ area.description }}</p>
                <div class="flex justify-between text-xs text-gray-500">
                  <span>Beginner: {{ area.beginner_questions_count || 0 }}</span>
                  <span>Intermediate: {{ area.intermediate_questions_count || 0 }}</span>
                  <span>Advanced: {{ area.advance_questions_count || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quiz Options -->
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Quick Start Quiz -->
          <div class="bg-white rounded-lg shadow-lg p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-semibold text-gray-800">Quick Start Quiz</h2>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Recommended
              </span>
            </div>
            <p class="text-gray-600 mb-6">
              Start a quiz immediately with optimized settings. Perfect for quick practice sessions.
            </p>
            
            <!-- Quick Quiz Settings Panel -->
            <QuizSettingsPanel
              v-model="quickQuizSettings"
              quiz-type="quick"
              class="mb-6"
            />

            <button
              @click="existingQuizSession ? continueQuiz() : startQuickQuiz()"
              :disabled="isStartingQuiz"
              class="w-full inline-flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <svg v-if="isStartingQuiz" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!existingQuizSession" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4V6a2 2 0 012-2h6a2 2 0 012 2v4M7 16a4 4 0 108 0v6H7v-6z" />
              </svg>
              {{ isStartingQuiz ? 'Starting Quiz...' : (existingQuizSession ? 'Continue Quiz' : 'Start Quick Quiz') }}
            </button>
          </div>

          <!-- Custom Quiz -->
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">Custom Quiz</h2>
            <p class="text-gray-600 mb-6">
              Customize your quiz experience with specific difficulty levels and advanced settings.
            </p>
            
            <!-- Custom Quiz Settings Panel -->
            <QuizSettingsPanel
              v-model="customQuizSettings"
              quiz-type="custom"
              class="mb-6"
            />

            <!-- Difficulty Selection -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">Difficulty Level</label>
              <div class="space-y-2">
                <div
                  class="flex items-center p-3 border rounded-lg cursor-pointer transition-colors"
                  :class="selectedDifficulty === 'mixed' ? 
                    'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'"
                  @click="selectedDifficulty = 'mixed'"
                >
                  <input
                    type="radio"
                    value="mixed"
                    v-model="selectedDifficulty"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">Mixed Difficulty</div>
                    <div class="text-xs text-gray-500">Questions from all difficulty levels</div>
                  </div>
                  <div class="ml-auto">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {{ topic.questions_count }} questions
                    </span>
                  </div>
                </div>
                <div
                  v-for="difficulty in availableDifficultyLevels"
                  :key="difficulty.value"
                  class="flex items-center p-3 border rounded-lg cursor-pointer transition-colors"
                  :class="selectedDifficulty === difficulty.value ? 
                    'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'"
                  @click="selectedDifficulty = difficulty.value"
                >
                  <input
                    type="radio"
                    :value="difficulty.value"
                    v-model="selectedDifficulty"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900">{{ difficulty.label }}</div>
                    <div class="text-xs text-gray-500">{{ difficulty.description }}</div>
                  </div>
                  <div class="ml-auto">
                    <span :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${difficulty.color}-100 text-${difficulty.color}-800`">
                      {{ difficulty.count }} questions
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Number of Questions -->
            <div class="mb-6">
              <label for="questionCount" class="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <input
                id="questionCount"
                type="number"
                v-model="questionCount"
                min="5"
                :max="getMaxQuestions()"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p class="text-xs text-gray-500 mt-1">
                Available: {{ getMaxQuestions() }} questions for selected difficulty
              </p>
            </div>
            
            <button
              @click="startCustomQuiz"
              class="w-full inline-flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Start Custom Quiz
            </button>
          </div>        </div>
      </div>

      <div v-else class="flex justify-center items-center min-h-[60vh]">
        <div class="animate-pulse text-blue-600">Loading topic...</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchTopic } from '../services/page-utils'
import { StorageService } from '../services/storage.js'
import QuizSettingsPanel from '../components/quiz/ui/QuizSettingsPanel.vue'

const route = useRoute()
const router = useRouter()
const topic = ref(null)

// Check for existing quiz session
const existingQuizSession = ref(null)

// Loading states
const isStartingQuiz = ref(false)

// Quiz configuration
const selectedDifficulty = ref('mixed') // Default to mixed difficulty
const questionCount = ref(25) // Default to 25 questions

// Quiz settings from storage
const quickQuizSettings = ref(StorageService.getQuizSettings().quick)
const customQuizSettings = ref(StorageService.getQuizSettings().custom)

// Difficulty levels based on backend enum
const difficultyLevels = [
  {
    value: 1,
    label: 'Beginner',
    color: 'green',
    description: 'Basic concepts and fundamental knowledge'
  },
  {
    value: 2,
    label: 'Intermediate', 
    color: 'blue',
    description: 'Applied knowledge and practical scenarios'
  },
  {
    value: 3,
    label: 'Advanced',
    color: 'red',
    description: 'Complex scenarios and expert-level concepts'
  },
  {
    value: 4,
    label: 'Expert',
    color: 'purple',
    description: 'Cutting-edge topics and advanced implementation'
  }
]

// Computed property for available difficulty levels based on topic data
const availableDifficultyLevels = computed(() => {
  if (!topic.value) return []
  
  return difficultyLevels.filter(difficulty => {
    const countKey = difficulty.value === 1 ? 'beginner_questions_count' :
                     difficulty.value === 2 ? 'intermediate_questions_count' :
                     difficulty.value === 3 ? 'advance_questions_count' : null
    
    const count = topic.value[countKey] || 0
    return count > 0
  }).map(difficulty => ({
    ...difficulty,
    count: topic.value[
      difficulty.value === 1 ? 'beginner_questions_count' :
      difficulty.value === 2 ? 'intermediate_questions_count' :
      'advance_questions_count'
    ] || 0
  }))
})

// Get maximum questions available for selected difficulty
const getMaxQuestions = () => {
  if (!topic.value) return 0
  
  if (selectedDifficulty.value === 'mixed') {
    return topic.value.questions_count || 0
  }
  
  const countKey = selectedDifficulty.value === 1 ? 'beginner_questions_count' :
                   selectedDifficulty.value === 2 ? 'intermediate_questions_count' :
                   selectedDifficulty.value === 3 ? 'advance_questions_count' : null
  
  return topic.value[countKey] || 0
}

onMounted(async () => {
  try {
    const response = await fetchTopic(route.params.topicSlug)
    if (response.status === 'success' && response.data) {
      topic.value = response.data
      
      // Check for existing quiz session for this topic
      const quizSession = StorageService.getQuizSession()
      if (quizSession && quizSession.topicKey === topic.value.topic_key) {
        existingQuizSession.value = quizSession
      }
      
      // Set default question count based on available questions
      questionCount.value = Math.min(25, topic.value.questions_count)
      
      // Update document title for SEO
      document.title = `${topic.value.title} | QuizSphere`
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `Learn about ${topic.value.title}. ` +
          `Practice with ${topic.value.questions_count} questions across ` +
          `${topic.value.topic_areas?.length || 0} topic areas.`)
      }
    }
  } catch (error) {
    console.error('Failed to fetch topic:', error)
    // Optionally redirect to topics page on error
    router.push('/topics')
  }
  
  // Clear success message from URL after 5 seconds
  if (route.query.completed === 'true') {
    setTimeout(() => {
      router.replace({ 
        name: 'topic', 
        params: route.params,
        query: {} 
      })
    }, 5000)
  }
})

// Continue existing quiz session
function continueQuiz() {
  if (existingQuizSession.value) {
    router.push({
      name: 'quiz',
      params: { topicKey: topic.value.topic_key },
      query: existingQuizSession.value.config
    })
  }
}

// Quick quiz with default settings and user preferences
async function startQuickQuiz() {
  isStartingQuiz.value = true
  
  try {
    const quizConfig = {
      type: 'quick',
      difficulty: 'mixed',
      questionCount: Math.min(25, topic.value.questions_count),
      enableTimer: quickQuizSettings.value.enableTimer,
      timerDuration: quickQuizSettings.value.timerDuration,
      showFeedback: quickQuizSettings.value.showFeedback,
      showExplanations: quickQuizSettings.value.showExplanations
    }

    // Save quiz settings to local storage
    StorageService.saveQuizSettings({
      quick: quickQuizSettings.value,
      custom: customQuizSettings.value
    })

    // Save quiz session to local storage
    StorageService.saveQuizSession({
      topicKey: topic.value.topic_key,
      topicTitle: topic.value.title,
      config: quizConfig,
      startedAt: new Date().toISOString()
    })

    console.log('Quiz settings saved to localStorage')

    router.push({
      name: 'quiz',
      params: { topicKey: topic.value.topic_key },
      query: quizConfig
    })
  } catch (error) {
    console.error('Error starting quiz:', error)
  } finally {
    isStartingQuiz.value = false
  }
}

// Custom quiz with user configuration
async function startCustomQuiz() {
  isStartingQuiz.value = true
  
  try {
    const quizConfig = {
      type: 'custom',
      difficulty: selectedDifficulty.value,
      questionCount: questionCount.value,
      enableTimer: customQuizSettings.value.enableTimer,
      timerDuration: customQuizSettings.value.timerDuration,
      showFeedback: customQuizSettings.value.showFeedback,
      showExplanations: customQuizSettings.value.showExplanations,
      allowOvertime: customQuizSettings.value.allowOvertime
    }

    // Save quiz settings to local storage
    StorageService.saveQuizSettings({
      quick: quickQuizSettings.value,
      custom: customQuizSettings.value
    })

    // Save quiz session to local storage
    StorageService.saveQuizSession({
      topicKey: topic.value.topic_key,
      topicTitle: topic.value.title,
      config: quizConfig,
      startedAt: new Date().toISOString()
    })

    console.log('Quiz settings saved to localStorage')

    router.push({
      name: 'quiz',
      params: { topicKey: topic.value.topic_key },
      query: quizConfig
    })
  } catch (error) {
    console.error('Error starting quiz:', error)
  } finally {
    isStartingQuiz.value = false
  }
}

// Watch for difficulty changes to update question count
watch(selectedDifficulty, () => {
  const maxQuestions = getMaxQuestions()
  if (questionCount.value > maxQuestions) {
    questionCount.value = Math.min(25, maxQuestions)
  }
})
</script>
