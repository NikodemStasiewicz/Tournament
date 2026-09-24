/**
 * Standardized API response utilities
 */

import { NextResponse } from 'next/server';
import { ApiError, handleApiError } from './errors';

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// Success responses
export function successResponse<T = any>(
  data: T,
  message?: string,
  statusCode: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message })
    },
    { status: statusCode }
  );
}

export function createdResponse<T = any>(
  data: T,
  message: string = 'Resource created successfully'
): NextResponse<ApiSuccessResponse<T>> {
  return successResponse(data, message, 201);
}

export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

// Error responses
export function errorResponse(
  error: ApiError,
  statusCode: number = 500
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error
    },
    { status: statusCode }
  );
}

export function badRequestResponse(
  message: string,
  code: string = 'BAD_REQUEST',
  details?: any
): NextResponse<ApiErrorResponse> {
  return errorResponse(
    {
      code,
      message,
      details
    },
    400
  );
}

export function unauthorizedResponse(
  message: string = 'Authentication required'
): NextResponse<ApiErrorResponse> {
  return errorResponse(
    {
      code: 'UNAUTHORIZED',
      message
    },
    401
  );
}

export function forbiddenResponse(
  message: string = 'Access denied'
): NextResponse<ApiErrorResponse> {
  return errorResponse(
    {
      code: 'FORBIDDEN',
      message
    },
    403
  );
}

export function notFoundResponse(
  message: string = 'Resource not found'
): NextResponse<ApiErrorResponse> {
  return errorResponse(
    {
      code: 'NOT_FOUND',
      message
    },
    404
  );
}

export function conflictResponse(
  message: string,
  code: string = 'CONFLICT'
): NextResponse<ApiErrorResponse> {
  return errorResponse(
    {
      code,
      message
    },
    409
  );
}

export function validationErrorResponse(
  errors: string[]
): NextResponse<ApiErrorResponse> {
  return errorResponse(
    {
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: { errors }
    },
    400
  );
}

// Wrapper for API route handlers
export async function withApiHandler<T = any>(
  handler: () => Promise<NextResponse<ApiResponse<T>>>
): Promise<NextResponse<ApiResponse<T>>> {
  try {
    return await handler();
  } catch (error) {
    const { error: apiError, statusCode } = handleApiError(error);
    return errorResponse(apiError, statusCode);
  }
}

// Pagination response helper
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): NextResponse<ApiSuccessResponse<PaginatedResponse<T>>> {
  const pages = Math.ceil(total / limit);

  return successResponse({
    data,
    pagination: {
      page,
      limit,
      total,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1
    }
  });
}