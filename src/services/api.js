import axios from 'axios';
import { config } from '../config';
// Create axios instance with default config
const api = axios.create({
    baseURL: config.apiBaseUrl,
    withCredentials: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // You can add auth headers here later if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('API Error:', error.response.status, error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('API Request Error:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('API Setup Error:', error.message);
        }
        return Promise.reject(error);
    }
);

// Utility function for caching API responses
const getCachedData = (key) => {
    const cachedData = sessionStorage.getItem(key);
    return cachedData ? JSON.parse(cachedData) : null;
};

const setCachedData = (key, data) => {
    sessionStorage.setItem(key, JSON.stringify(data));
};

// API endpoints
export const apiEndpoints = {
    getTopics: () => api.get('/topics'),
    getTopicBySlug: (topicSlug) => api.get(`/topics/${topicSlug}`),
    getTopicQuestions: (topicSlug) => api.get(`/topics/${topicSlug}/questions`),
    getHomepageData: (sections = {}, options = {}) => {
        const cacheKey = `homepageData_${JSON.stringify(sections)}_${JSON.stringify(options)}`;
        const cachedData = getCachedData(cacheKey);

        if (cachedData) {
            return Promise.resolve(cachedData);
        }

        return api
            .get('/homepage', {
                params: { sections, options },
            })
            .then((data) => {
                setCachedData(cacheKey, data);
                return data;
            });
    },
};

export default api;
