<template>
  <Card
    :clickable="true"
    padding="sm"
    @click="handleClick"
  >
    <div class="flex">
      <div class="flex-1 p-4">
        <h3 class="mb-2 text-lg font-semibold">{{ menuItem.name }}</h3>
        <p class="text-muted-foreground mb-3 text-sm leading-relaxed">
          {{ menuItem.description }}
        </p>
        <div class="flex items-center justify-between">
          <span class="text-lg text-primary font-semibold">
            {{ menuItem.price.toLocaleString() }}원
          </span>
          <Badge variant="secondary" size="sm">
            {{ menuItem.category }}
          </Badge>
        </div>
      </div>

      <div class="w-24 h-24 flex-shrink-0">
        <img
          :src="menuItem.image"
          :alt="menuItem.name"
          class="w-full h-full object-cover rounded-r-lg"
          @error="handleImageError"
        />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import type { MenuCardProps } from '@/types'

const props = defineProps<MenuCardProps>()

const emit = defineEmits<{
  click: [item: typeof props.menuItem]
}>()

const handleClick = () => {
  emit('click', props.menuItem)
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/96x96?text=이미지'
}
</script>