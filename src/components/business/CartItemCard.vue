<template>
  <Card padding="md">
    <div class="flex gap-3">
      <div class="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
        <img
          :src="cartItem.menuItem.image"
          :alt="cartItem.menuItem.name"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between mb-1">
          <h3 class="truncate text-base font-semibold">
            {{ getItemDisplayName(cartItem) }}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            :icon="TrashIcon"
            class="text-destructive hover:text-destructive"
            @click="handleRemove"
          />
        </div>

        <p
          v-if="getItemExtrasText(cartItem)"
          class="text-sm text-muted-foreground mb-2"
        >
          옵션: {{ getItemExtrasText(cartItem) }}
        </p>

        <div class="flex items-center justify-between">
          <QuantityControl
            :quantity="cartItem.quantity"
            :min="1"
            @quantity-change="handleQuantityChange"
          />

          <span class="text-primary font-semibold">
            {{ cartItem.totalPrice.toLocaleString() }}원
          </span>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { Trash2 } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import QuantityControl from '@/components/ui/QuantityControl.vue'

const TrashIcon = Trash2

const props = defineProps(['cartItem'])

const emit = defineEmits(['quantityChange', 'remove'])

const getItemDisplayName = (item) => {
  let name = item.menuItem.name
  if (item.selectedSize) {
    name += ` (${item.selectedSize})`
  }
  return name
}

const getItemExtrasText = (item) => {
  if (!item.selectedExtras || item.selectedExtras.length === 0) return ''
  return item.selectedExtras.join(', ')
}

const handleQuantityChange = (quantity) => {
  emit('quantityChange', props.cartItem.id, quantity)
}

const handleRemove = () => {
  emit('remove', props.cartItem.id)
}

const handleImageError = (event) => {
  const target = event.target
  target.src = 'https://via.placeholder.com/64x64?text=이미지'
}
</script>