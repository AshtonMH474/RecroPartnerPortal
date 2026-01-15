import csrf from 'csurf';

// Initialize CSRF protection with cookie-based tokens
const csrfProtection = csrf({
  cookie: {
    httpOnly: true, 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  }
});

/**
 * CSRF Protection Middleware
 *
 * Wraps API routes to validate CSRF tokens on state-changing requests.
 *
 * @param {Function} handler - The API route handler to protect
 * @returns {Function} - Wrapped handler with CSRF validation
 *
 * @example
 * import { withCsrfProtection } from '@/lib/csrfMiddleware';
 *
 * export default withCsrfProtection(async function handler(req, res) {
 *   // CSRF token has been validated at this point
 *   // Your route logic here
 * });
 */
export function withCsrfProtection(handler) {
  return async (req, res) => {
    // Only validate CSRF for state-changing methods
    const statefulMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];

    if (!statefulMethods.includes(req.method)) {
      // GET, HEAD, OPTIONS don't need CSRF protection
      return handler(req, res);
    }

    // Apply CSRF protection with Promise wrapper
    return new Promise((resolve) => {
      csrfProtection(req, res, async (err) => {
        if (err) {
          console.error('CSRF validation failed:', err.message);
          res.status(403).json({
            error: 'CSRF token validation failed',
            message: 'Invalid or missing CSRF token'
          });
          return resolve();
        }

        // CSRF token is valid, proceed to handler
        await handler(req, res);
        resolve();
      });
    });
  };
}

/**
 * Generate CSRF Token for Forms
 *
 * Use this in API routes that need to generate a token.
 *
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Promise<string>} - CSRF token
 */
export function generateCsrfToken(req, res) {
  return new Promise((resolve, reject) => {
    csrfProtection(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(req.csrfToken());
      }
    });
  });
}
