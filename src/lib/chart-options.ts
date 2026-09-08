import type { EChartsOption } from 'echarts';
import { summarize, formatNumber } from './data';

export const chartThemes = {
  editorial: {
    name: 'Editorial',
    background: '#faf9f6',
    ink: '#202322',
    muted: '#6b706c',
    line: '#ddded8',
    colors: ['#3158df', '#e78256', '#548b77', '#9274b1', '#b18b36'],
  },
  ocean: {
    name: 'Blueprint',
    background: '#f0f5ff',
    ink: '#183255',
    muted: '#617492',
    line: '#d2deef',
    colors: ['#185bc3', '#42a3a6', '#8a66c3', '#d58545', '#cc607b'],
  },
  night: {
    name: 'After hours',
    background: '#202522',
    ink: '#f3f5eb',
    muted: '#abb7ab',
    line: '#414a42',
    colors: ['#d3ef85', '#b4a0e4', '#7fcac2', '#efa878', '#df94b7'],
  },
} as const;
export type ChartTheme = keyof typeof chartThemes;
export type ChartFrame = 'landscape' | 'wide' | 'square';
export const chartFrames = {
  landscape: { name: 'Standard', width: 1200, height: 800 },
  wide: { name: 'Presentation', width: 1600, height: 900 },
  square: { name: 'Square', width: 1200, height: 1200 },
};
export type Presentation = { theme: ChartTheme; frame: ChartFrame; subtitle: string; source: string };
export const defaultPresentation: Presentation = {
  theme: 'editorial',
  frame: 'landscape',
  subtitle: '',
  source: '',
};
export type DotSpec = {
  kind: 'dot';
  values: number[];
  title: string;
  label: string;
  meanLine: boolean;
  showCounts: boolean;
} & Presentation;
export type RadarSpec = {
  kind: 'radar';
  axes: string[];
  series: string[];
  scores: number[][];
  max: number;
  title: string;
  filled: boolean;
  round: boolean;
} & Presentation;
export type ChartSpec = DotSpec | RadarSpec;

export function chartDescription(spec: ChartSpec) {
  if (spec.kind === 'dot') {
    const stats = summarize(spec.values);
    return stats
      ? `${spec.title}. ${stats.count} observations, mean ${formatNumber(stats.mean)}, median ${formatNumber(stats.median)}. Values range from ${formatNumber(stats.min)} to ${formatNumber(stats.max)}. Each dot is one observation.`
      : 'Add values to create a dot plot.';
  }
  return `${spec.title}. ${spec.series.join(' and ')} compared across ${spec.axes.join(', ')}. All axes use a scale from 0 to ${spec.max}. Exact scores are available in the data table.`;
}

