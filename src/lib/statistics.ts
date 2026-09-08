import { defaultPresentation, type Presentation, createChartOption } from './chart-options';
import { readNumber, type Table } from './data';
import type { EChartsOption } from 'echarts';
export const statKinds = ['histogram', 'box', 'scatter', 'bar', 'pareto'] as const;
export type StatKind = (typeof statKinds)[number];
export interface StatSpec extends Presentation {
  kind: StatKind;
  title: string;
  xLabel: string;
  yLabel: string;
  table: Table;
  bins: number;
  binStart: string;
  binWidth: string;
  relative: boolean;
  quartiles: 'linear' | 'halves';
  whiskers: 'iqr' | 'range';
  regression: boolean;
  horizontal: boolean;
  barMode: 'grouped' | 'stacked' | 'percent';
}
export const statDefaults = {
  ...defaultPresentation,
  bins: 6,
  binStart: '',
  binWidth: '',
  relative: false,
  quartiles: 'linear',
  whiskers: 'iqr',
  regression: false,
  horizontal: false,
  barMode: 'grouped',
} as const;
export function quantile(values: number[], p: number, method: 'linear' | 'halves' = 'linear'): number {
  const v = [...values].sort((a, b) => a - b);
  if (!v.length) throw Error('A quantile needs observations.');
  const median = (a: number[]) =>
    a.length % 2 ? a[(a.length - 1) / 2] : (a[a.length / 2 - 1] + a[a.length / 2]) / 2;
  if (method === 'halves' && (p === 0.25 || p === 0.75) && v.length > 1) {
    const half = Math.floor(v.length / 2);
    return median(p === 0.25 ? v.slice(0, half) : v.slice(Math.ceil(v.length / 2)));
  }
  const pos = (v.length - 1) * p,
    lo = Math.floor(pos);
  return v[lo] + (v[Math.min(lo + 1, v.length - 1)] - v[lo]) * (pos - lo);
}
export function boxSummary(
  values: number[],
  method: 'linear' | 'halves' = 'linear',
  whiskers: 'iqr' | 'range' = 'iqr',
) {
  const v = [...values].sort((a, b) => a - b),
    q1 = quantile(v, 0.25, method),
    median = quantile(v, 0.5),
    q3 = quantile(v, 0.75, method),
    iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr,
    upperFence = q3 + 1.5 * iqr;
  const inside = whiskers === 'range' ? v : v.filter((n) => n >= lowerFence && n <= upperFence);
  return {
    count: v.length,
    min: v[0],
    q1,
    median,
    q3,
    max: v.at(-1)!,
    iqr,
    lowerFence,
    upperFence,
    low: inside[0],
    high: inside.at(-1)!,
    outliers: whiskers === 'range' ? [] : v.filter((n) => n < lowerFence || n > upperFence),
  };
}
export function linearFit(points: number[][]) {
  const n = points.length;
  if (n < 2) throw Error('A fit needs at least two paired observations.');
  const mx = points.reduce((s, p) => s + p[0] / n, 0),
    my = points.reduce((s, p) => s + p[1] / n, 0);
  let xx = 0,
    yy = 0,
    xy = 0;
  for (const [x, y] of points) {
    xx += (x - mx) ** 2;
    yy += (y - my) ** 2;
    xy += (x - mx) * (y - my);
  }
  const variesX = points.some((p) => p[0] !== points[0][0]),
    variesY = points.some((p) => p[1] !== points[0][1]);
  const slope = variesX && xx ? (variesY ? xy / xx : 0) : null,
    intercept = slope === null ? null : my - slope * mx,
    r = variesX && variesY && xx && yy ? Math.max(-1, Math.min(1, xy / Math.sqrt(xx * yy))) : null;
  return { n, slope, intercept, r, r2: r === null ? null : r * r, meanX: mx, meanY: my };
}
export function histogram(values: number[], count: number, startText = '', widthText = '') {
  if (!values.length) throw Error('Add at least one observation.');
  const min = Math.min(...values),
    max = Math.max(...values);
  if (!Number.isInteger(count) || count < 1 || count > 50) throw Error('Use between 1 and 50 bins.');
  const custom = widthText.trim() !== '';
  const start = startText.trim() === '' ? min : readNumber(startText);
  if (start === null || start > min)
    throw Error('The bin start must be a number at or below the smallest value.');
  const width = custom ? readNumber(widthText) : max === start ? 1 : (max - start) / count;
  if (width === null || width <= 0 || !Number.isFinite(width))
    throw Error('Bin width must be a positive finite number.');
  const span = (max - start) / width,
    near = Math.round(span),
    tolerance = 8 * Number.EPSILON * Math.max(1, Math.abs(span));
  const binCount = custom ? Math.max(1, Math.abs(span - near) <= tolerance ? near : Math.ceil(span)) : count;
  if (binCount > 50) throw Error('These settings create more than 50 bins. Increase the width.');
  const counts = Array.from({ length: binCount }, () => 0);
  for (const v of values) {
    let pos = Math.floor((v - start) / width);
    const nearest = Math.round((v - start) / width);
    if (
      Math.abs((v - start) / width - nearest) <=
      8 * Number.EPSILON * Math.max(1, Math.abs((v - start) / width))
    )
      pos = nearest;
    pos = Math.min(binCount - 1, pos);
    if (pos < 0) throw Error('A value falls below the bin range.');
    counts[pos]++;
  }
  return counts.map((frequency, i) => ({
    lower: start + i * width,
    upper: start + (i + 1) * width,
    count: frequency,
    percent: (frequency / values.length) * 100,
    last: i === binCount - 1,
  }));
}
export function analyzeStat(spec: StatSpec) {
  const t = spec.table;
  if (t.length < 2 || t.length > 2001)
    throw Error('Use a header and 1–2,000 data rows. No rows are removed.');
  const cols = t[0].length;
  if (cols < 1 || cols > 6 || t.some((row) => row.length !== cols))
    throw Error('Every row must have the same 1–6 columns as the header.');
  if (t[0].some((s) => !s.trim() || s.length > 60) || new Set(t[0]).size !== cols)
    throw Error('Use distinct column headings of 1–60 characters.');
  const numeric = (s: string, r: number, c: number) => {
    const n = readNumber(s);
    if (n === null || !Number.isFinite(n) || Math.abs(n) > 1e9)
      throw Error(
        `Row ${r + 2}, column ${c + 1} needs a number between −1 billion and 1 billion. Missing values are not zero.`,
      );
    return n;
  };
  if (spec.kind === 'histogram') {
    if (cols !== 1) throw Error('Select one numeric column for the histogram.');
    const values = t.slice(1).map((r, i) => numeric(r[0], i, 0));
    const bins = histogram(values, spec.bins, spec.binStart, spec.binWidth);
    return {
      values,
      bins,
      summary: [
        ['Lower boundary', 'Upper boundary', 'Count', 'Percent'],
        ...bins.map((b) => [b.lower, b.upper, b.count, b.percent].map(String)),
      ] as Table,
    };
  }
  if (cols < 2) throw Error('Use a label or X column followed by at least one numeric column.');
  if (t.slice(1).some((row) => !row[0].trim() || row[0].length > 60))
    throw Error('Every first-column value needs 1–60 characters.');
  if (spec.kind === 'box') {
    if (cols !== 2)
      throw Error(
        'Use two columns: group name and one individual observation. Repeat the group name for its observations.',
      );
    const groups = new Map<string, number[]>();
    t.slice(1).forEach((row, i) => {
      const list = groups.get(row[0]) ?? [];
      list.push(numeric(row[1], i, 1));
      groups.set(row[0], list);
    });
    if (groups.size > 8) throw Error('Compare up to eight groups.');
    const boxes = [...groups].map(([name, values]) => ({
      name,
      ...boxSummary(values, spec.quartiles, spec.whiskers),
    }));
    return {
      boxes,
      summary: [
        [
          'Group',
          'N',
          'Minimum',
          'Q1',
          'Median',
          'Q3',
          'Maximum',
          'Low whisker',
          'High whisker',
          'IQR',
          'Flagged observations',
        ],
        ...boxes.map((b) =>
          [b.name, b.count, b.min, b.q1, b.median, b.q3, b.max, b.low, b.high, b.iqr, b.outliers.length].map(
            String,
          ),
        ),
      ] as Table,
    };
  }
  if (spec.kind === 'scatter') {
    if (cols !== 2) throw Error('Select exactly two numeric columns: X and Y.');
    const points = t.slice(1).map((row, i) => [numeric(row[0], i, 0), numeric(row[1], i, 1)]);
    const fit = linearFit(points);
    return {
      points,
      fit,
      summary: [
        ['Statistic', 'Value'],
        ['Paired observations', String(fit.n)],
        ['Pearson r', fit.r === null ? 'Undefined (constant variable)' : String(fit.r)],
        ['Slope', fit.slope === null ? 'Undefined (constant X)' : String(fit.slope)],
        ['Intercept', fit.intercept === null ? 'Undefined' : String(fit.intercept)],
        ['R squared', fit.r2 === null ? 'Undefined' : String(fit.r2)],
      ] as Table,
    };
  }
  if (t.length > 51) throw Error('Use up to 50 categories for a readable bar or Pareto chart.');
  if (new Set(t.slice(1).map((r) => r[0])).size !== t.length - 1)
    throw Error(
      'Category names must be unique. Aggregate repeated categories explicitly in your source data.',
    );
  const rows = t
    .slice(1)
    .map((row, i) => ({ label: row[0], values: row.slice(1).map((s, c) => numeric(s, i, c + 1)) }));
  if (spec.kind === 'pareto') {
    if (cols !== 2) throw Error('Select exactly one nonnegative measure for each category.');
    if (rows.some((r) => r.values[0] < 0)) throw Error('Pareto values must be nonnegative.');
    const total = rows.reduce((s, r) => s + r.values[0], 0);
    if (total <= 0) throw Error('A cumulative percentage needs a positive total.');
    let cumulative = 0;
    const pareto = [...rows]
      .sort((a, b) => b.values[0] - a.values[0])
      .map((r) => ({
        label: r.label,
        value: r.values[0],
        cumulative: ((cumulative += r.values[0]) / total) * 100,
      }));
    return {
      pareto,
      total,
      summary: [
        ['Category', 'Value', 'Cumulative percent'],
        ...pareto.map((r) => [r.label, String(r.value), String(r.cumulative)]),
      ] as Table,
    };
  }
  if (
    spec.barMode === 'percent' &&
    rows.some((r) => r.values.some((n) => n < 0) || r.values.reduce((s, n) => s + n, 0) <= 0)
  )
    throw Error('100% stacked bars require nonnegative values and a positive total in every category.');
  const bars = rows.map((r) => ({
    ...r,
    plotted:
      spec.barMode === 'percent'
        ? r.values.map((n) => (100 * n) / r.values.reduce((s, v) => s + v, 0))
        : r.values,
  }));
  return {
    bars,
    names: t[0].slice(1),
    summary: [
      ['Category', ...t[0].slice(1)],
      ...bars.map((r) => [r.label, ...r.plotted.map(String)]),
    ] as Table,
  };
}
export function statDescription(spec: StatSpec) {
  return `${spec.title}. ${spec.kind === 'box' ? 'Box plots with explicit quartile and whisker rules' : spec.kind === 'histogram' ? 'Equal-width bins of individual observations' : spec.kind === 'scatter' ? 'Paired numeric observations' : spec.kind === 'pareto' ? 'Descending categories with cumulative percentages' : 'Categories compared with bars'}. Exact input and calculated values are available in the data tables.`;
}
export function statOption(spec: StatSpec, width = 1200, height = 800): EChartsOption {
  const a = analyzeStat(spec),
    scale = width / 900,
    small = width < 550,
    plotTop = width < 550 ? 135 : 145 * (width / 900),
    plotBottom = width < 550 ? 80 : 130 * (width / 900),
    pad = Math.max(28, width * 0.075);
  const base = createChartOption(
    {
      ...defaultPresentation,
      ...spec,
      kind: 'line',
      xMode: 'category',
      zeroBaseline: true,
      markers: true,
      labels: ['A', 'B'],
      series: ['Value'],
      values: [[0], [1]],
    },
    width,
    height,
  );
  const axis = {
    type: 'value' as const,
    nameLocation: 'middle' as const,
    nameGap: 38 * scale,
    axisLabel: { fontSize: Math.max(10, 11 * scale) },
    nameTextStyle: { fontSize: Math.max(10, 11 * scale) },
    splitLine: { lineStyle: { type: 'dashed' as const, opacity: 0.3 } },
  };
  const ink = spec.theme === 'night' ? '#f3f5eb' : '#263b34',
    colors =
      spec.theme === 'night'
        ? ['#d3ef85', '#b4a0e4', '#7fcac2', '#efa878', '#df94b7']
        : spec.theme === 'ocean'
          ? ['#185bc3', '#42a3a6', '#8a66c3', '#d58545', '#cc607b']
          : ['#3158df', '#e78256', '#548b77', '#9274b1', '#b18b36'];
  const option: EChartsOption = {
    ...base,
    color: colors,
    aria: { enabled: true, label: { description: statDescription(spec) } },
    grid: { left: pad + 22 * scale, right: pad, top: plotTop, bottom: plotBottom },
    legend: { show: false },
    tooltip: { trigger: 'item', renderMode: 'richText', confine: true },
    xAxis: { ...axis, name: spec.xLabel },
    yAxis: { ...axis, name: spec.yLabel, nameGap: 50 * scale },
    series: [],
  };
  const titles = (Array.isArray(base.title) ? base.title : []) as any[];
  option.title = titles.map((t, i) =>
    i === 0
      ? { ...t, text: `${spec.kind.toUpperCase()} / DATA EXPLORER` }
      : i === 2 && !spec.source
        ? { ...t, text: 'Every supplied observation is retained. Check the data table.' }
        : t,
  );
  if (a.bins) {
    option.xAxis = {
      ...axis,
      type: 'category',
      name: spec.xLabel,
      data: a.bins.map((b) => `${Number(b.lower.toPrecision(12))}–${Number(b.upper.toPrecision(12))}`),
      axisLabel: {
        fontSize: Math.max(9, 10 * scale),
        rotate: a.bins.length > 10 ? 45 : 0,
        hideOverlap: true,
      },
    };
    option.yAxis = { ...axis, name: spec.relative ? 'Observations (%)' : 'Frequency', min: 0 };
    option.series = [
      {
        type: 'bar',
        barCategoryGap: '0%',
        data: a.bins.map((b) => (spec.relative ? b.percent : b.count)),
        itemStyle: { borderColor: spec.theme === 'night' ? '#202522' : '#faf9f6', borderWidth: 1 },
      },
    ];
  }
  if (a.boxes) {
    option.xAxis = {
      type: 'category',
      data: a.boxes.map((b) => b.name),
      axisLabel: {
        fontSize: Math.max(10, 11 * scale),
        width: (width / a.boxes.length) * 0.7,
        overflow: 'truncate',
      },
      name: spec.xLabel,
      nameLocation: 'middle',
      nameGap: 35 * scale,
    };
    option.yAxis = { ...axis, name: spec.yLabel, scale: true };
    option.series = [
      {
        type: 'boxplot',
        data: a.boxes.map((b) => [b.low, b.q1, b.median, b.q3, b.high]),
        itemStyle: { color: colors[0] + '33', borderColor: colors[0] },
        boxWidth: [15, 75 * scale],
      },
      {
        type: 'scatter',
        symbolSize: 7 * scale,
        data: a.boxes.flatMap((b, i) => b.outliers.map((v) => [i, v])),
      },
    ];
  }
  if (a.points) {
    option.xAxis = { ...axis, name: spec.xLabel, scale: true };
    option.yAxis = { ...axis, name: spec.yLabel, scale: true };
    const series: any[] = [
      { type: 'scatter', symbolSize: 8 * scale, data: a.points, itemStyle: { opacity: 0.7 } },
    ];
    if (spec.regression && a.fit.slope !== null) {
      const xs = a.points.map((p) => p[0]),
        min = Math.min(...xs),
        max = Math.max(...xs);
      series.push({
        type: 'line',
        symbol: 'none',
        data: [
          [min, a.fit.slope * min + a.fit.intercept!],
          [max, a.fit.slope * max + a.fit.intercept!],
        ],
        lineStyle: { type: 'dashed', width: 2 * scale },
        name: 'Least-squares line',
      });
    }
    option.series = series;
  }
  if (a.pareto) {
    option.xAxis = {
      type: 'category',
      data: a.pareto.map((r) => r.label),
      axisLabel: {
        fontSize: Math.max(9, 10 * scale),
        width: (width / a.pareto.length) * 0.7,
        overflow: 'truncate',
        interval: 0,
      },
    };
    option.yAxis = [
      { ...axis, name: spec.yLabel, min: 0 },
      { ...axis, name: 'Cumulative (%)', min: 0, max: 100, nameGap: 36 * scale, splitLine: { show: false } },
    ];
    option.series = [
      { type: 'bar', data: a.pareto.map((r) => r.value), barMaxWidth: 70 * scale },
      {
        type: 'line',
        yAxisIndex: 1,
        data: a.pareto.map((r) => r.cumulative),
        symbol: 'circle',
        markLine: {
          symbol: ['none', 'none'],
          silent: true,
          data: [{ yAxis: 80 }],
          label: { formatter: '80%' },
        },
      },
    ];
  }
  if (a.bars) {
    const category = {
      type: 'category' as const,
      data: a.bars.map((r) => r.label),
      axisLabel: {
        fontSize: Math.max(10, 11 * scale),
        width: spec.horizontal ? 130 * scale : (width / a.bars.length) * 0.7,
        overflow: 'truncate' as const,
        interval: 0,
      },
      inverse: spec.horizontal,
    };
    const value = {
      ...axis,
      name: spec.barMode === 'percent' ? 'Share (%)' : spec.yLabel,
      min: spec.barMode === 'percent' ? 0 : undefined,
      max: spec.barMode === 'percent' ? 100 : undefined,
    };
    option.xAxis = spec.horizontal ? value : category;
    option.yAxis = spec.horizontal ? category : value;
    if (spec.horizontal) option.grid = { left: 175 * scale, right: pad, top: plotTop, bottom: plotBottom };
    option.legend = {
      show: a.names.length > 1,
      bottom: small ? 25 : 40 * scale,
      textStyle: { color: ink, fontSize: Math.max(10, 11 * scale) },
      selectedMode: false,
    };
    option.series = a.names.map((name, i) => ({
      name,
      type: 'bar',
      stack: spec.barMode === 'grouped' ? undefined : 'total',
      data: a.bars.map((r) => r.plotted[i]),
      barMaxWidth: 55 * scale,
    }));
  }
  return option;
}
