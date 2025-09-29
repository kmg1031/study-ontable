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

      <!-- 토스페이먼츠 결제 위젯 -->
      <Card title="카드 결제" padding="md">
        <div class="space-y-4">
          <!-- 로딩 상태 -->
          <div v-if="!isReady && !error" class="min-h-[200px] flex items-center justify-center">
            <div class="text-center space-y-3">
              <div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p class="text-sm text-muted-foreground">결제 위젯을 로드하는 중...</p>
            </div>
          </div>

          <!-- 에러 상태 -->
          <div v-else-if="error" class="p-4 bg-red-50 rounded-lg text-red-600">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <span class="font-medium text-sm">결제 위젯 로드 실패</span>
            </div>
            <p class="text-sm">{{ error }}</p>
            <button
              @click="retryLoadPayment"
              class="mt-2 text-sm text-red-600 hover:text-red-700 underline"
            >
              다시 시도
            </button>
          </div>

          <!-- 결제 위젯이 렌더링될 영역 -->
          <div v-show="isReady" id="payment-method" class="min-h-[200px]"></div>
          <!-- 이용약관이 렌더링될 영역 -->
          <div v-show="isReady" id="agreement"></div>
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
        :disabled="isOrdering || !isReady"
        :loading="isOrdering"
        @click="handleOrder"
      >
        <template v-if="isOrdering">
          주문 처리중...
        </template>
        <template v-else-if="!isReady">
          결제 위젯 로드 중...
        </template>
        <template v-else>
          {{ cartStore.totalPrice.toLocaleString() }}원 결제하기
        </template>
      </Button>
    </div>

    <!-- Bottom Spacing -->
    <div class="h-20"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, MapPin, Clock } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart'
import { useTossPayment } from '@/composables/useTossPayment'
import type { CartItem } from '@/types'
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

const isOrdering = ref(false)
const paymentWidgetRendered = ref(false)

const getItemDisplayName = (item: CartItem): string => {
  let name = item.menuItem.name
  if (item.selectedSize) {
    name += ` (${item.selectedSize})`
  }
  return name
}

const getItemExtrasText = (item: CartItem): string => {
  if (!item.selectedExtras || item.selectedExtras.length === 0) return ''
  return item.selectedExtras.join(', ')
}

// 토스페이먼츠 위젯 초기화 및 렌더링
const initializePaymentWidget = async (): Promise<void> => {
  if (paymentWidgetRendered.value) {
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

// 재시도 함수
const retryLoadPayment = async (): Promise<void> => {
  paymentWidgetRendered.value = false
  await initializePaymentWidget()
}


const handleOrder = async (): Promise<void> => {
  isOrdering.value = true

  try {
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
  } catch (err) {
    console.error('결제 처리 실패:', err)
    isOrdering.value = false
    // 에러 처리 (토스트 메시지 등)
    alert('결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
  }
}

// 컴포넌트 마운트 시 초기화
onMounted(async () => {
  // 장바구니가 비어있으면 메뉴로 이동
  if (cartStore.items.length === 0) {
    console.log('장바구니가 비어있어 메뉴로 이동합니다.')
    router.push('/menu')
    return
  }

  await initializePaymentWidget()
})
</script>