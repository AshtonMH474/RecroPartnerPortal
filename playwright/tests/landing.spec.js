import { test, expect } from "@playwright/test";


test('Check for H1 and H3', async({page}) => {
    await page.goto('/')
     const landingBlock = page.locator('[data-testid="landing-block"]');
    if ((await landingBlock.count()) === 0) {
        test.skip(true, 'Landing block not present on this page');
    }
    await expect(landingBlock.locator('h1')).toBeVisible();
    await expect(landingBlock.locator('h3').first()).toBeVisible();
});

test('Sidebar toggle - click arrow to close and open', async ({ page }) => {
    // Set viewport to large screen (sidebar only shows on lg screens >= 1024px)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const sidebar = page.locator('[data-testid="sidebar"]');
    const toggleButton = page.locator('[data-testid="sidebar-toggle"]');

    // Skip if sidebar is not present on this page
    if ((await sidebar.count()) === 0) {
        test.skip(true, 'Sidebar not present on this page');
    }

    // Sidebar should be open by default on large screens
    await expect(sidebar).toHaveAttribute('data-state', 'open');
    await expect(sidebar).toBeVisible();

    // Click arrow to close sidebar
    await toggleButton.click();
    await expect(sidebar).toHaveAttribute('data-state', 'closed');

    // Click arrow again to open sidebar
    await toggleButton.click();
    await expect(sidebar).toHaveAttribute('data-state', 'open');
    await expect(sidebar).toBeVisible();
});

test('Login modal - opens and closes', async ({ page }) => {
    await page.goto('/');

    // Find login button by data-type attribute (set from TinaCMS button type)
    const loginButton = page.locator('button[data-type="login"]').first();

    if ((await loginButton.count()) === 0) {
        test.skip(true, 'Login button not present (TinaCMS may not have configured it)');
    }

    await loginButton.click();

    const modal = page.locator('.fixed.inset-0.z-\\[1000\\]');
    await expect(modal).toBeVisible();

    // Check login form elements are present
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="button"]').filter({ hasText: /^Forgot Password\?$/i })).toBeVisible();
    await expect (page.locator('button[type="button"]').filter({ hasText: /^Register$/i })).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    const closeButton = page.locator('button[aria-label="Close Modal"]');
    await closeButton.click();

    await expect(modal).not.toBeVisible();
});

test('Register modal - opens and closes', async ({ page }) => {
    await page.goto('/');
    const registerButton = page.locator('button[data-type="register"]').first();
    if ((await registerButton.count()) === 0) {
        test.skip(true, 'Register button not present (TinaCMS may not have configured it)');
    }

    await registerButton.click();
    const modal = page.locator('.fixed.inset-0.z-\\[1000\\]');
    await expect(modal).toBeVisible();

    // Check register form elements are present
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="organization"]')).toBeVisible();
    await expect(page.locator('input[type="tel"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    await expect (page.locator('button[type="button"]').filter({ hasText: /^Login$/i })).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    const closeButton = page.locator('button[aria-label="Close Modal"]');
    await closeButton.click();

    await expect(modal).not.toBeVisible();
});

test('Login modal - can switch to register modal', async ({ page }) => {
    await page.goto('/');

    const loginButton = page.locator('button[data-type="login"]').first();
    if ((await loginButton.count()) === 0) {
        test.skip(true, 'Login button not present');
    }
    await loginButton.click();
    const modal = page.locator('.fixed.inset-0.z-\\[1000\\]');
    await expect(modal).toBeVisible();

    const registerInModal = modal.locator('button').filter({ hasText: /^Register$/i });
    await registerInModal.click();

    await expect(page.locator('input[name="firstName"]')).toBeVisible();
});

test('Register modal - can switch to login modal', async ({ page }) => {
    await page.goto('/');

    const registerButton = page.locator('button[data-type="register"]').first();
    if ((await registerButton.count()) === 0) {
        test.skip(true, 'Register button not present');
    }

    await registerButton.click();
    const modal = page.locator('.fixed.inset-0.z-\\[1000\\]');
    await expect(modal).toBeVisible();

    const loginInModal = modal.locator('button').filter({ hasText: /^Login$/i });
    await loginInModal.click();

    await expect(page.locator('input[name="firstName"]')).not.toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
});

test('Login modal - closes when clicking backdrop', async ({ page }) => {
    await page.goto('/');

    const loginButton = page.locator('button[data-type="login"]').first();

    if ((await loginButton.count()) === 0) {
        test.skip(true, 'Login button not present');
    }

    await loginButton.click();

    const modal = page.locator('.fixed.inset-0.z-\\[1000\\]');
    await expect(modal).toBeVisible();

    // Click on the backdrop (the outer div, not the form)
    // Click at position outside the modal content
    await page.mouse.click(10, 10);
    await expect(modal).not.toBeVisible();
});
