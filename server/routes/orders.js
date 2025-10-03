const express = require('express')
const router = express.Router()
const db = require('../database/connection')

/**
 * 주문 생성 API
 * POST /api/orders
 *
 * Request Body:
 * {
 *   tableNumber: number,
 *   items: [{
 *     menuItemId: string,
 *     quantity: number,
 *     selectedSize?: string,
 *     selectedExtras?: string[],
 *     unitPrice: number,
 *     totalPrice: number
 *   }],
 *   totalAmount: number,
 *   customerInfo?: {
 *     name?: string,
 *     phone?: string,
 *     email?: string
 *   },
 *   notes?: string
 * }
 */
router.post('/', async (req, res) => {
  try {
    const { tableNumber, items, totalAmount, customerInfo, notes } = req.body

    // 필수 파라미터 검증
    if (!tableNumber || !items || !Array.isArray(items) || items.length === 0 || !totalAmount) {
      return res.status(400).json({
        success: false,
        error: '필수 파라미터가 누락되었습니다.',
        code: 'MISSING_PARAMETERS'
      })
    }

    // 주문 번호 생성 (테이블번호-날짜시간)
    const now = new Date()
    const dateStr = now.toISOString().slice(2, 10).replace(/-/g, '') // YYMMDD
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '') // HHMMSS
    const orderNumber = `T${tableNumber}-${dateStr}${timeStr}`

    // 트랜잭션으로 주문 생성
    const result = await db.transaction(async (connection) => {
      // 1. 주문 생성
      const orderSql = `
        INSERT INTO orders (
          order_number, table_number, customer_name, customer_phone,
          total_amount, status, payment_status, notes
        ) VALUES (?, ?, ?, ?, ?, 'pending', 'pending', ?)
      `

      const [orderResult] = await connection.execute(orderSql, [
        orderNumber,
        tableNumber,
        customerInfo?.name || null,
        customerInfo?.phone || null,
        totalAmount,
        notes || null
      ])

      const orderId = orderResult.insertId

      // 2. 주문 아이템 생성
      for (const item of items) {
        // 메뉴 정보 조회
        const [menuItem] = await connection.execute(
          'SELECT name, base_price FROM menu_items WHERE id = ?',
          [item.menuItemId]
        )

        if (!menuItem) {
          throw new Error(`메뉴 아이템을 찾을 수 없습니다: ${item.menuItemId}`)
        }

        // 주문 아이템 생성
        const itemSql = `
          INSERT INTO order_items (
            order_id, menu_item_id, menu_name, base_price, quantity, subtotal
          ) VALUES (?, ?, ?, ?, ?, ?)
        `

        const [itemResult] = await connection.execute(itemSql, [
          orderId,
          item.menuItemId,
          menuItem.name,
          menuItem.base_price,
          item.quantity,
          item.totalPrice
        ])

        const orderItemId = itemResult.insertId

        // 3. 주문 아이템 옵션 생성
        // 사이즈 옵션
        if (item.selectedSize) {
          const [sizeOption] = await connection.execute(`
            SELECT oi.name, oi.price
            FROM option_items oi
            JOIN option_groups og ON oi.option_group_id = og.id
            WHERE og.menu_item_id = ? AND og.name = '사이즈' AND oi.name = ?
          `, [item.menuItemId, item.selectedSize])

          if (sizeOption) {
            await connection.execute(`
              INSERT INTO order_item_options (order_item_id, option_group_name, option_name, option_price)
              VALUES (?, '사이즈', ?, ?)
            `, [orderItemId, sizeOption.name, sizeOption.price])
          }
        }

        // 추가 옵션들
        if (item.selectedExtras && Array.isArray(item.selectedExtras)) {
          for (const extraName of item.selectedExtras) {
            const [extraOption] = await connection.execute(`
              SELECT oi.name, oi.price
              FROM option_items oi
              JOIN option_groups og ON oi.option_group_id = og.id
              WHERE og.menu_item_id = ? AND og.name = '추가 옵션' AND oi.name = ?
            `, [item.menuItemId, extraName])

            if (extraOption) {
              await connection.execute(`
                INSERT INTO order_item_options (order_item_id, option_group_name, option_name, option_price)
                VALUES (?, '추가 옵션', ?, ?)
              `, [orderItemId, extraOption.name, extraOption.price])
            }
          }
        }
      }

      return orderId
    })

    // 생성된 주문 조회
    const order = await getOrderById(result)

    res.status(201).json({
      success: true,
      data: order,
      message: '주문이 정상적으로 생성되었습니다.'
    })

  } catch (error) {
    console.error('주문 생성 오류:', error)
    res.status(500).json({
      success: false,
      error: error.message || '주문 생성 중 오류가 발생했습니다.',
      code: 'ORDER_CREATE_ERROR'
    })
  }
})

