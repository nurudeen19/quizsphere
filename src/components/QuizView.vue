<template>
  <div v-if="questions.length" class="quiz">
    <h2>{{ topicTitle }}</h2>
    <div v-if="current < questions.length">
      <div class="question">
        <span>Question {{ current + 1 }} of {{ questions.length }}</span>
        <p>{{ questions[current].q }}</p>
      </div>
      <div class="options">
        <button v-for="(opt, idx) in questions[current].options" :key="idx" :disabled="answered" @click="select(idx)">
          {{ opt }}
        </button>
      </div>
      <div v-if="answered">
        <p :class="{ correct: isCorrect, wrong: !isCorrect }">
          {{ isCorrect ? 'Correct!' : 'Wrong!' }}
        </p>
        <button @click="next">Next</button>
      </div>
    </div>
    <div v-else>
      <h3>Quiz Complete!</h3>
      <p>Your score: {{ score }} / {{ questions.length }}</p>
      <button @click="$emit('back')">Back to Topics</button>
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
.quiz {
  max-width: 600px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #0001;
  padding: 2rem;
  text-align: center;
}
.question {
  margin-bottom: 1.5rem;
}
.options button {
  display: block;
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #f8f8f8;
  cursor: pointer;
  transition: background 0.2s;
}
.options button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.correct {
  color: #42b983;
  font-weight: bold;
}
.wrong {
  color: #e74c3c;
  font-weight: bold;
}
</style>
