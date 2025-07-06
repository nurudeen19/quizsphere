import { apiEndpoints } from './api';

/**
 * Fetch homepage data based on sections and options.
 * @param {Object} sections - Sections to fetch data for (e.g., {'featuredTopics': true, 'statistics': true}).
 * @param {Object} options - Additional options for fetching data (e.g., { featured_topics_limit: 6 })
 * Other fields would be included in documentation.
 */
export async function fetchHomepageData(sections = {'featuredTopics': true, 'statistics': true}, options = { featured_topics_limit: 6 }) {
    console.log('Fetching homepage data for sections:', sections, 'with options:', options);
    return apiEndpoints.getHomepageData(sections, options);
}

/**
 * Fetch all topics.
 */
export async function fetchTopics() {
    return apiEndpoints.getTopics();
}

/**
 * Fetch a specific topic by its key.
 */
export async function fetchTopicByKey(topicKey) {
    return apiEndpoints.getTopicByKey(topicKey);
}

/**
 * Fetch questions for a specific topic.
 */
export async function fetchQuestionsForTopic(topicKey) {
    return apiEndpoints.getTopicQuestions(topicKey);
}