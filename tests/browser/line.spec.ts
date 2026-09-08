import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('line import, validation, numeric spacing and real exports', async ({ page }) => {
  await page.goto('/line-graph-maker/');
  await expect(page.locator('[data-chart-ready="true"]')).toBeVisible();
  await page.getByRole('button', { name: 'Paste or import a spreadsheet' }).click();
  await page.getByLabel('Paste your data').fill('Minutes\tA\tB\n0\t0\t-5\n2\t12\t9\n20\t24\t18');
  await page.getByRole('button', { name: 'Preview paste' }).click();
  await page.getByRole('button', { name: 'Use 3 points' }).click();
  await page.getByRole('combobox', { name: /Horizontal spacing/ }).selectOption('number');
  await expect(page.locator('[data-chart-ready="true"]')).toBeVisible();
  const configDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'ECharts config' }).click();
  const config = JSON.parse(await readFile((await (await configDownload).path())!, 'utf8'));
  expect(config.xAxis.type).toBe('value');
  expect(config.series[0].data).toEqual([
    [0, 0],
    [2, 12],
    [20, 24],
  ]);
  expect(config.series[1].data[0]).toEqual([0, -5]);
  await page.getByLabel('A, point 2', { exact: true }).fill('');
  await expect(page.getByRole('alert')).toContainText('Missing values');
  await expect(page.getByRole('button', { name: 'Download', exact: true })).toBeDisabled();
  await page.getByLabel('A, point 2', { exact: true }).fill('12');
  await page.getByLabel('Point 2 label', { exact: true }).fill('0');
  await expect(page.getByRole('alert')).toContainText('strictly increasing');
  await page.getByLabel('Point 2 label', { exact: true }).fill('2');
  await page.getByRole('button', { name: 'Design & details' }).click();
  await page.getByLabel('Chart title', { exact: true }).fill('My <line> & values');
  await page.getByLabel('Download format').selectOption('svg');
  const svgDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download', exact: true }).click();
  const file = await svgDownload;
  expect(file.suggestedFilename()).toBe('line-graph.svg');
  const svg = await readFile((await file.path())!, 'utf8');
  expect(svg).toContain('My &lt;line&gt; &amp; values');
  expect(svg).not.toContain('fictional example');
  await page.getByLabel('Download format').selectOption('png');
  const pngDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download', exact: true }).click();
  const png = await readFile((await (await pngDownload).path())!);
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(800);
});

test('line page shows SSR example and fits narrow mobile screens; local analytics stays off', async ({
  page,
}) => {
  const analytics: string[] = [];
  page.on('request', (req) => {
    if (req.url().includes('plausible.io')) analytics.push(req.url());
  });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/line-graph-maker/?example=experiment');
    await expect(page.locator('[data-chart-ready="true"]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect(analytics).toEqual([]);
});