/**
 * 주문 상세 조회 API
 * GET /api/orders/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const order = await getOrderById(id)

    if (!order) {
      return res.status(404).json({
        success: false,
        error: '주문을 찾을 수 없습니다.',
        code: 'ORDER_NOT_FOUND'
      })
    }

    res.json({
      success: true,
      data: order
    })

  } catch (error) {
    console.error('주문 조회 오류:', error)
    res.status(500).json({
      success: false,
      error: '주문 정보를 불러오는 중 오류가 발생했습니다.',
      code: 'ORDER_DETAIL_ERROR'
    })
  }
})

/**
 * 주문 목록 조회 API (관리자용)
 * GET /api/orders
 */
router.get('/', async (req, res) => {
  try {
    const { status, tableNumber, startDate, endDate, page = 1, limit = 20 } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)

    let sql = `
      SELECT
        id, order_number, table_number, customer_name, customer_phone,
        total_amount, status, payment_status, payment_key, payment_method,
        paid_at, notes, created_at, updated_at
      FROM orders
      WHERE 1=1
    `

    const params = []

    // 상태 필터
    if (status) {
      sql += ' AND status = ?'
      params.push(status)
    }

    // 테이블 번호 필터
    if (tableNumber) {
      sql += ' AND table_number = ?'
      params.push(tableNumber)
    }

    // 날짜 필터
    if (startDate) {
      sql += ' AND DATE(created_at) >= ?'
      params.push(startDate)
    }

    if (endDate) {
      sql += ' AND DATE(created_at) <= ?'
      params.push(endDate)
    }

    // 정렬 및 페이지네이션
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), offset)

    const orders = await db.query(sql, params)

    // 각 주문의 아이템 정보 추가
    for (const order of orders) {
      order.items = await getOrderItems(order.id)
    }

    // 전체 개수 조회
    let countSql = 'SELECT COUNT(*) as total FROM orders WHERE 1=1'
    const countParams = []

    if (status) {
      countSql += ' AND status = ?'
      countParams.push(status)
    }

    if (tableNumber) {
      countSql += ' AND table_number = ?'
      countParams.push(tableNumber)
    }

    if (startDate) {
      countSql += ' AND DATE(created_at) >= ?'
      countParams.push(startDate)
    }

    if (endDate) {
      countSql += ' AND DATE(created_at) <= ?'
      countParams.push(endDate)
    }

    const [countResult] = await db.query(countSql, countParams)
    const total = countResult.total

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    })

  } catch (error) {
    console.error('주문 목록 조회 오류:', error)
    res.status(500).json({
      success: false,
      error: '주문 목록을 불러오는 중 오류가 발생했습니다.',
      code: 'ORDER_LIST_ERROR'
    })
  }
})

/**
 * 주문 상태 업데이트 API
 * PATCH /api/orders/:id/status
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    // 유효한 상태 값 검증
    const validStatuses = ['pending', 'confirmed', 'preparing', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: '유효하지 않은 주문 상태입니다.',
        code: 'INVALID_STATUS'
      })
    }

    const sql = 'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?'
    await db.query(sql, [status, id])

    const order = await getOrderById(id)

    res.json({
      success: true,
      data: order,
      message: '주문 상태가 업데이트되었습니다.'
    })

  } catch (error) {
    console.error('주문 상태 업데이트 오류:', error)
    res.status(500).json({
      success: false,
      error: '주문 상태 업데이트 중 오류가 발생했습니다.',
      code: 'ORDER_UPDATE_ERROR'
    })
  }
})

/**
 * 주문 취소 API
 * PATCH /api/orders/:id/cancel
 */
router.patch('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params
    const { reason } = req.body

    const sql = `
      UPDATE orders
      SET status = 'cancelled', notes = CONCAT(IFNULL(notes, ''), '\n취소 사유: ', ?), updated_at = NOW()
      WHERE id = ?
    `
    await db.query(sql, [reason || '고객 요청', id])

    const order = await getOrderById(id)

    res.json({
      success: true,
      data: order,
      message: '주문이 취소되었습니다.'
    })

  } catch (error) {
    console.error('주문 취소 오류:', error)
    res.status(500).json({
      success: false,
      error: '주문 취소 중 오류가 발생했습니다.',
      code: 'ORDER_CANCEL_ERROR'
    })
  }
})

/**
 * 주문 조회 헬퍼 함수
 */
async function getOrderById(orderId) {
  const sql = `
    SELECT
      id, order_number, table_number, customer_name, customer_phone,
      total_amount, status, payment_status, payment_key, payment_method,
      paid_at, notes, created_at, updated_at
    FROM orders
    WHERE id = ?
  `

  const [order] = await db.query(sql, [orderId])

  if (order) {
    order.items = await getOrderItems(orderId)
  }

  return order
}

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
