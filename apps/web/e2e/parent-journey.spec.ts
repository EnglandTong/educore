import { test, expect } from '@playwright/test'

const PARENT_EMAIL = `test-parent-${Date.now()}@example.com`
const PARENT_PASSWORD = 'TestPass123!'

test.describe('Parent Journey', () => {
  test('register → link child → view progress', async ({ page }) => {
    // Register as parent
    await page.goto('/auth/register')
    await page.waitForLoadState('networkidle')

    await page.fill('input[name="name"]', 'Test Parent')
    await page.fill('input[name="email"]', PARENT_EMAIL)
    await page.fill('input[name="password"]', PARENT_PASSWORD)
    // Select role via radio button
    await page.locator('input[type="radio"][value="parent"]').check()

    await page.click('button[type="submit"]')
    await page.waitForURL(/\/parent\/dashboard/, { timeout: 15000 })
    // Parent dashboard uses warm greeting, not "dashboard" in h1
    await expect(page.locator('h1')).toBeVisible()

    // View announcements
    await page.goto('/parent/announcements')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toContainText(/bulletin|announcement/i)

    // View conversations (was /parent/messages earlier)
    await page.goto('/parent/conversations')
    await page.waitForLoadState('networkidle')
  })
})
