/**
 * Quiz API Service for QuizSphere
 * Handles communication with the backend for quiz questions and data
 */

import { apiEndpoints } from './api.js'

export class QuizAPI {
  /**
   * Fetch questions for a topic with specific settings
   * @param {string} topicSlug - Topic identifier
   * @param {Object} options - Quiz options
   * @returns {Promise<Object>} API response with questions
   */
  static async fetchQuestions(topicSlug, options = {}) {
    try {
      console.log('Fetching questions with options:', options)
      
      // Use the existing API infrastructure with the quiz-specific endpoint
      const data = await apiEndpoints.getQuizQuestions(topicSlug, {
        ...options
      })
      
      if (data.status === 'success') {
        return {
          success: true,
          questions: data.data || [],
          meta: data.meta || {}
        }
      } else {
        throw new Error(data.message || 'Failed to fetch questions')
      }
      
    } catch (error) {
      console.error('Error fetching questions:', error)
      
      // Return fallback sample questions for development
      //return this.getFallbackQuestions(options)
    }
  }
  
  /**
   * Get fallback questions when API is unavailable
   * @param {Object} options - Quiz options
   * @returns {Object} Fallback response
   */
  static getFallbackQuestions(options = {}) {
    console.warn('Using fallback questions - API unavailable')
    
    const sampleQuestions = [
      {
        id: 1,
        question: "What is the primary purpose of containerization in modern software development?",
        options: [
          "To make applications run faster",
          "To package applications with their dependencies for consistent deployment",
          "To reduce the size of application files",
          "To automatically scale applications"
        ],
        correct_answer: "To package applications with their dependencies for consistent deployment",
        explanation: "Containerization packages applications along with all their dependencies (libraries, runtime, system tools) into a portable container. This ensures consistent deployment across different environments and eliminates 'it works on my machine' problems.",
        difficulty: 2,
        topic_area: "Container Fundamentals"
      },
      {
        id: 2,
        question: "Which command is used to create and start a new Docker container from an image?",
        options: [
          "docker build",
          "docker create",
          "docker run",
          "docker start"
        ],
        correct_answer: "docker run",
        explanation: "The 'docker run' command both creates a new container from an image and starts it immediately. It's equivalent to running 'docker create' followed by 'docker start'.",
        difficulty: 1,
        topic_area: "Docker Commands"
      },
      {
        id: 3,
        question: "What is the difference between a Docker image and a Docker container?",
        options: [
          "Images are running instances, containers are templates",
          "Images are templates, containers are running instances",
          "There is no difference",
          "Images are smaller than containers"
        ],
        correct_answer: "Images are templates, containers are running instances",
        explanation: "A Docker image is a read-only template that contains the application code, libraries, dependencies, and configuration needed to run an application. A container is a running instance of an image.",
        difficulty: 2,
        topic_area: "Container Fundamentals"
      },
      {
        id: 4,
        question: "What file is typically used to define the instructions for building a Docker image?",
        options: [
          "docker.yml",
          "Dockerfile",
          "container.json",
          "image.config"
        ],
        correct_answer: "Dockerfile",
        explanation: "A Dockerfile is a text file that contains a series of instructions used to build a Docker image. It defines the base image, copies files, installs dependencies, and configures the environment.",
        difficulty: 1,
        topic_area: "Image Building"
      },
      {
        id: 5,
        question: "Which Docker command is used to list all running containers?",
        options: [
          "docker list",
          "docker ps",
          "docker containers",
          "docker show"
        ],
        correct_answer: "docker ps",
        explanation: "The 'docker ps' command lists all currently running containers. To see all containers (including stopped ones), you can use 'docker ps -a'.",
        difficulty: 1,
        topic_area: "Docker Commands"
      },
      {
        id: 6,
        question: "What is Docker Compose primarily used for?",
        options: [
          "Building single container images",
          "Managing multi-container applications",
          "Monitoring container performance",
          "Securing container networks"
        ],
        correct_answer: "Managing multi-container applications",
        explanation: "Docker Compose is a tool for defining and running multi-container Docker applications. It uses a YAML file to configure application services and allows you to create and start all services with a single command.",
        difficulty: 2,
        topic_area: "Docker Compose"
      },
      {
        id: 7,
        question: "In Kubernetes, what is a Pod?",
        options: [
          "A single container",
          "The smallest deployable unit that can contain one or more containers",
          "A cluster of nodes",
          "A type of persistent volume"
        ],
        correct_answer: "The smallest deployable unit that can contain one or more containers",
        explanation: "A Pod is the smallest deployable unit in Kubernetes. It represents a group of one or more containers that share storage, network, and a specification for how to run the containers.",
        difficulty: 3,
        topic_area: "Kubernetes Basics"
      },
      {
        id: 8,
        question: "What is the purpose of a Kubernetes Service?",
        options: [
          "To store configuration data",
          "To provide a stable network endpoint for accessing pods",
          "To schedule pods on nodes",
          "To manage persistent storage"
        ],
        correct_answer: "To provide a stable network endpoint for accessing pods",
        explanation: "A Kubernetes Service provides a stable network endpoint (IP address and DNS name) for accessing a set of pods. This abstraction allows pods to be created, destroyed, and moved without affecting how they are accessed.",
        difficulty: 3,
        topic_area: "Kubernetes Services"
      }
    ]
    
    // Filter questions based on difficulty if specified
    let filteredQuestions = sampleQuestions
    if (options.difficulty && options.difficulty !== 'mixed') {
      const targetDifficulty = parseInt(options.difficulty)
      filteredQuestions = sampleQuestions.filter(q => q.difficulty === targetDifficulty)
    }
    
    // Filter by topic area if specified
    if (options.topicArea) {
      filteredQuestions = filteredQuestions.filter(q => 
        q.topic_area.toLowerCase().includes(options.topicArea.toLowerCase())
      )
    }
    
    // Limit number of questions
    const questionCount = options.questionCount || 25
    const selectedQuestions = filteredQuestions.slice(0, questionCount)
    
    return {
      success: true,
      questions: selectedQuestions,
      meta: {
        total_available: filteredQuestions.length,
        returned: selectedQuestions.length,
        round: options.round || 1,
        fallback: true
      }
    }
  }
    /**
   * Submit quiz results to the backend
   * @param {string} topicSlug - Topic identifier
   * @param {Object} results - Quiz results
   * @returns {Promise<Object>} API response
   */
  static async submitQuizResults(topicSlug, results) {
    try {
      const data = await apiEndpoints.submitQuizResults(topicSlug, results)
      return { success: true, data }
      
    } catch (error) {
      console.error('Error submitting quiz results:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Get quiz statistics for a topic
   * @param {string} topicSlug - Topic identifier
   * @returns {Promise<Object>} API response with statistics
   */
  static async getQuizStatistics(topicSlug) {
    try {
      const data = await apiEndpoints.getQuizStatistics(topicSlug)
      return { success: true, data: data.data || {} }
      
    } catch (error) {
      console.error('Error fetching quiz statistics:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Get user progress for a topic
   * @param {string} topicSlug - Topic identifier
   * @returns {Promise<Object>} API response with progress data
   */
  static async getUserProgress(topicSlug) {
    try {
      const data = await apiEndpoints.getUserProgress(topicSlug)
      return { success: true, data: data.data || {} }
      
    } catch (error) {
      console.error('Error fetching user progress:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Update user progress for a topic
   * @param {string} topicSlug - Topic identifier
   * @param {Object} progress - Progress data
   * @returns {Promise<Object>} API response
   */
  static async updateUserProgress(topicSlug, progress) {
    try {
      const data = await apiEndpoints.updateUserProgress(topicSlug, progress)
      return { success: true, data }
      
    } catch (error) {
      console.error('Error updating user progress:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Get topic areas for a topic
   * @param {string} topicSlug - Topic identifier
   * @returns {Promise<Object>} API response with topic areas
   */
  static async getTopicAreas(topicSlug) {
    try {
      const data = await apiEndpoints.getTopicAreas(topicSlug)
      return { success: true, data: data.data || [] }
      
    } catch (error) {
      console.error('Error fetching topic areas:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Get a specific question by ID
   * @param {number|string} questionId - Question identifier
   * @returns {Promise<Object>} API response with question data
   */
  static async getQuestionById(questionId) {
    try {
      const data = await apiEndpoints.getQuestionById(questionId)
      return { success: true, data: data.data || {} }
      
    } catch (error) {
      console.error('Error fetching question:', error)
      return { success: false, error: error.message }
    }
  }
}

export default QuizAPI
