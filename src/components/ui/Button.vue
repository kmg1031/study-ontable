<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <component
      v-if="loading"
      :is="LoaderIcon"
      class="w-4 h-4 animate-spin mr-2"
    />
    <component
      v-else-if="icon"
      :is="icon"
      class="w-4 h-4"
      :class="{ 'mr-2': $slots.default }"
    />
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'

const LoaderIcon = Loader2

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  variant: {
    type: String,
    default: 'default'
  },
  size: {
    type: String,
    default: 'md'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  icon: Object
})

const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-md',
    'text-sm',
    'font-medium',
    'ring-offset-background',
    'transition-colors',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-ring',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50'
  ]

  // Variant classes
  const variantClasses = {
    default: [
      'border',
      'border-input',
      'bg-background',
      'hover:bg-accent',
      'hover:text-accent-foreground'
    ],
    primary: [
      'bg-primary',
      'text-primary-foreground',
      'hover:bg-primary/90'
    ],
    secondary: [
      'bg-secondary',
      'text-secondary-foreground',
      'hover:bg-secondary/80'
    ],
    destructive: [
      'bg-destructive',
      'text-destructive-foreground',
      'hover:bg-destructive/90'
    ],
    outline: [
      'border',
      'border-input',
      'bg-background',
      'hover:bg-accent',
      'hover:text-accent-foreground'
    ],
    ghost: [
      'hover:bg-accent',
      'hover:text-accent-foreground'
    ]
  }

  // Size classes
  const sizeClasses = {
    sm: ['h-9', 'px-3'],
    md: ['h-10', 'px-4', 'py-2'],
    lg: ['h-11', 'px-8']
  }

  // Full width class
  const widthClasses = props.fullWidth ? ['w-full'] : []

  return [
    ...baseClasses,
    ...variantClasses[props.variant],
    ...sizeClasses[props.size],
    ...widthClasses
  ]
})
</script>