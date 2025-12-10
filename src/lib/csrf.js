/**
 * Client-Side CSRF Token Management
 *
 * Handles fetching and including CSRF tokens in requests.
 */

let cachedToken = null;

/**
 * Fetch CSRF token from the server
 *
 * @returns {Promise<string>} - CSRF token
 */
export async function getCsrfToken() {
  // Return cached token if available
  if (cachedToken) {
    return cachedToken;
  }

  try {
    const res = await fetch('/api/csrf-token', {
      credentials: 'include', // Send cookies
    });

    if (!res.ok) {
      throw new Error('Failed to fetch CSRF token');
    }

    const data = await res.json();
    cachedToken = data.csrfToken;
    return cachedToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
}

/**
 * Clear cached CSRF token (e.g., after logout)
 */
export function clearCsrfToken() {
  cachedToken = null;
}

/**
 * Enhanced fetch with automatic CSRF token inclusion
 *
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} - Fetch response
 *
 * @example
 * import { fetchWithCsrf } from '@/lib/csrf';
 *
 * const response = await fetchWithCsrf('/api/hubspot/post-ticket', {
 *   method: 'POST',
 *   body: JSON.stringify({ deal }),
 * });
 */
export async function fetchWithCsrf(url, options = {}) {
  const method = options.method?.toUpperCase() || 'GET';
  const statefulMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];

  // Only add CSRF token for state-changing requests
  if (statefulMethods.includes(method)) {
    const token = await getCsrfToken();

    options.headers = {
      ...options.headers,
      'X-CSRF-Token': token,
    };
  }

  // Always include credentials for cookies
  options.credentials = options.credentials || 'include';

  return fetch(url, options);
}
