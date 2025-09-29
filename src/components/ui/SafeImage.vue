<template>
  <div :class="containerClasses">
    <!-- 로딩 상태 -->
    <div
      v-if="isLoading"
      :class="loadingClasses"
    >
      <LoadingSpinner size="sm" />
    </div>

    <!-- 에러 상태 -->
    <div
      v-else-if="hasError"
      :class="errorClasses"
    >
      <ImageIcon :class="errorIconClasses" />
      <span v-if="showErrorText" class="text-xs text-muted-foreground mt-1">
        이미지를 불러올 수 없습니다
      </span>
      <Button
        v-if="showRetry"
        variant="outline"
        size="sm"
        class="mt-2"
        @click="handleRetry"
      >
        다시 시도
      </Button>
    </div>

    <!-- 이미지 -->
    <img
      v-else
      :src="currentSrc"
      :alt="alt"
      :class="imageClasses"
      @load="handleLoad"
      @error="handleError"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Image as ImageIcon } from 'lucide-vue-next'
import LoadingSpinner from './LoadingSpinner.vue'
import Button from './Button.vue'

interface SafeImageProps {
  src: string
  alt: string
  fallbackSrc?: string
  width?: string | number
  height?: string | number
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  rounded?: boolean
  showRetry?: boolean
  showErrorText?: boolean
  lazy?: boolean
}

const props = withDefaults(defineProps<SafeImageProps>(), {
  objectFit: 'cover',
  rounded: false,
  showRetry: false,
  showErrorText: true,
  lazy: false
})

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
}>()

const isLoading = ref(true)
const hasError = ref(false)
const currentSrc = ref(props.src)
const retryCount = ref(0)
const maxRetries = 2

const containerClasses = computed(() => {
  const baseClasses = ['relative', 'overflow-hidden']

  if (props.rounded) {
    baseClasses.push('rounded-lg')
  }

  return baseClasses
})

const imageClasses = computed(() => {
  const baseClasses = ['w-full', 'h-full', 'transition-opacity', 'duration-300']

  // Object fit
  baseClasses.push(`object-${props.objectFit}`)

  if (isLoading.value) {
    baseClasses.push('opacity-0')
  } else {
    baseClasses.push('opacity-100')
  }

  return baseClasses
})

const loadingClasses = computed(() => [
  'absolute',
  'inset-0',
  'flex',
  'items-center',
  'justify-center',
  'bg-gray-100',
  'animate-pulse'
])

const errorClasses = computed(() => [
  'absolute',
  'inset-0',
  'flex',
  'flex-col',
  'items-center',
  'justify-center',
  'bg-gray-50',
  'text-gray-400'
])

const errorIconClasses = computed(() => {
  const sizeClasses = props.height ? ['w-8', 'h-8'] : ['w-12', 'h-12']
  return ['text-gray-300', ...sizeClasses]
})

const handleLoad = (event: Event): void => {
  isLoading.value = false
  hasError.value = false
  retryCount.value = 0
  emit('load', event)
}

const handleError = (event: Event): void => {
  isLoading.value = false

  // fallback 이미지가 있고 아직 시도하지 않았다면
  if (props.fallbackSrc && currentSrc.value !== props.fallbackSrc) {
    currentSrc.value = props.fallbackSrc
    return
  }

  // 재시도 가능하다면
  if (retryCount.value < maxRetries) {
    retryCount.value++
    // 약간의 지연 후 재시도
    setTimeout(() => {
      const timestamp = Date.now()
      currentSrc.value = `${props.src}?t=${timestamp}`
    }, 1000 * retryCount.value)
    return
  }

  // 최종 에러 상태
  hasError.value = true
  emit('error', event)
}

const handleRetry = (): void => {
  if (retryCount.value < maxRetries) {
    isLoading.value = true
    hasError.value = false
    retryCount.value++

    const timestamp = Date.now()
    currentSrc.value = `${props.src}?t=${timestamp}`
  }
}

// src prop 변경 감지
watch(() => props.src, (newSrc) => {
  if (newSrc !== currentSrc.value) {
    isLoading.value = true
    hasError.value = false
    retryCount.value = 0
    currentSrc.value = newSrc
  }
})

// 컨테이너 스타일링
const containerStyle = computed(() => {
  const style: Record<string, string> = {}

  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }

  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }

  return style
})
</script>

<style scoped>
.container {
  min-height: 48px; /* 최소 높이 보장 */
}
</style>