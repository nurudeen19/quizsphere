// Quiz logic (modularized for Vue)
// This file will export quiz logic for use in Vue components
// Suggest renaming this file to quiz-utils.js or quiz-logic.js

const PAGE_SIZE = 10;

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

// Update import to use public/data path for production compatibility
// You cannot import from public/data directly in JS, so use dynamic fetch instead of import
// Remove or comment out the import line:
// import questions from '../data/kubernetes-questions.js'

// Add a function to fetch the questions dynamically
export async function fetchKubernetesQuestions() {
  const res = await fetch('/data/kubernetes-questions.js')
  if (!res.ok) throw new Error('Failed to load kubernetes-questions.js')
  // If the file exports as a JS variable, you may need to eval or parse it
  // If it's JSON, use res.json()
  // If it's JS, you may need to use import() with a relative path from /public
  // For now, try to parse as JSON
  return await res.json()
}

export { getQuizQuestionsPage, shuffleArray, shuffleOptionsAndRemapAnswers, PAGE_SIZE };
