import { doubleCsrf } from 'csrf-csrf';
import { serialize, parse } from 'cookie';

const secret = process.env.CSRF_SECRET;

const { generateCsrfToken: generateToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => secret,
  getSessionIdentifier: () => '',
  cookieName: '__csrf',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  },
  getTokenFromRequest: (req) => req.headers['x-csrf-token'],
});

/**
 * Add Express-style res.cookie() to Next.js response
 */
function addCookieMethod(res) {
  if (!res.cookie) {
    res.cookie = (name, value, options = {}) => {
      const cookieStr = serialize(name, value, options);
      const existing = res.getHeader('Set-Cookie') || [];
      const cookies = Array.isArray(existing) ? existing : [existing];
      res.setHeader('Set-Cookie', [...cookies, cookieStr]);
    };
  }
}

/**
 * Parse cookies from request
 */
function parseCookies(req) {
  if (!req.cookies) {
    req.cookies = parse(req.headers.cookie || '');
  }
}

/**
 * CSRF Protection Middleware
 *
 * Wraps API routes to validate CSRF tokens on state-changing requests.
 *
 * @param {Function} handler - The API route handler to protect
 * @returns {Function} - Wrapped handler with CSRF validation
 */
export function withCsrfProtection(handler) {
  return async (req, res) => {
    addCookieMethod(res);
    parseCookies(req);

    const statefulMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];

    if (!statefulMethods.includes(req.method)) {
      return handler(req, res);
    }

    return new Promise((resolve) => {
      doubleCsrfProtection(req, res, (err) => {
        if (err) {
          console.error('CSRF validation failed:', err.message);
          resolve(
            res.status(403).json({
              error: 'CSRF token validation failed',
              message: 'Invalid or missing CSRF token',
            })
          );
        } else {
          resolve(handler(req, res));
        }
      });
    });
  };
}

/**
 * Generate CSRF Token for Forms
 *
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {string} - CSRF token
 */
export function generateCsrfToken(req, res) {
  addCookieMethod(res);
  parseCookies(req);
  return generateToken(req, res);
}
