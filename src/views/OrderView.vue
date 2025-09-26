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

      <!-- 토스페이먼츠 결제 위젯 (카드 결제 선택 시에만 표시) -->
      <Card v-if="paymentMethod === 'card'" title="카드 결제" padding="md">
        <div class="space-y-4">
          <!-- 결제 위젯이 렌더링될 영역 -->
          <div id="payment-method" class="min-h-[200px]"></div>
          <!-- 이용약관이 렌더링될 영역 -->
          <div id="agreement"></div>
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
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, MapPin, Clock, CreditCard, Smartphone, Banknote } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart.js'
import { useTossPayment } from '@/composables/useTossPayment.js'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Card from '@/components/ui/Card.vue'

const router = useRouter()
const cartStore = useCartStore()

// 토스페이먼츠 Composable 사용
const {
  isReady,
  error,
  initializePayment,
  setAmount,
  renderPaymentMethods,
  renderAgreement,
  requestPayment,
  generateOrderName
} = useTossPayment()

const paymentMethod = ref('card')
const isOrdering = ref(false)
const paymentWidgetRendered = ref(false)

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

// 토스페이먼츠 위젯 초기화 및 렌더링
const initializePaymentWidget = async () => {
  if (paymentMethod.value !== 'card' || paymentWidgetRendered.value) {
    return
  }

  try {
    // 토스페이먼츠 초기화
    await initializePayment()

    // 결제 금액 설정
    await setAmount(cartStore.totalPrice)

    // DOM이 렌더링될 때까지 대기
    await nextTick()

    // 결제 위젯 렌더링
    await renderPaymentMethods('#payment-method')
    await renderAgreement('#agreement')

    paymentWidgetRendered.value = true
    console.log('토스페이먼츠 위젯 렌더링 완료')
  } catch (err) {
    console.error('토스페이먼츠 위젯 초기화 실패:', err)
  }
}

// 결제 방법 변경 시 위젯 처리
watch(paymentMethod, async (newMethod) => {
  if (newMethod === 'card') {
    paymentWidgetRendered.value = false
    await nextTick()
    await initializePaymentWidget()
  } else {
    paymentWidgetRendered.value = false
  }
})

const handleOrder = async () => {
  isOrdering.value = true

  try {
    if (paymentMethod.value === 'card') {
      // 토스페이먼츠 카드 결제
      const orderName = generateOrderName(cartStore.items)

      await requestPayment({
        orderName,
        amount: cartStore.totalPrice,
        customerName: '고객',
        customerEmail: 'customer@example.com',
        customerMobilePhone: '01012345678'
      })

      // 결제 요청 후에는 토스페이먼츠에서 리다이렉트 처리
      // 성공/실패 페이지에서 실제 주문 처리 완료
    } else {
      // 기존 방식 (모바일페이, 현금)
      await new Promise(resolve => setTimeout(resolve, 2000))

      isOrdering.value = false
      cartStore.clearCart()
      router.push('/menu')
    }
  } catch (err) {
    console.error('결제 처리 실패:', err)
    isOrdering.value = false
    // 에러 처리 (토스트 메시지 등)
    alert('결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
  }
}

// 컴포넌트 마운트 시 초기화
onMounted(async () => {
  if (paymentMethod.value === 'card') {
    await initializePaymentWidget()
  }
})
</script>