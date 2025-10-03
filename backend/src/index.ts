import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import { config, validateConfig } from './config'
import { connectDatabase } from './config/database'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'

// Routes
import menuRoutes from './routes/menu'
import orderRoutes from './routes/order'
// import tableRoutes from './routes/table'

async function startServer() {
  try {
    // Validate configuration
    validateConfig()

    // Connect to database
    await connectDatabase()

    // Create Express app
    const app = express()

    // Security middleware
    app.use(helmet())

    // CORS configuration
    app.use(cors({
      origin: config.server.corsOrigin,
      credentials: true
    }))

    // Compression middleware
    app.use(compression())

    // Logging middleware
    if (config.server.env === 'development') {
      app.use(morgan('dev'))
    } else {
      app.use(morgan('combined'))
    }

    // Body parsing middleware
    app.use(express.json({ limit: '10mb' }))
    app.use(express.urlencoded({ extended: true, limit: '10mb' }))

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({
        success: true,
        message: 'Study OnTable API is running',
        timestamp: new Date().toISOString(),
        environment: config.server.env
      })
    })

    // API routes
    app.use('/api', (req, res, next) => {
      res.json({
        success: true,
        message: 'Study OnTable API v1',
        endpoints: {
          health: '/health',
          menu: '/api/menu',
          orders: '/api/orders',
          tables: '/api/tables (coming soon)'
        }
      })
    })

    // API routes
    app.use('/api/menu', menuRoutes)
    app.use('/api/orders', orderRoutes)
    // app.use('/api/tables', tableRoutes)

    // Error handling middleware (must be last)
    app.use(notFoundHandler)
    app.use(errorHandler)

    // Start server
    const port = config.server.port
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`)
      console.log(`📝 Health check: http://localhost:${port}/health`)
      console.log(`🔌 API endpoint: http://localhost:${port}/api`)
      console.log(`🌍 Environment: ${config.server.env}`)
    })

  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received, shutting down gracefully...')
  process.exit(0)
})

// Start the server
startServer()