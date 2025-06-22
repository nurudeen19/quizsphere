<template>
  <div v-if="loading" class="quiz-loading flex flex-col items-center justify-center py-12">
    <div class="loader mb-4"></div>
    <div class="text-blue-700 text-lg font-semibold">Loading questions...</div>
  </div>
  <div v-else-if="errorMessage" class="quiz-error text-center py-12 text-lg text-red-600">
    <i class="fas fa-exclamation-triangle text-3xl mb-4"></i>
    <div>{{ errorMessage }}</div>
  </div>
  <div v-else-if="questions.length" class="quiz">
    <h2><i class="fas fa-brain"></i> {{ topicTitle }}</h2>
    <div class="text-sm text-blue-900 mb-2 font-bold tracking-wide">
      <div class="chapter-info">
        Chapter {{ chapter + 1 }} of {{ Math.ceil(totalQuestions / CHAPTER_SIZE) || 1 }}
      </div>
    </div>
    <!-- Timer & Resume Message Area (width-stable) -->
    <div class="timer-area w-full flex flex-col items-center justify-center mb-4" style="min-width:340px; max-width:420px; margin:0 auto; position:relative;">
      <!-- Ghost message to reserve width -->
      <div aria-hidden="true" class="timer-resume-info ghost-message opacity-0 pointer-events-none absolute top-0 left-0 w-full" style="visibility:hidden;">
        <i class="fas fa-info-circle"></i>
        You are continuing a timed session. Remaining time: 99 min 59 sec.
      </div>
      <!-- Actual resume message -->
      <transition name="fade-slow">
        <div v-if="timerResumeInfo" class="timer-resume-info bg-blue-100 border-l-4 border-blue-500 text-blue-900 px-4 py-2 rounded shadow mb-2 text-base font-semibold flex items-center gap-2 w-full justify-center">
          <i class="fas fa-info-circle"></i>
          {{ timerResumeInfo }}
        </div>
      </transition>
      <!-- Timer Component -->
      <div v-if="timerEnabled" class="flex justify-center w-full">
        <Timer
          :key="timerKey"
          :duration="timerMinutes"
          :auto-terminate="timerAutoTerminate"
          :allow-negative="timerAllowNegative"
          :running="timerRunning"
          :resume-seconds="timerResumeSeconds"
          :display-seconds="timerDisplaySeconds"
          :hide="!isQuizActive"
          @timeout="handleTimerTimeout"
          @tick="handleTimerTick"
          aria-label="Quiz timer"
        />
      </div>
    </div>
    <!-- End Timer & Resume Message Area -->
    <!-- Animated Progress Bar -->    <div class="w-full max-w-[700px] mx-auto bg-gray-200 rounded-full h-5 mb-4 overflow-hidden shadow-inner" role="progressbar" :aria-valuenow="((current + 0) / questions.length * 100)" aria-valuemin="0" :aria-valuemax="questions.length" tabindex="0">
      <div
        class="progress-bar transition-all duration-500"
        :style="{ width: ((current + 0) / questions.length * 100) + '%' }"
      >
        <span class="sr-only">Progress: {{ current + 1 }} of {{ questions.length }}</span>
      </div>
    </div>    <!-- End Progress Bar -->    <div v-if="isQuizActive" class="w-full">
      <div class="question">
        <span class="progress">Question {{ current + 1 }} of {{ questions.length }}</span>
        <div class="question-container">
          <div class="question-text" v-html="renderedQuestion"></div>
        </div>
      </div>      <form class="options w-full mx-auto" @submit.prevent="submitOptions">
        <fieldset :aria-labelledby="'question-' + current" class="w-full border-0 p-0 m-0">
          <legend :id="'question-' + current" class="sr-only">Question {{ current + 1 }}</legend>
          <div v-for="(opt, idx) in questions[current].options" :key="idx" class="option-row flex items-start text-left">
            <input
              v-if="questions[current].answer.length === 1"
              type="radio"
              :name="'option' + current"
              :id="'option-' + idx"
              :value="idx"
              v-model="selectedOptions"
              :disabled="answered"
              class="mr-3 accent-cyan-500 w-5 h-5 focus:ring-2 focus:ring-cyan-400"
              :aria-checked="selectedOptions == idx"
              :tabindex="answered ? -1 : 0"
              :aria-label="'Option ' + (idx + 1) + ': ' + opt"
            />
            <input
              v-else
              type="checkbox"
              :id="'option-' + idx"
              :value="idx"
              v-model="selectedOptions"
              :disabled="answered"
              class="mr-3 accent-cyan-500 w-5 h-5 focus:ring-2 focus:ring-cyan-400"
              :aria-checked="selectedOptions.includes(idx)"
              :tabindex="answered ? -1 : 0"
              :aria-label="'Option ' + (idx + 1) + ': ' + opt"
            />
            <label :for="'option-' + idx" class="flex-1 cursor-pointer text-base font-medium flex items-center gap-2 text-left">
              {{ opt }}
            </label>
          </div>
        </fieldset>
        <transition name="fade-slow">
          <div v-if="showSelectionWarning" class="selection-warning bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 px-4 py-2 rounded shadow my-2 text-base font-semibold flex items-center gap-2">
            <i class="fas fa-exclamation-triangle"></i>
            Please select at least one option before submitting your answer.
          </div>
        </transition>
        <section class="quiz-action-area min-h-[160px] w-full max-w-2xl px-2 transition-[min-width,min-height] duration-500 flex flex-col items-center justify-center relative text-center mx-auto">
          <div style="width:100%">
            <transition name="fade-slow" mode="out-in">
              <div v-if="!answered && !transitioning" key="submit" class="quiz-action-sub">
                <button type="submit" class="next-btn mt-4"><i class="fas fa-check"></i> Submit</button>
              </div>
              <div v-else key="feedback" class="quiz-action-sub">
                <div class="feedback flex flex-col items-center justify-center w-full" aria-live="polite">
                  <div class="feedback-content w-full flex flex-col items-center">
                    <p :class="{ correct: isCorrect, wrong: !isCorrect }">
                      <i :class="isCorrect ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                      {{ isCorrect ? 'Correct!' : 'Wrong!' }}
                    </p>                    <div class="explanation-container w-full max-w-[650px] mx-auto">
                      <p v-if="questions[current] && questions[current].explanation" class="explanation mt-3 text-base text-gray-700 bg-blue-50 border-l-4 border-blue-400 px-4 py-2 rounded shadow-sm w-full">
                        <i class="fas fa-info-circle text-blue-400 mr-2"></i>
                        {{ questions[current].explanation }}
                      </p>
                    </div>
                    <button v-if="answered" class="next-btn-wrapper next-btn rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 transition-all text-2xl tracking-wide drop-shadow-md border-0 cursor-pointer mt-4 btn-next" @click="handleNext">
                      <i class="fas fa-arrow-right text-2xl pr-4"></i>
                      <span>Next</span>
                    </button>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </section>
      </form>
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
      <!-- Stats UI from saved overall stats -->      <div class="chapter-stats mb-4 w-full flex justify-center">
        <div class="stats-card bg-gradient-to-br from-blue-50 via-cyan-50 to-white rounded-3xl shadow-2xl border-2 border-blue-100 p-6 w-full max-w-xl animate-fade-in" style="min-width: 340px;">
          <h4 class="text-2xl font-extrabold text-blue-800 mb-4 flex items-center gap-2">
            <i class="fas fa-chart-bar text-cyan-500"></i> Chapter & Overall Stats
          </h4>
          <ul class="divide-y divide-blue-100">            <li v-for="chap in savedCompletedChapters" :key="chap.chapter" class="flex flex-col gap-1 py-3 px-2 bg-gradient-to-r from-cyan-100/60 to-blue-50/60 rounded-xl mb-2 shadow-sm hover:scale-[1.02] transition-transform">
              <div class="flex items-center justify-between w-full">
                <span class="font-semibold text-blue-700 flex items-center gap-2">
                  <i class="fas fa-book-open text-cyan-400"></i> Chapter {{ chap.chapter }}
                </span>
                <span class="font-bold text-cyan-700 text-lg">{{ chap.score }} <span class="text-gray-400">/</span> {{ chap.total }}</span>
              </div>              <!-- Show time used for each completed chapter if available -->
              <div v-if="chap.timeUsed > 0" class="w-full flex justify-end text-sm text-gray-600">
                <span class="flex items-center gap-1">
                  <i class="fas fa-clock text-cyan-400"></i>
                  {{ Math.floor(chap.timeUsed / 60) }}m {{ chap.timeUsed % 60 }}s
                </span>
              </div>
            </li>
          </ul>          <div class="my-4 border-t-2 border-cyan-200"></div>          <!-- Show time used for the just-completed chapter -->          <div v-if="!isQuizActive && timerUsedSeconds > 0" class="flex items-center justify-center px-2 py-2 rounded-xl bg-gradient-to-r from-blue-100/60 to-cyan-50/60 shadow-inner mb-2">
            <span class="font-bold text-blue-900 text-lg flex items-center gap-2">
              <i class="fas fa-clock text-cyan-400"></i> Time used for this chapter:
            </span>
            <span class="font-extrabold text-blue-700 text-xl ml-2">{{ Math.floor(timerUsedSeconds / 60) }}m {{ timerUsedSeconds % 60 }}s</span>
          </div>
          
          <!-- Display time used for the current chapter when timer is enabled but not active (chapter complete) -->          <div v-else-if="timerEnabled && !isQuizActive && currentChapterTimeUsed > 0" class="flex items-center justify-center px-2 py-2 rounded-xl bg-gradient-to-r from-blue-100/60 to-cyan-50/60 shadow-inner mb-2">
            <span class="font-bold text-blue-900 text-lg flex items-center gap-2">
              <i class="fas fa-clock text-cyan-400"></i> Time used for this chapter:
            </span>
            <span class="font-extrabold text-blue-700 text-xl ml-2">{{ Math.floor(currentChapterTimeUsed / 60) }}m {{ currentChapterTimeUsed % 60 }}s</span>
          </div>
          <div class="flex items-center justify-between px-2 py-2 rounded-xl bg-gradient-to-r from-blue-200/60 to-cyan-100/60 shadow-inner">
            <span class="font-bold text-blue-900 text-lg flex items-center gap-2">
              <i class="fas fa-star text-yellow-400"></i> Overall
            </span>
            <span class="font-extrabold text-blue-700 text-xl">{{ savedOverallStats.totalCorrect }} <span class="text-gray-400">/</span> {{ savedOverallStats.totalQuestions }}</span>
          </div>
          <div class="text-xs text-gray-500 mt-2 text-right">
            ({{ savedCompletedChapters.length }} of {{ savedOverallStats.totalChapters }} chapters completed)
          </div>
        </div>
      </div>
      <div class="w-full flex flex-row justify-center items-center mt-4 gap-2">
        <button @click="restartChapter" class="next-btn flex items-center justify-center h-[40px] px-2 py-1 rounded-full bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold shadow-lg hover:from-pink-500 hover:to-red-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 transition-all tracking-wide drop-shadow-md border-0 cursor-pointer btn-restart">
          <i class="fas fa-undo text-base pr-1"></i>
          <span class="whitespace-nowrap">Restart Chapter</span>
        </button>
        <button
          v-if="questions.length === CHAPTER_SIZE && !isFinalChapter()"
          @click="goToNextChapter"
          class="next-btn flex items-center justify-center h-[40px] px-2 py-1 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold shadow-lg hover:from-blue-500 hover:to-green-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 transition-all tracking-wide drop-shadow-md border-0 cursor-pointer btn-continue"
        >
          <i class="fas fa-arrow-right text-base pr-1"></i>
          <span class="whitespace-nowrap">Continue to Next Chapter</span>
        </button>
        <button
          v-if="questions.length === CHAPTER_SIZE && isFinalChapter()"
          @click="startFresh"
          class="next-btn flex items-center justify-center h-[40px] px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-700 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 transition-all tracking-wide drop-shadow-md border-0 cursor-pointer btn-fresh"
        >
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
  <!-- User-friendly message box for selection warning -->
