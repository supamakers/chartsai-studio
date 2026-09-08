import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('file upload guides a new visitor from column selection to a matching download', async ({ page }) => {
  await page.goto('/dot-plot-maker/');
  await expect(page.getByRole('button', { name: 'Upload a file' })).toBeVisible();
  await expect(page.locator('.dot-data-badge')).toContainText('Sample data');
  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Upload a file' }).click();
  await (
    await chooser
  ).setFiles({
    name: 'waiting-times.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('Patient,Wait (minutes)\nA,0\nB,3\nC,3\nD,10'),
  });
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'Choose the values to plot' })).toBeVisible();
  await expect(dialog.getByLabel('Which column contains your values?')).toHaveValue('1');
  await expect(dialog.locator('.dot-import-ready')).toContainText('4 values');
  await dialog.getByRole('button', { name: 'Create dot plot with 4 values' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('.canvas-panel')).toBeFocused();
  await expect(page.locator('.dot-data-badge')).toHaveText('Your data');
  await expect(page.locator('.echart-view')).toHaveAttribute('data-observation-count', '4');
  await page.getByRole('button', { name: 'Design & details', exact: true }).click();
  await expect(page.getByLabel('Axis label', { exact: true })).toHaveValue('Wait (minutes)');
  await expect(page.getByLabel('Chart title', { exact: true })).toHaveValue('Your dot plot');
  await expect(page.getByLabel('Source or footnote')).toHaveValue('');
  await page.getByLabel('Download format').selectOption('svg');
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download', exact: true }).click();
  const file = await pending;
  const svg = await readFile((await file.path())!, 'utf8');
  expect(svg).toContain('Wait (minutes)');
  expect(svg).not.toContain('fictional');
  expect(svg).toContain('Your dot plot');
});

test('drag and drop preserves data until confirmation and keeps custom titles', async ({ page }) => {
  await page.goto('/dot-plot-maker/');
  await page.getByRole('button', { name: 'Design & details', exact: true }).click();
  await page.getByLabel('Chart title', { exact: true }).fill('Our waiting times');
  const data = await page.evaluateHandle(() => {
    const d = new DataTransfer();
    d.items.add(new File(['Value\n0\n2\n2'], 'values.csv', { type: 'text/csv' }));
    return d;
  });
  await page.locator('.dot-dropzone').dispatchEvent('drop', { dataTransfer: data });
  let dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('button', { name: 'Create dot plot with 3 values' })).toBeEnabled();
  await dialog.getByRole('button', { name: 'Close import' }).click();
  await expect(page.locator('.echart-view')).toHaveAttribute('data-observation-count', '48');
  await page.locator('.dot-dropzone').dispatchEvent('drop', { dataTransfer: data });
  dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Create dot plot with 3 values' }).click();
  await page.getByRole('button', { name: 'Design & details', exact: true }).click();
  await expect(page.getByLabel('Chart title', { exact: true })).toHaveValue('Our waiting times');
});

test('mobile paste explains invalid cells, enforces the limit and traps keyboard focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/dot-plot-maker/');
  const paste = page.getByRole('button', { name: 'Paste data', exact: true });
  const bounds = await paste.boundingBox();
  expect(bounds!.y + bounds!.height).toBeLessThan(844);
  await paste.click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Close import' }).focus();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: 'Choose file' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'Close import' })).toBeFocused();
  await dialog.getByLabel('Paste your data').fill('Score\n0\nmissing\n3');
  await dialog.getByRole('button', { name: 'Preview paste' }).click();
  await expect(dialog.getByRole('button', { name: 'Create dot plot with 3 values' })).toBeDisabled();
  await expect(dialog.getByRole('status')).toContainText('missing');
  await dialog.getByRole('button', { name: 'Choose different data' }).click();
  await dialog.getByLabel('Paste your data').fill(Array.from({ length: 301 }, (_, i) => i).join('\n'));
  await dialog.getByRole('button', { name: 'Preview paste' }).click();
  await expect(dialog.getByRole('status')).toContainText('up to 300 values');
  await expect(dialog.getByRole('button', { name: 'Create dot plot with 301 values' })).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(paste).toBeFocused();
  await expect(page.locator('.dot-data-badge')).toContainText('Sample data');
});
