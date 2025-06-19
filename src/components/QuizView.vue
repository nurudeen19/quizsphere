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
    <!-- Animated Progress Bar -->
    <div class="w-full bg-gray-200 rounded-full h-5 mb-6 overflow-hidden shadow-inner">
      <div
        class="progress-bar transition-all duration-500"
        :style="{ width: ((current + 0) / questions.length * 100) + '%' }"
        aria-valuenow="((current + 0) / questions.length * 100)"
        aria-valuemin="0"
        :aria-valuemax="questions.length"
        role="progressbar"
      >
        <span class="sr-only">Progress</span>
      </div>
    </div>
    <!-- End Progress Bar -->
    <div v-if="isQuizActive">
      <div class="question">
        <span class="progress">Question {{ current + 1 }} of {{ questions.length }}</span>
        <p class="question-text">{{ questions[current].question || questions[current].q }}</p>
      </div>
      <form class="options" @submit.prevent="submitOptions">
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
            />
            <label :for="'option-' + idx" class="flex-1 cursor-pointer text-base font-medium flex items-center gap-2 text-left">
              {{ opt }}
            </label>
          </div>
        </fieldset>
        <section class="quiz-action-area min-h-[140px] flex flex-col items-center justify-center relative">
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
                    </p>
                    <p v-if="questions[current] && questions[current].explanation" class="explanation mt-3 text-base text-gray-700 bg-blue-50 border-l-4 border-blue-400 px-4 py-2 rounded shadow-sm w-full">
                      <i class="fas fa-info-circle text-blue-400 mr-2"></i>
                      {{ questions[current].explanation }}
                    </p>
                    <button v-if="answered" class="next-btn-wrapper next-btn rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 transition-all text-2xl tracking-wide drop-shadow-md border-0 cursor-pointer mt-4" style="background: linear-gradient(90deg, #06b6d4 0%, #2563eb 100%); color: #fff; min-width: 180px; min-height: 52px;" @click="handleNext">
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
      <template v-else>
        <h3>
          <i class="fas fa-trophy"></i>
          Chapter Complete!
        </h3>
      </template>
      <!-- Stats UI from saved overall stats -->
      <div class="chapter-stats mb-4 w-full flex justify-center">
        <table class="w-auto min-w-[320px] text-base border-collapse bg-white rounded-lg shadow-md">
          <tbody>
            <tr v-for="chap in savedCompletedChapters" :key="chap.chapter" class="bg-blue-50 rounded-lg">
              <th class="py-2 px-4 font-semibold text-blue-700 whitespace-nowrap text-left bg-blue-100 rounded-l-lg">
                Chapter {{ chap.chapter }} Score
              </th>
              <td class="py-2 px-4 text-cyan-500 font-bold text-left bg-white rounded-r-lg">
                {{ chap.score }} / {{ chap.total }}
              </td>
            </tr>
            <tr>
              <td colspan="4" class="py-1"><hr class="border-t-2 border-gray-200 my-1"></td>
            </tr>
            <tr>
              <th class="py-2 px-4 font-semibold text-blue-700 whitespace-nowrap text-left">Overall</th>
              <td class="py-2 px-4 text-blue-600 font-bold text-left" colspan="3">
                {{ savedOverallStats.totalCorrect }} / {{ savedOverallStats.totalQuestions }}
                <span class="text-xs text-gray-500 ml-2">({{ savedCompletedChapters.length }} of {{ savedOverallStats.totalChapters }} chapters completed)</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="w-full flex flex-row justify-center items-center mt-4 gap-2">
        <button @click="restartChapter" class="next-btn flex items-center justify-center h-[40px] px-2 py-1 rounded-full bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold shadow-lg hover:from-pink-500 hover:to-red-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 transition-all tracking-wide drop-shadow-md border-0 cursor-pointer" style="font-size:unset;background: linear-gradient(90deg, #f43f5e 0%, #ec4899 100%); color: #fff; min-width: 120px; min-height: 32px;">
          <i class="fas fa-undo text-base pr-1"></i>
          <span class="whitespace-nowrap">Restart Chapter</span>
        </button>
        <button
          v-if="questions.length === CHAPTER_SIZE && !isFinalChapter()"
          @click="goToNextChapter"
          class="next-btn flex items-center justify-center h-[40px] px-2 py-1 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold shadow-lg hover:from-blue-500 hover:to-green-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 transition-all tracking-wide drop-shadow-md border-0 cursor-pointer"
          style="font-size:unset;background: linear-gradient(90deg, #22c55e 0%, #2563eb 100%); color: #fff; min-width: 120px; min-height: 32px;">
          <i class="fas fa-arrow-right text-base pr-1"></i>
          <span class="whitespace-nowrap">Continue to Next Chapter</span>
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
import { ref, watch, nextTick, computed, onMounted } from 'vue'
import { PAGE_SIZE, fetchQuestions } from '../quiz/quiz-utils.js'
import confetti from 'canvas-confetti'

const props = defineProps({
  topic: Object
})

