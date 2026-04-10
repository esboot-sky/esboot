import { expect, test } from '@playwright/test';

test.describe('sp-base vite app', () => {
  test('renders the home page, applies styleName CSS Modules, and navigates to test page', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    await page.goto('/index.html');

    await expect(page).toHaveTitle('SP Base');
    await expect(page.getByText('module css233')).toBeVisible();
    await expect(page.getByText('Hello, TailwindCSS!')).toBeVisible();

    const moduleText = page.getByText('module css233');
    await expect(moduleText).toHaveCSS('color', 'rgb(0, 128, 0)');

    await page.getByRole('button', { name: 'To Test' }).click();
    await expect(page).toHaveURL(/\/test$/);
    await expect(page.getByText('B')).toBeVisible();
    await expect(page.getByRole('img')).toHaveAttribute('src', /v\.svg/);

    expect(consoleErrors).toEqual([]);
  });
});
