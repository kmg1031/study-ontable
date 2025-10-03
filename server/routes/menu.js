const express = require('express')
const router = express.Router()
const db = require('../database/connection')

/**
 * 메뉴 목록 조회 API
 * GET /api/menu
 *
 * Query Parameters:
 * - category: 카테고리 필터
 * - search: 검색어
 * - page: 페이지 번호 (기본값: 1)
 * - limit: 페이지 크기 (기본값: 20)
 * - isAvailable: 판매 가능 여부
 */
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20, isAvailable } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)

    // 기본 쿼리
    let sql = `
      SELECT
        mi.id,
        mi.name,
        mi.description,
        mi.base_price as price,
        mi.image_url as image,
        mi.is_available as isAvailable,
        c.name as category
      FROM menu_items mi
      JOIN categories c ON mi.category_id = c.id
      WHERE 1=1
    `

    const params = []

    // 카테고리 필터
    if (category && category !== '전체') {
      sql += ' AND c.name = ?'
      params.push(category)
    }

    // 검색어 필터
    if (search) {
      sql += ' AND (mi.name LIKE ? OR mi.description LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    // 판매 가능 여부 필터
    if (isAvailable !== undefined) {
      sql += ' AND mi.is_available = ?'
      params.push(isAvailable === 'true' ? 1 : 0)
    }

    // 정렬 및 페이지네이션
    sql += ' ORDER BY mi.display_order, mi.id LIMIT ? OFFSET ?'
    params.push(parseInt(limit), offset)

    // 메뉴 아이템 조회
    const menuItems = await db.query(sql, params)

    // 전체 개수 조회 (페이지네이션용)
    let countSql = 'SELECT COUNT(*) as total FROM menu_items mi JOIN categories c ON mi.category_id = c.id WHERE 1=1'
    const countParams = []

    if (category && category !== '전체') {
      countSql += ' AND c.name = ?'
      countParams.push(category)
    }

    if (search) {
      countSql += ' AND (mi.name LIKE ? OR mi.description LIKE ?)'
      countParams.push(`%${search}%`, `%${search}%`)
    }

    if (isAvailable !== undefined) {
      countSql += ' AND mi.is_available = ?'
      countParams.push(isAvailable === 'true' ? 1 : 0)
    }

    const [countResult] = await db.query(countSql, countParams)
    const total = countResult.total

    // 각 메뉴 아이템에 대한 옵션 조회
    for (const item of menuItems) {
      const options = await getMenuOptions(item.id)
      item.options = options
    }

    res.json({
      success: true,
      data: menuItems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    })

  } catch (error) {
    console.error('메뉴 목록 조회 오류:', error)
    res.status(500).json({
      success: false,
      error: '메뉴 목록을 불러오는 중 오류가 발생했습니다.',
      code: 'MENU_LIST_ERROR'
    })
  }
})

/**
 * 메뉴 상세 조회 API
 * GET /api/menu/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    // 메뉴 아이템 조회
    const sql = `
      SELECT
        mi.id,
        mi.name,
        mi.description,
        mi.base_price as price,
        mi.image_url as image,
        mi.is_available as isAvailable,
        c.name as category
      FROM menu_items mi
      JOIN categories c ON mi.category_id = c.id
      WHERE mi.id = ?
    `

    const [menuItem] = await db.query(sql, [id])

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        error: '메뉴를 찾을 수 없습니다.',
        code: 'MENU_NOT_FOUND'
      })
    }

    // 옵션 조회
    const options = await getMenuOptions(id)
    menuItem.options = options

    res.json({
      success: true,
      data: menuItem
    })

  } catch (error) {
    console.error('메뉴 상세 조회 오류:', error)
    res.status(500).json({
      success: false,
      error: '메뉴 정보를 불러오는 중 오류가 발생했습니다.',
      code: 'MENU_DETAIL_ERROR'
    })
  }
})

/**
 * 메뉴 옵션 조회 헬퍼 함수
 * @param {number} menuItemId
 * @returns {Object} { sizes: [], extras: [] }
 */
async function getMenuOptions(menuItemId) {
  const options = {}

  // 옵션 그룹 조회
  const groupsSql = `
    SELECT id, name, is_required
    FROM option_groups
    WHERE menu_item_id = ?
    ORDER BY display_order
  `
  const groups = await db.query(groupsSql, [menuItemId])

  for (const group of groups) {
    // 옵션 아이템 조회
    const itemsSql = `
      SELECT name, price
      FROM option_items
      WHERE option_group_id = ?
      ORDER BY display_order
    `
    const items = await db.query(itemsSql, [group.id])

    // 그룹 이름에 따라 분류
    if (group.name === '사이즈') {
      options.sizes = items
    } else if (group.name === '추가 옵션') {
      options.extras = items
    }
  }

  return options
}

/**
 * 카테고리 목록 조회 API
 * GET /api/menu/categories/list
 */
router.get('/categories/list', async (req, res) => {
  try {
    const sql = `
      SELECT id, name
      FROM categories
      ORDER BY display_order
    `

    const categories = await db.query(sql)

    res.json({
      success: true,
      data: ['전체', ...categories.map(c => c.name)]
    })

  } catch (error) {
    console.error('카테고리 조회 오류:', error)
    res.status(500).json({
      success: false,
      error: '카테고리 목록을 불러오는 중 오류가 발생했습니다.',
      code: 'CATEGORY_LIST_ERROR'
    })
  }
})

module.exports = router
