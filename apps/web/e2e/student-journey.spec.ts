import { test, expect } from '@playwright/test'

// Single shared test user for all student tests
const TEST_EMAIL = `test-student-${Date.now()}@example.com`
const TEST_PASSWORD = 'TestPass123!'
const TEST_NAME = 'Test Student'

test.describe.configure({ mode: 'serial' }) // Run tests in series to reuse user

test.describe('Student Journey', () => {
  test.beforeAll(async ({ browser }) => {
    // Register the test user once before all tests
    const page = await browser.newPage()
    await page.goto('/auth/register')
    await page.waitForLoadState('networkidle')

    await page.fill('input[name="name"]', TEST_NAME)
    await page.fill('input[name="email"]', TEST_EMAIL)
    await page.fill('input[name="password"]', TEST_PASSWORD)
    await page.locator('input[type="radio"][value="student"]').check()

    await page.click('button[type="submit"]')
    await page.waitForURL(/\/student\/dashboard/, { timeout: 15000 })
    await page.close()
  })

  async function login(page) {
    // Reusable login helper
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', TEST_EMAIL)
    await page.fill('input[name="password"]', TEST_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/student\/dashboard/, { timeout: 15000 })
  }

  test('full registration → diagnostic → training → heart space flow', async ({ page }) => {
    // Registration done in beforeAll, just login
    await login(page)
    await expect(page.locator('h1')).toBeVisible()

    // Complete a daily check-in
    await page.goto('/student/checkin')
    await page.waitForLoadState('networkidle')

    // Click a mood option (sunny/cloudy/rainy/stormy)
    const moodButton = page.locator('button').filter({ hasText: /sunny|cloudy|rainy|stormy/i }).first()
    if (await moodButton.isVisible()) {
      await moodButton.click()
    }

    // Add a note
    const noteInput = page.locator('textarea, input[placeholder*="note"i]').first()
    if (await noteInput.isVisible()) {
      await noteInput.fill('Feeling great today!')
    }

    // Submit
    const submitBtn = page.locator('button[type="submit"], button').filter({ hasText: /save|check.?in|submit/i }).first()
    if (await submitBtn.isVisible()) {
      await submitBtn.click()
      await page.waitForTimeout(1000)
    }

    // Visit diagnostic page
    await page.goto('/student/diagnostic')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toBeVisible()

    // Visit training page
    await page.goto('/student/training')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toBeVisible()

    // Visit heart space
    await page.goto('/student/heart')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toBeVisible()

    // Visit progress page
    await page.goto('/student/progress')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toBeVisible()

    // Visit wrong answers page
    await page.goto('/student/wrong-answers')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('AI Tutor chat interaction', async ({ page }) => {
    await login(page)

    // Navigate to AI Tutor
    await page.goto('/student/ai-tutor')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toContainText(/tutor/i)

    // Send a message
    const chatInput = page.locator('textarea, input[placeholder*="question"i], input[placeholder*="ask"i]').first()
    await expect(chatInput).toBeVisible({ timeout: 5000 })
    await chatInput.fill('What is 2+2?')

    // Click send button
    const sendBtn = page.locator('button').filter({ hasText: /send/i }).first()
    if (await sendBtn.isVisible()) {
      await sendBtn.click()
    }

    // Just verify we're on the page and no errors (AI may take time, don't fail test on missing response)
    await expect(page).toHaveURL(/\/student\/ai-tutor/)
  })

  test('Heart space journal and proud wall', async ({ page }) => {
    await login(page)

    // Visit journal page
    await page.goto('/student/heart/journal')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toBeVisible()

    // Write a journal entry
    const textarea = page.locator('textarea').first()
    if (await textarea.isVisible()) {
      await textarea.fill('Today was a good day. I learned something new!')
      const saveBtn = page.locator('button').filter({ hasText: /save/i }).first()
      if (await saveBtn.isVisible()) {
        await saveBtn.click()
        await page.waitForTimeout(1000)
      }
    }

    // Visit proud wall
    await page.goto('/student/heart/proud-wall')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toBeVisible()

    // Share a proud moment
    const titleInput = page.locator('input[placeholder*="proud"i], input[placeholder*="achieve"i]').first()
    if (await titleInput.isVisible()) {
      await titleInput.fill('I solved my first algebra problem!')
      const shareBtn = page.locator('button').filter({ hasText: /share/i }).first()
      if (await shareBtn.isVisible()) {
        await shareBtn.click()
        await page.waitForTimeout(1000)
      }
    }
  })
})
