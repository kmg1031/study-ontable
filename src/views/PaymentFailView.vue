<template>
  <div class="min-h-screen bg-background flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <Card padding="lg" class="text-center">
        <!-- 실패 아이콘 -->
        <div class="mb-6">
          <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle class="w-8 h-8 text-red-600" />
          </div>
        </div>

        <!-- 메시지 -->
        <h2 class="text-xl font-semibold mb-2">결제에 실패했습니다</h2>
        <p class="text-muted-foreground mb-6">결제 처리 중 문제가 발생했습니다.</p>

        <!-- 에러 정보 -->
        <div v-if="errorInfo" class="bg-red-50 rounded-lg p-4 mb-6 text-left">
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="font-medium text-red-700">에러 코드</span>
              <span class="text-red-600 font-mono">{{ errorInfo.code }}</span>
            </div>
            <div>
              <span class="font-medium text-red-700">에러 메시지</span>
              <p class="text-red-600 mt-1">{{ errorInfo.message }}</p>
            </div>
          </div>
        </div>

        <!-- 일반적인 실패 원인 안내 -->
        <div class="bg-muted rounded-lg p-4 mb-6 text-left">
          <h3 class="font-medium mb-2 text-sm">결제 실패 원인</h3>
          <ul class="text-xs text-muted-foreground space-y-1">
            <li>• 카드 한도 초과</li>
            <li>• 잘못된 카드 정보 입력</li>
            <li>• 네트워크 연결 문제</li>
            <li>• 결제 취소 또는 중단</li>
          </ul>
        </div>

        <!-- 액션 버튼들 -->
        <div class="space-y-3">
          <Button
            variant="primary"
            size="lg"
            full-width
            @click="retryPayment"
          >
            결제 다시 시도
          </Button>

          <Button
            variant="outline"
            size="md"
            full-width
            @click="goToCart"
          >
            장바구니로 돌아가기
          </Button>

          <Button
            variant="ghost"
            size="md"
            full-width
            @click="goToMenu"
          >
            메뉴로 돌아가기
          </Button>
        </div>

        <!-- 고객 지원 안내 -->
        <div class="mt-6 pt-4 border-t border-border text-xs text-muted-foreground">
          <p>문제가 계속 발생하시면</p>
          <p>매장 직원에게 문의해 주세요</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { XCircle } from 'lucide-vue-next'
import { useCartStore } from '@/stores/cart.js'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

const errorInfo = ref(null)

/**
 * 결제 다시 시도
 */
const retryPayment = () => {
  router.push('/order')
}

/**
 * 장바구니로 돌아가기
 */
const goToCart = () => {
  router.push('/cart')
}

/**
 * 메뉴로 돌아가기
 */
const goToMenu = () => {
  router.push('/menu')
}

onMounted(() => {
  // URL 파라미터에서 에러 정보 추출
  const { code, message } = route.query

  if (code || message) {
    errorInfo.value = {
      code: code || 'UNKNOWN_ERROR',
      message: message || '알 수 없는 오류가 발생했습니다.'
    }
  }

  console.log('결제 실패 정보:', errorInfo.value)
})
</script>