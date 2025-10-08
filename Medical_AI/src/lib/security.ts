import { NextRequest } from 'next/server';

/**
 * Simple in-memory rate limiter for API endpoints
 */
class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Check if request is allowed
   */
  isAllowed(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const record = this.requests.get(identifier);

    if (!record || now > record.resetTime) {
      // New window or first request
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: now + this.windowMs
      };
    }

    if (record.count >= this.maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime
      };
    }

    // Increment and allow
    record.count++;
    this.requests.set(identifier, record);

    return {
      allowed: true,
      remaining: this.maxRequests - record.count,
      resetTime: record.resetTime
    };
  }

  /**
   * Cleanup expired entries
   */
  cleanup(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }
}

// Create rate limiter instances
export const chatRateLimiter = new RateLimiter(50, 15 * 60 * 1000); // 50 requests per 15 minutes
export const bookingRateLimiter = new RateLimiter(10, 60 * 60 * 1000); // 10 bookings per hour
export const generalRateLimiter = new RateLimiter(100, 15 * 60 * 1000); // 100 requests per 15 minutes

/**
 * Get client identifier for rate limiting
 */
export function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP through headers (for production behind proxy)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }

  // Fallback to connection info or unknown
  return 'unknown-client';
}

/**
 * Validate request payload
 */
export function validateRequestPayload(payload: any, requiredFields: string[]): string | null {
  if (!payload || typeof payload !== 'object') {
    return 'Invalid request payload';
  }

  for (const field of requiredFields) {
    if (!(field in payload)) {
      return `Missing required field: ${field}`;
    }

    const value = payload[field];
    if (value === null || value === undefined || value === '') {
      return `Field ${field} cannot be empty`;
    }
  }

  return null;
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .substring(0, 2000) // Limit length
    .replace(/[<>]/g, '') // Remove potential HTML
    .replace(/javascript:/gi, ''); // Remove javascript: urls
}

/**
 * Validate session ID format
 */
export function isValidSessionId(sessionId: string): boolean {
  if (!sessionId || typeof sessionId !== 'string') return false;
  
  // Check if it matches nanoid format (URL-safe characters, specific length)
  return /^[A-Za-z0-9_-]+$/.test(sessionId) && sessionId.length >= 10 && sessionId.length <= 30;
}

/**
 * Create standardized error responses
 */
export function createErrorResponse(message: string, status: number = 400) {
  return {
    error: message,
    timestamp: new Date().toISOString(),
    status
  };
}

/**
 * Create success response with metadata
 */
export function createSuccessResponse(data: any, message?: string) {
  return {
    ...data,
    success: true,
    timestamp: new Date().toISOString(),
    ...(message && { message })
  };
}

/**
 * Check if content contains potentially harmful patterns
 */
export function containsHarmfulContent(content: string): boolean {
  const harmfulPatterns = [
    /script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload/i,
    /onerror/i,
    /onclick/i,
    /<iframe/i,
    /<embed/i,
    /<object/i
  ];

  return harmfulPatterns.some(pattern => pattern.test(content));
}

/**
 * Medical content safety validator
 */
export function validateMedicalContent(content: string): { safe: boolean; reason?: string } {
  const unsafePatterns = [
    /suicide/i,
    /kill myself/i,
    /end my life/i,
    /want to die/i,
    /self harm/i,
    /cutting myself/i
  ];

  for (const pattern of unsafePatterns) {
    if (pattern.test(content)) {
      return {
        safe: false,
        reason: 'Content contains potentially harmful mental health indicators'
      };
    }
  }

  return { safe: true };
}

// Cleanup task - run periodically to clean up rate limiter
setInterval(() => {
  chatRateLimiter.cleanup();
  bookingRateLimiter.cleanup();
  generalRateLimiter.cleanup();
}, 5 * 60 * 1000); // Every 5 minutes