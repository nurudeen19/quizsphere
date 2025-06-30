<template>
  <div class="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 shadow-lg hover:shadow-xl transition-all">
    <component 
      :is="iconComponent" 
      class="w-12 h-12 text-blue-600 mb-4"
      aria-hidden="true"
    />
    <h3 class="text-xl font-bold text-blue-900 mb-2">{{ title }}</h3>
    <p class="text-blue-600">{{ description }}</p>
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
  academic: AcademicIcon,
  chart: ChartIcon,
  cloud: CloudIcon,
  refresh: RefreshIcon,
  clock: ClockIcon,
  users: UsersIcon
}

export default {
  name: 'FeatureCard',
  props: {
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
      validator: function(value) {
        return ['academic', 'chart', 'cloud', 'refresh', 'clock', 'users'].includes(value)
      }
    }
  },
  computed: {
    iconComponent() {
      return iconMap[this.icon]
    }
  }
}
</script>
