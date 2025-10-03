import { prisma } from '../config/database'
import type {
  OrderCreateRequest,
  OrderUpdateRequest,
  OrderListParams,
  ApiResponse,
  PaginatedResponse,
  Order,
  OrderItem
} from '../types'

export class OrderService {
  /**
   * 주문 목록 조회
   */
  async getOrderList(params: OrderListParams = {}): Promise<PaginatedResponse<Order>> {
    const {
      page = 1,
      limit = 20,
      tableId,
      status,
      dateFrom,
      dateTo
    } = params

    const offset = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (tableId) {
      where.tableId = tableId
    }

    if (status) {
      where.status = status
    }

    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo)
      }
    }

    // Get total count for pagination
    const total = await prisma.order.count({ where })

    // Get orders with relations
    const orders = await prisma.order.findMany({
      where,
      include: {
        table: true,
        orderItems: {
          include: {
            menuItem: true
          }
        },
        payment: true
      },
      orderBy: [
        { createdAt: 'desc' }
      ],
      skip: offset,
      take: limit
    })

    // Transform data to match API response format
    const transformedOrders: Order[] = orders.map(order => ({
      id: order.id,
      tableId: order.tableId,
      status: order.status,
      totalAmount: order.totalAmount,
      specialRequests: order.specialRequests || undefined,
      customerName: order.customerName || undefined,
      customerPhone: order.customerPhone || undefined,
      estimatedPrepTime: order.estimatedPrepTime,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems: order.orderItems.map(item => ({
        id: item.id,
        orderId: item.orderId,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        options: item.options ? JSON.parse(item.options) : undefined,
        specialRequests: item.specialRequests || undefined,
        menuItem: {
          id: item.menuItem.id,
          name: item.menuItem.name,
          description: item.menuItem.description,
          price: item.menuItem.price,
          imageUrl: item.menuItem.imageUrl || undefined
        }
      }))
    }))

    return {
      success: true,
      data: transformedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  /**
   * 특정 주문 조회
   */
  async getOrder(id: string): Promise<ApiResponse<Order>> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        table: true,
        orderItems: {
          include: {
            menuItem: true
          }
        },
        payment: true
      }
    })

    if (!order) {
      throw new Error('Order not found')
    }

    const transformedOrder: Order = {
      id: order.id,
      tableId: order.tableId,
      status: order.status,
      totalAmount: order.totalAmount,
      specialRequests: order.specialRequests || undefined,
      customerName: order.customerName || undefined,
      customerPhone: order.customerPhone || undefined,
      estimatedPrepTime: order.estimatedPrepTime,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems: order.orderItems.map(item => ({
        id: item.id,
        orderId: item.orderId,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        options: item.options ? JSON.parse(item.options) : undefined,
        specialRequests: item.specialRequests || undefined,
        menuItem: {
          id: item.menuItem.id,
          name: item.menuItem.name,
          description: item.menuItem.description,
          price: item.menuItem.price,
          imageUrl: item.menuItem.imageUrl || undefined
        }
      }))
    }

    return {
      success: true,
      data: transformedOrder
    }
  }

  /**
   * 새 주문 생성
   */
  async createOrder(data: OrderCreateRequest): Promise<ApiResponse<Order>> {
    // Verify table exists
    const table = await prisma.table.findUnique({
      where: { id: data.tableId }
    })
    if (!table) {
      throw new Error('Table not found')
    }

    // Verify all menu items exist and calculate total
    let totalAmount = 0
    const validatedItems = []

    for (const item of data.orderItems) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId }
      })
      if (!menuItem) {
        throw new Error(`Menu item ${item.menuItemId} not found`)
      }
      if (!menuItem.isAvailable) {
        throw new Error(`Menu item ${menuItem.name} is not available`)
      }

      const itemTotal = menuItem.price * item.quantity
      totalAmount += itemTotal

      validatedItems.push({
        ...item,
        unitPrice: menuItem.price
      })
    }

    // Create order with order items in transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          tableId: data.tableId,
          status: 'pending',
          totalAmount,
          specialRequests: data.specialRequests,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          estimatedPrepTime: data.estimatedPrepTime || 30
        }
      })

      // Create order items
      await tx.orderItem.createMany({
        data: validatedItems.map(item => ({
          orderId: newOrder.id,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          options: item.options ? JSON.stringify(item.options) : null,
          specialRequests: item.specialRequests
        }))
      })

      return newOrder
    })

    // Fetch the complete order with relations
    const result = await this.getOrder(order.id)

    return {
      success: true,
      data: result.data,
      message: 'Order created successfully'
    }
  }

  /**
   * 주문 상태 업데이트
   */
  async updateOrderStatus(id: string, status: string): Promise<ApiResponse<Order>> {
    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id }
    })
    if (!existingOrder) {
      throw new Error('Order not found')
    }

    // Update order status
    await prisma.order.update({
      where: { id },
      data: { status }
    })

    const result = await this.getOrder(id)

    return {
      success: true,
      data: result.data,
      message: 'Order status updated successfully'
    }
  }

  /**
   * 주문 업데이트 (전체)
   */
  async updateOrder(data: OrderUpdateRequest): Promise<ApiResponse<Order>> {
    const { id, ...updateData } = data

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id }
    })
    if (!existingOrder) {
      throw new Error('Order not found')
    }

    // If tableId is provided, verify it exists
    if (updateData.tableId) {
      const table = await prisma.table.findUnique({
        where: { id: updateData.tableId }
      })
      if (!table) {
        throw new Error('Table not found')
      }
    }

    await prisma.order.update({
      where: { id },
      data: updateData
    })

    const result = await this.getOrder(id)

    return {
      success: true,
      data: result.data,
      message: 'Order updated successfully'
    }
  }

  /**
   * 주문 삭제 (취소)
   */
  async deleteOrder(id: string): Promise<ApiResponse<null>> {
    const existingOrder = await prisma.order.findUnique({
      where: { id }
    })
    if (!existingOrder) {
      throw new Error('Order not found')
    }

    // Delete order and related order items (cascade)
    await prisma.order.delete({
      where: { id }
    })

    return {
      success: true,
      data: null,
      message: 'Order deleted successfully'
    }
  }

  /**
   * 테이블별 주문 조회
   */
  async getOrdersByTable(tableId: string): Promise<ApiResponse<Order[]>> {
    const table = await prisma.table.findUnique({
      where: { id: tableId }
    })

    if (!table) {
      throw new Error('Table not found')
    }

    const result = await this.getOrderList({ tableId, limit: 100 })

    return {
      success: true,
      data: result.data
    }
  }

  /**
   * 주문 통계
   */
  async getOrderStats(params: { dateFrom?: string; dateTo?: string } = {}): Promise<ApiResponse<any>> {
    const where: any = {}

    if (params.dateFrom || params.dateTo) {
      where.createdAt = {}
      if (params.dateFrom) {
        where.createdAt.gte = new Date(params.dateFrom)
      }
      if (params.dateTo) {
        where.createdAt.lte = new Date(params.dateTo)
      }
    }

    const [totalOrders, totalRevenue, statusCounts] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.aggregate({
        where,
        _sum: { totalAmount: true }
      }),
      prisma.order.groupBy({
        by: ['status'],
        where,
        _count: { status: true }
      })
    ])

    const stats = {
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      statusBreakdown: statusCounts.reduce((acc, item) => {
        acc[item.status] = item._count.status
        return acc
      }, {} as Record<string, number>)
    }

    return {
      success: true,
      data: stats
    }
  }
}