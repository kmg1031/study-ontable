import { Request, Response, NextFunction } from 'express'
import { MenuService } from '../services/menuService'
import type { MenuCreateRequest, MenuUpdateRequest, MenuListParams } from '../types'

const menuService = new MenuService()

export class MenuController {
  /**
   * GET /api/menu
   * 메뉴 목록 조회
   */
  async getMenuList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params: MenuListParams = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        categoryId: req.query.categoryId as string,
        isAvailable: req.query.isAvailable ? req.query.isAvailable === 'true' : undefined,
        search: req.query.search as string
      }

      const result = await menuService.getMenuList(params)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/menu/:id
   * 특정 메뉴 아이템 조회
   */
  async getMenuItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const result = await menuService.getMenuItem(id)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/menu
   * 새 메뉴 아이템 생성
   */
  async createMenuItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: MenuCreateRequest = req.body
      const result = await menuService.createMenuItem(data)
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * PUT /api/menu/:id
   * 메뉴 아이템 업데이트
   */
  async updateMenuItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const data: MenuUpdateRequest = { ...req.body, id }
      const result = await menuService.updateMenuItem(data)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * DELETE /api/menu/:id
   * 메뉴 아이템 삭제
   */
  async deleteMenuItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const result = await menuService.deleteMenuItem(id)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/menu/category/:categoryName
   * 카테고리별 메뉴 조회
   */
  async getMenuByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { categoryName } = req.params
      const result = await menuService.getMenuByCategory(categoryName)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/menu/categories
   * 메뉴 카테고리 목록 조회
   */
  async getMenuCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await menuService.getMenuCategories()
      res.json(result)
    } catch (error) {
      next(error)
    }
  }
}