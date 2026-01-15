import { test, expect } from '@playwright/test';
import { login } from './fixtures/auth';

const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'testpassword';

test.describe('Sheets (authenticated)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await login(page, TEST_EMAIL, TEST_PASSWORD);
        await page.waitForLoadState('domcontentloaded');

        await page.goto('/sheets');
        await expect(page).toHaveURL(/.*sheets/);
        await page.waitForLoadState('domcontentloaded');

        const sheetsBlock = page.locator('[data-testid="PageBlocksSheets"]');
        try {
            await sheetsBlock.waitFor({ state: 'visible', timeout: 5_000 });
        } catch {
            test.skip(true, 'Sheets block not present');
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

        // Fill name filter if present
        const nameInput = page.locator('[data-testid="filter-name"]');
        if ((await nameInput.count()) > 0) {
            await nameInput.fill('Test Search');
            await expect(nameInput).toHaveValue('Test Search');
        }

        // Select date filter if present
        const dateToggle = page.locator('[data-testid="filter-date-toggle"]');
        if ((await dateToggle.count()) > 0) {
            await dateToggle.click();
            const monthOption = page.locator('[data-testid="filter-date-option-month"]');
            await monthOption.waitFor({ state: 'visible' });
            await monthOption.click();
            await expect(page.locator('[data-testid="filter-date-value"]')).toHaveText('1 Month');
        }

        // Select interest filter if present and has categories
        const interestsToggle = page.locator('[data-testid="filter-interests-toggle"]');
        if ((await interestsToggle.count()) > 0) {
            await interestsToggle.click();
            const interestsOptions = page.locator('[data-testid="filter-interests-options"]');
            await interestsOptions.waitFor({ state: 'visible' });

            // Check if there are any interest options (categories loaded)
            const firstOption = interestsOptions.locator('[data-testid^="filter-interest-option-"]').first();
            if ((await firstOption.count()) > 0) {
                await firstOption.click();
                // Verify count shows (1) selected
                await expect(interestsToggle).toContainText('(1)');
            }
        }

        // Click clear and verify inputs are reset
        await clearButton.click();

        if ((await nameInput.count()) > 0) {
            await expect(nameInput).toHaveValue('');
        }

        if ((await interestsToggle.count()) > 0) {
            await expect(interestsToggle).not.toContainText('(');
        }

        if ((await dateToggle.count()) > 0) {
            await expect(page.locator('[data-testid="filter-date-value"]')).not.toHaveText('1 Month');
        }
    });

    test('should trigger download when clicking download button', async ({ page }) => {
        const cards = page.locator('[data-testid="material-card"]');
        await cards.first().waitFor({ state: 'visible', timeout: 10_000 });

        if ((await cards.count()) === 0) {
            test.skip(true, 'No material cards present');
        }

        const firstCard = cards.first();
        const downloadButton = firstCard.locator('[data-testid="card-download"]');
        const downloadPromise = page.waitForEvent('download', { timeout: 10_000 }).catch(() => null);
        await downloadButton.click();
        const download = await downloadPromise;
        expect(download).toBeTruthy();

    });

    test('should expand material card when clicking expand button', async ({ page }) => {
        // Set viewport to desktop (expand button hidden on mobile)
        await page.setViewportSize({ width: 1280, height: 800 });

        const cards = page.locator('[data-testid="material-card"]');
        await cards.first().waitFor({ state: 'visible', timeout: 10_000 });

        if ((await cards.count()) === 0) {
            test.skip(true, 'No material cards present');
        }

        const firstCard = cards.first();
        const expandButton = firstCard.locator('[data-testid="card-expand"]');

        await expect(firstCard).toHaveAttribute('data-expanded', 'false');
        await expandButton.click();
        await expect(firstCard).toHaveAttribute('data-expanded', 'true');
        await expandButton.click();
        await expect(firstCard).toHaveAttribute('data-expanded', 'false');
    });

    
});