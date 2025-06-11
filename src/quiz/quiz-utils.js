// Quiz logic (modularized for Vue)
// This file will export quiz logic for use in Vue components
// Suggest renaming this file to quiz-utils.js or quiz-logic.js

const PAGE_SIZE = 25;

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
        if (Array.isArray(q.answers)) {
            q.answers = q.answers.map(oldIdx => oldToNew[oldIdx]);
        } else {
            q.answers = [oldToNew[q.answers]];
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
    const validQuestions = (questionsData || []).filter(q => q && q.q && Array.isArray(q.options) && Array.isArray(q.answers));
    let orderedQuestions = validQuestions;
    if (sessionKey) {
        const order = getSessionShuffledOrder(sessionKey, validQuestions.length);
        orderedQuestions = applyOrder(validQuestions, order);
    }
    const start = page * pageSize;
    const end = start + pageSize;
    const pageQuestions = orderedQuestions.slice(start, end);
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
  if (filePath.startsWith('/quizsphere/data/')) {
    // already correct
  } else if (filePath.startsWith('/data/')) {
    filePath = '/quizsphere' + filePath;
  } else {
    filePath = '/quizsphere/data/' + filePath.replace(/^\/+/,'').replace(/^data\//,'');
  }
  // Add pagination query if requested
  if (typeof opts.page === 'number' && typeof opts.size === 'number') {
    const sep = filePath.includes('?') ? '&' : '?';
    filePath += `${sep}page=${opts.page}&size=${opts.size}`;
  }
  // Debug log
  console.log('Fetching questions from:', filePath);
  const res = await fetch(filePath);
  if (!res.ok) {
    const text = await res.text();
    console.error('Fetch failed, response:', text);
    throw new Error('Failed to load questions: ' + filePath);
  }
  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    throw new Error('Invalid JSON in questions file: ' + filePath);
  }
  // Only shuffle once per session for this topic
  if (opts.sessionKey) {
    const order = getSessionShuffledOrder(opts.sessionKey, data.length);
    data = applyOrder(data, order);
  } else {
    shuffleArray(data);
  }
  shuffleOptionsAndRemapAnswers(data);
  return data;
}

export { getQuizQuestionsPage, shuffleArray, shuffleOptionsAndRemapAnswers, PAGE_SIZE };
