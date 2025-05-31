<template>
  <div v-if="questions.length" class="max-w-xl mx-auto bg-[#232526] rounded-2xl shadow-lg p-8 pt-10 text-center animate-fadeIn">
    <h2 class="text-cyan-400 mb-6 text-2xl flex items-center justify-center gap-2 font-bold drop-shadow"> <i class="fas fa-brain"></i> {{ topicTitle }}</h2>
    <div v-if="current < questions.length">
      <div class="mb-6">
        <span class="block text-gray-400 text-base mb-2">Question {{ current + 1 }} of {{ questions.length }}</span>
        <p class="text-lg font-semibold mb-4 text-blue-50">{{ questions[current].q }}</p>
      </div>
      <div class="mb-6">
        <button v-for="(opt, idx) in questions[current].options" :key="idx" :disabled="answered"
          @click="select(idx)"
          class="flex items-center w-full my-2 px-5 py-3 text-base rounded-lg border border-cyan-300/30 bg-gradient-to-r from-[#232526] to-[#414345] text-blue-50 font-medium gap-3 shadow-sm transition-all duration-150 hover:from-[#232526] hover:to-cyan-900 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed">
          <span class="font-bold text-cyan-400 mr-2">{{ String.fromCharCode(65 + idx) }}.</span> {{ opt }}
        </button>
      </div>
      <transition name="fade">
        <div v-if="answered" class="mt-4">
          <p :class="isCorrect ? 'text-cyan-400 font-bold flex items-center gap-2 text-lg' : 'text-red-500 font-bold flex items-center gap-2 text-lg'">
            <i :class="isCorrect ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
            {{ isCorrect ? 'Correct!' : 'Wrong!' }}
          </p>
          <button class="next-btn mt-5 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold flex items-center gap-2 shadow transition-all hover:from-blue-600 hover:to-cyan-400 focus:outline-none" @click="next">
            <i class="fas fa-arrow-right"></i> Next
          </button>
        </div>
      </transition>
    </div>
    <div v-else class="quiz-complete mt-8">
      <h3 class="text-2xl text-yellow-400 font-bold flex items-center justify-center gap-2 mb-4"><i class="fas fa-trophy"></i> Quiz Complete!</h3>
      <p class="score text-lg mb-4 text-blue-50">Your score: <span class="text-cyan-400 font-bold text-xl">{{ score }}</span> / {{ questions.length }}</p>
      <button class="back-btn px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold flex items-center gap-2 shadow transition-all hover:from-blue-600 hover:to-cyan-400 focus:outline-none" @click="$emit('back')">
        <i class="fas fa-arrow-left"></i> Back to Topics
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getQuestionsPage, PAGE_SIZE } from '../quiz/kubernetes.js'

const props = defineProps({
  topic: Object
})

const questions = ref([])
const current = ref(0)
const score = ref(0)
const answered = ref(false)
const isCorrect = ref(false)
const topicTitle = ref('')

watch(() => props.topic, (newTopic) => {
  if (newTopic) {
    topicTitle.value = newTopic.title
    questions.value = getQuestionsPage(0)
    current.value = 0
    score.value = 0
    answered.value = false
  }
}, { immediate: true })

function select(idx) {
  answered.value = true
  isCorrect.value = questions.value[current.value].answers.includes(idx)
  if (isCorrect.value) score.value++
}
function next() {
  current.value++
  answered.value = false
}
</script>

<style scoped>
/**** Custom CSS for animation and fallback ****/
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: none; }
}
.animate-fadeIn {
  animation: fadeIn 0.7s;
}
/**** Keep only custom/fallback styles below ****/
.score span {
  color: #00c6ff;
  font-weight: bold;
  font-size: 1.3rem;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
