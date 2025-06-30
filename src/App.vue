<!-- filepath: src/App.vue -->
<template>
  <div id="app" class="min-h-screen">
    <MainNav />
    
    <!-- Error Toast -->
    <transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="errorMessage"
        class="fixed bottom-4 right-4 z-50 max-w-md w-full bg-red-50 border border-red-200 rounded-lg shadow-lg pointer-events-auto"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3 w-0 flex-1">
              <p class="text-sm font-medium text-red-800">
                {{ errorMessage }}
              </p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="errorMessage = ''"
                class="rounded-md inline-flex text-red-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <span class="sr-only">Close</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Main Content with Route Transitions -->
    <main class="pt-16">
      <router-view v-slot="{ Component, route }">
        <transition
          enter-active-class="transform-gpu transition-all duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transform-gpu transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-4"
          mode="out-in"
        >
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>

    <!-- Settings Panel -->
    <transition
      enter-active-class="transform transition-transform duration-300"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transform transition-transform duration-200"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <SettingsPanel 
        v-if="showSettings" 
        :key="settingsPanelKey" 
        @settings-changed="handleSettingsChanged" 
        @close="showSettings = false" 
      />
    </transition>

    <!-- Main Content -->
    <main class="pt-16">
      <router-view v-slot="{ Component }">
        <transition 
          name="page" 
          mode="out-in"
          @before-leave="beforeLeave"
          @enter="enter"
          @after-enter="afterEnter"
        >
          <component :is="Component" :key="$route.fullPath" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, provide, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import MainNav from './components/layout/MainNav.vue'
import SettingsPanel from './components/SettingsPanel.vue'

// Initialize settings store
const userSettings = ref({})

// Global metadata
useHead({
  titleTemplate: '%s - QuizSphere',
  meta: [
    { name: 'theme-color', content: '#3b82f6' },
    { 
      name: 'description', 
      content: 'Master tech skills with interactive quizzes. Practice cloud computing, programming, and DevOps through hands-on learning.' 
    },
    { property: 'og:site_name', content: 'QuizSphere' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
  ]
})

const router = useRouter()
const showSettings = ref(false)
const settingsPanelKey = ref(0)
const errorMessage = ref('')
const mobileMenuOpen = ref(false)

// Provide error handling to child components
const showError = (message) => {
  errorMessage.value = message
  setTimeout(() => {
    errorMessage.value = ''
  }, 5000)
}
provide('showError', showError)

// Global error handler
const handleError = (error) => {
  console.error('App Error:', error)
  showError(error.message || 'An unexpected error occurred. Please try again.')
}
provide('handleError', handleError)

// Route error handling
router.onError((error) => {
  handleError(error)
})

function openMobileSettings() {
  showSettings.value = true
  mobileMenuOpen.value = false
}

function handleSettingsChanged(settings) {
  // Update settings in the reactive store
  userSettings.value = { ...settings }
  // Increment key to force settings panel to re-render with new values
  settingsPanelKey.value++
}

// Page transition handlers
function beforeLeave(el) {
  document.documentElement.style.overflow = 'hidden'
}

function enter(el) {
  document.documentElement.style.overflow = 'hidden'
}

function afterEnter(el) {
  document.documentElement.style.overflow = ''
}

// Close mobile menu when screen resizes past mobile breakpoint
function handleResize() {
  if (window.innerWidth >= 768 && mobileMenuOpen.value) {
    mobileMenuOpen.value = false
  }
}

// Initialize settings from localStorage on mount and add resize listener
onMounted(() => {
  const savedSettings = localStorage.getItem('quizsphere-settings')
  if (savedSettings) {
    try {
      userSettings.value = JSON.parse(savedSettings)
    } catch (error) {
      handleError(new Error('Failed to load saved settings'))
    }
  }
  window.addEventListener('resize', handleResize)
})

// Cleanup on unmount
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Watch for settings changes to store them
watch(userSettings, (newSettings) => {
  if (Object.keys(newSettings).length > 0) {
    localStorage.setItem('quizsphere-settings', JSON.stringify(newSettings))
  }
}, { deep: true })
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
