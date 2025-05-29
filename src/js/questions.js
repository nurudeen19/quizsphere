// Efficiently load questions from JSON using fetch, with pagination and background caching
const PAGE_SIZE = 25; // Number of questions per chapter
let _allQuestions = [];
let _cache = {};
let _currentPage = 0;
let _maxPage = 0;
let questions = [];

// Helper: shuffle and remap answers
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

// Uniqueness check utility
function checkUniqueness(questions) {
    const seen = new Set();
    let duplicates = 0;
    questions.forEach((q) => {
        const key = q.q.trim().toLowerCase();
        if (seen.has(key)) {
            duplicates++;
        } else {
            seen.add(key);
        }
    });
    if (duplicates > 0) {
        console.warn('Duplicate questions found:', duplicates);
    } else {
        console.info('All questions are unique.');
    }
}

// Load initial questions and set up caching
function setQuestionsPage(page) {
    if (_cache[page]) {
        questions.length = 0;
        _cache[page].forEach(q => questions.push(q));
        _currentPage = page;
        // Preload next/prev pages in background
        preloadPage(page + 1);
        preloadPage(page - 1);
    }
}

// Preload questions for a given page into cache
function preloadPage(page) {
    if (page < 0 || page > _maxPage || _cache[page]) return;
    const start = page * PAGE_SIZE;
    const end = Math.min(start + PAGE_SIZE, _allQuestions.length);
    _cache[page] = _allQuestions.slice(start, end);
}

// Navigation functions
function nextPage() {
    if (_currentPage < _maxPage) {
        setQuestionsPage(_currentPage + 1);
    }
}

function prevPage() {
    if (_currentPage > 0) {
        setQuestionsPage(_currentPage - 1);
    }
}

function getCurrentPage() {
    return _currentPage;
}

function getMaxPage() {
    return _maxPage;
}

// Initial load
const questionsPromise = fetch('data/questions.json')
    .then(response => {
        if (!response.ok) throw new Error('Not found');
        return response.json();
    })
    .then(qs => {
        shuffleOptionsAndRemapAnswers(qs);
        checkUniqueness(qs);
        _allQuestions = qs;
        _maxPage = Math.floor((qs.length - 1) / PAGE_SIZE);
        // Preload first 2 pages
        preloadPage(0);
        preloadPage(1);
        setQuestionsPage(0);
        return questions;
    })
    .catch(() => {
        throw new Error('No questions data found.');
    });

export {
    questionsPromise,
    nextPage,
    prevPage,
    getCurrentPage,
    getMaxPage
};