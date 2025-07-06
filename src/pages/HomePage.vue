<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 min-h-screen flex items-center">
      <!-- Animated Background -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50"></div>
        <div class="absolute inset-0 grid place-items-center opacity-30">
          <div class="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 gap-4 md:gap-6 lg:gap-8">
            <template v-for="n in 160" :key="n">
              <div 
                class="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full opacity-20 animate-pulse"
                :style="{ 
                  'animation-delay': `${n * 100}ms`,
                  'animation-duration': `${2 + (n % 3)}s`
                }"
              />
            </template>
          </div>
        </div>
        <!-- Floating Elements -->
        <div class="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full animate-float"></div>
        <div class="absolute top-40 right-20 w-32 h-32 bg-cyan-200/20 rounded-full animate-float-delayed"></div>
        <div class="absolute bottom-40 left-20 w-16 h-16 bg-purple-200/25 rounded-full animate-float-slow"></div>
      </div>
      
      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <a href="#stats-section" class="flex flex-col items-center text-blue-600/70 hover:text-blue-600 transition-colors group" aria-label="Scroll to explore">
          <span class="text-sm font-medium mb-2 group-hover:text-blue-700">Explore More</span>
          <div class="w-6 h-10 border-2 border-blue-400 rounded-full flex justify-center">
            <div class="w-1 h-3 bg-blue-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </a>
      </div>

      <div class="relative container mx-auto px-4 z-10">
        <div class="max-w-5xl mx-auto text-center">
          <!-- Badge -->
          <div class="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-blue-700 bg-blue-100 rounded-full border border-blue-200">
            <span class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            Join 10,000+ developers learning daily
          </div>
          
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradient">
              Master Tech Skills
            </span>
            <br />
            <span class="text-blue-800">Through Practice</span>
          </h1>
          
          <p class="text-xl lg:text-2xl text-blue-700/80 mb-8 leading-relaxed max-w-3xl mx-auto">
            Interactive quizzes, real-world scenarios, and hands-on practice to accelerate your 
            <span class="font-semibold text-blue-800">cloud computing</span>, 
            <span class="font-semibold text-blue-800">programming</span>, and 
            <span class="font-semibold text-blue-800">DevOps</span> journey.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <router-link
              to="/topics"
              class="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 hover:shadow-2xl shadow-lg"
            >
              Start Learning Now
              <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </router-link>
            <a
              href="#featured-topics"
              class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-700 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-white border-2 border-blue-200/50 hover:border-blue-300 transition-all shadow-lg hover:shadow-xl"
            >
              Browse Topics
            </a>
          </div>

          <!-- Quick Stats Preview -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div class="text-center p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-blue-100">
              <div class="text-2xl font-bold text-blue-800">50+</div>
              <div class="text-sm text-blue-600">Topics</div>
            </div>
            <div class="text-center p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-blue-100">
              <div class="text-2xl font-bold text-blue-800">1000+</div>
              <div class="text-sm text-blue-600">Questions</div>
            </div>
            <div class="text-center p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-blue-100">
              <div class="text-2xl font-bold text-blue-800">10k+</div>
              <div class="text-sm text-blue-600">Learners</div>
            </div>
            <div class="text-center p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-blue-100">
              <div class="text-2xl font-bold text-blue-800">95%</div>
              <div class="text-sm text-blue-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section id="stats-section" class="py-16 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-cyan-600/5 backdrop-blur-sm border-y border-blue-100">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-blue-900 mb-4">Our Growing Community</h2>
          <p class="text-lg text-blue-600">Real numbers from real learners</p>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div v-if="isLoading" class="col-span-2 lg:col-span-4 py-8">
            <div class="animate-pulse flex flex-col items-center space-y-4">
              <div class="h-8 w-24 bg-blue-200 rounded"></div>
              <div class="h-4 w-32 bg-blue-100 rounded"></div>
            </div>
          </div>
          <template v-else>
            <StatsCard
              v-for="stat in stats"
              :key="stat.label"
              :value="stat.value"
              :label="stat.label"
              :icon="stat.icon"
              class="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100"
            />
          </template>
        </div>
      </div>
    </section>

    <!-- Learning Path Showcase -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <span class="inline-block px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full mb-4">
            Learning Paths
          </span>
          <h2 class="text-4xl font-bold text-blue-900 mb-4">Structured Learning Journey</h2>
          <p class="text-lg text-blue-600 max-w-2xl mx-auto">Follow curated paths designed by industry experts to master specific technologies</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div class="group relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div class="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h4a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-blue-900 mb-3">Cloud Foundations</h3>
            <p class="text-blue-600 mb-4">Start with AWS, Azure, and GCP basics</p>
            <div class="flex items-center text-sm text-blue-500">
              <span>12 Topics</span>
              <span class="mx-2">•</span>
              <span>~6 weeks</span>
            </div>
          </div>

          <div class="group relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div class="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-purple-900 mb-3">DevOps Mastery</h3>
            <p class="text-purple-600 mb-4">Docker, Kubernetes, and CI/CD pipelines</p>
            <div class="flex items-center text-sm text-purple-500">
              <span>15 Topics</span>
              <span class="mx-2">•</span>
              <span>~8 weeks</span>
            </div>
          </div>

          <div class="group relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div class="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-green-900 mb-3">Full-Stack Dev</h3>
            <p class="text-green-600 mb-4">Modern web development stack</p>
            <div class="flex items-center text-sm text-green-500">
              <span>20 Topics</span>
              <span class="mx-2">•</span>
              <span>~10 weeks</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Topics -->
    <section id="featured-topics" class="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div class="container mx-auto px-4 max-w-7xl">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full mb-4">
            Most Popular
          </span>
          <h2 class="text-4xl font-bold text-blue-900 mb-6">Start Your Learning Journey</h2>
          <p class="text-xl text-blue-600 max-w-3xl mx-auto">Choose from our most popular topics and begin mastering the skills that matter most in today's tech landscape</p>
        </div>
        
        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div v-for="n in 6" :key="n" class="animate-pulse">
            <div class="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden h-80">
              <div class="h-48 bg-gradient-to-br from-blue-100 to-cyan-100"></div>
              <div class="p-6 space-y-4">
                <div class="h-5 bg-blue-100 rounded w-3/4"></div>
                <div class="h-4 bg-blue-50 rounded w-1/2"></div>
                <div class="h-3 bg-blue-50 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 justify-items-center">
          <div v-for="topic in featuredTopics" :key="topic.id" class="w-full max-w-sm">
            <TopicCard
              :topic="topic"
              class="featured-card h-full"
              :aria-label="'Learn about ' + topic.title"
            />
          </div>
        </div>
        
        <div class="text-center">
          <router-link
            to="/topics"
            class="group inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View All Topics
            <svg class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full mb-4">
            Why Choose Us
          </span>
          <h2 class="text-4xl font-bold text-blue-900 mb-6">Learn Smarter, Not Harder</h2>
          <p class="text-xl text-blue-600 max-w-3xl mx-auto">Experience a revolutionary approach to tech education with our interactive platform</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            v-for="(feature, index) in features"
            :key="feature.title"
            :title="feature.title"
            :description="feature.description"
            :icon="feature.icon"
            class="group hover:scale-105 transition-all duration-300"
            :class="`animate-fade-in-up delay-${index * 100}`"
          />
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full mb-4">
            Success Stories
          </span>
          <h2 class="text-4xl font-bold text-blue-900 mb-6">What Our Learners Say</h2>
          <p class="text-xl text-blue-600 max-w-3xl mx-auto">Join thousands of developers who have transformed their careers</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <!-- Testimonial 1 -->
          <div class="bg-white rounded-2xl p-8 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div class="flex items-center mb-4">
              <div class="flex text-yellow-400">
                <svg v-for="i in 5" :key="i" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <p class="text-gray-600 mb-6">"QuizSphere helped me land my AWS certification and a new job as a cloud architect. The interactive format made complex topics easy to understand."</p>
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                SJ
              </div>
              <div class="ml-4">
                <h4 class="font-semibold text-gray-900">Sarah Johnson</h4>
                <p class="text-sm text-gray-500">Cloud Architect at TechCorp</p>
              </div>
            </div>
          </div>

          <!-- Testimonial 2 -->
          <div class="bg-white rounded-2xl p-8 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div class="flex items-center mb-4">
              <div class="flex text-yellow-400">
                <svg v-for="i in 5" :key="i" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <p class="text-gray-600 mb-6">"The Kubernetes section was incredibly detailed. I went from knowing nothing to deploying production workloads in just 2 months!"</p>
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                MC
              </div>
              <div class="ml-4">
                <h4 class="font-semibold text-gray-900">Mike Chen</h4>
                <p class="text-sm text-gray-500">DevOps Engineer at StartupXYZ</p>
              </div>
            </div>
          </div>

          <!-- Testimonial 3 -->
          <div class="bg-white rounded-2xl p-8 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div class="flex items-center mb-4">
              <div class="flex text-yellow-400">
                <svg v-for="i in 5" :key="i" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <p class="text-gray-600 mb-6">"Perfect for busy professionals. I could learn during my commute and the bite-sized lessons fit perfectly into my schedule."</p>
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                AR
              </div>
              <div class="ml-4">
                <h4 class="font-semibold text-gray-900">Alex Rodriguez</h4>
                <p class="text-sm text-gray-500">Full-Stack Developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 text-white relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 40px 40px;"></div>
      </div>
      
      <!-- Floating Elements -->
      <div class="absolute top-20 left-20 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
      <div class="absolute bottom-20 right-20 w-32 h-32 bg-white/5 rounded-full animate-float-delayed"></div>
      
      <div class="container mx-auto px-4 text-center relative z-10">
        <div class="max-w-4xl mx-auto">
          <span class="inline-block px-4 py-2 text-sm font-semibold text-blue-100 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
            Ready to Start?
          </span>
          <h2 class="text-4xl lg:text-5xl font-bold mb-6">
            Your Tech Career Transformation Starts Here
          </h2>
          <p class="text-xl lg:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of developers who've accelerated their careers with QuizSphere. 
            Start learning today and see results in weeks, not years.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <router-link
              to="/topics"
              class="group inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl"
            >
              Start Learning Free
              <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </router-link>
            
            <a
              href="#featured-topics"
              class="inline-flex items-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-xl hover:border-white hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Explore Topics
            </a>
          </div>

          <!-- Quick Benefits -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div class="flex items-center justify-center space-x-2 text-blue-100">
              <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>100% Free to Start</span>
            </div>
            <div class="flex items-center justify-center space-x-2 text-blue-100">
              <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>No Credit Card Required</span>
            </div>
            <div class="flex items-center justify-center space-x-2 text-blue-100">
              <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>Start Learning Instantly</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchHomepageData } from '../services/page-utils';
