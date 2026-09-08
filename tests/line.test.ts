import { describe, it, expect } from 'vitest';
import { validateLineTable } from '../src/lib/line-data';
import { lineExample } from '../src/lib/chart-presets';
import { renderChartSvg } from '../src/lib/echarts';
import { createChartOption } from '../src/lib/chart-options';

describe('line data keeps positions and values honest', () => {
  it('preserves zeros and negative values without ordering category labels', () => {
    expect(
      validateLineTable(
        [
          ['Day', 'Value'],
          ['Tue', '0'],
          ['Mon', '-3'],
        ],
        'category',
      ),
    ).toEqual({
      labels: ['Tue', 'Mon'],
      series: ['Value'],
      values: [[0], [-3]],
      error: '',
    });
  });
  it('flags missing observations instead of drawing across them', () => {
    expect(
      validateLineTable(
        [
          ['Day', 'A', 'B'],
          ['Mon', '1', ''],
          ['Tue', '2', '3'],
        ],
        'category',
      ).error,
    ).toContain('Missing values');
  });
  it('normalizes formatted numeric positions with the same parser as validation', () => {
    const result = validateLineTable(
      [
        ['Time', 'A'],
        ['1,000', '1'],
        ['2,500', '2'],
      ],
      'number',
    );
    expect(result.error).toBe('');
    expect(result.labels).toEqual(['1000', '2500']);
  });
  it.each(['2026-02-29', '09/08/2026', '2026-13-01'])('rejects impossible or ambiguous date %s', (date) => {
    expect(
      validateLineTable(
        [
          ['Date', 'A'],
          ['2026-01-01', '1'],
          [date, '2'],
        ],
        'time',
      ).error,
    ).toContain('real dates');
  });
  it('accepts leap days and rejects duplicate/descending coordinates', () => {
    expect(
      validateLineTable(
        [
          ['Date', 'A'],
          ['2028-02-28', '1'],
          ['2028-02-29', '2'],
        ],
        'time',
      ).error,
    ).toBe('');
    for (const x of ['1', '0'])
      expect(
        validateLineTable(
          [
            ['X', 'A'],
            ['1', '1'],
            [x, '2'],
          ],
          'number',
        ).error,
      ).toContain('strictly increasing');
  });
  it('rejects duplicate names and exceeding the point limit', () => {
    expect(
      validateLineTable(
        [
          ['X', 'A', 'A'],
          ['1', '1', '2'],
          ['2', '2', '3'],
        ],
        'number',
      ).error,
    ).toContain('different name');
    expect(
      validateLineTable([['X', 'A'], ...Array.from({ length: 301 }, (_, i) => [String(i), '1'])], 'number')
        .error,
    ).toContain('2–300');
  });
  it.each(['monthly', 'temperature', 'experiment'])(
    'renders and exports the %s example using native line series',
    (id) => {
      const spec = lineExample(id);
      const option = createChartOption(spec);
      const series = option.series as any[];
      expect(series[0].type).toBe('line');
      expect(series[0].smooth).toBe(false);
      if (spec.xMode === 'number')
        expect(series[0].data.map((p: number[]) => p[0])).toEqual([0, 2, 5, 10, 20, 30]);
      if (spec.xMode === 'time') expect(series[0].data[0][0]).toBe(Date.UTC(2026, 0, 5));
      const svg = renderChartSvg(spec);
      expect(svg).toContain(spec.title);
      expect(svg).not.toMatch(/NaN|Infinity/);
    },
  );
});
