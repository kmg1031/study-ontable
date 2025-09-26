<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <MapPin class="w-5 h-5 text-primary" />
          <span class="text-lg">테이블 {{ cartStore.tableNumber }}</span>
        </div>

        <div class="relative">
          <Button
            variant="outline"
            :icon="ShoppingCart"
            @click="$router.push('/cart')"
          >
            장바구니
          </Button>
          <Badge
            v-if="cartStore.itemCount > 0"
            variant="destructive"
            size="sm"
            class="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {{ cartStore.itemCount }}
          </Badge>
        </div>
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="sticky top-16 z-10 bg-background border-b border-border px-4 py-3">
      <div class="flex gap-2 overflow-x-auto">
        <Button
          v-for="category in menuStore.getCategories"
          :key="category"
          :variant="selectedCategory === category ? 'primary' : 'outline'"
          size="sm"
          class="whitespace-nowrap"
          @click="selectedCategory = category"
        >
          {{ category }}
        </Button>
      </div>
    </div>

    <!-- Menu Items -->
    <div class="p-4 space-y-4">
      <MenuCard
        v-for="item in filteredItems"
        :key="item.id"
        :menu-item="item"
        @click="selectMenuItem"
      />
    </div>

    <!-- Bottom Spacing -->
    <div class="h-20"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { MapPin, ShoppingCart } from 'lucide-vue-next'
import { useMenuStore } from '@/stores/menu'
import { useCartStore } from '@/stores/cart'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import MenuCard from '@/components/business/MenuCard.vue'

const router = useRouter()
const menuStore = useMenuStore()
const cartStore = useCartStore()

const selectedCategory = ref('전체')

const filteredItems = computed(() => {
  return menuStore.getMenuItemsByCategory(selectedCategory.value)
})

const selectMenuItem = (item) => {
  router.push(`/option/${item.id}`)
}
</script>