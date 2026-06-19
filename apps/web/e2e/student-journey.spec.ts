import { test, expect, type Page } from '@playwright/test'
import { installE2eApiMocks } from './e2e-mocks'

const TEST_EMAIL = `test-student-${Date.now()}@example.com`
const TEST_PASSWORD = 'TestPass123!'
const TEST_NAME = 'Test Student'

test.describe.configure({ mode: 'serial' })

test.describe('Student Journey', () => {
  test.beforeEach(async ({ page }) => {
    await installE2eApiMocks(page)
  })

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()
    await installE2eApiMocks(page)
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

  async function login(page: Page) {
    await page.goto('/auth/login')
    if (await page.locator('input[name="email"]').isVisible({ timeout: 3000 }).catch(() => false)) {
      await page.fill('input[name="email"]', TEST_EMAIL)
      await page.fill('input[name="password"]', TEST_PASSWORD)
      await page.click('button[type="submit"]')
    }
    await page.waitForURL(/\/student\/dashboard/, { timeout: 15000 })
    await expect(page.locator('h1')).toBeVisible()
  }

  async function openStudentPath(page: Page, path: string) {
    await page.locator(`a[href="${path}"]`).first().click({ timeout: 5000 })
    await expect(page).toHaveURL(new RegExp(path.replace(/\//g, '\\/')))
  }

  async function expectHeading(page: Page, pattern: RegExp) {
    try {
      await expect(page.getByRole('heading', { level: 1 })).toContainText(pattern)
    } catch (error) {
      const bodyText = await page.locator('body').innerText().catch(() => '<body unavailable>')
      throw new Error(
        [
          error instanceof Error ? error.message : String(error),
          `url=${page.url()}`,
          `body=${bodyText.slice(0, 1200)}`,
        ].join('\n'),
      )
    }
  }

  test('Register login check-in and diagnostic flow', async ({ page }) => {
    test.setTimeout(60000)

    await login(page)

    await openStudentPath(page, '/student/checkin')
    const moodButton = page.locator('button').filter({ hasText: /sunny|cloudy|rainy|stormy/i }).first()
    if (await moodButton.isVisible()) {
      await moodButton.click()
    }
    const noteInput = page.locator('textarea, input[placeholder*="note"i]').first()
    if (await noteInput.isVisible()) {
      await noteInput.fill('Feeling steady today.')
    }
    const submitBtn = page.locator('button[type="submit"], button').filter({ hasText: /save|check.?in|submit/i }).first()
    if (await submitBtn.isVisible()) {
      await submitBtn.click()
    }

    await openStudentPath(page, '/student/diagnostic')
    await expect(page.locator('h1')).toBeVisible()

  })

  test('Training route is reachable from dashboard', async ({ page }) => {
    const pageErrors: string[] = []
    page.on('pageerror', (error) => pageErrors.push(error.message))
    await login(page)
    await page.locator('main a[href="/student/training"]').first().click()
    await expect(page).toHaveURL(/\/student\/training/)
    try {
      await expect(page.locator('h1')).toContainText(/adventure/i)
    } catch (error) {
      const bodyText = await page.locator('body').innerText().catch(() => '<body unavailable>')
      throw new Error(
        [
          error instanceof Error ? error.message : String(error),
          `url=${page.url()}`,
          `pageErrors=${pageErrors.join(' | ') || '<none>'}`,
          `body=${bodyText.slice(0, 1200)}`,
        ].join('\n'),
      )
    }
  })

  test('Review notes route is reachable from dashboard', async ({ page }) => {
    await login(page)
    await openStudentPath(page, '/student/wrong-answers')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/wrong answers|review/i)
    await expect(page.locator('body')).toContainText(/review|revisit/i)
  })

  test('AI Tutor route smoke', async ({ page }) => {
    await login(page)
    await openStudentPath(page, '/student/ai-tutor')
    await expect(page).toHaveURL(/\/student\/ai-tutor/)
  })

  test('Heart journal and proud wall interactions', async ({ page }) => {
    test.setTimeout(60000)

    await login(page)
    await page.getByRole('link', { name: /heart space/i }).first().click()
    await expect(page).toHaveURL(/\/student\/heart/)
    await expectHeading(page, /heart space/i)

    await page.locator('button').filter({ hasText: /growth diary|diary|journal/i }).first().click()
    await expect(page).toHaveURL(/\/student\/heart\/journal/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/growth diary/i)
    await page.locator('textarea').first().fill('Today I practiced with patience.')
    await page.getByRole('button', { name: /^save$/i }).click()

    await login(page)
    await page.getByRole('link', { name: /heart space/i }).first().click()
    await expect(page).toHaveURL(/\/student\/heart/)
    await page.locator('button').filter({ hasText: /proud wall|proud/i }).first().click()
    await expect(page).toHaveURL(/\/student\/heart\/proud-wall/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/proud wall/i)
    await page.locator('input[placeholder*="achieve"i]').fill('I finished a review note')
    await page.getByRole('button', { name: /^share$/i }).click()
  })
})
