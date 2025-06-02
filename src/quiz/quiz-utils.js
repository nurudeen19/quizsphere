// Quiz logic (modularized for Vue)
// This file will export quiz logic for use in Vue components
// Suggest renaming this file to quiz-utils.js or quiz-logic.js

import questionsData from '../data/kubernetes-questions.js'; // This import should be dynamic or passed as a parameter for true modularity

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

export { getQuizQuestionsPage, shuffleArray, shuffleOptionsAndRemapAnswers, PAGE_SIZE };
