import { test, expect } from '@playwright/test';

test('the expanded library remains usable without JavaScript on a small phone', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 800 },
  });
  const page = await context.newPage();
  await page.goto('/');
  const launch = page.getByRole('navigation', { name: 'Choose what to make' });
  for (const [name, path] of [
    ['Make a chart', '/charts/'],
    ['Explore math tools', '/math-tools/'],
    ['Find a printable', '/printables/'],
  ]) {
    await expect(launch.getByRole('link', { name })).toBeVisible();
    await expect(launch.getByRole('link', { name })).toHaveAttribute('href', path);
  }
  await expect(page.locator('.home-directory li a')).toHaveCount(15);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  await launch.getByRole('link', { name: 'Explore math tools' }).click();
  await expect(page).toHaveURL(/\/math-tools\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('visible');
  await context.close();
});

test('keyboard focus connects each entry to its preview and reduced motion stays still', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const kind of ['chart', 'math', 'print']) {
    const link = page.locator(`[data-home-focus="${kind}"]`);
    await link.focus();
    await expect(link).toBeFocused();
    await expect(link.locator('svg')).toHaveCSS('transform', 'none');
    await expect(page.locator(`.home-${kind}-figure`)).toHaveCSS('box-shadow', /inset/);
  }
});
