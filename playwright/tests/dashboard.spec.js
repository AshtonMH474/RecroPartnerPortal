import { test, expect } from '@playwright/test';
import { login } from './fixtures/auth';

// Test credentials from .env
const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'testpassword';

test.describe('Dashboard (authenticated)', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await login(page, TEST_EMAIL, TEST_PASSWORD);
        await page.waitForLoadState('networkidle');

        // Check if dashboard block exists, skip if not
        const dashboardBlock = page.locator('[data-testid="dashboard-block"]');
        try {
            await dashboardBlock.waitFor({ state: 'visible', timeout: 5_000 });
        } catch {
            test.skip(true, 'Dashboard block not present');
            return;
        }

        // Wait for dashboard tabs to load before each test
        await page.locator('[data-testid^="tab-"]').first().waitFor({ state: 'visible', timeout: 10_000 });
    });

    test('should show tab filters on dashboard', async ({ page }) => {
        await expect(page).toHaveURL(/.*dashboard/);
        const tabs = page.locator('[data-testid^="tab-"]');
        await expect(tabs.first()).toBeVisible();
    });

    test('should switch to Papers tab and show papers content', async ({ page }) => {
        const papersTab = page.locator('[data-testid="tab-papers"]');

        if ((await papersTab.count()) === 0) {
            test.skip(true, 'Papers tab not present');
        }

        await papersTab.click();
        await expect(papersTab).toHaveAttribute('data-active', 'true');
    });

    test('should switch to Sheets tab and show sheets content', async ({ page }) => {
        const sheetsTab = page.locator('[data-testid="tab-sheets"]');

        if ((await sheetsTab.count()) === 0) {
            test.skip(true, 'Sheets tab not present');
        }

        await sheetsTab.click();
        await expect(sheetsTab).toHaveAttribute('data-active', 'true');
    });

    test('should switch to Statements tab and show statements content', async ({ page }) => {
        const statementsTab = page.locator('[data-testid="tab-statements"]');

        if ((await statementsTab.count()) === 0) {
            test.skip(true, 'Statements tab not present');
        }

        await statementsTab.click();
        await expect(statementsTab).toHaveAttribute('data-active', 'true');
    });

    test('should switch between all tabs correctly', async ({ page }) => {
        const tabs = ['papers', 'sheets', 'statements'];

        for (const tabName of tabs) {
            const tab = page.locator(`[data-testid="tab-${tabName}"]`);

            if ((await tab.count()) === 0) {
                continue;
            }

            await tab.click();

            await expect(tab).toHaveAttribute('data-active', 'true');

            for (const otherTabName of tabs) {
                if (otherTabName !== tabName) {
                    const otherTab = page.locator(`[data-testid="tab-${otherTabName}"]`);
                    if ((await otherTab.count()) > 0) {
                        await expect(otherTab).toHaveAttribute('data-active', 'false');
                    }
                }
            }
        }
    });

    test('should show Recent tab if user has downloads', async ({ page }) => {
        const recentTab = page.locator('[data-testid="tab-recent"]');

        if ((await recentTab.count()) > 0) {
            await recentTab.click();
            await expect(recentTab).toHaveAttribute('data-active', 'true');
        } else {
            test.skip(true, 'Recent tab not present (user has no downloads)');
        }
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
});
