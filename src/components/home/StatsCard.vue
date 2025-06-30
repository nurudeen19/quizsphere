<template>
  <div class="p-6 rounded-2xl bg-white shadow-lg border border-blue-100 transform transition-all hover:scale-105">
    <component 
      :is="getIcon" 
      class="w-12 h-12 text-blue-600 mx-auto mb-4"
      aria-hidden="true"
    />
    <div class="text-3xl font-bold text-blue-900 mb-2">{{ value }}</div>
    <div class="text-blue-600 font-medium">{{ label }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  BookOpenIcon,
  QuestionMarkCircleIcon,
  AcademicCapIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  value: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true,
    validator: (value) => ['book', 'question', 'academic', 'users'].includes(value)
  }
})

const iconMap = {
  'book': BookOpenIcon,
  'question': QuestionMarkCircleIcon,
  'academic': AcademicCapIcon,
  'users': UserGroupIcon
}

const getIcon = computed(() => iconMap[props.icon])
</script>
