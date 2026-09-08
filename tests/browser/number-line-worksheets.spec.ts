import { test, expect } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { initialWorksheet, worksheetCsv } from '../../src/lib/number-line-worksheets';
for (const pack of ['integers', 'fractions', 'jumps'] as const)
  test(`${pack}: preset handoff, fresh sets and real PDF export`, async ({ page }) => {
    test.setTimeout(90000);
    await page.goto(`/number-line-worksheets/?analytics=off&pack=${pack}#worksheet-generator`);
    await expect(page.getByRole('combobox', { name: 'Practice pack', exact: true })).toHaveValue(pack);
    const first = await page.getByTestId('worksheet-paper').innerHTML();
    await page.getByRole('button', { name: 'Preview answer key', exact: true }).click();
    expect(await page.getByTestId('worksheet-paper').innerHTML()).not.toBe(first);
    await page.getByRole('checkbox', { name: 'Include separate answer pages' }).uncheck();
    const event = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download worksheet PDF', exact: false }).click();
    const d = await event;
    const bytes = await readFile((await d.path())!);
    expect(bytes.toString('latin1')).toMatch(/\/Count 2\b/);
    expect(bytes.toString('latin1')).toMatch(/\/MediaBox \[0 0 595\.2/);
    await mkdir('artifacts/worksheet-downloads', { recursive: true });
    await writeFile(`artifacts/worksheet-downloads/${pack}-questions.pdf`, bytes);
    await page.getByRole('button', { name: 'Hide answers', exact: true }).click();
    expect(await page.getByTestId('worksheet-paper').innerHTML()).toBe(first);
    const csvEvent = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download questions & answers as CSV', exact: true }).click();
    const csv = await csvEvent;
    expect(await readFile((await csv.path())!, 'utf8')).toBe(worksheetCsv({ ...initialWorksheet, pack }));
    await page.getByRole('button', { name: 'Generate fresh questions', exact: false }).focus();
    await page.keyboard.press('Enter');
    expect(await page.getByTestId('worksheet-paper').innerHTML()).not.toBe(first);
    await page.getByRole('combobox', { name: 'Questions', exact: true }).selectOption('12');
    if (pack === 'fractions')
      await page.getByRole('combobox', { name: 'Fraction steps', exact: true }).selectOption('2');
    await page.getByRole('combobox', { name: 'Paper size', exact: true }).selectOption('letter');
    await page.getByRole('checkbox', { name: 'Include separate answer pages' }).check();
    await page.getByRole('button', { name: 'Page 4', exact: true }).click();
    await expect(page.getByTestId('worksheet-paper')).toContainText('12.');
    const fullEvent = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download worksheet PDF', exact: false }).click();
    const full = await fullEvent;
    const fullBytes = await readFile((await full.path())!);
    expect(fullBytes.toString('latin1')).toMatch(/\/Count 8\b/);
    expect(fullBytes.toString('latin1')).toMatch(/\/MediaBox \[0 0 612\b/);
    await writeFile(`artifacts/worksheet-downloads/${pack}-12-letter.pdf`, fullBytes);
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    }
    await page.getByRole('button', { name: 'Page 1', exact: true }).click();
    await page
      .locator('.worksheet-workbench')
      .screenshot({ path: `artifacts/worksheet-downloads/${pack}-desktop.png` });
  });
test('static packs work without JavaScript and contain matching four-page PDFs', async ({
  browser,
  request,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/number-line-worksheets/?analytics=off');
  await expect(page.locator('h1')).toContainText('Number line');
  for (const pack of ['integers', 'fractions', 'jumps'])
    for (const paper of ['a4', 'letter']) {
      const path = `/worksheets/assets/${pack}-${paper}.pdf`;
      await expect(page.locator(`a[href="${path}"]`)).toBeVisible();
      const response = await request.get(path);
      expect(response.ok()).toBe(true);
      expect((await response.body()).toString('latin1')).toMatch(/\/Count 4\b/);
    }
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://www.chartsai.com/number-line-worksheets/',
  );
  await context.close();
});
