<!-- filepath: src/App.vue -->
<template>
  <div id="app">
    <header class="main-header">
      <div class="logo">
        <img src="/src/assets/vue.svg" alt="QuizSphere Logo" class="logo-img" />
        <span class="logo-text">QuizSphere</span>
      </div>
      <nav class="main-nav">
        <a href="/" class="nav-link active"><i class="fas fa-home"></i> <span class="nav-text">Home</span></a>
        <a href="https://github.com/nurudeen19/quizsphere" target="_blank" class="nav-link">
          <i class="fab fa-github"></i> <span class="nav-text">GitHub</span>
        </a>
        <button @click="showSettings = !showSettings" class="ml-2 md:ml-4 nav-link settings-btn" title="Quiz Settings">
          <i class="fas fa-cog"></i>
        </button>
        <button 
          class="mobile-menu-btn ml-1 nav-link md:hidden" 
          @click="mobileMenuOpen = !mobileMenuOpen" 
          title="Menu"
          aria-label="Mobile menu"
        >
          <i class="fas" :class="mobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
        </button>
      </nav>
    </header>
    <!-- Mobile Menu -->
    <div 
      class="mobile-menu" 
      :class="{'mobile-menu-open': mobileMenuOpen}"
      @click="mobileMenuOpen = false"
    >
      <div class="mobile-menu-content" @click.stop>
        <a href="/" class="mobile-menu-link"><i class="fas fa-home mr-2"></i> Home</a>
        <a href="https://github.com/nurudeen19/quizsphere" target="_blank" class="mobile-menu-link">
          <i class="fab fa-github mr-2"></i> GitHub
        </a>
        <button @click="openMobileSettings" class="mobile-menu-link text-left w-full">
          <i class="fas fa-cog mr-2"></i> Settings
        </button>
      </div>
    </div>
    <transition name="modal-fade-scale">
      <SettingsPanel v-if="showSettings" :key="settingsPanelKey" @settings-changed="handleSettingsChanged" @close="showSettings = false" :disabled="!!selectedTopic" />
    </transition>
    <main class="main-content">
      <section class="welcome-section">
        <h1 class="text-xl md:text-2xl lg:text-3xl xl:text-4xl">Welcome to <span class="brand">QuizSphere</span>!</h1>
        <p class="subtitle text-xs sm:text-sm md:text-base">Explore various topics and test your knowledge!</p>
      </section>
      <section v-if="selectedTopic" class="quiz-section animate-fade-in px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-10 bg-gradient-to-br from-blue-50 via-cyan-50 to-white rounded-lg md:rounded-xl lg:rounded-2xl xl:rounded-3xl shadow-lg md:shadow-xl lg:shadow-2xl border-2 border-blue-100 max-w-full md:max-w-5xl mx-auto mt-3 md:mt-4 lg:mt-6 mb-4 md:mb-6 lg:mb-8 relative flex flex-col items-center min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[600px] overflow-hidden">
        <button
          @click="selectedTopic = null"
          class="inline-flex items-center gap-1 md:gap-2 px-2 py-1 md:px-3 md:py-1 rounded-full bg-gradient-to-r from-blue-100 to-cyan-200 text-blue-800 font-semibold shadow hover:from-cyan-200 hover:to-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-1 transition-all mb-2 md:mb-3 lg:mb-4 text-xs md:text-sm lg:text-base tracking-wide drop-shadow border border-blue-200 cursor-pointer absolute left-2 md:left-4 top-2 md:top-4 z-10"
        >
          <i class="fas fa-arrow-left text-xs md:text-sm"></i> <span>Back to Topics</span>
        </button>
        <div class="flex flex-col items-center w-full max-w-full overflow-x-hidden px-1 sm:px-2 md:px-4">
          <QuizView :topic="selectedTopic" :user-settings="userSettings" />
        </div>
      </section>
      <transition name="fade-slide" mode="out-in">
        <section v-if="!selectedTopic" class="w-full min-w-0 min-h-0 animate-fade-in px-0 sm:px-2 md:px-4">
          <TopicList @select-topic="selectTopic" />        
        </section>
      </transition>
    </main>
    <footer class="main-footer">
      <span class="text-xs md:text-sm">Made with <i class="fas fa-heart"></i> by QuizSphere Team &copy; {{ new Date().getFullYear() }}</span>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import TopicList from './components/TopicList.vue'
import QuizView from './components/QuizView.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import { getUserSettings } from './quiz/quiz-utils.js'

const selectedTopic = ref(null)
function selectTopic(topic) {
  selectedTopic.value = topic
  mobileMenuOpen.value = false // Close mobile menu when selecting a topic
}

const showSettings = ref(false)
const userSettings = ref({})
const settingsPanelKey = ref(0) // for resetting panel if needed
const mobileMenuOpen = ref(false) // Track mobile menu state

