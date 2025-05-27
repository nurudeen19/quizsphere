// Import questions variable if using modules
import questions from './questions.js';

// Replace 'questionsContainer' and 'resultContainer' to match your HTML IDs
const questionsContainer = document.getElementById('question');
const answersContainer = document.getElementById('answers');
const resultContainer = document.getElementById('result-container') || document.createElement('div');
let currentQuestionIndex = 0;
let score = 0;

// Use the correct format for your questions array
function loadQuestion() {
    const question = questions[currentQuestionIndex];
    questionsContainer.innerHTML = `<h2>${question.q}</h2>`;
    answersContainer.innerHTML = question.options.map((option, index) => `
        <button onclick="selectAnswer(${index})">${option}</button>
    `).join('');
}

function selectAnswer(selectedIndex) {
    const question = questions[currentQuestionIndex];
    // Support both single and multiple correct answers
    const isCorrect = Array.isArray(question.answers)
        ? question.answers.includes(selectedIndex)
        : selectedIndex === question.answers;

    if (isCorrect) {
        score++;
        alert('Correct!');
    } else {
        // Show all correct answers
        const correctOptions = Array.isArray(question.answers)
            ? question.answers.map(i => question.options[i]).join(', ')
            : question.options[question.answers];
        alert(`Wrong! The correct answer is: ${correctOptions}`);
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
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