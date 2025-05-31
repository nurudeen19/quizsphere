<template>
  <div class="topic-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 py-8 px-4">
    <div v-for="topic in topics" :key="topic.topic" class="topic-card-new bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center p-6 transition-transform duration-150 hover:-translate-y-1 hover:shadow-2xl">
      <div class="avatar-wrapper mb-4">
        <img :src="topic.image || '/vite.svg'" alt="Topic image" class="avatar-img w-20 h-20 object-cover rounded-full border-4 border-blue-100 shadow" />
      </div>
      <h2 class="text-xl font-semibold text-gray-800 mb-1 text-center">{{ topic.title }}</h2>
      <p class="text-gray-500 text-sm mb-4 text-center min-h-[32px]">{{ topic.description || 'Test your knowledge on this topic.' }}</p>
      <button @click="$emit('select', topic)" class="start-quiz-btn-new w-full py-3 rounded-full font-bold text-base flex items-center justify-center gap-2 mt-auto transition-all">
        <span class="icon-wrapper-new flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow">
          <i class="fas fa-play"></i>
        </span>
        <span>Start Quiz</span>
      </button>
    </div>
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
  margin: 0 auto;
  padding-top: 2rem;
  padding-bottom: 2rem;
  max-width: 1200px;
}
.topic-card-new {
  /* Remove margin-bottom */
  padding-top: 1rem;
  padding-bottom: 1rem;
  min-width: 0;
  min-height: 260px;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 1.25rem;
  box-shadow: 0 2px 12px #0001;
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.2s, transform 0.15s;
}
.topic-card-new:hover {
  box-shadow: 0 8px 32px #00c6ff22, 0 4px 16px #0001;
  transform: translateY(-4px) scale(1.03);
}
.avatar-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5.5rem;
  height: 5.5rem;
  background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
  border-radius: 9999px;
  margin-bottom: 1rem;
}
.avatar-img {
  border-radius: 9999px;
  border: 4px solid #bae6fd;
  background: #f1f5f9;
}
.start-quiz-btn-new {
  background: linear-gradient(90deg, #2563eb 0%, #06b6d4 100%);
  color: #fff;
  border: none;
  box-shadow: 0 2px 8px #06b6d422;
  font-size: 1.15rem;
  padding-top: 0.65rem;
  padding-bottom: 0.65rem;
  padding-left: 1rem;
  padding-right: 1rem;
  min-height: 1.75rem;
  margin-top: 1.5rem;
  border-radius: 9999px;
  letter-spacing: 0.5px;
  font-weight: 700;
  cursor: pointer;
}
.start-quiz-btn-new:hover, .start-quiz-btn-new:focus {
  background: linear-gradient(90deg, #06b6d4 0%, #2563eb 100%);
  box-shadow: 0 4px 16px #06b6d433;
  transform: translateY(-2px) scale(1.04);
  outline: none;
}
.icon-wrapper-new {
  font-size: 1.1rem;
  width: 1.25rem;
  height: 1.25rem;
  background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
  box-shadow: 0 1px 4px #06b6d422;
}
@media (max-width: 1024px) {
  .topic-list {
    max-width: 900px;
  }
}
@media (max-width: 768px) {
  .topic-list {
    max-width: 700px;
    gap: 1.5rem;
  }
}
@media (max-width: 640px) {
  .topic-list {
    max-width: 98vw;
    gap: 1rem;
  }
  .topic-card-new {
    min-width: 90vw;
    max-width: 100vw;
  }
}
</style>