</template>

<script setup>
import { ref, watch, nextTick, computed, onMounted, defineEmits } from 'vue'
import { PAGE_SIZE, fetchQuestions, getPageSize, getUserSettings } from '../quiz/quiz-utils.js'
import Timer from './Timer.vue'
import confetti from 'canvas-confetti'
import { renderMarkdown } from '../quiz/markdown.js'

const props = defineProps({
  topic: Object,
  userSettings: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['back'])

const questions = ref([])
const current = ref(0)
const answered = ref(false)
const isCorrect = ref(false)
const topicTitle = ref('')
const selectedOptions = ref([])
const CHAPTER_SIZE = getPageSize()
const chapter = ref(0)
const showNextBtn = ref(true)
const chapterStates = ref({})
const questionsData = ref([])
const transitioning = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const lastCompletedChapter = ref(null);
const lastCompletedScore = ref(0);
const lastCompletedTotal = ref(0);
const currentChapterScore = ref(0);
const showSelectionWarning = ref(false);
const overallStatsVersion = ref(0)
const skipConfetti = ref(false)

// Get stored settings for proper initialization
const storedSettings = getUserSettings();

// Timer related refs
const timerResumeSeconds = ref(null)
const timerUsedSeconds = ref(0)
const timerEnabled = ref(!!(props.userSettings.enableTimer || storedSettings.enableTimer))
const timerMinutes = ref(props.userSettings.timerMinutes || storedSettings.timerMinutes || 0)
const timerAutoTerminate = ref(!!(props.userSettings.autoTerminate || storedSettings.autoTerminate))
const timerAllowNegative = ref(!!(props.userSettings.allowNegative || storedSettings.allowNegative))
const timerRunning = ref(true)
const timerKey = ref(0) // for resetting timer
let timerTickCounter = 0 // For throttling timer persistence
const timerResumeMessageVisible = ref(false)
let hasShownResumeMessage = false

const quizStarted = ref(false) // Flag to track if user has started the quiz

const CHAPTER_STATE_KEY = (topicKey) => `quizsphere-chapter-state-${topicKey}`;
const OVERALL_STATE_KEY = (topicKey) => `quizsphere-overall-state-${topicKey}`;

function resetStateForChapter() {
  current.value = 0
  currentChapterScore.value = 0
  answered.value = false
  selectedOptions.value = []
  isCorrect.value = false
  showNextBtn.value = true
  transitioning.value = false
  quizStarted.value = false // Reset quiz started flag when resetting state
  
  // Reset timer state but keep user preferences
  timerResumeSeconds.value = null
  timerUsedSeconds.value = 0
  timerRunning.value = true
  // Note: We don't reset timerEnabled here as it should follow user settings
}

watch(() => props.topic, async (newTopic) => {
  if (newTopic && newTopic.topic) {
    topicTitle.value = newTopic.title
    let filePath = ''
    if (newTopic.file) {
      filePath = newTopic.file
    } else if (newTopic.topic) {
      filePath = `${newTopic.topic}.json`
    }
    loading.value = true
    errorMessage.value = ''
    // Load chapter state BEFORE fetching questions so chapter.value is correct
    let loaded = loadChapterState();
    if (!loaded) {
      chapter.value = 0
      resetStateForChapter()
    }    try {
      // Fetch only the current chapter's questions using pagination
      const pagedData = await fetchQuestions(filePath, { page: chapter.value, size: CHAPTER_SIZE })
      questions.value = pagedData
      // Optionally, fetch all questions for stats or total count
      const allData = await fetchQuestions(filePath)
      questionsData.value = allData
      
      if (!loaded) {
        // Only reset state if not loaded from localStorage
        resetStateForChapter()
        // Ensure timer settings are correctly initialized for fresh starts
        initializeTimerSettings()
      } else {
        // If state was loaded, check if this chapter is completed in the overall state
        const overall = loadOverallState();
        const isChapterCompletedInOverall = overall?.chapters?.[chapter.value]?.completed === true;
        
        // If chapter is completed, make sure we're showing the stats page
        if (isChapterCompletedInOverall) {
          console.log(`Topic changed: Chapter ${chapter.value} is completed - showing stats page`);
          current.value = questions.value.length; // Set to end to show stats
          timerRunning.value = false; // Ensure timer isn't running
        }
      }
    } catch (e) {
      questions.value = []
      questionsData.value = []
      errorMessage.value = 'Failed to load question data.'
      // Log the error for debugging
      console.error('Error loading question data:', e)
    } finally {
      loading.value = false
    }
    if (!validateQuestions(questions.value)) {
      questions.value = []
      questionsData.value = []
      errorMessage.value = 'Invalid or corrupt question data.'
      return
    }
  }
}, { immediate: true })

function handleNext() {
  showNextBtn.value = false
  setTimeout(() => {
    next()
    nextTick(() => {
      showNextBtn.value = true
    })
  }, 250)
}

function next() {
  // If this is the last question in the chapter, update global stats
  if (current.value === questions.value.length - 1) {
    saveOverallState();
  }
  current.value++
  answered.value = false
  selectedOptions.value = []
  transitioning.value = false
  isCorrect.value = false // Reset isCorrect when moving to a new question
  // Save state after moving to next question so resume works correctly
  saveChapterState();
  // Remove auto focus on options to prevent default answer selection
  // nextTick(() => {
  //   const firstOption = document.querySelector('.option-row input:not(:disabled)')
  //   if (firstOption) firstOption.focus()
  // })
}

function submitOptions() {
  // Prevent submission if no option is selected
  let submittedOption = selectedOptions.value;
  let noSelection = false;
  if (Array.isArray(submittedOption)) {
    noSelection = submittedOption.length === 0;
  } else {
    noSelection = (submittedOption === undefined || submittedOption === null || submittedOption === '' || isNaN(Number(submittedOption)));
  }
  if (noSelection) {
    showSelectionWarning.value = true;
    setTimeout(() => { showSelectionWarning.value = false; }, 2000);
    return;
  }
  // Log the submitted option for debugging
  //console.log('Submitted option(s):', submittedOption);
  if (answered.value) return; // Prevent double submission
  answered.value = true
  transitioning.value = false
  const correctAnswers = questions.value[current.value].answer
  if (correctAnswers.length === 1) {
    isCorrect.value = Number(submittedOption) === correctAnswers[0]
  } else {
    // compare arrays (order-insensitive)
    const selected = submittedOption.map(Number).sort()
    const correct = Array.from(correctAnswers).map(Number).sort()
    isCorrect.value = selected.length === correct.length && selected.every((v, i) => v === correct[i])
  }  if (isCorrect.value) currentChapterScore.value++
  // Mark that the quiz has been started/interacted with
  quizStarted.value = true
  
  // Create localStorage state on first answer for this topic
  const topicKey = props.topic?.topic;
  const chapterStateKey = CHAPTER_STATE_KEY(topicKey);
  const overallStateKey = OVERALL_STATE_KEY(topicKey);
  if (!localStorage.getItem(chapterStateKey)) {
    saveChapterState();
  }
  if (!localStorage.getItem(overallStateKey)) {
    saveOverallState({ initializing: true });
  }
  // Always update chapter state on each answer
  saveChapterState();
  // Move focus to feedback for accessibility
  nextTick(() => {
    const feedback = document.querySelector('.feedback[aria-live]')
    if (feedback) feedback.focus && feedback.focus()
  })
}

function goToNextChapter() {
  saveChapterState();
  saveOverallState(); // Now this will update chapters and stats
  chapter.value++;
  fetchNextChapterQuestions({ skipCompletionCheck: false });
}

function restartChapter() {
  // Fully reset the current chapter state
  resetStateForChapter();
  
  // Update chapter states reference object
  let chapters = { ...chapterStates.value };
  chapters[chapter.value] = {
    score: 0,
    total: questions.value.length,
    completed: false,
    timeUsed: 0
  };
  chapterStates.value = chapters;
  
  // Update the local chapter state in localStorage
  const topicKey = props.topic?.topic;
  if (!topicKey) return;
  
  // Build a fresh state object with all values reset
  const state = {
    chapter: chapter.value,
    current: 0,
    answered: false,
    isCorrect: false,
    selectedOptions: [],
    score: 0,
    completed: false,
    timerRemaining: timerEnabled.value ? (timerMinutes.value * 60) : null,
    timerUsed: 0
  };
  
  try {
    // Save the reset chapter state to localStorage
    const stateString = JSON.stringify(state);
    localStorage.setItem(CHAPTER_STATE_KEY(topicKey), stateString);
  } catch (e) {
    console.error("Error saving reset chapter state", e);
  }

  // Update the overall state by removing this chapter
  let overall = loadOverallState();
  if (overall && overall.chapters) {
    // Remove the current chapter from the overall chapters
    delete overall.chapters[chapter.value];
    
    // Recompute totalCorrect without the current chapter
    let totalCorrect = 0;
    Object.values(overall.chapters).forEach(chap => {
      if (chap.completed) {
        totalCorrect += chap.score;
      }
    });
    
    // Update overall state values
    overall.totalCorrect = totalCorrect;
    
    // If this was the last chapter and it's now reset, the quiz is no longer complete
    if (overall.completed && chapter.value === overall.totalChapters - 1) {
      overall.completed = false;
    }
    
    // Save the updated overall state
    localStorage.setItem(OVERALL_STATE_KEY(topicKey), JSON.stringify(overall));
    overallStatsVersion.value++ // trigger reactivity
    
    console.log("Chapter reset successfully. Updated overall stats:", overall);
  }
  // Use the updated fetchNextChapterQuestions with skipCompletionCheck=true
  fetchNextChapterQuestions({ skipCompletionCheck: true });
}

async function fetchNextChapterQuestions(options = {}) {
  const { skipCompletionCheck = false } = options;
  
  let filePath = '';
  if (props.topic.file) {
    filePath = props.topic.file;
  } else if (props.topic.topic) {
    filePath = `${props.topic.topic}.json`;
  }
  
  loading.value = true;
  errorMessage.value = '';
  
  try {
    questions.value = await fetchQuestions(filePath, { page: chapter.value, size: CHAPTER_SIZE });
    
    // Skip completion check if this was called from restartChapter
    if (!skipCompletionCheck) {
      // First check if the overall quiz is completed
      const overall = loadOverallState();
      const isOverallCompleted = overall?.completed === true;
      
      // Then check if this specific chapter is marked as completed
      const isChapterCompleted = overall?.chapters?.[chapter.value]?.completed === true;
      
      if (isChapterCompleted || isOverallCompleted) {
        // If chapter or overall quiz was completed, set current to end to show stats page
        console.log(`${isOverallCompleted ? 'Overall quiz' : 'Chapter'} is completed - showing stats page`);
        current.value = questions.value.length;
        timerRunning.value = false;
        
        // Ensure chapterStates reflects this completed status
        let chapters = { ...chapterStates.value };
        
        // Use chapter data from overall state if available
        if (isChapterCompleted && overall.chapters[chapter.value]) {
          chapters[chapter.value] = {
            score: overall.chapters[chapter.value].score || 0,
            total: questions.value.length,
            completed: true,
            timeUsed: overall.chapters[chapter.value].timeUsed || 0
          };
        } else {
          // Otherwise create a basic completed state
          chapters[chapter.value] = {
            score: currentChapterScore.value,
            total: questions.value.length,
            completed: true,
            timeUsed: timerUsedSeconds.value || 0
          };
        }
        chapterStates.value = chapters;
        
        // Make sure we save this state
        saveChapterState();
      } else {
        // Only reset state if chapter is not already marked as completed
        resetStateForChapter();
      }    } else {
      console.log('Skipping completion check as requested');
      // When restarting a chapter, ensure the state is fully reset
      resetStateForChapter();
    }
  } catch (e) {
    questions.value = []
    errorMessage.value = 'Failed to load next chapter.'
  } finally {
    loading.value = false
  }
}

const totalQuestions = computed(() => {
  // Use questionsCount from topic metadata if available, else fallback to questionsData length
  return props.topic?.questionsCount || questionsData.value.length || 0;
})

const isQuizActive = computed(() => {
  return questions.value.length > 0 && current.value < questions.value.length;
})

const completedChapters = computed(() => {
  // Only include chapters that are actually completed
  const chapters = [];
  const totalChapters = Math.ceil(totalQuestions.value / CHAPTER_SIZE) || 1;
  for (let i = 0; i < totalChapters; i++) {
    if (chapterStates.value[i]?.completed) {
      chapters.push(i + 1);
    }
  }
  // If the quiz is not active, also show the just-completed chapter
  if (!isQuizActive.value && lastCompletedChapter.value && !chapters.includes(lastCompletedChapter.value)) {
    chapters.push(lastCompletedChapter.value);
  }
  return chapters;
});

// Computed for stats page: get saved overall stats
const savedOverallStats = computed(() => {
  overallStatsVersion.value // dependency for reactivity
  const overall = loadOverallState();
  if (!overall) return {
    chapters: {},
    totalCorrect: 0,
    totalQuestions: 0,
    totalChapters: 0,
    completed: false,
  };
  return overall;
});

// Computed for stats page: get completed chapters and their scores from saved overall stats
const savedCompletedChapters = computed(() => {
  const overall = savedOverallStats.value;
  if (!overall.chapters) return [];
  const result = Object.entries(overall.chapters)
    .filter(([_, chap]) => chap.completed)
    .map(([idx, chap]) => {
      // Convert timeUsed to a number and ensure it's not NaN
      const timeUsedNumber = typeof chap.timeUsed === 'number' && !isNaN(chap.timeUsed) 
        ? chap.timeUsed 
        : 0;
      
      return {
        chapter: Number(idx) + 1, 
        score: chap.score, 
        total: chap.total,
        timeUsed: timeUsedNumber
      };
    });
  
  // Debug output for chapter time data
  console.log('Saved completed chapters with time:', result);
  return result;
});

// Computed property to get the time used for the current chapter from saved stats
const currentChapterTimeUsed = computed(() => {
  const overall = savedOverallStats.value;
  if (!overall?.chapters || !overall.chapters[chapter.value]) return 0;
  
  // Ensure we convert to a number and handle NaN cases
  const timeUsed = overall.chapters[chapter.value].timeUsed;
  const timeNumber = typeof timeUsed === 'number' && !isNaN(timeUsed) ? timeUsed : 0;
  
  console.log('Current chapter time used:', timeNumber, 'raw value:', timeUsed);
  return timeNumber;
});

function isAllChaptersComplete() {
  const totalChapters = Math.ceil(totalQuestions.value / CHAPTER_SIZE) || 1;
  let chapters = chapterStates.value;
  let complete = 0;
  for (let i = 0; i < totalChapters; i++) {
    if (chapters[i]?.completed) complete++;
  }
  return complete === totalChapters;
}

function isFinalChapter() {
  const totalChapters = Math.ceil(totalQuestions.value / CHAPTER_SIZE) || 1;
  return chapter.value === totalChapters - 1;
}

function startFresh() {
  skipConfetti.value = true;
  clearStates();
  // Reset all local state for a true fresh start
  chapter.value = 0;
  questions.value = [];
  questionsData.value = [];
  current.value = 0;
  answered.value = false;
  isCorrect.value = false;
  selectedOptions.value = [];
  currentChapterScore.value = 0;
  lastCompletedChapter.value = null;
  lastCompletedScore.value = 0;
  lastCompletedTotal.value = 0;
  resetStateForChapter();
  // Re-fetch all questions for the topic as if starting new
  let filePath = '';
  if (props.topic.file) {
    filePath = props.topic.file;
  } else if (props.topic.topic) {
    filePath = `${props.topic.topic}.json`;
  }
  loading.value = true;
  errorMessage.value = '';
  fetchQuestions(filePath, { page: 0, size: CHAPTER_SIZE, all: true })
    .then(allData => {
      questionsData.value = allData;
      questions.value = allData.slice(0, CHAPTER_SIZE);
      resetStateForChapter();
    })
    .catch(() => {
      questionsData.value = [];
      questions.value = [];
      errorMessage.value = 'Failed to load questions.';
    })
    .finally(() => {
      loading.value = false;
      setTimeout(() => { skipConfetti.value = false }, 1000); // allow confetti again after reload
    });
}

// Computed display value for timer (seconds)
const timerDisplaySeconds = computed(() => {
  return timerResumeSeconds.value != null ? timerResumeSeconds.value : timerMinutes.value * 60;
})

// Helper: determine if this is a true resume (not first start)
const isTrueResume = computed(() => {
  // Detect if the user has interacted with the quiz (actually answered any questions)
  // We check current > 0 OR any answer was submitted (selectedOptions has values)
  const hasQuizInteraction = current.value > 0 || 
    (selectedOptions.value && 
     ((Array.isArray(selectedOptions.value) && selectedOptions.value.length > 0) || 
      (!Array.isArray(selectedOptions.value) && selectedOptions.value !== null && selectedOptions.value !== undefined)));
      
  // Show resume only if:
  // 1. Timer is enabled
  // 2. We have resumable timer seconds
  // 3. Time has been used (timerUsedSeconds > 0)
  // 4. We're resuming with less than the full duration (not a fresh start)
  // 5. The chapter is active (not completed)
  // 6. The user has actually interacted with the quiz (not just loaded it)
  return timerEnabled.value && 
         timerResumeSeconds.value != null && 
         timerUsedSeconds.value > 0 && 
         timerResumeSeconds.value < timerMinutes.value * 60 &&
         isQuizActive.value &&
         hasQuizInteraction;
})

// Show the resume message for 5 seconds only once per resume
watch(timerResumeSeconds, (val, oldVal) => {
  if (isTrueResume.value && val != null && val !== oldVal && !hasShownResumeMessage) {
    timerResumeMessageVisible.value = true
    hasShownResumeMessage = true
    setTimeout(() => { timerResumeMessageVisible.value = false }, 5000)
  }
})
// When topic changes, reset the flag
watch(() => props.topic, () => { hasShownResumeMessage = false }, { immediate: true })

const timerResumeInfo = computed(() => {
  if (!timerResumeMessageVisible.value) return ''
  if (!isTrueResume.value || !isQuizActive.value) return ''
  const min = Math.floor(timerResumeSeconds.value / 60)
  const sec = timerResumeSeconds.value % 60
  return `You are continuing a timed session. Remaining time: ${min} min ${sec} sec.`
})

// --- TIMER PERSISTENCE ---
// Remove saveTimerState and clearTimerState, and instead store timer in chapter state

// --- Timer event handling ---
function handleTimerTick(remaining) {
  timerTickCounter++
  timerResumeSeconds.value = remaining // keep resume info in sync
  // Track time used (only if quiz is active AND quiz has been started by user interaction)
  if (timerEnabled.value && isQuizActive.value && quizStarted.value) {
    timerUsedSeconds.value++
  }
  // Reduce the frequency of localStorage writes (every 10 seconds instead of 5)
  if (timerTickCounter % 10 === 0 || remaining === 0) { 
    // Use requestAnimationFrame to move the save operation off the critical path
    // This will allow the UI to update before we perform the potentially expensive localStorage operation
    window.requestAnimationFrame(() => {
      saveChapterState(remaining);
    });
  }
}

// Helper function to get the timer's remaining seconds
function getTimerRemainingSeconds() {
  return timerResumeSeconds.value !== null ? timerResumeSeconds.value : (timerMinutes.value * 60);
}

function handleTimerTimeout() {
  if (timerAutoTerminate.value) {
    // Auto-submit or end chapter
    // If not answered, mark as complete and move to stats
    current.value = questions.value.length // End quiz
    answered.value = true
    transitioning.value = false
    // Timer state is now part of chapter state, so just save with 0 remaining seconds
    saveChapterState(0)
  }
}

function saveChapterState(remainingSeconds) {
  const topicKey = props.topic?.topic;
  if (!topicKey) return;
  
  // Check if current question is the last one (stats page)
  const isComplete = questions.value.length > 0 && current.value >= questions.value.length;
  
  // Build the state object
  const state = {
    chapter: chapter.value,
    current: current.value,
    answered: answered.value,
    isCorrect: isCorrect.value,
    selectedOptions: selectedOptions.value,
    score: currentChapterScore.value,
    completed: isComplete,
    // If timer is enabled and running, save the remaining time for resume
    // Use provided remainingSeconds if available, otherwise get from timer state
    timerRemaining: timerEnabled.value ? 
      (typeof remainingSeconds === 'number' ? remainingSeconds : getTimerRemainingSeconds()) : 
      null,
    timerUsed: timerEnabled.value ? timerUsedSeconds.value : null
  };
  
  // Update chapter states for the current chapter
  let chapters = { ...chapterStates.value };
  chapters[chapter.value] = {
    score: currentChapterScore.value,
    total: questions.value.length,
    completed: isComplete,
    timeUsed: timerUsedSeconds.value || 0
  };
  chapterStates.value = chapters;

  // Save to localStorage with validation
  try {
    const stateString = JSON.stringify(state);
    if (stateString.length < 1024 * 1024) { // Check if less than 1MB
      localStorage.setItem(CHAPTER_STATE_KEY(topicKey), stateString);
    } else {
      console.error("Chapter state too large to store in localStorage");
    }
  } catch (e) {
    console.error("Error saving chapter state", e);
  }

  // Update overall state if chapter is completed
  if (isComplete) {
    saveOverallState();
  }
}

function loadChapterState() {
  const topicKey = props.topic?.topic;
  if (!topicKey) return false;
  const stateStr = localStorage.getItem(CHAPTER_STATE_KEY(topicKey));
  if (!stateStr) return false;
  try {
    const state = JSON.parse(stateStr);
    if (state && state.chapter !== undefined) {
      chapter.value = state.chapter;      
      current.value = state.current;
      answered.value = state.answered;
      isCorrect.value = state.isCorrect;
      selectedOptions.value = state.selectedOptions;
      currentChapterScore.value = state.score;
      
      // If we have a saved state with a current value > 0 or valid selectedOptions,
      // it means the user has interacted with the quiz
      quizStarted.value = current.value > 0 || 
                         (selectedOptions.value && 
                          ((Array.isArray(selectedOptions.value) && selectedOptions.value.length > 0) || 
                           (!Array.isArray(selectedOptions.value) && selectedOptions.value !== null && selectedOptions.value !== undefined)));
      // Restore timer remaining if present
      if (typeof state.timerRemaining === 'number' && state.timerRemaining > 0) {
        timerResumeSeconds.value = state.timerRemaining
        timerEnabled.value = true // Ensure timer is enabled on resume
        timerKey.value++ // force Timer component to re-mount
      } else {
        timerResumeSeconds.value = null
      }
      // Restore timer used if present
      timerUsedSeconds.value = typeof state.timerUsed === 'number' ? state.timerUsed : 0      // If chapter is completed in localStorage state, show stats page
      if (state.completed) {
        current.value = questions.value.length; // This will make isQuizActive false
        timerRunning.value = false; // Ensure timer isn't running for completed chapters
      } else {
        // Double check if chapter is completed in overall state even if local state doesn't show it
        const overall = loadOverallState();
        const isChapterCompletedInOverall = overall?.chapters?.[chapter.value]?.completed === true;
        
        if (isChapterCompletedInOverall) {
          console.log(`Chapter ${chapter.value} is completed in overall state but not in local state - fixing`);
          current.value = questions.value.length; // Show stats view
          timerRunning.value = false; // Ensure timer isn't running
          
          // Update local state to match overall state
          let chapters = { ...chapterStates.value };
          chapters[chapter.value] = {
            score: overall.chapters[chapter.value].score || currentChapterScore.value,
            total: questions.value.length,
            completed: true,
            timeUsed: overall.chapters[chapter.value].timeUsed || 0
          };
          chapterStates.value = chapters;
        }
      }
      return true;
    }
  } catch (e) {}
  return false;
}

function saveOverallState({ initializing = false } = {}) {
  const topicKey = props.topic?.topic;
  if (!topicKey) return;
  let overall = loadOverallState() || {
    chapters: {},
    totalCorrect: 0,
    totalQuestions: questionsData.value.length || 0,
    totalChapters: getTotalChapters(),
    completed: false,  };  if (!initializing) {
    // Only update chapters when moving to a new chapter (not on first answer)
    overall.chapters[chapter.value] = {
      score: currentChapterScore.value,
      total: questions.value.length,
      completed: true,
      timeUsed: timerUsedSeconds.value, // Add time used to chapter stats (use .value for the ref)
    };
    // Recompute totals
    let totalCorrect = 0;
    Object.values(overall.chapters).forEach(chap => {
      if (chap.completed) {
        totalCorrect += chap.score;
      }
    });
    overall.totalCorrect = totalCorrect;
    // Do NOT update overall.totalQuestions here; it is the total set size
    // Only set completed=true if the current completed chapter is the last chapter
    overall.totalChapters = getTotalChapters();
    overall.completed = (Number(chapter.value) === overall.totalChapters - 1);
  } else {
    // On initialization, do not add chapters, set completed false, totalQuestions = all questions, score = 0
    overall.chapters = {};
    overall.totalCorrect = 0;
    overall.totalQuestions = questionsData.value.length || 0;
    overall.totalChapters = getTotalChapters();
    overall.completed = false;
  }
  localStorage.setItem(OVERALL_STATE_KEY(topicKey), JSON.stringify(overall));
  overallStatsVersion.value++ // trigger reactivity
}

function loadOverallState() {
  const topicKey = props.topic?.topic;
  if (!topicKey) return null;
  const stateStr = localStorage.getItem(OVERALL_STATE_KEY(topicKey));
  if (!stateStr) return null;
  try {
    return JSON.parse(stateStr);
  } catch (e) { return null; }
}

function clearStates() {
  const topicKey = props.topic?.topic;
  localStorage.removeItem(CHAPTER_STATE_KEY(topicKey));
  localStorage.removeItem(OVERALL_STATE_KEY(topicKey));
}

// On mount/load, try to load both states
onMounted(() => {
  // Load overall state first to check for quiz completion status
  const overall = loadOverallState();
  const isOverallCompleted = overall?.completed === true;
  
  // Then load chapter state
  const chapterLoaded = loadChapterState();
  
  if (!chapterLoaded) {
    resetStateForChapter();
    // Ensure timer settings are correctly initialized for fresh starts
    initializeTimerSettings();
  } else {
    // Double check if this chapter is in the completed chapters list
    const isChapterCompletedInOverall = overall?.chapters?.[chapter.value]?.completed === true;
    
    // If chapter is completed in overall state but not properly shown as complete in UI,
    // force it to display the stats page
    if (isChapterCompletedInOverall && current.value < questions.value.length) {
      console.log(`Chapter ${chapter.value} is completed in overall state - showing stats page`);
      current.value = questions.value.length; // Force to stats view
      timerRunning.value = false; // Ensure timer isn't running
    }
  }
});

// For stats display
const overallStats = computed(() => {
  const overall = loadOverallState();
  if (!overall) return { totalCorrect: 0, totalQuestions: 0, completed: false, chapters: {} };
  return overall;
});

// Fire confetti when all chapters are complete and on the final chapter, or at the end of any chapter
watch([
  answered, current, questions, isAllChaptersComplete, isFinalChapter, savedOverallStats
], ([answeredVal, currentVal, questionsVal, allComplete, finalChapter, overallStatsVal]) => {
  if (skipConfetti.value) return;
  // Only fire confetti at the end of the quiz (all chapters complete and on final chapter)
  if ((allComplete && finalChapter) || (overallStatsVal.completed)) {
    nextTick(() => {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          confetti({
            particleCount: 80,
            spread: 70 + Math.random() * 30,
            origin: { y: 0.6 },
            angle: 60 + Math.random() * 60,
            scalar: 0.8 + Math.random() * 0.4,
          });
        }, i * 350);
      }
    });
  }
});

