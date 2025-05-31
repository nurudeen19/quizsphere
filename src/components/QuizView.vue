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
      <button class="back-btn" @click="$emit('back')"><i class="fas fa-arrow-left"></i> Back to Topics</button>
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

<style scoped>
.quiz {
  max-width: 600px;
  margin: 2rem auto;
  background: #f6fafd;
  color: #1a2233;
  border-radius: 16px;
  box-shadow: 0 2px 16px #00c6ff22;
  padding: 2.5rem 2rem 2rem 2rem;
  text-align: center;
  animation: fadeIn 0.7s;
}
.quiz h2 {
  color: #0072ff;
  margin-bottom: 1.5rem;
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-shadow: 0 2px 8px #00c6ff33;
}
.progress {
  color: #b0b8c1;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  display: block;
}
.question-text {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 1.2rem;
  color: #1a2233;
}
.options {
  margin-bottom: 1.2rem;
}
.option-row {
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
  border-radius: 8px;
  transition: background 0.2s;
  max-width: 480px;
}
.option-row:hover {
  background: #e6f6ff;
}
.option-row input[type="radio"],
.option-row input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  background-color: #fff;
  border: 2px solid #b0b8c1;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  margin-right: 0.75rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  cursor: pointer;
  position: relative;
  vertical-align: middle;
}
.option-row input[type="checkbox"] {
  border-radius: 6px;
}
.option-row input[type="radio"]:checked {
  border-color: #00c6ff;
  box-shadow: 0 0 0 2px #00c6ff33;
}
.option-row input[type="checkbox"]:checked {
  border-color: #00c6ff;
  box-shadow: 0 0 0 2px #00c6ff33;
  background-color: #00c6ff22;
}
.option-row input[type="radio"]:checked::after {
  content: '';
  display: block;
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: #00c6ff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.option-row input[type="checkbox"]:checked::after {
  content: '';
  display: block;
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 3px;
  background: #00c6ff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.option-row input[type="radio"]:focus,
.option-row input[type="checkbox"]:focus {
  border-color: #0072ff;
  box-shadow: 0 0 0 2px #0072ff33;
}
.option-row input[type="radio"]:disabled,
.option-row input[type="checkbox"]:disabled {
  background: #f0f4f8;
  border-color: #d1d5db;
  cursor: not-allowed;
}
.options button {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.85rem 1.2rem;
  font-size: 1.05rem;
  border-radius: 8px;
  border: 1px solid #00c6ff44;
  background: linear-gradient(90deg, #232526 0%, #414345 100%);
  color: #e0eafc;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
  box-shadow: 0 1px 4px #00c6ff22;
  gap: 0.7rem;
  font-weight: 500;
}
.options button.next-btn {
  background: linear-gradient(90deg, #00c6ff 0%, #00e0ff 100%);
  color: #fff;
  border: none;
  border-radius: 9999px;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 0.9rem 2.2rem;
  margin: 1.2rem auto 0 auto;
  box-shadow: 0 2px 12px #00c6ff33;
  letter-spacing: 0.5px;
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  width: auto;
  min-width: 160px;
  justify-content: center;
}
.options button.next-btn:hover,
.options button.next-btn:focus {
  background: linear-gradient(90deg, #00e0ff 0%, #00c6ff 100%);
  box-shadow: 0 4px 20px #00c6ff44;
  transform: translateY(-2px) scale(1.04);
  outline: none;
}
.options button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.feedback {
  margin-top: 1.2rem;
}
.correct {
  color: #00c6ff;
  font-weight: bold;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.wrong {
  color: #e74c3c;
  font-weight: bold;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.next-btn, .back-btn {
  margin-top: 1.2rem;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  border-radius: 8px;
  border: none;
  background: linear-gradient(90deg, #00c6ff 0%, #0072ff 100%);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
  box-shadow: 0 1px 4px #00c6ff22;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-weight: 500;
}
.next-btn:hover, .back-btn:hover {
  background: linear-gradient(90deg, #0072ff 0%, #00c6ff 100%);
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 4px 16px #00c6ff33;
}
.quiz-complete {
  margin-top: 2rem;
}
.score {
  font-size: 1.2rem;
  margin: 1.2rem 0;
  color: #1a2233;
}
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
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: none; }
}
</style>
