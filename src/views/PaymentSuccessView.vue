<template>
  <div class="min-h-screen bg-background flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <Card padding="lg" class="text-center">
        <!-- 성공 아이콘 -->
        <div class="mb-6">
          <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle class="w-8 h-8 text-green-600" />
          </div>
        </div>

        <!-- 메시지 -->
        <h2 class="text-xl font-semibold mb-2">결제가 완료되었습니다!</h2>
        <p class="text-muted-foreground mb-6">주문이 정상적으로 접수되었습니다.</p>

        <!-- 결제 정보 -->
        <div v-if="paymentInfo" class="bg-muted rounded-lg p-4 mb-6 text-left">
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="font-medium">결제금액</span>
              <span>{{ formatCurrency(paymentInfo.amount) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">주문번호</span>
              <span class="font-mono text-xs">{{ paymentInfo.orderId }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">결제키</span>
              <span class="font-mono text-xs">{{ paymentInfo.paymentKey?.slice(0, 20) }}...</span>
            </div>
          </div>
        </div>

        <!-- 예상 조리시간 -->
        <div class="bg-blue-50 rounded-lg p-4 mb-6">
          <div class="flex items-center gap-2 text-blue-600">
            <Clock class="w-4 h-4" />
            <span class="text-sm font-medium">예상 조리시간: 15-20분</span>
          </div>
        </div>

        <!-- 액션 버튼들 -->
        <div class="space-y-3">
          <Button
            variant="primary"
            size="lg"
            full-width
            @click="goToMenu"
          >
            메뉴로 돌아가기
          </Button>

          <Button
            variant="outline"
            size="md"
            full-width
            @click="viewOrderDetails"
          >
            주문 내역 보기
          </Button>
        </div>

        <!-- 에러 상태 -->
        <div v-if="error" class="mt-4 p-3 bg-red-50 rounded-lg text-red-600 text-sm">
          {{ error }}
        </div>
      </Card>

      <!-- 주문 상세 정보 (확장 가능) -->
      <Card v-if="showOrderDetails" class="mt-4" padding="md">
        <h3 class="font-semibold mb-3">주문 상세</h3>
        <div class="space-y-2">
          <div v-for="item in orderItems" :key="item.id" class="flex justify-between text-sm">
            <span>{{ item.name }} × {{ item.quantity }}</span>
            <span>{{ formatCurrency(item.totalPrice) }}</span>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { CheckCircle, Clock } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart.js'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

const paymentInfo = ref(null)
const orderItems = ref([])
const showOrderDetails = ref(false)
const error = ref(null)
const isProcessing = ref(true)

/**
 * 통화 포맷팅
 */
const formatCurrency = (amount) => {
  return `${amount.toLocaleString()}원`
}

/**
 * 메뉴로 돌아가기
 */
const goToMenu = () => {
  cartStore.clearCart()
  router.push('/menu')
}

/**
 * 주문 상세 보기 토글
 */
const viewOrderDetails = () => {
  showOrderDetails.value = !showOrderDetails.value
}

/**
 * 결제 승인 처리
 */
const confirmPayment = async () => {
  const { paymentKey, orderId, amount } = route.query

  if (!paymentKey || !orderId || !amount) {
    error.value = '결제 정보가 올바르지 않습니다.'
    isProcessing.value = false
    return
  }

  try {
    // 결제 승인 API 호출
    const response = await fetch('/api/payments/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: parseInt(amount)
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || '결제 승인에 실패했습니다.')
    }

    const result = await response.json()

    // 결제 정보 설정
    paymentInfo.value = {
      paymentKey,
      orderId,
      amount: parseInt(amount),
      ...result
    }

    // 주문 아이템 정보 설정 (장바구니에서 가져오기)
    orderItems.value = cartStore.items.map(item => ({
      id: item.id,
      name: item.menuItem.name,
      quantity: item.quantity,
      totalPrice: item.totalPrice
    }))

    console.log('결제 승인 완료:', result)
  } catch (err) {
    console.error('결제 승인 실패:', err)
    error.value = err.message || '결제 승인 중 오류가 발생했습니다.'
  } finally {
    isProcessing.value = false
  }
}

onMounted(async () => {
  // URL 파라미터 확인 및 결제 승인 처리
  await confirmPayment()
})
</script>