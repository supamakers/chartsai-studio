import { test, expect } from '@playwright/test';
const routes = [
  '/',
  '/charts/',
  '/examples/',
  '/editorial-charts/',
  '/editorial-charts/dumbbell-examples/',
  '/editorial-charts/slopegraph-examples/',
  '/editorial-charts/small-multiples-examples/',
  '/dot-plot-maker/',
  '/dumbbell-chart-maker/',
  '/coordinate-plane-generator/',
  '/slope-calculator/',
  '/number-line-worksheets/',
  '/printables/habit-tracker/',
  '/guides/',
  '/datasets/',
  '/about/',
];
for (const width of [1440, 390, 320]) {
  test(`all page families share a readable identity at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    let reference: unknown;
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const nav = page.getByRole('navigation', { name: 'Main navigation' });
      await expect(nav.getByRole('link')).toHaveText(['Charts', 'Math tools', 'Printables', 'Examples']);
      for (const link of await nav.getByRole('link').all()) await expect(link).toBeVisible();
      const identity = await page.evaluate(() => {
        const logo = getComputedStyle(document.querySelector('.site-header .brand')!);
        const heading = getComputedStyle(document.querySelector('h1')!);
        const navigation = getComputedStyle(document.querySelector('.site-header nav')!);
        return {
          logoFont: logo.fontFamily,
          logoColor: logo.color,
          logoSize: logo.fontSize,
          headingFont: heading.fontFamily,
          headingColor: heading.color,
          navigationFont: navigation.fontFamily,
          paper: getComputedStyle(document.body).backgroundColor,
        };
      });
      if (!reference) reference = identity;
      expect(identity, route).toEqual(reference);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
    }
  });
}
