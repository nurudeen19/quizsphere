<template>
  <div v-if="questions.length" class="quiz">
    <h2><i class="fas fa-brain"></i> {{ topicTitle }}</h2>
    <div v-if="current < questions.length">
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
        <div v-if="answered" class="feedback">
          <p :class="{ correct: isCorrect, wrong: !isCorrect }">
            <i :class="isCorrect ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
            {{ isCorrect ? 'Correct!' : 'Wrong!' }}
          </p>
          <button class="next-btn" @click="next"><i class="fas fa-arrow-right"></i> Next</button>
        </div>
      </transition>
    </div>
    <div v-else class="quiz-complete">
      <h3><i class="fas fa-trophy"></i> Quiz Complete!</h3>
      <p class="score">Your score: <span>{{ score }}</span> / {{ questions.length }}</p>
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
const selectedOptions = ref([])

watch(() => props.topic, (newTopic) => {
  if (newTopic) {
    topicTitle.value = newTopic.title
    questions.value = getQuestionsPage(0)
    current.value = 0
    score.value = 0
    answered.value = false
    selectedOptions.value = []
  }
}, { immediate: true })

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
</script>

<!-- Styles moved to style.css -->
