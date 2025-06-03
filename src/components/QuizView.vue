<template>
  <div v-if="questions.length" class="quiz">
    <h2><i class="fas fa-brain"></i> {{ topicTitle }}</h2>
    <div class="text-sm text-blue-900 mb-2 font-bold tracking-wide">
      <div class="chapter-info">
        Chapter {{ chapter + 1 }} of {{ Math.ceil(questionsData.length / CHAPTER_SIZE) || 1 }}
      </div>
    </div>
    <!-- Animated Progress Bar -->
    <div class="w-full bg-gray-200 rounded-full h-5 mb-6 overflow-hidden shadow-inner">
      <div
        class="progress-bar"
        :style="{ width: ((current + 0) / questions.length * 100) + '%' }"
      >
        <span class="sr-only">Progress</span>
      </div>
    </div>
    <!-- End Progress Bar -->
    <div v-if="isQuizActive">
      <div class="question">
        <span class="progress">Question {{ current + 1 }} of {{ questions.length }}</span>
        <p class="question-text">{{ questions[current].q }}</p>
      </div>
      <form class="options" @submit.prevent="submitOptions">
        <div v-for="(opt, idx) in questions[current].options" :key="idx" class="option-row">
          <input
            v-if="questions[current].answers.length === 1"
            type="radio"
            :name="'option' + current"
            :id="'option-' + idx"
            :value="idx"
            v-model="selectedOptions"
            :disabled="answered"
            class="mr-3 accent-cyan-500 w-5 h-5"
          />
          <input
            v-else
            type="checkbox"
            :id="'option-' + idx"
            :value="idx"
            v-model="selectedOptions"
            :disabled="answered"
            class="mr-3 accent-cyan-500 w-5 h-5"
          />
          <label :for="'option-' + idx" class="flex-1 cursor-pointer text-base font-medium flex items-center gap-2">
            {{ opt }}
          </label>
        </div>
        <button v-if="!answered" type="submit" class="next-btn mt-4"><i class="fas fa-check"></i> Submit</button>
      </form>
      <transition name="fade">
        <div v-if="answered" class="feedback min-h-[120px] flex flex-col items-center justify-center">
          <p :class="{ correct: isCorrect, wrong: !isCorrect }">
            <i :class="isCorrect ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
            {{ isCorrect ? 'Correct!' : 'Wrong!' }}
          </p>
          <transition name="fade">
            <button v-if="showNextBtn" class="next-btn rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 transition-all text-2xl tracking-wide drop-shadow-md border-0 cursor-pointer" style="background: linear-gradient(90deg, #06b6d4 0%, #2563eb 100%); color: #fff; min-width: 180px; min-height: 52px;" @click="handleNext">
              <i class="fas fa-arrow-right text-2xl pr-4"></i>
              <span>Next</span>
            </button>
          </transition>
        </div>
      </transition>
    </div>
    <div v-else class="quiz-complete">
      <template v-if="isFinalChapter() && isAllChaptersComplete()">
        <div class="congrats-section flex flex-col items-center justify-center">
          <h3>
            <i class="fas fa-trophy"></i>
            🎉 Congratulations! 🎉
          </h3>
          <div class="confetti-wrapper relative w-full flex justify-center items-center mb-8" style="height: 100px;">
            <div class="confetti"></div>
            <div class="confetti"></div>
            <div class="confetti"></div>
            <div class="confetti"></div>
            <div class="confetti"></div>
          </div>
          <div class="text-2xl text-blue-800 font-bold mb-6 text-center leading-snug">
            You have completed all chapters for <span class="font-extrabold underline decoration-green-400">{{ topicTitle }}</span>.<br>
            <span class="block mt-2 text-xl text-blue-700 font-semibold">Thank you for putting in the effort to finish the entire set!</span>
          </div>
        </div>
      </template>
      <template v-else>
        <h3>
          <i class="fas fa-trophy"></i>
          Chapter Complete!
        </h3>
      </template>
      <div class="chapter-stats mb-4 w-full flex justify-center">
        <table class="w-auto min-w-[320px] text-base border-collapse bg-white rounded-lg shadow-md">
          <tbody>
            <tr v-for="n in chapter + 1" :key="n" class="bg-blue-50 rounded-lg">
                <th class="py-2 px-4 font-semibold text-blue-700 whitespace-nowrap text-left bg-blue-100 rounded-l-lg">
                  Chapter {{ n }} Score
                </th>
                <td class="py-2 px-4 text-cyan-500 font-bold text-left bg-white rounded-r-lg">
                  {{ (n - 1) === chapter ? score : (chapterStates[n-1]?.score ?? 0) }} / {{ (n - 1) === chapter ? questions.length : (chapterStates[n-1]?.total ?? questions.length) }}
                </td>
              </tr>
            <tr>
              <td colspan="4" class="py-1"><hr class="border-t-2 border-gray-200 my-1"></td>
            </tr>
            <tr>
              <th class="py-2 px-4 font-semibold text-blue-700 whitespace-nowrap text-left">Overall</th>
              <td class="py-2 px-4 text-blue-600 font-bold text-left" colspan="3">
                <span v-if="!isAllChaptersComplete()">{{ getOverallScore().score }}</span>
                <span v-else>{{ getOverallScore().score }} / {{ getOverallScore().total }}</span>
              </td>
            </tr>
            <tr>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="w-full flex flex-row justify-center items-center mt-4 gap-2">
        <button @click="restartChapter" class="next-btn flex items-center justify-center h-[40px] px-3 py-1 rounded-full bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold shadow-lg hover:from-pink-500 hover:to-red-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 transition-all tracking-wide drop-shadow-md border-0 cursor-pointer" style="font-size:unset;background: linear-gradient(90deg, #f43f5e 0%, #ec4899 100%); color: #fff; min-width: 120px; min-height: 32px;">
          <i class="fas fa-undo text-base pr-1"></i>
          <span>Restart Chapter</span>
        </button>
        <button
          v-if="questions.length === CHAPTER_SIZE && !isFinalChapter()"
          @click="goToNextChapter"
          class="next-btn flex items-center justify-center h-[40px] px-3 py-1 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold shadow-lg hover:from-blue-500 hover:to-green-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 transition-all tracking-wide drop-shadow-md border-0 cursor-pointer"
          style="font-size:unset;background: linear-gradient(90deg, #22c55e 0%, #2563eb 100%); color: #fff; min-width: 120px; min-height: 32px;">
          <i class="fas fa-arrow-right text-base pr-1"></i>
          <span>Continue to Next Chapter</span>
        </button>
        <button
          v-if="questions.length === CHAPTER_SIZE && isFinalChapter()"
          @click="startFresh"
          class="next-btn flex items-center justify-center h-[40px] px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-700 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 transition-all tracking-wide drop-shadow-md border-0 cursor-pointer"
          style="font-size:unset;background: linear-gradient(90deg, #06b6d4 0%, #1e40af 100%); color: #fff; min-width: 120px; min-height: 32px;">
          <i class="fas fa-redo text-base pr-1"></i>
          <span>Start Fresh</span>
        </button>
      </div>
    </div>
  </div>
  <div v-else class="no-questions-message text-center py-12 text-lg text-gray-600">
    <i class="fas fa-exclamation-circle text-3xl text-yellow-400 mb-4"></i>
    <div>No valid questions available for this topic. Please check back later.</div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import { getQuizQuestionsPage, PAGE_SIZE } from '../quiz/quiz-utils.js'

