import { ref, reactive } from 'vue'
import type { ToastProps } from '@/types'

// 에러 타입 정의
export interface AppError {
  message: string
  code?: string
  type: 'network' | 'validation' | 'system' | 'unknown'
  retry?: () => void
}

// 토스트 알림 상태 관리
const toasts = ref<(ToastProps & { id: string })[]>([])

// 전역 에러 상태
const globalError = ref<AppError | null>(null)
const isLoading = ref(false)

export function useErrorHandler() {
  // 에러 표시
  const showError = (error: AppError): void => {
    globalError.value = error

    // 토스트 알림도 함께 표시
    addToast({
      title: getErrorTitle(error.type),
      message: error.message,
      type: 'error',
      duration: 5000
    })
  }

  // 에러 클리어
  const clearError = (): void => {
    globalError.value = null
  }

  // 토스트 추가
  const addToast = (toast: ToastProps): void => {
    const id = Date.now().toString()
    toasts.value.push({ ...toast, id })
  }

  // 토스트 제거
  const removeToast = (id: string): void => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  // 성공 메시지 표시
  const showSuccess = (message: string): void => {
    addToast({
      message,
      type: 'success',
      duration: 3000
    })
  }

  // 경고 메시지 표시
  const showWarning = (message: string): void => {
    addToast({
      message,
      type: 'warning',
      duration: 4000
    })
  }

  // 네트워크 에러 처리
  const handleNetworkError = (error: Error, retryFn?: () => void): void => {
    const appError: AppError = {
      message: '네트워크 연결을 확인해주세요.',
      code: 'NETWORK_ERROR',
      type: 'network',
      retry: retryFn
    }
    showError(appError)
  }

  // API 에러 처리
  const handleApiError = (error: any, context?: string): void => {
    let message = '서버에서 오류가 발생했습니다.'
    let code = 'API_ERROR'

    if (error.response) {
      // HTTP 에러 상태
      const status = error.response.status
      switch (status) {
        case 400:
          message = '잘못된 요청입니다.'
          code = 'BAD_REQUEST'
          break
        case 401:
          message = '인증이 필요합니다.'
          code = 'UNAUTHORIZED'
          break
        case 403:
          message = '접근 권한이 없습니다.'
          code = 'FORBIDDEN'
          break
        case 404:
          message = '요청한 데이터를 찾을 수 없습니다.'
          code = 'NOT_FOUND'
          break
        case 500:
          message = '서버 내부 오류가 발생했습니다.'
          code = 'INTERNAL_SERVER_ERROR'
          break
        default:
          message = `서버 오류 (${status})`
      }
    } else if (error.request) {
      message = '서버에 연결할 수 없습니다.'
      code = 'CONNECTION_ERROR'
    }

    if (context) {
      message = `${context}: ${message}`
    }

    const appError: AppError = {
      message,
      code,
      type: 'network'
    }
    showError(appError)
  }

  // 유효성 검사 에러 처리
  const handleValidationError = (message: string): void => {
    const appError: AppError = {
      message,
      type: 'validation'
    }
    showError(appError)
  }

  // 이미지 로딩 에러 처리
  const handleImageError = (event: Event, fallbackSrc?: string): void => {
    const target = event.target as HTMLImageElement
    if (fallbackSrc) {
      target.src = fallbackSrc
    } else {
      target.src = 'https://via.placeholder.com/200x200?text=이미지+없음'
    }

    // 에러 로깅 (선택사항)
    console.warn('이미지 로딩 실패:', target.alt || 'Unknown image')
  }

  // 에러 타입별 제목 반환
  const getErrorTitle = (type: AppError['type']): string => {
    switch (type) {
      case 'network':
        return '네트워크 오류'
      case 'validation':
        return '입력 오류'
      case 'system':
        return '시스템 오류'
      default:
        return '오류'
    }
  }

  // 로딩 상태 관리
  const setLoading = (loading: boolean): void => {
    isLoading.value = loading
  }

  // 비동기 작업을 안전하게 실행
  const withErrorHandling = async <T>(
    operation: () => Promise<T>,
    context?: string,
    retryFn?: () => void
  ): Promise<T | null> => {
    try {
      setLoading(true)
      return await operation()
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        handleNetworkError(error, retryFn)
      } else {
        handleApiError(error, context)
      }
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    // 상태 (읽기 전용으로 반환)
    globalError: globalError as Readonly<typeof globalError>,
    toasts: toasts as Readonly<typeof toasts>,
    isLoading: isLoading as Readonly<typeof isLoading>,

    // 에러 처리 함수들
    showError,
    clearError,
    handleNetworkError,
    handleApiError,
    handleValidationError,
    handleImageError,

    // 메시지 표시
    showSuccess,
    showWarning,
    addToast,
    removeToast,

    // 로딩 상태
    setLoading,

    // 유틸리티
    withErrorHandling
  }
}

// 싱글톤 인스턴스 (전역에서 사용)
export const globalErrorHandler = useErrorHandler()