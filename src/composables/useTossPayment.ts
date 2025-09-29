import { ref, computed } from 'vue'
import type { CartItem } from '@/types'

declare global {
  interface Window {
    TossPayments: any
  }
}

interface PaymentRequestData {
  orderName: string
  amount: number
  customerName: string
  customerEmail: string
  customerMobilePhone: string
}

/**
 * 토스페이먼츠 결제 시스템을 위한 Vue 3 Composable
 */
export function useTossPayment() {
  const isLoaded = ref(false)
  const isInitialized = ref(false)
  const widgets = ref<any>(null)
  const error = ref<string | null>(null)

  // 환경변수에서 클라이언트 키 가져오기
  const clientKey = process.env.VUE_APP_TOSSPAYMENT_CLIENT_KEY

  /**
   * 랜덤 문자열 생성 (orderId, customerKey용)
   */
  const generateRandomString = (): string => {
    return window.btoa(Math.random().toString()).slice(0, 20)
  }

  /**
   * 토스페이먼츠 SDK 로드
   */
  const loadTossPaymentsSDK = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (window.TossPayments) {
        console.log('토스페이먼츠 SDK 이미 로드됨')
        resolve(window.TossPayments)
        return
      }

      console.log('토스페이먼츠 SDK 로드 중...')

      const script = document.createElement('script')
      script.src = 'https://js.tosspayments.com/v1/payment-widget'
      script.onload = () => {
        console.log('토스페이먼츠 SDK 로드 완료')
        resolve(window.TossPayments)
      }
      script.onerror = (error) => {
        console.error('토스페이먼츠 SDK 로드 실패:', error)
        reject(new Error('토스페이먼츠 SDK 로드에 실패했습니다.'))
      }
      document.head.appendChild(script)
    })
  }

  /**
   * 토스페이먼츠 위젯 초기화
   */
  const initializePayment = async (): Promise<void> => {
    try {
      if (!clientKey) {
        throw new Error('토스페이먼츠 클라이언트 키가 설정되지 않았습니다.')
      }

      // SDK 로드
      await loadTossPaymentsSDK()

      if (!window.TossPayments) {
        throw new Error('토스페이먼츠 SDK가 로드되지 않았습니다.')
      }

      // 고객 키 생성 (세션별 고유값)
      const customerKey = generateRandomString()

      // 토스페이먼츠 객체 생성
      const tossPayments = window.TossPayments(clientKey)

      // 위젯 객체 생성
      widgets.value = tossPayments.widgets({ customerKey })

      isLoaded.value = true
      isInitialized.value = true
      error.value = null

      console.log('토스페이먼츠 위젯 초기화 완료')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '위젯 초기화 실패'
      error.value = errorMessage
      console.error('토스페이먼츠 초기화 오류:', err)
      throw new Error(errorMessage)
    }
  }

  /**
   * 결제 금액 설정
   */
  const setAmount = async (amount: number): Promise<void> => {
    if (!widgets.value) {
      throw new Error('위젯이 초기화되지 않았습니다.')
    }

    try {
      await widgets.value.setAmount({
        currency: 'KRW',
        value: amount
      })
      console.log(`결제 금액 설정: ${amount.toLocaleString()}원`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '금액 설정 실패'
      error.value = errorMessage
      throw new Error(errorMessage)
    }
  }

  /**
   * 결제 UI 렌더링
   */
  const renderPaymentMethods = async (selector: string): Promise<void> => {
    if (!widgets.value) {
      throw new Error('위젯이 초기화되지 않았습니다.')
    }

    try {
      await widgets.value.renderPaymentMethods({
        selector,
        variantKey: 'DEFAULT'
      })
      console.log('결제 UI 렌더링 완료')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '결제 UI 렌더링 실패'
      error.value = errorMessage
      throw new Error(errorMessage)
    }
  }

  /**
   * 이용약관 UI 렌더링
   */
  const renderAgreement = async (selector: string): Promise<void> => {
    if (!widgets.value) {
      throw new Error('위젯이 초기화되지 않았습니다.')
    }

    try {
      await widgets.value.renderAgreement({
        selector,
        variantKey: 'AGREEMENT'
      })
      console.log('이용약관 UI 렌더링 완료')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '이용약관 UI 렌더링 실패'
      error.value = errorMessage
      throw new Error(errorMessage)
    }
  }

  /**
   * 결제 요청
   */
  const requestPayment = async (paymentData: PaymentRequestData): Promise<void> => {
    if (!widgets.value) {
      throw new Error('위젯이 초기화되지 않았습니다.')
    }

    try {
      const orderId = generateRandomString()
      const baseUrl = window.location.origin

      const paymentRequest = {
        orderId,
        orderName: paymentData.orderName || '주문',
        successUrl: `${baseUrl}/payment/success`,
        failUrl: `${baseUrl}/payment/fail`,
        customerEmail: paymentData.customerEmail,
        customerName: paymentData.customerName,
        customerMobilePhone: paymentData.customerMobilePhone
      }

      await widgets.value.requestPayment(paymentRequest)
      console.log('결제 요청 완료:', paymentRequest)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '결제 요청 실패'
      error.value = errorMessage
      throw new Error(errorMessage)
    }
  }

  /**
   * 주문명 생성 (장바구니 아이템 기반)
   */
  const generateOrderName = (items: CartItem[], maxLength: number = 20): string => {
    if (!items || items.length === 0) {
      return '주문'
    }

    const firstItem = items[0].menuItem?.name || '상품'
    if (items.length === 1) {
      return firstItem.length > maxLength ? `${firstItem.slice(0, maxLength)}...` : firstItem
    }

    return `${firstItem} 외 ${items.length - 1}건`
  }

  // Computed properties
  const isReady = computed(() => isLoaded.value && isInitialized.value && !error.value)

  return {
    // State
    isLoaded,
    isInitialized,
    error,
    isReady,

    // Methods
    initializePayment,
    setAmount,
    renderPaymentMethods,
    renderAgreement,
    requestPayment,
    generateOrderName,
    generateRandomString
  }
}