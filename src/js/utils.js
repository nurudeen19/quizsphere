// utils.js

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to format question data
function formatQuestionData(question) {
    return {
        text: question.text,
        answers: shuffleArray(question.answers),
        correctAnswer: question.correctAnswer
    };
}

// Function to hide answers until a selection is made
function hideAnswers(answersContainer) {
    answersContainer.style.display = 'none';
}

// Function to reveal answers
function revealAnswers(answersContainer) {
    answersContainer.style.display = 'block';
}

// Exporting utility functions
export { shuffleArray, formatQuestionData, hideAnswers, revealAnswers };