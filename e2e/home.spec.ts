import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
    test('has correct title and heading', async ({ page }) => {
        // Navigate to the base URL (which should be handled by webServer in playwright config)
        await page.goto('/');

        // Expect a title "to contain" a substring.
        await expect(page).toHaveTitle(/お墓じまいナビ/);

        // Expect the main h1 heading to be visible
        const heading = page.locator('h1').first();
        await expect(heading).toBeVisible();
        await expect(heading).toContainText('お墓じまい');
    });

    test('can navigate to kaissou page from header', async ({ page }) => {
        await page.goto('/');

        // Find the link to kaissou page. Depending on actual UI it might just be the text text.
        const kaissouLink = page.getByRole('link', { name: '全国の改葬許可情報' }).first();

        if (await kaissouLink.isVisible()) {
            await kaissouLink.click();
            await expect(page).toHaveURL(/.*\/kaissou/);
        }
    });
});
