import { expect, test } from '@playwright/test';

test.describe('Tracing Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Numbers' }).click();
    await page.getByRole('listitem').first().click();
  });

  test('should display canvas and controls', async ({ page }) => {
    await expect(page.locator('canvas')).toBeVisible();
    await expect(
      page.getByRole('button', {
        name: 'Back to character selection',
        exact: true,
      })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /clear/i })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /previous/i })
    ).toBeDisabled();
    await expect(page.getByRole('button', { name: /next/i })).toBeEnabled();
  });

  test('should show stroke progress indicator', async ({ page }) => {
    const progress = page.locator('.progress-indicator');
    await expect(progress).toBeVisible();
    await expect(progress).toContainText('Stroke 1 of');
  });

  test('should navigate back to character selection', async ({ page }) => {
    // Back button navigates to category selection
    await page
      .getByRole('button', { name: 'Back to character selection', exact: true })
      .click();
    await expect(page.locator('h1')).toContainText('Select a Category');
  });

  test('should enable Previous button on second character', async ({
    page,
  }) => {
    // Go back to character grid and select second character
    await page
      .getByRole('button', { name: 'Back to character selection', exact: true })
      .click();
    // Now we need to navigate to the character selection screen
    await page.getByRole('button', { name: 'Numbers' }).click();
    await page.getByRole('listitem').nth(1).click();

    // Previous should be enabled
    await expect(page.getByRole('button', { name: /previous/i })).toBeEnabled();
  });
});
