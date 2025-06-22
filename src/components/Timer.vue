<template>
  <div v-if="!props.hide" class="timer-bar-container glassy flex flex-col items-center w-full select-none shadow-xl">
    <div class="timer-bar-label mb-1 text-2xl font-extrabold tracking-widest flex items-center justify-center gap-2" :class="isNegative ? 'text-red-600' : progressColorClass">
      <svg class="inline-block w-6 h-6 text-blue-400 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span class="timer-digits">{{ isNegative ? '-' : '' }}{{ minutes }}:{{ seconds < 10 ? '0' + seconds : seconds }}</span>
      <span class="timer-desc text-xs text-gray-500 ml-2 font-semibold">Time left</span>
    </div>
    <div class="timer-bar-bg w-full h-6 rounded-full bg-gray-200 shadow-inner overflow-hidden relative">
      <div
        class="timer-bar-progress h-6 rounded-full transition-all duration-500 animated-gradient"
        :style="{
          width: (progress * 100) + '%',
          background: progressBarGradient,
          boxShadow: (progress <= 0.1 || isNegative) ? '0 0 16px 4px #dc2626cc, 0 0 32px 8px #f87171aa' : '0 2px 8px 0 #2563eb33',
        }"
        :class="{ 'timer-bar-pulse': progress <= 0.1 || isNegative }"
        role="progressbar"
        :aria-valuenow="progress * 100"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
      <div class="timer-bar-glass absolute inset-0 pointer-events-none"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  duration: { type: Number, required: true }, // in minutes
  autoTerminate: { type: Boolean, default: false },
  allowNegative: { type: Boolean, default: false },
  running: { type: Boolean, default: true },
  resumeSeconds: { type: Number, default: null },
  hide: { type: Boolean, default: false }, // New prop to handle hiding the timer
})
const emit = defineEmits(['timeout', 'tick'])

const totalSeconds = ref(props.duration * 60)
const elapsed = ref(0)
const timer = ref(null)
const isNegative = ref(false)

// Remove displayTime computed, use live countdown for display
const minutes = computed(() => Math.floor(Math.abs(totalSeconds.value - elapsed.value) / 60))
const seconds = computed(() => Math.abs(totalSeconds.value - elapsed.value) % 60)

const progress = computed(() => {
  const val = Math.max(0, Math.min(1, (totalSeconds.value - elapsed.value) / totalSeconds.value))
  return props.allowNegative && elapsed.value > totalSeconds.value ? 0 : val
})

const progressColor = computed(() => {
  if (isNegative.value) return '#dc2626' // red-600
  if (progress.value <= 0.1) return '#dc2626' // red
  if (progress.value <= 0.2) return '#f59e42' // orange
  return '#2563eb' // blue
})
const progressColorClass = computed(() => {
  if (isNegative.value) return 'text-red-600'
  if (progress.value <= 0.1) return 'text-red-600'
  if (progress.value <= 0.2) return 'text-orange-500'
  return 'text-blue-700'
})
const progressBarGradient = computed(() => {
  if (isNegative.value || progress.value <= 0.1) {
    return 'linear-gradient(90deg, #dc2626 0%, #f87171 100%)';
  } else if (progress.value <= 0.2) {
    return 'linear-gradient(90deg, #f59e42 0%, #fbbf24 100%)';
  } else {
    return 'linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)';
  }
})

function start() {
  // First stop any existing timer to prevent duplicates
  stop()
  timer.value = setInterval(() => {
    if (!props.running) return
    elapsed.value++
    emit('tick', getTimeLeft())
    if (!props.allowNegative && elapsed.value >= totalSeconds.value) {
      stop()
      emit('timeout')
    } else if (props.allowNegative && elapsed.value > totalSeconds.value) {
      isNegative.value = true
      if (props.autoTerminate && elapsed.value === totalSeconds.value + 1) {
        stop()
        emit('timeout')
      }
    }
  }, 1000)
}

