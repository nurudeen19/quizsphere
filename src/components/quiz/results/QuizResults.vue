<template>
  <div class="quiz-results bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-lg p-8">
    <!-- Results Header -->
    <div class="results-header text-center mb-8">
      <div class="success-icon mb-4">
        <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      
      <h2 class="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
      <p class="text-lg text-gray-600">{{ getPerformanceMessage() }}</p>
    </div>

    <!-- Score Display -->
    <div class="score-display mb-8">
      <div class="text-center mb-6">
        <div class="score-circle w-32 h-32 mx-auto rounded-full border-8 flex items-center justify-center relative"
             :class="getScoreCircleClass()">
          <div class="text-center">
            <div class="text-4xl font-bold" :class="getScoreTextClass()">{{ scorePercentage }}%</div>
            <div class="text-sm text-gray-600">Score</div>
          </div>
          
          <!-- Animated circle progress -->
          <svg class="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              :stroke-width="8"
              class="text-gray-200"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              :stroke-width="8"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="strokeDashoffset"
              :class="getScoreCircleClass()"
              class="transition-all duration-1000 ease-out"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div>
      
      <!-- Score breakdown -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="stat-card bg-white rounded-lg p-4 text-center shadow-sm">
          <div class="text-2xl font-bold text-green-600">{{ correctAnswers }}</div>
          <div class="text-sm text-gray-600">Correct</div>
        </div>
        <div class="stat-card bg-white rounded-lg p-4 text-center shadow-sm">
          <div class="text-2xl font-bold text-red-600">{{ incorrectAnswers }}</div>
          <div class="text-sm text-gray-600">Incorrect</div>
        </div>
        <div class="stat-card bg-white rounded-lg p-4 text-center shadow-sm">
          <div class="text-2xl font-bold text-gray-600">{{ totalQuestions }}</div>
          <div class="text-sm text-gray-600">Total</div>
        </div>
      </div>
    </div>

    <!-- Detailed Statistics -->
    <div class="detailed-stats mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Performance Details</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Time Statistics -->
        <div class="time-stats bg-white rounded-lg p-5 shadow-sm">
          <h4 class="font-medium text-gray-700 mb-3 flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Time Statistics
          </h4>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Total Time:</span>
              <span class="font-medium">{{ formatTime(totalTime) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Average per Question:</span>
              <span class="font-medium">{{ formatTime(averageTimePerQuestion) }}</span>
            </div>
            <div v-if="timeLimit" class="flex justify-between">
              <span class="text-gray-600">Time Limit:</span>
              <span class="font-medium">{{ formatTime(timeLimit * 60) }}</span>
            </div>
          </div>
        </div>

        <!-- Accuracy by Difficulty -->
        <div v-if="difficultyBreakdown.length > 0" class="difficulty-stats bg-white rounded-lg p-5 shadow-sm">
          <h4 class="font-medium text-gray-700 mb-3 flex items-center">
            <svg class="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
            </svg>
            By Difficulty
          </h4>
          <div class="space-y-2">
            <div 
              v-for="difficulty in difficultyBreakdown" 
              :key="difficulty.level"
              class="flex justify-between items-center"
            >
              <span class="text-gray-600">{{ difficulty.level }}:</span>
              <div class="flex items-center">
                <span class="font-medium mr-2">{{ difficulty.correct }}/{{ difficulty.total }}</span>
                <span class="text-sm" :class="getDifficultyColor(difficulty.accuracy)">
                  ({{ difficulty.accuracy }}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Question Review (Optional) -->
    <div v-if="showReview && detailedAnswers.length > 0" class="question-review mb-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold text-gray-800">Question Review</h3>
        <button 
          @click="toggleReview"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {{ reviewExpanded ? 'Hide' : 'Show' }} Details
        </button>
      </div>
      
      <div v-if="reviewExpanded" class="review-content">
        <div class="space-y-4 max-h-96 overflow-y-auto">
          <div
            v-for="(answer, index) in detailedAnswers"
            :key="index"
            class="review-item bg-white rounded-lg p-4 shadow-sm border-l-4"
            :class="answer.isCorrect ? 'border-green-500' : 'border-red-500'"
          >
            <div class="flex items-start justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">Question {{ index + 1 }}</span>
              <span class="text-xs px-2 py-1 rounded-full" 
                    :class="answer.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ answer.isCorrect ? 'Correct' : 'Incorrect' }}
              </span>
            </div>
            <div class="text-sm text-gray-600 mb-2" v-html="answer.question"></div>
            <div class="text-sm">
              <div class="mb-1">
                <span class="text-gray-600">Your answer:</span>
                <span :class="answer.isCorrect ? 'text-green-700' : 'text-red-700'">
                  {{ answer.selectedAnswer }}
                </span>
              </div>
              <div v-if="!answer.isCorrect">
                <span class="text-gray-600">Correct answer:</span>
                <span class="text-green-700">{{ answer.correctAnswer }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons flex flex-col sm:flex-row gap-4 justify-center">
      <button
        @click="$emit('restart')"
        class="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105"
      >
        <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Retry Quiz
      </button>
      
      <button
        @click="$emit('newQuiz')"
        class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105"
      >
        <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        New Quiz
      </button>
      
      <button
        @click="$emit('viewTopics')"
        class="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
      >
        <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Browse Topics
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  correctAnswers: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  totalTime: {
    type: Number,
    default: 0
  },
  timeLimit: {
    type: Number,
    default: null
  },
  detailedAnswers: {
    type: Array,
    default: () => []
  },
  difficultyBreakdown: {
    type: Array,
    default: () => []
  },
  topicTitle: {
    type: String,
    default: ''
  },
  showReview: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['restart', 'newQuiz', 'viewTopics'])

const reviewExpanded = ref(false)

// Computed properties
const incorrectAnswers = computed(() => {
  return props.totalQuestions - props.correctAnswers
})

const scorePercentage = computed(() => {
  return Math.round((props.correctAnswers / props.totalQuestions) * 100)
})

const averageTimePerQuestion = computed(() => {
  return props.totalTime / props.totalQuestions
})

const circumference = computed(() => {
  return 2 * Math.PI * 45 // radius is 45
})

const strokeDashoffset = computed(() => {
  const progress = props.correctAnswers / props.totalQuestions
  return circumference.value * (1 - progress)
})

// Methods
const getPerformanceMessage = () => {
  const percentage = scorePercentage.value
  if (percentage >= 90) return "Outstanding performance! 🌟"
  if (percentage >= 80) return "Excellent work! 🎉"
  if (percentage >= 70) return "Great job! 👏"
  if (percentage >= 60) return "Good effort! 👍"
  return "Keep practicing - you'll improve! 💪"
}

const getScoreCircleClass = () => {
  const percentage = scorePercentage.value
  if (percentage >= 80) return 'text-green-500 border-green-500'
  if (percentage >= 60) return 'text-yellow-500 border-yellow-500'
  return 'text-red-500 border-red-500'
}

const getScoreTextClass = () => {
  const percentage = scorePercentage.value
  if (percentage >= 80) return 'text-green-600'
  if (percentage >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

const getDifficultyColor = (accuracy) => {
  if (accuracy >= 80) return 'text-green-600'
  if (accuracy >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  }
  return `${remainingSeconds}s`
}

const toggleReview = () => {
  reviewExpanded.value = !reviewExpanded.value
}
</script>

<style scoped>
.score-circle {
  position: relative;
}

.review-content {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 400px;
  }
}

.stat-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.review-item {
  transition: all 0.2s ease;
}

.review-item:hover {
  transform: translateX(4px);
}
</style>
