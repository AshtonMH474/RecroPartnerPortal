import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { setCookie } from 'cookies-next';
import { withCsrfProtection } from '@/lib/csrfMiddleware';
import { withRateLimit } from '@/lib/rateLimit';
import { sanitizeLoginData } from '@/lib/sanitize';

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    // Validate and sanitize input
    const result = sanitizeLoginData(req.body);
    if (!result.valid) {
      return res.status(400).json({ error: result.error });
    }

    const { email, password } = result.data;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);

    const user = await db.collection('users').findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.verified) return res.status(403).json({ error: 'Email not verified' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    // Generate short-lived access token (1 hour)
    const accessToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Generate long-lived refresh token (30 days)
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_REFRESH_SECRET, // different secret!
      { expiresIn: '30d' }
    );

    // Store both tokens in cookies
    setCookie('token', accessToken, {
      req,
      res,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // change to true in production
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    setCookie('refresh_token', refreshToken, {
      req,
      res,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // change to true in production
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    res.status(200).json({ ok: true, redirect: '/dashboard' });
  } catch {
    console.error('Login error');
    res.status(500).json({ error: 'Login Error' });
  }
}

export default withRateLimit(withCsrfProtection(handler), {
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many form submissions. Please wait a minute before trying again.',
});
