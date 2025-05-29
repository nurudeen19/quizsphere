# Kubernetes Quiz App

A scalable, efficient, and user-friendly quiz application for Kubernetes concepts.

## Features

- **Pagination & Chapters:** Questions are divided into chapters (pages) of 25 questions each. Only one chapter is loaded in memory at a time for performance.
- **Background Caching:** Next/previous chapters are preloaded in the background for smooth navigation.
- **Persistent State:** Quiz progress (current chapter, question, scores, and per-chapter stats) is saved in localStorage. Users can resume where they left off after a reload.
- **Answer Bias Reduction:** Answer options are shuffled and remapped on load to reduce bias.
- **Chapter Navigation:** Users can continue to the next chapter, restart the current chapter, or start the quiz fresh at any time.
- **Overall & Per-Chapter Stats:** At the end of the quiz, users see a breakdown of their score per chapter and the overall score.
- **Accessibility:** Keyboard navigation, ARIA labels, and focus management for a better user experience.
- **Loading/Error Handling:** Loading indicator while fetching questions and user-friendly error messages if loading fails.

## Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd kubernetes-quiz
   ```
2. **Install dependencies:**
   - This app is pure HTML/JS/CSS and does not require Node.js or npm for basic usage.
   - If you want to use a local server for development (recommended for fetch to work):
     - You can use [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code, or run:
       ```sh
       npx serve .
       ```
     - Or use Python's built-in server:
       ```sh
       python -m http.server
       ```

## Dependencies

- No runtime dependencies for the quiz app itself (vanilla JS, HTML, CSS only).
- For development, you may use:
  - [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) (VS Code extension)
  - [serve](https://www.npmjs.com/package/serve) (Node.js static server)
  - Python 3 (for `python -m http.server`)

## Usage

1. Open `index.html` in your browser (or use a local server as above).
2. Answer questions in each chapter. You must complete all questions in a chapter before moving to the next.
3. At the end of each chapter, you can:
   - Continue to the next chapter
   - Restart the current chapter (resets only that chapter's score)
   - Start fresh (resets all progress and stats)
4. If you reload or revisit the page, you will be prompted to resume or start fresh.

## Development

- All questions are stored in `src/data/questions.json`.
- Main logic is in `src/js/quiz.js` and `src/js/questions.js`.
- To change the number of questions per chapter, update `PAGE_SIZE` in `questions.js`.

## Recent Changes

- Chapters are now 25 questions each.
- Quiz state (chapter, question, scores) is fully persistent and robust to reloads.
- Improved accessibility and keyboard navigation.
- Loading indicator and error handling for question fetch.
- Modularized and refactored code for maintainability.

---

For more details, see code comments in `src/js/quiz.js` and `src/js/questions.js`.
