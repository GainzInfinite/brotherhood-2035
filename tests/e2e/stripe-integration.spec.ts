import { test, expect } from '@playwright/test'

test.describe('Stripe Membership Integration', () => {
  test('membership page displays correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/membership')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Verify Brotherhood crest
    await expect(page.locator('svg[class*="Crest"]')).toBeVisible()
    
    // Verify heading
    await expect(page.locator('h1:has-text("Join the Brotherhood")')).toBeVisible()
    
    // Verify pricing
    await expect(page.locator('text=$20.35')).toBeVisible()
    await expect(page.locator('text=/month')).toBeVisible()
    
    // Verify CTA button
    await expect(page.locator('button:has-text("Become a Member")')).toBeVisible()
    
    // Take screenshot
    await page.screenshot({ 
      path: 'screenshots/membership-page.png',
      fullPage: true 
    })
    
    console.log('✓ Membership page screenshot saved')
  })

  test('elite member badge shows when membership active', async ({ page }) => {
    // Note: This assumes activateMembership.js has been run
    await page.goto('http://localhost:3000/command-center')
    
    // Wait for API calls to complete
    await page.waitForTimeout(2000)
    
    // Verify Elite Member badge appears
    await expect(page.locator('text=Elite Member')).toBeVisible()
    
    // Verify crown icon in badge
    await expect(page.locator('[class*="lucide-crown"]').first()).toBeVisible()
    
    // Take screenshot
    await page.screenshot({ 
      path: 'screenshots/elite-member-badge.png',
      fullPage: false 
    })
    
    console.log('✓ Elite Member badge screenshot saved')
  })

  test('membership success page displays correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/membership/success')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Verify success message
    await expect(page.locator('h1:has-text("Welcome, Brother")')).toBeVisible()
    
    // Verify membership confirmation
    await expect(page.locator('text=Your membership is now active')).toBeVisible()
    
    // Verify CTA button
    await expect(page.locator('a:has-text("Enter Command Center")')).toBeVisible()
    
    // Take screenshot
    await page.screenshot({ 
      path: 'screenshots/membership-success.png',
      fullPage: true 
    })
    
    console.log('✓ Membership success screenshot saved')
  })

  test('trial badge does NOT show when membership active', async ({ page }) => {
    // Note: This assumes activateMembership.js has been run
    await page.goto('http://localhost:3000/command-center')
    
    // Wait for API calls to complete
    await page.waitForTimeout(2000)
    
    // Verify trial badge does NOT appear
    const trialBadge = page.locator('text=/Trial:.*days? left/')
    await expect(trialBadge).not.toBeVisible()
    
    console.log('✓ Trial badge correctly hidden for members')
  })
})