const props = defineProps({
  topic: Object
})

const isQuizActive = computed(() => {
  // If the current chapter is completed but the next chapter hasn't started, show chapter complete page
  const chapters = chapterStates.value;
  const currentCompleted = chapters[chapter.value]?.completed;
  const nextStarted = chapters[chapter.value + 1]?.score > 0 || chapters[chapter.value + 1]?.completed;
  // Quiz is active if not completed, or if next chapter has started
  return (current.value < questions.value.length && !currentCompleted) || nextStarted;
})

const questions = ref([])
const current = ref(0)
const score = ref(0)
const answered = ref(false)
const isCorrect = ref(false)
const topicTitle = ref('')
const selectedOptions = ref([])
const CHAPTER_SIZE = PAGE_SIZE
const chapter = ref(0)
const showNextBtn = ref(true)
const chapterStates = ref({})
const questionsData = ref([])

const getQuizStateKey = (topicKey) => `quizsphere-quiz-state-${topicKey}`
const getChaptersKey = (topicKey) => `quizsphere-chapter-states-${topicKey}`

function getChapterQuestions(chapterNum) {
  if (!questionsData.value.length) return []
  return getQuizQuestionsPage(questionsData.value, chapterNum, CHAPTER_SIZE)
}

function saveQuizState() {
  const topicKey = props.topic?.topic
  const state = {
    topic: topicKey,
    chapter: chapter.value,
    current: current.value,
    score: score.value,
    answered: answered.value,
    isCorrect: isCorrect.value,
    selectedOptions: selectedOptions.value,
    questions: questions.value
  }
  localStorage.setItem(getQuizStateKey(topicKey), JSON.stringify(state))
  // Save per-chapter state
  let chapters = JSON.parse(localStorage.getItem(getChaptersKey(topicKey)) || '{}')
  chapters[chapter.value] = {
    score: score.value,
    total: questions.value.length,
    completed: current.value >= questions.value.length
  }
  localStorage.setItem(getChaptersKey(topicKey), JSON.stringify(chapters))
  chapterStates.value = chapters
}

