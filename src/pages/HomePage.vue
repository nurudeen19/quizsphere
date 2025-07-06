<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
      <div class="absolute inset-0 overflow-hidden [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]">
        <div class="absolute inset-0 grid place-items-center">
          <div class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-4 md:gap-6 lg:gap-8 opacity-75">
            <template v-for="n in 96" :key="n">
              <Squares2X2Icon 
                class="w-4 h-4 sm:w-5 sm:h-5 text-blue-200/30 transform transition-all duration-700 hover:text-blue-300/40 hover:rotate-90"
                :style="{ 'animation-delay': `${n * 50}ms` }"
              />
            </template>
          </div>
        </div>
      </div>
      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#featured-topics" class="flex flex-col items-center text-blue-600/70 hover:text-blue-600 transition-colors" aria-label="Scroll to featured topics">
          <span class="text-sm font-medium mb-2">Explore More</span>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
      <div class="relative container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
            Level Up Your Tech Skills with Interactive Quizzes
          </h1>
          <p class="text-lg lg:text-xl text-blue-700 mb-8 leading-relaxed">
            Master cloud computing, programming, and DevOps through hands-on practice. 
            Join thousands of developers improving their skills with QuizSphere.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/topics"
              class="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start Learning
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </router-link>
            <a
              href="#featured-topics"
              class="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold text-blue-600 bg-white rounded-lg hover:bg-blue-50 border-2 border-blue-200 transition-all"
            >
              Explore Topics
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-12 bg-white/80 backdrop-blur-sm border-y border-blue-100">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div v-if="isLoading" class="col-span-2 lg:col-span-4 py-8">
            <div class="animate-pulse flex flex-col items-center space-y-4">
              <div class="h-8 w-24 bg-blue-200 rounded"></div>
              <div class="h-4 w-32 bg-blue-100 rounded"></div>
            </div>
          </div>
          <template v-else>
            <StatsCard
              v-for="stat in stats"
              :key="stat.label"
              :value="stat.value"
              :label="stat.label"
              :icon="stat.icon"
              class="transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            />
          </template>
        </div>
      </div>
    </section>

    <!-- Featured Topics -->
    <section id="featured-topics" class="py-16">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-blue-900 mb-4">Popular Learning Paths</h2>
          <p class="text-lg text-blue-600">Start your journey with our most popular topics</p>
        </div>
        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div v-for="n in 6" :key="n" class="animate-pulse">
            <div class="rounded-xl bg-white shadow-lg border border-blue-100 overflow-hidden">
              <div class="aspect-w-16 aspect-h-9 bg-blue-100"></div>
              <div class="p-4 space-y-3">
                <div class="h-4 bg-blue-100 rounded w-3/4"></div>
                <div class="h-3 bg-blue-50 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <TopicCard
            v-for="topic in featuredTopics"
            :key="topic.id"
            :topic="topic"
            class="featured-card"
            :aria-label="'Learn about ' + topic.title"
          />
        </div>
        <div class="text-center">
          <router-link
            to="/topics"
            class="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-lg group"
          >
            View All Topics
            <svg class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="py-16 bg-white/80 backdrop-blur-sm border-y border-blue-100">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-blue-900 mb-4">Why Choose QuizSphere?</h2>
          <p class="text-lg text-blue-600">Experience a better way to learn and validate your skills</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            v-for="feature in features"
            :key="feature.title"
            :title="feature.title"
            :description="feature.description"
            :icon="feature.icon"
          />
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-6">Ready to Start Your Learning Journey?</h2>
        <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join our community of learners and take the first step towards mastering new skills
        </p>
        <router-link
          to="/topics"
          class="inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
        >
          Get Started Now
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchHomepageData } from '../services/page-utils';
import FeatureCard from '../components/home/FeatureCard.vue'
import TopicCard from '../components/home/TopicCard.vue'
import StatsCard from '../components/home/StatsCard.vue'
import { Squares2X2Icon } from '@heroicons/vue/24/outline'

const isLoading = ref(true)
const featuredTopics = ref([])
// Define types for better type safety
const stats = ref([
  { label: 'Active Topics', value: '0', icon: 'book', key: 'totalTopics' },
  { label: 'Total Questions', value: '0', icon: 'question', key: 'totalQuestions' },
  { label: 'Learning Paths', value: '0', icon: 'academic', key: 'totalLearningPaths' },
  { label: 'Daily Active Users', value: '0', icon: 'users', key: 'dailyActiveUsers' }
])

const features = [
  {
    title: 'Practice-Driven Learning',
    description: 'Learn through hands-on practice with real-world scenarios and challenges',
    icon: 'academic'
  },
  {
    title: 'Progress Tracking',
    description: 'Monitor your learning journey with detailed progress analytics',
    icon: 'chart'
  },
  {
    title: 'Comprehensive Coverage',
    description: 'Wide range of topics covering the latest in tech and cloud computing',
    icon: 'cloud'
  },
  {
    title: 'Regular Updates',
    description: 'Content regularly updated to keep pace with industry changes',
    icon: 'refresh'
  },
  {
    title: 'Flexible Learning',
    description: 'Learn at your own pace with bite-sized chapters and quizzes',
    icon: 'clock'
  },
  {
    title: 'Community Driven',
    description: 'Join a community of learners and contribute to the platform',
    icon: 'users'
  }
]

// Optimized data fetching
onMounted(async () => {
  try {
    // Fetch homepage data with optimized response
    let sections = {'featuredTopics': true, 'statistics': true};
    const response = await fetchHomepageData(sections, { featured_topics_limit: 6 })
    if (response.status === 'success' && response.data) {
      const { featuredTopics: featured, statistics } = response.data

      // Set featured topics directly from API
      featuredTopics.value = featured.map(topic => ({
        ...topic,
        image: topic.icon || `https://source.unsplash.com/featured/400x300/?${encodeURIComponent(topic.title)}`
      }))
      
      // Update stats from pre-calculated values
      stats.value.forEach(stat => {
        stat.value = statistics[stat.key]?.toString() || '0'
      })
    }
  } catch (error) {
    console.error('Failed to fetch homepage data:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.featured-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.featured-card:hover {
  transform: translateY(-4px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 1024px) {
  .featured-card:nth-child(3n-1) {
    transform: translateY(2rem);
  }
  
  .featured-card:nth-child(3n-1):hover {
    transform: translateY(calc(2rem - 4px));
  }
  
  .featured-card:nth-child(1) { animation-delay: 100ms; }
  .featured-card:nth-child(2) { animation-delay: 200ms; }
  .featured-card:nth-child(3) { animation-delay: 300ms; }
  .featured-card:nth-child(4) { animation-delay: 400ms; }
  .featured-card:nth-child(5) { animation-delay: 500ms; }
  .featured-card:nth-child(6) { animation-delay: 600ms; }
}

/* Add smooth scrolling behavior */
html {
  scroll-behavior: smooth;
}
</style>
