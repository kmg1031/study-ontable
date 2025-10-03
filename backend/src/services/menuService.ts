import { prisma } from '../config/database'
import type {
  MenuCreateRequest,
  MenuUpdateRequest,
  MenuListParams,
  ApiResponse,
  PaginatedResponse,
  MenuItem
} from '../types'

export class MenuService {
  /**
   * 메뉴 목록 조회
   */
  async getMenuList(params: MenuListParams = {}): Promise<PaginatedResponse<MenuItem>> {
    const {
      page = 1,
      limit = 20,
      categoryId,
      isAvailable,
      search
    } = params

    const offset = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (typeof isAvailable === 'boolean') {
      where.isAvailable = isAvailable
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ]
    }

    // Get total count for pagination
    const total = await prisma.menuItem.count({ where })

    // Get menu items with relations
    const menuItems = await prisma.menuItem.findMany({
      where,
      include: {
        category: true,
        restaurant: true
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      skip: offset,
      take: limit
    })

    // Transform data to match API response format
    const transformedItems: MenuItem[] = menuItems.map(item => ({
      id: item.id,
      restaurantId: item.restaurantId,
      categoryId: item.categoryId,
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl || undefined,
      isAvailable: item.isAvailable,
      prepTimeMinutes: item.prepTimeMinutes,
      options: item.options ? JSON.parse(item.options) : undefined,
      sortOrder: item.sortOrder,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }))

    return {
      success: true,
      data: transformedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  /**
   * 특정 메뉴 아이템 조회
   */
  async getMenuItem(id: string): Promise<ApiResponse<MenuItem>> {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: true,
        restaurant: true
      }
    })

    if (!menuItem) {
      throw new Error('Menu item not found')
    }

    const transformedItem: MenuItem = {
      id: menuItem.id,
      restaurantId: menuItem.restaurantId,
      categoryId: menuItem.categoryId,
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      imageUrl: menuItem.imageUrl || undefined,
      isAvailable: menuItem.isAvailable,
      prepTimeMinutes: menuItem.prepTimeMinutes,
      options: menuItem.options ? JSON.parse(menuItem.options) : undefined,
      sortOrder: menuItem.sortOrder,
      createdAt: menuItem.createdAt,
      updatedAt: menuItem.updatedAt
    }

    return {
      success: true,
      data: transformedItem
    }
  }

  /**
   * 새 메뉴 아이템 생성
   */
  async createMenuItem(data: MenuCreateRequest): Promise<ApiResponse<MenuItem>> {
    // Get restaurant ID (for now, use the first restaurant)
    const restaurant = await prisma.restaurant.findFirst()
    if (!restaurant) {
      throw new Error('No restaurant found')
    }

    // Verify category exists
    const category = await prisma.menuCategory.findUnique({
      where: { id: data.categoryId }
    })
    if (!category) {
      throw new Error('Category not found')
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
        prepTimeMinutes: data.prepTimeMinutes || 10,
        options: data.options ? JSON.stringify(data.options) : null,
        sortOrder: data.sortOrder || 0
      },
      include: {
        category: true,
        restaurant: true
      }
    })

    const transformedItem: MenuItem = {
      id: menuItem.id,
      restaurantId: menuItem.restaurantId,
      categoryId: menuItem.categoryId,
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      imageUrl: menuItem.imageUrl || undefined,
      isAvailable: menuItem.isAvailable,
      prepTimeMinutes: menuItem.prepTimeMinutes,
      options: menuItem.options ? JSON.parse(menuItem.options) : undefined,
      sortOrder: menuItem.sortOrder,
      createdAt: menuItem.createdAt,
      updatedAt: menuItem.updatedAt
    }

    return {
      success: true,
      data: transformedItem,
      message: 'Menu item created successfully'
    }
  }

  /**
   * 메뉴 아이템 업데이트
   */
  async updateMenuItem(data: MenuUpdateRequest): Promise<ApiResponse<MenuItem>> {
    const { id, ...updateData } = data

    // Check if menu item exists
    const existingItem = await prisma.menuItem.findUnique({
      where: { id }
    })
    if (!existingItem) {
      throw new Error('Menu item not found')
    }

    // If categoryId is provided, verify it exists
    if (updateData.categoryId) {
      const category = await prisma.menuCategory.findUnique({
        where: { id: updateData.categoryId }
      })
      if (!category) {
        throw new Error('Category not found')
      }
    }

    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data: {
        ...updateData,
        options: updateData.options ? JSON.stringify(updateData.options) : undefined
      },
      include: {
        category: true,
        restaurant: true
      }
    })

    const transformedItem: MenuItem = {
      id: updatedItem.id,
      restaurantId: updatedItem.restaurantId,
      categoryId: updatedItem.categoryId,
      name: updatedItem.name,
      description: updatedItem.description,
      price: updatedItem.price,
      imageUrl: updatedItem.imageUrl || undefined,
      isAvailable: updatedItem.isAvailable,
      prepTimeMinutes: updatedItem.prepTimeMinutes,
      options: updatedItem.options ? JSON.parse(updatedItem.options) : undefined,
      sortOrder: updatedItem.sortOrder,
      createdAt: updatedItem.createdAt,
      updatedAt: updatedItem.updatedAt
    }

    return {
      success: true,
      data: transformedItem,
      message: 'Menu item updated successfully'
    }
  }

  /**
   * 메뉴 아이템 삭제
   */
  async deleteMenuItem(id: string): Promise<ApiResponse<null>> {
    const existingItem = await prisma.menuItem.findUnique({
      where: { id }
    })
    if (!existingItem) {
      throw new Error('Menu item not found')
    }

    await prisma.menuItem.delete({
      where: { id }
    })

    return {
      success: true,
      data: null,
      message: 'Menu item deleted successfully'
    }
  }

  /**
   * 카테고리별 메뉴 조회
   */
  async getMenuByCategory(categoryName: string): Promise<ApiResponse<MenuItem[]>> {
    const category = await prisma.menuCategory.findFirst({
      where: { name: categoryName }
    })

    if (!category) {
      throw new Error('Category not found')
    }

    const result = await this.getMenuList({ categoryId: category.id, limit: 100 })

    return {
      success: true,
      data: result.data
    }
  }

  /**
   * 메뉴 카테고리 목록 조회
   */
  async getMenuCategories(): Promise<ApiResponse<any[]>> {
    const categories = await prisma.menuCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    })

    return {
      success: true,
      data: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder
      }))
    }
  }
}