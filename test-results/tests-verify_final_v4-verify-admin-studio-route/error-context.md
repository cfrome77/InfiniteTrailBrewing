# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/verify_final_v4.spec.ts >> verify admin studio route
- Location: tests/verify_final_v4.spec.ts:3:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://localhost:3000/admin/studio", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test('verify admin studio route', async ({ page }) => {
> 4  |   await page.goto('http://localhost:3000/admin/studio');
     |              ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  5  |   // Should redirect to login as we are not authenticated in playwright
  6  |   await expect(page).toHaveURL(/.*login/);
  7  | });
  8  |
  9  | test('verify visibility logic on website', async ({ page }) => {
  10 |   await page.goto('http://localhost:3000/blog');
  11 |   await expect(page.getByRole('heading', { name: 'The Trail Report' })).toBeVisible();
  12 | });
  13 |
```