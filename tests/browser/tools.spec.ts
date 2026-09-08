import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('dot plot preserves observations, validates missing data and exports real files', async ({ page }) => {
  await page.goto('/dot-plot-maker/?example=books');
  const editor = page.locator('#editor');
  await expect(editor.locator('.echart-view')).toHaveAttribute('data-chart-ready', 'true');
  await expect(editor.locator('.echart-view')).toHaveAttribute('data-observation-count', '12');
  await page.getByRole('button', { name: 'Edit values', exact: true }).click();
  await page.getByLabel('Values', { exact: true }).fill('0\n2\n2\n100');
  await expect(editor.locator('.echart-view')).toHaveAttribute('data-observation-count', '4');
  await expect(editor.locator('.stats-strip')).toContainText('26');
  for (const format of ['svg', 'png', 'pdf']) {
    await page.getByLabel('Download format').selectOption(format);
    const event = page.waitForEvent('download');
    await editor.getByRole('button', { name: 'Download', exact: true }).click();
    const download = await event;
    expect(download.suggestedFilename()).toBe(`dot-plot.${format}`);
    const bytes = await readFile((await download.path())!);
    if (format === 'svg') {
      const marks = (bytes.toString().match(/<path\b[^>]*ecmeta_data_index=[^>]*>/g) || []).filter(
        (p) => !p.includes('ecmeta_silent'),
      );
      expect(marks).toHaveLength(4);
    } else if (format === 'png') {
      expect(bytes.subarray(1, 4).toString()).toBe('PNG');
      expect(bytes.readUInt32BE(16)).toBe(1200);
      expect(bytes.readUInt32BE(20)).toBe(800);
    } else expect(bytes.subarray(0, 5).toString()).toBe('%PDF-');
    await download.saveAs(`artifacts/echarts-dot.${format}`);
  }
  await page.getByLabel('Values', { exact: true }).fill('1\n\n2');
  await expect(page.getByRole('alert')).toContainText('not a number');
  await expect(editor.getByRole('button', { name: 'Download', exact: true })).toBeDisabled();
});

