<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
      <div class="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          :icon="ArrowLeft"
          @click="$router.back()"
        />
        <h1 class="text-lg font-semibold">옵션 선택</h1>
      </div>
    </div>

    <div v-if="menuItem" class="p-4 space-y-6">
      <!-- Menu Item Info -->
      <Card padding="md">
        <div class="flex gap-4">
          <div class="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
            <img
              :src="menuItem.image"
              :alt="menuItem.name"
              class="w-full h-full object-cover"
              @error="$event.target.src = 'https://via.placeholder.com/80x80?text=이미지'"
            />
          </div>
          <div class="flex-1">
            <div class="flex items-start justify-between">
              <div>
                <h2 class="mb-1 text-lg font-semibold">{{ menuItem.name }}</h2>
                <p class="text-muted-foreground text-sm">
                  {{ menuItem.description }}
                </p>
              </div>
              <Badge variant="secondary" size="sm" class="ml-2">
                {{ menuItem.category }}
              </Badge>
            </div>
            <div class="mt-2">
              <span class="text-lg text-primary font-semibold">
                {{ menuItem.price.toLocaleString() }}원
              </span>
            </div>
          </div>
        </div>
      </Card>

      <!-- Size Options -->
      <Card v-if="menuItem.options?.sizes" title="사이즈 선택" padding="md">
          <div class="space-y-3">
            <div
              v-for="size in menuItem.options.sizes"
              :key="size.name"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-2">
                <input
                  :id="size.name"
                  v-model="selectedSize"
                  :value="size.name"
                  type="radio"
                  class="aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <label :for="size.name" class="text-sm font-medium leading-none">
                  {{ size.name }}
                </label>
              </div>
              <span class="text-sm text-muted-foreground">
                {{ size.price > 0 ? `+${size.price.toLocaleString()}원` : '기본' }}
              </span>
            </div>
          </div>
      </Card>

      <!-- Extra Options -->
      <Card v-if="menuItem.options?.extras" title="추가 옵션" padding="md">
          <div class="space-y-3">
            <div
              v-for="extra in menuItem.options.extras"
              :key="extra.name"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-2">
                <input
                  :id="extra.name"
                  v-model="selectedExtras"
                  :value="extra.name"
                  type="checkbox"
                  class="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <label :for="extra.name" class="text-sm font-medium leading-none">
                  {{ extra.name }}
                </label>
              </div>
              <span class="text-sm text-muted-foreground">
                +{{ extra.price.toLocaleString() }}원
              </span>
            </div>
          </div>
      </Card>

      <!-- Quantity -->
      <Card title="수량" padding="md">
        <div class="flex items-center justify-center">
          <QuantityControl
            :quantity="quantity"
            :min="1"
            @quantity-change="handleQuantityChange"
          />
        </div>
      </Card>
    </div>

    <!-- Bottom Fixed Button -->
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
      <Button
        variant="primary"
        size="lg"
        full-width
        @click="handleConfirm"
      >
        장바구니에 담기 · {{ totalPrice.toLocaleString() }}원
      </Button>
    </div>

    <!-- Bottom Spacing -->
    <div class="h-20"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { useMenuStore } from '@/stores/menu'
import { useCartStore } from '@/stores/cart'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Card from '@/components/ui/Card.vue'
import QuantityControl from '@/components/ui/QuantityControl.vue'

const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore()
const cartStore = useCartStore()

const selectedSize = ref('')
const selectedExtras = ref([])
const quantity = ref(1)

const menuItem = computed(() => {
  return menuStore.getMenuItemById(route.params.id)
})

const sizePrice = computed(() => {
  if (!menuItem.value?.options?.sizes || !selectedSize.value) return 0
  const size = menuItem.value.options.sizes.find(s => s.name === selectedSize.value)
  return size?.price || 0
})

const extrasPrice = computed(() => {
  if (!menuItem.value?.options?.extras) return 0
  return selectedExtras.value.reduce((total, extraName) => {
    const extra = menuItem.value.options?.extras?.find(e => e.name === extraName)
    return total + (extra?.price || 0)
  }, 0)
})

const totalPrice = computed(() => {
  if (!menuItem.value) return 0
  return (menuItem.value.price + sizePrice.value + extrasPrice.value) * quantity.value
})

const handleQuantityChange = (newQuantity) => {
  quantity.value = newQuantity
}

const handleConfirm = () => {
  if (!menuItem.value) return

  const cartItem = {
    menuItem: menuItem.value,
    quantity: quantity.value,
    selectedSize: selectedSize.value || undefined,
    selectedExtras: selectedExtras.value.length > 0 ? selectedExtras.value : undefined,
    totalPrice: totalPrice.value
  }

  cartStore.addItem(cartItem)
  router.push('/menu')
}

onMounted(() => {
  if (menuItem.value?.options?.sizes) {
    selectedSize.value = menuItem.value.options.sizes[0].name
  }
})
</script>