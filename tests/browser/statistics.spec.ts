import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { statExamples } from '../../src/data/stat-examples';
import { statOption } from '../../src/lib/statistics';
import { chartFrames } from '../../src/lib/chart-options';
import { datasets, datasetSpec } from '../../src/data/datasets';
import { parseText } from '../../src/lib/data';
for (const e of statExamples)
  test(`new example ${e.id} hands off exact configuration`, async ({ page }) => {
    await page.goto(e.url);
    await page.getByRole('link', { name: 'Edit this chart', exact: false }).click();
    await expect(page.locator('[data-stat-ready=true]')).toBeVisible();
    await expect(page.getByRole('status')).toContainText('Worked example loaded');
    await page.getByLabel('Download format').selectOption('json');
    const event = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download', exact: true }).click();
    const actual = JSON.parse(await readFile((await (await event).path())!, 'utf8'));
    const { width, height } = chartFrames[e.spec.frame];
    expect(actual).toEqual(JSON.parse(JSON.stringify(statOption(e.spec, width, height))));
  });
for (const kind of ['histogram', 'box-plot', 'scatter-plot', 'bar-chart', 'pareto-chart'])
  test(`${kind} exports real image, PDF and CSV files`, async ({ page }) => {
    await page.goto(`/${kind}-maker/`);
    await expect(page.locator('[data-stat-ready=true]')).toBeVisible();
    for (const format of ['svg', 'png', 'pdf', 'csv']) {
      await page.getByLabel('Download format').selectOption(format);
      const event = page.waitForEvent('download');
      await page.getByRole('button', { name: 'Download', exact: true }).click();
      const b = await readFile((await (await event).path())!);
      if (format === 'png') {
        expect(b.subarray(1, 4).toString()).toBe('PNG');
        expect(b.readUInt32BE(16)).toBe(1200);
      } else if (format === 'pdf') expect(b.subarray(0, 5).toString()).toBe('%PDF-');
      else if (format === 'svg') expect(b.toString()).toContain('<svg');
      else expect(parseText(b.toString()).length).toBeGreaterThan(2);
    }
  });
for (const d of datasets)
  test(`UCI ${d.id} opens the exact declared selection`, async ({ page }) => {
    await page.goto(`/scatter-plot-maker/?dataset=${d.id}`);
    await expect(page.getByRole('status')).toContainText('UCI dataset selection loaded');
    await expect(page.locator('[data-stat-ready=true]')).toBeVisible();
    await page.getByLabel('Download format').selectOption('json');
    const event = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download', exact: true }).click();
    const actual = JSON.parse(await readFile((await (await event).path())!, 'utf8'));
    const spec = datasetSpec(
      d.id,
      parseText(await readFile(`public/datasets/assets/${d.id}-chart.csv`, 'utf8')),
    );
    expect(actual).toEqual(JSON.parse(JSON.stringify(statOption(spec))));
  });
test('invalid input is explained and user data clears the sample attribution', async ({ page }) => {
  await page.goto('/scatter-plot-maker/');
  await expect(page.locator('[data-stat-ready=true]')).toBeVisible();
  await page.getByRole('button', { name: 'Edit values', exact: true }).click();
  await page.getByLabel('Data table', { exact: true }).fill('X,Y\n1,\n2,3');
  await page.getByRole('button', { name: 'Apply data' }).click();
  await expect(page.getByRole('status')).toContainText('Missing values are not zero');
  await page.getByLabel('Data table', { exact: true }).fill('X,Y\n1,2\n2,4');
  await page.getByRole('button', { name: 'Apply data' }).click();
  await expect(page.getByRole('status')).toContainText('Every selected row');
  await page.getByLabel('Download format').selectOption('json');
  const event = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download', exact: true }).click();
  const text = await readFile((await (await event).path())!, 'utf8');
  expect(text).not.toContain('fictional');
});
test('new tools and static resources fit narrow and wide screens', async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      '/histogram-maker/',
      '/box-plot-maker/',
      '/scatter-plot-maker/',
      '/bar-chart-maker/',
      '/pareto-chart-maker/',
      '/examples/box-plots/box-plot-outlier/',
      '/guides/histogram-vs-bar-graph/',
      '/datasets/abalone/',
    ]) {
      await page.goto(route);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${route} at ${width}`,
      ).toBe(true);
    }
  }
});
test('new resources expose real content without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/examples/');
  await expect(page.locator('.showcase-card')).toHaveCount(50);
  await page.goto('/examples/histograms/histogram-bin-boundaries/');
  await expect(page.locator('#data table').first().locator('tbody tr')).toHaveCount(12);
  await page.goto('/datasets/iris/');
  await expect(page.getByRole('heading', { name: 'Source, version and reuse' })).toBeVisible();
  await context.close();
});
test('histogram import maps a European numeric column and includes every selected observation', async ({
  page,
}) => {
  await page.goto('/histogram-maker/');
  await expect(page.locator('[data-stat-ready=true]')).toBeVisible();
  await page.getByRole('button', { name: 'Paste data', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Paste your data').fill('Name;Value\nA;1,5\nB;0\nC;2,5');
  await dialog.getByRole('button', { name: 'Preview paste' }).click();
  await dialog.getByText('Row range & number format (optional)', { exact: true }).click();
  await dialog.getByLabel('Number format').selectOption('eu');
  await dialog.getByLabel('First selected row is a header').check();
  await dialog.getByLabel('Which column contains your values?').selectOption('1');
  await dialog.getByRole('button', { name: 'Create histogram with 3 values' }).click();
  await expect(page.getByRole('status')).toContainText('Every selected row');
  await page.getByRole('button', { name: 'Design & details', exact: true }).click();
  await page.getByLabel('Bin start').fill('');
  await page.getByLabel('Bin width').fill('');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await page.getByLabel('Download format').selectOption('csv');
  const event = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download', exact: true }).click();
  const rows = parseText(await readFile((await (await event).path())!, 'utf8'));
  expect(rows.slice(1)).toEqual([['1.5'], ['0'], ['2.5']]);
});
test('box plot spreadsheet import retains every grouped observation', async ({ page }) => {
  const XLSX = await import('xlsx');
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.aoa_to_sheet([
      ['Group', 'Value'],
      ['A', 1],
      ['A', 2],
      ['B', 3],
      ['B', 4],
    ]),
    'Observations',
  );
  await page.goto('/box-plot-maker/');
  await expect(page.locator('[data-stat-ready=true]')).toBeVisible();
  await page.getByRole('button', { name: 'Paste data', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.locator('input[type=file]').setInputFiles({
    name: 'groups.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: XLSX.write(book, { type: 'buffer', bookType: 'xlsx' }),
  });
  await dialog.getByRole('button', { name: 'Create box plot with 4 values' }).click();
  await expect(page.getByRole('status')).toContainText('Every selected row');
  await expect(page.locator('.stat-summary').first().locator('tbody tr')).toHaveCount(2);
});
