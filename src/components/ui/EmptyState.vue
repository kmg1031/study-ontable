<template>
  <div :class="containerClasses">
    <div class="text-center">
      <!-- Icon or Emoji -->
      <div class="mb-4">
        <component
          v-if="icon"
          :is="icon"
          :class="iconClasses"
        />
        <div v-else-if="emoji" :class="emojiClasses">
          {{ emoji }}
        </div>
      </div>

      <!-- Title -->
      <h3 v-if="title" class="text-lg font-semibold mb-2">
        {{ title }}
      </h3>

      <!-- Description -->
      <p v-if="description" class="text-muted-foreground mb-4">
        {{ description }}
      </p>

      <!-- Actions -->
      <div v-if="$slots.actions" class="flex gap-2 justify-center">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: any // Vue component type
  emoji?: string
  size?: 'sm' | 'md' | 'lg'
  centered?: boolean
}

const props = withDefaults(defineProps<EmptyStateProps>(), {
  size: 'md',
  centered: true
})

const containerClasses = computed(() => {
  const baseClasses = ['flex', 'flex-col']

  if (props.centered) {
    baseClasses.push('items-center', 'justify-center')
  }

  const sizeClasses = {
    sm: ['py-8'],
    md: ['py-12'],
    lg: ['py-16']
  }

  return [...baseClasses, ...sizeClasses[props.size]]
})

const iconClasses = computed(() => {
  const sizeClasses = {
    sm: ['w-12', 'h-12'],
    md: ['w-16', 'h-16'],
    lg: ['w-20', 'h-20']
  }

  return ['text-muted-foreground/60', ...sizeClasses[props.size]]
})

const emojiClasses = computed(() => {
  const sizeClasses = {
    sm: ['text-4xl'],
    md: ['text-6xl'],
    lg: ['text-8xl']
  }

  return sizeClasses[props.size]
})
</script>