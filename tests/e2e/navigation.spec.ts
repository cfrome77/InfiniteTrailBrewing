import { test, expect } from '@playwright/test';

test.describe('Navigation & Catalog', () => {
  test('should navigate to all public pages and archive', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Infinite Trail Brewing/);

    // Hover or click 'Our Beers' dropdown
    const beersNavButton = page.locator('header button', { hasText: 'Our Beers' }).first();
    await expect(beersNavButton).toBeVisible();
    await beersNavButton.hover();
    await page.locator('a[href="/beers"]').first().click();
    await expect(page).toHaveURL(/\/beers/, { timeout: 20000 });
    await expect(page.locator('h1')).toBeVisible();

    // Navigate to Brew Archive
    await page.goto('/beers/archive');
    await expect(page).toHaveURL(/\/beers\/archive/, { timeout: 20000 });
    await expect(page.locator('h1')).toContainText('Brew Archive');

    // Click 'The Brew Log'
    await page.locator('header a[href="/blog"]').first().click();
    await expect(page).toHaveURL(/\/blog/, { timeout: 20000 });
    await expect(page.locator('h1')).toContainText('The Brew Log');

    // Click 'Our Story'
    await page.locator('header a[href="/our-story"]').first().click();
    await expect(page).toHaveURL(/\/our-story/, { timeout: 20000 });
    await expect(page.locator('h1')).toContainText('Our Story');

    // Click 'Contact'
    await page.locator('header a[href="/contact"]').first().click();
    await expect(page).toHaveURL(/\/contact/, { timeout: 20000 });
    await expect(page.locator('h1')).toContainText('Contact Us');
  });

  test('should redirect legacy /telemetry route to /beers', async ({ page }) => {
    await page.goto('/telemetry');
    await expect(page).toHaveURL(/\/beers/, { timeout: 20000 });
  });

  test('should search and filter beers interactively', async ({ page }) => {
    await page.goto('/beers');
    await expect(page.locator('h1')).toBeVisible();

    // Search for IPA
    const searchInput = page.getByPlaceholder('Search by beer name, hops, ingredients, or notes...');
    await searchInput.fill('IPA');
    await expect(page.locator('text=Active Filters:')).toBeVisible();
    await expect(page.locator('text=Query: "IPA"')).toBeVisible();

    // Select Style Category
    await page.locator('select').selectOption('ipa');
    await expect(page.locator('text=Style: IPAs & Hazy Ales')).toBeVisible();

    // Reset filters
    await page.getByRole('button', { name: 'Reset filters' }).first().click();
    await expect(searchInput).toHaveValue('');
  });

  test('admin route should load sanity studio', async ({ page }) => {
    test.setTimeout(90000);
    await page.goto('/admin', { waitUntil: 'commit' });
    await expect(page).toHaveURL(/\/admin/);
  });
});
