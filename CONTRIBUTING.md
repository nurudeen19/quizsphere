# Contributing to QuizSphere

Thank you for your interest in contributing! We welcome bug reports, feature requests, and pull requests.

## How to Contribute

1. **Fork the repository** and create your branch from `main`.
2. **Install dependencies**:
   ```sh
   npm install
   ```
3. **Run the development server**:
   ```sh
   npm run dev
   ```
4. **Make your changes** (code, questions, topics, styles, etc.).
5. **Test your changes** locally.
6. **Commit and push** your branch.
7. **Open a Pull Request** with a clear description of your changes.

## Adding/Editing Questions or Topics
- Add or edit questions in `public/data/<topic>.json`.
- Update topic metadata in `public/data/topics.json`.
- Add or update topic areas in `src/components/topicAreas.js`.
- Run the script `scripts/update-question-counts.js` to update question counts.

## Code Style
- Use Prettier and ESLint for formatting and linting.
- Follow Vue 3 and Tailwind CSS best practices.

## Reporting Issues
- Use GitHub Issues for bugs, feature requests, or suggestions.

---

Thank you for helping make QuizSphere better!
