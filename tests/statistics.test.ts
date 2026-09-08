import { it, expect } from 'vitest';
import { readFile } from 'node:fs/promises';
import { histogram, boxSummary, linearFit, analyzeStat, statOption } from '../src/lib/statistics';
import { statPresets, statPresetIds } from '../src/lib/stat-presets';
import { statExamples } from '../src/data/stat-examples';
import { datasets, datasetSpec } from '../src/data/datasets';
import { parseText } from '../src/lib/data';
import { analyticsUrl, usageEvent, showcaseDownloadEvent } from '../src/lib/analytics-policy';
const a = (id: keyof typeof statPresets) => analyzeStat(statPresets[id]);
it('bins exact boundaries once, includes the maximum, and preserves empty intervals', () => {
  expect(histogram([0, 2, 4, 5, 5, 7, 9, 10, 10, 12, 14, 15], 3, '0', '5').map((b) => b.count)).toEqual([
    3, 4, 5,
  ]);
  expect(a('histogram-two-peaks').bins!.map((b) => b.count)).toEqual([0, 5, 3, 0, 0, 1, 7]);
  expect(histogram([0.1, 0.2, 0.3], 3, '0', '.1').map((b) => b.count)).toEqual([0, 1, 2]);
  expect(histogram([5, 5], 6).reduce((s, b) => s + b.count, 0)).toBe(2);
  expect(() => histogram([1, 100], 6, '0', '.1')).toThrow('50');
  expect(() => histogram([1, 2], 6, '2', '1')).toThrow('smallest');
});
it('checks every histogram story and its stated transformations', () => {
  const expected = [
    [2, 3, 4, 5, 4, 2],
    [9, 4, 1, 1, 1],
    [0, 5, 3, 0, 0, 1, 7],
    [3, 4, 5],
    [4, 6, 6, 4],
    [3, 4, 6, 3],
  ];
  statPresetIds
    .filter((id) => statPresets[id].kind === 'histogram')
    .forEach((id, i) => expect(a(id).bins!.map((b) => b.count)).toEqual(expected[i]));
  const waits = a('histogram-waiting-times').values!;
  expect(waits.reduce((s, n) => s + n, 0)).toBe(100);
  expect(boxSummary(waits).median).toBe(4);
  expect(
    analyzeStat({ ...statPresets['histogram-class-scores'], binWidth: '20' }).bins!.map((b) => b.count),
  ).toEqual([5, 9, 6]);
});
it('distinguishes quartile conventions, fences and actual whiskers', () => {
  const values = [2, 4, 7, 10, 16];
  expect(boxSummary(values, 'halves')).toMatchObject({ q1: 3, median: 7, q3: 13, iqr: 10 });
  expect(boxSummary(values)).toMatchObject({ q1: 4, median: 7, q3: 10, iqr: 6 });
  expect(a('box-plot-outlier').boxes![0]).toMatchObject({
    q1: 4,
    q3: 7,
    low: 2,
    high: 8,
    lowerFence: -0.5,
    upperFence: 11.5,
    outliers: [30],
  });
  expect(boxSummary([1, 1, 1, 1, 9])).toMatchObject({ iqr: 0, outliers: [9] });
  expect(boxSummary([2])).toMatchObject({ q1: 2, median: 2, q3: 2 });
  expect(a('box-plot-two-groups').boxes!.map((b) => [b.q1, b.median, b.q3, b.iqr])).toEqual([
    [11.75, 13.5, 15.25, 3.5],
    [11.5, 15, 18.5, 7],
  ]);
  expect(a('box-plot-equal-medians').boxes!.map((b) => [b.q1, b.median, b.q3])).toEqual([
    [9, 10, 11],
    [5.5, 10, 14.5],
  ]);
  expect(a('box-plot-range-whiskers').boxes!.map((b) => [b.low, b.high, b.outliers.length])).toEqual([
    [1, 20, 0],
    [2, 12, 0],
  ]);
});
it('checks the published regression arithmetic and undefined cases', () => {
  const positive = a('scatter-positive-correlation').fit!;
  expect(positive.slope).toBeCloseTo(25 / 21, 12);
  expect(positive.intercept).toBeCloseTo(9 / 14, 12);
  expect(positive.r).toBeCloseTo(50 / Math.sqrt(42 * 64), 12);
  const negative = a('scatter-negative-correlation').fit!;
  expect(negative.slope).toBeCloseTo(-62 / 42, 12);
  expect(negative.intercept).toBeCloseTo(10 + (62 / 42) * 4.5, 12);
  for (const id of ['scatter-curved-relationship', 'scatter-no-linear-correlation'] as const) {
    expect(a(id).fit!.slope).toBeCloseTo(0, 12);
    expect(a(id).fit!.r).toBeCloseTo(0, 12);
  }
  expect(a('scatter-curved-relationship').fit!.intercept).toBeCloseTo(60 / 9, 12);
  expect(
    linearFit([
      [1, 2],
      [1, 3],
    ]),
  ).toMatchObject({ slope: null, r: null, r2: null });
  expect(
    linearFit([
      [1, 2],
      [2, 2],
    ]),
  ).toMatchObject({ slope: 0, intercept: 2, r: null });
});
it('keeps bar amounts separate from percentage transformations and checks totals', () => {
  const p = statPresets['bar-percent-stacked'];
  expect(a('bar-percent-stacked').bars!.map((b) => b.plotted)).toEqual([
    [50, 25, 25],
    [25, 50, 25],
    [30, 30, 40],
  ]);
  expect(p.table[1]).toEqual(['Small group', '20', '10', '10']);
  expect(a('bar-grouped-comparison').bars!.reduce((s, b) => s + b.values[0], 0)).toBe(196);
  expect(a('bar-grouped-comparison').bars!.reduce((s, b) => s + b.values[1], 0)).toBe(218);
  expect(() =>
    analyzeStat({
      ...p,
      table: [
        ['Category', 'A'],
        ['Zero', '0'],
      ],
    }),
  ).toThrow('positive total');
  expect(() =>
    analyzeStat({
      ...p,
      table: [
        ['Category', 'A'],
        ['Negative', '-1'],
      ],
    }),
  ).toThrow('nonnegative');
});
it('sorts Pareto stably and validates its denominator without mutating input', () => {
  expect(a('pareto-support-requests').pareto!.map((p) => p.label)).toEqual([
    'Sign-in',
    'Setup',
    'Export',
    'Billing',
    'Other',
  ]);
  expect(a('pareto-support-requests').pareto![2].cumulative).toBe(80);
  expect(a('pareto-downtime-minutes').total).toBe(500);
  expect(a('pareto-downtime-minutes').pareto!.map((p) => p.cumulative)).toEqual([48, 72, 90, 96, 100]);
  expect(a('pareto-cost-priorities').pareto![1].cumulative).toBe(80);
  expect(a('pareto-equal-categories').pareto!.map((p) => p.label)).toEqual(['A', 'B', 'C', 'D', 'E']);
  expect(a('pareto-zero-category').pareto!.at(-1)!.cumulative).toBe(100);
  expect(() =>
    analyzeStat({
      ...statPresets['pareto-zero-category'],
      table: [
        ['Category', 'Value'],
        ['A', '0'],
      ],
    }),
  ).toThrow('positive total');
});
it('rejects incomplete, duplicate, oversized and ambiguous tables', () => {
  for (const table of [
    [
      ['X', 'Y'],
      ['1', ''],
    ],
    [
      ['X', 'Y'],
      ['1', 'oops'],
    ],
    [
      ['X', 'X'],
      ['1', '2'],
    ],
    [
      ['X', 'Y'],
      ['1', '2', '3'],
    ],
  ])
    expect(() => analyzeStat({ ...statPresets['scatter-positive-correlation'], table })).toThrow();
  expect(() =>
    analyzeStat({
      ...statPresets['bar-zero-category'],
      table: [
        ['Category', 'N'],
        ['A', '1'],
        ['A', '2'],
      ],
    }),
  ).toThrow('unique');
  expect(() =>
    analyzeStat({
      ...statPresets['histogram-class-scores'],
      table: [['Value'], ...Array.from({ length: 2001 }, () => ['1'])],
    }),
  ).toThrow('2,000');
});
it('all thirty complete examples have exact downloadable options and original CSV', async () => {
  expect(statExamples).toHaveLength(30);
  for (const e of statExamples) {
    const { chartFrames } = await import('../src/lib/chart-options');
    const { width, height } = chartFrames[e.spec.frame];
    expect(parseText(await readFile(`public/charts/assets/${e.id}.csv`, 'utf8'))).toEqual(e.spec.table);
    expect(JSON.parse(await readFile(`public/charts/assets/${e.id}.json`, 'utf8'))).toEqual(
      JSON.parse(JSON.stringify(statOption(e.spec, width, height))),
    );
    expect(showcaseDownloadEvent(`/charts/assets/${e.id}.csv`)?.props.tool).toBeTruthy();
    expect(analyticsUrl(`https://www.chartsai.com${e.url}?secret=hidden`)).toBe(
      `https://www.chartsai.com${e.url}`,
    );
  }
  expect(usageEvent({ tool: 'histogram', action: 'export', format: 'svg', data: 'SECRET' })).toEqual({
    name: 'Chart Download',
    props: { tool: 'histogram', format: 'svg' },
  });
});
it('public datasets retain complete source rows and declare exact plotted selections', async () => {
  expect(datasets.map((d) => d.rows)).toEqual([150, 178, 214, 210, 4177]);
  for (const d of datasets) {
    const full = parseText(await readFile(`public/datasets/assets/${d.id}.csv`, 'utf8'));
    const plot = parseText(await readFile(`public/datasets/assets/${d.id}-chart.csv`, 'utf8'));
    expect(full.length).toBe(d.rows + 1);
    expect(full[0]).toEqual(d.columns);
    expect(plot.length).toBe(d.chartRows + 1);
    expect(d.selectedRows.length).toBe(d.chartRows);
    expect(new Set(d.selectedRows).size).toBe(d.chartRows);
    for (let i = 1; i < plot.length; i++)
      expect(plot[i]).toEqual(plot[0].map((h) => full[d.selectedRows[i - 1]][full[0].indexOf(h)]));
    expect(analyzeStat(datasetSpec(d.id, plot)).points!.length).toBe(d.chartRows);
    expect(d.sha256).toMatch(/^[a-f0-9]{64}$/);
  }
});
it('tiny histogram boundaries retain nonzero labels', () => {
  const option = statOption({
    ...statPresets['histogram-class-scores'],
    table: [['Value'], ['0.00000001'], ['0.00000002']],
    binStart: '',
    binWidth: '',
    bins: 2,
  });
  expect(JSON.stringify(option.xAxis)).toContain('1e-8');
});
it('constant decimal variables stay undefined despite floating-point mean rounding', () => {
  expect(linearFit(Array.from({ length: 7 }, (_, i) => [0.1, i]))).toMatchObject({ slope: null, r: null });
  expect(linearFit(Array.from({ length: 7 }, (_, i) => [i, 0.1]))).toMatchObject({ slope: 0, r: null });
  expect(histogram([0, 0.14], 7, '0', '.02')).toHaveLength(7);
  expect(histogram([0, 1 - 1e-11, 2], 2, '0', '1').map((b) => b.count)).toEqual([2, 1]);
});
