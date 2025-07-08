<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8">
    <div class="container mx-auto px-4">
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

        <!-- Quick Start and Quiz Configuration -->
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Quick Start Quiz -->
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">Quick Start Quiz</h2>
            <p class="text-gray-600 mb-6">
              Start a quiz immediately with default settings based on your topic's content.
            </p>
            
            <!-- Default Settings Preview -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 class="text-sm font-medium text-gray-700 mb-3">Default Settings</h3>
              <ul class="space-y-2 text-sm text-gray-600">
                <li>• Questions: {{ Math.min(25, topic.questions_count) }}</li>
                <li>• Difficulty: Mixed (All levels)</li>
                <li>• Time: Unlimited</li>
                <li>• Areas: All topic areas</li>
              </ul>
            </div>

            <button
              @click="startQuickQuiz"
              class="w-full inline-flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform transition-all duration-200 hover:scale-105"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Quick Quiz
            </button>
          </div>

          <!-- Custom Quiz Configuration -->
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">Custom Quiz Configuration</h2>
            <p class="text-gray-600 mb-6">
              Customize your quiz experience with specific settings.
            </p>
            
            <button
              @click="toggleCustomConfiguration"
              class="w-full inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ showConfiguration ? 'Hide Custom Options' : 'Customize Quiz Settings' }}
              <svg class="w-4 h-4 ml-2 transition-transform duration-200" :class="{ 'rotate-180': showConfiguration }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Custom Quiz Configuration Panel -->
        <div 
          ref="configurationPanel"
          v-if="showConfiguration" 
          class="bg-white rounded-lg shadow-xl border-2 border-blue-200 p-8 transition-all duration-300 ease-in-out"
          :class="{ 'ring-4 ring-blue-100 ring-opacity-75': isConfigurationHighlighted }"
        >
          <h2 class="text-2xl font-semibold text-gray-800 mb-6">Quiz Configuration</h2>
          
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Difficulty Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Difficulty Level</label>
              <div class="space-y-2">
                <div
                  class="flex items-center p-3 border rounded-lg cursor-pointer transition-colors border-gray-200 hover:border-gray-300"
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

            <!-- Quiz Settings -->
            <div class="space-y-6">
              <!-- Number of Questions -->
              <div>
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

              <!-- Timed Quiz -->
              <div>
                <div class="flex items-center">
                  <input
                    id="timedQuiz"
                    type="checkbox"
                    v-model="timedQuiz"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label for="timedQuiz" class="ml-2 text-sm font-medium text-gray-700">
                    Enable Timed Quiz
                  </label>
                </div>
                
                <!-- Time Limit -->
                <div v-if="timedQuiz" class="mt-3">
                  <label for="timeLimit" class="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit (minutes)
                  </label>
                  <select
                    id="timeLimit"
                    v-model="timeLimit"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="10">10 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="20">20 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes (1.5 hours)</option>
                    <option value="120">120 minutes (2 hours)</option>
                    <option value="180">180 minutes (3 hours)</option>
                    <option value="custom">Custom time</option>
                  </select>
                  
                  <!-- Custom Time Input -->
                  <div v-if="timeLimit === 'custom'" class="mt-3">
                    <label for="customTimeLimit" class="block text-sm font-medium text-gray-700 mb-2">
                      Custom Time Limit (minutes)
                    </label>
                    <input
                      id="customTimeLimit"
                      type="number"
                      v-model="customTimeLimit"
                      min="5"
                      max="180"
                      placeholder="Enter minutes (5-180)"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p class="text-xs text-gray-500 mt-1">
                      Enter a time between 5 minutes and 3 hours (180 minutes)
                    </p>
                  </div>
                </div>
              </div>

              <!-- Allow Overtime -->
              <div v-if="timedQuiz">
                <div class="flex items-center">
                  <input
                    id="allowOvertime"
                    type="checkbox"
                    v-model="allowOvertime"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label for="allowOvertime" class="ml-2 text-sm font-medium text-gray-700">
                    Allow overtime completion
                  </label>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  Continue quiz even after time expires
                </p>
              </div>
            </div>
          </div>

          <!-- Start Custom Quiz Button -->
          <div class="mt-8 text-center">
            <button
              @click="startCustomQuiz"
              class="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM13 8h4" />
              </svg>
              Start Custom Quiz
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
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

const route = useRoute()
const router = useRouter()
const topic = ref(null)
const configurationPanel = ref(null)

// UI state
const showConfiguration = ref(false)
const isConfigurationHighlighted = ref(false)

// Quiz configuration
const selectedDifficulty = ref('mixed') // Default to mixed difficulty
const questionCount = ref(25) // Default to 25 questions
const timedQuiz = ref(false)
const timeLimit = ref(15) // Default to 15 minutes
const customTimeLimit = ref(30) // Default custom time
const allowOvertime = ref(true)

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
  }
})

// Toggle custom configuration with smooth scroll and highlight
function toggleCustomConfiguration() {
  showConfiguration.value = !showConfiguration.value
  
  if (showConfiguration.value) {
    // Wait for DOM update, then scroll and highlight
    setTimeout(() => {
      if (configurationPanel.value) {
        // Smooth scroll to the configuration panel
        configurationPanel.value.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        })
        
        // Add highlight effect
        isConfigurationHighlighted.value = true
        
        // Remove highlight after animation
        setTimeout(() => {
          isConfigurationHighlighted.value = false
        }, 2000)
      }
    }, 100)
  }
}

// Quick quiz with default settings
function startQuickQuiz() {
  const quizConfig = {
    difficulty: 'mixed',
    questionCount: Math.min(25, topic.value.questions_count),
    timedQuiz: false,
    timeLimit: null,
    allowOvertime: true
  }

  router.push({
    name: 'quiz',
    params: { topicKey: topic.value.topic_key },
    query: quizConfig
  })
}

// Custom quiz with user configuration
function startCustomQuiz() {
  // Determine the actual time limit to use
  const actualTimeLimit = timeLimit.value === 'custom' ? customTimeLimit.value : timeLimit.value
  
  const quizConfig = {
    difficulty: selectedDifficulty.value,
    questionCount: questionCount.value,
    timedQuiz: timedQuiz.value,
    timeLimit: timedQuiz.value ? actualTimeLimit : null,
    allowOvertime: allowOvertime.value
  }

  router.push({
    name: 'quiz',
    params: { topicKey: topic.value.topic_key },
    query: quizConfig
  })
}

// Watch for difficulty changes to update question count
watch(selectedDifficulty, () => {
  const maxQuestions = getMaxQuestions()
  if (questionCount.value > maxQuestions) {
    questionCount.value = Math.min(25, maxQuestions)
  }
})
</script>
