<template>
  <div class="quiz-container">
    <header class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-blue-800">{{ topic.title }}</h1>
          <p class="text-gray-600 mt-2">{{ topic.description }}</p>
        </div>
        <!-- Quiz Settings Summary -->
        <div class="text-right text-sm text-gray-500">
          <div v-if="settings.enableTimer">⏱️ {{ settings.timerDuration }} minutes</div>
          <div>{{ settings.questionCount }} questions</div>
          <div class="capitalize">{{ settings.difficulty }} difficulty</div>
        </div>
      </div>
    </header>

    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-pulse text-blue-600">Loading questions...</div>
    </div>

    <div v-else>
      <div v-if="!quizComplete" class="quiz-progress bg-white rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <div class="text-gray-600">
            Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}
          </div>
          <Timer
            v-if="settings.enableTimer"
            :duration="settings.timerDuration"
            :running="quizStarted"
            @timeout="handleTimeout"
          />
        </div>

        <!-- Question Progress Bar -->
        <div class="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }"
          ></div>
        </div>

        <div class="question-container">
          <div class="markdown prose max-w-none mb-4" v-html="currentQuestion.question"></div>
          
          <!-- Answer Options -->
          <div class="grid gap-3 mb-6">
            <button
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              @click="selectAnswer(option)"
              :disabled="answerSubmitted"
              :class="[
                'text-left p-3 rounded-lg border transition-colors',
                getOptionClass(option)
              ]"
            >
              {{ option }}
            </button>
          </div>

          <!-- Feedback Section -->
          <div v-if="answerSubmitted && settings.showFeedback" class="feedback-section mb-6 p-4 rounded-lg">
            <div :class="isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
              <div class="flex items-center mb-2">
                <svg v-if="isCorrect" class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span :class="isCorrect ? 'text-green-800' : 'text-red-800'" class="font-medium">
                  {{ isCorrect ? 'Correct!' : 'Incorrect' }}
                </span>
              </div>
              <div v-if="!isCorrect" :class="'text-red-700'">
                The correct answer is: <strong>{{ currentQuestion.correct }}</strong>
              </div>
            </div>

            <!-- Explanation -->
            <div v-if="settings.showExplanations && currentQuestion.explanation" class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 class="font-medium text-blue-800 mb-2">Explanation:</h4>
              <div class="text-blue-700" v-html="currentQuestion.explanation"></div>
            </div>
          </div>
        </div>

        <div class="flex justify-between">
          <button
            @click="previousQuestion"
            :disabled="currentQuestionIndex === 0"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          
          <div class="flex space-x-2">
            <button
              v-if="!answerSubmitted"
              @click="submitAnswer"
              :disabled="!selectedAnswer"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ settings.showFeedback ? 'Submit Answer' : (isLastQuestion ? 'Finish' : 'Next') }}
            </button>
            
            <button
              v-else
              @click="nextQuestion"
              class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
            >
              {{ isLastQuestion ? 'Finish Quiz' : 'Next Question' }}
            </button>
          </div>
        </div>
      </div>

      <div v-else class="quiz-summary bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-bold text-blue-800 mb-4">Quiz Complete!</h2>
        <div class="stats grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="stat bg-gray-50 p-4 rounded-lg">
            <div class="text-sm text-gray-600">Score</div>
            <div class="text-2xl font-bold text-blue-600">
              {{ Math.round(finalScore) }}%
            </div>
          </div>
          <div class="stat bg-gray-50 p-4 rounded-lg">
            <div class="text-sm text-gray-600">Correct</div>
            <div class="text-2xl font-bold text-green-600">
              {{ correctAnswers.length }} / {{ totalQuestions }}
            </div>
          </div>
          <div class="stat bg-gray-50 p-4 rounded-lg">
            <div class="text-sm text-gray-600">Time</div>
            <div class="text-lg font-bold text-purple-600">
              {{ formatTime(timeTaken) }}
            </div>
          </div>
          <div class="stat bg-gray-50 p-4 rounded-lg">
            <div class="text-sm text-gray-600">Difficulty</div>
            <div class="text-lg font-bold text-orange-600 capitalize">
              {{ settings.difficulty }}
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Performance Summary</h3>
          <div class="space-y-2">
            <div v-if="finalScore >= 80" class="flex items-center text-green-700">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Excellent work! You have a strong understanding of this topic.
            </div>
            <div v-else-if="finalScore >= 60" class="flex items-center text-blue-700">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Good job! Consider reviewing the topics you missed.
            </div>
            <div v-else class="flex items-center text-orange-700">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Keep practicing! Focus on the fundamentals and try again.
            </div>
          </div>
        </div>

        <button
          @click="restartQuiz"
          class="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Take Quiz Again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { marked } from 'marked'
import Timer from './ui/Timer.vue'

const handleError = inject('handleError')

const props = defineProps({
  topic: {
    type: Object,
    required: true
  },
  questions: {
    type: Array,
    required: true
  },
  settings: {
    type: Object,
    default: () => ({
      type: 'quick',
      difficulty: 'mixed',
      questionCount: 25,
      enableTimer: false,
      timerDuration: 15,
      showFeedback: true,
      showExplanations: true,
      allowOvertime: true
    })
  }
})

