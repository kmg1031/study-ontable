<template>
  <Transition
    name="toast"
    appear
  >
    <div
      v-if="visible"
      :class="toastClasses"
      role="alert"
      aria-live="polite"
    >
      <div class="flex items-start gap-3">
        <component
          :is="icon"
          :class="iconClasses"
        />

        <div class="flex-1 min-w-0">
          <h4 v-if="title" class="font-semibold mb-1">
            {{ title }}
          </h4>
          <p class="text-sm">
            {{ message }}
          </p>
        </div>

        <Button
          v-if="closable"
          variant="ghost"
          size="sm"
          :icon="XIcon"
          @click="handleClose"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'
import Button from './Button.vue'

interface ToastProps {
  title?: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  closable?: boolean
}

const props = withDefaults(defineProps<ToastProps>(), {
  type: 'info',
  duration: 5000,
  closable: true
})

const emit = defineEmits<{
  close: []
}>()

const XIcon = X
const visible = ref(true)

const icon = computed(() => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info
  }
  return icons[props.type]
})

const toastClasses = computed(() => {
  const baseClasses = [
    'fixed',
    'top-4',
    'right-4',
    'z-50',
    'w-full',
    'max-w-sm',
    'rounded-lg',
    'border',
    'p-4',
    'shadow-lg',
    'backdrop-blur',
    'bg-background/95'
  ]

  const typeClasses = {
    success: ['border-green-200', 'bg-green-50/90'],
    error: ['border-red-200', 'bg-red-50/90'],
    warning: ['border-yellow-200', 'bg-yellow-50/90'],
    info: ['border-blue-200', 'bg-blue-50/90']
  }

  return [...baseClasses, ...typeClasses[props.type]]
})

const iconClasses = computed(() => {
  const typeClasses = {
    success: ['text-green-600'],
    error: ['text-red-600'],
    warning: ['text-yellow-600'],
    info: ['text-blue-600']
  }

  return ['w-5', 'h-5', 'flex-shrink-0', ...typeClasses[props.type]]
})

const handleClose = (): void => {
  visible.value = false
  setTimeout(() => {
    emit('close')
  }, 300) // Wait for animation to complete
}

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(() => {
      handleClose()
    }, props.duration)
  }
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>