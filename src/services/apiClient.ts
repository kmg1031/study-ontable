import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import type {
  ApiResponse,
  ApiError,
  ApiConfig,
  RequestConfig,
  MockApiOptions
} from '@/types/api'
import { ApiException } from '@/types/api'

// =============================================================================
// Base API Client
// =============================================================================

export class ApiClient {
  private instance: AxiosInstance
  private config: ApiConfig
  private mockOptions: MockApiOptions

  constructor(config: ApiConfig, mockOptions: MockApiOptions = { enabled: false }) {
    this.config = config
    this.mockOptions = mockOptions

    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // 요청 로깅
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        console.error('[API] Request error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        console.log(`[API] Response ${response.status}:`, response.data)
        return response
      },
      (error) => {
        const apiError = this.handleApiError(error)
        console.error('[API] Response error:', apiError)
        return Promise.reject(new ApiException(apiError))
      }
    )
  }

  private handleApiError(error: any): ApiError {
    if (error.response) {
      // 서버에서 응답을 받았지만 오류 상태
      return {
        code: error.response.data?.code || `HTTP_${error.response.status}`,
        message: error.response.data?.message || error.message,
        status: error.response.status,
        details: error.response.data
      }
    } else if (error.request) {
      // 요청이 만들어졌지만 응답을 받지 못함
      return {
        code: 'NETWORK_ERROR',
        message: '네트워크 연결을 확인해주세요.',
        status: 0,
        details: error.request
      }
    } else {
      // 요청을 설정하는 중에 오류 발생
      return {
        code: 'REQUEST_ERROR',
        message: error.message || '요청 처리 중 오류가 발생했습니다.',
        status: 0,
        details: error
      }
    }
  }

  // Mock 응답 생성 (개발용)
  private async simulateResponse<T>(data: T, options?: RequestConfig): Promise<ApiResponse<T>> {
    if (!this.mockOptions.enabled) {
      throw new Error('Mock API is not enabled')
    }

    const delay = this.mockOptions.delay || 500
    const errorRate = this.mockOptions.errorRate || 0

    // 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, delay))

    // 에러 시뮬레이션
    if (Math.random() < errorRate) {
      throw new ApiException({
        code: 'MOCK_ERROR',
        message: '시뮬레이션된 오류입니다.',
        status: 500
      })
    }

    return {
      success: true,
      data,
      message: 'Success'
    }
  }

  // 기본 HTTP 메서드들
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.get(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.post(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.put(url, data, config)
    return response.data
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.patch(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.delete(url, config)
    return response.data
  }

  // 재시도 기능이 있는 요청
  async requestWithRetry<T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const maxRetries = config?.retries || 2
    const retryDelay = config?.retryDelay || 1000
    let lastError: any

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        switch (method) {
          case 'get':
            return await this.get<T>(url, config)
          case 'post':
            return await this.post<T>(url, data, config)
          case 'put':
            return await this.put<T>(url, data, config)
          case 'patch':
            return await this.patch<T>(url, data, config)
          case 'delete':
            return await this.delete<T>(url, config)
          default:
            throw new Error(`Unsupported method: ${method}`)
        }
      } catch (error) {
        lastError = error

        if (attempt < maxRetries) {
          console.log(`[API] Retry attempt ${attempt + 1}/${maxRetries} for ${method.toUpperCase()} ${url}`)
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)))
        }
      }
    }

    throw lastError
  }

  // Mock API 응답 반환 (개발용)
  async mockResponse<T>(data: T): Promise<ApiResponse<T>> {
    return this.simulateResponse(data)
  }
}

// =============================================================================
// API Client Instance
// =============================================================================

// 개발 환경 설정
const isDevelopment = process.env.NODE_ENV === 'development'

const apiConfig: ApiConfig = {
  baseURL: isDevelopment ? 'http://localhost:3000/api' : '/api',
  timeout: 10000,
  headers: {
    'Accept': 'application/json'
  }
}

const mockOptions: MockApiOptions = {
  enabled: isDevelopment, // 개발 환경에서만 Mock API 사용
  delay: 800, // 800ms 지연으로 실제 API 호출 시뮬레이션
  errorRate: 0.1 // 10% 확률로 에러 발생
}

// 전역 API 클라이언트 인스턴스
export const apiClient = new ApiClient(apiConfig, mockOptions)

// 편의 함수들
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => apiClient.get<T>(url, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.post<T>(url, data, config),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.put<T>(url, data, config),
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.patch<T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) => apiClient.delete<T>(url, config),
  withRetry: <T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data?: any,
    config?: RequestConfig
  ) => apiClient.requestWithRetry<T>(method, url, data, config),
  mock: <T>(data: T) => apiClient.mockResponse<T>(data)
}