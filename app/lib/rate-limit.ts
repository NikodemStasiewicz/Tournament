/**
 * Rate limiting utilities
 */

import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store for rate limiting
// In production, consider using Redis or another persistent store
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface RateLimitResult {
  limited: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

export function getRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    const resetTime = now + options.windowMs;
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime
    });

    return {
      limited: false,
      remaining: options.maxRequests - 1,
      resetTime
    };
  }

  if (entry.count >= options.maxRequests) {
    return {
      limited: true,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000)
    };
  }

  // Increment counter
  entry.count++;
  rateLimitStore.set(identifier, entry);

  return {
    limited: false,
    remaining: options.maxRequests - entry.count,
    resetTime: entry.resetTime
  };
}

export function getClientIP(request: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const clientIP = request.headers.get('x-client-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  if (clientIP) {
    return clientIP;
  }

  // Fallback to a default identifier
  return 'unknown';
}

export function createRateLimitMiddleware(options: RateLimitOptions) {
  return async function rateLimitMiddleware(
    request: NextRequest,
    handler: () => Promise<NextResponse>
  ): Promise<NextResponse> {
    const identifier = getClientIP(request);
    const result = getRateLimit(identifier, options);

    if (result.limited) {
      const response = NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests, please try again later'
          }
        },
        {
          status: 429,
          headers: {
            'Retry-After': result.retryAfter?.toString() || '60'
          }
        }
      );

      return response;
    }

    const response = await handler();

    // Add rate limit headers to successful responses
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.resetTime.toString());

    return response;
  };
}

// Predefined rate limit configurations
export const rateLimits = {
  // Strict limits for auth endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5
  },

  // General API limits
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60
  },

  // File upload limits
  upload: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10
  }
} as const;