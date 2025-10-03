import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

export const config = {
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || '3001'),
    env: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:8080'
  },

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/study_ontable'
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
  },

  // File Upload
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
    uploadDir: process.env.UPLOAD_DIR || 'uploads'
  },

  // TossPayments (Phase 2에서 사용)
  tossPayments: {
    secretKey: process.env.TOSS_PAYMENTS_SECRET_KEY || '',
    clientKey: process.env.TOSS_PAYMENTS_CLIENT_KEY || ''
  }
}

// Validate required environment variables
export function validateConfig(): void {
  const required = [
    'DATABASE_URL',
    'JWT_SECRET'
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`)
    console.error('Please check your .env file')
    process.exit(1)
  }

  console.log('✅ Configuration validated successfully')
}