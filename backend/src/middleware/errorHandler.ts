import { Request, Response, NextFunction } from 'express'
import { ApiException } from '../types'

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(`Error: ${error.message}`)
  console.error(`Stack: ${error.stack}`)

  // Handle custom API exceptions
  if (error instanceof ApiException) {
    res.status(error.status).json({
      success: false,
      error: error.code,
      message: error.message,
      details: error.details
    })
    return
  }

  // Handle Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any

    switch (prismaError.code) {
      case 'P2002':
        res.status(409).json({
          success: false,
          error: 'DUPLICATE_ENTRY',
          message: 'A record with this information already exists'
        })
        return

      case 'P2025':
        res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'The requested record was not found'
        })
        return

      default:
        res.status(400).json({
          success: false,
          error: 'DATABASE_ERROR',
          message: 'A database error occurred'
        })
        return
    }
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: error.message
    })
    return
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Invalid authentication token'
    })
    return
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: 'TOKEN_EXPIRED',
      message: 'Authentication token has expired'
    })
    return
  }

  // Default error
  res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'production'
      ? 'An internal server error occurred'
      : error.message
  })
}

// 404 handler
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`
  })
}