<template>
  <Card
    :padding="padding"
    :class="errorClasses"
  >
    <div class="flex items-start gap-3">
      <component
        :is="icon"
        class="w-5 h-5 text-destructive flex-shrink-0 mt-0.5"
      />

      <div class="flex-1 min-w-0">
        <h4 v-if="title" class="font-semibold text-destructive mb-1">
          {{ title }}
        </h4>

        <p class="text-sm text-muted-foreground mb-3">
          {{ message }}
        </p>

        <div v-if="showRetry || $slots.actions" class="flex gap-2">
          <Button
            v-if="showRetry"
            variant="outline"
            size="sm"
            @click="handleRetry"
          >
            다시 시도
          </Button>

          <slot name="actions" />
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AlertTriangle, XCircle, AlertCircle } from 'lucide-vue-next'
import Card from './Card.vue'
import Button from './Button.vue'

interface ErrorMessageProps {
  title?: string
  message: string
  type?: 'error' | 'warning' | 'info'
  padding?: 'sm' | 'md' | 'lg'
  showRetry?: boolean
}

const props = withDefaults(defineProps<ErrorMessageProps>(), {
  type: 'error',
  padding: 'md',
  showRetry: false
})

const emit = defineEmits<{
  retry: []
}>()

const icon = computed(() => {
  const icons = {
    error: XCircle,
    warning: AlertTriangle,
    info: AlertCircle
  }
  return icons[props.type]
})

const errorClasses = computed(() => {
  const typeClasses = {
    error: ['border-destructive/20', 'bg-destructive/5'],
    warning: ['border-yellow-200', 'bg-yellow-50'],
    info: ['border-blue-200', 'bg-blue-50']
  }

  return typeClasses[props.type]
})

const handleRetry = (): void => {
  emit('retry')
}
</script>