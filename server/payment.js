const express = require('express')
const got = require('got')
const router = express.Router()

// 환경변수에서 시크릿 키 가져오기
const secretKey = process.env.TOSSPAYMENT_SECRET_KEY

if (!secretKey) {
  console.error('TOSSPAYMENT_SECRET_KEY 환경변수가 설정되지 않았습니다.')
  process.exit(1)
}

/**
 * 결제 승인 API
 * POST /api/payments/confirm
 *
 * PAYMENT_SAMPLE_ANALYSIS.md 분석 결과를 기반으로 구현
 * 토스페이먼츠 결제 승인 API 호출
 */
router.post('/confirm', async (req, res) => {
  try {
    const { paymentKey, orderId, amount } = req.body

    // 필수 파라미터 검증
    if (!paymentKey || !orderId || !amount) {
      return res.status(400).json({
        success: false,
        error: '필수 파라미터가 누락되었습니다.',
        code: 'MISSING_PARAMETERS'
      })
    }

    // 금액 검증 (숫자 타입 확인)
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: '올바르지 않은 결제 금액입니다.',
        code: 'INVALID_AMOUNT'
      })
    }

    // 토스페이먼츠 API 인증 헤더 생성
    // Basic Authentication: base64(secretKey:)
    const encryptedSecretKey = 'Basic ' + Buffer.from(secretKey + ':').toString('base64')

    console.log('결제 승인 요청:', { paymentKey, orderId, amount })

    // 토스페이먼츠 결제 승인 API 호출
    const response = await got.post('https://api.tosspayments.com/v1/payments/confirm', {
      headers: {
        'Authorization': encryptedSecretKey,
        'Content-Type': 'application/json',
      },
      json: {
        orderId: orderId,
        amount: amount,
        paymentKey: paymentKey,
      },
      responseType: 'json',
    })

    // 성공 응답
    console.log('결제 승인 성공:', response.body)

    // TODO: 여기에 비즈니스 로직 추가
    // - 주문 정보 데이터베이스 저장
    // - 재고 차감
    // - 주문 상태 업데이트
    // - 알림 발송 등

    res.status(200).json({
      success: true,
      data: response.body,
      message: '결제가 정상적으로 승인되었습니다.'
    })

  } catch (error) {
    console.error('결제 승인 실패:', error)

    // 토스페이먼츠 API 오류 처리
    if (error.response && error.response.body) {
      const errorBody = error.response.body

      return res.status(error.response.statusCode || 500).json({
        success: false,
        error: errorBody.message || '결제 승인에 실패했습니다.',
        code: errorBody.code || 'PAYMENT_CONFIRM_FAILED',
        data: errorBody
      })
    }

    // 일반적인 서버 오류
    res.status(500).json({
      success: false,
      error: '서버 내부 오류가 발생했습니다.',
      code: 'INTERNAL_SERVER_ERROR'
    })
  }
})

/**
 * 결제 정보 조회 API
 * GET /api/payments/:paymentKey
 */
router.get('/:paymentKey', async (req, res) => {
  try {
    const { paymentKey } = req.params

    if (!paymentKey) {
      return res.status(400).json({
        success: false,
        error: '결제키가 필요합니다.',
        code: 'MISSING_PAYMENT_KEY'
      })
    }

    const encryptedSecretKey = 'Basic ' + Buffer.from(secretKey + ':').toString('base64')

    // 토스페이먼츠 결제 조회 API 호출
    const response = await got.get(`https://api.tosspayments.com/v1/payments/${paymentKey}`, {
      headers: {
        'Authorization': encryptedSecretKey,
      },
      responseType: 'json',
    })

    res.status(200).json({
      success: true,
      data: response.body
    })

  } catch (error) {
    console.error('결제 정보 조회 실패:', error)

    if (error.response && error.response.body) {
      const errorBody = error.response.body

      return res.status(error.response.statusCode || 500).json({
        success: false,
        error: errorBody.message || '결제 정보 조회에 실패했습니다.',
        code: errorBody.code || 'PAYMENT_INQUIRY_FAILED'
      })
    }

    res.status(500).json({
      success: false,
      error: '서버 내부 오류가 발생했습니다.',
      code: 'INTERNAL_SERVER_ERROR'
    })
  }
})

/**
 * 결제 취소 API
 * POST /api/payments/:paymentKey/cancel
 */
router.post('/:paymentKey/cancel', async (req, res) => {
  try {
    const { paymentKey } = req.params
    const { cancelReason } = req.body

    if (!paymentKey) {
      return res.status(400).json({
        success: false,
        error: '결제키가 필요합니다.',
        code: 'MISSING_PAYMENT_KEY'
      })
    }

    const encryptedSecretKey = 'Basic ' + Buffer.from(secretKey + ':').toString('base64')

    // 토스페이먼츠 결제 취소 API 호출
    const response = await got.post(`https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`, {
      headers: {
        'Authorization': encryptedSecretKey,
        'Content-Type': 'application/json',
      },
      json: {
        cancelReason: cancelReason || '고객 요청'
      },
      responseType: 'json',
    })

    console.log('결제 취소 완료:', response.body)

    // TODO: 취소 후 비즈니스 로직
    // - 주문 상태 변경
    // - 재고 복원
    // - 고객 알림 등

    res.status(200).json({
      success: true,
      data: response.body,
      message: '결제가 성공적으로 취소되었습니다.'
    })

  } catch (error) {
    console.error('결제 취소 실패:', error)

    if (error.response && error.response.body) {
      const errorBody = error.response.body

      return res.status(error.response.statusCode || 500).json({
        success: false,
        error: errorBody.message || '결제 취소에 실패했습니다.',
        code: errorBody.code || 'PAYMENT_CANCEL_FAILED'
      })
    }

    res.status(500).json({
      success: false,
      error: '서버 내부 오류가 발생했습니다.',
      code: 'INTERNAL_SERVER_ERROR'
    })
  }
})

module.exports = router