import { apiEndpoints } from '../services/api';

const PAGE_SIZE = 25;
const SETTINGS_KEY = 'quizsphere-user-settings';
// Add question cache to reduce network requests
const questionCache = new Map(); // Cache with path as key


function getUserSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function getPageSize() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const settings = JSON.parse(raw);
      if (settings.questionsPerChapter && Number(settings.questionsPerChapter) > 0) {
        return Number(settings.questionsPerChapter);
      }
    }
  } catch {}
  return PAGE_SIZE;
}





export { getUserSettings, PAGE_SIZE };
