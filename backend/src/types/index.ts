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
// Error Types
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
// Request Types
// =============================================================================

export interface PaginationQuery {
  page?: number
  limit?: number
}

export interface SearchQuery {
  search?: string
}

// =============================================================================
// Menu Types
// =============================================================================

export interface MenuOption {
  name: string
  price: number
}

export interface MenuOptions {
  sizes?: MenuOption[]
  extras?: MenuOption[]
}

export interface MenuItem {
  id: string
  restaurantId: string
  categoryId: string
  name: string
  description: string
  price: number
  imageUrl?: string
  isAvailable: boolean
  prepTimeMinutes: number
  options?: MenuOptions
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface MenuCreateRequest {
  name: string
  description: string
  price: number
  categoryId: string
  imageUrl?: string
  options?: MenuOptions
  prepTimeMinutes?: number
  sortOrder?: number
}

export interface MenuUpdateRequest extends Partial<MenuCreateRequest> {
  id: string
}

export interface MenuListParams extends PaginationQuery, SearchQuery {
  categoryId?: string
  isAvailable?: boolean
}

// =============================================================================
// Order Types
// =============================================================================

export interface OrderItem {
  id: string
  orderId: string
  menuItemId: string
  quantity: number
  unitPrice: number
  options?: MenuOptions
  specialRequests?: string
  menuItem?: {
    id: string
    name: string
    description: string
    price: number
    imageUrl?: string
  }
}

export interface Order {
  id: string
  tableId: string
  status: string
  totalAmount: number
  specialRequests?: string
  customerName?: string
  customerPhone?: string
  estimatedPrepTime: number
  createdAt: Date
  updatedAt: Date
  orderItems: OrderItem[]
}

export interface OrderCreateRequest {
  tableId: string
  orderItems: {
    menuItemId: string
    quantity: number
    options?: MenuOptions
    specialRequests?: string
  }[]
  specialRequests?: string
  customerName?: string
  customerPhone?: string
  estimatedPrepTime?: number
}

export interface OrderUpdateRequest extends Partial<OrderCreateRequest> {
  id: string
  status?: string
}

export interface OrderListParams extends PaginationQuery {
  tableId?: string
  status?: string
  dateFrom?: string
  dateTo?: string
}

// =============================================================================
// Table Types
// =============================================================================

export interface Table {
  id: string
  restaurantId: string
  number: number
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'CLEANING'
  capacity: number
  qrCode: string
  currentOrderId?: string
  createdAt: Date
  updatedAt: Date
}

// =============================================================================
// Payment Types
// =============================================================================

export interface Payment {
  id: string
  orderId: string
  paymentMethod: 'CARD' | 'MOBILE' | 'CASH'
  amount: number
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED'
  provider: string
  transactionId?: string
  metadata?: any
  createdAt: Date
  updatedAt: Date
}

// =============================================================================
// Authentication Types
// =============================================================================

export interface JwtPayload {
  sub: string // user id
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER'
  restaurantId?: string
  tableNumber?: number
  iat: number
  exp: number
}

export interface AuthUser {
  id: string
  role: JwtPayload['role']
  restaurantId?: string
  tableNumber?: number
}

// =============================================================================
// Express Request Extension
// =============================================================================

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}