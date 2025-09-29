import type { MenuItem, CartItem } from './index'

// =============================================================================
// API Response Types
// =============================================================================

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// =============================================================================
// Menu API Types
// =============================================================================

export interface MenuListParams {
  category?: string
  page?: number
  limit?: number
  search?: string
}

export interface MenuCreateRequest {
  name: string
  description: string
  price: number
  category: string
  image?: string
  options?: {
    sizes?: { name: string; price: number }[]
    extras?: { name: string; price: number }[]
  }
}

export interface MenuUpdateRequest extends Partial<MenuCreateRequest> {
  id: string
}

// =============================================================================
// Order API Types
// =============================================================================

export interface OrderItem {
  menuItemId: string
  menuItem: MenuItem
  quantity: number
  selectedSize?: string
  selectedExtras?: string[]
  unitPrice: number
  totalPrice: number
}

export interface OrderCreateRequest {
  tableNumber: number
  items: Omit<OrderItem, 'menuItem'>[]
  paymentMethod: 'card' | 'mobile' | 'cash'
  totalAmount: number
  customerInfo?: {
    name?: string
    phone?: string
    email?: string
  }
}

export interface Order {
  id: string
  orderNumber: string
  tableNumber: number
  items: OrderItem[]
  paymentMethod: string
  totalAmount: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled'
  customerInfo?: {
    name?: string
    phone?: string
    email?: string
  }
  createdAt: string
  updatedAt: string
  estimatedReadyTime?: string
}

// =============================================================================
// Table API Types
// =============================================================================

export interface Table {
  id: string
  number: number
  status: 'available' | 'occupied' | 'reserved' | 'cleaning'
  capacity: number
  currentOrderId?: string
}

// =============================================================================
// API Error Types
// =============================================================================

export interface ApiError {
  code: string
  message: string
  details?: any
  status: number
}

export class ApiException extends Error {
  public code: string
  public status: number
  public details?: any

  constructor(error: ApiError) {
    super(error.message)
    this.name = 'ApiException'
    this.code = error.code
    this.status = error.status
    this.details = error.details
  }
}

// =============================================================================
// API Client Configuration
// =============================================================================

export interface ApiConfig {
  baseURL: string
  timeout: number
  headers?: Record<string, string>
}

export interface RequestConfig {
  timeout?: number
  retries?: number
  retryDelay?: number
}

// =============================================================================
// Mock API Types (개발용)
// =============================================================================

export interface MockApiOptions {
  delay?: number
  errorRate?: number // 0-1 사이의 값, 에러 발생 확률
  enabled: boolean
}

export interface MockResponse<T> {
  data: T
  delay: number
  shouldError: boolean
}