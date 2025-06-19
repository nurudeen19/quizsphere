// Quiz logic (modularized for Vue)
// This file will export quiz logic for use in Vue components
// Suggest renaming this file to quiz-utils.js or quiz-logic.js

const PAGE_SIZE = 5;

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

// Utility to get a stable shuffled order for a session
function getSessionShuffledOrder(key, arrLength) {
    let order = sessionStorage.getItem(key);
    if (order) {
        try {
            order = JSON.parse(order);
            if (Array.isArray(order) && order.length === arrLength) {
                return order;
            }
        } catch (e) {}
    }
    // Generate new shuffled order
    order = Array.from({ length: arrLength }, (_, i) => i);
    shuffleArray(order);
    sessionStorage.setItem(key, JSON.stringify(order));
    return order;
}

function applyOrder(arr, order) {
    return order.map(i => arr[i]);
}

function getQuizQuestionsPage(questionsData, page = 0, pageSize = PAGE_SIZE, sessionKey = null) {
    // Defensive: filter out malformed questions before paginating
    const validQuestions = (questionsData || []).filter(q => q && q.q && Array.isArray(q.options) && Array.isArray(q.answer));
    // No shuffling, just paginate in original order
    const start = page * pageSize;
    const end = start + pageSize;
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
  //console.log('passed filePath:', filePath);
  // Always ensure filePath is /quizsphere/data/<filename>
  if (filePath.startsWith('/quizsphere/data/')) {
    // already correct
  } else if (filePath.startsWith('/data/')) {
    filePath = '/quizsphere/data/' + filePath.replace(/^\/data\//, '');
  } else {
    filePath = '/quizsphere/data/' + filePath.replace(/^\/+/,'').replace(/^data\//,'');
  }
  // Log the final filePath for debugging
  //console.log('[fetchQuestions] Fetching:', filePath);
  // Always fetch the full file
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
  // Paginate after fetch
  if (typeof opts.page === 'number' && typeof opts.size === 'number') {
    const start = opts.page * opts.size;
    const end = start + opts.size;
    return data.slice(start, end);
  }
  return data;
}

export { getQuizQuestionsPage, shuffleArray, shuffleOptionsAndRemapAnswers, PAGE_SIZE };
