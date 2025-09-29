<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      <TransitionGroup
        name="toast"
        tag="div"
        class="flex flex-col gap-2"
      >
        <Toast
          v-for="toast in toasts"
          :key="toast.id"
          :title="toast.title"
          :message="toast.message"
          :type="toast.type"
          :duration="toast.duration"
          :closable="toast.closable"
          @close="removeToast(toast.id)"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { globalErrorHandler } from '@/composables/useErrorHandler'
import Toast from './Toast.vue'

const { toasts, removeToast } = globalErrorHandler
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>