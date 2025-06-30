<template>
  <div class="p-6 rounded-2xl bg-white shadow-lg border border-blue-100 transform transition-all hover:scale-105">
    <component 
      :is="iconComponent" 
      class="w-12 h-12 text-blue-600 mx-auto mb-4"
      aria-hidden="true"
    />
    <div class="text-3xl font-bold text-blue-900 mb-2">{{ value }}</div>
    <div class="text-blue-600 font-medium">{{ label }}</div>
  </div>
</template>

<script>
import AcademicIcon from '../icons/AcademicIcon.vue'
import ChartIcon from '../icons/ChartIcon.vue'
import CloudIcon from '../icons/CloudIcon.vue'
import RefreshIcon from '../icons/RefreshIcon.vue'
import ClockIcon from '../icons/ClockIcon.vue'
import UsersIcon from '../icons/UsersIcon.vue'

const iconMap = {
  'book': AcademicIcon,
  'question': AcademicIcon,
  'academic': AcademicIcon,
  'users': UsersIcon,
  'chart': ChartIcon,
  'cloud': CloudIcon,
  'refresh': RefreshIcon,
  'clock': ClockIcon
}

export default {
  name: 'StatsCard',
  components: {
    AcademicIcon,
    ChartIcon,
    CloudIcon,
    RefreshIcon,
    ClockIcon,
    UsersIcon
  },
  props: {
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
      validator: function(value) {
        return Object.keys(iconMap).includes(value.toLowerCase())
      }
    }
  },
  computed: {
    iconComponent() {
      const icon = this.icon.toLowerCase()
      return iconMap[icon]
    }
  }
}
</script>
