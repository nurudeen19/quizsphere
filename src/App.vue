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
          class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-bold shadow-lg hover:from-cyan-400 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 transition-all mb-6 text-lg tracking-wide drop-shadow-md"
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

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 2.5vw;
  background: #fff;
  box-shadow: 0 2px 8px #0002;
  position: sticky;
  top: 0;
  z-index: 10;
}
.logo {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #00c6ff;
}
.logo img {
  width: 36px;
  margin-right: 0.7rem;
  filter: drop-shadow(0 0 4px #00c6ff88);
}
nav {
  display: flex;
  gap: 1.5rem;
}
.nav-link {
  color: #222;
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.2s;
}
.nav-link.active, .nav-link:hover {
  color: #00c6ff;
}
main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem 0 3rem 0;
}
.welcome-section {
  text-align: center;
  margin-bottom: 2.5rem;
}
.brand {
  color: #00c6ff;
  font-weight: bold;
  text-shadow: 0 2px 8px #00c6ff33;
}
.subtitle {
  color: #555;
  font-size: 1.2rem;
  margin-top: 0.5rem;
}
.quiz-section {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
.main-footer {
  background: #fff;
  text-align: center;
  padding: 1rem 0;
  font-size: 1rem;
  color: #888;
  box-shadow: 0 -2px 8px #0002;
}
.main-footer i.fa-heart {
  color: #00c6ff;
}
@media (max-width: 600px) {
  .main-header, .main-footer {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .quiz-section {
    padding: 0 1rem;
  }
}
</style>