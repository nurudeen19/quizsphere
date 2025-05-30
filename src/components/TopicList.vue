<template>
  <div class="topic-list">
    <h2>Select a Quiz Topic</h2>
    <ul>
      <li v-for="topic in topics" :key="topic.topic">
        <button @click="$emit('select', topic)">{{ topic.title }}</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const topics = ref([])

onMounted(async () => {
  const res = await fetch('/src/data/topics.json')
  topics.value = await res.json()
})
</script>

<style scoped>
.topic-list {
  margin: 2rem auto;
  max-width: 400px;
  text-align: center;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin: 1rem 0;
}
button {
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  border-radius: 8px;
  border: none;
  background: #42b983;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}
button:hover {
  background: #369870;
}
</style>
