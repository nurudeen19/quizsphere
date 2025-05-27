const questionsContainer = document.getElementById('questions-container');
const resultContainer = document.getElementById('result-container');
let currentQuestionIndex = 0;
let score = 0;

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    questionsContainer.innerHTML = `
        <h2>${question.question}</h2>
        <ul>
            ${question.answers.map((answer, index) => `
                <li>
                    <button onclick="selectAnswer(${index})">${answer}</button>
                </li>
            `).join('')}
        </ul>
    `;
}

function selectAnswer(selectedIndex) {
    const question = questions[currentQuestionIndex];
    const correctIndex = question.correctAnswer;

    if (selectedIndex === correctIndex) {
        score++;
        alert('Correct!');
    } else {
        alert(`Wrong! The correct answer is: ${question.answers[correctIndex]}`);
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    questionsContainer.style.display = 'none';
    resultContainer.innerHTML = `
        <h2>Your Score: ${score} out of ${questions.length}</h2>
        <button onclick="restartQuiz()">Restart Quiz</button>
    `;
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    questionsContainer.style.display = 'block';
    resultContainer.innerHTML = '';
    loadQuestion();
}

// Initialize the quiz
loadQuestion();