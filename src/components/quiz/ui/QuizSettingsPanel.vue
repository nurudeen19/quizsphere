<template>
  <div class="quiz-settings-panel bg-white rounded-lg shadow-lg p-6 border">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">
        {{ title }} Settings
      </h3>
      <button
        @click="resetToDefaults"
        class="text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        Reset to Defaults
      </button>
    </div>

    <div class="space-y-6">
      <!-- Timer Settings -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              :checked="settings.enableTimer"
              @change="updateSetting('enableTimer', $event.target.checked)"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span class="text-sm font-medium text-gray-700">Enable Timer</span>
          </label>
          <span v-if="isQuickQuiz && !settings.enableTimer" class="text-xs text-gray-500">
            (Recommended for quick quiz)
          </span>
        </div>
        
        <div v-if="settings.enableTimer" class="ml-7 space-y-2">
          <label class="block text-sm text-gray-600">
            Duration: {{ settings.timerDuration }} minutes
          </label>
          <input
            type="range"
            :value="settings.timerDuration"
            @input="updateSetting('timerDuration', parseInt($event.target.value))"
            min="5"
            max="60"
            step="5"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div class="flex justify-between text-xs text-gray-400">
            <span>5 min</span>
            <span>30 min</span>
            <span>60 min</span>
          </div>
        </div>
      </div>

      <!-- Feedback Settings -->
      <div class="space-y-3">
        <label class="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            :checked="settings.showFeedback"
            @change="updateSetting('showFeedback', $event.target.checked)"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span class="text-sm font-medium text-gray-700">Show Immediate Feedback</span>
        </label>
        <p class="ml-7 text-xs text-gray-500">
          Display whether your answer is correct/incorrect after each question
        </p>
      </div>

      <!-- Explanations Settings -->
      <div class="space-y-3">
        <label class="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            :checked="settings.showExplanations"
            @change="updateSetting('showExplanations', $event.target.checked)"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span class="text-sm font-medium text-gray-700">Show Explanations</span>
        </label>
        <p class="ml-7 text-xs text-gray-500">
          Display detailed explanations for answers (when available)
        </p>
      </div>

      <!-- Custom Quiz Additional Settings -->
      <div v-if="!isQuickQuiz" class="space-y-3">
        <label class="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            :checked="settings.allowOvertime"
            @change="updateSetting('allowOvertime', $event.target.checked)"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span class="text-sm font-medium text-gray-700">Allow Overtime</span>
        </label>
        <p class="ml-7 text-xs text-gray-500">
          Continue quiz even after timer expires (timer will show overtime)
        </p>
      </div>
    </div>

    <!-- Settings Preview -->
    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
      <h4 class="text-sm font-medium text-gray-700 mb-2">Current Settings Summary:</h4>
      <ul class="text-xs text-gray-600 space-y-1">
        <li>⏱️ Timer: {{ settings.enableTimer ? `${settings.timerDuration} minutes` : 'Disabled' }}</li>
        <li>💬 Feedback: {{ settings.showFeedback ? 'Enabled' : 'Disabled' }}</li>
        <li>📖 Explanations: {{ settings.showExplanations ? 'Enabled' : 'Disabled' }}</li>
        <li v-if="!isQuickQuiz">⏰ Overtime: {{ settings.allowOvertime ? 'Allowed' : 'Not allowed' }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { StorageService } from '@/services/storage.js'

export default {
  name: 'QuizSettingsPanel',
  props: {
    quizType: {
      type: String,
      required: true,
      validator: value => ['quick', 'custom'].includes(value)
    },
    modelValue: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  computed: {
    isQuickQuiz() {
      return this.quizType === 'quick'
    },
    title() {
      return this.isQuickQuiz ? 'Quick Quiz' : 'Custom Quiz'
    },
    settings() {
      return this.modelValue
    }
  },
  methods: {
    updateSetting(key, value) {
      const updatedSettings = {
        ...this.settings,
        [key]: value
      }
      this.$emit('update:modelValue', updatedSettings)
      
      // Save to localStorage
      const allSettings = StorageService.getQuizSettings()
      allSettings[this.quizType] = updatedSettings
      StorageService.saveQuizSettings(allSettings)
    },
    resetToDefaults() {
      const defaultSettings = StorageService.getDefaultQuizSettings()[this.quizType]
      this.$emit('update:modelValue', defaultSettings)
      
      // Update localStorage
      const allSettings = StorageService.getQuizSettings()
      allSettings[this.quizType] = defaultSettings
      StorageService.saveQuizSettings(allSettings)
    }
  }
}
</script>

<style scoped>
/* Custom range slider styling */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

input[type="range"]::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
