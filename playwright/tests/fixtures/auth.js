import { test as base, expect } from '@playwright/test';

/**
 * Login helper function - can be called in any test
 * @param {import('@playwright/test').Page} page
 * @param {string} email
 * @param {string} password
 */
export async function login(page, email, password) {
  const loginButton = page.locator('button[data-type="login"]').first();
  if ((await loginButton.count()) === 0) {
    throw new Error('Login button not found on page');
  }

  await loginButton.click();
  const modal = page.locator('.fixed.inset-0.z-\\[1000\\]');
  await expect(modal).toBeVisible();

  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);

  await page.locator('button[type="submit"]').click();
  await page.waitForURL(/.*dashboard.*/, { timeout: 30_000, waitUntil: 'domcontentloaded' });
}

/**
 * Extended test fixture with authenticated user
 * Usage: import { test } from './fixtures/auth' instead of '@playwright/test'
 */
export const test = base.extend({
  // Add an authenticatedPage fixture that logs in before each test
  authenticatedPage: async ({ page }, callback) => {
    await page.goto('/');

    const email = process.env.TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.TEST_USER_PASSWORD || 'testpassword';

    await login(page, email, password);

    await callback(page);
  },
});

export { expect };
