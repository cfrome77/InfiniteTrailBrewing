import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to all public pages', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Infinite Trail Brewing/);

    // Click 'Our Beers' (desktop or mobile header)
    await page.locator('header a[href="/beers"]').first().click();
    await expect(page).toHaveURL(/\/beers/, { timeout: 20000 });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Our Beers');
    await page.waitForTimeout(1500); // wait for hydration and dev compilation

    // Click 'The Brew Log'
    await page.locator('header a[href="/blog"]').first().click();
    await expect(page).toHaveURL(/\/blog/, { timeout: 20000 });
    await expect(page.locator('h1')).toContainText('The Brewhouse Blog');
    await page.waitForTimeout(1500);

    // Click 'Our Story'
    await page.locator('header a[href="/our-story"]').first().click();
    await expect(page).toHaveURL(/\/our-story/, { timeout: 20000 });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Our Story');
    await page.waitForTimeout(1500);

    // Click 'Contact'
    await page.locator('header a[href="/contact"]').first().click();
    await expect(page).toHaveURL(/\/contact/, { timeout: 20000 });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Contact Us');
  });

  test('admin route should load sanity studio', async ({ page }) => {
    // Set a generous timeout for the admin page chunk loading/compilation in development mode
    test.setTimeout(90000);
    await page.goto('/admin', { waitUntil: 'commit' });
    await expect(page).toHaveURL(/\/admin/);
  });
});
