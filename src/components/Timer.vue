<template>
  <div class="timer-bar-container flex flex-col items-center w-full select-none">
    <div class="timer-bar-label mb-1 text-base font-semibold" :class="isNegative ? 'text-red-600' : progressColorClass">
      {{ isNegative ? '-' : '' }}{{ minutes }}:{{ seconds < 10 ? '0' + seconds : seconds }}
      <span class="timer-desc text-xs text-gray-500 ml-2">Time left</span>
    </div>
    <div class="timer-bar-bg w-full h-5 rounded-full bg-gray-200 shadow-inner overflow-hidden">
      <div
        class="timer-bar-progress h-5 rounded-full transition-all duration-500"
        :style="{
          width: (progress * 100) + '%',
          background: progressBarGradient,
          boxShadow: (progress <= 0.1 || isNegative) ? '0 0 8px 2px #dc2626aa' : 'none',
        }"
        :class="{ 'timer-bar-pulse': progress <= 0.1 || isNegative }"
        role="progressbar"
        :aria-valuenow="progress * 100"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
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
  displaySeconds: { type: Number, default: null }, // for initial display only
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
  if (timer.value) return
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
  // Use displaySeconds for initial value if present, else resumeSeconds
  let resume = props.displaySeconds != null ? props.displaySeconds : props.resumeSeconds
  if (resume !== null && typeof resume === 'number') {
    elapsed.value = totalSeconds.value - resume
    isNegative.value = elapsed.value > totalSeconds.value
  } else {
    elapsed.value = 0
    isNegative.value = false
  }
}

onMounted(() => {
  setElapsedFromResume()
  if (props.running) start()
})
onUnmounted(stop)

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
}
.timer-bar-label {
  text-align: center;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 1px 6px rgba(0,0,0,0.10);
}
.timer-bar-bg {
  width: 100%;
  background: #e5e7eb;
  border-radius: 9999px;
  box-shadow: 0 2px 8px 0 rgba(80, 120, 200, 0.08);
  overflow: hidden;
}
.timer-bar-progress {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.5s cubic-bezier(0.4,0,0.2,1), background 0.3s;
}
.timer-bar-pulse {
  animation: timer-bar-pulse 1s infinite alternate;
}
@keyframes timer-bar-pulse {
  0% { box-shadow: 0 0 0 0 #dc2626aa; }
  100% { box-shadow: 0 0 12px 4px #dc2626aa; }
}
</style>
