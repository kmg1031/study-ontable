const express = require('express')
const router = express.Router()
const db = require('../database/connection')

/**
 * 테이블의 현재 주문 조회 API
 * GET /api/tables/:tableNumber/current-order
 *
 * 특정 테이블의 진행 중인 주문을 조회합니다.
 */
router.get('/:tableNumber/current-order', async (req, res) => {
  try {
    const { tableNumber } = req.params

    // 해당 테이블의 진행 중인 주문 조회
    // status가 'completed'나 'cancelled'가 아닌 최신 주문을 가져옴
    const sql = `
      SELECT
        id, order_number, table_number, customer_name, customer_phone,
        total_amount, status, payment_status, payment_key, payment_method,
        paid_at, notes, created_at, updated_at
      FROM orders
      WHERE table_number = ?
        AND status NOT IN ('completed', 'cancelled')
      ORDER BY created_at DESC
      LIMIT 1
    `

    const [order] = await db.query(sql, [tableNumber])

    if (!order) {
      return res.json({
        success: true,
        data: null,
        message: '진행 중인 주문이 없습니다.'
      })
    }

    // 주문 아이템 조회
    order.items = await getOrderItems(order.id)

    res.json({
      success: true,
      data: order
    })

  } catch (error) {
    console.error('테이블 주문 조회 오류:', error)
    res.status(500).json({
      success: false,
      error: '주문 정보를 불러오는 중 오류가 발생했습니다.',
      code: 'TABLE_ORDER_ERROR'
    })
  }
})

/**
 * 테이블 목록 조회 API
 * GET /api/tables
 *
 * 모든 테이블의 현재 상태를 조회합니다.
 */
router.get('/', async (req, res) => {
  try {
    // 진행 중인 주문이 있는 테이블 조회
    const sql = `
      SELECT DISTINCT
        table_number,
        MAX(created_at) as last_order_time
      FROM orders
      WHERE status NOT IN ('completed', 'cancelled')
      GROUP BY table_number
      ORDER BY table_number
    `

    const activeTables = await db.query(sql)

    // 각 테이블의 주문 정보 가져오기
    const tables = []
    for (const table of activeTables) {
      const orderSql = `
        SELECT
          id, order_number, status, payment_status, total_amount, created_at
        FROM orders
        WHERE table_number = ?
          AND status NOT IN ('completed', 'cancelled')
        ORDER BY created_at DESC
        LIMIT 1
      `

      const [currentOrder] = await db.query(orderSql, [table.table_number])

      tables.push({
        tableNumber: table.table_number,
        status: currentOrder ? 'occupied' : 'available',
        currentOrder: currentOrder || null
      })
    }

    res.json({
      success: true,
      data: tables
    })

  } catch (error) {
    console.error('테이블 목록 조회 오류:', error)
    res.status(500).json({
      success: false,
      error: '테이블 정보를 불러오는 중 오류가 발생했습니다.',
      code: 'TABLE_LIST_ERROR'
    })
  }
})

/**
 * 테이블의 주문 히스토리 조회 API
 * GET /api/tables/:tableNumber/history
 */
router.get('/:tableNumber/history', async (req, res) => {
  try {
    const { tableNumber } = req.params
    const { page = 1, limit = 10 } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)

    // 해당 테이블의 모든 주문 조회
    const sql = `
      SELECT
        id, order_number, total_amount, status, payment_status,
        created_at, updated_at
      FROM orders
      WHERE table_number = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `

    const orders = await db.query(sql, [tableNumber, parseInt(limit), offset])

    // 전체 개수 조회
    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM orders WHERE table_number = ?',
      [tableNumber]
    )

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        totalPages: Math.ceil(countResult.total / parseInt(limit))
      }
    })

  } catch (error) {
    console.error('테이블 히스토리 조회 오류:', error)
    res.status(500).json({
      success: false,
      error: '주문 히스토리를 불러오는 중 오류가 발생했습니다.',
      code: 'TABLE_HISTORY_ERROR'
    })
  }
})

/**
 * 테이블 상태 조회 API
 * GET /api/tables/:tableNumber/status
 */
router.get('/:tableNumber/status', async (req, res) => {
  try {
    const { tableNumber } = req.params

    // 진행 중인 주문이 있는지 확인
    const [order] = await db.query(`
      SELECT COUNT(*) as count
      FROM orders
      WHERE table_number = ?
        AND status NOT IN ('completed', 'cancelled')
    `, [tableNumber])

    const status = order.count > 0 ? 'occupied' : 'available'

    res.json({
      success: true,
      data: {
        tableNumber: parseInt(tableNumber),
        status: status,
        hasActiveOrder: order.count > 0
      }
    })

  } catch (error) {
    console.error('테이블 상태 조회 오류:', error)
    res.status(500).json({
      success: false,
      error: '테이블 상태를 불러오는 중 오류가 발생했습니다.',
      code: 'TABLE_STATUS_ERROR'
    })
  }
})

/**
 * 주문 아이템 조회 헬퍼 함수
 */
async function getOrderItems(orderId) {
  const sql = `
    SELECT
      id, menu_item_id, menu_name, base_price, quantity, subtotal
    FROM order_items
    WHERE order_id = ?
  `

  const items = await db.query(sql, [orderId])

  // 각 아이템의 옵션 조회
  for (const item of items) {
    const optionsSql = `
      SELECT option_group_name, option_name, option_price
      FROM order_item_options
      WHERE order_item_id = ?
    `
    const options = await db.query(optionsSql, [item.id])

    // 옵션을 그룹별로 분류
    item.selectedSize = null
    item.selectedExtras = []

    for (const option of options) {
      if (option.option_group_name === '사이즈') {
        item.selectedSize = option.option_name
      } else if (option.option_group_name === '추가 옵션') {
        item.selectedExtras.push(option.option_name)
      }
    }
  }

  return items
}

module.exports = router
