<template>
  <div class="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 shadow-lg hover:shadow-xl transition-all">
    <component 
      :is="getIcon" 
      class="w-12 h-12 text-blue-600 mb-4"
      aria-hidden="true"
    />
    <h3 class="text-xl font-bold text-blue-900 mb-2">{{ title }}</h3>
    <p class="text-blue-600">{{ description }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  AcademicCapIcon,
  ChartBarIcon,
  CloudIcon,
  ArrowPathIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true,
    validator: (value) => ['academic', 'chart', 'cloud', 'refresh', 'clock', 'users'].includes(value)
  }
})

const iconMap = {
  'academic': AcademicCapIcon,
  'chart': ChartBarIcon,
  'cloud': CloudIcon,
  'refresh': ArrowPathIcon,
  'clock': ClockIcon,
  'users': UserGroupIcon
}

const getIcon = computed(() => iconMap[props.icon])
</script>
