<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50">
    <!-- Page Header -->
    <header class="bg-white/90 backdrop-blur-md border-b border-blue-100 sticky top-0 z-10 shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 class="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-900 to-cyan-700 bg-clip-text text-transparent mb-2">
              Explore Topics
            </h1>
            <p class="text-lg text-blue-600">Master technology through interactive quizzes and challenges</p>
          </div>
          
          <!-- Stats Banner -->
          <div class="flex items-center gap-6 text-sm">
            <div class="flex items-center gap-2 text-blue-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span class="font-medium">{{ filteredTopics.length }} Topics</span>
            </div>
            <div class="flex items-center gap-2 text-green-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="font-medium">{{ totalQuestions }}+ Questions</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="container mx-auto px-4">
        <div class="text-center py-16">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p class="text-xl text-blue-700 font-medium">Loading amazing topics...</p>
          <p class="text-blue-500 mt-2">Preparing your learning journey</p>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="loadError" class="container mx-auto px-4">
        <div class="text-center py-16">
          <div class="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
            <p class="text-red-600 mb-4">{{ loadError }}</p>
            <button 
              @click="retryLoading"
              class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <div v-else class="container mx-auto px-4">
        <!-- Search and Filters -->
        <div class="bg-white rounded-xl shadow-sm border border-blue-100 p-6 mb-8">
          <div class="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <!-- Search Bar -->
            <div class="relative flex-1 max-w-md">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search topics..."
                class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <!-- Filter Buttons -->
            <div class="flex flex-wrap gap-2">
              <button
                v-for="level in availableLevels"
                :key="level"
                @click="toggleLevelFilter(level)"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  selectedLevels.includes(level)
                    ? 'bg-blue-600 text-white shadow-md transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ level }}
              </button>
              
              <!-- Clear Filters -->
              <button
                v-if="searchQuery || selectedLevels.length > 0"
                @click="clearFilters"
                class="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          <!-- Active Filters Display -->
          <div v-if="searchQuery || selectedLevels.length > 0" class="mt-4 pt-4 border-t border-gray-200">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm text-gray-600 font-medium">Active filters:</span>
              
              <span v-if="searchQuery" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{{ searchQuery }}"
                <button @click="searchQuery = ''" class="ml-2 hover:text-blue-600">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
              
              <span 
                v-for="level in selectedLevels" 
                :key="level"
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {{ level }}
                <button @click="toggleLevelFilter(level)" class="ml-2 hover:text-green-600">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            </div>
          </div>
        </div>

        <!-- Results Info -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-800">
            {{ filteredTopics.length === topics.length ? 'All Topics' : `${filteredTopics.length} of ${topics.length} topics` }}
          </h2>
          
          <!-- Sort Options -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600 font-medium">Sort by:</label>
            <select 
              v-model="sortBy" 
              class="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="title">Name</option>
              <option value="questions_count">Questions Count</option>
              <option value="level">Difficulty Level</option>
            </select>
          </div>
        </div>

        <!-- No Results -->
        <div v-if="filteredTopics.length === 0" class="text-center py-16">
          <div class="bg-gray-50 rounded-xl p-8 max-w-md mx-auto">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">No topics found</h3>
            <p class="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <button 
              @click="clearFilters"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <!-- Topics Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <TopicCard
            v-for="topic in sortedTopics"
            :key="topic.topic"
            :topic="topic"
            class="transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
          />
        </div>

        <!-- Load More / Pagination (Future Enhancement) -->
        <div v-if="filteredTopics.length > 0" class="text-center mt-12">
          <p class="text-gray-600 mb-4">
            Showing {{ filteredTopics.length }} of {{ topics.length }} topics
          </p>
          <div class="flex items-center justify-center gap-2 text-sm text-blue-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>More topics coming soon!</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Enhanced Footer -->
    <footer class="bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 text-white py-8 mt-16">
      <div class="container mx-auto px-4">
        <div class="text-center">
          <h3 class="text-lg font-semibold mb-2">Love QuizSphere?</h3>
          <p class="text-blue-100 mb-4">Help us grow by starring our repository and sharing with fellow developers!</p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://github.com/nurudeen19/quizsphere" 
              target="_blank" 
              rel="noopener"
              class="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Star on GitHub
            </a>
            <div class="flex items-center gap-4 text-sm text-blue-100">
              <span>{{ topics.length }} Topics</span>
              <span>•</span>
              <span>{{ totalQuestions }}+ Questions</span>
              <span>•</span>
              <span>100% Free</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useHead } from '@vueuse/head'
