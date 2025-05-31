// Kubernetes Quiz logic (modularized for Vue)
// This file will export quiz logic for use in Vue components

import questionsData from '../data/kubernetes-questions.js';

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

function getQuestionsPage(page = 0) {
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageQuestions = questionsData.slice(start, end);
    shuffleOptionsAndRemapAnswers(pageQuestions);
    return pageQuestions;
}

export { getQuestionsPage, PAGE_SIZE };
