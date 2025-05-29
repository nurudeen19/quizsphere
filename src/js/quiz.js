// Import questions variable if using modules
import questions from './questions.js';


// Fucton to compare two array
function arraysHaveSameElements(a, b) {
  return a.length === b.length &&
    [...a].sort().every((val, i) => val === [...b].sort()[i]);
}



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
    const inputType = question.answers.length === 1 ? "radio" : "checkbox";
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
                            <input type="${inputType}" name="answer" value="${index}">
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
}

function selectAnswer(selectedValues) {
    const question = questions[currentQuestionIndex];

    // Disable all radios after answering
    const radios = document.querySelectorAll('input[name="answer"]');
    radios.forEach(r => r.disabled = true);
    document.getElementById('submit-answer').disabled = true;

    // Show feedback
    if (arraysHaveSameElements(selectedValues, question.answers)) {
        score++;
        feedbackContainer.innerHTML = `<span class="correct">Correct!</span>`;
    } else {
        // Show all correct answers
        const correctOptions = question.answers.length>1
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
// Make restartQuiz globally accessible
window.restartQuiz = restartQuiz;
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

// Make startFreshQuiz globally accessible
window.startFreshQuiz = startFreshQuiz;

// Add a modal for UX-friendly continue/start fresh prompt
function showContinueModal(onContinue, onStartFresh) {
    // Remove existing modal if present
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