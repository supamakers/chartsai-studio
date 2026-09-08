import { describe, expect, it } from 'vitest';
import { homeDotOption, homeLineOption, homeSlopeOption } from '../src/lib/home-figures';
import { dotExample, lineExample } from '../src/lib/chart-presets';

describe('homepage chart data integrity', () => {
  it('retains every score and stacks repeats without averaging them', () => {
    const points = (homeDotOption().series as any[])[0].data as number[][];
    expect(points.map(([x]) => x)).toEqual(dotExample('scores').values);
    for (const x of new Set(points.map(([x]) => x))) {
      expect(points.filter(([value]) => value === x).map(([, y]) => y)).toEqual(
        Array.from({ length: points.filter(([value]) => value === x).length }, (_, i) => i + 1),
      );
    }
  });
  it('plots each shop across all months, matching the linked editor example', () => {
    const sample = lineExample('monthly');
    const option = homeLineOption();
    expect((option.xAxis as any).data).toEqual(sample.labels);
    expect((option.series as any[]).map((s) => ({ name: s.name, values: s.data }))).toEqual(
      sample.series.map((name, i) => ({ name, values: sample.values.map((row) => row[i]) })),
    );
  });
  it('uses equal physical units and a line through the two stated points', () => {
    const option = homeSlopeOption();
    const grid = option.grid as any,
      x = option.xAxis as any,
      y = option.yAxis as any;
    expect(grid.width / (x.max - x.min)).toBe(grid.height / (y.max - y.min));
    const [line, points] = option.series as any[];
    expect(points.data).toEqual([
      [0, 1],
      [3, 3],
    ]);
    for (const [x, y] of line.data) expect(y).toBeCloseTo((2 / 3) * x + 1);
  });
});
