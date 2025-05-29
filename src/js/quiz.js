// Import questionsPromise variable
import { questionsPromise, nextPage, prevPage, getCurrentPage, getMaxPage } from './questions.js';

// Helper: compare two arrays for equality
function arraysHaveSameElements(a, b) {
  return a.length === b.length &&
    [...a].sort().every((val, i) => val === [...b].sort()[i]);
}

// DOM references
const questionsContainer = document.getElementById('question');
const answersContainer = document.getElementById('answers');
const resultContainer = document.getElementById('result-container') || document.createElement('div');
let currentQuestionIndex = 0;
let score = 0;
let feedbackContainer = null;
let currentChapter = 0; // Track the current chapter (page)
let overallScore = 0; // Track the overall score across all chapters
// State persistence keys
const STORAGE_KEY = 'k8s_quiz_state';

// DRY: Helper to go to a specific chapter (page)
function goToChapter(targetChapter) {
    let diff = targetChapter - getCurrentPage();
    if (diff > 0) {
        for (let i = 0; i < diff; i++) nextPage();
    } else if (diff < 0) {
        for (let i = 0; i < -diff; i++) prevPage();
    }
}

// Clear all quiz-related state
function clearState() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('k8s_quiz_chapter_stats');
    localStorage.removeItem('k8s_quiz_last_chapter');
}

