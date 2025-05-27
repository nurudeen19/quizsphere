// Import questions variable if using modules
import questions from './questions.js';

// Replace 'questionsContainer' and 'resultContainer' to match your HTML IDs
const questionsContainer = document.getElementById('question');
const answersContainer = document.getElementById('answers');
const resultContainer = document.getElementById('result-container') || document.createElement('div');
let currentQuestionIndex = 0;
let score = 0;
let feedbackContainer = null;
console.log(questions.length, 'questions loaded');
// State persistence keys
const STORAGE_KEY = 'k8s_quiz_state';

function saveState() {
    const state = {
        currentQuestionIndex,
        score
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
                return true;
            }
        } catch (e) {
            // ignore parse errors
        }
    }
    return false;
}

function clearState() {
    localStorage.removeItem(STORAGE_KEY);
}

// Use the correct format for your questions array
function loadQuestion() {
    const question = questions[currentQuestionIndex];
    questionsContainer.innerHTML = `
        <div style="width:100%;text-align:right;font-size:0.95em;color:#666;margin-bottom:8px;">
            Question ${currentQuestionIndex + 1} of ${questions.length}
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
                            <input type="radio" name="answer" value="${index}">
                            ${option}
                        </label>
                    </li>
                `).join('')}
            </ul>
            <button type="submit" id="submit-answer">Submit</button>
        </form>
        <div id="feedback" class="feedback"></div>
        <button id="next-question" style="display:none;margin-top:10px;">Next Question</button>
    `;
    feedbackContainer = document.getElementById('feedback');
    document.getElementById('answers-form').onsubmit = function(e) {
        e.preventDefault();
        const selected = this.elements['answer'].value;
        if (selected !== undefined && selected !== "") {
            selectAnswer(Number(selected));
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
}

function selectAnswer(selectedIndex) {
    const question = questions[currentQuestionIndex];
    // Support both single and multiple correct answers
    const isCorrect = Array.isArray(question.answers)
        ? question.answers.includes(selectedIndex)
        : selectedIndex === question.answers;

    // Disable all radios after answering
    const radios = document.querySelectorAll('input[name="answer"]');
    radios.forEach(r => r.disabled = true);
    document.getElementById('submit-answer').disabled = true;

    // Show feedback
    if (isCorrect) {
        score++;
        feedbackContainer.innerHTML = `<span class="correct">Correct!</span>`;
    } else {
        // Show all correct answers
        const correctOptions = Array.isArray(question.answers)
            ? question.answers.map(i => question.options[i]).join(', ')
            : question.options[question.answers];
        feedbackContainer.innerHTML = `<span class="incorrect">Wrong! The correct answer is: ${correctOptions}</span>`;
    }
    document.getElementById('next-question').style.display = 'inline-block';
    saveState();
}

// Make selectAnswer globally accessible
window.selectAnswer = selectAnswer;

function showResult() {
    questionsContainer.style.display = 'none';
    answersContainer.style.display = 'none';
    resultContainer.innerHTML = `
        <h2>Your Score: ${score} out of ${questions.length}</h2>
        <div style="margin-bottom:10px;">You answered ${currentQuestionIndex} out of ${questions.length} questions.</div>
        <button onclick="restartQuiz()">Restart Quiz</button>
        <button onclick="startFreshQuiz()" style="margin-left:10px;">Start Fresh</button>
    `;
    if (!resultContainer.parentNode) {
        document.getElementById('quiz-container').appendChild(resultContainer);
    }
    resultContainer.style.display = 'block';
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
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
    questionsContainer.style.display = 'block';
    answersContainer.style.display = 'block';
    resultContainer.innerHTML = '';
    resultContainer.style.display = 'none';
    loadQuestion();
}

// On load, ask user if they want to continue or start fresh if state exists
(function initQuiz() {
    if (loadState()) {
        if (confirm('Continue where you left off?')) {
            if (currentQuestionIndex < questions.length) {
                loadQuestion();
            } else {
                showResult();
            }
            return;
        } else {
            startFreshQuiz();
            return;
        }
    }
    // No saved state, start fresh
    loadQuestion();
})();