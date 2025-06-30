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
          @before-leave="beforeLeave"
          @enter="enter"
          @after-enter="afterEnter"
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

