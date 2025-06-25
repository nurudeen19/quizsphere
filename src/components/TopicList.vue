<template>
  <div>
    <div v-if="loadError" class="text-center text-red-600 font-bold py-8">{{ loadError }}</div>
    <div v-else class="container-fluid max-w-[2400px] mx-auto px-3 sm:px-4 lg:px-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 my-4">
        <div
          v-for="topic in topics"
          :key="topic.topic"
          class="topic-card-ghcert bg-gradient-to-br from-cyan-50 via-blue-100 to-blue-200 rounded-lg shadow border border-blue-200 flex flex-col min-h-[340px] transition-transform duration-150 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden"
        >
          <div class="topic-card-header flex flex-row items-center gap-3 p-3 min-h-[80px] bg-gradient-to-r from-blue-200 via-cyan-100 to-white border-b border-blue-200">
            <img
              :src="topic.image || `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic.title)}`"
              @error="onImageError($event, topic.title)"
              alt="Topic image"
              class="avatar-img w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-full border-2 border-cyan-200 shadow-sm"
            />
            <div class="flex-1 flex flex-col justify-start">
              <h2 class="text-lg sm:text-xl font-bold text-blue-900 mb-1.5 leading-tight line-clamp-2">{{ topic.title }}</h2>
              <div class="flex flex-wrap items-center gap-1.5">
                <span v-if="topic.badge" class="inline-block bg-gradient-to-br from-blue-400 to-cyan-400 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">{{ topic.badge }}</span>
                <span v-if="topic.level" class="inline-block bg-blue-100 text-cyan-700 text-xs font-semibold px-2 py-0.5 rounded whitespace-nowrap">{{ topic.level }}</span>
                <span v-if="topic.questions" class="inline-block bg-cyan-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded whitespace-nowrap">{{ topic.questions }} Questions</span>
              </div>
            </div>
          </div>

          <div class="flex-1 flex flex-col justify-between p-3 bg-white/90">
            <div class="space-y-2">
              <p
                class="topic-description text-cyan-700 text-sm italic font-medium text-left leading-normal flex items-center"
                :class="{ 'expanded': expandedDescriptions[topic.topic] || hoveredDescription === topic.topic }"
                ref="el => setDescriptionRef(topic.topic, el)"
                @mouseenter="hoveredDescription = topic.topic"
                @mouseleave="hoveredDescription = null"
              >
                {{ topic.description || 'This quiz covers the following key areas:' }}
                <span v-if="showReadMore[topic.topic] && !(expandedDescriptions[topic.topic] || hoveredDescription === topic.topic)" class="truncate-indicator">&nbsp;…</span>
              </p>
              <button v-if="showReadMore[topic.topic] && !expandedDescriptions[topic.topic]" class="read-more-btn text-xs sm:text-sm text-blue-700 underline font-semibold ml-1" @click.stop="expandDescription(topic.topic)">Read more</button>
              <button v-if="expandedDescriptions[topic.topic]" class="read-more-btn text-xs sm:text-sm text-blue-700 underline font-semibold ml-1" @click.stop="collapseDescription(topic.topic)">Show less</button>

              <ul v-if="topic.areas && topic.areas.length" class="topic-areas-animated list-none text-sm text-blue-800 mt-4 pl-0 min-h-[48px] flex flex-wrap items-start gap-y-2">
                <li v-for="(area, idx) in topic.areas" :key="area" :style="{ animationDelay: (0.05 * idx) + 's' }" class="topic-area-bullet animate-fadein-left flex items-center w-full">
                  <span class="custom-bullet mr-3"></span>
                  <span class="leading-snug">{{ area }}</span>
                </li>
              </ul>
            </div>

            <div class="flex flex-col gap-3 mt-6">
              <span v-if="topic.questionsCount !== undefined" class="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1.5 rounded-lg shadow-sm">{{ topic.questionsCount }} Questions</span>
              <div class="flex flex-row gap-3 w-full">
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
    </div>

    <footer class="w-full text-center py-4 sm:py-6 mt-6 sm:mt-8 text-xs sm:text-sm text-blue-800 bg-gradient-to-r from-cyan-50 via-blue-100 to-blue-200 border-t border-blue-200">
      <span>
        🚀 If you found QuizSphere helpful, please <a href="https://github.com/nurudeen19/quizsphere" target="_blank" rel="noopener" class="text-blue-700 underline font-semibold hover:text-blue-900">star our GitHub repo</a> and help others discover this free resource!
      </span>
    </footer>
  </div>
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
<style scoped>
.topic-card-ghcert {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, box-shadow;
  background-size: 200% 200%;
  animation: gradientMove 8s ease infinite;
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.topic-description {
  position: relative;
  max-height: 60px;
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1.5;
}

.topic-description.expanded {
  max-height: 300px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(14, 165, 233, 0.5) transparent;
}

.topic-description::-webkit-scrollbar {
  width: 4px;
}

.topic-description::-webkit-scrollbar-track {
  background: transparent;
}

.topic-description::-webkit-scrollbar-thumb {
  background-color: rgba(14, 165, 233, 0.5);
  border-radius: 4px;
}

.custom-bullet {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: linear-gradient(to right, #60a5fa, #0ea5e9);
  box-shadow: 0 2px 4px rgba(14, 165, 233, 0.3);
  flex-shrink: 0;
  transform: translateY(1px);
}

.topic-areas-animated {
  margin-top: 1rem;
}

.topic-area-bullet {
  opacity: 0;
  animation: fadein-left 0.5s ease forwards;
  padding: 2px 0;
}

@keyframes fadein-left {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.avatar-img {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.topic-card-ghcert:hover .avatar-img {
  transform: scale(1.05) rotate(-5deg);
  box-shadow: 0 8px 16px rgba(14, 165, 233, 0.25);
}

.truncate-indicator {
  opacity: 0.7;
}

/* Mobile specific styles */
@media (max-width: 640px) {
  .topic-description {
    max-height: 60px;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .topic-description.expanded {
    max-height: 200px;
  }
  
  .topic-area-bullet {
    font-size: 0.8125rem;
  }
  
  .topic-card-header {
    padding-bottom: 1rem;
  }
  
  .card-content-padding {
    padding: 1rem;
  }
}

/* Hover effects only for non-touch devices */
@media (hover: hover) {
  .topic-card-ghcert:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 20px 25px -5px rgba(14, 165, 233, 0.1), 0 8px 10px -6px rgba(14, 165, 233, 0.1);
  }
}
</style>
