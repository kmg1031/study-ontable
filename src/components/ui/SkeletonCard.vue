<template>
  <Card :padding="padding">
    <div class="animate-pulse">
      <!-- Header Skeleton -->
      <div v-if="showHeader" class="flex justify-between items-start mb-3">
        <div class="space-y-2 flex-1">
          <div class="h-5 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div v-if="showImage" class="w-16 h-16 bg-gray-200 rounded-lg ml-4"></div>
      </div>

      <!-- Content Skeleton -->
      <div v-if="showContent" class="space-y-3">
        <div class="h-4 bg-gray-200 rounded w-full"></div>
        <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        <div class="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>

      <!-- Footer Skeleton -->
      <div v-if="showFooter" class="flex justify-between items-center mt-4">
        <div class="h-6 bg-gray-200 rounded w-20"></div>
        <div class="h-6 bg-gray-200 rounded-full w-16"></div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from './Card.vue'

interface SkeletonCardProps {
  padding?: 'sm' | 'md' | 'lg'
  showHeader?: boolean
  showContent?: boolean
  showFooter?: boolean
  showImage?: boolean
}

withDefaults(defineProps<SkeletonCardProps>(), {
  padding: 'md',
  showHeader: true,
  showContent: true,
  showFooter: true,
  showImage: false
})
</script>