import { test, expect } from '@playwright/test';

test.describe('Newsletter popup', () => {
  test('traps focus, closes on Escape, and exposes dialog semantics', async ({ page }) => {
    // Popup opens 3s after load unless a dismissal flag is stored.
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto('/');

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 10000 });
    await expect(dialog).toHaveAttribute('aria-modal', 'true');

    const title = page.locator('#newsletter-popup-title');
    await expect(title).toHaveText('Join the Trail');

    // Focus should move into the dialog on open.
    await expect.poll(async () =>
      page.evaluate(() => {
        const d = document.querySelector('[role="dialog"]');
        return !!(d && d.contains(document.activeElement));
      })
    ).toBe(true);

    // Focus must not escape while tabbing.
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(() => {
        const d = document.querySelector('[role="dialog"]');
        return !!(d && d.contains(document.activeElement));
      });
      expect(inside).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('dismissal is remembered for subsequent visits', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto('/');

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'Close popup' }).click();
    await expect(dialog).toBeHidden();

    const dismissed = await page.evaluate(() =>
      localStorage.getItem('itb-newsletter-dismissed')
    );
    expect(dismissed).toBeTruthy();
  });
});
