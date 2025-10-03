const mysql = require('mysql2/promise')
require('dotenv').config()

// MySQL 연결 풀 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'study_ontable',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  charset: 'utf8mb4'
})

// 데이터베이스 연결 테스트
async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log('✅ MySQL 데이터베이스 연결 성공')
    console.log(`📊 Database: ${process.env.DB_NAME}`)
    console.log(`🔌 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`)

    // 연결 정보 확인
    const [rows] = await connection.query('SELECT DATABASE() as db, VERSION() as version')
    console.log(`📌 Current DB: ${rows[0].db}`)
    console.log(`🔖 MySQL Version: ${rows[0].version}`)

    connection.release()
    return true
  } catch (error) {
    console.error('❌ MySQL 데이터베이스 연결 실패:', error.message)
    console.error('🔍 연결 정보:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    })
    return false
  }
}

// 쿼리 헬퍼 함수
async function query(sql, params) {
  try {
    const [rows] = await pool.execute(sql, params)
    return rows
  } catch (error) {
    console.error('Query Error:', error.message)
    console.error('SQL:', sql)
    console.error('Params:', params)
    throw error
  }
}

// 트랜잭션 헬퍼
async function transaction(callback) {
  const connection = await pool.getConnection()
  await connection.beginTransaction()

  try {
    const result = await callback(connection)
    await connection.commit()
    connection.release()
    return result
  } catch (error) {
    await connection.rollback()
    connection.release()
    throw error
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔌 MySQL 연결 풀 종료 중...')
  await pool.end()
  console.log('✅ MySQL 연결 풀 종료 완료')
  process.exit(0)
})

module.exports = {
  pool,
  query,
  transaction,
  testConnection
}
