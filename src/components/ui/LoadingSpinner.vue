<template>
  <div :class="spinnerClasses">
    <Loader2 :class="iconClasses" />
    <span v-if="text" :class="textClasses">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  centered?: boolean
}

const props = withDefaults(defineProps<LoadingSpinnerProps>(), {
  size: 'md',
  centered: false
})

const spinnerClasses = computed(() => {
  const baseClasses = ['flex', 'items-center', 'gap-2']

  if (props.centered) {
    baseClasses.push('justify-center')
  }

  return baseClasses
})

const iconClasses = computed(() => {
  const baseClasses = ['animate-spin']

  const sizeClasses = {
    sm: ['w-4', 'h-4'],
    md: ['w-6', 'h-6'],
    lg: ['w-8', 'h-8']
  }

  return [...baseClasses, ...sizeClasses[props.size]]
})

const textClasses = computed(() => {
  const sizeClasses = {
    sm: ['text-sm'],
    md: ['text-base'],
    lg: ['text-lg']
  }

  return ['text-muted-foreground', ...sizeClasses[props.size]]
})
</script>