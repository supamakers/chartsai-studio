import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import {statExamples} from '../../src/data/stat-examples';
import { examples } from '../../src/data/showcase';
import { showcaseGroups } from '../../src/lib/showcase-specs';
import { createChartOption, chartFrames } from '../../src/lib/chart-options';

for (const e of examples)
  test(`showcase ${e.slug} opens the exact chart configuration`, async ({ page }) => {
    await page.goto(`/examples/${e.slug}/`);
    await page.getByRole('link', { name: 'Edit this chart', exact: false }).click();
    await expect(page.locator('#editor [data-chart-ready="true"]')).toBeVisible();
    await expect(page.locator('#editor')).toContainText('Worked example loaded.');
    const pending = page.waitForEvent('download');
    await page.getByRole('button', { name: 'ECharts config' }).click();
    const actual = JSON.parse(await readFile((await (await pending).path())!, 'utf8'));
    const { width, height } = chartFrames[e.spec.frame];
    expect(actual).toEqual(JSON.parse(JSON.stringify(createChartOption(e.spec, width, height))));
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
      'href',
      `https://www.chartsai.com${showcaseGroups[e.spec.kind].tool}`,
    );
  });
test('gallery filters are keyboard usable and preserve direct links', async ({ page }) => {
  await page.goto('/examples/');
  await page.getByLabel('Find an example').fill('speed–time');
  await expect(page.locator('.showcase-card:visible')).toHaveCount(1);
  await page.getByLabel('Find an example').fill('');
  await page.getByLabel('Chart type').selectOption('dot');
  await expect(page.locator('.showcase-card:visible')).toHaveCount(6);
  await page.getByLabel('Find an example').fill('missingexample');
  await expect(page.locator('#example-empty')).toBeVisible();
});
test('all content and actual downloads work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/examples/');
  await expect(page.locator('.showcase-card')).toHaveCount(20+statExamples.length);
  await page.goto('/examples/dot-plot-fractions/');
  await expect(page.getByRole('heading', { name: 'How to read this chart' })).toBeVisible();
  await expect(page.locator('#data table tbody tr')).toHaveCount(10);
  for (const format of ['SVG', 'PNG', 'CSV', 'ECharts JSON']) {
    const d = page.waitForEvent('download');
    await page
      .locator('.example-downloads')
      .getByRole('link', { name: `${format}`, exact: true })
      .click();
    expect((await readFile((await (await d).path())!)).length).toBeGreaterThan(50);
  }
  await context.close();
});
test('gallery and examples fit mobile and desktop', async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      '/examples/',
      '/examples/speed-time-graph/',
      '/examples/competitor-analysis-radar-chart/',
    ]) {
      await page.goto(route);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${route} at ${width}`,
      ).toBe(true);
    }
  }
});
