# QuizSphere

A robust, modular, and visually appealing Vue 3 + Vite + Tailwind CSS quiz system with topic/chapter support, state persistence, modern UI, and production readiness.

> ⭐ **If you find QuizSphere helpful, please [star the repo on GitHub](https://github.com/nurudeen19/quizsphere)! It helps others discover this free resource.**

## Features
- Vue 3 with `<script setup>` SFCs
- Tailwind CSS for modern, responsive design
- Topic and chapter-based quizzes (add unlimited topics via `topics.json`)
- State persistence (per topic/chapter) using localStorage
- Animated progress bar, chapter navigation, and stats
- Unified chapter stats table
- Timed quizzes with customizable timer settings and persistence
- User settings panel with real-time preference updates
- Markdown and code block rendering with syntax highlighting
- Beautiful UI with glassmorphism and gradient effects
- Accessible UI (ARIA, keyboard navigation, focus states)
- Error handling for data fetching and validation
- Time tracking for quiz completion with detailed stats
- Security features including XSS protection and input validation
- Image support for topics
- Confetti/congratulatory animation at quiz completion
- Versioned state for future-proofing
- SPA routing support for Apache
- Easily extensible: add new topics, question sets, and areas

## Topics & Areas Covered
QuizSphere currently covers:

- **Kubernetes**: Fundamentals, operations, troubleshooting, RBAC, storage, networking, and certification prep
- **Kubernetes Advanced**: Advanced scheduling, security, multi-cluster, controllers, performance, disaster recovery
- **GitHub Copilot for Beginners**: Copilot basics, supported languages, editor integration, code suggestions, security, best practices
- **GitHub Copilot Certification Prep**: Responsible AI, Copilot features, data handling, prompt engineering, use cases, testing, privacy
- **Docker & Containerization**: Docker CLI, Compose, orchestration, networking, volumes, troubleshooting, certifications
- **Cloud Computing**: Concepts, service/deployment models, core services, security, scalability, serverless, cost, DevOps, IAM
- **Database Fundamentals**: Relational & non-relational, ACID, CAP theorem, normalization, indexing, security
- **SQL Databases & Querying**: SQL syntax, joins, indexing, transactions, optimization, window functions, security

> **Add your own topics!**
> - Add a new entry to `public/data/topics.json` (see examples)
> - Add a question set in `public/data/` (JSON format)
> - Add topic areas in `src/components/topicAreas.js`

## Validating Question Counts
To ensure the `questionsCount` in `topics.json` matches the actual number of questions in each topic's data file, use the scripts in the `scripts/` folder:

- `scripts/count-duplicates.js`: Checks for duplicate questions in a data file.
- `scripts/update-question-counts.js`: Automatically counts questions in each topic's JSON file and updates the `questionsCount` field in `topics.json`.

Run these scripts with Node.js to keep your topic metadata accurate:

```sh
node scripts/update-question-counts.js
```

## Getting Started (Development)

```sh
npm install
npm run dev
```

## Production Build

```sh
npm run build
```
The production-ready files will be in the `dist/` folder.

## Deploying with Apache (Laragon)
1. **Build the app:**
   ```sh
   npm run build
   ```
2. **Ensure the `.htaccess` file is present in the project root:**
   - Handles SPA routing and redirects root requests to `/dist/`.
3. **Root `index.html` redirects to `/dist/`** to prevent directory listing.
4. **Access your app:**
   - Visit `http://localhost/quizsphere/` or your configured local domain.

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/nurudeen19/quizsphere.git
   cd quizsphere
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
   
   Key dependencies include:
   - Vue 3 (core framework)
   - Vite (build tool)
   - Tailwind CSS (styling)
   - Marked (markdown parsing)
   - DOMPurify (XSS protection)
   
3. **Run the development server:**
   ```sh
   npm run dev
   ```
4. **Build for production:**
   ```sh
   npm run build
   ```

## Recent Enhancements

### UI/UX Improvements
- Added modern UI with glassmorphism effects and gradient backgrounds
- Implemented responsive design for all screen sizes
- Created proper container width management to prevent layout shifts
- Enhanced quiz feedback with consistent spacing and visual cues

### Timer Features
- Added a beautiful horizontal progress bar timer with animation
- Implemented timer persistence across page reloads
- Created timer state management with auto-stop on quiz completion
- Added time tracking per chapter with detailed completion statistics

### User Settings & Preferences
- Added user settings modal with real-time preference updates
- Implemented configurable post-timeout actions
- Added chapter size configuration with persistence
- Disabled settings changes during active quizzes

### Content Enhancements
- Added markdown and code block rendering with syntax highlighting
- Implemented security measures with DOMPurify for XSS protection
- Enhanced accessibility with proper ARIA attributes and keyboard navigation
- Cleaned up quiz data for consistency and relevance

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on submitting issues, feature requests, or pull requests.

## Folder Structure
- `src/` — Vue components, styles, and data
  - `components/` — Vue components including Timer, SettingsPanel, QuizView
  - `quiz/` — Quiz utilities and markdown rendering helpers
- `public/data/` — Topic/question JSON files
- `scripts/` — Utility scripts for validation and maintenance
- `dist/` — Production build output
- `.htaccess` — Apache rewrite rules for SPA routing

## Customization
- Add new topics in `public/data/topics.json` (with image URLs)
- Add/modify questions in `public/data/` (supports markdown and code blocks with triple backticks)
- Update styles in `src/style.css` or via Tailwind
- Add topic areas in `src/components/topicAreas.js`
- Customize timer settings in the user settings panel
- Configure chapter sizes and post-timeout actions via the settings panel
- Set default values for PAGE_SIZE in `quiz-utils.js`

## User Settings
The application includes a user settings panel that allows users to:
- Choose what happens when the timer reaches zero (stay, next question, or terminate chapter)
- Configure chapter sizes to override the default PAGE_SIZE
- Settings are stored in localStorage and synchronized across components
- Settings are disabled while a quiz is active to prevent unintended behavior

## Timer & State Persistence
QuizSphere features a robust timer system with:
- Modern horizontal progress bar with gradient animation
- Auto-saving of timer state every 5 seconds
- Persistence across page reloads and browser sessions
- Resume message when returning to an active timed session
- Automatic stopping when a chapter is completed
- Time tracking for each completed chapter
- Display of time used in the chapter statistics
- Unified timer state with chapter state in localStorage

## Data Maintenance & Security
- Automatic question count validation via provided scripts
- Question data cleanup tools for maintaining quality
- JSON validation for all quiz data
- XSS protection with DOMPurify for rendered markdown content
- LocalStorage size validation to prevent abuse
- Input validation for user settings
- Efficient state management with reduced localStorage writes
- Question caching for performance optimization

## Accessibility & i18n
- Accessible by keyboard and screen readers
- Enhanced markdown rendering for better content readability
- Code syntax highlighting for technical questions
- Proper ARIA attributes for interactive elements
- Placeholder for internationalization (i18n) included

---

Built with Vue 3, Vite, and Tailwind CSS.
