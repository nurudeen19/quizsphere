<template>
  <div v-if="loadError" class="text-center text-red-600 font-bold py-8">{{ loadError }}</div>
  <div v-else class="grid grid-cols-4 gap-x-8 gap-y-8 my-16 mx-12">
    <div v-for="topic in topics" :key="topic.topic" class="topic-card-ghcert bg-gradient-to-br from-cyan-50 via-blue-100 to-blue-200 rounded-2xl shadow-xl border border-blue-200 flex flex-col h-full transition-transform duration-150 hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden">
      <div class="topic-card-header flex flex-row items-center gap-4 p-6 pb-2 pr-20 min-h-[88px] bg-gradient-to-r from-blue-200 via-cyan-100 to-white border-b border-blue-200">
        <img :src="topic.image || `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic.title)}`" @error="onImageError($event, topic.title)" alt="Topic image" class="avatar-img w-16 h-16 object-cover rounded-full border-4 border-cyan-200 shadow" />
        <div class="flex-1 flex flex-col justify-center">
          <h2 class="text-xl font-bold text-blue-900 mb-1 leading-tight">{{ topic.title }}</h2>
          <div class="flex flex-row items-center gap-2 mt-1">
            <span v-if="topic.badge" class="inline-block bg-gradient-to-br from-blue-400 to-cyan-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow mb-2">{{ topic.badge }}</span>
            <span v-if="topic.level" class="inline-block bg-blue-100 text-cyan-700 text-xs font-semibold px-2 py-1 rounded mb-2">{{ topic.level }}</span>
          </div>
          <div class="flex flex-row flex-wrap gap-2 mt-1">
            <span v-if="topic.questions" class="inline-block bg-cyan-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">{{ topic.questions }} Questions</span>
          </div>
        </div>
      </div>
      <div class="flex-1 flex flex-col justify-between p-6 pt-3 card-content-padding bg-white/80 h-full">
        <p
          class="topic-description text-cyan-700 text-[15px] italic font-semibold mb-2 text-left tracking-wide drop-shadow-sm flex items-center"
          :class="{ 'expanded': expandedDescriptions[topic.topic] || hoveredDescription === topic.topic }"
          ref="el => setDescriptionRef(topic.topic, el)"
          @mouseenter="hoveredDescription = topic.topic"
          @mouseleave="hoveredDescription = null"
        >
          {{ topic.description || 'This quiz covers the following key areas:' }}
          <span v-if="showReadMore[topic.topic] && !(expandedDescriptions[topic.topic] || hoveredDescription === topic.topic)" class="truncate-indicator">&nbsp;…</span>
        </p>
        <button v-if="showReadMore[topic.topic] && !expandedDescriptions[topic.topic]" class="read-more-btn text-xs text-blue-700 underline font-semibold mb-2 ml-1" @click="expandDescription(topic.topic)">Read more</button>
        <button v-if="expandedDescriptions[topic.topic]" class="read-more-btn text-xs text-blue-700 underline font-semibold mb-2 ml-1" @click="collapseDescription(topic.topic)">Show less</button>
        <ul v-if="topic.areas && topic.areas.length" class="topic-areas-animated list-none text-xs text-blue-800 mb-3 pl-0 min-h-[48px] flex flex-wrap items-start">
          <li v-for="(area, idx) in topic.areas" :key="area" :style="{ animationDelay: (0.05 * idx) + 's' }" class="topic-area-bullet animate-fadein-left flex items-center w-full sm:w-1/2 md:w-full lg:w-1/2 xl:w-full">
            <span class="custom-bullet mr-2"></span>{{ area }}
          </li>
        </ul>
        <div class="flex flex-col gap-1 mt-auto items-start">
          <span v-if="topic.questionsCount !== undefined" class="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded mb-1">{{ topic.questionsCount }} Questions</span>
          <div class="flex flex-row gap-2 w-full">
            <QuizButton
              v-if="getQuizState(topic.topic)"
              :label="'Continue Quiz'"
              colorClass="bg-yellow-400 hover:bg-yellow-500 text-gray-900"
              :aria="`Continue quiz for ${topic.title}`"
              :click="() => $emit('selectTopic', topic)"
            />
            <QuizButton
              v-else
              :label="'Start Quiz'"
              colorClass="''"
              :aria="`Start quiz for ${topic.title}`"
              :click="() => $emit('selectTopic', topic)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <footer class="w-full text-center py-6 mt-8 text-sm text-blue-800 bg-gradient-to-r from-cyan-50 via-blue-100 to-blue-200 border-t border-blue-200">
    <span>
      🚀 If you found QuizSphere helpful, please <a href="https://github.com/nurudeen19/quizsphere" target="_blank" rel="noopener" class="text-blue-700 underline font-semibold hover:text-blue-900">star our GitHub repo</a> and help others discover this free resource!
    </span>
  </footer>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import QuizButton from './QuizButton.vue'
