// Quiz logic (modularized for Vue)
// This file will export quiz logic for use in Vue components
// Suggest renaming this file to quiz-utils.js or quiz-logic.js

const PAGE_SIZE = 25;
const SETTINGS_KEY = 'quizsphere-user-settings';
// Add question cache to reduce network requests
const questionCache = new Map(); // Cache with path as key

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function shuffleOptionsAndRemapAnswers(questions) {
    for (const q of questions) {
        const optionPairs = q.options.map((opt, idx) => ({ opt, idx }));
        for (let i = optionPairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [optionPairs[i], optionPairs[j]] = [optionPairs[j], optionPairs[i]];
        }
        q.options = optionPairs.map(pair => pair.opt);
        const oldToNew = {};
        optionPairs.forEach((pair, newIdx) => {
            oldToNew[pair.idx] = newIdx;
        });
        // Support both 'answer' and 'answers' fields
        if (Array.isArray(q.answer)) {
            q.answer = q.answer.map(oldIdx => oldToNew[oldIdx]);
        } else if (typeof q.answer === 'number') {
            q.answer = [oldToNew[q.answer]];
        }
    }
}


function getUserSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function getPageSize() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const settings = JSON.parse(raw);
      if (settings.questionsPerChapter && Number(settings.questionsPerChapter) > 0) {
        return Number(settings.questionsPerChapter);
      }
    }
  } catch {}
  return PAGE_SIZE;
}

function getQuizQuestionsPage(questionsData, page = 0, pageSize) {
    // Defensive: filter out malformed questions before paginating
    const validQuestions = (questionsData || []).filter(q => q && q.q && Array.isArray(q.options) && Array.isArray(q.answer));
    // Prefer user setting for page size if not provided
    const effectivePageSize = pageSize || getPageSize();
    const start = page * effectivePageSize;
    const end = start + effectivePageSize;
    const pageQuestions = validQuestions.slice(start, end);
    shuffleOptionsAndRemapAnswers(pageQuestions);
    return pageQuestions;
}

// Remove topic-specific fetch function, and add a generic one for any topic file
/**
 * Dynamically fetch questions for any topic file in public/data.
 * Supports pagination if page and size query params are provided.
 * @param {string} file - The filename or relative path (e.g. 'kubernetes-advanced.json')
 * @param {object} [opts] - Optional: { page, size }
 * @returns {Promise<Array>} - Array of question objects (paged if supported)
 */
export async function fetchQuestions(file, opts = {}) {
  let filePath = file;
  // Always ensure filePath is /quizsphere/data/<filename>
  if (filePath.startsWith('/quizsphere/data/')) {
    // already correct
  } else if (filePath.startsWith('/data/')) {
    filePath = '/quizsphere/data/' + filePath.replace(/^\/data\//, '');
  } else {
    filePath = '/quizsphere/data/' + filePath.replace(/^\/+/,'').replace(/^data\//,'');
  }
  
  // Check if we have this in cache first
  if (questionCache.has(filePath) && !opts.bypassCache) {
    const cached = questionCache.get(filePath);
    // Return either the full data or a paginated slice
    if (typeof opts.page === 'number' && typeof opts.size === 'number') {
      const start = opts.page * opts.size;
      const end = start + opts.size;
      return cached.slice(start, end);
    }
    return cached;
  }
  
  // Not in cache, need to fetch
  const res = await fetch(filePath);
  if (!res.ok) {
    const text = await res.text();
    console.error('Fetch failed, response:', text);
    throw new Error('Failed to load questions: ' + filePath);
  }
  
  let data;
  try {
    // Check content-type before parsing
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.error('Expected JSON, got:', contentType, text);
      throw new Error('Expected JSON but got: ' + contentType + ' at ' + filePath);
    }
    data = await res.json();
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    throw new Error('Invalid JSON in questions file: ' + filePath);
  }
  
  // No shuffling, just use original order
  shuffleOptionsAndRemapAnswers(data);
  
  // Add to cache, but manage cache size (max 5 topics)
  if (questionCache.size >= 5) {
    // Remove oldest entry when cache gets too big
    const oldestKey = questionCache.keys().next().value;
    questionCache.delete(oldestKey);
  }
  questionCache.set(filePath, data);
  
  // Paginate after fetch
  if (typeof opts.page === 'number' && typeof opts.size === 'number') {
    const start = opts.page * opts.size;
    const end = start + opts.size;
    return data.slice(start, end);
  }
  return data;
}

export { getQuizQuestionsPage, shuffleArray, shuffleOptionsAndRemapAnswers, getPageSize, getUserSettings, PAGE_SIZE };