// TODO: For a more dynamic confetti effect, consider using a JS confetti library or randomizing confetti properties for extra delight.
// TODO: For internationalization, extract all user-facing strings to a localization file or use a library like vue-i18n.

function validateQuestions(data) {
  if (!Array.isArray(data)) return false;
  return data.every(q => (q && (typeof q.q === 'string' || typeof q.question === 'string') && Array.isArray(q.options) && Array.isArray(q.answer)));
}

function getOverallScore() {
  // Sum up scores and totals from all completed chapters
  let totalScore = 0;
  let totalQuestionsCount = 0;
  Object.values(chapterStates.value).forEach(chap => {
    if (chap.completed) {
      totalScore += chap.score || 0;
      totalQuestionsCount += chap.total || 0;
    }
  });
  return { score: totalScore, total: totalQuestionsCount };
}

function handleBack() {
  emit('back')
}

const renderedQuestion = computed(() => {
  const q = questions.value[current.value]?.question || questions.value[current.value]?.q || '';
  return renderMarkdown(q);
})

// Utility to get total chapters for the current topic
function getTotalChapters() {
  return Math.ceil((questionsData.value.length || 0) / CHAPTER_SIZE) || 1;
}

// Function to initialize or update timer settings from user preferences
function initializeTimerSettings() {
  const prevEnabled = timerEnabled.value
  
  // Get direct settings from localStorage to ensure we have the latest values
  const storedSettings = getUserSettings();
  
  // Prioritize props.userSettings but fall back to localStorage if needed
  timerEnabled.value = !!(props.userSettings.enableTimer || storedSettings.enableTimer)
  timerMinutes.value = props.userSettings.timerMinutes || storedSettings.timerMinutes || 0
  timerAutoTerminate.value = !!(props.userSettings.autoTerminate || storedSettings.autoTerminate)
  timerAllowNegative.value = !!(props.userSettings.allowNegative || storedSettings.allowNegative)
  timerRunning.value = true // Ensure timer is running on fresh start
  
  // Debug log to help track timer visibility issues
  console.log('Timer settings initialized:', { 
    enabled: timerEnabled.value, 
    minutes: timerMinutes.value, 
    autoTerminate: timerAutoTerminate.value,
    allowNegative: timerAllowNegative.value,
    propsSettings: props.userSettings,
    storedSettings: storedSettings
  });
  
  // If timer is being enabled, force re-mount of the timer component
  if (timerEnabled.value !== prevEnabled) {
    timerKey.value++
    console.log('Timer component remounted due to enabled state change');
  }
}