// Function to handle opening settings from mobile menu
function openMobileSettings() {
  showSettings.value = true
  mobileMenuOpen.value = false
}

// Close mobile menu when screen resizes past mobile breakpoint
function handleResize() {
  if (window.innerWidth >= 768 && mobileMenuOpen.value) {
    mobileMenuOpen.value = false
  }
}

// Watch for selected topic changes to close settings if needed
watch(selectedTopic, (newValue) => {
  if (newValue && showSettings.value) {
    showSettings.value = false
  }
})

// Initialize settings from localStorage on mount and add resize listener
onMounted(() => {
  userSettings.value = getUserSettings() || {}
  window.addEventListener('resize', handleResize)
})

function handleSettingsChanged(newSettings) {
  userSettings.value = { ...newSettings }
  // Optionally close panel on save
  // showSettings.value = false
}
</script>

<style>
/* Base Styles */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  overflow-x: hidden;
  position: relative;
}

/* Header Styles */
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: linear-gradient(to right, #3b82f6, #0ea5e9);
  color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  position: sticky;
  top: 0;
  z-index: 40;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.logo-img {
  height: 1.5rem;
  width: auto;
}

.logo-text {
  font-weight: 700;
  font-size: 1.1rem;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.nav-link {
  color: white;
  padding: 0.5rem;
  text-decoration: none;
  border-radius: 0.375rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
}

.nav-link:hover,
.nav-link:focus {
  background-color: rgba(255,255,255,0.15);
  transform: translateY(-1px);
}

.settings-btn,
.mobile-menu-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.mobile-menu-btn:hover,
.settings-btn:hover {
  background-color: rgba(255,255,255,0.15);
}

/* Mobile Menu Styles */
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  z-index: 30;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.mobile-menu-open {
  opacity: 1;
  pointer-events: auto;
}

.mobile-menu-content {
  width: 75%;
  height: 100%;
  background: linear-gradient(to bottom right, #f0f9ff, #e0f2fe);
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  overflow-y: auto;
  box-shadow: -4px 0 12px rgba(0,0,0,0.1);
}

.mobile-menu-open .mobile-menu-content {
  transform: translateX(0);
}

.mobile-menu-link {
  padding: 0.75rem 1.5rem;
  color: #1e40af;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
  border-left: 4px solid transparent;
}

.mobile-menu-link:hover {
  background-color: rgba(14, 165, 233, 0.1);
  border-left: 4px solid #0ea5e9;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  padding: 0.75rem 0.5rem;
  max-width: 2400px;
  width: 100%;
  margin: 0 auto;
  overflow-x: hidden;
}

.welcome-section {
  text-align: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
}

.brand {
  background: linear-gradient(to right, #3b82f6, #0ea5e9);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: bold;
}

/* Footer Styles */
.main-footer {
  text-align: center;
  padding: 0.75rem;
  background-color: #f1f5f9;
  margin-top: auto;
  border-top: 1px solid #e2e8f0;
}

.main-footer .fa-heart {
  color: #ef4444;
}

/* Transitions */
.modal-fade-scale-enter-active,
.modal-fade-scale-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-scale-enter-from,
.modal-fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Mobile Responsive Adjustments */
@media (max-width: 640px) {
  .nav-text {
    display: none;
  }
  
  .logo-text {
    font-size: 1rem;
  }
  
  .main-header {
    padding: 0.4rem 0.5rem;
  }
  
  .welcome-section h1 {
    margin-bottom: 0.25rem;
  }
  
  .quiz-section {
    margin-left: -0.5rem;
    margin-right: -0.5rem;
    border-radius: 0.75rem;
    width: calc(100% + 1rem);
    padding: 1rem 0.75rem;
  }

  .mobile-menu-btn {
    margin-left: 0.25rem;
  }
}

/* Medium screens */
@media (min-width: 641px) and (max-width: 1023px) {
  .main-content {
    padding: 1rem;
  }
  
  .logo-img {
    height: 1.75rem;
  }

  .mobile-menu-btn {
    display: none;
  }
}

/* Large screens */
@media (min-width: 1024px) {
  .main-content {
    padding: 1.5rem;
  }
  
  .nav-link {
    padding: 0.5rem 1rem;
  }

  .main-header {
    padding: 0.5rem 1.5rem;
  }

  .logo-img {
    height: 2rem;
  }

  .mobile-menu-btn {
    display: none;
  }
}

/* Custom updates for specific components within QuizSphere */
.quiz-section {
  transition: all 0.3s ease;
}

@media (max-width: 480px) {
  .timer-bar-container {
    max-width: 100%;
    padding: 0 0.25rem;
  }
  
  .timer-bar-label {
    font-size: 1.25rem;
  }
}
</style>
