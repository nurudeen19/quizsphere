<!-- filepath: src/App.vue -->
<template>
  <div id="app">
    <h1>Welcome to QuizSphere!</h1>
    <TopicList v-if="!selectedTopic" @select="selectTopic" />
    <QuizView v-else :topic="selectedTopic" @back="selectedTopic = null" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TopicList from './components/TopicList.vue'
import QuizView from './components/QuizView.vue'

const selectedTopic = ref(null)
function selectTopic(topic) {
  selectedTopic.value = topic
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 40px;
}
</style>