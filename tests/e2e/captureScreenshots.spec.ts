import { test, expect } from '@playwright/test'

test('capture onboarding, command-center, expense, and journal autosave screenshots', async ({ page, baseURL }) => {
  // Onboarding profile -> submit -> check-in
  await page.goto(`${baseURL}/onboarding/profile`)
  await expect(page).toHaveURL(/onboarding\/profile/)
  await page.fill('#username', 'AutomatedTester ' + Date.now())
  // Submit the form
  await page.click('text=Claim Your Identity')
  // Wait for redirect to check-in
  await page.waitForURL('**/onboarding/check-in', { timeout: 5000 })
  await page.screenshot({ path: 'test-results/onboarding-checkin.png', fullPage: true })

  // Command Center
  await page.goto(`${baseURL}/command-center`)
  await expect(page).toHaveURL(/command-center/)
  await page.waitForTimeout(600)
  await page.screenshot({ path: 'test-results/command-center.png', fullPage: true })

  // Wealth expense new page
  await page.goto(`${baseURL}/wealth/expense/new`)
  await expect(page).toHaveURL(/wealth\/expense\/new/)
  await page.screenshot({ path: 'test-results/expense-page.png', fullPage: true })

  // Journal autosave: type into title and wait for autosave -> timestamp
  await page.goto(`${baseURL}/journal`)
  await expect(page).toHaveURL(/journal/)
  await page.click('#journal-title')
  await page.fill('#journal-title', 'Autosave Screenshot ' + Date.now())
  // Wait for autosave debounce + animation window
  await page.waitForTimeout(3000)
  // Wait for 'Saved' text to appear in status
  await page.waitForSelector('text=Saved', { timeout: 5000 })
  await page.screenshot({ path: 'test-results/journal-autosave.png', fullPage: true })
})