// Watch for changes in userSettings prop and update timer settings
watch(() => props.userSettings, (newSettings, oldSettings) => {
  // Only update if there's an actual change in timer-related settings
  if (
    newSettings.enableTimer !== oldSettings.enableTimer ||
    newSettings.timerMinutes !== oldSettings.timerMinutes ||
    newSettings.autoTerminate !== oldSettings.autoTerminate ||
    newSettings.allowNegative !== oldSettings.allowNegative
  ) {
    initializeTimerSettings();
  }
}, { deep: true })

// Watch for quiz active state to properly handle timer
watch(isQuizActive, (active) => {
  if (!active) {
    // Quiz is not active (either on stats page or no questions loaded)
    // Stop the timer and ensure it's not displayed when viewing stats
    timerRunning.value = false;
    // If we're on the stats page (i.e., chapter completed), update the chapter state
    if (quizStarted.value && questions.value.length > 0 && current.value >= questions.value.length) {
      saveChapterState(); // This will mark the chapter as completed
    }
  } else if (timerEnabled.value && quizStarted.value) {
    // Quiz is active and timer is enabled, restart timer
    timerRunning.value = true;
  }
})

function toggleTimer() {
  // Don't start timer if we're viewing the stats page
  if (!isQuizActive.value) {
    timerRunning.value = false;
    return;
  }

  timerRunning.value = !timerRunning.value;
  console.log(`Timer is now ${timerRunning.value ? 'running' : 'paused'}`);
}

