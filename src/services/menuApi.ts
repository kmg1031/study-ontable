import type { MenuItem } from '@/types'
import type {
  MenuListParams,
  MenuCreateRequest,
  MenuUpdateRequest,
  ApiResponse,
  PaginatedResponse
} from '@/types/api'
import { apiClient } from './apiClient'

// =============================================================================
// Menu API Service
// =============================================================================

export class MenuApiService {
  // 메뉴 목록 조회
  async getMenuList(params?: MenuListParams): Promise<PaginatedResponse<MenuItem>> {
    // 개발 환경에서는 Mock 데이터 반환
    if (process.env.NODE_ENV === 'development') {
      return this.getMockMenuList(params)
    }

    const queryParams = new URLSearchParams()
    if (params?.category) queryParams.append('category', params.category)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)

    const url = `/menu${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return apiClient.get<MenuItem[]>(url) as Promise<PaginatedResponse<MenuItem>>
  }

  // 특정 메뉴 조회
  async getMenuItem(id: string): Promise<ApiResponse<MenuItem>> {
    if (process.env.NODE_ENV === 'development') {
      return this.getMockMenuItem(id)
    }

    return apiClient.get<MenuItem>(`/menu/${id}`)
  }

  // 메뉴 생성 (관리자용)
  async createMenuItem(data: MenuCreateRequest): Promise<ApiResponse<MenuItem>> {
    if (process.env.NODE_ENV === 'development') {
      return this.createMockMenuItem(data)
    }

    return apiClient.post<MenuItem>('/menu', data)
  }

  // 메뉴 수정 (관리자용)
  async updateMenuItem(data: MenuUpdateRequest): Promise<ApiResponse<MenuItem>> {
    if (process.env.NODE_ENV === 'development') {
      return this.updateMockMenuItem(data)
    }

    return apiClient.put<MenuItem>(`/menu/${data.id}`, data)
  }

  // 메뉴 삭제 (관리자용)
  async deleteMenuItem(id: string): Promise<ApiResponse<null>> {
    if (process.env.NODE_ENV === 'development') {
      return this.deleteMockMenuItem(id)
    }

    return apiClient.delete<null>(`/menu/${id}`)
  }

  // 카테고리별 메뉴 조회
  async getMenuByCategory(category: string): Promise<ApiResponse<MenuItem[]>> {
    return this.getMenuList({ category }) as Promise<ApiResponse<MenuItem[]>>
  }

  // =============================================================================
  // Mock API 구현 (개발용)
  // =============================================================================

  private async getMockMenuList(params?: MenuListParams): Promise<PaginatedResponse<MenuItem>> {
    const mockMenuItems: MenuItem[] = [
      {
        id: '1',
        name: '마르게리타 피자',
        description: '신선한 토마토 소스와 모차렐라 치즈, 바질이 어우러진 클래식 피자',
        price: 18000,
        category: 'pizza',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
        isAvailable: true,
        prepTime: 15,
        options: {
          sizes: [
            { name: '미디움', price: 0 },
            { name: '라지', price: 5000 }
          ],
          extras: [
            { name: '올리브', price: 2000 },
            { name: '페퍼로니', price: 3000 },
            { name: '치즈 추가', price: 2500 }
          ]
        }
      },
      {
        id: '2',
        name: '페퍼로니 피자',
        description: '매콤한 페퍼로니와 치즈가 완벽하게 조화된 인기 메뉴',
        price: 22000,
        category: 'pizza',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
        isAvailable: true,
        prepTime: 15,
        options: {
          sizes: [
            { name: '미디움', price: 0 },
            { name: '라지', price: 5000 }
          ],
          extras: [
            { name: '올리브', price: 2000 },
            { name: '버섯', price: 2000 },
            { name: '치즈 추가', price: 2500 }
          ]
        }
      },
      {
        id: '3',
        name: '시저 샐러드',
        description: '신선한 로메인 상추와 파마산 치즈, 크루톤이 들어간 건강한 샐러드',
        price: 12000,
        category: 'salad',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
        isAvailable: true,
        prepTime: 5,
        options: {
          extras: [
            { name: '그릴드 치킨', price: 5000 },
            { name: '베이컨', price: 3000 },
            { name: '아보카도', price: 3500 }
          ]
        }
      },
      {
        id: '4',
        name: '콜라',
        description: '시원한 탄산음료',
        price: 3000,
        category: 'drink',
        image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop',
        isAvailable: true,
        prepTime: 1
      },
      {
        id: '5',
        name: '치킨 파스타',
        description: '부드러운 치킨과 크림 소스가 어우러진 파스타',
        price: 16000,
        category: 'pasta',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
        isAvailable: true,
        prepTime: 12,
        options: {
          extras: [
            { name: '버섯', price: 2000 },
            { name: '베이컨', price: 3000 },
            { name: '치즈 추가', price: 2500 }
          ]
        }
      }
    ]

    // 필터링 적용
    let filteredItems = mockMenuItems

    if (params?.category) {
      filteredItems = filteredItems.filter(item => item.category === params.category)
    }

    if (params?.search) {
      const searchTerm = params.search.toLowerCase()
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
      )
    }

    // 페이지네이션 적용
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedItems = filteredItems.slice(startIndex, endIndex)

    const response = {
      success: true,
      data: paginatedItems,
      pagination: {
        page,
        limit,
        total: filteredItems.length,
        totalPages: Math.ceil(filteredItems.length / limit)
      }
    }

    return Promise.resolve(response as PaginatedResponse<MenuItem>)
  }

  private async getMockMenuItem(id: string): Promise<ApiResponse<MenuItem>> {
    const mockMenuItem: MenuItem = {
      id,
      name: '마르게리타 피자',
      description: '신선한 토마토 소스와 모차렐라 치즈, 바질이 어우러진 클래식 피자',
      price: 18000,
      category: 'pizza',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
      isAvailable: true,
      prepTime: 15,
      options: {
        sizes: [
          { name: '미디움', price: 0 },
          { name: '라지', price: 5000 }
        ],
        extras: [
          { name: '올리브', price: 2000 },
          { name: '페퍼로니', price: 3000 },
          { name: '치즈 추가', price: 2500 }
        ]
      }
    }

    return apiClient.mockResponse(mockMenuItem)
  }

  private async createMockMenuItem(data: MenuCreateRequest): Promise<ApiResponse<MenuItem>> {
    const newMenuItem: MenuItem = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      image: data.image || 'https://via.placeholder.com/400x300',
      isAvailable: true,
      prepTime: 10,
      options: data.options
    }

    return apiClient.mockResponse(newMenuItem)
  }

  private async updateMockMenuItem(data: MenuUpdateRequest): Promise<ApiResponse<MenuItem>> {
    const updatedMenuItem: MenuItem = {
      id: data.id,
      name: data.name || '업데이트된 메뉴',
      description: data.description || '업데이트된 설명',
      price: data.price || 10000,
      category: data.category || 'pizza',
      image: data.image || 'https://via.placeholder.com/400x300',
      isAvailable: true,
      prepTime: 10,
      options: data.options
    }

    return apiClient.mockResponse(updatedMenuItem)
  }

  private async deleteMockMenuItem(id: string): Promise<ApiResponse<null>> {
    return apiClient.mockResponse(null)
  }
}

// =============================================================================
// Service Instance
// =============================================================================

export const menuApi = new MenuApiService()

// 편의 함수들
export const menuApiService = {
  // 기본 CRUD 작업
  getList: (params?: MenuListParams) => menuApi.getMenuList(params),
  getById: (id: string) => menuApi.getMenuItem(id),
  create: (data: MenuCreateRequest) => menuApi.createMenuItem(data),
  update: (data: MenuUpdateRequest) => menuApi.updateMenuItem(data),
  delete: (id: string) => menuApi.deleteMenuItem(id),

  // 특수 조회 작업
  getByCategory: (category: string) => menuApi.getMenuByCategory(category),

  // 카테고리별 편의 함수
  getPizzas: () => menuApi.getMenuByCategory('pizza'),
  getPastas: () => menuApi.getMenuByCategory('pasta'),
  getSalads: () => menuApi.getMenuByCategory('salad'),
  getDrinks: () => menuApi.getMenuByCategory('drink')
}