import { topicAreas } from './topicAreas.js'
import { fetchQuestions } from '../quiz/quiz-utils.js'

const emit = defineEmits(['selectTopic'])
function onImageError(event, title) {
  // Fallback to Unsplash if Wikimedia fails
  event.target.src = `https://source.unsplash.com/featured/256x256/?${encodeURIComponent(title)}`;
}

function getQuizState(topicKey) {
  // Use the same keys as QuizView.vue
  const chapterStateStr = localStorage.getItem(`quizsphere-chapter-state-${topicKey}`)
  const overallStateStr = localStorage.getItem(`quizsphere-overall-state-${topicKey}`)
  if (!chapterStateStr && !overallStateStr) return false
  // If either state exists, consider quiz as started
  try {
    if (chapterStateStr) {
      const state = JSON.parse(chapterStateStr)
      if (state && state.questions && state.questions.length) return true
    }
    if (overallStateStr) {
      const state = JSON.parse(overallStateStr)
      if (state && state.chapters && Object.keys(state.chapters).length) return true
    }
    return false
  } catch {
    return false
  }
}

const topics = ref([])
const loadError = ref("")

// --- Description expand/collapse logic ---
const expandedDescriptions = ref({})
const showReadMore = ref({})
const descriptionRefs = ref({})
const hoveredDescription = ref(null)

function setDescriptionRef(topicKey, el) {
  if (el) descriptionRefs.value[topicKey] = el
}
function expandDescription(topicKey) {
  expandedDescriptions.value[topicKey] = true
}
function collapseDescription(topicKey) {
  expandedDescriptions.value[topicKey] = false
}
function checkOverflow() {
  nextTick(() => {
    for (const topic of topics.value) {
      const el = descriptionRefs.value[topic.topic]
      if (el) {
        showReadMore.value[topic.topic] = el.scrollHeight > el.clientHeight + 2
      }
    }
  })
}

onMounted(async () => {
  try {
    const res = await fetch('/quizsphere/data/topics.json')
    if (!res.ok) throw new Error('Failed to load topics')
    const data = await res.json()
    // For each topic, fetch the question count and add demo areas
    topics.value = await Promise.all(data.map(async t => {
      let questionsCount = 0
      let areas = t.areas || []
      // Use topic key to get areas from topicAreas mapping
      if (!areas.length && topicAreas[t.topic]) {
        areas = topicAreas[t.topic]
      } else if (!areas.length) {
        // Fallback: legacy partial match for backward compatibility
        const topicKey = Object.keys(topicAreas).find(key =>
          t.topic && t.topic.toLowerCase().includes(key)
        );
        if (topicKey) {
          areas = topicAreas[topicKey];
        }
      }
      // Use questionsCount from metadata if available
      if (typeof t.questionsCount === 'number') {
        questionsCount = t.questionsCount
      } else if (t.file || t.topic) {
        try {
          let filePath = ''
          if (t.file) {
            filePath = t.file
          } else if (t.topic) {
            filePath = `${t.topic}.json`
          }
          if (!filePath.startsWith('data/')) {
            filePath = 'data/' + filePath.replace(/^\/+/, '')
          }
          filePath = filePath.replace(/^\/+/, '')
          
          // Use a HEAD request instead of fetching the full content
          // This gets content-length header without downloading the entire file
          const response = await fetch('/' + filePath, { method: 'HEAD' });
          if (response.ok) {
            // Estimate question count based on file size (rough approximation)
            const contentLength = response.headers.get('content-length');
            if (contentLength) {
              const sizeKB = parseInt(contentLength) / 1024;
              // Rough estimate: ~1KB per question on average
              questionsCount = Math.max(Math.round(sizeKB / 1), 1);
            }
          }
        } catch (e) {
          // ignore error, leave questionsCount as 0
        }
      }
      return {
        ...t,
        questionsCount,
        badge: t.badge || 'Quiz',
        level: t.level || 'Intermediate',
        description: t.description || 'This quiz covers the following key areas:',
        areas
      }
    }))
  } catch (e) {
    loadError.value = 'Failed to load topics. Please try again later.'
  }
  await nextTick()
  checkOverflow()
})
watch(topics, checkOverflow)

</script>

<!-- Styles moved to style.css -->
