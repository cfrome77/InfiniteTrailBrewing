import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to all public pages', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Infinite Trail Brewing/);

    await page.click('text=Our Beers');
    await expect(page).toHaveURL(/\/beers/);
    await expect(page.locator('h1')).toContainText('Our Beers');

    await page.click('text=Blog');
    await expect(page).toHaveURL(/\/blog/);
    await expect(page.locator('h1')).toContainText('The Brewhouse Blog');

    await page.click('text=Our Story');
    await expect(page).toHaveURL(/\/our-story/);
    await expect(page.locator('h1')).toContainText('Our Story');

    await page.click('text=Contact');
    await expect(page).toHaveURL(/\/contact/);
    await expect(page.locator('h1')).toContainText('Contact Us');
  });

  test('should redirect unauthenticated user from admin', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login/);
  });
});
