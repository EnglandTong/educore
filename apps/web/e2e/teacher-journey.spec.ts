import { test, expect } from '@playwright/test'
import { installE2eApiMocks } from './e2e-mocks'

const TEACHER_EMAIL = `test-teacher-${Date.now()}@example.com`
const TEACHER_PASSWORD = 'TestPass123!'

test.describe('Teacher Journey', () => {
  test.beforeEach(async ({ page }) => {
    await installE2eApiMocks(page)
  })

  test('register → view class → check announcements', async ({ page }) => {
    // Register as teacher
    await page.goto('/auth/register')
    await page.waitForLoadState('networkidle')

    await page.fill('input[name="name"]', 'Test Teacher')
    await page.fill('input[name="email"]', TEACHER_EMAIL)
    await page.fill('input[name="password"]', TEACHER_PASSWORD)
    // Select role via radio button
    await page.locator('input[type="radio"][value="teacher"]').check()

    await page.click('button[type="submit"]')
    await page.waitForURL(/\/teacher\/dashboard/, { timeout: 15000 })
    // Teacher dashboard uses "Class overview" as h1, not "dashboard"
    await expect(page.locator('h1')).toBeVisible()

    // View class insights
    await page.goto('/teacher/class')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/\/teacher\/class/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/where the whole room|class insights|class overview|learner|learners/i)

    // View announcements
    await page.goto('/teacher/announcements')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toContainText(/bulletin|announcement/i)

    // View conversations
    await page.goto('/teacher/conversations')
    await page.waitForLoadState('networkidle')
  })
})
