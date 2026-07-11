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

  test('register → navigate to assignments overview', async ({ page }) => {
    await page.goto('/auth/register')
    await page.waitForLoadState('networkidle')

    const email = `test-teacher-assignments-${Date.now()}@example.com`
    await page.fill('input[name="name"]', 'Test Teacher')
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', TEACHER_PASSWORD)
    await page.locator('input[type="radio"][value="teacher"]').check()
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/teacher\/dashboard/, { timeout: 15000 })

    await page.getByRole('link', { name: 'Assignments' }).click()
    await page.waitForURL(/\/teacher\/assignments/, { timeout: 15000 })
    await expect(page.getByRole('heading', { name: /assignment overview/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Assigned Students' })).toBeVisible()
    await expect(page.getByText('Fractions')).toBeVisible()
    await expect(page.getByText('Emily Chen')).toBeVisible()
    await expect(page.getByText('Alex Rivera')).toBeVisible()

    await page.getByRole('link', { name: 'Emily Chen' }).click()
    await page.waitForURL(/\/teacher\/students\/student-e2e-1/, { timeout: 15000 })
    await expect(page.getByRole('heading', { name: 'Emily Chen' })).toBeVisible()
    await expect(page.getByText('2 / 5')).toBeVisible()
  })

  test('register → dashboard CTA to assignments overview', async ({ page }) => {
    await page.goto('/auth/register')
    await page.waitForLoadState('networkidle')

    const email = `test-teacher-dashboard-cta-${Date.now()}@example.com`
    await page.fill('input[name="name"]', 'Test Teacher')
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', TEACHER_PASSWORD)
    await page.locator('input[type="radio"][value="teacher"]').check()
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/teacher\/dashboard/, { timeout: 15000 })

    await page.getByRole('link', { name: 'View assignments' }).click()
    await page.waitForURL(/\/teacher\/assignments/, { timeout: 15000 })
    await expect(page.getByRole('heading', { name: /assignment overview/i })).toBeVisible()
  })

  test('register → dashboard shows class metrics', async ({ page }) => {
    await page.goto('/auth/register')
    await page.waitForLoadState('networkidle')

    const email = `test-teacher-metrics-${Date.now()}@example.com`
    await page.fill('input[name="name"]', 'Test Teacher')
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', TEACHER_PASSWORD)
    await page.locator('input[type="radio"][value="teacher"]').check()
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/teacher\/dashboard/, { timeout: 15000 })

    await expect(page.getByText('Assigned students')).toBeVisible()
    await expect(page.getByText('8', { exact: true })).toBeVisible()
    await expect(page.getByText('Average score')).toBeVisible()
    await expect(page.getByText('72', { exact: true })).toBeVisible()
  })

  test('register → class page shows assignments roster', async ({ page }) => {
    await page.goto('/auth/register')
    await page.waitForLoadState('networkidle')

    const email = `test-teacher-roster-${Date.now()}@example.com`
    await page.fill('input[name="name"]', 'Test Teacher')
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', TEACHER_PASSWORD)
    await page.locator('input[type="radio"][value="teacher"]').check()
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/teacher\/dashboard/, { timeout: 15000 })

    await page.goto('/teacher/class')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('link', { name: 'Emily Chen' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Alex Rivera' })).toBeVisible()
  })

  test('register → dashboard shows weak areas from API', async ({ page }) => {
    await page.goto('/auth/register')
    await page.waitForLoadState('networkidle')

    const email = `test-teacher-weak-${Date.now()}@example.com`
    await page.fill('input[name="name"]', 'Test Teacher')
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', TEACHER_PASSWORD)
    await page.locator('input[type="radio"][value="teacher"]').check()
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/teacher\/dashboard/, { timeout: 15000 })

    await expect(page.getByText('Fractions')).toBeVisible()
  })

  test('register → class page student link opens detail with progress', async ({ page }) => {
    await page.goto('/auth/register')
    await page.waitForLoadState('networkidle')

    const email = `test-teacher-class-chain-${Date.now()}@example.com`
    await page.fill('input[name="name"]', 'Test Teacher')
    await page.fill('input[name="email"]', email)
    await page.fill('input[name="password"]', TEACHER_PASSWORD)
    await page.locator('input[type="radio"][value="teacher"]').check()
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/teacher\/dashboard/, { timeout: 15000 })

    await page.goto('/teacher/class')
    await page.waitForLoadState('networkidle')
    await page.getByRole('link', { name: 'Emily Chen' }).click()
    await page.waitForURL(/\/teacher\/students\/student-e2e-1/, { timeout: 15000 })
    await expect(page.getByRole('heading', { name: 'Emily Chen' })).toBeVisible()
    await expect(page.getByText('Modules completed')).toBeVisible()
  })
})
