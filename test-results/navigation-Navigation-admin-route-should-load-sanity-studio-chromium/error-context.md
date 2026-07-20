# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Navigation >> admin route should load sanity studio
- Location: tests/e2e/navigation.spec.ts:29:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://localhost:3000/admin", waiting until "commit"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test.describe('Navigation', () => {
  4  |   test('should navigate to all public pages', async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await expect(page).toHaveTitle(/Infinite Trail Brewing/);
  7  |
  8  |     // Click 'The Brew Log' (desktop or mobile header)
  9  |     await page.click('header >> text=The Brew Log');
  10 |     await expect(page).toHaveURL(/\/beers/);
  11 |     await expect(page.locator('h1')).toContainText('Our Beers');
  12 |
  13 |     // Click 'Lab Notes'
  14 |     await page.click('header >> text=Lab Notes');
  15 |     await expect(page).toHaveURL(/\/blog/);
  16 |     await expect(page.locator('h1')).toContainText('The Brewhouse Blog');
  17 |
  18 |     // Click 'Our Story'
  19 |     await page.click('header >> text=Our Story');
  20 |     await expect(page).toHaveURL(/\/our-story/);
  21 |     await expect(page.locator('h1')).toContainText('Our Story');
  22 |
  23 |     // Click 'Contact'
  24 |     await page.click('header >> text=Contact');
  25 |     await expect(page).toHaveURL(/\/contact/);
  26 |     await expect(page.locator('h1')).toContainText('Contact Us');
  27 |   });
  28 |
  29 |   test('admin route should load sanity studio', async ({ page }) => {
  30 |     // Increase timeout or check with waitUntil: 'commit' so we don't wait for heavy JS chunk loads to complete in the sandbox
> 31 |     await page.goto('/admin', { waitUntil: 'commit' });
     |                ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  32 |     await expect(page).toHaveURL(/\/admin/);
  33 |   });
  34 | });
  35 |
```