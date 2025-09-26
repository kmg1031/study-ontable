<template>
  <div
    :class="cardClasses"
    @click="handleClick"
  >
    <!-- Header -->
    <div
      v-if="title || description || $slots.header"
      :class="headerClasses"
    >
      <slot name="header">
        <h3
          v-if="title"
          class="text-base font-semibold leading-none tracking-tight"
        >
          {{ title }}
        </h3>
        <p
          v-if="description"
          class="text-sm text-muted-foreground"
        >
          {{ description }}
        </p>
      </slot>
    </div>

    <!-- Content -->
    <div
      v-if="$slots.default"
      :class="contentClasses"
    >
      <slot />
    </div>

    <!-- Footer -->
    <div
      v-if="footer || $slots.footer"
      :class="footerClasses"
    >
      <slot name="footer">
        <p v-if="footer" class="text-sm text-muted-foreground">
          {{ footer }}
        </p>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  padding: {
    type: String,
    default: 'md'
  },
  clickable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const cardClasses = computed(() => {
  const baseClasses = [
    'rounded-lg',
    'border',
    'bg-card',
    'text-card-foreground',
    'shadow-sm'
  ]

  const clickableClasses = props.clickable ? [
    'cursor-pointer',
    'transition-all',
    'hover:shadow-md'
  ] : []

  return [...baseClasses, ...clickableClasses]
})

const headerClasses = computed(() => {
  const paddingClasses = {
    sm: ['p-4', 'pb-2'],
    md: ['p-6', 'pb-4'],
    lg: ['p-8', 'pb-6']
  }

  return [
    'flex',
    'flex-col',
    'space-y-1.5',
    ...paddingClasses[props.padding]
  ]
})

const contentClasses = computed(() => {
  const paddingClasses = {
    sm: ['p-4', 'pt-0'],
    md: ['p-6', 'pt-0'],
    lg: ['p-8', 'pt-0']
  }

  // If there's no header, remove top padding
  const hasHeader = props.title || props.description
  if (!hasHeader) {
    return {
      sm: ['p-4'],
      md: ['p-6'],
      lg: ['p-8']
    }[props.padding]
  }

  return paddingClasses[props.padding]
})

const footerClasses = computed(() => {
  const paddingClasses = {
    sm: ['p-4', 'pt-0'],
    md: ['p-6', 'pt-0'],
    lg: ['p-8', 'pt-0']
  }

  return paddingClasses[props.padding]
})

const handleClick = (event) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>