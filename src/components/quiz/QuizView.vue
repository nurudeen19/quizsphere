<template>
  <div class="quiz-container max-w-4xl mx-auto">
    <!-- Header with gradient background -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl p-8 mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold mb-2">{{ topic.title }}</h1>
          <p class="text-blue-100 text-lg">{{ topic.description }}</p>
        </div>
        <!-- Quiz Settings Summary -->
        <div class="text-right text-blue-100 bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div v-if="settings.enableTimer" class="flex items-center mb-2">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ settings.timerDuration }} minutes
          </div>
          <div class="flex items-center mb-2">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            {{ settings.questionCount }} questions
          </div>
          <div class="flex items-center capitalize">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            {{ settings.difficulty }} difficulty
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-16">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <div class="text-xl text-blue-600 font-medium">Loading questions...</div>
      </div>
    </div>

    <div v-else>
      <div v-if="!quizComplete" class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Progress header -->
        <div class="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b">
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center">
              <div class="bg-blue-100 text-blue-600 px-4 py-2 rounded-full font-semibold text-sm">
                Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}
              </div>
            </div>
            <Timer
              v-if="settings.enableTimer"
              :duration="settings.timerDuration"
              :running="quizStarted"
              @timeout="handleTimeout"
            />
          </div>

          <!-- Enhanced Progress Bar -->
          <div class="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <div 
              class="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
              :style="{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- Question content -->
        <div class="p-8">
          <!-- Enhanced Question Display -->
          <div class="mb-8">
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-l-4 border-blue-500">
              <div v-if="currentQuestion && currentQuestion.question" 
                   class="text-xl font-medium text-gray-800 leading-relaxed" 
                   v-html="currentQuestion.question">
              </div>
              <div v-else class="text-gray-500 italic">No question available.</div>
            </div>
            
            <!-- Multiple choice indicator with better styling -->
            <div v-if="currentQuestion.is_multiple" class="mt-4 flex items-center text-blue-600 font-medium bg-blue-50 px-4 py-2 rounded-lg inline-flex">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Select all correct answers
            </div>
          </div>
          
          <!-- Enhanced Answer Options -->
          <div class="space-y-4 mb-8">
            <div
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              @click="!answerSubmitted && selectAnswer(option)"
              :class="[
                'group transition-all duration-200 transform',
                !answerSubmitted ? 'cursor-pointer hover:scale-[1.02] hover:shadow-lg' : 'cursor-default'
              ]"
            >
              <div :class="[
                'flex items-center p-5 rounded-xl border-2 transition-all duration-200',
                getOptionClass(option)
              ]">
                <!-- Checkbox for multiple choice -->
                <div v-if="currentQuestion.is_multiple" class="mr-4 flex-shrink-0">
                  <div :class="[
                    'w-6 h-6 border-2 rounded-md transition-all duration-200 flex items-center justify-center',
                    (Array.isArray(selectedAnswer) && selectedAnswer.includes(option)) 
                      ? 'bg-blue-600 border-blue-600 shadow-md' 
                      : 'border-gray-300 group-hover:border-blue-400'
                  ]">
                    <svg v-if="Array.isArray(selectedAnswer) && selectedAnswer.includes(option)" 
                         class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                
                <!-- Radio button for single choice -->
                <div v-else class="mr-4 flex-shrink-0">
                  <div :class="[
                    'w-6 h-6 border-2 rounded-full transition-all duration-200 flex items-center justify-center',
                    (Array.isArray(selectedAnswer) && selectedAnswer.includes(option)) 
                      ? 'bg-blue-600 border-blue-600 shadow-md' 
                      : 'border-gray-300 group-hover:border-blue-400'
                  ]">
                    <div v-if="Array.isArray(selectedAnswer) && selectedAnswer.includes(option)" 
                         class="w-3 h-3 bg-white rounded-full">
                    </div>
                  </div>
                </div>
                
                <!-- Option letter/number -->
                <div class="mr-4 flex-shrink-0">
                  <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600">
                    {{ String.fromCharCode(65 + index) }}
                  </div>
                </div>
                
                <!-- Option text -->
                <span class="flex-1 text-lg text-gray-800 font-medium">{{ option }}</span>
              </div>
            </div>
          </div>

          <!-- Enhanced Feedback Section -->
          <div v-if="answerSubmitted && settings.showFeedback" class="mb-8">
            <div :class="[
              'rounded-xl p-6 border-2 shadow-lg',
              isCorrect 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
            ]">
              <div class="flex items-center mb-3">
                <div :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center mr-4',
                  isCorrect ? 'bg-green-100' : 'bg-red-100'
                ]">
                  <svg v-if="isCorrect" class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg v-else class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span :class="[
                    'text-xl font-bold',
                    isCorrect ? 'text-green-800' : 'text-red-800'
                  ]">
                    {{ isCorrect ? 'Excellent!' : 'Not quite right' }}
                  </span>
                  <div :class="[
                    'text-sm font-medium mt-1',
                    isCorrect ? 'text-green-600' : 'text-red-600'
                  ]">
                    {{ isCorrect ? 'You got it correct!' : 'The correct answer is highlighted above' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Enhanced Explanation -->
            <div v-if="settings.showExplanations && currentQuestion.explanation" class="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div class="flex items-center mb-3">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-blue-800">Explanation</h4>
              </div>
              <div class="text-blue-700 leading-relaxed" v-html="currentQuestion.explanation"></div>
            </div>
          </div>
        </div>

        <!-- Enhanced Navigation Buttons -->
        <div class="bg-gray-50 px-8 py-6 border-t flex justify-between items-center">
          <button
            @click="previousQuestion"
            :disabled="currentQuestionIndex === 0"
            class="flex items-center px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Previous
          </button>
          
          <div class="flex space-x-3">
            <button
              v-if="!answerSubmitted"
              @click="submitAnswer"
              :disabled="!selectedAnswer || selectedAnswer.length === 0"
              class="flex items-center px-8 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 border-2 border-transparent rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg"
            >
              {{ settings.showFeedback ? 'Submit Answer' : (isLastQuestion ? 'Finish Quiz' : 'Next Question') }}
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </button>
            
            <button
              v-else
              @click="nextQuestion"
              class="flex items-center px-8 py-3 text-white bg-gradient-to-r from-green-600 to-emerald-600 border-2 border-transparent rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg"
            >
              {{ isLastQuestion ? 'Finish Quiz' : 'Next Question' }}
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Enhanced Quiz Summary -->
      <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Celebration header -->
        <div class="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 text-center">
          <div class="mb-4">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <h2 class="text-4xl font-bold mb-2">Quiz Complete!</h2>
          <p class="text-green-100 text-lg">Great job on completing the {{ topic.title }} quiz</p>
        </div>

        <!-- Stats section -->
        <div class="p-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div class="text-center">
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <div class="text-3xl font-bold text-blue-600 mb-2">{{ Math.round(finalScore) }}%</div>
                <div class="text-sm font-medium text-blue-800">Final Score</div>
              </div>
            </div>
            
            <div class="text-center">
              <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                <div class="text-3xl font-bold text-green-600 mb-2">{{ correctAnswers.length }}</div>
                <div class="text-sm font-medium text-green-800">Correct Answers</div>
              </div>
            </div>
            
            <div class="text-center">
              <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <div class="text-3xl font-bold text-gray-600 mb-2">{{ totalQuestions }}</div>
                <div class="text-sm font-medium text-gray-800">Total Questions</div>
              </div>
            </div>
            
            <div class="text-center">
              <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                <div class="text-3xl font-bold text-purple-600 mb-2">{{ Math.floor(timeTaken / 60) }}:{{ String(timeTaken % 60).padStart(2, '0') }}</div>
                <div class="text-sm font-medium text-purple-800">Time Taken</div>
              </div>
            </div>
          </div>

          <!-- Performance message -->
          <div class="text-center mb-8">
            <div :class="[
              'inline-block px-8 py-4 rounded-2xl font-semibold text-lg',
              finalScore >= 90 ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' :
              finalScore >= 70 ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200' :
              finalScore >= 50 ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 border border-orange-200' :
              'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200'
            ]">
              {{ getPerformanceMessage() }}
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="bg-gray-50 px-8 py-6 border-t flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="restartQuiz"
            class="flex items-center justify-center px-8 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Retake Quiz
          </button>
          
          <button
            @click="shareResults"
            class="flex items-center justify-center px-8 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
            </svg>
            Share Results
          </button>
        </div>
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
const selectedAnswer = ref([])
const answerSubmitted = ref(false)
const questions = ref([])
const answers = ref([])
const quizStartTime = ref(null)
const timeTaken = ref(0)

// Computed properties
const totalQuestions = computed(() => questions.value.length)
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || {});
const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions.value - 1)
const correctAnswers = computed(() =>
  answers.value.filter(answer => answer.isCorrect)
)
const finalScore = computed(() => 
  totalQuestions.value > 0 ? (correctAnswers.value.length / totalQuestions.value) * 100 : 0
)
const isCorrect = computed(() => {
  if (!currentQuestion.value || !currentQuestion.value.answer) {
    return false;
  }
  
  // Backend returns answer as array of indices
  const correctIndices = currentQuestion.value.answer;
  
  // Convert selected answers (text) to indices
  const selectedIndices = selectedAnswer.value.map(selectedText => 
    currentQuestion.value.options.indexOf(selectedText)
  ).filter(index => index !== -1); // Remove any invalid indices
  
  // Check if question is multiple choice
  const isMultiple = currentQuestion.value.is_multiple;
  
  if (isMultiple) {
    // For multiple choice: all selected indices must match all correct indices
    return selectedIndices.length === correctIndices.length &&
           selectedIndices.every(index => correctIndices.includes(index)) &&
           correctIndices.every(index => selectedIndices.includes(index));
  } else {
    // For single choice: selected index must match the correct index
    return selectedIndices.length === 1 &&
           correctIndices.includes(selectedIndices[0]);
  }
});

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
  } catch (error) {
    console.error('Error starting quiz:', error)
  } finally {
    isLoading.value = false
  }
}

