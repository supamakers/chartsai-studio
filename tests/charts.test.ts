import { describe, it, expect } from 'vitest';
import { createChartOption, chartThemes, type ChartTheme } from '../src/lib/chart-options';
import { dotExample, radarExample } from '../src/lib/chart-presets';
import { renderChartSvg } from '../src/lib/echarts';

describe('ECharts migration: observations retain their meaning', () => {
  it('renders one native scatter mark per observation, including zeros and an outlier', () => {
    const spec = { ...dotExample(), values: [0, 2, 2, 100], meanLine: false };
    const svg = renderChartSvg(spec);
    expect((svg.match(/ecmeta_data_index=/g) || []).length).toBe(4);
    expect(svg).not.toMatch(/NaN|Infinity/);
    const option = createChartOption(spec);
    const series = (option.series as any[])[0];
    expect(series.type).toBe('scatter');
    expect(series.data.map((point: any) => point.value[0])).toEqual([0, 2, 2, 100]);
    expect(series.data[1].value[1]).toBeLessThan(series.data[2].value[1]);
  });
  it.each(Object.keys(chartThemes) as ChartTheme[])(
    'theme %s preserves radar scores and common scale',
    (theme) => {
      const spec = { ...radarExample(), theme };
      const option = createChartOption(spec);
      const series = (option.series as any[])[0];
      expect(series.type).toBe('radar');
      expect(series.data[0].value).toEqual(spec.scores.map((row) => row[0]));
      expect((option.radar as any).indicator.every((axis: any) => axis.min === 0 && axis.max === 10)).toBe(
        true,
      );
      expect(renderChartSvg(spec)).toContain(chartThemes[theme].background);
    },
  );
  it('SVG treats user titles as text, and handles constant datasets', () => {
    const svg = renderChartSvg({
      ...dotExample(),
      title: '<script>alert(1)</script>',
      values: [7, 7, 7],
      meanLine: false,
    });
    expect(svg).not.toContain('<script>');
    expect(svg).toContain('&lt;script&gt;');
    expect(svg).not.toMatch(/NaN|Infinity/);
    expect((svg.match(/ecmeta_data_index=/g) || []).length).toBe(3);
  });
});
