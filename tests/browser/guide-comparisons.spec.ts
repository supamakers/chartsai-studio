import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { comparisonIds } from '../../src/lib/guide-ids';
import { guideComparison, guideEditorPath } from '../../src/lib/guide-comparisons';
import { parseText } from '../../src/lib/data';
import { irisSpeciesSpec } from '../../src/lib/iris-comparison';

for (const id of comparisonIds)
  for (const [view, item] of guideComparison(id).views.entries()) {
    if (!item.editor) continue;
    const spec = item.editor;
    test(`${id} view ${view} retains exact editor data and CSV`, async ({ page }) => {
      await page.goto(`/guides/${id}/`);
      await page
        .locator('.comparison-figures figure')
        .nth(view)
        .getByRole('link', { name: 'Edit this view →' })
        .click();
      await expect(page.locator('[data-chart-ready="true"], [data-stat-ready="true"]')).toBeVisible();
      await expect(
        page
          .getByRole('paragraph')
          .filter({ hasText: /Guide comparison loaded/ })
          .first(),
      ).toBeVisible();
      if (spec.kind !== 'dot') await page.getByLabel('Download format', { exact: true }).selectOption('csv');
      const downloading = page.waitForEvent('download');
      await page
        .getByRole('button', { name: spec.kind === 'dot' ? 'Data CSV' : 'Download', exact: true })
        .click();
      const data = parseText(await readFile((await (await downloading).path())!, 'utf8'));
      expect(data).toEqual(
        spec.kind === 'dot' ? [[spec.label], ...spec.values.map((v) => [String(v)])] : spec.table,
      );
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBe(`https://www.chartsai.com${guideEditorPath(id, view, spec).split('?')[0]}`);
    });
  }
test('comparison resources work without JavaScript on small screens', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 800 },
  });
  const page = await context.newPage();
  for (const id of comparisonIds) {
    await page.goto(`/guides/${id}/`);
    await expect(page.locator('.comparison-figures img')).toHaveCount(2);
    for (const img of await page.locator('.comparison-figures img').all())
      await expect(img).toHaveJSProperty('naturalWidth', 800);
    await page.getByText('Inspect the original data and method', { exact: true }).click();
    await expect(page.locator('.comparison-data table')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const downloading = page.waitForEvent('download');
    await page
      .locator('.comparison-downloads')
      .first()
      .getByRole('link', { name: 'CSV', exact: true })
      .click();
    expect(parseText(await readFile((await (await downloading).path())!, 'utf8')).length).toBeGreaterThan(2);
  }
  await context.close();
});
test('Iris species view exports all projected source observations', async ({ page }) => {
  await page.goto('/datasets/iris/');
  await page.getByRole('link', { name: 'Edit this grouped box plot →', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: /UCI Iris loaded: all 150/ })).toBeVisible();
  await expect(page.locator('[data-chart-ready="true"], [data-stat-ready="true"]')).toBeVisible();
  await page.getByLabel('Download format', { exact: true }).selectOption('csv');
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download', exact: true }).click();
  expect(parseText(await readFile((await (await downloading).path())!, 'utf8'))).toEqual(
    irisSpeciesSpec(parseText(await readFile('public/datasets/assets/iris.csv', 'utf8'))).table,
  );
});