function getOptionClass(option) {
  if (!answerSubmitted.value) {
    // For both single and multiple choice questions - enhanced styling
    return Array.isArray(selectedAnswer.value) && selectedAnswer.value.includes(option)
      ? 'bg-gradient-to-r from-blue-100 to-blue-200 border-blue-400 shadow-md'
      : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50 hover:shadow-sm'
  }
  
  // Get correct indices from backend's 'answer' field
  const correctIndices = currentQuestion.value.answer;
  const optionIndex = currentQuestion.value.options.indexOf(option);
  
  // Show feedback after submission with enhanced styling
  if (correctIndices.includes(optionIndex)) {
    // This option is correct (by index)
    return 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-400 text-green-800 shadow-md'
  } else if (Array.isArray(selectedAnswer.value) && selectedAnswer.value.includes(option)) {
    // This option was selected but is incorrect
    return 'bg-gradient-to-r from-red-100 to-rose-100 border-red-400 text-red-800 shadow-md'
  } else {
    // This option was not selected
    return 'border-gray-300 bg-gray-50 text-gray-500'
  }
}

function getPerformanceMessage() {
  if (finalScore.value >= 90) {
    return '🏆 Outstanding! You have mastered this topic!'
  } else if (finalScore.value >= 80) {
    return '🌟 Excellent work! You have a strong understanding.'
  } else if (finalScore.value >= 70) {
    return '👍 Good job! Consider reviewing the topics you missed.'
  } else if (finalScore.value >= 50) {
    return '📚 Keep studying! You\'re on the right track.'
  } else {
    return '💪 Keep practicing! Focus on the fundamentals and try again.'
  }
}