/** ECharts owns axes, geometry, interaction, layout and rendering. No custom series or SVG chart renderer. */
export function createChartOption(spec: ChartSpec, width = 900, height = 600): EChartsOption {
  const t = chartThemes[spec.theme];
  const small = width < 550;
  const scale = width / 900;
  const font = (n: number) => Math.max(small ? 10 : 12, n * scale);
  const pad = Math.max(18, 35 * scale);
  const top = small ? 114 : 126 * scale;
  const footer =
    spec.source ||
    (spec.kind === 'dot'
      ? 'Each dot represents one observation.'
      : 'A shared scale. Compare values along the same axis.');
  const titleSize = Math.max(19, 29 * scale);
  const base: EChartsOption = {
    backgroundColor: t.background,
    animation: false,
    textStyle: { fontFamily: 'Arial, sans-serif', color: t.ink },
    aria: { enabled: true, label: { description: chartDescription(spec) } },
    title: [
      {
        text: spec.kind === 'dot' ? 'DISTRIBUTION / DOT PLOT' : 'COMPARISON / RADAR',
        left: pad,
        top: pad * 0.75,
        textStyle: { color: t.muted, fontSize: Math.max(8, 10 * scale), fontWeight: 'normal' },
      },
      {
        text: spec.title || (spec.kind === 'dot' ? 'Dot plot' : 'Radar chart'),
        subtext: spec.subtitle,
        left: pad,
        top: pad * 1.6,
        itemGap: 9 * scale,
        textStyle: {
          color: t.ink,
          fontSize: titleSize,
          fontWeight: 600,
          width: width - pad * 2 - 10,
          overflow: 'break',
          lineHeight: titleSize * 1.15,
        },
        subtextStyle: { color: t.muted, fontSize: font(12), width: width - pad * 2, overflow: 'truncate' },
      },
      {
        text: footer,
        left: pad,
        bottom: 14 * scale,
        textStyle: {
          color: t.muted,
          fontSize: Math.max(8, 10 * scale),
          fontWeight: 'normal',
          width: width - pad * 2 - 10,
          overflow: 'truncate',
        },
      },
    ],
    tooltip: {
      trigger: 'item',
      renderMode: 'richText',
      confine: true,
      backgroundColor: t.ink,
      borderWidth: 0,
      padding: 12,
      textStyle: { color: t.background, fontSize: 12 },
    },
  };
  if (spec.kind === 'dot') {
    const stats = summarize(spec.values);
    if (!stats) return base;
    const maxCount = Math.max(...stats.frequencies.map((f) => f.count));
    const plotBottom = Math.max(72, 82 * scale);
    const available = height - top - plotBottom;
    const diameter = Math.max(1, Math.min(16 * scale, (available / (maxCount + 2)) * 0.68));
    const data = stats.frequencies.flatMap(({ value, count }) =>
      Array.from({ length: count }, (_, i) => ({
        value: [value, i + 0.5],
        name: `${formatNumber(value)} · observation ${i + 1} of ${count} at this value`,
        label: {
          show: spec.showCounts && i === count - 1 && count > 1,
          formatter: `${count}×`,
          position: 'top' as const,
          distance: 7,
          color: t.ink,
          fontSize: font(11),
        },
      })),
    );
    return {
      ...base,
      grid: { top, left: pad + 14, right: pad + 14, bottom: plotBottom },
      xAxis: {
        type: 'value',
        scale: true,
        boundaryGap: ['8%', '8%'],
        splitNumber: small ? 4 : 6,
        name: spec.label,
        nameLocation: 'middle',
        nameGap: 40 * Math.max(0.75, scale),
        nameTextStyle: { fontSize: font(12), color: t.muted, width: width - 50, overflow: 'break' },
        axisLine: { show: true, lineStyle: { color: t.line } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          hideOverlap: true,
          color: t.muted,
          fontSize: font(11),
          formatter: (value) => formatNumber(value),
        },
        axisPointer: { show: true, label: { show: false }, lineStyle: { color: t.line } },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: Math.max(maxCount + 0.5, available / (diameter * 1.5)),
        show: false,
      },
      series: [
        {
          type: 'scatter',
          name: spec.label || 'Value',
          data,
          symbol: 'circle',
          symbolSize: diameter,
          clip: true,
          itemStyle: { color: t.colors[0], opacity: 1 },
          emphasis: { scale: 1.3, itemStyle: { color: t.colors[1] } },
          tooltip: {
            formatter: (params) => {
              const p = Array.isArray(params) ? params[0] : params;
              return String(p.name);
            },
          },
          markLine: spec.meanLine
            ? {
                silent: true,
                symbol: ['none', 'none'],
                lineStyle: { color: t.muted, type: 'dashed', width: 1 },
                label: {
                  formatter: `Mean ${formatNumber(stats.mean)}`,
                  color: t.muted,
                  fontSize: font(10),
                  position: 'insideEndTop',
                  rotate: 0,
                },
                data: [{ xAxis: stats.mean }],
              }
            : undefined,
        },
      ],
    };
  }
  const radius = Math.min(width * (small ? 0.27 : 0.235), (height - top - 90 * scale) * 0.44);
  const centerX = small ? width * 0.5 : width * 0.6;
  const centerY = top + (height - top - 68 * scale) * 0.49;
  const titles = Array.isArray(base.title) ? base.title : [];
  if (!small)
    titles.push({
      text: `0–${spec.max}`,
      subtext: `SHARED SCALE\n\n${spec.axes.length} dimensions\n${spec.series.length} ${spec.series.length === 1 ? 'profile' : 'profiles'}`,
      left: pad,
      top: height * 0.43,
      textStyle: { color: t.ink, fontSize: 34 * scale, fontWeight: 500 },
      subtextStyle: { color: t.muted, fontSize: font(10), lineHeight: 18 * scale },
      itemGap: 12 * scale,
    });
  return {
    ...base,
    title: titles,
    legend: {
      show: true,
      bottom: 42 * scale,
      left: 'center',
      selectedMode: false,
      icon: 'roundRect',
      itemWidth: 14 * scale,
      itemHeight: 4 * scale,
      itemGap: 22 * scale,
      textStyle: { color: t.ink, fontSize: font(12) },
      data: spec.series,
    },
    radar: {
      center: [centerX, centerY],
      radius,
      shape: spec.round ? 'circle' : 'polygon',
      splitNumber: 5,
      startAngle: 90,
      axisNameGap: 13 * Math.max(0.65, scale),
      indicator: spec.axes.map((name) => ({ name, min: 0, max: spec.max })),
      axisName: {
        color: t.muted,
        fontSize: font(12),
        width: small ? 75 : 135 * scale,
        overflow: 'break',
        lineHeight: font(15),
      },
      splitArea: { show: true, areaStyle: { color: [t.background] } },
      splitLine: { lineStyle: { color: t.line, width: 1 } },
      axisLine: { lineStyle: { color: t.line } },
    },
    series: [
      {
        type: 'radar',
        symbol: 'circle',
        symbolSize: Math.max(3, 6 * scale),
        lineStyle: { width: Math.max(1.5, 2.5 * scale) },
        emphasis: { focus: 'self' },
        data: spec.series.map((name, s) => ({
          name,
          value: spec.scores.map((row) => row[s]),
          itemStyle: { color: t.colors[s % t.colors.length] },
          lineStyle: { color: t.colors[s % t.colors.length] },
          areaStyle: { color: t.colors[s % t.colors.length], opacity: spec.filled ? 0.12 : 0 },
        })),
      },
    ],
  };
}
