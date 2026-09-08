import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { editorialExample } from '../src/data/editorial-examples';
import {
  editorialKinds,
  editorialOption,
  editorialValues,
  validateProject,
  parseProject,
  publicationHtml,
  animChartsProject,
} from '../src/lib/editorial';
import { renderOptionSvg } from '../src/lib/echarts';
import { analyticsUrl, usageEvent, showcaseDownloadEvent } from '../src/lib/analytics-policy';

describe('publication data and native projection', () => {
  for (const kind of editorialKinds)
    it(`${kind} keeps values through project and SVG export`, () => {
      const p = editorialExample(kind),
        restored = parseProject(JSON.stringify(p));
      expect(restored).toEqual(p);
      const svg = renderOptionSvg(editorialOption(p), 1200, 900);
      expect(svg).toContain('<svg');
      expect(svg).toContain('Source:');
      expect(svg).not.toMatch(/NaN|Infinity/);
      expect(editorialValues(p).flat().every(Number.isFinite)).toBe(true);
    });
  it('preserves pair order, negative endpoints and equal endpoints', () => {
    const p = {
      ...editorialExample('dumbbell'),
      table: [
        ['Category', 'Before', 'After'],
        ['Fall', '-2', '-9'],
        ['Equal', '4', '4'],
      ],
    };
    const o = editorialOption(p) as any;
    expect(o.series[0].data).toEqual([
      [-2, 0],
      [-9, 0],
    ]);
    expect(o.series[1].data).toEqual([
      [4, 1],
      [4, 1],
    ]);
    expect(o.xAxis.min).toBeLessThan(-9);
    expect(o.xAxis.max).toBeGreaterThan(4);
  });
  it('gives every panel exactly the same range and original rows', () => {
    const p = editorialExample('small-multiples'),
      o = editorialOption(p) as any;
    expect(new Set(o.yAxis.map((a: any) => `${a.min}:${a.max}`)).size).toBe(1);
    for (const axis of o.xAxis) {
      expect(axis.min).toBe('dataMin');
      expect(axis.max).toBe('dataMax');
      expect(axis.scale).toBe(true);
    }
    o.series.forEach((s: any, i: number) =>
      expect(s.data).toEqual(p.table.slice(1).map((row) => [Number(row[0]), Number(row[i + 1])])),
    );
  });
  it('anchors annotation to the exact numeric point, not a pixel location', () => {
    const p = editorialExample('line');
    for (const w of [1200, 1600]) {
      const o = editorialOption(p, w, 900) as any;
      expect(o.series[0].markPoint.data[0].coord).toEqual([2024, 1.28]);
    }
  });
  it('rejects incomplete, ragged, ambiguous and over-limit selections without mutating them', () => {
    const p = editorialExample('dumbbell');
    for (const table of [
      [
        ['X', 'A', 'B'],
        ['one', '2', ''],
      ],
      [
        ['X', 'A', 'B'],
        ['one', '2'],
      ],
      [
        ['X', 'A', 'B'],
        ['same', '1', '2'],
        ['same', '3', '4'],
      ],
      [
        ['X', 'A', 'B', 'C'],
        ['one', '1', '2', '3'],
      ],
    ]) {
      const copy = structuredClone(table);
      expect(() => validateProject({ ...p, table })).toThrow();
      expect(table).toEqual(copy);
    }
    expect(() =>
      validateProject({
        ...editorialExample('slopegraph'),
        table: [p.table[0], ...Array.from({ length: 13 }, (_, i) => [String(i), '1', '2'])],
      }),
    ).toThrow(/12/);
    expect(() =>
      validateProject({
        ...editorialExample('line'),
        table: [
          ['Year', 'Global'],
          ['2021', '1'],
          ['2020', '2'],
        ],
      }),
    ).toThrow(/increasing/);
  });
  it('rejects invalid JSON metadata and orphaned notes', () => {
    const p = editorialExample('line');
    expect(() => parseProject('{')).toThrow(/JSON/);
    expect(() => parseProject(JSON.stringify({ ...p, version: 2 }))).toThrow(/version 1/);
    expect(() => validateProject({ ...p, sourceUrl: 'javascript:alert(1)' })).toThrow(/HTTPS/);
    expect(() =>
      validateProject({ ...p, annotations: [{ label: 'missing', series: 'Global', text: 'x' }] }),
    ).toThrow(/existing/);
  });
  it('escapes all user text and produces script-free local HTML with exact data', () => {
    const p = {
      ...editorialExample('bar'),
      title: '<img src=x onerror=alert(1)>',
      caption: '"</figcaption><script>bad()</script>',
      sourceUrl: 'https://example.com/?q="test"',
    };
    const html = publicationHtml(p, renderOptionSvg(editorialOption(p)));
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('<table>');
    expect(html).toContain(p.table[1][1]);
    expect(html).not.toMatch(/plausible|<script\b|<iframe\b/);
  });
});
it('pinned source checksums and observations match the published selections', () => {
  const manifest = JSON.parse(readFileSync('public/editorial/data/manifest.json', 'utf8'));
  for (const [i, file] of ['worldbank-life-expectancy-source.json', 'nasa-temperature-source.csv'].entries())
    expect(
      createHash('sha256')
        .update(readFileSync(`public/editorial/data/${file}`))
        .digest('hex'),
    ).toBe(manifest.datasets[i].sha256);
  const original = JSON.parse(
    readFileSync('public/editorial/data/worldbank-life-expectancy-source.json', 'utf8'),
  )[1];
  const p = editorialExample('small-multiples');
  for (const row of p.table.slice(1))
    for (const [i, code] of ['IND', 'BRA', 'JPN', 'USA'].entries())
      expect(Number(row[i + 1])).toBe(
        original.find((r: any) => r.countryiso3code === code && r.date === row[0]).value,
      );
  expect(p.table.length - 1).toBe(24);
  expect(editorialExample('line').table.length - 1).toBe(66);
});
it('AnimCharts dated-line adapter retains all values and annotations, and rejects unsupported charts', () => {
  const p = editorialExample('line'),
    a = animChartsProject(p);
  expect(a.tool).toBe('editorial-line');
  expect(a.settings.annotations[0]).toEqual({ date: '2024', series: 0, text: p.annotations[0].text });
  expect(a.supamakersProject).toEqual(p);
  expect(a.settings.csv).toContain('1.28');
  expect(() => animChartsProject(editorialExample('small-multiples'))).toThrow(/dated line/);
  expect(() =>
    animChartsProject({
      ...p,
      annotations: [],
      table: [['Year', 'Global'], ...Array.from({ length: 151 }, (_, i) => [String(1800 + i), '1'])],
    }),
  ).toThrow(/150/);
});
it('editorial analytics only accepts fixed routes and event properties', () => {
  expect(analyticsUrl('https://www.chartsai.com/dumbbell-chart-maker/?title=SECRET')).toBe(
    'https://www.chartsai.com/dumbbell-chart-maker/',
  );
  expect(usageEvent({ tool: 'slopegraph', action: 'annotation', text: 'SECRET', row: 123 })).toEqual({
    name: 'Chart Edited',
    props: { tool: 'slopegraph', control: 'annotation' },
  });
  expect(showcaseDownloadEvent('/editorial/assets/dumbbell.html')?.props.format).toBe('html');
  expect(showcaseDownloadEvent('/editorial/assets/private-data.html')).toBeNull();
});
