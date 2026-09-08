import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const routes = {
  line: '/line-graph-maker/?publication=1',
  bar: '/bar-chart-maker/?publication=1',
  dumbbell: '/dumbbell-chart-maker/',
  slopegraph: '/slopegraph-maker/',
  'small-multiples': '/small-multiples-chart-maker/',
};
for (const [kind, url] of Object.entries(routes))
  test(`${kind} publication exports preserve complete editable data`, async ({ page }) => {
    await page.goto(url);
    await expect(page.locator('.publication-preview[data-chart-ready="true"]')).toBeVisible();
    await page.getByLabel('Publication download format').selectOption('json');
    const pending = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download publication chart', exact: true }).click();
    const file = await pending;
    const p = JSON.parse(await readFile((await file.path())!, 'utf8'));
    expect(p.kind).toBe(kind);
    expect(p.version).toBe(1);
    expect(p.table.length).toBe(kind === 'line' ? 67 : kind === 'small-multiples' ? 25 : 5);
    await page.getByRole('button', { name: 'Design & details', exact: true }).click();
    await page.getByLabel('Headline', { exact: true }).fill('Changed headline');
    await page
      .getByLabel('Open chart project file')
      .setInputFiles({
        name: 'saved.json',
        mimeType: 'application/json',
        buffer: Buffer.from(JSON.stringify(p)),
      });
    await expect(page.getByLabel('Headline', { exact: true })).toHaveValue(p.title);
    await page.getByLabel('Publication download format').selectOption('html');
    const htmlDownload = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download publication chart', exact: true }).click();
    const html = await readFile((await (await htmlDownload).path())!, 'utf8');
    expect(html).toContain('<table>');
    expect(html).not.toContain('<script');
    expect(html).toContain(p.table[1][1]);
  });
test('dumbbell upload uses explicit column mapping and keeps invalid drafts out of exports', async ({
  page,
}) => {
  await page.goto(routes.dumbbell);
  await expect(page.locator('.publication-preview[data-chart-ready="true"]')).toBeVisible();
  await page
    .getByLabel('Upload data file')
    .setInputFiles({
      name: 'newsroom.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from('Category,Before,After,Ignore\nNorth,-2,-9,10\nSouth,4,4,20'),
    });
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByLabel('Before', { exact: true }).check();
  await dialog.getByLabel('After', { exact: true }).check();
  await dialog.getByLabel('Ignore', { exact: true }).uncheck();
  // The numeric selection starts with one column; explicitly retain exactly Before and After.
  const create = dialog.getByRole('button', { name: /Create/ });
  await create.click();
  await expect(dialog).not.toBeVisible();
  await expect(page.locator('.publication-origin')).toContainText('2 rows');
  await page.getByRole('button', { name: 'Design & details', exact: true }).click();
  await expect(page.getByLabel('Source credit', { exact: true })).toHaveValue('');
  await page.getByRole('button', { name: /Edit values/ }).click();
  await page.getByLabel('Publication CSV data').fill('Category,Before,After\nNorth,2,');
  await expect(page.getByRole('button', { name: 'Download publication chart', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Apply data', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText(/number|characters/);
});
test('line hands off a supported AnimCharts project and rejects arbitrary project payloads', async ({
  page,
}) => {
  await page.goto(routes.line);
  await expect(page.locator('.publication-preview[data-chart-ready="true"]')).toBeVisible();
  await page.getByLabel('Publication download format').selectOption('animcharts');
  const d = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download publication chart', exact: true }).click();
  const p = JSON.parse(await readFile((await (await d).path())!, 'utf8'));
  expect(p.tool).toBe('editorial-line');
  expect(p.settings.annotations[0].date).toBe('2024');
  await page
    .getByLabel('Open chart project file')
    .setInputFiles({
      name: 'invalid.json',
      mimeType: 'application/json',
      buffer: Buffer.from('{"version":999}'),
    });
  await expect(page.getByRole('alert')).toContainText('version 1');
  await page.getByRole('button', { name: 'Design & details', exact: true }).click();
  await expect(page.getByLabel('Headline', { exact: true })).toHaveValue(
    'A warmer endpoint, with variation along the way',
  );
});
test('publication controls and complete dataset work on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(routes['small-multiples']);
  await expect(page.locator('.publication-preview[data-chart-ready="true"]')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await page.locator('.editorial-workspace .chart-stage').boundingBox())!.height).toBeGreaterThan(200);
  await page.getByText('View all 24 source rows', { exact: true }).click();
  await expect(page.locator('.publication-data tbody tr')).toHaveCount(24);
});

test('publication image and PDF exports have the chosen dimensions and retained annotation',async({page})=>{
 await page.goto(routes.line);await expect(page.locator('.publication-preview[data-chart-ready="true"]')).toBeVisible();
 for(const format of ['svg','png','pdf']){
  await page.getByLabel('Publication download format').selectOption(format);const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Download publication chart',exact:true}).click();const body=await readFile((await(await pending).path())!);
  if(format==='svg'){expect(body.toString()).toContain('width="1200"');expect(body.toString()).toContain('1.28°C above');}
  if(format==='png'){expect(body.readUInt32BE(16)).toBe(1200);expect(body.readUInt32BE(20)).toBe(900);}
  if(format==='pdf'){expect(body.toString('latin1')).toMatch(/\/MediaBox \[0 0 900\.? 675\.?\]/);expect(body.subarray(0,4).toString()).toBe('%PDF');}
 }
});
