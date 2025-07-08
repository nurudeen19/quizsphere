/**
 * Local Storage Service for QuizSphere
 * Handles quiz sessions and topic progress storage
 */

const STORAGE_KEYS = {
  QUIZ_SESSION: 'quizsphere_quiz_session',
  TOPIC_PROGRESS: 'quizsphere_topic_progress',
  QUIZ_SETTINGS: 'quizsphere_quiz_settings'
}

export class StorageService {
  /**
   * Save current quiz session
   * @param {Object} session - Quiz session data
   */
  static saveQuizSession(session) {
    try {
      localStorage.setItem(STORAGE_KEYS.QUIZ_SESSION, JSON.stringify({
        ...session,
        timestamp: Date.now()
      }))
    } catch (error) {
      console.error('Failed to save quiz session:', error)
    }
  }

  /**
   * Get current quiz session
   * @returns {Object|null} Quiz session data or null
   */
  static getQuizSession() {
    try {
      const session = localStorage.getItem(STORAGE_KEYS.QUIZ_SESSION)
      return session ? JSON.parse(session) : null
    } catch (error) {
      console.error('Failed to get quiz session:', error)
      return null
    }
  }

  /**
   * Clear current quiz session
   */
  static clearQuizSession() {
    try {
      localStorage.removeItem(STORAGE_KEYS.QUIZ_SESSION)
    } catch (error) {
      console.error('Failed to clear quiz session:', error)
    }
  }

  /**
   * Save topic progress
   * @param {string} topicKey - Topic identifier
   * @param {Object} progress - Progress data
   */
  static saveTopicProgress(topicKey, progress) {
    try {
      const allProgress = this.getAllTopicProgress()
      allProgress[topicKey] = {
        ...progress,
        lastUpdated: Date.now()
      }
      localStorage.setItem(STORAGE_KEYS.TOPIC_PROGRESS, JSON.stringify(allProgress))
    } catch (error) {
      console.error('Failed to save topic progress:', error)
    }
  }

  /**
   * Get topic progress
   * @param {string} topicKey - Topic identifier
   * @returns {Object|null} Topic progress or null
   */
  static getTopicProgress(topicKey) {
    try {
      const allProgress = this.getAllTopicProgress()
      return allProgress[topicKey] || null
    } catch (error) {
      console.error('Failed to get topic progress:', error)
      return null
    }
  }

  /**
   * Get all topic progress
   * @returns {Object} All topic progress data
   */
  static getAllTopicProgress() {
    try {
      const progress = localStorage.getItem(STORAGE_KEYS.TOPIC_PROGRESS)
      return progress ? JSON.parse(progress) : {}
    } catch (error) {
      console.error('Failed to get all topic progress:', error)
      return {}
    }
  }

  /**
   * Save quiz settings preferences
   * @param {Object} settings - Quiz settings
   */
  static saveQuizSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.QUIZ_SETTINGS, JSON.stringify({
        ...settings,
        timestamp: Date.now()
      }))
    } catch (error) {
      console.error('Failed to save quiz settings:', error)
    }
  }

  /**
   * Get quiz settings preferences
   * @returns {Object} Quiz settings or default settings
   */
  static getQuizSettings() {
    try {
      const settings = localStorage.getItem(STORAGE_KEYS.QUIZ_SETTINGS)
      return settings ? JSON.parse(settings) : this.getDefaultQuizSettings()
    } catch (error) {
      console.error('Failed to get quiz settings:', error)
      return this.getDefaultQuizSettings()
    }
  }

  /**
   * Get default quiz settings
   * @returns {Object} Default quiz settings
   */
  static getDefaultQuizSettings() {
    return {
      quick: {
        enableTimer: false,
        timerDuration: 15, // minutes
        showFeedback: true,
        showExplanations: true
      },
      custom: {
        enableTimer: false,
        timerDuration: 15, // minutes
        showFeedback: true,
        showExplanations: true,
        allowOvertime: true
      }
    }
  }

  /**
   * Update quiz completion stats
   * @param {string} topicKey - Topic identifier
   * @param {Object} quizResult - Quiz completion result
   */
  static updateQuizStats(topicKey, quizResult) {
    try {
      const progress = this.getTopicProgress(topicKey) || {
        totalQuizzes: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        bestScore: 0,
        averageScore: 0,
        difficultyStats: {},
        recentQuizzes: []
      }

      // Update overall stats
      progress.totalQuizzes += 1
      progress.totalQuestions += quizResult.totalQuestions
      progress.totalCorrect += quizResult.correctAnswers
      progress.bestScore = Math.max(progress.bestScore, quizResult.score)
      progress.averageScore = Math.round((progress.totalCorrect / progress.totalQuestions) * 100)

      // Update difficulty stats
      const difficulty = quizResult.difficulty || 'mixed'
      if (!progress.difficultyStats[difficulty]) {
        progress.difficultyStats[difficulty] = {
          attempts: 0,
          totalQuestions: 0,
          totalCorrect: 0,
          bestScore: 0
        }
      }
      
      const diffStats = progress.difficultyStats[difficulty]
      diffStats.attempts += 1
      diffStats.totalQuestions += quizResult.totalQuestions
      diffStats.totalCorrect += quizResult.correctAnswers
      diffStats.bestScore = Math.max(diffStats.bestScore, quizResult.score)

      // Add to recent quizzes (keep last 10)
      progress.recentQuizzes.unshift({
        date: new Date().toISOString(),
        score: quizResult.score,
        questions: quizResult.totalQuestions,
        correct: quizResult.correctAnswers,
        difficulty: difficulty,
        timeTaken: quizResult.timeTaken
      })
      
      if (progress.recentQuizzes.length > 10) {
        progress.recentQuizzes = progress.recentQuizzes.slice(0, 10)
      }

      this.saveTopicProgress(topicKey, progress)
    } catch (error) {
      console.error('Failed to update quiz stats:', error)
    }
  }

  /**
   * Clear all stored data
   */
  static clearAllData() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error('Failed to clear all data:', error)
    }
  }

  /**
   * Debug method to inspect quiz session data
   * @returns {Object} Current quiz session with detailed info
   */
  static inspectQuizSession() {
    try {
      const session = this.getQuizSession()
      if (!session) {
        console.log('No quiz session found in localStorage')
        return null
      }

      console.log('=== Quiz Session Inspection ===')
      console.log('Session keys:', Object.keys(session))
      console.log('Topic Key:', session.topicKey)
      console.log('Has questions:', !!session.questions)
      
      if (session.questions) {
        console.log('Number of questions:', session.questions.length)
        if (session.questions.length > 0) {
          console.log('First question keys:', Object.keys(session.questions[0]))
          console.log('First question sample:', {
            id: session.questions[0].id,
            question: session.questions[0].question ? session.questions[0].question.substring(0, 100) + '...' : 'NO QUESTION FIELD',
            options: session.questions[0].options,
            answer: session.questions[0].answer,
            is_multiple: session.questions[0].is_multiple
          })
        }
      }
      
      console.log('Config:', session.config)
      console.log('================================')
      
      return session
    } catch (error) {
      console.error('Failed to inspect quiz session:', error)
      return null
    }
  }
}

export default StorageService
