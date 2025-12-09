import { test } from '@playwright/test'

test('Capture onboarding UI screenshots', async ({ page }) => {
  // Onboarding flow after profile submit (assumes onboarding incomplete)
  await page.goto('http://localhost:3000/onboarding/profile')
  await page.fill('#username', 'PlaywrightUser')
  await page.selectOption('#timezone', { index: 1 })
  await page.click('button:has-text("Claim Your Identity")')
  await page.waitForURL('**/onboarding/check-in')
  await page.screenshot({ path: 'test-results/onboarding-after-profile.png', fullPage: false })
})
