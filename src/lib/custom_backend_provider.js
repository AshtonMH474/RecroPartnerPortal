import { JwksClient } from 'jwks-rsa';
import jwt from 'jsonwebtoken';

const client = new JwksClient({
  jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err || !key) {
      console.error('[Auth] Failed to get signing key:', err);
      return callback(err);
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

export const CustomBackendAuth = () => {
  return {
    name: 'google-auth', // optional but helpful for debugging Tina auth

    isAuthorized: async (req) => {
      const authHeader = req.headers.authorization;
      const token = authHeader?.replace('Bearer ', '');
      if (!token) {
        console.warn('[Auth] No token provided');
        return {
          isAuthorized: false,
          errorMessage: 'No token provided',
          errorCode: 401,
        };
      }

      try {
        const decoded = await new Promise((resolve, reject) => {
          jwt.verify(token, getKey, { algorithms: ['RS256'] }, async (err, decoded) => {
            if (err) {
              console.error('[Auth] JWT verification failed:', err);

              reject(err);
            } else {
              resolve(decoded);
            }
          });
        });

        // Optional: restrict by domain/email here if needed

        if (!decoded.email || !decoded.email.endsWith('@recro.com')) {
          console.warn('[Auth] Unauthorized email domain:', decoded.email);
          return {
            isAuthorized: false,
            errorMessage: 'Email domain not allowed',
            errorCode: 403,
          };
        }

        return {
          isAuthorized: true,
          user: {
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name,
          },
        };
      } catch {
        return {
          isAuthorized: false,
          errorMessage: 'Invalid token',
          errorCode: 401,
        };
      }
    },
  };
};
