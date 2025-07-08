<template>
  <div class="quiz-progress bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
    <!-- Main Progress Bar -->
    <div class="progress-header mb-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-medium text-gray-700">Quiz Progress</h3>
        <span class="text-sm text-gray-500">
          {{ completedQuestions }} / {{ totalQuestions }}
        </span>
      </div>
      
      <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          class="progress-bar h-full rounded-full transition-all duration-500 ease-out"
          :class="progressBarClass"
          :style="{ width: `${progressPercentage}%` }"
        >
          <div class="h-full w-full bg-gradient-to-r from-white/20 to-transparent rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div class="flex justify-between text-xs text-gray-500 mt-1">
        <span>{{ progressPercentage.toFixed(1) }}% Complete</span>
        <span v-if="estimatedTimeRemaining">{{ estimatedTimeRemaining }} remaining</span>
      </div>
    </div>

    <!-- Question Status Indicators -->
    <div v-if="showQuestionStatus" class="question-status">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-medium text-gray-600">Question Status</span>
        <div class="flex items-center gap-3 text-xs">
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 rounded-full bg-green-500"></div>
            <span class="text-gray-600">Correct ({{ correctAnswers }})</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 rounded-full bg-red-500"></div>
            <span class="text-gray-600">Incorrect ({{ incorrectAnswers }})</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 rounded-full bg-gray-400"></div>
            <span class="text-gray-600">Unanswered ({{ unansweredQuestions }})</span>
          </div>
        </div>
      </div>
      
      <!-- Question dots -->
      <div class="question-dots flex flex-wrap gap-1">
        <button
          v-for="(status, index) in questionStatuses"
          :key="index"
          @click="$emit('jumpToQuestion', index)"
          :disabled="!allowJumping"
          class="question-dot w-6 h-6 rounded-full text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="getQuestionDotClass(status, index)"
          :title="`Question ${index + 1} - ${getStatusText(status)}`"
        >
          {{ index + 1 }}
        </button>
      </div>
    </div>

    <!-- Chapter Progress (if applicable) -->
    <div v-if="showChapterProgress && chapters.length > 1" class="chapter-progress mt-4 pt-4 border-t border-gray-200">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-medium text-gray-600">Chapter Progress</span>
        <span class="text-xs text-gray-500">{{ currentChapter + 1 }} / {{ chapters.length }}</span>
      </div>
      
      <div class="chapters-grid grid gap-2" :style="{ gridTemplateColumns: `repeat(${Math.min(chapters.length, 5)}, 1fr)` }">
        <div
          v-for="(chapter, index) in chapters"
          :key="index"
          class="chapter-indicator p-2 rounded-lg text-center transition-colors"
          :class="getChapterClass(index)"
        >
          <div class="text-xs font-medium">{{ chapter.name || `Ch ${index + 1}` }}</div>
          <div class="text-xs text-gray-500 mt-1">
            {{ getChapterProgress(index) }}%
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Stats -->
    <div v-if="showStats && completedQuestions > 0" class="performance-stats mt-4 pt-4 border-t border-gray-200">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div class="stat">
          <div class="text-lg font-bold text-green-600">{{ accuracyPercentage }}%</div>
          <div class="text-xs text-gray-500">Accuracy</div>
        </div>
        <div class="stat">
          <div class="text-lg font-bold text-blue-600">{{ averageTimePerQuestion }}s</div>
          <div class="text-xs text-gray-500">Avg Time</div>
        </div>
        <div class="stat">
          <div class="text-lg font-bold text-purple-600">{{ currentStreak }}</div>
          <div class="text-xs text-gray-500">Streak</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalQuestions: {
    type: Number,
    required: true
  },
  currentQuestionIndex: {
    type: Number,
    required: true
  },
  questionStatuses: {
    type: Array,
    default: () => []
  },
  answers: {
    type: Array,
    default: () => []
  },
  timeElapsed: {
    type: Number,
    default: 0
  },
  timeLimit: {
    type: Number,
    default: null
  },
  chapters: {
    type: Array,
    default: () => []
  },
  currentChapter: {
    type: Number,
    default: 0
  },
  showQuestionStatus: {
    type: Boolean,
    default: true
  },
  showChapterProgress: {
    type: Boolean,
    default: false
  },
  showStats: {
    type: Boolean,
    default: true
  },
  allowJumping: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['jumpToQuestion'])

