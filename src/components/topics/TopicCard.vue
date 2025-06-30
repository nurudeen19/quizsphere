<template>
  <div 
    class="topic-card bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
    :class="{ 'animate-fadeIn': true }"
  >
    <div class="aspect-w-16 aspect-h-9 relative">
      <img 
        :src="topic.image" 
        :alt="topic.title"
        class="object-cover w-full h-full"
        @error="onImageError"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
      <div class="absolute bottom-0 left-0 right-0 p-4">
        <div class="flex flex-wrap gap-2 mb-2">
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
      <h3 class="text-xl font-bold text-blue-900 mb-2 line-clamp-2">{{ topic.title }}</h3>
      <p class="text-blue-600 text-sm mb-4 line-clamp-2">{{ topic.description }}</p>
      
      <div class="space-y-3">
        <div v-if="topic.areas?.length" class="space-y-2">
          <ul class="text-sm text-blue-700 space-y-1">
            <li 
              v-for="(area, idx) in topic.areas.slice(0, 3)" 
              :key="idx"
              class="flex items-center"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></span>
              <span class="line-clamp-1">{{ area }}</span>
            </li>
          </ul>
          <span 
            v-if="topic.areas.length > 3" 
            class="text-xs text-blue-500"
          >
            +{{ topic.areas.length - 3 }} more areas
          </span>
        </div>

        <div class="pt-4 border-t border-blue-50">
          <div class="flex items-center justify-between">
            <span class="text-blue-700 text-sm font-semibold">
              {{ topic.questionsCount }} Questions
            </span>
            <button
              @click="$emit('select', topic)"
              class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {{ hasProgress ? 'Continue' : 'Start Quiz' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  topic: {
    type: Object,
    required: true
  }
})

defineEmits(['select'])

const hasProgress = computed(() => {
  const chapterStateStr = localStorage.getItem(`quizsphere-chapter-state-${props.topic.topic}`)
  const overallStateStr = localStorage.getItem(`quizsphere-overall-state-${props.topic.topic}`)
  
  if (!chapterStateStr && !overallStateStr) return false
  
  try {
    if (chapterStateStr) {
      const state = JSON.parse(chapterStateStr)
      if (state?.questions?.length) return true
    }
    if (overallStateStr) {
      const state = JSON.parse(overallStateStr)
      if (state?.chapters && Object.keys(state.chapters).length) return true
    }
    return false
  } catch {
    return false
  }
})

function onImageError(event) {
  event.target.src = `https://source.unsplash.com/featured/400x300/?${encodeURIComponent(props.topic.title)}`;
}
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.topic-card:nth-child(1) { animation-delay: 0.1s; }
.topic-card:nth-child(2) { animation-delay: 0.2s; }
.topic-card:nth-child(3) { animation-delay: 0.3s; }
.topic-card:nth-child(4) { animation-delay: 0.4s; }
</style>
