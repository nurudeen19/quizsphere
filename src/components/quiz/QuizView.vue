# Vue Quiz View Component
<template>
  <div class="quiz-container">
    <header class="mb-6">
      <h1 class="text-3xl font-bold text-blue-800">{{ topic.title }}</h1>
      <p class="text-gray-600 mt-2">{{ topic.description }}</p>
    </header>

    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-pulse text-blue-600">Loading questions...</div>
    </div>

    <div v-else-if="!quizStarted" class="quiz-intro bg-white rounded-lg shadow-lg p-6">
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-3">Quiz Settings</h2>
        <div class="grid gap-4">
          <div class="form-group">
            <label class="block text-gray-700 text-sm font-medium mb-1">
              Questions per Chapter
            </label>
            <input
              type="number"
              v-model="localSettings.questionsPerChapter"
              min="1"
              :max="maxQuestionsPerChapter"
              class="form-input mt-1 block w-full rounded-md border-gray-300"
            >
          </div>
          <div class="form-group">
            <label class="block text-gray-700 text-sm font-medium mb-1">
              Time per Question (seconds)
            </label>
            <input
              type="number"
              v-model="localSettings.timePerQuestion"
              min="10"
              max="300"
              class="form-input mt-1 block w-full rounded-md border-gray-300"
            >
          </div>
          <div class="form-group">
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                v-model="localSettings.showTimer"
                class="form-checkbox"
              >
              <span class="text-gray-700 text-sm font-medium">Show Timer</span>
            </label>
          </div>
        </div>
      </div>
      <button
        @click="startQuiz"
        class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Start Quiz
      </button>
    </div>

    <div v-else>
      <div v-if="!quizComplete" class="quiz-progress bg-white rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <div class="text-gray-600">
            Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}
          </div>
          <Timer
            v-if="localSettings.showTimer"
            :duration="localSettings.timePerQuestion / 60"
            :running="true"
            @timeout="handleTimeout"
          />
        </div>

        <div class="question-container">
          <div class="markdown prose max-w-none mb-4" v-html="currentQuestion.question"></div>
          <div class="grid gap-3">
            <button
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              @click="selectAnswer(option)"
              :class="[
                'text-left p-3 rounded-lg border transition-colors',
                selectedAnswer === option
                  ? 'bg-blue-100 border-blue-500'
                  : 'border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ option }}
            </button>
          </div>
        </div>

        <div class="mt-6 flex justify-between">
          <button
            @click="previousQuestion"
            :disabled="currentQuestionIndex === 0"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            @click="nextQuestion"
            :disabled="!selectedAnswer"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ isLastQuestion ? 'Finish' : 'Next' }}
          </button>
        </div>
      </div>

      <div v-else class="quiz-summary bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-bold text-blue-800 mb-4">Quiz Complete!</h2>
        <div class="stats grid gap-4 mb-6">
          <div class="stat bg-gray-50 p-4 rounded-lg">
            <div class="text-sm text-gray-600">Score</div>
            <div class="text-2xl font-bold text-blue-600">
              {{ Math.round((correctAnswers.length / totalQuestions) * 100) }}%
            </div>
          </div>
          <div class="stat bg-gray-50 p-4 rounded-lg">
            <div class="text-sm text-gray-600">Correct Answers</div>
            <div class="text-2xl font-bold text-green-600">
              {{ correctAnswers.length }} / {{ totalQuestions }}
            </div>
          </div>
        </div>

        <button
          @click="restartQuiz"
          class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Restart Quiz
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, inject } from 'vue'
import { marked } from 'marked'
import Timer from './ui/Timer.vue'

const handleError = inject('handleError')