function saveState() {
    let chapterStats = [];
    try {
        chapterStats = JSON.parse(localStorage.getItem('k8s_quiz_chapter_stats') || '[]');
        if (!Array.isArray(chapterStats)) chapterStats = [];
    } catch (e) { chapterStats = []; }
    const state = {
        currentQuestionIndex,
        score,
        currentChapter,
        overallScore,
        chapterStats
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
    const state = localStorage.getItem(STORAGE_KEY);
    if (state) {
        try {
            const parsed = JSON.parse(state);
            if (
                typeof parsed.currentQuestionIndex === 'number' &&
                typeof parsed.score === 'number'
            ) {
                currentQuestionIndex = parsed.currentQuestionIndex;
                score = parsed.score;
                currentChapter = typeof parsed.currentChapter === 'number' ? parsed.currentChapter : 0;
                overallScore = typeof parsed.overallScore === 'number' ? parsed.overallScore : 0;
                // Restore chapter stats if present
                if (Array.isArray(parsed.chapterStats)) {
                    localStorage.setItem('k8s_quiz_chapter_stats', JSON.stringify(parsed.chapterStats));
                }
                return true;
            }
        } catch (e) {
            // ignore parse errors
        }
    }
    return false;
}

// All quiz logic is now inside the questionsPromise callback
questionsContainer.innerHTML = '<div style="color:#007bff;">Loading questions...</div>';
questionsPromise.then(questions => {
    console.log(questions.length, 'questions loaded');
    // Use the correct format for your questions array
    function loadQuestion() {
        // If resuming, set the correct page/chapter
        goToChapter(currentChapter);
        const question = questions[currentQuestionIndex];
        const inputType = question.answers.length === 1 ? "radio" : "checkbox";
        // Show chapter (page) info
        const chapterNumber = getCurrentPage() + 1;
        const totalChapters = getMaxPage() + 1;
        currentChapter = getCurrentPage();
        questionsContainer.innerHTML = `
            <div style="width:100%;text-align:right;font-size:0.95em;color:#666;margin-bottom:8px;">
                Chapter ${chapterNumber} of ${totalChapters} &mdash; Question ${currentQuestionIndex + 1} of ${questions.length}
            </div>
            <h2>${question.q}</h2>
        `;
        // Render answers as a <ul> with <li> and radio inputs
        answersContainer.innerHTML = `
            <form id="answers-form">
                <ul class="answers">
                    ${question.options.map((option, index) => `
                        <li>
                            <label>
                                <input type="${inputType}" name="answer" value="${index}" aria-label="Answer option ${index + 1}">
                                ${option}
                            </label>
                        </li>
                    `).join('')}
                </ul>
                <button type="submit" id="submit-answer" disabled>Submit</button>
            </form>
            <div id="feedback" class="feedback"></div>
            <button id="next-question" style="display:none;margin-top:10px;" aria-label="Next Question">Next Question</button>
        `;
        feedbackContainer = document.getElementById('feedback');
        // Accessibility: Enable submit only when an answer is selected
        const answersForm = document.getElementById('answers-form');
        answersForm.onchange = function() {
            const checked = document.querySelectorAll('input[name="answer"]:checked').length;
            document.getElementById('submit-answer').disabled = !checked;
        };
        answersForm.onsubmit = function(e) {
            e.preventDefault();
            const selectedValues = [];
            const checkboxes = document.querySelectorAll('input[name="answer"]:checked');
            checkboxes.forEach((checkbox) => {
                selectedValues.push(1*checkbox.value);
            });
            if (selectedValues.length) {
                selectAnswer(selectedValues);
            }
        };
        document.getElementById('next-question').onclick = function() {
            currentQuestionIndex++;
            saveState();
            if (currentQuestionIndex < questions.length) {
                loadQuestion();
            } else {
                showResult();
            }
        };
        // Progress bar update
        const progressBar = document.getElementById('progress-bar');
        const progressBarInner = document.getElementById('progress-bar-inner');
        progressBar.style.display = 'block';
        progressBarInner.style.width = `${((currentQuestionIndex) / questions.length) * 100}%`;
    }

    function selectAnswer(selectedValues) {
        const question = questions[currentQuestionIndex];
        // Disable all radios after answering
        const radios = document.querySelectorAll('input[name="answer"]');
        radios.forEach(r => r.disabled = true);
        const submitBtn = document.getElementById('submit-answer');
        submitBtn.disabled = true; // Prevent double submission
        // Show feedback
        if (arraysHaveSameElements(selectedValues, question.answers)) {
            score++;
            overallScore++;
            feedbackContainer.innerHTML = `<span class="correct">Correct!</span>`;
        } else {
            const correctOptions = question.answers.length > 1
                ? question.answers.map(i => question.options[i]).join(', ')
                : question.options[question.answers];
            feedbackContainer.innerHTML = `<span class="incorrect">Wrong! The correct answer is: ${correctOptions}</span>`;
        }
        const nextBtn = document.getElementById('next-question');
        nextBtn.style.display = 'inline-block';
        nextBtn.focus(); // Keyboard accessibility
        saveState();
    }
    window.selectAnswer = selectAnswer;

    // Error handling for data fetch
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
        questionsContainer.innerHTML = '<div style="color:red;">Failed to load questions. Please try again later.</div>';
        return;
    }

    function showResult() {
        questionsContainer.style.display = 'none';
        answersContainer.style.display = 'none';
        let hasNextPage = getCurrentPage() < getMaxPage();
        const chapterNumber = getCurrentPage() + 1;
        const totalChapters = getMaxPage() + 1;
        let statsHtml = `
            <h2>Chapter ${chapterNumber} of ${totalChapters} Complete</h2>
            <div style="margin-bottom:10px;">Your Score: ${score} out of ${questions.length}</div>
            <div style="margin-bottom:10px;">Overall Score: ${overallScore}</div>
            <div style="margin-bottom:10px;">You answered ${currentQuestionIndex} out of ${questions.length} questions.</div>
        `;
        // If this is the last chapter, show per-chapter stats and overall stats
        if (!hasNextPage) {
            let chapterStats = [];
            try {
                chapterStats = JSON.parse(localStorage.getItem('k8s_quiz_chapter_stats') || '[]');
                if (!Array.isArray(chapterStats)) chapterStats = [];
            } catch (e) { chapterStats = []; }
            chapterStats[currentChapter] = score;
            localStorage.setItem('k8s_quiz_chapter_stats', JSON.stringify(chapterStats));
            let chaptersBreakdown = '<h3>Chapter Breakdown</h3><ul style="margin-bottom:10px;">';
            for (let i = 0; i < chapterStats.length; i++) {
                chaptersBreakdown += `<li>Chapter ${i+1}: ${chapterStats[i] || 0} / ${questions.length}</li>`;
            }
            chaptersBreakdown += '</ul>';
            statsHtml += chaptersBreakdown;
            statsHtml += `<div style="font-weight:bold;">Final Overall Score: ${overallScore} out of ${questions.length * chapterStats.length}</div>`;
        } else {
            let chapterStats = [];
            try {
                chapterStats = JSON.parse(localStorage.getItem('k8s_quiz_chapter_stats') || '[]');
                if (!Array.isArray(chapterStats)) chapterStats = [];
            } catch (e) { chapterStats = []; }
            chapterStats[currentChapter] = score;
            localStorage.setItem('k8s_quiz_chapter_stats', JSON.stringify(chapterStats));
        }
        resultContainer.innerHTML = `
            ${statsHtml}
            <button id="continue-quiz-btn" aria-label="Continue">${hasNextPage ? 'Continue to Next Chapter' : 'Restart Quiz'}</button>
            <button id="restart-chapter-btn" style="margin-left:10px;" aria-label="Restart This Chapter">Restart This Chapter</button>
            <button onclick="startFreshQuiz()" style="margin-left:10px;" aria-label="Start Fresh">Start Fresh</button>
        `;
        if (!resultContainer.parentNode) {
            document.getElementById('quiz-container').appendChild(resultContainer);
        }
        resultContainer.style.display = 'block';
        document.getElementById('continue-quiz-btn').onclick = function() {
            if (hasNextPage) {
                nextPage();
                questionsPromise.then(() => {
                    currentQuestionIndex = 0;
                    score = 0;
                    currentChapter = getCurrentPage();
                    saveState();
                    questionsContainer.style.display = 'block';
                    answersContainer.style.display = 'block';
                    resultContainer.innerHTML = '';
                    resultContainer.style.display = 'none';
                    loadQuestion();
                });
            } else {
                localStorage.removeItem('k8s_quiz_chapter_stats');
                currentQuestionIndex = 0;
                score = 0;
                currentChapter = 0;
                overallScore = 0;
                saveState();
                questionsContainer.style.display = 'block';
                answersContainer.style.display = 'block';
                resultContainer.innerHTML = '';
                resultContainer.style.display = 'none';
                loadQuestion();
            }
        };
        document.getElementById('restart-chapter-btn').onclick = function() {
            overallScore -= score;
            if (overallScore < 0) overallScore = 0;
            let chapterStats = [];
            try {
                chapterStats = JSON.parse(localStorage.getItem('k8s_quiz_chapter_stats') || '[]');
                if (!Array.isArray(chapterStats)) chapterStats = [];
            } catch (e) { chapterStats = []; }
            chapterStats[currentChapter] = 0;
            localStorage.setItem('k8s_quiz_chapter_stats', JSON.stringify(chapterStats));
            currentQuestionIndex = 0;
            score = 0;
            goToChapter(currentChapter); // Ensure user is on the correct chapter
            saveState();
            questionsContainer.style.display = 'block';
            answersContainer.style.display = 'block';
            resultContainer.innerHTML = '';
            resultContainer.style.display = 'none';
            loadQuestion();
        };
    }
    window.restartQuiz = restartQuiz;
    function restartQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        currentChapter = 0;
        overallScore = 0;
        saveState();
        questionsContainer.style.display = 'block';
        answersContainer.style.display = 'block';
        resultContainer.innerHTML = '';
        resultContainer.style.display = 'none';
        loadQuestion();
    }
    function startFreshQuiz() {
        clearState();
        currentQuestionIndex = 0;
        score = 0;
        currentChapter = 0;
        overallScore = 0;
        goToChapter(0); // Ensure quiz starts from first chapter
        questionsContainer.style.display = 'block';
        answersContainer.style.display = 'block';
        resultContainer.innerHTML = '';
        resultContainer.style.display = 'none';
        loadQuestion();
    }
    window.startFreshQuiz = startFreshQuiz;
    function showContinueModal(onContinue, onStartFresh) {
        let oldModal = document.getElementById('continue-modal');
        if (oldModal) oldModal.remove();
        const modal = document.createElement('div');
        modal.id = 'continue-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0,0,0,0.4)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '9999';
        modal.innerHTML = `
            <div style="
                background: #fff;
                padding: 32px 24px;
                border-radius: 10px;
                box-shadow: 0 4px 24px rgba(0,0,0,0.18);
                text-align: center;
                min-width: 280px;
            ">
                <h2 style="margin-bottom: 18px;">Resume Quiz?</h2>
                <p style="margin-bottom: 24px;">You have an unfinished quiz. Would you like to continue where you left off or start a new quiz?</p>
                <button id="continue-btn" style="margin-right: 12px; background: #007bff; color: #fff; border: none; padding: 10px 18px; border-radius: 5px; cursor: pointer;">Continue</button>
                <button id="startfresh-btn" style="background: #e0e0e0; color: #333; border: none; padding: 10px 18px; border-radius: 5px; cursor: pointer;">Start Fresh</button>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('continue-btn').onclick = () => {
            modal.remove();
            onContinue();
        };
        document.getElementById('startfresh-btn').onclick = () => {
            modal.remove();
            onStartFresh();
        };
    }
    // On load, ask user if they want to continue or start fresh if state exists
    (function initQuiz() {
        if (loadState()) {
            showContinueModal(
                function () {
                    // Restore chapter/page and question index
                    goToChapter(currentChapter);
                    if (currentQuestionIndex < questions.length) {
                        loadQuestion();
                    } else {
                        showResult();
                    }
                },
                function () {
                    startFreshQuiz();
                }
            );
            return;
        }
        // No saved state, start fresh
        loadQuestion();
    })();
});