import FeatureCard from '../components/home/FeatureCard.vue'
import TopicCard from '../components/home/TopicCard.vue'
import StatsCard from '../components/home/StatsCard.vue'
import { Squares2X2Icon } from '@heroicons/vue/24/outline'

const isLoading = ref(true)
const featuredTopics = ref([])
// Define types for better type safety
const stats = ref([
  { label: 'Active Topics', value: '0', icon: 'book', key: 'totalTopics' },
  { label: 'Total Questions', value: '0', icon: 'question', key: 'totalQuestions' },
  { label: 'Learning Paths', value: '0', icon: 'academic', key: 'totalLearningPaths' },
  { label: 'Daily Active Users', value: '0', icon: 'users', key: 'dailyActiveUsers' }
])

const features = [
  {
    title: 'Practice-Driven Learning',
    description: 'Learn through hands-on practice with real-world scenarios and challenges',
    icon: 'academic'
  },
  {
    title: 'Progress Tracking',
    description: 'Monitor your learning journey with detailed progress analytics',
    icon: 'chart'
  },
  {
    title: 'Comprehensive Coverage',
    description: 'Wide range of topics covering the latest in tech and cloud computing',
    icon: 'cloud'
  },
  {
    title: 'Regular Updates',
    description: 'Content regularly updated to keep pace with industry changes',
    icon: 'refresh'
  },
  {
    title: 'Flexible Learning',
    description: 'Learn at your own pace with bite-sized chapters and quizzes',
    icon: 'clock'
  },
  {
    title: 'Community Driven',
    description: 'Join a community of learners and contribute to the platform',
    icon: 'users'
  }
]

