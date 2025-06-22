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
- Questions now support Markdown formatting including code blocks with triple backticks.
- Use DOMPurify-safe HTML/Markdown in questions to ensure security.
- Update topic metadata in `public/data/topics.json`.
- Add or update topic areas in `src/components/topicAreas.js`.
- Run the script `scripts/update-question-counts.js` to update question counts.
- Run the script `scripts/count-duplicates.js` to check for duplicate questions.

## Contributing to Components
- **Timer Component**: When modifying the Timer component, ensure proper cleanup of intervals in onUnmounted().
- **Settings Panel**: Keep settings disabled during active quizzes to prevent state inconsistencies.
- **QuizView**: Ensure time tracking logic is preserved when modifying the quiz flow.
- **Markdown Rendering**: Use the established pattern with DOMPurify for any new text rendering features.

## Testing State Persistence
- Test timer persistence across page reloads
- Verify that completed chapter states are preserved correctly
- Confirm that time tracking accurately records completion times
- Check timer resume message visibility conditions

## Code Style
- Use Prettier and ESLint for formatting and linting.
- Follow Vue 3 and Tailwind CSS best practices.
- Use composition API with `<script setup>` for new components.

## Reporting Issues
- Use GitHub Issues for bugs, feature requests, or suggestions.
- For timer-related issues, include details about browser/device and steps to reproduce.
- For data issues, specify the topic and question number.

## Performance Considerations
- Minimize localStorage writes (current implementation limits to 5-second intervals)
- Use efficient selectors and avoid unnecessary reactivity
- Test on different devices to ensure responsive design works correctly
- Consider memory usage when modifying timer or animation components

---

Thank you for helping make QuizSphere better!
