import axios from 'axios';
import { config } from '../config';

// Create axios instance with default config
const api = axios.create({
    baseURL: config.apiBaseUrl,
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

// API endpoints
export const topicsApi = {
    getAll: () => api.get('/topics'),
    getByKey: (topicKey) => api.get(`/topics/${topicKey}`),
    getQuestions: (topicKey) => api.get(`/topics/${topicKey}/questions`)
};

export default api;
