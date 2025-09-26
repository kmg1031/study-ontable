import { ref, computed } from 'vue'

/**
 * 토스페이먼츠 결제 시스템을 위한 Vue 3 Composable
 * PAYMENT_SAMPLE_ANALYSIS.md 분석 결과를 기반으로 구현
 */
export function useTossPayment() {
  const isLoaded = ref(false)
  const isInitialized = ref(false)
  const widgets = ref(null)
  const error = ref(null)

  // 환경변수에서 클라이언트 키 가져오기
  const clientKey = process.env.VUE_APP_TOSSPAYMENT_CLIENT_KEY ;

  /**
   * 랜덤 문자열 생성 (orderId, customerKey용)
   */
  const generateRandomString = () => {
    return window.btoa(Math.random().toString()).slice(0, 20)
  }

  /**
   * 토스페이먼츠 위젯 초기화
   */
  const initializePayment = async () => {
    try {
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
      error.value = err instanceof Error ? err.message : '위젯 초기화 실패'
      console.error('토스페이먼츠 초기화 오류:', err)
    }
  }

  /**
   * 결제 금액 설정
   */
  const setAmount = async (amount) => {
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
      error.value = err instanceof Error ? err.message : '금액 설정 실패'
      throw err
    }
  }

  /**
   * 결제 UI 렌더링
   */
  const renderPaymentMethods = async (selector) => {
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
      error.value = err instanceof Error ? err.message : '결제 UI 렌더링 실패'
      throw err
    }
  }

  /**
   * 이용약관 UI 렌더링
   */
  const renderAgreement = async (selector) => {
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
      error.value = err instanceof Error ? err.message : '이용약관 UI 렌더링 실패'
      throw err
    }
  }

  /**
   * 결제 요청
   */
  const requestPayment = async (paymentData) => {
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
      error.value = err instanceof Error ? err.message : '결제 요청 실패'
      throw err
    }
  }

  /**
   * 주문명 생성 (장바구니 아이템 기반)
   */
  const generateOrderName = (items, maxLength = 20) => {
    if (!items || items.length === 0) {
      return '주문'
    }

    const firstItem = items[0].menuItem?.name || items[0].name || '상품'
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