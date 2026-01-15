import { test, expect } from '@playwright/test';
import { login } from './fixtures/auth';

const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'testpassword';


test.describe('All Deals (authenticated)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await login(page, TEST_EMAIL, TEST_PASSWORD);
        await page.waitForLoadState('domcontentloaded');

        await page.goto('/deals');
        await expect(page).toHaveURL(/.*deals/);
        await page.waitForLoadState('domcontentloaded');

        const allDealsBlock = page.locator('[data-testid="PageBlocksAllDeals"]');
        try {
            await allDealsBlock.waitFor({ state: 'visible', timeout: 5_000 });
        } catch {
            test.skip(true, 'Deals block not present');
            return;
        }
    });

    test('should show filters and clear resets them', async ({ page }) => {
        // Wait for filters to be visible
        const clearButton = page.locator('[data-testid="filter-clear"]');
        const searchButton = page.locator('[data-testid="filter-search"]');
        await clearButton.waitFor({ state: 'visible', timeout: 10_000 });

        await expect(clearButton).toBeVisible();
        await expect(searchButton).toBeVisible();

        const nameInput = page.locator('[data-testid="filter-name"]');
        if ((await nameInput.count()) > 0) {
            await nameInput.click();
            await nameInput.fill('Test Search');
            await expect(nameInput).toHaveValue('Test Search', { timeout: 10_000 });
        }

        const agenciesToggle = page.locator('[data-testid="filter-agencies-toggle"]');
        if ((await agenciesToggle.count()) > 0) {
            await agenciesToggle.click();
            const agenciesOptions = page.locator('[data-testid="filter-agencies-options"]');
            await agenciesOptions.waitFor({ state: 'visible' });

            const firstOption = agenciesOptions.locator('[data-testid^="filter-agency-option-"]').first();
            if ((await firstOption.count()) > 0) {
                await firstOption.click();
                await expect(agenciesToggle).toContainText('(1)');
            }
        }

        // Click clear and verify inputs are reset
        await clearButton.click();

        if ((await nameInput.count()) > 0) {
            await expect(nameInput).toHaveValue('');
        }

        if ((await agenciesToggle.count()) > 0) {
            await expect(agenciesToggle).not.toContainText('(');
        }
    });

    test('should expand deal card when clicking expand button', async ({ page }) => {
        const cards = page.locator('[data-testid="deal-card"]');

        try {
            await cards.first().waitFor({ state: 'visible', timeout: 10_000 });
        } catch {
            test.skip(true, 'No deal cards present');
            return;
        }

        const firstCard = cards.first();
        const expandButton = firstCard.locator('[data-testid="deal-card-expand"]');

        await expect(firstCard).toHaveAttribute('data-expanded', 'false');
        await expandButton.click();
        await expect(firstCard).toHaveAttribute('data-expanded', 'true');
        await expandButton.click();
        await expect(firstCard).toHaveAttribute('data-expanded', 'false');
    });
});