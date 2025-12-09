import { test, expect } from '@playwright/test';

test.describe('Journal smoke', () => {
  test('journal page loads and shows save button', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/journal`);
    await expect(page).toHaveTitle(/Brotherhood 2035/i);
    // Ensure calendar and recent entries area render
    await expect(page.getByText(/Recent Entries/i)).toBeVisible();
    // Check for Save button in editor area
    await expect(page.getByRole('button', { name: /Save/i })).toBeVisible();
  });
});