function selectAnswer(answer) {
  if (!answerSubmitted.value) {
    const isMultiple = currentQuestion.value.is_multiple;
    
    if (!isMultiple) {
      // Single choice - replace selection
      selectedAnswer.value = [answer]
    } else {
      // Multiple choice - toggle selection
      if (!Array.isArray(selectedAnswer.value)) {
        selectedAnswer.value = []
      }
      if (selectedAnswer.value.includes(answer)) {
        selectedAnswer.value = selectedAnswer.value.filter(a => a !== answer)
      } else {
        selectedAnswer.value = [...selectedAnswer.value, answer]
      }
    }
  }
}

function submitAnswer() {
  if (selectedAnswer.value && selectedAnswer.value.length > 0 && !answerSubmitted.value) {
    answerSubmitted.value = true
    
    const currentAnswer = {
      question: currentQuestion.value,
      selected: selectedAnswer.value,
      isCorrect: isCorrect.value
    }
    answers.value[currentQuestionIndex.value] = currentAnswer
  }
}

function previousQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    const previousAnswer = answers.value[currentQuestionIndex.value]
    selectedAnswer.value = previousAnswer?.selected || []
    answerSubmitted.value = !!previousAnswer
  }
}

function nextQuestion() {
  if (!answerSubmitted.value && selectedAnswer.value && selectedAnswer.value.length > 0) {
    submitAnswer()
  }
  
  if (answerSubmitted.value) {
    if (isLastQuestion.value) {
      finishQuiz()
    } else {
      currentQuestionIndex.value++
      const nextAnswer = answers.value[currentQuestionIndex.value]
      selectedAnswer.value = nextAnswer?.selected || []
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
          selected: [],
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
  try {
    // Reset all quiz state
    currentQuestionIndex.value = 0
    selectedAnswer.value = []
    answerSubmitted.value = false
    answers.value = []
    quizComplete.value = false
    quizStarted.value = false
    timeTaken.value = 0
    
    // Restart the quiz
    startQuiz()
  } catch (error) {
    handleError(error)
  }
}

function shareResults() {
  try {
    const shareText = `I just scored ${Math.round(finalScore.value)}% on the ${props.topic.title} quiz! 🎯 ${correctAnswers.value.length}/${totalQuestions.value} correct answers.`
    
    if (navigator.share) {
      navigator.share({
        title: `QuizSphere - ${props.topic.title} Results`,
        text: shareText,
        url: window.location.href
      })
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Results copied to clipboard!')
      }).catch(() => {
        // Fallback if clipboard API fails
        const textArea = document.createElement('textarea')
        textArea.value = shareText
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        alert('Results copied to clipboard!')
      })
    }
  } catch (error) {
    console.warn('Could not share results:', error)
    handleError(new Error('Could not share results'))
  }
}

// ...existing methods continue...
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