function loadQuizState() {
  const topicKey = props.topic?.topic
  const stateStr = localStorage.getItem(getQuizStateKey(topicKey))
  let chapters = JSON.parse(localStorage.getItem(getChaptersKey(topicKey)) || '{}')
  chapterStates.value = chapters
  if (!stateStr) return false
  try {
    const state = JSON.parse(stateStr)
    if (state.topic === topicKey) {
      chapter.value = state.chapter || 0
      current.value = state.current
      score.value = state.score
      answered.value = state.answered
      isCorrect.value = state.isCorrect
      selectedOptions.value = state.selectedOptions
      questions.value = state.questions
      return true
    }
  } catch {}
  return false
}

watch(() => props.topic, async (newTopic) => {
  if (newTopic && newTopic.topic) {
    topicTitle.value = newTopic.title
    let data = []
    // Use the file path from the topic object
    if (newTopic.file) {
      const res = await fetch(newTopic.file)
      data = await res.json()
    }
    // Filter out malformed/incomplete questions
    data = data.filter(q => q && q.q && Array.isArray(q.options) && Array.isArray(q.answers))
    questionsData.value = data
    // Try to load state, otherwise start fresh
    if (!loadQuizState()) {
      chapter.value = 0
      questions.value = getChapterQuestions(0)
      console.log('Loaded questions:', questions.value)
      current.value = 0
      score.value = 0
      answered.value = false
      selectedOptions.value = []
      // Load chapter states
      let chapters = JSON.parse(localStorage.getItem(getChaptersKey(newTopic.topic)) || '{}')
      chapterStates.value = chapters
    } else {
      // If state loaded, ensure questions.value is not empty
      if (!questions.value.length) {
        questions.value = getChapterQuestions(chapter.value)
        console.log('Loaded questions:', questions.value)
      }
    }
  }
}, { immediate: true })

watch([chapter, current, score, answered, isCorrect, selectedOptions], saveQuizState)

