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
        <h1 class="text-lg font-semibold">주문하기</h1>
      </div>
    </div>

    <div class="p-4 space-y-6">
      <!-- Table Info -->
      <Card padding="md">
          <div class="flex items-center gap-3">
            <MapPin class="w-5 h-5 text-primary" />
            <div>
              <h3 class="text-base font-semibold">테이블 {{ cartStore.tableNumber }}</h3>
              <div class="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock class="w-4 h-4" />
                <span>예상 조리시간: 15-20분</span>
              </div>
            </div>
          </div>
      </Card>

      <!-- Order Items -->
      <Card title="주문 내역" padding="md">
          <div class="space-y-3">
            <div
              v-for="(item, index) in cartStore.items"
              :key="item.id"
            >
              <div v-if="index > 0" class="border-t border-border my-3"></div>
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span>{{ getItemDisplayName(item) }}</span>
                    <Badge variant="outline" size="sm">
                      {{ item.quantity }}개
                    </Badge>
                  </div>
                  <p v-if="getItemExtrasText(item)" class="text-sm text-muted-foreground">
                    옵션: {{ getItemExtrasText(item) }}
                  </p>
                </div>
                <span class="text-sm">
                  {{ item.totalPrice.toLocaleString() }}원
                </span>
              </div>
            </div>
          </div>
      </Card>

      <!-- Payment Method -->
      <Card title="결제 방법" padding="md">
          <div class="space-y-2">
            <div
              v-for="method in paymentMethods"
              :key="method.id"
              class="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50"
            >
              <input
                :id="method.id"
                v-model="paymentMethod"
                :value="method.id"
                type="radio"
                class="aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <component :is="method.icon" class="w-5 h-5 text-muted-foreground" />
              <label :for="method.id" class="flex-1 cursor-pointer text-sm font-medium leading-none">
                {{ method.name }}
              </label>
            </div>
          </div>
      </Card>

      <!-- Price Summary -->
      <Card padding="md">
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span>주문 금액</span>
              <span>{{ cartStore.totalPrice.toLocaleString() }}원</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>배달비</span>
              <span>0원</span>
            </div>
            <div class="border-t border-border my-2"></div>
            <div class="flex justify-between">
              <span>총 결제금액</span>
              <span class="text-lg text-primary font-semibold">
                {{ cartStore.totalPrice.toLocaleString() }}원
              </span>
            </div>
          </div>
      </Card>
    </div>

    <!-- Bottom Fixed Button -->
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
      <Button
        variant="primary"
        size="lg"
        full-width
        :disabled="isOrdering"
        :loading="isOrdering"
        @click="handleOrder"
      >
        {{ isOrdering ? '주문 처리중...' : `${cartStore.totalPrice.toLocaleString()}원 결제하기` }}
      </Button>
    </div>

    <!-- Bottom Spacing -->
    <div class="h-20"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, MapPin, Clock, CreditCard, Smartphone, Banknote } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Card from '@/components/ui/Card.vue'

const router = useRouter()
const cartStore = useCartStore()

const paymentMethod = ref('card')
const isOrdering = ref(false)

const paymentMethods = [
  { id: 'card', name: '신용카드', icon: CreditCard },
  { id: 'mobile', name: '모바일페이', icon: Smartphone },
  { id: 'cash', name: '현금', icon: Banknote }
]

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

const handleOrder = async () => {
  isOrdering.value = true

  // 주문 처리 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 2000))

  isOrdering.value = false
  cartStore.clearCart()
  router.push('/menu')
}
</script>