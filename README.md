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

## Areas Covered
QuizSphere currently covers the following major topics and sub-areas:

- **Kubernetes**: Pods & Deployments, Services & Networking, ConfigMaps & Secrets, Volumes & Storage, RBAC & Security, Helm & Operators, Cluster Architecture, Troubleshooting
- **Kubernetes Advanced**: Advanced Scheduling, Security & Hardening, Multi-Cluster Management, Custom Controllers, Performance Tuning, Disaster Recovery, Networking Deep Dive, Real-World Scenarios
- **GitHub Copilot**: AI Code Suggestions, Editor Integrations, Prompt Engineering, Copilot Labs, Security & Privacy, Supported Languages, Productivity Tips
- **GitHub Copilot Exam**: Copilot Fundamentals, Prompt Engineering, Copilot in Practice, Security and Privacy, Capabilities and Limitations, IDE Integration, Test Generation, Data Handling, Vulnerability Awareness, Prompt Structure, Prompt Refinement, Team & Collaboration, Licensing & Compliance
- **Docker**: Docker Fundamentals, Docker CLI & Dockerfile, Docker Compose & Orchestration, Networking, Volumes & Data Persistence, Best Practices, Troubleshooting, Certifications, Interview & Real-World
- **Cloud Computing**: Cloud Concepts, Service Models (IaaS, PaaS, SaaS), Deployment Models (Public, Private, Hybrid, Multi-Cloud), Cloud Providers, Serverless & Managed Services, Storage & Databases, Networking & Security, Cost Management, Compliance & Governance, Real-World Scenarios

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
3. **Run the development server:**
   ```sh
   npm run dev
   ```
4. **Build for production:**
   ```sh
   npm run build
   ```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on submitting issues, feature requests, or pull requests.

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
