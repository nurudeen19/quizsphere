// Import questions variable if using modules
import questions from './questions.js';

// Replace 'questionsContainer' and 'resultContainer' to match your HTML IDs
const questionsContainer = document.getElementById('question');
const answersContainer = document.getElementById('answers');
const resultContainer = document.getElementById('result-container') || document.createElement('div');
let currentQuestionIndex = 0;
let score = 0;
let feedbackContainer = null;

// Use the correct format for your questions array
function loadQuestion() {
    const question = questions[currentQuestionIndex];
    questionsContainer.innerHTML = `<h2>${question.q}</h2>`;
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
}

// Make selectAnswer globally accessible
window.selectAnswer = selectAnswer;

function showResult() {
    questionsContainer.style.display = 'none';
    answersContainer.style.display = 'none';
    resultContainer.innerHTML = `
        <h2>Your Score: ${score} out of ${questions.length}</h2>
        <button onclick="restartQuiz()">Restart Quiz</button>
    `;
    if (!resultContainer.parentNode) {
        document.getElementById('quiz-container').appendChild(resultContainer);
    }
    resultContainer.style.display = 'block';
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    questionsContainer.style.display = 'block';
    answersContainer.style.display = 'block';
    resultContainer.innerHTML = '';
    resultContainer.style.display = 'none';
    loadQuestion();
}

// Initialize the quiz
loadQuestion();