function submitOptions() {
  answered.value = true
  const correctAnswers = questions.value[current.value].answers
  if (correctAnswers.length === 1) {
    isCorrect.value = Number(selectedOptions.value) === correctAnswers[0]
  } else {
    // compare arrays (order-insensitive)
    const selected = selectedOptions.value.map(Number).sort()
    const correct = Array.from(correctAnswers).map(Number).sort()
    isCorrect.value = selected.length === correct.length && selected.every((v, i) => v === correct[i])
  }
  if (isCorrect.value) score.value++
}
function next() {
  current.value++
  answered.value = false
  selectedOptions.value = []
}

function getOverallScore() {
  let chapters = chapterStates.value
  let total = 0, scoreSum = 0
  for (const ch in chapters) {
    total += chapters[ch].total || 0
    scoreSum += chapters[ch].score || 0
  }
  // Add current chapter if not completed
  if (!chapters[chapter.value]) {
    total += questions.value.length
    scoreSum += score.value
  }
  return { score: scoreSum, total }
}

function getLastCompletedChapter() {
  let chapters = chapterStates.value
  let last = -1
  for (const ch in chapters) {
    if (chapters[ch].completed && Number(ch) > last) last = Number(ch)
  }
  return last
}

function showChapterComplete() {
  // Show chapter complete if current is past end, or if last completed chapter is not the current, or if chapter is completed but next not started
  const chapters = chapterStates.value;
  const lastCompleted = getLastCompletedChapter();
  const currentCompleted = chapters[chapter.value]?.completed;
  const nextStarted = chapters[chapter.value + 1]?.score > 0 || chapters[chapter.value + 1]?.completed;
  return (
    current.value >= questions.value.length ||
    (lastCompleted >= 0 && lastCompleted === chapter.value) ||
    (currentCompleted && !nextStarted)
  );
}

function goToNextChapter() {
  // Save current chapter score as completed
  let chapters = { ...chapterStates.value }
  chapters[chapter.value] = {
    score: score.value,
    total: questions.value.length,
    completed: true
  }
  chapterStates.value = chapters
  saveQuizState()
  chapter.value++
  questions.value = getChapterQuestions(chapter.value)
  current.value = 0
  answered.value = false
  selectedOptions.value = []
  isCorrect.value = false
  score.value = 0
}

function handleNext() {
  showNextBtn.value = false
  setTimeout(() => {
    next()
    nextTick(() => {
      showNextBtn.value = true
    })
  }, 250) // matches fade transition duration
}

function restartChapter() {
  questions.value = getChapterQuestions(chapter.value)
  current.value = 0
  score.value = 0 // Reset score for this chapter
  answered.value = false
  selectedOptions.value = []
  isCorrect.value = false
  showNextBtn.value = true
  // Remove chapter score from chapterStates
  let chapters = { ...chapterStates.value }
  if (chapters[chapter.value]) {
    chapters[chapter.value].score = 0
    chapters[chapter.value].completed = false
  }
  chapterStates.value = chapters
  saveQuizState()
}

function isAllChaptersComplete() {
  const totalChapters = Math.ceil(questionsData.value.length / CHAPTER_SIZE) || 1;
  let chapters = chapterStates.value;
  let complete = 0;
  for (let i = 0; i < totalChapters; i++) {
    if (chapters[i]?.completed) complete++;
  }
  return complete === totalChapters;
}

function isFinalChapter() {
  const totalChapters = Math.ceil(questionsData.value.length / CHAPTER_SIZE) || 1;
  return chapter.value === totalChapters - 1;
}

function startFresh() {
  // Clear all quiz and chapter state for this topic
  const topicKey = props.topic?.topic;
  localStorage.removeItem(getQuizStateKey(topicKey));
  localStorage.removeItem(getChaptersKey(topicKey));
  chapter.value = 0;
  questions.value = getChapterQuestions(0);
  current.value = 0;
  score.value = 0;
  answered.value = false;
  isCorrect.value = false;
  selectedOptions.value = [];
  chapterStates.value = {};
  // Optionally, scroll to top or focus first question
}
// Remove this watcher to prevent clearing chapter state and quiz state on chapter completion
</script>
