# Kubernetes Quiz Application

This project is a quiz application that generates 100 multiple-choice questions based on Kubernetes Certified Network Administrator (KCNA) certification standards. The application allows users to test their knowledge of Kubernetes concepts and practices.

## Project Structure

- `src/index.html`: The main HTML document that sets up the structure of the quiz application.
- `src/js/questions.js`: Contains an array of 100 multiple-choice questions related to Kubernetes.
- `src/js/quiz.js`: Handles the logic for displaying questions and capturing user selections.
- `src/js/utils.js`: Contains utility functions for common tasks.
- `src/css/styles.css`: Styles for the quiz application.
- `src/data/questions.json`: Stores the questions in JSON format.
- `package.json`: Configuration file for npm.

## How to Run the Quiz

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd kubernetes-quiz
   ```
3. Open `src/index.html` in your web browser to start the quiz.

## Additional Information

This project is designed to help users prepare for the KCNA certification by providing a fun and interactive way to learn about Kubernetes. Feel free to modify the questions in `src/data/questions.json` to add your own or update existing ones.