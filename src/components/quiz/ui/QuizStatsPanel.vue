<template>
  <div class="quiz-stats-panel">
    <!-- Stats Overview -->
    <div class="bg-white rounded-2xl shadow-xl p-6 mb-6">
      <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <svg class="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        {{ topicTitle }} Performance
      </h3>

      <div v-if="stats.totalRounds > 0" class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <!-- Total Rounds -->
        <div class="text-center">
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div class="text-2xl font-bold text-blue-600 mb-1">{{ stats.totalRounds }}</div>
            <div class="text-sm font-medium text-blue-800">Total Rounds</div>
          </div>
        </div>

        <!-- Best Score -->
        <div class="text-center">
          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div class="text-2xl font-bold text-green-600 mb-1">{{ stats.bestScore }}%</div>
            <div class="text-sm font-medium text-green-800">Best Score</div>
          </div>
        </div>

        <!-- Average Score -->
        <div class="text-center">
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div class="text-2xl font-bold text-purple-600 mb-1">{{ stats.averageScore }}%</div>
            <div class="text-sm font-medium text-purple-800">Average Score</div>
          </div>
        </div>

        <!-- Total Questions -->
        <div class="text-center">
          <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
            <div class="text-2xl font-bold text-orange-600 mb-1">{{ stats.totalQuestions }}</div>
            <div class="text-sm font-medium text-orange-800">Questions Answered</div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <div class="text-gray-400 mb-2">
          <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        <p class="text-gray-500 text-lg">No quiz rounds completed yet</p>
        <p class="text-gray-400 text-sm">Start a quiz to see your performance statistics</p>
      </div>
    </div>

    <!-- Recent Rounds -->
    <div v-if="stats.recentRounds && stats.recentRounds.length > 0" class="bg-white rounded-2xl shadow-xl p-6">
      <h4 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Recent Rounds
      </h4>

      <div class="space-y-3">
        <div
          v-for="round in stats.recentRounds"
          :key="round.id"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border hover:bg-gray-100 transition-colors"
        >
          <div class="flex items-center">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span class="text-blue-600 font-bold">R{{ round.round }}</span>
            </div>
            <div>
              <div class="font-medium text-gray-800">Round {{ round.round }}</div>
              <div class="text-sm text-gray-500">
                {{ formatDate(round.completedAt) }}
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <div class="text-right">
              <div :class="[
                'text-lg font-bold',
                round.score >= 80 ? 'text-green-600' : 
                round.score >= 60 ? 'text-blue-600' : 'text-orange-600'
              ]">
                {{ Math.round(round.score) }}%
              </div>
              <div class="text-sm text-gray-500">
                {{ round.correctAnswers }}/{{ round.totalQuestions }}
              </div>
            </div>

            <div class="text-right">
              <div class="text-sm text-gray-600">{{ formatTime(round.timeTaken) }}</div>
              <div class="text-xs text-gray-400 capitalize">{{ round.difficulty }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  topicKey: {
    type: String,
    required: true
  },
  topicTitle: {
    type: String,
    required: true
  },
  stats: {
    type: Object,
    required: true
  }
})

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Unknown'
  }
}

const formatTime = (seconds) => {
  if (!seconds) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
</script>
