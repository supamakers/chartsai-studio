import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const route = '/coordinate-plane-generator/';
async function save(page: any) {
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download free', exact: true }).click();
  const d = await pending;
  return { name: d.suggestedFilename(), bytes: await readFile((await d.path())!) };
}
test('coordinate diagram: paste fractions and repeated points, then export exact CSV and real images', async ({
  page,
}) => {
  await page.goto(route);
  await page.getByText('Edit or paste points', { exact: true }).click();
  await page.getByRole('textbox', { name: 'Points', exact: true }).fill('Label,X,Y\nA,0,2\nB,1/2,3\nC,1/2,3');
  await expect(page.locator('.coordinate-drawing [data-point]')).toHaveCount(3);
  await page.getByRole('combobox', { name: 'Download format', exact: true }).selectOption('csv');
  expect((await save(page)).bytes.toString()).toBe('Label,X,Y\r\nA,0,2\r\nB,0.5,3\r\nC,0.5,3');
  await page.getByRole('combobox', { name: 'Download format', exact: true }).selectOption('svg');
  expect((await save(page)).bytes.toString()).toContain('B (0.5, 3)');
  await page.getByRole('combobox', { name: 'Download format', exact: true }).selectOption('png');
  const png = (await save(page)).bytes;
  expect(png.subarray(1, 4).toString()).toBe('PNG');
  expect(png.readUInt32BE(16)).toBe(2160);
  expect(png.readUInt32BE(20)).toBe(2160);
});
test('reading practice hides answers, reveals on demand and exports separate A4/Letter answer pages', async ({
  page,
}) => {
  await page.goto(route);
  await page.getByRole('combobox', { name: 'Activity', exact: true }).selectOption('read');
  await expect(page.locator('.coordinate-data')).not.toContainText('Quadrant I');
  await expect(page.locator('.coordinate-drawing')).not.toContainText('A (3, 4)');
  await page.getByRole('button', { name: 'Reveal answers', exact: true }).click();
  await expect(page.locator('.coordinate-drawing')).toContainText('A (3, 4)');
  for (const paper of ['a4', 'letter']) {
    await page.getByRole('combobox', { name: 'Paper size', exact: true }).selectOption(paper);
    const pdf = (await save(page)).bytes.toString('latin1');
    expect(pdf.startsWith('%PDF-')).toBe(true);
    expect(pdf).toMatch(/\/Count 2\b/);
    expect(pdf).toMatch(paper === 'a4' ? /\/MediaBox \[0 0 595\.2/ : /\/MediaBox \[0 0 612\b/);
  }
  await page.getByRole('checkbox', { name: 'Include separate answer key', exact: true }).uncheck();
  expect((await save(page)).bytes.toString('latin1')).toMatch(/\/Count 1\b/);
  await page.getByRole('button', { name: 'Hide answers', exact: true }).click();
  await expect(page.locator('.coordinate-data')).not.toContainText('Quadrant I');
});
test('plotting starts empty, and blank grid remains usable without points', async ({ page }) => {
  await page.goto(route);
  await page.getByRole('combobox', { name: 'Activity', exact: true }).selectOption('plot');
  await expect(page.locator('.coordinate-drawing [data-point]')).toHaveCount(0);
  await expect(page.locator('.coordinate-data')).toContainText('3');
  await page.getByRole('button', { name: 'Reveal answers', exact: true }).click();
  await expect(page.locator('.coordinate-drawing [data-point]')).toHaveCount(5);
  await page.getByRole('combobox', { name: 'Activity', exact: true }).selectOption('blank');
  await expect(page.locator('.coordinate-data')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Download free', exact: true })).toBeEnabled();
  expect((await save(page)).bytes.toString('latin1')).toMatch(/\/Count 1\b/);
});
test('invalid points and limits pause export until corrected; equal scale survives different ranges', async ({
  page,
}) => {
  await page.goto(route);
  await page.getByText('Edit or paste points', { exact: true }).click();
  await page.getByRole('textbox', { name: 'Points', exact: true }).fill('A,-12,3');
  await expect(page.getByRole('alert')).toContainText('Outside this grid: A');
  await expect(page.getByRole('button', { name: 'Download free', exact: true })).toBeDisabled();
  await page.getByRole('textbox', { name: 'Points', exact: true }).fill('A,1,1\nB,2,1\nC,1,2');
  await page.getByText('Adjust axes & grid', { exact: true }).click();
  await page.getByRole('spinbutton', { name: 'Y maximum', exact: true }).fill('5');
  const coordinates = await page
    .locator('.coordinate-drawing circle')
    .evaluateAll((nodes) => nodes.map((n) => [Number(n.getAttribute('cx')), Number(n.getAttribute('cy'))]));
  expect(coordinates[1][0] - coordinates[0][0]).toBeCloseTo(coordinates[0][1] - coordinates[2][1]);
  await page.getByRole('spinbutton', { name: 'X minimum', exact: true }).fill('');
  await expect(page.getByRole('alert')).toContainText('Axis limits');
  await expect(page.getByRole('button', { name: 'Download free', exact: true })).toBeDisabled();
});
test('math activity fits mobile and desktop, with working example reset', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(route);
    await expect(page.getByRole('combobox', { name: 'Activity', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    await page.getByRole('combobox', { name: 'Try a worked example', exact: true }).selectOption('triangle');
    await expect(page.locator('.coordinate-drawing [data-point]')).toHaveCount(3);
    await expect(page.locator('.coordinate-drawing polyline')).toHaveCount(1);
    await expect(page.getByRole('alert')).toHaveCount(0);
  }
});
test('static answer, original example and ready PDFs remain usable without JavaScript', async ({
  browser,
  request,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(route);
  await expect(page.getByRole('heading', { name: 'Questions before you download' })).toBeVisible();
  await expect(page.locator('img[alt^="A at"]')).toBeVisible();
  const links = await page
    .locator('a[href^="/coordinate/assets/"]')
    .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('href')!));
  expect(links.filter((h) => h.endsWith('.pdf'))).toHaveLength(6);
  for (const link of links.filter((h) => h.endsWith('.pdf'))) {
    const r = await request.get(link);
    expect(r.status()).toBe(200);
    const pdf = (await r.body()).toString('latin1');
    expect(pdf).toMatch(link.includes('triangle') ? /\/Count 2\b/ : /\/Count 1\b/);
  }
  expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe(
    'https://www.chartsai.com/coordinate-plane-generator/',
  );
  await context.close();
});
