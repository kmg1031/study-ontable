import { Router } from 'express'
import { MenuController } from '../controllers/menuController'

const router = Router()
const menuController = new MenuController()

// GET /api/menu/categories - 메뉴 카테고리 목록 (특수 경로이므로 먼저 정의)
router.get('/categories', menuController.getMenuCategories.bind(menuController))

// GET /api/menu/category/:categoryName - 카테고리별 메뉴 조회
router.get('/category/:categoryName', menuController.getMenuByCategory.bind(menuController))

// GET /api/menu - 메뉴 목록 조회 (페이지네이션, 필터링 지원)
router.get('/', menuController.getMenuList.bind(menuController))

// GET /api/menu/:id - 특정 메뉴 아이템 조회
router.get('/:id', menuController.getMenuItem.bind(menuController))

// POST /api/menu - 새 메뉴 아이템 생성 (관리자 권한 필요 - 추후 구현)
router.post('/', menuController.createMenuItem.bind(menuController))

// PUT /api/menu/:id - 메뉴 아이템 업데이트 (관리자 권한 필요 - 추후 구현)
router.put('/:id', menuController.updateMenuItem.bind(menuController))

// DELETE /api/menu/:id - 메뉴 아이템 삭제 (관리자 권한 필요 - 추후 구현)
router.delete('/:id', menuController.deleteMenuItem.bind(menuController))

export default router