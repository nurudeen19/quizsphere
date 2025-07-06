<template>
  <div class="group relative bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 h-full flex flex-col">
    <!-- Image Container with better aspect ratio -->
    <div class="relative h-48 overflow-hidden">
      <img 
        :src="topic.image" 
        :alt="topic.title"
        class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
        @error="onImageError"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      
      <!-- Badges positioned over image -->
      <div class="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
        <span v-if="topic.badge" class="inline-block bg-blue-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20">
          {{ topic.badge }}
        </span>
        <span v-if="topic.level" class="inline-block bg-white/90 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
          {{ topic.level }}
        </span>
      </div>

      <!-- Title overlay at bottom of image -->
      <div class="absolute bottom-4 left-4 right-4">
        <h3 class="text-xl font-bold text-white mb-1 line-clamp-2">{{ topic.title }}</h3>
      </div>
    </div>

    <!-- Content Container -->
    <div class="p-6 flex-1 flex flex-col">
      <p class="text-blue-600 text-sm mb-6 line-clamp-3 flex-1">{{ topic.description }}</p>
      
      <!-- Footer with stats and CTA -->
      <div class="flex items-center justify-between mt-auto">
        <div class="flex items-center space-x-4">
          <span class="inline-flex items-center text-blue-700 text-sm font-semibold">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ topic.questions_count }}
          </span>
        </div>
        
        <router-link
          :to="{ name: 'topic', params: { topicKey: topic.topic_key }}"
          class="group/btn inline-flex items-center px-4 py-2 text-blue-600 hover:text-white font-medium text-sm bg-blue-50 hover:bg-blue-600 rounded-lg transition-all duration-200 hover:shadow-lg"
        >
          Start
          <svg class="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </router-link>
      </div>
    </div>

    <!-- Hover effect overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  topic: {
    type: Object,
    required: true
  }
})
function onImageError(event) {
  // Fallback to Unsplash if image fails to load
  event.target.src = `https://source.unsplash.com/featured/400x300/?${encodeURIComponent(props.topic.title)}`;
}
</script>
