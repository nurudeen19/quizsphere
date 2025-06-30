<template>
  <div class="rounded-xl bg-white shadow-lg border border-blue-100 overflow-hidden">
    <div class="aspect-w-16 aspect-h-9 relative">
      <img 
        :src="topic.image" 
        :alt="topic.title"
        class="object-cover w-full h-full"
        @error="onImageError"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div class="absolute bottom-0 left-0 right-0 p-4">
        <h3 class="text-xl font-bold text-white mb-2">{{ topic.title }}</h3>
        <div class="flex flex-wrap gap-2">
          <span v-if="topic.badge" class="inline-block bg-blue-500/80 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
            {{ topic.badge }}
          </span>
          <span v-if="topic.level" class="inline-block bg-white/80 text-blue-700 text-xs font-semibold px-2 py-1 rounded backdrop-blur-sm">
            {{ topic.level }}
          </span>
        </div>
      </div>
    </div>
    <div class="p-4">
      <p class="text-blue-600 text-sm mb-4 line-clamp-2">{{ topic.description }}</p>
      <div class="flex items-center justify-between">
        <span class="text-blue-700 text-sm font-semibold">
          {{ topic.questions_count }} Questions
        </span>
        <router-link
          :to="{ name: 'topic', params: { topicKey: topic.topic_key }}"
          class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group"
        >
          Start Learning
          <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
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
