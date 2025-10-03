import { Request, Response, NextFunction } from 'express'
import { OrderService } from '../services/orderService'
import type { OrderCreateRequest, OrderUpdateRequest, OrderListParams } from '../types'

const orderService = new OrderService()

export class OrderController {
  /**
   * GET /api/orders
   * 주문 목록 조회
   */
  async getOrderList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params: OrderListParams = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        tableId: req.query.tableId as string,
        status: req.query.status as string,
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string
      }

      const result = await orderService.getOrderList(params)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/orders/:id
   * 특정 주문 조회
   */
  async getOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const result = await orderService.getOrder(id)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/orders
   * 새 주문 생성
   */
  async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: OrderCreateRequest = req.body
      const result = await orderService.createOrder(data)
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * PUT /api/orders/:id
   * 주문 업데이트
   */
  async updateOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const data: OrderUpdateRequest = { ...req.body, id }
      const result = await orderService.updateOrder(data)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * PATCH /api/orders/:id/status
   * 주문 상태 업데이트
   */
  async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const { status } = req.body

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        })
      }

      const result = await orderService.updateOrderStatus(id, status)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * DELETE /api/orders/:id
   * 주문 삭제 (취소)
   */
  async deleteOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const result = await orderService.deleteOrder(id)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/orders/table/:tableId
   * 테이블별 주문 조회
   */
  async getOrdersByTable(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tableId } = req.params
      const result = await orderService.getOrdersByTable(tableId)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/orders/stats
   * 주문 통계
   */
  async getOrderStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params = {
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string
      }
      const result = await orderService.getOrderStats(params)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }
}