function stop() {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

function reset() {
  stop()
  elapsed.value = 0
  isNegative.value = false
}

function getTimeLeft() {
  return props.allowNegative
    ? totalSeconds.value - elapsed.value
    : Math.max(0, totalSeconds.value - elapsed.value)
}

function setElapsedFromResume() {
  // Only use resumeSeconds for resume logic
  let resume = props.resumeSeconds
  if (resume !== null && typeof resume === 'number') {
    elapsed.value = totalSeconds.value - resume
    isNegative.value = elapsed.value > totalSeconds.value
  } else {
    elapsed.value = 0
    isNegative.value = false
  }
}

// New property to watch for component visibility changes
// This helps prevent timers running in background tabs
const documentVisibilityHandler = () => {
  if (document.hidden) {
    // Page is not visible, pause the timer
    if (timer.value) clearInterval(timer.value)
  } else if (props.running) {
    // Page is visible again, restart the timer if it should be running
    start()
  }
}

// Single onMounted and onUnmounted hooks to handle all lifecycle logic
onMounted(() => {
  // Initialize timer with resume state
  setElapsedFromResume()
  
  // Listen for visibility changes to pause/resume timer
  document.addEventListener('visibilitychange', documentVisibilityHandler)
  
  // Start the timer if it should be running
  if (props.running) start()
})

onUnmounted(() => {
  // Clean up all resources and event listeners
  document.removeEventListener('visibilitychange', documentVisibilityHandler)
  stop() // Ensure timer is stopped on unmount
})

watch(() => props.resumeSeconds, (val) => {
  setElapsedFromResume()
})

watch(() => props.duration, (newVal) => {
  totalSeconds.value = newVal * 60
  reset()
  setElapsedFromResume()
  if (props.running) start()
})

watch(() => props.running, (val) => {
  if (val) start()
  else stop()
})

watch(() => props.autoTerminate, (val) => {
  // If autoTerminate changes, reset timer logic if needed
  if (props.running) {
    reset()
    start()
  }
})

watch(() => props.allowNegative, (val) => {
  // If allowNegative changes, reset timer logic if needed
  if (props.running) {
    reset()
    start()
  }
})
</script>

<style scoped>
.timer-bar-container {
  width: 100%;
  min-width: 180px;
  max-width: 420px;
  border-radius: 1.5rem;
  background: rgba(255,255,255,0.25);
  backdrop-filter: blur(8px) saturate(1.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
  border: 1.5px solid rgba(30,64,175,0.10);
  padding: 1.2rem 1.5rem 1.2rem 1.5rem;
  margin-bottom: 1.5rem;
}
.timer-bar-label {
  text-align: center;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 1px 6px rgba(0,0,0,0.10);
  letter-spacing: 0.08em;
}
.timer-digits {
  font-size: 2.1rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  transition: color 0.3s, text-shadow 0.3s;
  text-shadow: 0 2px 12px rgba(80,120,200,0.10);
}
.timer-bar-bg {
  width: 100%;
  background: #e5e7eb;
  border-radius: 9999px;
  box-shadow: 0 2px 8px 0 rgba(80, 120, 200, 0.08);
  overflow: hidden;
  position: relative;
}
.timer-bar-progress {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.5s cubic-bezier(0.4,0,0.2,1), background 0.3s;
  background-size: 200% 200%;
}
.animated-gradient {
  animation: gradient-move 2.5s linear infinite;
}
@keyframes gradient-move {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
.timer-bar-pulse {
  animation: timer-bar-pulse 1s infinite alternate;
}
@keyframes timer-bar-pulse {
  0% { box-shadow: 0 0 0 0 #dc2626cc, 0 0 0 0 #f87171aa; }
  100% { box-shadow: 0 0 16px 4px #dc2626cc, 0 0 32px 8px #f87171aa; }
}
.timer-bar-glass {
  background: linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%);
  border-radius: 9999px;
  opacity: 0.7;
}
</style>
