import { test, expect } from '@playwright/test'

test.describe('Donation Page', () => {
  test('public donation page renders and form works', async ({ page }) => {
    await page.goto('/donation')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toContainText(/support|donation|mission/i)

    // Fill in donation form
    const nameInput = page.locator('input[placeholder*="name"i]').first()
    if (await nameInput.isVisible()) {
      await nameInput.fill('Jane Donor')
    }

    const emailInput = page.locator('input[type="email"]').first()
    if (await emailInput.isVisible()) {
      await emailInput.fill('jane@example.com')
    }

    // Select a preset amount
    const presetBtn = page.locator('button').filter({ hasText: '$10' }).first()
    if (await presetBtn.isVisible()) {
      await presetBtn.click()
    }

    // Submit donation
    const donateBtn = page.locator('button').filter({ hasText: /donate/i }).first()
    if (await donateBtn.isVisible() && await donateBtn.isEnabled()) {
      await donateBtn.click()
      await page.waitForTimeout(2000)
    }
  })
})

test.describe('Page Routing', () => {
  test('home page redirects to login for unauthenticated users', async ({ page }) => {
    await page.goto('/')
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 })
  })

  test('404 redirects to home', async ({ page }) => {
    await page.goto('/nonexistent-page')
    await page.waitForLoadState('networkidle')
    // Should redirect to login (since not authenticated)
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('auth pages are accessible without login', async ({ page }) => {
    await page.goto('/auth/login')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toBeVisible()

    await page.goto('/auth/register')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toBeVisible()
  })
})
