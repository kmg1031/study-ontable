<template>
  <div class="flex items-center gap-3">
    <Button
      variant="outline"
      size="sm"
      :icon="MinusIcon"
      :disabled="disabled || quantity <= (min || 1)"
      @click="decreaseQuantity"
    />
    <span class="w-8 text-center">{{ quantity }}</span>
    <Button
      variant="outline"
      size="sm"
      :icon="PlusIcon"
      :disabled="disabled || (max && quantity >= max)"
      @click="increaseQuantity"
    />
  </div>
</template>

<script setup lang="ts">
import { Minus, Plus } from 'lucide-vue-next'
import Button from './Button.vue'
import type { QuantityControlProps } from '@/types'

const MinusIcon = Minus
const PlusIcon = Plus

const props = withDefaults(defineProps<QuantityControlProps>(), {
  min: 1,
  disabled: false
})

const emit = defineEmits<{
  quantityChange: [quantity: number]
}>()

const decreaseQuantity = () => {
  const newQuantity = Math.max(props.min || 1, props.quantity - 1)
  if (newQuantity !== props.quantity) {
    emit('quantityChange', newQuantity)
  }
}

const increaseQuantity = () => {
  const newQuantity = props.max ? Math.min(props.max, props.quantity + 1) : props.quantity + 1
  if (newQuantity !== props.quantity) {
    emit('quantityChange', newQuantity)
  }
}
</script>