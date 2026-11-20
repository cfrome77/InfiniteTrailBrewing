import { test, expect } from '@playwright/test';

/**
 * Titles and social cards are invisible in the app but are what search engines
 * and link previews see. Every page used to serve one identical title, and
 * pages that declared openGraph silently dropped the inherited card.
 */
test.describe('Page metadata', () => {
  const pages: [string, RegExp][] = [
    ['/', /Infinite Trail Brewing/],
    ['/beers', /Our Beers \| Infinite Trail Brewing/],
    ['/beers/archive', /Beer Archive \| Infinite Trail Brewing/],
    ['/blog', /The Brew Log \| Infinite Trail Brewing/],
    ['/our-story', /Our Story \| Infinite Trail Brewing/],
    ['/contact', /Contact \| Infinite Trail Brewing/],
  ];

  for (const [path, expected] of pages) {
    test(`${path} has its own title and an og:image`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(expected);
      await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    });
  }

  test('a 404 does not repeat the site name twice', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');
    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle('Off the Trail | Infinite Trail Brewing');
  });
});
