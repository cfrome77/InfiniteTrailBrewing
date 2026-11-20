import { test, expect } from '@playwright/test';

/**
 * Covers the unsubscribe surfaces that do not read the CMS, so the suite stays
 * runnable in CI where no Sanity credentials are present. The token lookup
 * itself is covered by the unit tests in tests/unit/unsubscribe-actions.test.ts.
 */
test.describe('Unsubscribe', () => {
  test('renders the request form', async ({ page }) => {
    await page.goto('/unsubscribe');
    await expect(page.getByRole('heading', { name: 'Unsubscribe' })).toBeVisible();
    await expect(page.getByPlaceholder('your@email.com')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send Unsubscribe Link' })).toBeVisible();
  });

  test('an invalid link explains itself instead of showing a blank form', async ({ page }) => {
    await page.goto('/unsubscribe?error=invalid');
    await expect(page.getByText('This unsubscribe link is no longer valid.')).toBeVisible();
  });

  test('a successful unsubscribe is confirmed', async ({ page }) => {
    await page.goto('/unsubscribe?success=true');
    await expect(
      page.getByText('You have been successfully unsubscribed from The Brew Log.'),
    ).toBeVisible();
  });

  test('an unknown error is reported without leaking details', async ({ page }) => {
    await page.goto('/unsubscribe?error=failed');
    await expect(
      page.getByText('We could not process that unsubscribe link. Please request a new one below.'),
    ).toBeVisible();
  });

  test('one-click POST without a token is rejected', async ({ request }) => {
    const response = await request.post('/api/unsubscribe');
    expect(response.status()).toBe(400);
  });

  test('the link target without a token redirects to an error state', async ({ request }) => {
    const response = await request.get('/api/unsubscribe', { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(response.headers()['location']).toContain('/unsubscribe?error=missing');
  });
});
