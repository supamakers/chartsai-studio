import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('the homepage demo opens the same example and style in the editor', async ({ page }) => {
  const scripts: string[] = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'script') scripts.push(request.url());
  });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Dot plot', exact: true })).toBeEnabled();
  await expect(page.locator('.hero-chart-preview')).toHaveAttribute('src', '/previews/radar-night.svg');
  await page.getByRole('button', { name: 'Dot plot', exact: true }).click();
  await page.getByRole('button', { name: 'Blueprint style' }).click();
  await expect(page.locator('.hero-chart-preview')).toHaveAttribute('src', '/previews/dot-ocean.svg');
  await expect
    .poll(() =>
      page
        .locator('.hero-chart-preview')
        .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
    )
    .toBe(true);
  expect(scripts.some((url) => /\/echarts[.-]/.test(url))).toBe(false);
  await page.getByRole('link', { name: 'Make this yours' }).click();
  await expect(page).toHaveURL(/dot-plot-maker\/\?example=scores&style=ocean#editor/);
  await expect(page.locator('#editor .canvas-status')).toContainText('Blueprint');
  await expect(page.locator('#editor .echart-view')).toHaveAttribute('data-observation-count', '48');
});

test('design settings reach SVG, PNG and reusable ECharts configuration', async ({ page }) => {
  await page.goto('/radar-chart-maker/');
  await page.getByRole('button', { name: 'Design & details' }).click();
  await page.getByRole('button', { name: 'After hours', exact: true }).click();
  await page.getByLabel('Canvas size').selectOption('wide');
  await page.getByLabel('Chart title').fill('Our two candidate profiles');
  await page.getByLabel('Subtitle', { exact: true }).fill('Same criteria. Same scale.');
  await page.getByLabel('Source or footnote').fill('Source: our internal assessment');
  await page.getByLabel('Use a circular grid').check();
  await expect(page.locator('#editor .echart-view')).toHaveAttribute('data-chart-ready', 'true');
  for (const format of ['svg', 'png']) {
    await page.getByLabel('Download format').selectOption(format);
    const event = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download', exact: true }).click();
    const download = await event;
    const buffer = await readFile((await download.path())!);
    if (format === 'svg') {
      expect(buffer.toString()).toContain('Our two candidate profiles');
      expect(buffer.toString()).toContain('Source: our internal assessment');
      expect(buffer.toString()).toContain('#202522');
    } else {
      expect(buffer.readUInt32BE(16)).toBe(1600);
      expect(buffer.readUInt32BE(20)).toBe(900);
    }
    await download.saveAs(`artifacts/echarts-radar.${format}`);
  }
  const event = page.waitForEvent('download');
  await page.getByRole('button', { name: 'ECharts config' }).click();
  const file = await event;
  const config = JSON.parse(await readFile((await file.path())!, 'utf8'));
  expect(config.series[0].type).toBe('radar');
  expect(config.radar.shape).toBe('circle');
  expect(config.series[0].data[0].value).toEqual([8, 9, 7, 8, 5, 8]);
});

test('invalid style query is ignored and custom data clears fictional source notes', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/dot-plot-maker/?style=toString');
  await expect(page.locator('#editor .echart-view')).toHaveAttribute('data-chart-ready', 'true');
  await page.getByRole('button', { name: 'Edit values', exact: true }).click();
  await page.getByLabel('Values', { exact: true }).fill('0\n1\n2');
  await page.getByRole('button', { name: 'Design & details' }).click();
  await expect(page.getByLabel('Source or footnote')).toHaveValue('');
  await page.getByLabel('Source or footnote').fill('Source: my measurements');
  await page.getByRole('button', { name: 'Design & details', exact: true }).click();
  await page.getByLabel('Values', { exact: true }).fill('0\n1\n3');
  await page.getByRole('button', { name: 'Design & details' }).click();
  await expect(page.getByLabel('Source or footnote')).toHaveValue('Source: my measurements');
  expect(errors).toEqual([]);
});

test('all public pages fit compact phones, tablets and desktop', async ({ page }) => {
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      '/',
      '/charts/',
      '/printables/',
      '/dot-plot-maker/',
      '/radar-chart-maker/',
      '/printables/habit-tracker/',
      '/about/',
      '/source/',
    ]) {
      await page.goto(path);
      await page.locator('h1').waitFor();
      if (await page.locator('.echart-view').count())
        await expect(page.locator('.echart-view')).toHaveAttribute('data-chart-ready', 'true');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      expect(overflow, `Horizontal overflow at ${width}px on ${path}`).toBe(false);
    }
  }
});

test('gallery charts scale inside their cards without cropping at phone and desktop widths', async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/', '/examples/']) {
      await page.goto(path);
      const charts = page.locator('.showcase-card > img');
      expect(await charts.count()).toBeGreaterThan(0);
      for (const img of await charts.all()) {
        const dimensions = await img.evaluate((el) => {
          const image = el.getBoundingClientRect(),
            card = el.parentElement!.getBoundingClientRect();
          return { imageWidth: image.width, imageHeight: image.height, cardWidth: card.width };
        });
        expect(dimensions.imageWidth).toBeLessThanOrEqual(dimensions.cardWidth);
        expect(dimensions.imageWidth / dimensions.imageHeight).toBeCloseTo(1.5, 1);
      }
    }
  }
});