const questions = ref([])
const current = ref(0)
const answered = ref(false)
const isCorrect = ref(false)
const topicTitle = ref('')
const selectedOptions = ref([])
const CHAPTER_SIZE = PAGE_SIZE
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
    try {
      // Fetch only the current chapter's questions using pagination
      const pagedData = await fetchQuestions(filePath, { page: chapter.value, size: CHAPTER_SIZE })
      questions.value = pagedData
      // Optionally, fetch all questions for stats or total count
      const allData = await fetchQuestions(filePath)
      questionsData.value = allData
      resetStateForChapter()
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
    if (!loadChapterState()) {
      chapter.value = 0
      resetStateForChapter()
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
  // Move focus to first option for accessibility
  nextTick(() => {
    const firstOption = document.querySelector('.option-row input:not(:disabled)')
    if (firstOption) firstOption.focus()
  })
}

function submitOptions() {
  if (answered.value) return; // Prevent double submission
  answered.value = true
  transitioning.value = false
  const correctAnswers = questions.value[current.value].answer
  if (correctAnswers.length === 1) {
    isCorrect.value = Number(selectedOptions.value) === correctAnswers[0]
  } else {
    // compare arrays (order-insensitive)
    const selected = selectedOptions.value.map(Number).sort()
    const correct = Array.from(correctAnswers).map(Number).sort()
    isCorrect.value = selected.length === correct.length && selected.every((v, i) => v === correct[i])
  }
  if (isCorrect.value) currentChapterScore.value++
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
  fetchNextChapterQuestions();
}

function restartChapter() {
  // Reset only the current chapter's state and score
  let chapters = { ...chapterStates.value };
  chapters[chapter.value] = {
    score: 0,
    total: questions.value.length,
    completed: false
  };
  chapterStates.value = chapters;
  saveChapterState();

  // Remove the chapter from the overall state and update total score
  const topicKey = props.topic?.topic;
  let overall = loadOverallState();
  if (overall && overall.chapters) {
    // Remove the current chapter from the overall chapters
    delete overall.chapters[chapter.value];
    // Recompute totalCorrect
    let totalCorrect = 0;
    Object.values(overall.chapters).forEach(chap => {
      if (chap.completed) {
        totalCorrect += chap.score;
      }
    });
    overall.totalCorrect = totalCorrect;
    // Save the updated overall state
    localStorage.setItem(OVERALL_STATE_KEY(topicKey), JSON.stringify(overall));
  }

  fetchNextChapterQuestions(); // Reload current chapter's questions and reset state
}

async function fetchNextChapterQuestions() {
  let filePath = ''
  if (props.topic.file) {
    filePath = props.topic.file
  } else if (props.topic.topic) {
    filePath = `${props.topic.topic}.json`
  }
  loading.value = true
  errorMessage.value = ''
  try {
    questions.value = await fetchQuestions(filePath, { page: chapter.value, size: CHAPTER_SIZE })
    resetStateForChapter() // Always reset state after loading new questions
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
  return Object.entries(overall.chapters)
    .filter(([_, chap]) => chap.completed)
    .map(([idx, chap]) => ({ chapter: Number(idx) + 1, score: chap.score, total: chap.total }));
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
  clearStates();
  chapter.value = 0;
  questions.value = getChapterQuestions(0);
  current.value = 0;
  answered.value = false;
  isCorrect.value = false;
  selectedOptions.value = [];
  currentChapterScore.value = 0;
  // Optionally, scroll to top or focus first question
}

// Utility to get total chapters for the current topic
function getTotalChapters() {
  return Math.ceil((questionsData.value.length || 0) / CHAPTER_SIZE) || 1;
}

function saveChapterState() {
  const topicKey = props.topic?.topic;
  if (!topicKey) return;
  // Determine if chapter is completed
  const isCompleted = (current.value >= questions.value.length - 1 && answered.value);
  const state = {
    chapter: chapter.value,
    current: current.value,
    answered: answered.value,
    isCorrect: isCorrect.value,
    selectedOptions: selectedOptions.value,
    score: currentChapterScore.value,
    total: questions.value.length,
    questions: questions.value,
    completed: isCompleted,
  };
  localStorage.setItem(CHAPTER_STATE_KEY(topicKey), JSON.stringify(state));
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
      // If chapter is completed, show stats page (i.e., set isQuizActive to false)
      if (state.completed) {
        current.value = questions.value.length; // This will make isQuizActive false
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
    completed: false,
  };
  if (!initializing) {
    // Only update chapters when moving to a new chapter (not on first answer)
    overall.chapters[chapter.value] = {
      score: currentChapterScore.value,
      total: questions.value.length,
      completed: true,
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
  if (!loadChapterState()) {
    resetStateForChapter();
  }
  // Optionally, load overall state for stats display
});

// For stats display
const overallStats = computed(() => {
  const overall = loadOverallState();
  if (!overall) return { totalCorrect: 0, totalQuestions: 0, completed: false, chapters: {} };
  return overall;
});

// Fire confetti when all chapters are complete and on the final chapter, or at the end of any chapter
watch([
  answered, current, questions, isAllChaptersComplete, isFinalChapter
], ([answeredVal, currentVal, questionsVal, allComplete, finalChapter]) => {
  // Only fire confetti at the end of the quiz (all chapters complete and on final chapter)
  if (allComplete && finalChapter) {
    nextTick(() => {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          confetti({
            particleCount: 80,
            spread: 70 + Math.random() * 30,
            origin: { y: 0.6 },
            angle: 60 + Math.random() * 60,
            scalar: 0.8 + Math.random() * 0.4,
          })
        }, i * 350)
      }
    })
  }
})
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
</script>

<style>
.fade-slow-enter-active, .fade-slow-leave-active {
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slow-enter-from, .fade-slow-leave-to {
  opacity: 0;
}
.fade-slow-enter-to, .fade-slow-leave-from {
  opacity: 1;
}
.loader {
  border: 4px solid #e0e7ef;
  border-top: 4px solid #06b6d4;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
