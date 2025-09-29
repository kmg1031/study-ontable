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
        <h1 class="text-lg font-semibold">장바구니</h1>
        <Badge variant="secondary" size="sm" class="ml-auto">
          {{ cartStore.itemCount }}개 상품
        </Badge>
      </div>
    </div>

    <EmptyState
      v-if="cartStore.itemCount === 0"
      emoji="🛒"
      title="장바구니가 비어있습니다"
      description="메뉴를 선택해주세요"
      size="lg"
    >
      <template #actions>
        <Button
          variant="primary"
          @click="$router.push('/menu')"
        >
          메뉴 보러가기
        </Button>
      </template>
    </EmptyState>

    <template v-else>
      <div class="p-4 space-y-4">
        <CartItemCard
          v-for="item in cartStore.items"
          :key="item.id"
          :cart-item="item"
          @quantity-change="cartStore.updateQuantity"
          @remove="cartStore.removeItem"
        />
      </div>

      <!-- Summary -->
      <div class="p-4 border-t border-border bg-muted/30">
        <div class="flex items-center justify-between mb-4">
          <span class="text-lg">총 결제금액</span>
          <span class="text-xl text-primary font-semibold">
            {{ cartStore.totalPrice.toLocaleString() }}원
          </span>
        </div>

        <Button
          variant="primary"
          size="lg"
          full-width
          :disabled="cartStore.itemCount === 0"
          @click="$router.push('/order')"
        >
          주문하기
        </Button>
      </div>
    </template>

    <!-- Bottom Spacing -->
    <div class="h-20"></div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import CartItemCard from '@/components/business/CartItemCard.vue'

const cartStore = useCartStore()
</script>