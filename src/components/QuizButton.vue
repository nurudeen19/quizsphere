<template>
  <button
    :class="'start-quiz-btn-new px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full font-bold text-xs sm:text-sm md:text-base flex items-center justify-center gap-1 sm:gap-2 mt-auto transition-all mx-auto w-auto min-w-[120px] sm:min-w-[140px] ' + colorClass"
    :aria-label="aria"
    tabindex="0"
    @click="click"
  >
    <span class="icon-wrapper-new flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-300 text-white shadow">
      <i class="fas fa-play text-xs sm:text-sm md:text-base"></i>
    </span>
    <span>{{ label }}</span>
  </button>
</template>

<script setup>
defineProps({
  label: String,
  colorClass: String,
  aria: String,
  click: Function
})
</script>

<style scoped>
.start-quiz-btn-new {
  background: linear-gradient(to right, #3b82f6, #0ea5e9);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.2), 0 2px 4px -2px rgba(14, 165, 233, 0.1);
  transition: all 0.3s ease;
}

.start-quiz-btn-new:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(14, 165, 233, 0.3), 0 4px 6px -4px rgba(14, 165, 233, 0.2);
}

.start-quiz-btn-new:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px -1px rgba(14, 165, 233, 0.15);
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .start-quiz-btn-new {
    min-width: 100px;
    box-shadow: 0 2px 4px rgba(14, 165, 233, 0.2);
  }
  
  .start-quiz-btn-new:hover {
    transform: none;
    box-shadow: 0 2px 4px rgba(14, 165, 233, 0.2);
  }
}
</style>
