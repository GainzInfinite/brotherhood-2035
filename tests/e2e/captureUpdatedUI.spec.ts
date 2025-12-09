import { test } from '@playwright/test'

test('Capture updated UI screenshots', async ({ page }) => {
  // Wealth header with both buttons
  await page.goto('http://localhost:3000/wealth')
  await page.waitForSelector('text=Wealth Module')
  await page.screenshot({ path: 'test-results/wealth-header-buttons.png', fullPage: false })

  // Command Center income formatting
  await page.goto('http://localhost:3000/command-center')
  await page.waitForSelector('text=Command Center')
  await page.screenshot({ path: 'test-results/command-center-income-format.png', fullPage: false })

  // Onboarding flow after profile submit (assumes onboarding incomplete)
  await page.goto('http://localhost:3000/onboarding/profile')
  await page.fill('#username', 'PlaywrightUser')
  await page.selectOption('#timezone', { label: /.*/ })
  await page.click('button:has-text("Claim Your Identity")')
  await page.waitForURL('**/onboarding/check-in')
  await page.screenshot({ path: 'test-results/onboarding-after-profile.png', fullPage: false })

  // Journal autosave pulse/timestamp
  await page.goto('http://localhost:3000/journal')
  await page.waitForSelector('[data-testid="save-status"]')
  // Trigger autosave by editing if editor present
  const editor = await page.locator('textarea, [contenteditable="true"]').first()
  if (await editor.count()) {
    await editor.type(' Automated edit to trigger autosave.')
    await page.waitForTimeout(1200) // allow pulse+fade flow
  }
  await page.screenshot({ path: 'test-results/journal-autosave-feedback.png', fullPage: false })
})
