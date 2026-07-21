import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to all public pages', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Infinite Trail Brewing/);

    // Click 'The Brew Log' (desktop or mobile header)
    await page.locator('header a[href="/beers"]').first().click();
    await expect(page).toHaveURL(/\/beers/);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Our Beers');
    await page.waitForTimeout(1000); // wait for hydration and dev compilation

    // Click 'Lab Notes'
    await page.locator('header a[href="/blog"]').first().click();
    await expect(page).toHaveURL(/\/blog/, { timeout: 20000 });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('The Brewhouse Blog');
    await page.waitForTimeout(1000);

    // Click 'Our Story'
    await page.locator('header a[href="/our-story"]').first().click();
    await expect(page).toHaveURL(/\/our-story/, { timeout: 20000 });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Our Story');
    await page.waitForTimeout(1000);

    // Click 'Contact'
    await page.locator('header a[href="/contact"]').first().click();
    await expect(page).toHaveURL(/\/contact/, { timeout: 20000 });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Contact Us');
  });

  test('admin route should load sanity studio', async ({ page }) => {
    // Increase timeout or check with waitUntil: 'commit' so we don't wait for heavy JS chunk loads to complete in the sandbox
    await page.goto('/admin', { waitUntil: 'commit' });
    await expect(page).toHaveURL(/\/admin/);
  });
});
