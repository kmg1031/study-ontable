import { Router } from 'express'
import { OrderController } from '../controllers/orderController'

const router = Router()
const orderController = new OrderController()

// GET /api/orders/stats - 주문 통계 (특수 경로이므로 먼저 정의)
router.get('/stats', orderController.getOrderStats.bind(orderController))

// GET /api/orders/table/:tableId - 테이블별 주문 조회 (특수 경로)
router.get('/table/:tableId', orderController.getOrdersByTable.bind(orderController))

// GET /api/orders - 주문 목록 조회 (페이지네이션, 필터링 지원)
router.get('/', orderController.getOrderList.bind(orderController))

// GET /api/orders/:id - 특정 주문 조회
router.get('/:id', orderController.getOrder.bind(orderController))

// POST /api/orders - 새 주문 생성
router.post('/', orderController.createOrder.bind(orderController))

// PUT /api/orders/:id - 주문 업데이트
router.put('/:id', orderController.updateOrder.bind(orderController))

// PATCH /api/orders/:id/status - 주문 상태 업데이트
router.patch('/:id/status', orderController.updateOrderStatus.bind(orderController))

// DELETE /api/orders/:id - 주문 삭제 (취소)
router.delete('/:id', orderController.deleteOrder.bind(orderController))

export default router