const emit = defineEmits(['complete'])

// State
const isLoading = ref(false)
const quizStarted = ref(false)
const quizComplete = ref(false)
const currentQuestionIndex = ref(0)
const selectedAnswer = ref(null)
const answerSubmitted = ref(false)
const questions = ref([])
const answers = ref([])
const quizStartTime = ref(null)
const timeTaken = ref(0)

// Computed properties
const totalQuestions = computed(() => questions.value.length)
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions.value - 1)
const correctAnswers = computed(() =>
  answers.value.filter(answer => answer.isCorrect)
)
const finalScore = computed(() => 
  totalQuestions.value > 0 ? (correctAnswers.value.length / totalQuestions.value) * 100 : 0
)
const isCorrect = computed(() => 
  selectedAnswer.value === currentQuestion.value?.correct
)

// Methods
onMounted(async () => {
  await startQuiz()
})

async function startQuiz() {
  isLoading.value = true
  quizStarted.value = true
  quizStartTime.value = Date.now()
  
  try {
    // Use questions from props instead of generating them
    questions.value = props.questions
    console.log(`Quiz started with ${questions.value.length} questions`)
  } catch (error) {
    console.error('Error starting quiz:', error)
  } finally {
    isLoading.value = false
  }
}

function getOptionClass(option) {
  if (!answerSubmitted.value) {
    return selectedAnswer.value === option
      ? 'bg-blue-100 border-blue-500'
      : 'border-gray-300 hover:bg-gray-50'
  }
  
  // Show feedback after submission
  if (option === currentQuestion.value.correct) {
    return 'bg-green-100 border-green-500 text-green-800'
  } else if (option === selectedAnswer.value && option !== currentQuestion.value.correct) {
    return 'bg-red-100 border-red-500 text-red-800'
  } else {
    return 'border-gray-300 bg-gray-50'
  }
}

function selectAnswer(answer) {
  if (!answerSubmitted.value) {
    selectedAnswer.value = answer
  }
}

function submitAnswer() {
  if (selectedAnswer.value && !answerSubmitted.value) {
    answerSubmitted.value = true
    
    const currentAnswer = {
      question: currentQuestion.value,
      selected: selectedAnswer.value,
      isCorrect: selectedAnswer.value === currentQuestion.value.correct
    }
    answers.value[currentQuestionIndex.value] = currentAnswer
  }
}

function previousQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    const previousAnswer = answers.value[currentQuestionIndex.value]
    selectedAnswer.value = previousAnswer?.selected || null
    answerSubmitted.value = !!previousAnswer
  }
}

function nextQuestion() {
  if (!answerSubmitted.value && selectedAnswer.value) {
    submitAnswer()
  }
  
  if (answerSubmitted.value) {
    if (isLastQuestion.value) {
      finishQuiz()
    } else {
      currentQuestionIndex.value++
      const nextAnswer = answers.value[currentQuestionIndex.value]
      selectedAnswer.value = nextAnswer?.selected || null
      answerSubmitted.value = !!nextAnswer
    }
  }
}

function handleTimeout() {
  try {
    if (!answerSubmitted.value) {
      // Auto-submit current answer or mark as skipped
      if (selectedAnswer.value) {
        submitAnswer()
      } else {
        // Mark as skipped
        const skippedAnswer = {
          question: currentQuestion.value,
          selected: null,
          isCorrect: false,
          skipped: true
        }
        answers.value[currentQuestionIndex.value] = skippedAnswer
        answerSubmitted.value = true
      }
    }
    
    if (props.settings.allowOvertime) {
      // Allow continuing in overtime mode
      nextQuestion()
    } else {
      // Force finish quiz
      finishQuiz()
    }
  } catch (error) {
    handleError(error)
  }
}

function finishQuiz() {
  try {
    quizComplete.value = true
    timeTaken.value = Math.floor((Date.now() - quizStartTime.value) / 1000)
    
    emit('complete', {
      topic: props.topic.topic,
      score: finalScore.value,
      totalQuestions: totalQuestions.value,
      correctAnswers: correctAnswers.value.length,
      answers: answers.value,
      settings: props.settings,
      timeTaken: timeTaken.value
    })
  } catch (error) {
    handleError(error)
  }
}

function restartQuiz() {
  quizStarted.value = false
  quizComplete.value = false
  currentQuestionIndex.value = 0
  selectedAnswer.value = null
  answerSubmitted.value = false
  questions.value = []
  answers.value = []
  timeTaken.value = 0
  quizStartTime.value = null
  
  // Restart the quiz
  startQuiz()
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.quiz-container {
  max-width: 4xl;
  margin: 0 auto;
}

.question-container {
  margin-bottom: 1.5rem;
}

.markdown {
  line-height: 1.6;
}

.markdown h1, .markdown h2, .markdown h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.markdown p {
  margin-bottom: 0.75rem;
}

.markdown code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Inconsolata, "Liberation Mono", "Courier New", monospace;
}

.markdown pre {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.feedback-section {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>