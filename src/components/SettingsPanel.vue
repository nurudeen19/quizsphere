<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition duration-200" @click.self="emit('close')">
    <div class="relative w-11/12 sm:w-full sm:max-w-md flex items-center justify-center">
      <button class="absolute top-2 right-2 sm:top-3 sm:right-4 text-xl sm:text-2xl text-blue-700 hover:text-pink-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-white rounded-full p-1" @click="emit('close')" title="Close Settings" aria-label="Close Settings">
        <i class="fas fa-times"></i>
      </button>
      <div class="settings-panel p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-xl w-full mx-auto max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl sm:text-2xl font-bold text-blue-800 mb-3 sm:mb-4 flex items-center gap-2">
          <i class="fas fa-cog"></i> Quiz Settings
        </h2>
        <form @submit.prevent class="settings-form">
          <fieldset :disabled="props.disabled" class="contents">
            <!-- Questions per chapter -->
            <div class="mb-4 sm:mb-6">
              <label for="questionsPerChapter" class="block font-semibold text-blue-700 mb-1 text-sm sm:text-base">Questions per Chapter</label>
              <input
                id="questionsPerChapter"
                type="number"
                min="1"
                max="100"
                v-model.number="settings.questionsPerChapter"
                :placeholder="defaultChapterSize"
                class="w-full border border-cyan-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm sm:text-base"
              />
              <div class="text-xs text-gray-500 mt-1">
                Leave blank or 0 to use the default (<span class="font-semibold">{{ defaultChapterSize }}</span>) for this quiz.
              </div>
            </div>
            <!-- Timer settings -->
            <div class="mb-4 sm:mb-6">
              <label class="block font-semibold text-blue-700 mb-1 text-sm sm:text-base">Timer</label>
              <div class="flex items-center gap-2 mb-2">
                <input type="checkbox" id="enableTimer" v-model="settings.enableTimer" class="h-4 w-4 text-cyan-600" />
                <label for="enableTimer" class="text-sm sm:text-base">Enable timed chapters</label>
              </div>
              <div v-if="settings.enableTimer" class="pl-3 sm:pl-4 border-l-2 border-cyan-100">
                <div class="mb-2">
                  <label for="timerDuration" class="block text-xs sm:text-sm font-semibold text-blue-700 mb-1">Timer Duration</label>
                  <select id="timerDuration" v-model="timerSelect" class="w-full border border-cyan-300 rounded px-2 sm:px-3 py-1 sm:py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm">
                    <option v-for="opt in timerOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                    <option value="custom">Custom...</option>
                  </select>
                  <div v-if="timerSelect === 'custom'" class="mt-2 flex items-center gap-2">
                    <input type="number" min="1" max="180" v-model.number="customTimer" class="w-16 sm:w-24 border border-cyan-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder="Minutes" />
                    <span class="text-xs sm:text-sm text-gray-500">minutes</span>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">Set the time limit for each chapter.</div>
                </div>
                <div class="mb-2">
                  <label class="block text-xs sm:text-sm font-semibold text-blue-700 mb-1">Post-timeout Action</label>
                  <div class="flex flex-col gap-1">
                    <label class="flex items-center gap-2 text-xs sm:text-sm">
                      <input type="radio" name="timeoutAction" value="autoTerminate" v-model="timeoutAction" class="h-3 w-3 sm:h-4 sm:w-4 text-cyan-600 border-gray-300 rounded focus:ring-2 focus:ring-cyan-400" />
                      Auto-terminate and score when timer ends
                    </label>
                    <label class="flex items-center gap-2 text-xs sm:text-sm">
                      <input type="radio" name="timeoutAction" value="allowNegative" v-model="timeoutAction" class="h-3 w-3 sm:h-4 sm:w-4 text-cyan-600 border-gray-300 rounded focus:ring-2 focus:ring-cyan-400" />
                      Allow timer to run negative (show overtime)
                    </label>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">Choose what happens when the timer runs out.</div>
                </div>
              </div>
            </div>
            <div class="flex gap-2 mt-4 sm:mt-6">
              <button 
                type="button" 
                @click="saveSettings" 
                class="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-2 rounded font-semibold shadow hover:from-cyan-700 hover:to-blue-700 transition focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 text-sm sm:text-base flex-1"
              >
                Save
              </button>
              <button 
                type="button" 
                @click="resetSettings" 
                class="bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded font-semibold shadow hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-sm sm:text-base"
              >
                Reset
              </button>
            </div>
            <transition name="fade-slow">
              <div v-if="feedbackMessage" class="mt-4 text-center text-xs sm:text-base font-semibold text-green-700 bg-green-50 border border-green-200 rounded p-2 shadow">
                {{ feedbackMessage }}
              </div>
            </transition>
            <div v-if="props.disabled" class="mt-4 text-center text-xs sm:text-base font-semibold text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2 shadow">
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
const timeoutAction = ref('autoTerminate')

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
      // Set timeoutAction from settings
      if (settings.value.autoTerminate) timeoutAction.value = 'autoTerminate'
      else if (settings.value.allowNegative) timeoutAction.value = 'allowNegative'
      else timeoutAction.value = 'autoTerminate'
    } else {
      timerSelect.value = ''
      customTimer.value = ''
    }
  },
  { immediate: true }
)

watch(timeoutAction, (val) => {
  if (val === 'autoTerminate') {
    settings.value.autoTerminate = true
    settings.value.allowNegative = false
  } else if (val === 'allowNegative') {
    settings.value.autoTerminate = false
    settings.value.allowNegative = true
  }
})

watch([timerSelect, customTimer], ([sel, custom]) => {
  if (sel === 'custom') {
    // Validate custom timer input - ensure it's a positive number within reasonable limits
    const validatedValue = Number(custom);
    if (isNaN(validatedValue) || validatedValue <= 0) {
      customTimer.value = 10; // Default to 10 minutes if invalid
      settings.value.timerMinutes = 10;
    } else if (validatedValue > 180) {
      customTimer.value = 180; // Cap at 3 hours (180 minutes)
      settings.value.timerMinutes = 180;
    } else {
      settings.value.timerMinutes = validatedValue;
    }
  } else if (sel !== 'custom') {
    settings.value.timerMinutes = Number(sel);
  }
})

watch(settings, (val) => {
  // Optionally auto-save on change
  // saveSettings()
}, { deep: true })

watch([() => settings.value.autoTerminate, () => settings.value.allowNegative, () => settings.value.enableTimer], ([autoTerminate, allowNegative, enableTimer]) => {
  if (enableTimer && !autoTerminate && !allowNegative) {
    // Force autoTerminate to true if both are unchecked
    settings.value.autoTerminate = true
  }
})
</script>

<style>
.settings-panel {
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(14, 165, 233, 0.5) rgba(241, 245, 249, 0.5);
}

.settings-panel::-webkit-scrollbar {
  width: 6px;
}

.settings-panel::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 10px;
}

.settings-panel::-webkit-scrollbar-thumb {
  background-color: rgba(14, 165, 233, 0.5);
  border-radius: 10px;
}

.fade-slow-enter-active,
.fade-slow-leave-active {
  transition: opacity 0.5s ease;
}

.fade-slow-enter-from,
.fade-slow-leave-to {
  opacity: 0;
}

/* Mobile specific styles */
@media (max-width: 640px) {
  .settings-panel {
    padding: 1rem;
    border-radius: 0.75rem;
  }
  
  .settings-form label {
    font-size: 0.875rem;
  }
  
  .settings-form input[type="checkbox"],
  .settings-form input[type="radio"] {
    transform: scale(0.85);
    margin-top: 0;
  }
}
</style>
