import { it, expect } from 'vitest';
import { readFile } from 'node:fs/promises';
import { examples } from '../src/data/showcase';
import { showcaseSpecs, showcaseTable, findShowcase } from '../src/lib/showcase-specs';
import { validateLineTable } from '../src/lib/line-data';
import { parseDelimited, summarize } from '../src/lib/data';
import { createChartOption, chartFrames } from '../src/lib/chart-options';
import { analyticsUrl, showcaseDownloadEvent } from '../src/lib/analytics-policy';

it.each(examples)(
  '$slug: assets preserve every value and the editor accepts the specification',
  async (e) => {
    const spec = e.spec,
      table = showcaseTable(spec).map((row) => row.map(String));
    expect(parseDelimited(await readFile(`public/examples/assets/${e.slug}.csv`, 'utf8'), ',')).toEqual(
      table,
    );
    expect(JSON.parse(await readFile(`public/examples/assets/${e.slug}.json`, 'utf8'))).toEqual(
      JSON.parse(
        JSON.stringify(
          createChartOption(spec, chartFrames[spec.frame].width, chartFrames[spec.frame].height),
        ),
      ),
    );
    const png = await readFile(`public/examples/assets/${e.slug}.png`);
    expect(png.readUInt32BE(16)).toBe(chartFrames[spec.frame].width);
    expect(png.readUInt32BE(20)).toBe(chartFrames[spec.frame].height);
    const svg = await readFile(`public/examples/assets/${e.slug}.svg`, 'utf8');
    expect(svg).not.toMatch(/NaN|Infinity/);
    if (spec.kind === 'line') expect(validateLineTable(table, spec.xMode).error).toBe('');
    if (spec.kind === 'radar') {
      expect(spec.axes.length).toBeGreaterThanOrEqual(3);
      expect(spec.axes.length).toBeLessThanOrEqual(10);
      expect(
        spec.scores.every(
          (row) => row.length === spec.series.length && row.every((n) => n >= 0 && n <= spec.max),
        ),
      ).toBe(true);
    }
    expect(analyticsUrl(`https://www.chartsai.com/examples/${e.slug}/?private=secret`)).toBe(
      `https://www.chartsai.com/examples/${e.slug}/`,
    );
    expect(showcaseDownloadEvent(`/examples/assets/${e.slug}.csv`)?.props.format).toBe('csv');
  },
);
it('worked numerical claims agree with the published data', () => {
  const stats = (slug: keyof typeof showcaseSpecs) => {
    const s = showcaseSpecs[slug];
    if (s.kind !== 'dot') throw Error();
    const summary = summarize(s.values);
    if (!summary) throw Error('Empty sample');
    return summary;
  };
  expect(stats('dot-plot-mean-median').mean).toBe(2);
  expect(stats('dot-plot-with-outlier').mean).toBe(6);
  expect(stats('dot-plot-with-outlier').median).toBe(4);
  expect(stats('bimodal-dot-plot').mean).toBe(6);
  expect(stats('bimodal-dot-plot').median).toBe(6);
  expect(stats('skewed-dot-plot').mean).toBeCloseTo(68 / 15);
  const motion = showcaseSpecs['speed-time-graph'];
  const distance = motion.labels
    .slice(1)
    .reduce(
      (sum, x, i) =>
        sum + ((Number(x) - Number(motion.labels[i])) * (motion.values[i][0] + motion.values[i + 1][0])) / 2,
      0,
    );
  expect(distance).toBe(80);
  const breakeven = showcaseSpecs['break-even-chart'];
  expect(breakeven.labels[breakeven.values.findIndex((row) => row[0] === row[1])]).toBe('100');
  expect(showcaseSpecs['cumulative-frequency-graph'].values.map((row) => row[0])).toEqual([
    0, 4, 12, 22, 28, 30,
  ]);
});
it('unknown names and cross-tool examples never become arbitrary data or analytics identifiers', () => {
  for (const id of ['constructor', '__proto__', 'customer-secret']) expect(findShowcase(id)).toBeUndefined();
  expect(findShowcase('distance-time-graph', 'dot')).toBeUndefined();
  expect(showcaseDownloadEvent('/examples/assets/private-customer.csv')).toBeNull();
  expect(new Set(examples.map((e) => JSON.stringify(showcaseTable(e.spec))))).toHaveLength(20);
});
