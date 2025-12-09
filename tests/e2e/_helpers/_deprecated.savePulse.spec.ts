// TEMPORARILY MOVED UNTIL E2E SUITE IS BUILT
// This test was used for manual/temporary verification of the Journal autosave pulse.
// Kept here as a reference but not run by default.

import { test, expect } from '@playwright/test'

test('Journal autosave pulse and timestamp (deprecated helper copy)', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/journal`)
  // ensure page is loaded
  await expect(page).toHaveTitle(/Brotherhood 2035/i)

  // Type into the title to mark dirty
  await page.locator('#journal-title').click()
  await page.locator('#journal-title').fill('Autosave test ' + Date.now())

  // Wait for autosave debounce + a bit
  await page.waitForTimeout(3000)

  // Capture save status area
  const container = page.locator('role=status').first()
  await container.screenshot({ path: 'test-results/save-pulse.png' })

  // Expect that at least the saved timestamp appears eventually
  await expect(page.locator('text=Saved')).toBeVisible({ timeout: 5000 })
})
