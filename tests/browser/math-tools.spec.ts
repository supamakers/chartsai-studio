import { test, expect, type Page } from '@playwright/test';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
const routes = [
  'number-line-generator',
  'slope-calculator',
  'geometry-transformation-calculator',
  'quadratic-graph-calculator',
];
async function save(page: Page) {
  const event = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download free', exact: true }).click();
  const d = await event;
  return { name: d.suggestedFilename(), bytes: await readFile((await d.path())!) };
}
for (const route of routes)
  test(`${route}: editable practice, real PDF/SVG/PNG/CSV and responsive journey`, async ({ page }) => {
    await page.goto(`/${route}/`);
    await expect(page.getByRole('button', { name: 'Download free', exact: true })).toBeEnabled();
    await expect(page.getByRole('region', { name: 'Worked solution' })).toBeVisible();
    await page.getByRole('combobox', { name: 'Learning mode', exact: true }).selectOption('practice');
    await expect(page.getByRole('region', { name: 'Worked solution' })).toHaveCount(0);
    await expect(page.locator('.coordinate-data')).toHaveCount(0);
    const question = await page.locator('.coordinate-drawing').innerHTML();
    await page.getByRole('button', { name: 'Reveal answers', exact: true }).click();
    await expect(page.getByRole('region', { name: 'Worked solution' })).toBeVisible();
    expect(await page.locator('.coordinate-drawing').innerHTML()).not.toBe(question);
    for (const paper of ['a4', 'letter']) {
      await page.getByRole('combobox', { name: 'Paper size', exact: true }).selectOption(paper);
      const file = await save(page),
        pdf = file.bytes.toString('latin1');
      expect(pdf).toMatch(/^%PDF-/);
      expect(pdf).toMatch(/\/Count 2\b/);
      expect(pdf).toMatch(paper === 'a4' ? /\/MediaBox \[0 0 595\.2/ : /\/MediaBox \[0 0 612\b/);
      await mkdir('artifacts/math-downloads', { recursive: true });
      await writeFile(`artifacts/math-downloads/${file.name}`, file.bytes);
    }
    await page.getByRole('button', { name: 'Hide answers', exact: true }).click();
    await page.getByRole('combobox', { name: 'Download format', exact: true }).selectOption('svg');
    const svg = (await save(page)).bytes.toString();
    expect(svg).toContain('<svg');
    expect(svg).not.toContain('NaN');
    if (route === 'geometry-transformation-calculator') expect(svg).not.toContain('data-image-point');
    await page.getByRole('combobox', { name: 'Download format', exact: true }).selectOption('png');
    const png = (await save(page)).bytes;
    expect(png.subarray(1, 4).toString()).toBe('PNG');
    expect(png.readUInt32BE(16)).toBe(2160);
    expect(png.readUInt32BE(20)).toBe(2160);
    await page.getByRole('combobox', { name: 'Download format', exact: true }).selectOption('csv');
    expect((await save(page)).bytes.toString()).toContain(',');
    await page.getByRole('combobox', { name: 'Try an example', exact: true }).selectOption('1');
    await expect(page.getByRole('button', { name: 'Reveal answers', exact: true })).toBeVisible();
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    }
  });
test('number line edits preserve fractions and repeated observations; invalid jumps stop downloads', async ({
  page,
}) => {
  await page.goto('/number-line-generator/');
  await page.getByRole('combobox', { name: 'Number-line activity', exact: true }).selectOption('points');
  await page.getByRole('textbox', { name: /Point values/ }).fill('1/2,0,1/2,-2');
  await page.getByRole('combobox', { name: 'Download format', exact: true }).selectOption('csv');
  expect((await save(page)).bytes.toString()).toBe(
    '"Position","Value"\r\n"A","0.5"\r\n"B","0"\r\n"C","0.5"\r\n"D","-2"',
  );
  await page.getByRole('combobox', { name: 'Number-line activity', exact: true }).selectOption('jumps');
  await page.getByRole('textbox', { name: /Jump size/ }).fill('10');
  await expect(page.getByRole('alert')).toContainText('fit inside');
  await expect(page.getByRole('button', { name: 'Download free', exact: true })).toBeDisabled();
});
test('slope explains vertical, rejects identical points and updates with keyboard slider', async ({
  page,
}) => {
  await page.goto('/slope-calculator/');
  await page.getByRole('combobox', { name: 'Try an example', exact: true }).selectOption('3');
  await expect(page.locator('.math-answer')).toContainText('undefined');
  await page.getByRole('textbox', { name: 'B: Y', exact: true }).fill('-4');
  await expect(page.getByRole('alert')).toContainText('two different points');
  await page.getByRole('combobox', { name: 'Try an example', exact: true }).selectOption('0');
  const slider = page.getByRole('slider', { name: 'Move point B vertically' });
  await slider.focus();
  await slider.press('ArrowRight');
  await expect(page.getByRole('textbox', { name: 'B: Y', exact: true })).toHaveValue('3.5');
  await expect(page.locator('.math-answer')).toContainText('3/4');
  await page.getByRole('textbox', { name: 'B: Y', exact: true }).fill('1/2');
  await expect(slider).toHaveValue('0.5');
});
test('transformation replacement and correspondence are exact, and changed inputs re-hide answers', async ({
  page,
}) => {
  await page.goto('/geometry-transformation-calculator/');
  await page.getByRole('combobox', { name: 'Transformation', exact: true }).selectOption('reflect');
  await page.getByRole('combobox', { name: 'Reflect across', exact: true }).selectOption('y');
  await page.getByRole('textbox', { name: 'Polygon vertices', exact: true }).fill('A,0,0\nB,3,0\nC,0,2');
  await expect(page.locator('.coordinate-drawing [data-image-point]')).toHaveCount(3);
  await page.getByRole('combobox', { name: 'Download format', exact: true }).selectOption('csv');
  expect((await save(page)).bytes.toString()).toContain('"B","3","0","-3","0"');
  await page.getByRole('combobox', { name: 'Learning mode', exact: true }).selectOption('practice');
  await page.getByRole('button', { name: 'Reveal answers', exact: true }).click();
  await page.getByRole('combobox', { name: 'Reflect across', exact: true }).selectOption('diagonal');
  await expect(page.locator('.coordinate-drawing [data-image-point]')).toHaveCount(0);
});
test('quadratic states remain meaningful for zero, repeated and absent roots', async ({ page }) => {
  await page.goto('/quadratic-graph-calculator/');
  await page.getByRole('combobox', { name: 'Try an example', exact: true }).selectOption('1');
  await expect(page.locator('.math-answer')).toContainText('Repeated real root: 2');
  await page.getByRole('combobox', { name: 'Try an example', exact: true }).selectOption('2');
  await expect(page.locator('.math-answer')).toContainText('No real roots');
  await page.getByRole('textbox', { name: /a: quadratic coefficient/ }).fill('0');
  await expect(page.getByRole('alert')).toContainText('this is a line');
  await expect(page.getByRole('button', { name: 'Download free', exact: true })).toBeDisabled();
});
test('all four pages supply static answers and valid ready-made worksheets without JavaScript', async ({
  browser,
  request,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const route of routes) {
    await page.goto(`/${route}/`);
    await expect(page.getByRole('heading', { name: 'Understand the result' })).toBeVisible();
    const link = page.getByRole('link', { name: 'A4 worksheet + answers ↓', exact: true });
    const response = await request.get((await link.getAttribute('href'))!);
    expect(response.ok()).toBe(true);
    expect((await response.body()).toString('latin1')).toMatch(/\/Count 2\b/);
  }
  await context.close();
});