function handleContinue() {
  clearFeedback();
  clearSelectedOptions();
  isCorrect.value = false;
  
  // Check if we've reached the end of the chapter
  if (current.value >= questions.value.length) {
    // If this is the last chapter, reset to the first chapter
    if (chapter.value >= getTotalChapters(props.topic)) {
      chapter.value = 1;
      current.value = 0;
      answered.value = [];
      currentChapterScore.value = 0;
      timerUsedSeconds.value = 0;
      saveChapterState();
      // For fresh start of a new chapter, we can start the timer
      if (timerEnabled.value) {
        timerRunning.value = true;
        timerResumeSeconds.value = null;
      }
    } else {
      // Move to the next chapter
      chapter.value++;
      current.value = 0;
      answered.value = [];
      currentChapterScore.value = 0;
      timerUsedSeconds.value = 0;
      saveChapterState();
      // For fresh start of a new chapter, we can start the timer
      if (timerEnabled.value) {
        timerRunning.value = true;
        timerResumeSeconds.value = null;
      }
    }
    fetchQuestions();
  } else {
    // Navigate to the next question in the current chapter
    current.value++;
    // Check if we've now reached the stats page (end of questions)
    if (current.value >= questions.value.length) {
      timerRunning.value = false; // Stop timer when reaching stats page
    }
    saveChapterState();
  }
}
</script>

<style>
/* All styles moved to style.css */
.timer-area {
  min-width: 420px; /* match or exceed timer width */
  max-width: 480px;
  width: 100%;
  position: relative;
  min-height: 56px; /* enough for message + timer */
}
.timer-resume-info.ghost-message {
  visibility: hidden;
  position: static;
  height: 0;
  pointer-events: none;
  user-select: none;
}
.timer-resume-info {
  min-width: 380px;
  max-width: 100%;
  text-align: center;
  /* other existing styles */
}
</style>
