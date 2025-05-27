# Kubernetes Quiz Application

This is a browser-based quiz app to help you prepare for the Kubernetes and Cloud Native Associate (KCNA) certification. It features 200 randomized multiple-choice questions covering a wide range of Kubernetes concepts, best practices, and commands.

## Features

- **200 KCNA-style questions**: Covers core Kubernetes concepts, objects, commands, and best practices.
- **Randomized answers**: Answer options are shuffled for each question.
- **Single and multiple correct answers**: Some questions may have more than one correct answer.
- **Immediate feedback**: Inline feedback is shown after each answer, with the correct answer(s) highlighted.
- **Modern UI**: Responsive, centered layout with accessible radio button selection.
- **No backend required**: Runs entirely in your browser.

## Project Structure

```
src/
  index.html         # Main HTML file
  css/
    styles.css       # App styling
  js/
    questions.js     # All quiz questions (ES module)
    quiz.js          # Quiz logic and UI (ES module)
    utils.js         # (Optional) Utility functions
.gitignore
package.json         # For npm scripts and dev server
README.md
```

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- (Recommended) A local web server for ES module support (e.g. [live-server](https://www.npmjs.com/package/live-server), Python's `http.server`, etc.)

### Installation

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd k8s_mcq-quiz
   ```

2. **Install dependencies (optional, for live-server):**
   ```sh
   npm install
   ```

3. **Start the local server (recommended):**
   ```sh
   npm start
   ```
   Or, from the `src` directory:
   ```sh
   python -m http.server 8000
   ```
   Then open [http://localhost:8000](http://localhost:8000) in your browser.

   > **Note:** Opening `index.html` directly from the filesystem may not work in all browsers due to ES module restrictions.

## How to Use

- The quiz displays one question at a time.
- Select your answer using the radio buttons and click "Submit".
- Feedback will appear below the answers.
- Click "Next Question" to proceed.
- At the end, your score will be displayed with an option to restart.

## Customization

- **Add/Edit Questions:**  
  Edit `src/js/questions.js`. Each question supports single or multiple correct answers via the `answers` array.
- **Styling:**  
  Modify `src/css/styles.css` for custom styles.
- **Quiz Logic:**  
  Update `src/js/quiz.js` for new features or behavior.

## Development

- Uses ES module syntax (`import`/`export`).
- No build step required.
- All logic and data are client-side.

## License

MIT License

---

*Made with ❤️ for Kubernetes learners and the cloud native community.*
