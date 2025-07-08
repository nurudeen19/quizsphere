<template>
  <div class="question-container bg-white rounded-lg shadow-lg p-6">
    <!-- Question Header -->
    <div class="question-header mb-6">
      <div class="flex items-center justify-between mb-4">
        <div class="question-meta">
          <span class="text-sm font-medium text-gray-500">
            Question {{ currentIndex + 1 }} of {{ totalQuestions }}
          </span>
          <span v-if="difficulty" class="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="difficultyClasses[difficulty] || 'bg-gray-100 text-gray-800'">
            {{ difficulty }}
          </span>
        </div>
        
        <!-- Timer slot for external timer component -->
        <slot name="timer"></slot>
      </div>
      
      <!-- Progress bar -->
      <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          class="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
    </div>

    <!-- Question Content -->
    <div class="question-content mb-6">
      <div 
        class="question-text prose max-w-none text-lg text-gray-800 leading-relaxed"
        v-html="renderedQuestion"
      ></div>
    </div>

    <!-- Answer Options -->
    <div class="answer-options space-y-3">
      <button
        v-for="(option, index) in question.options"
        :key="index"
        @click="selectOption(option, index)"
        :disabled="isAnswered && !allowChange"
        class="answer-option w-full text-left p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        :class="getOptionClasses(option, index)"
      >
        <div class="flex items-center">
          <span class="option-letter flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4"
                :class="getOptionLetterClasses(option, index)">
            {{ String.fromCharCode(65 + index) }}
          </span>
          <span class="option-text flex-1" v-html="renderMarkdown(option)"></span>
        </div>
      </button>
    </div>

    <!-- Question Actions -->
    <div class="question-actions flex justify-between items-center mt-8">
      <button
        @click="$emit('previous')"
        :disabled="!canGoPrevious"
        class="btn-secondary px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Previous
      </button>

      <div class="flex items-center gap-3">
        <button
          v-if="allowSkip && !isAnswered"
          @click="$emit('skip')"
          class="btn-skip px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
        >
          Skip Question
        </button>
        
        <button
          @click="handleNext"
          :disabled="!selectedOption && !allowSkip"
          class="btn-primary px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {{ isLastQuestion ? 'Finish Quiz' : 'Next Question' }}
          <svg class="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { renderMarkdown } from '../../../services/markdown'

const props = defineProps({
  question: {
    type: Object,
    required: true,
    validator: (question) => {
      return question && 
             typeof question.question === 'string' && 
             Array.isArray(question.options) && 
             question.options.length > 0
    }
  },
  currentIndex: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  selectedOption: {
    type: String,
    default: null
  },
  isAnswered: {
    type: Boolean,
    default: false
  },
  showCorrectAnswer: {
    type: Boolean,
    default: false
  },
  allowChange: {
    type: Boolean,
    default: true
  },
  allowSkip: {
    type: Boolean,
    default: false
  },
  canGoPrevious: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['select', 'next', 'previous', 'skip'])

// Computed properties
const progressPercentage = computed(() => {
  return ((props.currentIndex + 1) / props.totalQuestions) * 100
})

const isLastQuestion = computed(() => {
  return props.currentIndex === props.totalQuestions - 1
})

const difficulty = computed(() => {
  return props.question.difficulty || props.question.level
})

const renderedQuestion = computed(() => {
  return renderMarkdown(props.question.question)
})

// Difficulty styling
const difficultyClasses = {
  'Beginner': 'bg-green-100 text-green-800',
  'Intermediate': 'bg-blue-100 text-blue-800', 
  'Advanced': 'bg-red-100 text-red-800',
  'Expert': 'bg-purple-100 text-purple-800',
  'easy': 'bg-green-100 text-green-800',
  'medium': 'bg-blue-100 text-blue-800',
  'hard': 'bg-red-100 text-red-800'
}

// Methods
const selectOption = (option, index) => {
  if (props.isAnswered && !props.allowChange) return
  emit('select', { option, index })
}

const handleNext = () => {
  emit('next')
}

const getOptionClasses = (option, index) => {
  const isSelected = props.selectedOption === option
  const isCorrect = props.showCorrectAnswer && option === props.question.correct
  const isWrong = props.showCorrectAnswer && isSelected && option !== props.question.correct
  
  if (isCorrect) {
    return 'border-green-500 bg-green-50 text-green-800'
  } else if (isWrong) {
    return 'border-red-500 bg-red-50 text-red-800'
  } else if (isSelected) {
    return 'border-blue-500 bg-blue-50 text-blue-800'
  } else {
    return 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
  }
}

const getOptionLetterClasses = (option, index) => {
  const isSelected = props.selectedOption === option
  const isCorrect = props.showCorrectAnswer && option === props.question.correct
  const isWrong = props.showCorrectAnswer && isSelected && option !== props.question.correct
  
  if (isCorrect) {
    return 'bg-green-500 text-white'
  } else if (isWrong) {
    return 'bg-red-500 text-white'
  } else if (isSelected) {
    return 'bg-blue-500 text-white'
  } else {
    return 'bg-gray-200 text-gray-700'
  }
}
</script>

<style scoped>
.answer-option {
  cursor: pointer;
}

.answer-option:disabled {
  cursor: not-allowed;
}

.answer-option:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.prose {
  max-width: none;
}

.prose h1, .prose h2, .prose h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.prose p {
  margin-bottom: 0.5rem;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.prose pre {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
}
</style>
