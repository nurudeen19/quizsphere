# QuizSphere

A robust, modular, and visually appealing Vue 3 + Vite + Tailwind CSS quiz system with topic/chapter support, state persistence, modern UI, and production readiness.

## Features
- Vue 3 with `<script setup>` SFCs
- Tailwind CSS for modern, responsive design
- Topic and chapter-based quizzes
- State persistence (per topic/chapter) using localStorage
- Animated progress bar, chapter navigation, and stats
- Unified chapter stats table
- Accessible UI (ARIA, keyboard navigation, focus states)
- Error handling for data fetching and validation
- Image support for topics
- Confetti/congratulatory animation at quiz completion
- Versioned state for future-proofing
- SPA routing support for Apache

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

## Folder Structure
- `src/` — Vue components, styles, and data
- `dist/` — Production build output
- `.htaccess` — Apache rewrite rules for SPA routing

## Customization
- Add new topics in `public/data/topics.json` (with image URLs)
- Add/modify questions in `public/data/`
- Update styles in `src/style.css` or via Tailwind

## Accessibility & i18n
- Accessible by keyboard and screen readers
- Placeholder for internationalization (i18n) included

---

Built with Vue 3, Vite, and Tailwind CSS.