import { fetchTopics } from '../services/page-utils';
import TopicCard from '../components/topics/TopicCard.vue'

const topics = ref([])
const loadError = ref("")
const isLoading = ref(true)

// Filter and search state
const searchQuery = ref('')
const selectedLevels = ref([])
const sortBy = ref('title')

// SEO metadata
useHead({
  title: 'Explore Topics - QuizSphere',
  meta: [
    {
      name: 'description',
      content: 'Browse our comprehensive collection of tech topics. Practice and master cloud computing, programming, DevOps, and more through interactive quizzes.'
    },
    {
      property: 'og:title',
      content: 'Explore Topics - QuizSphere'
    },
    {
      property: 'og:description',
      content: 'Browse our comprehensive collection of tech topics. Practice and master cloud computing, programming, DevOps, and more through interactive quizzes.'
    }
  ]
})

// Computed properties
const availableLevels = computed(() => {
  const levels = [...new Set(topics.value.map(topic => topic.level).filter(Boolean))]
  return levels.sort()
})

const totalQuestions = computed(() => {
  return topics.value.reduce((sum, topic) => sum + (topic.questions_count || 0), 0)
})

const filteredTopics = computed(() => {
  let filtered = topics.value

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(topic => 
      topic.title?.toLowerCase().includes(query) ||
      topic.description?.toLowerCase().includes(query) ||
      topic.areas?.some(area => area.name?.toLowerCase().includes(query))
    )
  }

  // Filter by selected levels
  if (selectedLevels.value.length > 0) {
    filtered = filtered.filter(topic => selectedLevels.value.includes(topic.level))
  }

  return filtered
})

const sortedTopics = computed(() => {
  const sorted = [...filteredTopics.value]
  
  switch (sortBy.value) {
    case 'title':
      return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    case 'questions_count':
      return sorted.sort((a, b) => (b.questions_count || 0) - (a.questions_count || 0))
    case 'level':
      const levelOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 }
      return sorted.sort((a, b) => (levelOrder[a.level] || 5) - (levelOrder[b.level] || 5))
    default:
      return sorted
  }
})

// Methods
const toggleLevelFilter = (level) => {
  const index = selectedLevels.value.indexOf(level)
  if (index > -1) {
    selectedLevels.value.splice(index, 1)
  } else {
    selectedLevels.value.push(level)
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedLevels.value = []
}

const retryLoading = async () => {
  loadError.value = ''
  await loadTopics()
}

const loadTopics = async () => {
  try {
    isLoading.value = true
    const response = await fetchTopics()
    
    if (response.status === 'success' && response.data) {
      topics.value = response.data.map(topic => ({
        ...topic,
        topic: topic.topic_key,
        badge: topic.badge || 'Quiz',
        level: topic.level || 'Intermediate',
        description: topic.description || 'This quiz covers the following key areas:',
        areas: topic.topic_areas || [],
        questionsCount: topic.questions_count || 0,
        image: topic.icon || `https://source.unsplash.com/featured/400x300/?${encodeURIComponent(topic.title)}`
      }))
    } else {
      throw new Error(response.message || 'Failed to load topics data')
    }
  } catch (error) {
    console.error('Failed to fetch topics:', error)
    loadError.value = error.response?.data?.message || error.message || 'Failed to load topics. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadTopics)
</script>
