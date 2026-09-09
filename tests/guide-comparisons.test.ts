import { describe, it, expect } from 'vitest';
import { comparisonIds } from '../src/lib/guide-ids';
import { guideComparison, guideEditor } from '../src/lib/guide-comparisons';
import { analyzeStat } from '../src/lib/statistics';
import { showcaseDownloadEvent } from '../src/lib/analytics-policy';

const series = (id: (typeof comparisonIds)[number], view: number) =>
  (guideComparison(id).views[view].option.series as any[])[0];
describe('same-data teaching comparisons', () => {
  it('preserves each dot including duplicates and reconciles every histogram count', () => {
    const c = guideComparison('dot-plot-vs-histogram');
    expect(series(c.id, 0).data).toEqual([
      [1, 1],
      [1, 2],
      [2, 1],
      [2, 2],
      [2, 3],
      [3, 1],
      [3, 2],
      [4, 1],
      [4, 2],
      [5, 1],
      [6, 1],
      [7, 1],
      [8, 1],
      [12, 1],
      [17, 1],
      [23, 1],
    ]);
    expect(series(c.id, 1).data).toEqual([9, 4, 1, 1, 1]);
    expect(series(c.id, 0).data.map((p: number[]) => p[0])).toEqual(
      c.table.slice(1).map((r) => Number(r[0])),
    );
  });
  it('shows the documented bin counts, quartiles and empty intervals', () => {
    expect(series('histogram-bin-width', 0).data).toEqual([2, 3, 4, 5, 4, 2]);
    expect(series('histogram-bin-width', 1).data).toEqual([5, 9, 6]);
    expect(series('box-plot-vs-histogram', 0).data).toEqual([[2, 3, 8, 13, 14]]);
    expect(series('box-plot-vs-histogram', 1).data).toEqual([0, 5, 3, 0, 0, 1, 7]);
  });
  it('changes only the scale for the axis lessons and preserves original values in log rendering', () => {
    for (const id of ['truncated-y-axis', 'logarithmic-scale-graph'] as const) {
      const c = guideComparison(id);
      expect(series(id, 0).data).toEqual(series(id, 1).data);
      expect(series(id, 0).data).toEqual(c.table.slice(1).map((r) => Number(r[1])));
    }
    const truncated = guideComparison('truncated-y-axis');
    expect((truncated.views[0].option.yAxis as any).min).toBe(0);
    expect((truncated.views[1].option.yAxis as any).min).toBe(80);
    expect(truncated.views[1].editor).toBeUndefined();
    expect((guideComparison('logarithmic-scale-graph').views[1].option.yAxis as any).type).toBe('log');
    expect(series('pie-chart-vs-bar-graph', 0).data.map((p: any) => p.value)).toEqual(
      series('pie-chart-vs-bar-graph', 1).data,
    );
  });
  it('hands every observation and declared calculation setting to supported editors', () => {
    for (const id of comparisonIds)
      for (const [i, view] of guideComparison(id).views.entries()) {
        if (!view.editor) continue;
        const spec = guideEditor(id, String(i), view.editor.kind)!;
        expect(spec).toEqual(view.editor);
        if (spec.kind === 'histogram')
          expect(analyzeStat(spec).bins!.map((b) => b.count)).toEqual(series(id, i).data);
        if (spec.kind === 'box') {
          const b = analyzeStat(spec).boxes![0];
          expect([b.low, b.q1, b.median, b.q3, b.high]).toEqual(series(id, i).data[0]);
        }
      }
    for (const id of ['private-name', '__proto__', 'constructor'])
      expect(guideEditor(id, '0', 'bar')).toBeUndefined();
    expect(guideEditor('histogram-bin-width', '2', 'histogram')).toBeUndefined();
    expect(guideEditor('histogram-bin-width', '0', 'bar')).toBeUndefined();
  });
  it('tracks only allowlisted public comparison downloads', () => {
    expect(showcaseDownloadEvent('/guides/assets/histogram-bin-width-1.png')).toEqual({
      name: 'Chart Download',
      props: { tool: 'guide-comparison', guide: 'histogram-bin-width', format: 'png' },
    });
    for (const path of [
      '/guides/assets/private-name-1.png',
      '/guides/assets/histogram-bin-width-9.png',
      '/guides/assets/histogram-bin-width-1.exe',
    ])
      expect(showcaseDownloadEvent(path)).toBeNull();
  });
});