const props = defineProps({
  topic: {
    type: Object,
    required: true
  },
  settings: {
    type: Object,
    default: () => ({
      questionsPerChapter: 10,
      timePerQuestion: 60,
      showTimer: true
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
const questions = ref([])
const answers = ref([])
const localSettings = ref({ ...props.settings })

// Computed properties
const maxQuestionsPerChapter = computed(() => {
  return Math.min(
    props.topic.questions_count,
    parseInt(props.topic.max_questions_per_chapter || 25)
  )
})

const totalQuestions = computed(() => questions.value.length)
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions.value - 1)
const correctAnswers = computed(() =>
  answers.value.filter(answer => answer.isCorrect)
)

// Methods
async function startQuiz() {
  isLoading.value = true
  try {
    questions.value = await generateQuestions()
    quizStarted.value = true
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false
  }
}

async function generateQuestions() {
  try {
    // For now, return some sample questions to test the component
    // In a real implementation, this would fetch questions from the API
    const sampleQuestions = [
      {
        id: 1,
        question: "What is the primary purpose of containerization in modern software development?",
        options: [
          "To make applications run faster",
          "To package applications with their dependencies for consistent deployment",
          "To reduce the size of application files",
          "To automatically scale applications"
        ],
        correct: "To package applications with their dependencies for consistent deployment",
        difficulty: "Intermediate"
      },
      {
        id: 2,
        question: "Which command is used to create a new Docker container from an image?",
        options: [
          "docker build",
          "docker create",
          "docker run",
          "docker start"
        ],
        correct: "docker run",
        difficulty: "Beginner"
      },
      {
        id: 3,
        question: "What is the difference between a Docker image and a Docker container?",
        options: [
          "Images are running instances, containers are templates",
          "Images are templates, containers are running instances",
          "There is no difference",
          "Images are smaller than containers"
        ],
        correct: "Images are templates, containers are running instances",
        difficulty: "Intermediate"
      }
    ]

    // Return a subset based on settings
    const questionCount = Math.min(localSettings.value.questionsPerChapter || 10, sampleQuestions.length)
    return sampleQuestions.slice(0, questionCount)
    
    // TODO: Replace with actual API call
    // const response = await fetchQuestionsForTopic(props.topic.topic_key, {
    //   count: localSettings.value.questionsPerChapter,
    //   difficulty: localSettings.value.difficulty
    // })
    // return response.data
  } catch (error) {
    console.error('Error generating questions:', error)
    throw new Error('Failed to load quiz questions. Please try again.')
  }
}

function selectAnswer(answer) {
  selectedAnswer.value = answer
}

function previousQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    selectedAnswer.value = answers.value[currentQuestionIndex.value]?.selected
  }
}

function nextQuestion() {
  if (selectedAnswer.value) {
    const currentAnswer = {
      question: currentQuestion.value,
      selected: selectedAnswer.value,
      isCorrect: selectedAnswer.value === currentQuestion.value.correct
    }
    answers.value[currentQuestionIndex.value] = currentAnswer

    if (isLastQuestion.value) {
      finishQuiz()
    } else {
      currentQuestionIndex.value++
      selectedAnswer.value = answers.value[currentQuestionIndex.value]?.selected
    }
  }
}

function handleTimeout() {
  try {
    nextQuestion()
  } catch (error) {
    handleError(error)
  }
}

function finishQuiz() {
  try {
    quizComplete.value = true
    const score = (correctAnswers.value.length / totalQuestions.value) * 100
    
    emit('complete', {
      topic: props.topic.topic,
      score: score,
      totalQuestions: totalQuestions.value,
      correctAnswers: correctAnswers.value.length,
      answers: answers.value,
      settings: localSettings.value,
      timeTaken: 0 // TODO: Add actual time tracking
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
  questions.value = []
  answers.value = []
}
</script>

<style scoped>
.form-input {
  display: block;
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid #D1D5DB;
  padding: 0.5rem 0.75rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-input:focus {
  border-color: #3B82F6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  outline: none;
}

.form-checkbox {
  border-radius: 0.25rem;
  border: 1px solid #D1D5DB;
  color: #2563EB;
  width: 1rem;
  height: 1rem;
}

.form-checkbox:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  outline: none;
}

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
</style>
