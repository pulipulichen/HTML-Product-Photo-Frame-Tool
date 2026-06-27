import { test, expect } from '@playwright/test';

test('renders app shell and default controls', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('h2')).toHaveText('圖片合成與裁切');
  await expect(page.locator('#topUrl')).toBeVisible();
  await expect(page.locator('#dropZone')).toBeVisible();
  await expect(page.locator('#myCanvas')).toBeVisible();
  await expect(page.locator('#downloadBtn')).toBeVisible();

  await expect(page.locator('input[name="fitMode"][value="autoShort"]')).toBeChecked();
  await expect(page.locator('#bottomScale')).toHaveValue('100');
  await expect(page.locator('#bottomScaleValue')).toHaveText('100%');
});

test('persists top image url in local storage', async ({ page }) => {
  await page.goto('/');

  const topUrlInput = page.locator('#topUrl');
  const topImageUrl = 'https://example.com/frame.png';
  await topUrlInput.fill(topImageUrl);

  await expect(topUrlInput).toHaveValue(topImageUrl);

  await page.reload();
  await expect(page.locator('#topUrl')).toHaveValue(topImageUrl);

  const persistedTopImageUrl = await page.evaluate(() => localStorage.getItem('topImageUrl'));
  expect(persistedTopImageUrl).toBe(topImageUrl);
});
