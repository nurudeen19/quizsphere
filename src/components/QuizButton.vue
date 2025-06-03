<template>
  <button
    :class="'start-quiz-btn-new px-6 py-3 rounded-full font-bold text-base flex items-center justify-center gap-2 mt-auto transition-all mx-auto w-auto min-w-[140px] ' + colorClass"
    :aria-label="aria"
    tabindex="0"
    @click="click"
  >
    <span class="icon-wrapper-new flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-300 text-white shadow">
      <i class="fas fa-play"></i>
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
