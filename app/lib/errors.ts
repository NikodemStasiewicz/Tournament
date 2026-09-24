/**
 * Structured error handling utilities
 */

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export class AppError extends Error {
  public code: string;
  public statusCode: number;
  public details?: any;

  constructor(code: string, message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Common error codes and messages
export const ErrorCodes = {
  // Authentication
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',

  // Resource
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  FORBIDDEN: 'FORBIDDEN',

  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
} as const;

export function createErrorResponse(error: AppError | Error): ApiError {
  if (error instanceof AppError) {
    return {
      code: error.code,
      message: error.message,
      details: error.details
    };
  }

  // Handle generic errors
  console.error('Unhandled error:', error);
  return {
    code: ErrorCodes.INTERNAL_ERROR,
    message: 'An unexpected error occurred'
  };
}

export function handleApiError(error: unknown): { error: ApiError; statusCode: number } {
  if (error instanceof AppError) {
    return {
      error: createErrorResponse(error),
      statusCode: error.statusCode
    };
  }

  if (error instanceof Error) {
    console.error('API Error:', error);
    return {
      error: {
        code: ErrorCodes.INTERNAL_ERROR,
        message: 'An unexpected error occurred'
      },
      statusCode: 500
    };
  }

  console.error('Unknown error type:', error);
  return {
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      message: 'An unexpected error occurred'
    },
    statusCode: 500
  };
}