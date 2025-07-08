import axios from 'axios';
import { config } from '../config/index.js';
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
    getTopicQuestions: (topicSlug, params = {}) => api.get(`/topics/${topicSlug}/questions`, { params }),
    
    // Quiz-specific endpoints
    getQuizQuestions: (topicSlug, options = {}) => {
        const params = {}
        
        if (options.questionCount) params.count = options.questionCount
        if (options.difficulty && options.difficulty !== 'mixed') params.difficulty = options.difficulty
        if (options.round) params.round = options.round
        if (options.topicArea) params.topic_area = options.topicArea
        if (options.randomize) params.randomize = options.randomize
        
        return api.get(`/topics/${topicSlug}/questions`, { params })
    },
    
    submitQuizResults: (topicSlug, results) => api.post(`/topics/${topicSlug}/quiz-results`, results),
    
    getQuizStatistics: (topicSlug) => api.get(`/topics/${topicSlug}/quiz-stats`),
    
    // User progress endpoints
    getUserProgress: (topicSlug) => api.get(`/topics/${topicSlug}/progress`),
    updateUserProgress: (topicSlug, progress) => api.post(`/topics/${topicSlug}/progress`, progress),
    
    // Topic areas and categorization
    getTopicAreas: (topicSlug) => api.get(`/topics/${topicSlug}/areas`),
    
    // Question management (for potential admin features)
    getQuestionById: (questionId) => api.get(`/questions/${questionId}`),
    
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
