<!-- filepath: src/App.vue -->
<template>
  <div id="app">
    <header class="main-header">
      <div class="logo">
        <img src="/src/assets/vue.svg" alt="QuizSphere Logo" />
        <span>QuizSphere</span>
      </div>
      <nav>
        <a href="/" class="nav-link active"><i class="fas fa-home"></i> Home</a>
        <a href="https://github.com/nurudeen19/quizsphere" target="_blank" class="nav-link"><i class="fab fa-github"></i> GitHub</a>
        <button @click="showSettings = !showSettings" class="ml-4 nav-link settings-btn" title="Quiz Settings">
          <i class="fas fa-cog"></i>
        </button>
      </nav>
    </header>
    <transition name="modal-fade-scale">
      <SettingsPanel v-if="showSettings" :key="settingsPanelKey" @settings-changed="handleSettingsChanged" @close="showSettings = false" :disabled="!!selectedTopic" />
    </transition>
    <main>
      <section class="welcome-section">
        <h1>Welcome to <span class="brand">QuizSphere</span>!</h1>
        <p class="subtitle">Explore various topics and test your knowledge!</p>
      </section>
      <section v-if="selectedTopic" class="quiz-section animate-fade-in px-2 py-6 md:px-8 md:py-10 bg-gradient-to-br from-blue-50 via-cyan-50 to-white rounded-3xl shadow-2xl border-2 border-blue-100 max-w-5xl mx-auto mt-6 mb-8 relative flex flex-col items-center min-h-[600px]">
        <button
          @click="selectedTopic = null"
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-cyan-200 text-blue-800 font-semibold shadow hover:from-cyan-200 hover:to-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 transition-all mb-4 text-base tracking-wide drop-shadow border border-blue-200 cursor-pointer absolute left-4 top-4 z-10"
        >
          <i class="fas fa-arrow-left text-sm"></i> Back to Topics
        </button>
        <div class="flex flex-col items-center w-full max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto">
          <QuizView :topic="selectedTopic" :user-settings="userSettings" />
        </div>
      </section>
      <transition name="fade-slide" mode="out-in">
        <section v-if="!selectedTopic" class="w-full min-w-0 min-h-0 animate-fade-in">
          <TopicList @select-topic="selectTopic" />        
        </section>
      </transition>
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
import SettingsPanel from './components/SettingsPanel.vue'

const selectedTopic = ref(null)
function selectTopic(topic) {
  selectedTopic.value = topic
}

const showSettings = ref(false)
const userSettings = ref({})
const settingsPanelKey = ref(0) // for resetting panel if needed

function handleSettingsChanged(newSettings) {
  userSettings.value = { ...newSettings }
  // Optionally close panel on save
  // showSettings.value = false
}
</script>

<style>
/* ...existing styles... */
</style>
