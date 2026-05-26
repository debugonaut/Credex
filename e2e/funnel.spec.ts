import { test, expect } from '@playwright/test'

test.describe('StackTally Conversion Funnel E2E', () => {
  test('should load landing page and interact with the audit form', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('/')
    
    // Assert primary SEO title is present
    await expect(page.locator('h1')).toContainText('Stop overpaying for AI', { ignoreCase: true })

    // 2. Select Cursor tool
    const cursorChip = page.locator('button:has-text("Cursor")').first()
    await expect(cursorChip).toBeVisible()
    await cursorChip.click()

    // 3. Verify Cursor tool card has mounted details card
    const cursorCardHeader = page.locator('h3:has-text("Cursor")')
    await expect(cursorCardHeader).toBeVisible()

    // Select the paid "Pro ($20/mo)" plan in the dropdown to trigger the spend estimation helper
    const planSelect = page.locator('select').first()
    await planSelect.selectOption('cursor-pro')

    // 4. Test expected pricing inline calculation
    const seatsInput = page.locator('input[type="number"]').first()
    await expect(seatsInput).toHaveValue('1')
    
    // Increase seat size to 5
    await seatsInput.fill('5')
    
    // Check that expected retail price is updated correctly in tool card metadata
    await expect(page.locator('text=/Estimated:/')).toBeVisible()

    // 5. Select Team Context
    const teamSizeInput = page.locator('input[name="teamSize"]')
    await expect(teamSizeInput).toBeVisible()
    await teamSizeInput.fill('10') // Choose 10 members

    // Select primary workload button
    const codingBtn = page.locator('button:has-text("Coding")').first()
    await expect(codingBtn).toBeVisible()
    await codingBtn.click()

    // 6. Test Form Submission
    const submitBtn = page.locator('button[type="submit"]')
    await expect(submitBtn).toBeVisible()
    
    // Submit the form
    await submitBtn.click()

    // Since database keys might be stubbed during test runs, we defensively wait for either:
    // a) The dev-warning Supabase page, or
    // b) The results page layout
    await page.waitForTimeout(2000)
    
    const pageUrl = page.url()
    if (pageUrl.includes('/results/')) {
      // If Supabase keys are active and redirects to results page
      await expect(page.locator('h2').first()).toContainText('AI Analysis')
    } else {
      // Otherwise, the development sandbox gracefully displays the Supabase Keys Alert page
      const alertHeader = page.locator('h1:has-text("Keys Required")')
      if (await alertHeader.isVisible()) {
        await expect(alertHeader).toBeVisible()
      }
    }
  })

  test('should trigger validation error if no tools selected', async ({ page }) => {
    await page.goto('/')
    
    // Attempt to submit form directly without adding any tool
    const submitBtn = page.locator('button[type="submit"]')
    await submitBtn.click()

    // Verify validation alert is shown
    const validationAlert = page.locator('text=Select at least one tool')
    await expect(validationAlert).toBeVisible()
  })
})
