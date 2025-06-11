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

function getQuizQuestionsPage(questionsData, page = 0, pageSize = PAGE_SIZE) {
    // Defensive: filter out malformed questions before paginating
    const validQuestions = (questionsData || []).filter(q => q && q.q && Array.isArray(q.options) && Array.isArray(q.answers));
    const start = page * pageSize;
    const end = start + pageSize;
    const pageQuestions = validQuestions.slice(start, end);
    shuffleOptionsAndRemapAnswers(pageQuestions);
    return pageQuestions;
}

// Remove topic-specific fetch function, and add a generic one for any topic file
/**
 * Dynamically fetch questions for any topic file in public/data.
 * @param {string} file - The filename or relative path (e.g. 'kubernetes-advanced.json')
 * @returns {Promise<Array>} - Array of question objects
 */
export async function fetchQuestions(file) {
  let filePath = file;
  if (filePath.startsWith('/quizsphere/data/')) {
    // already correct
  } else if (filePath.startsWith('/data/')) {
    filePath = '/quizsphere' + filePath;
  } else {
    filePath = '/quizsphere/data/' + filePath.replace(/^\/+/, '').replace(/^data\//, '');
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
  shuffleOptionsAndRemapAnswers(data);
  return data;
}

export { getQuizQuestionsPage, shuffleArray, shuffleOptionsAndRemapAnswers, PAGE_SIZE };
