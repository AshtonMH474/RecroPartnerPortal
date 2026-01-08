/**
 * Simple in-memory rate limiter for API routes
 * For production with multiple servers, use Redis instead
 */

const rateLimitStore = new Map();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.windowStart > data.windowMs) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Get client IP from request
 */
function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || req.connection?.remoteAddress || 'unknown';
}

/**
 * Rate limit configuration options
 * @typedef {Object} RateLimitOptions
 * @property {number} windowMs - Time window in milliseconds
 * @property {number} max - Maximum requests per window
 * @property {string} [message] - Error message when rate limited
 */

/**
 * Creates a rate limiter middleware
 * @param {RateLimitOptions} options
 * @returns {Function} Middleware function
 */
export function rateLimit(options = {}) {
  const {
    windowMs = 60 * 1000, // 1 minute default
    max = 10, // 10 requests per window default
    message = 'Too many requests, please try again later.'
  } = options;

  return (req, res) => {
    const ip = getClientIp(req);
    const key = `${ip}:${req.url}`;
    const now = Date.now();

    let record = rateLimitStore.get(key);

    if (!record || now - record.windowStart > windowMs) {
      // Start new window
      record = {
        count: 1,
        windowStart: now,
        windowMs
      };
      rateLimitStore.set(key, record);
      return { allowed: true, remaining: max - 1 };
    }

    record.count++;

    if (record.count > max) {
      const retryAfter = Math.ceil((record.windowStart + windowMs - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        retryAfter,
        message
      };
    }

    return { allowed: true, remaining: max - record.count };
  };
}

/**
 * Higher-order function to wrap API handlers with rate limiting
 * @param {Function} handler - The API handler function
 * @param {RateLimitOptions} options - Rate limit options
 * @returns {Function} Wrapped handler
 */
export function withRateLimit(handler, options = {}) {
  const limiter = rateLimit(options);

  return async (req, res) => {
    const result = limiter(req, res);

    // Set rate limit headers
    res.setHeader('X-RateLimit-Remaining', result.remaining);

    if (!result.allowed) {
      res.setHeader('Retry-After', result.retryAfter);
      return res.status(429).json({ error: result.message });
    }

    return handler(req, res);
  };
}
