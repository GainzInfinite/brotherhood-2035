import { test, expect } from '@playwright/test';

test.describe('Income pages smoke', () => {
  test('income new page loads and shows amount input', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/wealth/income/new`);
    await expect(page).toHaveTitle(/Brotherhood 2035/i);
    await expect(page.getByLabel(/Amount/i)).toBeVisible();
    // Check for submit button (accept a few common labels)
    await expect(page.getByRole('button', { name: /Record Income|Add Income|Create Income|Save/i })).toBeVisible();
  });
});
