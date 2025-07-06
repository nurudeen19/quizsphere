import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import TopicsPage from '../pages/TopicsPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: {
      title: 'QuizSphere - Interactive Tech Quizzes',
      description: 'Master tech skills with interactive quizzes. Practice cloud computing, programming, and DevOps through hands-on learning.'
    }
  },
  {
    path: '/home',
    redirect: '/'
  },
  {
    path: '/topics',
    name: 'topics',
    component: TopicsPage,
    meta: {
      title: 'Explore Topics - QuizSphere',
      description: 'Browse our comprehensive collection of tech topics. Practice and master new skills through interactive quizzes.'
    }
  },
  {
    path: '/topic/:topicSlug',
    name: 'topic',
    component: () => import('../pages/TopicPage.vue'), // Lazy loaded
    props: true,
    meta: {
      title: 'Topic - QuizSphere',
      description: 'Learn about and prepare for your quiz. Review chapter information and topic details.'
    }
  },
  {
    path: '/quiz/:topicKey',
    name: 'quiz',
    component: () => import('../pages/QuizPage.vue'), // Lazy loaded
    props: true,
    meta: {
      title: 'Quiz - QuizSphere',
      description: 'Test your knowledge and improve your skills with our interactive quiz system.'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// Update metadata for each route
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'QuizSphere'
  
  // Update meta description
  let metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.name = 'description'
    document.head.appendChild(metaDescription)
  }
  metaDescription.content = to.meta.description || ''

  next()
})

export default router
