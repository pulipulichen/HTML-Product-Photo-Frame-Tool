import { test, expect } from '@playwright/test';

function createPngBuffer() {
  return Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wn7SxgAAAAASUVORK5CYII=',
    'base64'
  );
}

test('uploads an image file and updates drop zone text', async ({ page }) => {
  await page.goto('/');

  await page.locator('#bottomFile').setInputFiles({
    name: 'sample.png',
    mimeType: 'image/png',
    buffer: createPngBuffer()
  });

  await expect(page.locator('#dropZoneText')).toContainText('已載入圖片');
  await expect(page.locator('#dropZoneText .file-name')).toHaveText('sample.png');

  const persistedBottomImageUrl = await page.evaluate(() => localStorage.getItem('bottomImageUrl'));
  expect(persistedBottomImageUrl).toContain('data:image/png;base64');
});

test('shows alert for non-image uploads', async ({ page }) => {
  await page.goto('/');

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toBe('請放入圖片檔案！');
    await dialog.accept();
  });

  await page.locator('#bottomFile').setInputFiles({
    name: 'not-image.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('not an image')
  });
});

test('updates scale and fit mode, then keeps settings after reload', async ({ page }) => {
  await page.goto('/');

  await page.locator('#bottomScale').fill('150');
  await expect(page.locator('#bottomScaleValue')).toHaveText('150%');

  await page.locator('input[name="fitMode"][value="height"]').check();
  await expect(page.locator('input[name="fitMode"][value="height"]')).toBeChecked();

  await page.reload();
  await expect(page.locator('#bottomScale')).toHaveValue('150');
  await expect(page.locator('#bottomScaleValue')).toHaveText('150%');
  await expect(page.locator('input[name="fitMode"][value="height"]')).toBeChecked();

  const persistedFitMode = await page.evaluate(() => localStorage.getItem('fitMode'));
  const persistedBottomScale = await page.evaluate(() => localStorage.getItem('bottomScale'));
  expect(persistedFitMode).toBe('height');
  expect(persistedBottomScale).toBe('1.5');
});
