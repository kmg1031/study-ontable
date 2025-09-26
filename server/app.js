const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

// 미들웨어 설정
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 정적 파일 서빙 (Vue 빌드 결과물)
app.use(express.static(path.join(__dirname, '../dist')))

// API 라우터
const paymentRouter = require('./payment')
app.use('/api/payments', paymentRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Study OnTable API Server is running'
  })
})

// Vue SPA를 위한 히스토리 라우터 지원
app.use((req, res, next) => {
  // API 요청이 아닌 경우 index.html 반환
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  } else {
    next()
  }
})

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error('서버 오류:', err)
  res.status(500).json({
    success: false,
    error: '서버 내부 오류가 발생했습니다.',
    code: 'INTERNAL_SERVER_ERROR'
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Study OnTable API Server is running on port ${PORT}`)
  console.log(`📱 Frontend: http://localhost:${PORT}`)
  console.log(`🔌 API Endpoint: http://localhost:${PORT}/api`)
  console.log(`💳 Payment API: http://localhost:${PORT}/api/payments`)
})

module.exports = app