// Optimized data fetching
onMounted(async () => {
  try {
    // Fetch homepage data with optimized response
    let sections = {'featuredTopics': true, 'statistics': true};
    const response = await fetchHomepageData(sections, { featured_topics_limit: 6 })
    if (response.status === 'success' && response.data) {
      const { featuredTopics: apiTopics, statistics } = response.data
      // Set featured topics directly from API
      featuredTopics.value = apiTopics?.map(topic => ({
        ...topic,
        image: topic.icon || `https://source.unsplash.com/featured/400x300/?${encodeURIComponent(topic.title)}`
      })) || []
      
      // Update stats from pre-calculated values
      stats.value.forEach(stat => {
        stat.value = statistics[stat.key]?.toString() || '0'
      })
    }
  } catch (error) {
    console.error('Failed to fetch homepage data:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  33% {
    transform: translateY(-15px) translateX(10px);
  }
  66% {
    transform: translateY(-10px) translateX(-5px);
  }
}

@keyframes float-slow {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-25px) rotate(180deg);
  }
}

@keyframes gradient {
  0%, 100% {
    background-size: 200% 200%;
    background-position: left center;
  }
  50% {
    background-size: 200% 200%;
    background-position: right center;
  }
}

/* Utility Classes */
.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
  animation-delay: 2s;
}

.animate-float-slow {
  animation: float-slow 10s ease-in-out infinite;
  animation-delay: 1s;
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-400 { animation-delay: 400ms; }
.delay-500 { animation-delay: 500ms; }

/* Featured Cards */
.featured-card {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.featured-card:nth-child(1) { animation-delay: 100ms; }
.featured-card:nth-child(2) { animation-delay: 200ms; }
.featured-card:nth-child(3) { animation-delay: 300ms; }
.featured-card:nth-child(4) { animation-delay: 400ms; }
.featured-card:nth-child(5) { animation-delay: 500ms; }
.featured-card:nth-child(6) { animation-delay: 600ms; }

/* Text utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Background patterns */
.bg-pattern-dots {
  background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0);
  background-size: 20px 20px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .featured-card:nth-child(3n-1) {
    transform: none;
  }
  
  .featured-card:nth-child(3n-1):hover {
    transform: translateY(-4px);
  }
}

/* Loading state improvements */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Enhanced shadows */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.hover\:shadow-2xl:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Backdrop blur fallback */
@supports not (backdrop-filter: blur(12px)) {
  .backdrop-blur-sm {
    background-color: rgba(255, 255, 255, 0.9);
  }
}
</style>
