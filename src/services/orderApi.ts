import type {
  Order,
  OrderCreateRequest,
  Table,
  ApiResponse,
  PaginatedResponse
} from '@/types/api'
import { apiClient } from './apiClient'

// =============================================================================
// Order API Service
// =============================================================================

export class OrderApiService {
  // 주문 생성
  async createOrder(data: OrderCreateRequest): Promise<ApiResponse<Order>> {
    if (process.env.NODE_ENV === 'development') {
      return this.createMockOrder(data)
    }

    return apiClient.post<Order>('/orders', data)
  }

  // 주문 목록 조회
  async getOrders(params?: {
    page?: number
    limit?: number
    status?: Order['status']
    tableNumber?: number
  }): Promise<PaginatedResponse<Order>> {
    if (process.env.NODE_ENV === 'development') {
      return this.getMockOrders(params)
    }

    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.status) queryParams.append('status', params.status)
    if (params?.tableNumber) queryParams.append('tableNumber', params.tableNumber.toString())

    const url = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return apiClient.get<Order[]>(url) as Promise<PaginatedResponse<Order>>
  }

  // 특정 주문 조회
  async getOrder(id: string): Promise<ApiResponse<Order>> {
    if (process.env.NODE_ENV === 'development') {
      return this.getMockOrder(id)
    }

    return apiClient.get<Order>(`/orders/${id}`)
  }

  // 주문 상태 업데이트 (관리자용)
  async updateOrderStatus(id: string, status: Order['status']): Promise<ApiResponse<Order>> {
    if (process.env.NODE_ENV === 'development') {
      return this.updateMockOrderStatus(id, status)
    }

    return apiClient.patch<Order>(`/orders/${id}/status`, { status })
  }

  // 주문 취소
  async cancelOrder(id: string, reason?: string): Promise<ApiResponse<Order>> {
    if (process.env.NODE_ENV === 'development') {
      return this.cancelMockOrder(id, reason)
    }

    return apiClient.patch<Order>(`/orders/${id}/cancel`, { reason })
  }

  // 테이블의 현재 주문 조회
  async getTableCurrentOrder(tableNumber: number): Promise<ApiResponse<Order | null>> {
    if (process.env.NODE_ENV === 'development') {
      return this.getMockTableCurrentOrder(tableNumber)
    }

    return apiClient.get<Order | null>(`/tables/${tableNumber}/current-order`)
  }

  // 주문 영수증 조회
  async getOrderReceipt(id: string): Promise<ApiResponse<{
    order: Order
    receiptUrl: string
    qrCode: string
  }>> {
    if (process.env.NODE_ENV === 'development') {
      return this.getMockOrderReceipt(id)
    }

    return apiClient.get(`/orders/${id}/receipt`)
  }

  // =============================================================================
  // Mock API 구현 (개발용)
  // =============================================================================

  private async createMockOrder(data: OrderCreateRequest): Promise<ApiResponse<Order>> {
    // 주문 번호 생성 (현재 시간 기반)
    const orderNumber = `T${data.tableNumber}-${Date.now().toString().slice(-6)}`

    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber,
      tableNumber: data.tableNumber,
      items: data.items.map((item: any) => ({
        ...item,
        menuItem: {
          id: item.menuItemId,
          name: this.getMockMenuItemName(item.menuItemId),
          description: '메뉴 설명',
          price: item.unitPrice,
          category: 'pizza',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
          isAvailable: true,
          prepTime: 15
        }
      })),
      paymentMethod: data.paymentMethod,
      totalAmount: data.totalAmount,
      status: 'pending',
      customerInfo: data.customerInfo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedReadyTime: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15분 후
    }

    return apiClient.mockResponse(newOrder)
  }

  private async getMockOrders(params?: {
    page?: number
    limit?: number
    status?: Order['status']
    tableNumber?: number
  }): Promise<PaginatedResponse<Order>> {
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'T5-001234',
        tableNumber: 5,
        items: [
          {
            menuItemId: '1',
            menuItem: {
              id: '1',
              name: '마르게리타 피자',
              description: '신선한 토마토 소스와 모차렐라 치즈',
              price: 18000,
              category: 'pizza',
              image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
              isAvailable: true,
              prepTime: 15
            },
            quantity: 2,
            selectedSize: '라지',
            selectedExtras: ['올리브', '치즈 추가'],
            unitPrice: 23000,
            totalPrice: 46000
          }
        ],
        paymentMethod: 'card',
        totalAmount: 46000,
        status: 'preparing',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedReadyTime: new Date(Date.now() + 10 * 60 * 1000).toISOString()
      }
    ]

    // 필터링 적용
    let filteredOrders = mockOrders

    if (params?.status) {
      filteredOrders = filteredOrders.filter(order => order.status === params.status)
    }

    if (params?.tableNumber) {
      filteredOrders = filteredOrders.filter(order => order.tableNumber === params.tableNumber)
    }

    // 페이지네이션 적용
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex)

    const response = {
      success: true,
      data: paginatedOrders,
      pagination: {
        page,
        limit,
        total: filteredOrders.length,
        totalPages: Math.ceil(filteredOrders.length / limit)
      }
    }

    return Promise.resolve(response as PaginatedResponse<Order>)
  }

  private async getMockOrder(id: string): Promise<ApiResponse<Order>> {
    const mockOrder: Order = {
      id,
      orderNumber: `T5-${id.padStart(6, '0')}`,
      tableNumber: 5,
      items: [
        {
          menuItemId: '1',
          menuItem: {
            id: '1',
            name: '마르게리타 피자',
            description: '신선한 토마토 소스와 모차렐라 치즈',
            price: 18000,
            category: 'pizza',
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
            isAvailable: true,
            prepTime: 15
          },
          quantity: 1,
          selectedSize: '미디움',
          selectedExtras: ['올리브'],
          unitPrice: 20000,
          totalPrice: 20000
        }
      ],
      paymentMethod: 'card',
      totalAmount: 20000,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedReadyTime: new Date(Date.now() + 12 * 60 * 1000).toISOString()
    }

    return apiClient.mockResponse(mockOrder)
  }

  private async updateMockOrderStatus(id: string, status: Order['status']): Promise<ApiResponse<Order>> {
    const updatedOrder: Order = {
      id,
      orderNumber: `T5-${id.padStart(6, '0')}`,
      tableNumber: 5,
      items: [],
      paymentMethod: 'card',
      totalAmount: 20000,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return apiClient.mockResponse(updatedOrder)
  }

  private async cancelMockOrder(id: string, reason?: string): Promise<ApiResponse<Order>> {
    const cancelledOrder: Order = {
      id,
      orderNumber: `T5-${id.padStart(6, '0')}`,
      tableNumber: 5,
      items: [],
      paymentMethod: 'card',
      totalAmount: 20000,
      status: 'cancelled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return apiClient.mockResponse(cancelledOrder)
  }

  private async getMockTableCurrentOrder(tableNumber: number): Promise<ApiResponse<Order | null>> {
    // 50% 확률로 현재 주문이 있다고 가정
    if (Math.random() < 0.5) {
      return apiClient.mockResponse(null)
    }

    const currentOrder: Order = {
      id: Date.now().toString(),
      orderNumber: `T${tableNumber}-001234`,
      tableNumber,
      items: [],
      paymentMethod: 'card',
      totalAmount: 25000,
      status: 'preparing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedReadyTime: new Date(Date.now() + 8 * 60 * 1000).toISOString()
    }

    return apiClient.mockResponse(currentOrder)
  }

  private async getMockOrderReceipt(id: string): Promise<ApiResponse<{
    order: Order
    receiptUrl: string
    qrCode: string
  }>> {
    const mockReceipt = {
      order: {
        id,
        orderNumber: `T5-${id.padStart(6, '0')}`,
        tableNumber: 5,
        items: [],
        paymentMethod: 'card' as const,
        totalAmount: 20000,
        status: 'served' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      receiptUrl: `https://example.com/receipts/${id}.pdf`,
      qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`
    }

    return apiClient.mockResponse(mockReceipt)
  }

  private getMockMenuItemName(menuItemId: string): string {
    const mockNames: Record<string, string> = {
      '1': '마르게리타 피자',
      '2': '페퍼로니 피자',
      '3': '시저 샐러드',
      '4': '콜라',
      '5': '치킨 파스타'
    }
    return mockNames[menuItemId] || '알 수 없는 메뉴'
  }
}

// =============================================================================
// Table API Service (주문과 관련된 테이블 관리)
// =============================================================================

export class TableApiService {
  // 테이블 목록 조회
  async getTables(): Promise<ApiResponse<Table[]>> {
    if (process.env.NODE_ENV === 'development') {
      return this.getMockTables()
    }

    return apiClient.get<Table[]>('/tables')
  }

  // 특정 테이블 조회
  async getTable(id: string): Promise<ApiResponse<Table>> {
    if (process.env.NODE_ENV === 'development') {
      return this.getMockTable(id)
    }

    return apiClient.get<Table>(`/tables/${id}`)
  }

  // 테이블 상태 업데이트
  async updateTableStatus(id: string, status: Table['status']): Promise<ApiResponse<Table>> {
    if (process.env.NODE_ENV === 'development') {
      return this.updateMockTableStatus(id, status)
    }

    return apiClient.patch<Table>(`/tables/${id}/status`, { status })
  }

  // Mock 구현
  private async getMockTables(): Promise<ApiResponse<Table[]>> {
    const mockTables: Table[] = Array.from({ length: 10 }, (_, i) => ({
      id: (i + 1).toString(),
      number: i + 1,
      status: Math.random() < 0.7 ? 'available' : 'occupied',
      capacity: Math.floor(Math.random() * 6) + 2, // 2-8명
      currentOrderId: Math.random() < 0.3 ? 'order-' + (i + 1) : undefined
    }))

    return apiClient.mockResponse(mockTables)
  }

  private async getMockTable(id: string): Promise<ApiResponse<Table>> {
    const mockTable: Table = {
      id,
      number: parseInt(id),
      status: 'available',
      capacity: 4,
      currentOrderId: undefined
    }

    return apiClient.mockResponse(mockTable)
  }

  private async updateMockTableStatus(id: string, status: Table['status']): Promise<ApiResponse<Table>> {
    const updatedTable: Table = {
      id,
      number: parseInt(id),
      status,
      capacity: 4,
      currentOrderId: status === 'occupied' ? `order-${id}` : undefined
    }

    return apiClient.mockResponse(updatedTable)
  }
}

// =============================================================================
// Service Instances
// =============================================================================

export const orderApi = new OrderApiService()
export const tableApi = new TableApiService()

// 편의 함수들
export const orderApiService = {
  // 주문 관리
  create: (data: OrderCreateRequest) => orderApi.createOrder(data),
  getList: (params?: Parameters<typeof orderApi.getOrders>[0]) => orderApi.getOrders(params),
  getById: (id: string) => orderApi.getOrder(id),
  updateStatus: (id: string, status: Order['status']) => orderApi.updateOrderStatus(id, status),
  cancel: (id: string, reason?: string) => orderApi.cancelOrder(id, reason),

  // 테이블 관련
  getTableOrder: (tableNumber: number) => orderApi.getTableCurrentOrder(tableNumber),
  getReceipt: (id: string) => orderApi.getOrderReceipt(id),

  // 상태별 조회
  getPendingOrders: () => orderApi.getOrders({ status: 'pending' }),
  getConfirmedOrders: () => orderApi.getOrders({ status: 'confirmed' }),
  getPreparingOrders: () => orderApi.getOrders({ status: 'preparing' }),
  getReadyOrders: () => orderApi.getOrders({ status: 'ready' }),
  getServedOrders: () => orderApi.getOrders({ status: 'served' })
}

export const tableApiService = {
  getAll: () => tableApi.getTables(),
  getById: (id: string) => tableApi.getTable(id),
  updateStatus: (id: string, status: Table['status']) => tableApi.updateTableStatus(id, status)
}