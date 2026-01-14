import { test, expect } from '@playwright/test';
import { login } from './fixtures/auth';

// Test credentials - in real scenario, use environment variables
const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'testpassword';

test.describe('Login functionality', () => {

    test('should login successfully with valid credentials', async ({ page }) => {
        await page.goto('/');

        await login(page, TEST_EMAIL, TEST_PASSWORD);

        await expect(page).toHaveURL(/.*dashboard/);
    });

    test('should show error with invalid credentials', async ({ page }) => {
        await page.goto('/');

        const loginButton = page.locator('button[data-type="login"]').first();
        if ((await loginButton.count()) === 0) {
            test.skip(true, 'Login button not present');
        }

        await loginButton.click();

        const modal = page.locator('.fixed.inset-0.z-\\[1000\\]');
        await expect(modal).toBeVisible();

        // Fill invalid credentials
        await page.locator('input[name="email"]').fill('invalid@example.com');
        await page.locator('input[name="password"]').fill('wrongpassword');

        await page.locator('button[type="submit"]').click();
        await expect(page.locator('.text-red-600')).toBeVisible();
    });

    test('should show error with empty fields', async ({ page }) => {
        await page.goto('/');

        const loginButton = page.locator('button[data-type="login"]').first();
        if ((await loginButton.count()) === 0) {
            test.skip(true, 'Login button not present');
        }

        await loginButton.click();

        const modal = page.locator('.fixed.inset-0.z-\\[1000\\]');
        await expect(modal).toBeVisible();

        const submitButton = page.locator('button[type="submit"]');
        await expect(submitButton).toHaveClass(/cursor-not-allowed/);
    });

    test('should navigate to forgot password modal', async ({ page }) => {
        await page.goto('/');

        const loginButton = page.locator('button[data-type="login"]').first();
        if ((await loginButton.count()) === 0) {
            test.skip(true, 'Login button not present');
        }

        await loginButton.click();

        const modal = page.locator('.fixed.inset-0.z-\\[1000\\]');
        await expect(modal).toBeVisible();

        await page.locator('button').filter({ hasText: /^Forgot Password\?$/i }).click();
        await expect(page.locator('button[type="submit"]').filter({ hasText: /^Reset Password$/i })).toBeVisible();});
});
