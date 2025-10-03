const fs = require('fs');
const db = require('./connection');

async function initDatabase() {
  try {
    const sql = fs.readFileSync('./server/database/schema.sql', 'utf8');
    const statements = sql.split(';').filter(s => s.trim() && !s.trim().startsWith('--'));

    console.log('⏳ 스키마 생성 중...');

    for (const stmt of statements) {
      if (stmt.trim()) {
        try {
          await db.query(stmt);
        } catch (e) {
          if (!e.message.includes('Duplicate entry')) {
            console.error('Error:', e.message);
          }
        }
      }
    }

    console.log('✅ 스키마 생성 완료\n');

    const tables = await db.query('SHOW TABLES');
    console.log('📋 생성된 테이블:');

    for (const table of tables) {
      const name = Object.values(table)[0];
      const result = await db.query(`SELECT COUNT(*) as cnt FROM ${name}`);
      console.log(`  - ${name}: ${result[0].cnt}개`);
    }

    await db.pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ 데이터베이스 초기화 실패:', error);
    process.exit(1);
  }
}

initDatabase();
