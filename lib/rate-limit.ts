/**
 * Simple in-memory rate limiter for API endpoints
 * For production, use a service like Upstash or Redis
 */

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number }
}

const store: RateLimitStore = {}

export function rateLimit(
  identifier: string,
  limit = 10,
  windowMs: number = 60 * 1000, // 1 minute
): { success: boolean; remaining: number } {
  const now = Date.now()
  const key = `${identifier}:${Math.floor(now / windowMs)}`

  if (!store[key]) {
    store[key] = { count: 0, resetTime: now + windowMs }
  }

  const record = store[key]

  if (now > record.resetTime) {
    record.count = 0
    record.resetTime = now + windowMs
  }

  record.count++

  return {
    success: record.count <= limit,
    remaining: Math.max(0, limit - record.count),
  }
}

// Clean up old records every hour
setInterval(
  () => {
    const now = Date.now()
    Object.keys(store).forEach((key) => {
      if (store[key].resetTime < now) {
        delete store[key]
      }
    })
  },
  60 * 60 * 1000,
)