// Computed properties
const completedQuestions = computed(() => {
  return props.answers.filter(answer => answer !== null && answer !== undefined).length
})

const progressPercentage = computed(() => {
  return (completedQuestions.value / props.totalQuestions) * 100
})

const progressBarClass = computed(() => {
  if (progressPercentage.value < 25) return 'bg-gradient-to-r from-red-500 to-red-600'
  if (progressPercentage.value < 50) return 'bg-gradient-to-r from-orange-500 to-orange-600'
  if (progressPercentage.value < 75) return 'bg-gradient-to-r from-yellow-500 to-yellow-600'
  return 'bg-gradient-to-r from-green-500 to-green-600'
})

const correctAnswers = computed(() => {
  return props.answers.filter(answer => answer && answer.isCorrect).length
})

const incorrectAnswers = computed(() => {
  return props.answers.filter(answer => answer && !answer.isCorrect).length
})

const unansweredQuestions = computed(() => {
  return props.totalQuestions - props.answers.length
})

const accuracyPercentage = computed(() => {
  if (completedQuestions.value === 0) return 0
  return Math.round((correctAnswers.value / completedQuestions.value) * 100)
})

const averageTimePerQuestion = computed(() => {
  if (completedQuestions.value === 0) return 0
  return Math.round(props.timeElapsed / completedQuestions.value)
})

const currentStreak = computed(() => {
  let streak = 0
  for (let i = props.answers.length - 1; i >= 0; i--) {
    if (props.answers[i] && props.answers[i].isCorrect) {
      streak++
    } else {
      break
    }
  }
  return streak
})

const estimatedTimeRemaining = computed(() => {
  if (!props.timeLimit || props.timeElapsed === 0) return null
  
  const remainingTime = (props.timeLimit * 60) - props.timeElapsed
  if (remainingTime <= 0) return 'Time expired'
  
  const minutes = Math.floor(remainingTime / 60)
  const seconds = remainingTime % 60
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
})

// Methods
const getQuestionDotClass = (status, index) => {
  const isCurrent = index === props.currentQuestionIndex
  
  if (isCurrent) {
    return 'bg-blue-500 text-white ring-2 ring-blue-300 ring-offset-1'
  }
  
  switch (status) {
    case 'correct':
      return 'bg-green-500 text-white hover:bg-green-600'
    case 'incorrect':
      return 'bg-red-500 text-white hover:bg-red-600'
    case 'skipped':
      return 'bg-yellow-500 text-white hover:bg-yellow-600'
    case 'unanswered':
    default:
      return 'bg-gray-200 text-gray-600 hover:bg-gray-300'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'correct': return 'Correct'
    case 'incorrect': return 'Incorrect'
    case 'skipped': return 'Skipped'
    case 'unanswered':
    default: return 'Unanswered'
  }
}

const getChapterClass = (index) => {
  if (index === props.currentChapter) {
    return 'bg-blue-100 border-2 border-blue-500'
  } else if (index < props.currentChapter) {
    return 'bg-green-100 border border-green-300'
  } else {
    return 'bg-gray-100 border border-gray-300'
  }
}

const getChapterProgress = (chapterIndex) => {
  const chapterQuestions = props.chapters[chapterIndex]?.questions || []
  if (chapterQuestions.length === 0) return 0
  
  const answeredInChapter = chapterQuestions.filter(q => 
    props.answers[q.index] !== null && props.answers[q.index] !== undefined
  ).length
  
  return Math.round((answeredInChapter / chapterQuestions.length) * 100)
}
</script>

<style scoped>
.question-dot {
  cursor: pointer;
  user-select: none;
}

.question-dot:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.progress-bar {
  position: relative;
  overflow: hidden;
}

.chapters-grid {
  max-width: 100%;
}

@media (max-width: 640px) {
  .question-dots {
    gap: 0.5rem;
  }
  
  .question-dot {
    width: 1.25rem;
    height: 1.25rem;
    font-size: 0.625rem;
  }
  
  .chapters-grid {
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  }
}
</style>
