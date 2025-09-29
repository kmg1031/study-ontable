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
      <!-- Loading State -->
      <template v-if="menuStore.isLoading">
        <SkeletonCard
          v-for="i in 6"
          :key="i"
          padding="sm"
          :show-image="true"
          :show-content="true"
          :show-footer="true"
        />
      </template>

      <!-- Error State -->
      <ErrorMessage
        v-else-if="menuStore.error"
        :message="menuStore.error"
        type="error"
        show-retry
        @retry="handleRetryLoadMenu"
      />

      <!-- Menu Items -->
      <template v-else-if="filteredItems.length > 0">
        <MenuCard
          v-for="item in filteredItems"
          :key="item.id"
          :menu-item="item"
          @click="selectMenuItem"
        />
      </template>

      <!-- Empty State -->
      <EmptyState
        v-else
        emoji="🍽️"
        title="메뉴가 없습니다"
        description="선택한 카테고리에 메뉴가 없습니다"
        size="md"
      >
        <template #actions>
          <Button
            variant="outline"
            @click="handleRetryLoadMenu"
          >
            새로고침
          </Button>
        </template>
      </EmptyState>
    </div>

    <!-- Bottom Spacing -->
    <div class="h-20"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MapPin, ShoppingCart } from 'lucide-vue-next'
import { useMenuStore } from '@/stores/menu'
import { useCartStore } from '@/stores/cart'
import { globalErrorHandler } from '@/composables/useErrorHandler'
import type { MenuItem } from '@/types'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import SkeletonCard from '@/components/ui/SkeletonCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'
import MenuCard from '@/components/business/MenuCard.vue'

const router = useRouter()
const menuStore = useMenuStore()
const cartStore = useCartStore()
const { withErrorHandling, showSuccess } = globalErrorHandler

const selectedCategory = ref('전체')

const filteredItems = computed(() => {
  return menuStore.getMenuItemsByCategory(selectedCategory.value)
})

const selectMenuItem = (item: MenuItem): void => {
  router.push(`/option/${item.id}`)
}

const handleRetryLoadMenu = async (): Promise<void> => {
  await withErrorHandling(
    () => menuStore.fetchMenuItems(),
    '메뉴 로드'
  )
}

// 컴포넌트 마운트 시 메뉴 로드 시뮬레이션
onMounted(async () => {
  // 개발 중에는 시뮬레이션으로 메뉴 로딩 상태를 보여줌
  if (process.env.NODE_ENV === 'development') {
    await handleRetryLoadMenu()
  }
})
</script>