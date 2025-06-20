<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition duration-200" @click.self="emit('close')">
    <div class="relative w-full max-w-md flex items-center justify-center">
      <button class="absolute top-3 right-4 text-2xl text-blue-700 hover:text-pink-500 transition-colors focus:outline-none" @click="emit('close')" title="Close Settings">
        <i class="fas fa-times"></i>
      </button>
      <div class="settings-panel p-6 bg-white rounded-2xl shadow-xl w-full mx-auto">
        <h2 class="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
          <i class="fas fa-cog"></i> Quiz Settings
        </h2>
        <form @submit.prevent>
          <fieldset :disabled="props.disabled" class="contents">
            <!-- Questions per chapter -->
            <div class="mb-6">
              <label for="questionsPerChapter" class="block font-semibold text-blue-700 mb-1">Questions per Chapter</label>
              <input
                id="questionsPerChapter"
                type="number"
                min="1"
                max="100"
                v-model.number="settings.questionsPerChapter"
                :placeholder="defaultChapterSize"
                class="w-full border border-cyan-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
              <div class="text-xs text-gray-500 mt-1">
                Leave blank or 0 to use the default (<span class="font-semibold">{{ defaultChapterSize }}</span>) for this quiz.
              </div>
            </div>
            <!-- Timer settings -->
            <div class="mb-6">
              <label class="block font-semibold text-blue-700 mb-1">Timer</label>
              <div class="flex items-center gap-2 mb-2">
                <input type="checkbox" id="enableTimer" v-model="settings.enableTimer" />
                <label for="enableTimer" class="text-base">Enable timed chapters</label>
              </div>
              <div v-if="settings.enableTimer" class="pl-4">
                <div class="mb-2">
                  <label for="timerDuration" class="block text-sm font-semibold text-blue-700 mb-1">Timer Duration</label>
                  <select id="timerDuration" v-model="timerSelect" class="w-full border border-cyan-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400">
                    <option v-for="opt in timerOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                    <option value="custom">Custom...</option>
                  </select>
                  <div v-if="timerSelect === 'custom'" class="mt-2 flex items-center gap-2">
                    <input type="number" min="1" max="180" v-model.number="customTimer" class="w-24 border border-cyan-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder="Minutes" />
                    <span class="text-sm text-gray-500">minutes</span>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">Set the time limit for each chapter.</div>
                </div>
                <div class="flex items-center gap-2 mb-2">
                  <input type="checkbox" id="autoTerminate" v-model="settings.autoTerminate" />
                  <label for="autoTerminate" class="text-base">Auto-terminate and score when timer ends</label>
                </div>
                <div class="flex items-center gap-2 mb-2">
                  <input type="checkbox" id="allowNegative" v-model="settings.allowNegative" />
                  <label for="allowNegative" class="text-base">Allow timer to run negative (show overtime)</label>
                </div>
              </div>
            </div>
            <div class="flex gap-2 mt-6">
              <button type="button" @click="saveSettings" class="bg-cyan-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-cyan-700 transition">Save</button>
              <button type="button" @click="resetSettings" class="bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold shadow hover:bg-gray-300 transition">Reset</button>
            </div>
            <transition name="fade-slow">
              <div v-if="feedbackMessage" class="mt-4 text-center text-base font-semibold text-green-700 bg-green-50 border border-green-200 rounded p-2 shadow">
                {{ feedbackMessage }}
              </div>
            </transition>
            <div v-if="props.disabled" class="mt-4 text-center text-base font-semibold text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2 shadow">
              Settings cannot be changed during an active quiz. Please finish or exit the quiz to update settings.
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { PAGE_SIZE } from '../quiz/quiz-utils.js'

const props = defineProps({
  disabled: Boolean
})

const emit = defineEmits(['settings-changed', 'close'])
const defaultChapterSize = PAGE_SIZE // fallback default, synced with quiz-utils.js
const SETTINGS_KEY = 'quizsphere-user-settings'

const settings = ref({
  questionsPerChapter: '',
  enableTimer: false,
  autoTerminate: false,
  allowNegative: false,
})

const feedbackMessage = ref('')
let feedbackTimeout = null

function showFeedback(msg, close = false) {
  feedbackMessage.value = msg
  if (feedbackTimeout) clearTimeout(feedbackTimeout)
  feedbackTimeout = setTimeout(() => {
    feedbackMessage.value = ''
    if (close) emit('close')
  }, 1200)
}

function loadSettings() {
  const raw = localStorage.getItem(SETTINGS_KEY)
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      Object.assign(settings.value, parsed)
    } catch {}
  }
}

function saveSettings() {
  // Clean up: if questionsPerChapter is blank/0, remove it to fallback to default
  const toSave = { ...settings.value }
  if (!toSave.questionsPerChapter || toSave.questionsPerChapter < 1) {
    delete toSave.questionsPerChapter
  }
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(toSave))
  emit('settings-changed', toSave)
  showFeedback('Settings saved!', true)
}

function resetSettings() {
  localStorage.removeItem(SETTINGS_KEY)
  settings.value = {
    questionsPerChapter: '',
    enableTimer: false,
    autoTerminate: false,
    allowNegative: false,
  }
  emit('settings-changed', { ...settings.value })
  showFeedback('Settings reset to default.', true)
}

onMounted(loadSettings)

const timerOptions = [
  { value: 10, label: '10 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 20, label: '20 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
]
const timerSelect = ref('')
const customTimer = ref('')

watch(
  () => settings.value.enableTimer,
  (enabled) => {
    if (enabled) {
      // Set timerSelect from settings or default
      if (settings.value.timerMinutes && timerOptions.some(opt => opt.value === settings.value.timerMinutes)) {
        timerSelect.value = settings.value.timerMinutes
      } else if (settings.value.timerMinutes) {
        timerSelect.value = 'custom'
        customTimer.value = settings.value.timerMinutes
      } else {
        timerSelect.value = 15
        customTimer.value = ''
      }
    } else {
      timerSelect.value = ''
      customTimer.value = ''
    }
  },
  { immediate: true }
)

watch([timerSelect, customTimer], ([sel, custom]) => {
  if (sel === 'custom' && custom > 0) {
    settings.value.timerMinutes = custom
  } else if (sel !== 'custom') {
    settings.value.timerMinutes = Number(sel)
  }
})

watch(settings, (val) => {
  // Optionally auto-save on change
  // saveSettings()
}, { deep: true })
</script>

<style scoped>
/* No custom modal styles needed, all handled by Tailwind */
.settings-panel {
  /* Panel styles can be further customized or moved to global style.css */
  margin-top: 0;
}
</style>
