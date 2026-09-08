import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { parseText } from '../../src/lib/data';
const cases = [
  { kind: 'dot', route: 'dot-plot-maker', name: 'dot plot', rows: [['0'], ['2'], ['2']] },
  { kind: 'histogram', route: 'histogram-maker', name: 'histogram', rows: [['0'], ['2'], ['2']] },
  {
    kind: 'box',
    route: 'box-plot-maker',
    name: 'box plot',
    rows: [
      ['First', '0'],
      ['Second', '2'],
      ['Third', '2'],
    ],
  },
  {
    kind: 'scatter',
    route: 'scatter-plot-maker',
    name: 'scatter plot',
    rows: [
      ['0', '5'],
      ['2', '7'],
      ['2', '9'],
    ],
  },
  {
    kind: 'bar',
    route: 'bar-chart-maker',
    name: 'bar chart',
    rows: [
      ['First', '0', '5'],
      ['Second', '2', '7'],
      ['Third', '2', '9'],
    ],
  },
  {
    kind: 'pareto',
    route: 'pareto-chart-maker',
    name: 'Pareto chart',
    rows: [
      ['First', '5'],
      ['Second', '7'],
      ['Third', '9'],
    ],
  },
  {
    kind: 'line',
    route: 'line-graph-maker',
    name: 'line graph',
    rows: [
      ['First', '0', '5'],
      ['Second', '2', '7'],
      ['Third', '2', '9'],
    ],
  },
  {
    kind: 'radar',
    route: 'radar-chart-maker',
    name: 'radar chart',
    rows: [
      ['First', '0', '5'],
      ['Second', '2', '7'],
      ['Third', '2', '9'],
    ],
  },
];
for (const c of cases)
  test(`${c.name}: mobile upload, explicit mapping, preview and exact CSV`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${c.route}/`);
    const upload = page.getByRole('button', { name: 'Upload a file' }),
      paste = page.getByRole('button', { name: 'Paste data', exact: true });
    await expect(upload).toBeVisible();
    await expect(paste).toBeVisible();
    const box = await paste.boundingBox();
    expect(box!.y + box!.height).toBeLessThan(844);
    await expect(page.getByRole('heading', { name: 'Add your data', exact: true })).toBeVisible();
    const chooser = page.waitForEvent('filechooser');
    await upload.click();
    await (
      await chooser
    ).setFiles({
      name: 'mixed-columns.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from('Ignored,Category,X,Y\ntext,First,0,5\ntext,Second,2,7\ntext,Third,2,9'),
    });
    const dialog = page.getByRole('dialog');
    if (c.kind === 'dot' || c.kind === 'histogram')
      await dialog.getByLabel('Which column contains your values?').selectOption('2');
    else if (c.kind === 'scatter') {
      await dialog.getByLabel('X column (horizontal)').selectOption('2');
      await dialog.getByLabel('Y column (vertical)').selectOption('3');
    } else if (c.kind === 'box') {
      await dialog.getByLabel('Group column (optional)').selectOption('1');
      await dialog.getByRole('combobox', { name: 'Value column', exact: true }).selectOption('2');
    } else if (c.kind === 'pareto') {
      await dialog.getByLabel('Category column').selectOption('1');
      await dialog.getByLabel('Measure column').selectOption('3');
    } else {
      await dialog
        .getByLabel(
          c.kind === 'radar'
            ? 'Which column names the dimensions?'
            : c.kind === 'line'
              ? 'Which column contains the labels or X values?'
              : 'Category column',
        )
        .selectOption('1');
      await dialog.getByRole('checkbox', { name: 'X', exact: true }).check();
      await dialog.getByRole('checkbox', { name: 'Y', exact: true }).check();
    }
    await dialog.getByRole('button', { name: new RegExp(`^Create ${c.name} with 3`) }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.locator('.canvas-panel')).toBeFocused();
    await expect(page.locator('.dot-data-badge')).toHaveText('Your data');
    await expect(page.getByRole('heading', { name: 'Download your chart', exact: true })).toBeVisible();
    let pending;
    if (['dot', 'radar', 'line'].includes(c.kind)) {
      pending = page.waitForEvent('download');
      await page.getByRole('button', { name: 'Data CSV', exact: true }).click();
    } else {
      await page.getByLabel('Download format').selectOption('csv');
      pending = page.waitForEvent('download');
      await page.getByRole('button', { name: 'Download', exact: true }).click();
    }
    const rows = parseText(await readFile((await (await pending).path())!, 'utf8'));
    expect(rows.slice(1)).toEqual(c.rows);
  });

test('box plot can import a numeric column without manufacturing group input', async ({ page }) => {
  await page.goto('/box-plot-maker/');
  await page.getByRole('button', { name: 'Paste data', exact: true }).click();
  const d = page.getByRole('dialog');
  await d.getByLabel('Paste your data').fill('Measurement\n0\n2\n2');
  await d.getByRole('button', { name: 'Preview paste' }).click();
  await expect(d.getByLabel('Group column (optional)')).toHaveValue('-1');
  await d.getByRole('button', { name: 'Create box plot with 3 values' }).click();
  await expect(page.locator('.stat-summary').first().locator('tbody tr')).toHaveCount(1);
  await expect(page.locator('.stat-summary').first()).toContainText('All values');
});

test('scatter requires distinct numeric X and Y and preserves the previous chart on cancel', async ({
  page,
}) => {
  await page.goto('/scatter-plot-maker/');
  await page.getByRole('button', { name: 'Paste data', exact: true }).click();
  const d = page.getByRole('dialog');
  await d.getByLabel('Paste your data').fill('Name,X,Y\nA,0,5\nB,2,9');
  await d.getByRole('button', { name: 'Preview paste' }).click();
  await d.getByLabel('Y column (vertical)').selectOption('1');
  await expect(d.getByRole('button', { name: 'Create scatter plot with 2 points' })).toBeDisabled();
  await expect(d.getByRole('status')).toContainText('different columns');
  await page.keyboard.press('Escape');
  await expect(page.locator('.dot-data-badge')).toContainText('Sample data');
  await expect(page.getByRole('button', { name: 'Paste data', exact: true })).toBeFocused();
});

test('category validation happens before replacement and is recoverable in the dialog', async ({ page }) => {
  await page.goto('/bar-chart-maker/');
  await page.getByRole('button', { name: 'Paste data', exact: true }).click();
  const d = page.getByRole('dialog');
  await d.getByLabel('Paste your data').fill('Category,Amount\nA,1\nA,2');
  await d.getByRole('button', { name: 'Preview paste' }).click();
  await d.getByRole('button', { name: 'Create bar chart with 2 categories' }).click();
  await expect(d.getByRole('alert')).toContainText('Aggregate repeated categories explicitly');
  await expect(page.locator('.dot-data-badge')).toContainText('Sample data');
  await d.getByRole('button', { name: 'Choose different data' }).click();
  await d.getByLabel('Paste your data').fill('Category,Amount\nA,1\nB,2');
  await d.getByRole('button', { name: 'Preview paste' }).click();
  await d.getByRole('button', { name: 'Create bar chart with 2 categories' }).click();
  await expect(d).toHaveCount(0);
});

test('radar declares its scale before importing larger scores', async ({ page }) => {
  await page.goto('/radar-chart-maker/');
  await page.getByRole('button', { name: 'Paste data', exact: true }).click();
  const d = page.getByRole('dialog');
  await d.getByLabel('Paste your data').fill('Dimension,Team\nQuality,80\nSpeed,60\nCost,70');
  await d.getByRole('button', { name: 'Preview paste' }).click();
  await expect(d.getByRole('button', { name: 'Create radar chart with 3 dimensions' })).toBeDisabled();
  await expect(d.getByRole('status')).toContainText('Scores must be between');
  await d.getByLabel('Shared scale: 0 to').fill('100');
  await d.getByRole('button', { name: 'Create radar chart with 3 dimensions' }).click();
  await expect(page.getByLabel('Shared scale: 0 to')).toHaveValue('100');
});

test('line imports European numeric X values with the same number convention as Y', async ({ page }) => {
  await page.goto('/line-graph-maker/');
  await page.getByRole('button', { name: 'Paste data', exact: true }).click();
  const d = page.getByRole('dialog');
  await d.getByLabel('Paste your data').fill('Time;Value\n1,5;10,5\n2,5;20,5');
  await d.getByRole('button', { name: 'Preview paste' }).click();
  await d.getByText('Row range & number format (optional)', { exact: true }).click();
  await d.getByLabel('Number format').selectOption('eu');
  await d.getByLabel('First selected row is a header').check();
  await d.getByRole('checkbox', { name: 'Value', exact: true }).check();
  await d.getByLabel('Horizontal spacing').selectOption('number');
  await d.getByRole('button', { name: 'Create line graph with 2 points' }).click();
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'ECharts config' }).click();
  const config = JSON.parse(await readFile((await (await pending).path())!, 'utf8'));
  expect(config.xAxis.type).toBe('value');
  expect(config.series[0].data).toEqual([
    [1.5, 10.5],
    [2.5, 20.5],
  ]);
});
