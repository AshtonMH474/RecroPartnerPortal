import csrf from 'csurf';

// Initialize CSRF protection with cookie-based tokens
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  }
});

/**
 * GET /api/csrf-token
 *
 * Returns a CSRF token for the client to use in subsequent requests.
 * The client should include this token in the X-CSRF-Token header
 * for all state-changing requests (POST, PUT, DELETE).
 */
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  csrfProtection(req, res, (err) => {
    if (err) {
      console.error('CSRF token generation error:', err);
      return res.status(500).json({ error: 'Failed to generate CSRF token' });
    }

    // Generate and return the token
    const token = req.csrfToken();

    res.status(200).json({
      csrfToken: token,
      message: 'CSRF token generated successfully'
    });
  });
}