test('import previews quoted European values, selects rows, and preserves zero', async ({ page }) => {
  await page.goto('/dot-plot-maker/');
  await page.getByRole('button', { name: 'Paste data', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Paste your data').fill('Name;Value\nA;1.234,50\nB;0\nTotal;1.234,50');
  await dialog.getByRole('button', { name: 'Preview paste' }).click();
  await dialog.getByText('Row range & number format (optional)', { exact: true }).click();
  await dialog.getByLabel('Number format').selectOption('eu');
  await dialog.getByLabel('First selected row is a header').check();
  await dialog.getByLabel('Which column contains your values?').selectOption('1');
  await dialog.getByLabel('End at row').fill('3');
  await dialog.getByRole('button', { name: 'Create dot plot with 2 values' }).click();
  await page.getByRole('button', { name: 'Edit values', exact: true }).click();
  await expect(page.getByLabel('Values', { exact: true })).toHaveValue('1234.5\n0');
  await expect(page.locator('#editor .echart-view')).toHaveAttribute('data-observation-count', '2');
});

test('XLSX sheet selection resets mapping and rejects missing values', async ({ page }) => {
  const XLSX = await import('xlsx');
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([['Score'], [3], [4]]), 'First');
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet([
      ['Name', 'Score'],
      ['A', 0],
      ['B', null],
      ['C', 5],
    ]),
    'Second',
  );
  await page.goto('/dot-plot-maker/');
  await page.getByRole('button', { name: 'Paste data', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.locator('input[type=file]').setInputFiles({
    name: 'scores.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }),
  });
  await dialog.getByLabel('Sheet', { exact: true }).selectOption('Second');
  await expect(dialog.getByRole('button', { name: 'Create dot plot with 3 values' })).toBeDisabled();
  await expect(dialog.getByRole('status')).toContainText('empty');
  await dialog.getByText('Row range & number format (optional)', { exact: true }).click();
  await dialog.getByLabel('End at row').fill('2');
  await dialog.getByRole('button', { name: 'Create dot plot with 1 value' }).click();
  await page.getByRole('button', { name: 'Edit values', exact: true }).click();
  await expect(page.getByLabel('Values', { exact: true })).toHaveValue('0');
});

test('radar presets, scale validation, and table import work', async ({ page }) => {
  await page.goto('/radar-chart-maker/?example=products');
  await page.getByRole('button', { name: 'Edit values', exact: true }).click();
  await expect(page.getByLabel('Series 1 name')).toHaveValue('Option A');
  await page.getByLabel('Shared scale: 0 to').fill('5');
  await expect(page.getByRole('alert')).toContainText('Scores must be between');
  await expect(page.getByRole('button', { name: 'Download', exact: true })).toBeDisabled();
  await page.getByLabel('Shared scale: 0 to').fill('10');
  await page.getByRole('button', { name: 'Paste data', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog
    .getByLabel('Paste your data')
    .fill('Dimension\tOne\tTwo\nDesign\t5\t8\nSpeed\t7\t6\nValue\t8\t9');
  await dialog.getByRole('button', { name: 'Preview paste' }).click();
  await dialog.getByLabel('Shared scale: 0 to').fill('10');
  await dialog.getByRole('button', { name: 'Create radar chart with 3 dimensions' }).click();
  await page.getByRole('button', { name: 'Edit values', exact: true }).click();
  await expect(page.getByLabel('Series 1 name')).toHaveValue('One');
  await expect(page.getByLabel('One, Design', { exact: true })).toHaveValue('5');
  await expect(page.locator('#editor .echart-view')).toHaveAttribute('data-chart-ready', 'true');
  await expect(page.locator('#editor .echart-live svg')).toBeVisible();
});

test('tracker honors leap years, weekly links, paper sizes and actual PDF output', async ({ page }) => {
  await page.goto('/printables/habit-tracker/?layout=week');
  await expect(page.locator('#editor [data-tracker-box]')).toHaveCount(42);
  await page.getByRole('button', { name: 'Monthly', exact: true }).click();
  await page.getByLabel('Month', { exact: true }).fill('2024-02');
  await page.getByLabel('Printable style', { exact: true }).selectOption('blueprint');
  await expect(page.locator('#editor [data-tracker-box]')).toHaveCount(174);
  for (const paper of ['A4', 'US Letter']) {
    await page.getByRole('button', { name: paper, exact: true }).click();
    const event = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download free PDF' }).click();
    const download = await event;
    const bytes = await readFile((await download.path())!);
    expect(bytes.subarray(0, 5).toString()).toBe('%PDF-');
    expect(bytes.length).toBeGreaterThan(10_000);
    expect(bytes.length).toBeLessThan(2_000_000);
    const media = bytes.toString('latin1').match(/\/MediaBox\s*\[0 0 ([\d.]+) ([\d.]+)\]/)!;
    expect(Number(media[1])).toBeCloseTo(paper === 'A4' ? 841.89 : 792, 0);
    expect(Number(media[2])).toBeCloseTo(paper === 'A4' ? 595.28 : 612, 0);
    await download.saveAs(`artifacts/tracker-${paper === 'A4' ? 'a4' : 'letter'}.pdf`);
  }
});

test('all main pages fit phone screens and ship meaningful HTML without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (const path of ['/', '/dot-plot-maker/', '/radar-chart-maker/', '/printables/habit-tracker/']) {
    await page.goto(path);
    await page.locator('h1').waitFor();
    if (path === '/') await expect(page.locator('.hero-chart-preview')).toBeVisible();
    else if (path !== '/printables/habit-tracker/')
      await expect(page.locator('.echart-view')).toHaveAttribute('data-chart-ready', 'true');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.screenshot({
      path: `artifacts/mobile-${path === '/' ? 'home' : path.split('/').filter(Boolean).at(-1)}.png`,
      fullPage: true,
    });
  }
  expect(errors).toEqual([]);
  await context.close();
  const noJS = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJS.newPage();
  await staticPage.goto('/');
  await expect(staticPage.locator('.hero-chart-preview')).toBeVisible();
  await expect
    .poll(() =>
      staticPage
        .locator('.hero-chart-preview')
        .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
    )
    .toBe(true);
  await staticPage.goto('/dot-plot-maker/');
  await expect(staticPage.locator('h1')).toContainText('Dot plot maker');
  await expect(staticPage.getByRole('heading', { name: 'What is a dot plot?' })).toBeVisible();
  await expect(staticPage.locator('.example-card')).toHaveCount(3);
  await noJS.close();
});
