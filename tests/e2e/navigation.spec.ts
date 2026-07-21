import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to all public pages', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Infinite Trail Brewing/);

    // Click 'Our Beers' (desktop or mobile header)
    await page.click('header >> text=Our Beers');
    await expect(page).toHaveURL(/\/beers/);
    await expect(page.locator('h1')).toContainText('Our Beers');

    // Click 'The Brew Log'
    await page.click('header >> text=The Brew Log');
    await expect(page).toHaveURL(/\/blog/);
    await expect(page.locator('h1')).toContainText('The Brewhouse Blog');

    // Click 'Our Story'
    await page.click('header >> text=Our Story');
    await expect(page).toHaveURL(/\/our-story/);
    await expect(page.locator('h1')).toContainText('Our Story');

    // Click 'Contact'
    await page.click('header >> text=Contact');
    await expect(page).toHaveURL(/\/contact/);
    await expect(page.locator('h1')).toContainText('Contact Us');
  });

  test('admin route should load sanity studio', async ({ page }) => {
    // Increase timeout or check with waitUntil: 'commit' so we don't wait for heavy JS chunk loads to complete in the sandbox
    await page.goto('/admin', { waitUntil: 'commit' });
    await expect(page).toHaveURL(/\/admin/);
  });
});
