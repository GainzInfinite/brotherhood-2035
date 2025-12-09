import { test, expect } from '@playwright/test'

// Temporary test: intentionally fails at the end to force Playwright to retain the video
// It types into the journal title to trigger the autosave pulse animation.

test('record: journal autosave pulse (temporary)', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/journal`)
  await expect(page).toHaveTitle(/Brotherhood 2035/i)

  // Focus and type into title to mark dirty
  await page.locator('#journal-title').click()
  await page.locator('#journal-title').fill('Recording autosave pulse ' + Date.now())

  // Wait for autosave debounce + full animation window
  await page.waitForTimeout(2500)
  await page.waitForTimeout(1000)

  // Capture the SaveStatus container screenshot too
  const container = page.locator('[data-testid="save-status"]').first()
  await container.screenshot({ path: 'test-results/save-pulse-screenshot.png' })

  // Intentionally fail so Playwright saves the video (config uses retain-on-failure)
  expect(false).toBe(true)
})
