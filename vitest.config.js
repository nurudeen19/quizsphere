import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    include: ['tests/unit/**/*.spec.js'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['src/main.js', 'src/style.css'],
    },
  },
})
