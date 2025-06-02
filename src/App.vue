<!-- filepath: src/App.vue -->
<template>
  <div id="app">
    <header class="main-header">
      <div class="logo">
        <img src="/src/assets/vue.svg" alt="QuizSphere Logo" />
        <span>QuizSphere</span>
      </div>
      <nav>
        <a href="#" class="nav-link active"><i class="fas fa-home"></i> Home</a>
        <a href="https://github.com/nurudeen19/k8s_mcq-quiz" target="_blank" class="nav-link"><i class="fab fa-github"></i> GitHub</a>
      </nav>
    </header>
    <main>
      <section class="welcome-section">
        <h1>Welcome to <span class="brand">QuizSphere</span>!</h1>
        <p class="subtitle">Test your knowledge on Kubernetes and more topics coming soon.</p>
      </section>
      <section class="quiz-section">
        <button
          v-if="selectedTopic"
          @click="selectedTopic = null"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-bold shadow-lg hover:from-cyan-400 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 transition-all mb-6 text-lg tracking-wide drop-shadow-md border-2 border-transparent hover:border-cyan-400 cursor-pointer"
        >
          <i class="fas fa-arrow-left"></i> Back to Topics
        </button>
        <TopicList v-if="!selectedTopic" @select="selectTopic" />
        <QuizView v-else :topic="selectedTopic" @back="selectedTopic = null" />
      </section>
    </main>
    <footer class="main-footer">
      <span>Made with <i class="fas fa-heart"></i> by QuizSphere Team &copy; {{ new Date().getFullYear() }}</span>
    </footer>
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
