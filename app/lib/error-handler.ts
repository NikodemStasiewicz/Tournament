/**
 * Global error handler middleware
 */

import { NextRequest, NextResponse } from 'next/server';
import { errorResponse } from './api-response';
import { handleApiError } from './errors';

export interface ErrorHandlerOptions {
  logErrors?: boolean;
  includeStackTrace?: boolean;
}

// Global error handler wrapper for API routes
export function withErrorHandler<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>,
  options: ErrorHandlerOptions = {}
) {
  const { logErrors = true, includeStackTrace = false } = options;

  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      if (logErrors) {
        console.error('API Error:', error);

        // Log additional context in development
        if (process.env.NODE_ENV === 'development' && includeStackTrace) {
          console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
        }
      }

      const { error: apiError, statusCode } = handleApiError(error);
      return errorResponse(apiError, statusCode);
    }
  };
}

// Higher-order component for route handlers
export function createApiHandler<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>,
  options: ErrorHandlerOptions & {
    rateLimit?: any; // Rate limit options would go here
  } = {}
) {
  const wrappedHandler = withErrorHandler(handler, options);

  return async (...args: T): Promise<NextResponse> => {
    // Add any additional middleware here (rate limiting, logging, etc.)

    return wrappedHandler(...args);
  };
}

// Utility to handle Prisma errors specifically
export function handlePrismaError(error: any): { code: string; message: string; statusCode: number } {
  // Handle specific Prisma error codes
  if (error?.code) {
    switch (error.code) {
      case 'P2002':
        return {
          code: 'DUPLICATE_ENTRY',
          message: 'A record with this value already exists',
          statusCode: 409
        };

      case 'P2025':
        return {
          code: 'NOT_FOUND',
          message: 'Record not found',
          statusCode: 404
        };

      case 'P2003':
        return {
          code: 'FOREIGN_KEY_ERROR',
          message: 'Related record not found',
          statusCode: 400
        };

      default:
        console.error('Unhandled Prisma error:', error);
        return {
          code: 'DATABASE_ERROR',
          message: 'Database operation failed',
          statusCode: 500
        };
    }
  }

  return {
    code: 'DATABASE_ERROR',
    message: 'Database operation failed',
    statusCode: 500
  };
}

// Validation error formatter
export function formatValidationErrors(errors: any[]): string[] {
  return errors.map(error => {
    if (typeof error === 'string') {
      return error;
    }

    if (error?.message) {
      return error.message;
    }

    if (error?.path && error?.message) {
      return `${error.path.join('.')}: ${error.message}`;
    }

    return 'Validation error';
  });
}