import type { EChartsOption } from 'echarts';
import { statPresets } from './stat-presets';
import { statDefaults, histogram, boxSummary, type StatSpec } from './statistics';
import { defaultPresentation, type DotSpec } from './chart-options';
import { comparisonId, type ComparisonId } from './guide-ids';
import type { Table } from './data';

type View = { title: string; caption: string; option: EChartsOption; editor?: StatSpec | DotSpec };
export type GuideComparison = {
  id: ComparisonId;
  heading: string;
  explanation: string;
  method: string;
  table: Table;
  views: [View, View];
};
const blue = '#1649ac',
  pink = '#af2764';
const source = 'Source: fictional teaching data · ChartsAI by SupaMakers · MIT';
const numeric = (id: keyof typeof statPresets) => statPresets[id].table.slice(1).map((r) => Number(r[0]));
function singleTable(label: string, values: number[]): Table {
  return [[label], ...values.map((v) => [String(v)])];
}
function base(title: string, x: string, y: string): EChartsOption {
  return {
    animation: false,
    backgroundColor: '#fff',
    color: [blue, pink],
    textStyle: { fontFamily: 'Arial', color: '#192751' },
    title: [
      { text: title, left: 28, top: 24, textStyle: { fontSize: 26, fontWeight: 600 } },
      { text: source, left: 28, bottom: 18, textStyle: { fontSize: 13, fontWeight: 400 } },
    ],
    grid: { left: 95, right: 40, top: 100, bottom: 105 },
    xAxis: {
      type: 'value',
      name: x,
      nameLocation: 'middle',
      nameGap: 43,
      nameTextStyle: { fontSize: 18 },
      axisLabel: { fontSize: 16 },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      name: y,
      nameLocation: 'middle',
      nameGap: 62,
      nameTextStyle: { fontSize: 18 },
      axisLabel: { fontSize: 16 },
      splitLine: { lineStyle: { color: '#e1e5ec' } },
    },
  };
}
function hist(values: number[], label: string, start: number, width: number, title: string): View {
  const bins = histogram(values, 6, String(start), String(width));
  const option = base(title, label, 'Observations');
  option.xAxis = {
    ...(option.xAxis as object),
    type: 'category',
    data: bins.map((b) => `${b.lower}–${b.upper}`),
  };
  option.yAxis = { ...(option.yAxis as object), min: 0, minInterval: 1 };
  option.series = [
    {
      type: 'bar',
      barCategoryGap: '0%',
      data: bins.map((b) => b.count),
      label: { show: true, position: 'top', fontSize: 18 },
      itemStyle: { borderColor: '#fff', borderWidth: 1 },
    },
  ];
  return {
    title,
    caption: `Width ${width}; start ${start}. Counts: ${bins.map((b) => b.count).join(', ')}. N = ${values.length}.`,
    option,
    editor: {
      ...statDefaults,
      kind: 'histogram',
      theme: 'editorial',
      title,
      xLabel: label,
      yLabel: 'Frequency',
      table: singleTable(label, values),
      binStart: String(start),
      binWidth: String(width),
      source,
    },
  };
}
function bars(table: Table, title: string, minimum = 0): View {
  const option = base(title, table[0][0], table[0][1]);
  option.xAxis = { ...(option.xAxis as object), type: 'category', data: table.slice(1).map((r) => r[0]) };
  option.yAxis = { ...(option.yAxis as object), min: minimum, max: 100 };
  option.series = [
    {
      type: 'bar',
      data: table.slice(1).map((r) => Number(r[1])),
      barMaxWidth: 90,
      label: { show: true, position: 'top', fontSize: 22 },
      itemStyle: { color: minimum ? pink : blue },
    },
  ];
  return {
    title,
    caption: minimum
      ? 'Misleading teaching example: a baseline of 80 doubles visible bar length from 10 to 20. The amounts did not double.'
      : 'Zero baseline: aligned lengths preserve the ratio between the amounts.',
    option,
    ...(minimum
      ? {}
      : {
          editor: {
            ...statDefaults,
            kind: 'bar' as const,
            theme: 'editorial' as const,
            title,
            xLabel: table[0][0],
            yLabel: table[0][1],
            table,
            source,
          },
        }),
  };
}

export function guideComparison(id: ComparisonId): GuideComparison {
  if (id === 'box-plot-vs-histogram') {
    const values = numeric('histogram-two-peaks'),
      summary = boxSummary(values),
      label = 'Length (cm)';
    const title = 'One compact five-number view',
      option = base(title, 'One sample', label);
    option.xAxis = { ...(option.xAxis as object), type: 'category', data: ['All 16 observations'] };
    option.yAxis = { ...(option.yAxis as object), min: 0, max: 16 };
    option.series = [
      {
        type: 'boxplot',
        data: [[summary.low, summary.q1, summary.median, summary.q3, summary.high]],
        boxWidth: [90, 130],
        itemStyle: { color: '#dbe7fa', borderColor: blue, borderWidth: 3 },
      },
    ];
    return {
      id,
      heading: 'The same 16 lengths: summary and shape',
      table: singleTable(label, values),
      explanation: `The box plot has Q1 = ${summary.q1}, median = ${summary.median} and Q3 = ${summary.q3} cm. The histogram reveals an empty 6–10 cm span between two concentrations. A five-number summary does not show that gap.`,
      method:
        'No rows removed or pooled with another sample. Quartiles use linear interpolation at (N − 1)p; whiskers end at the most extreme observations within 1.5 IQR. All values fall within those fences. Histogram bins start at 0, have width 2, include the left boundary and exclude the right, except the final bin includes its right boundary.',
      views: [
        {
          title,
          caption: `Whiskers ${summary.low} and ${summary.high}; Q1 ${summary.q1}; median ${summary.median}; Q3 ${summary.q3} cm. N = 16.`,
          option,
          editor: {
            ...statDefaults,
            kind: 'box',
            theme: 'editorial',
            title,
            xLabel: 'Sample',
            yLabel: label,
            table: [['Sample', label], ...values.map((v) => ['All 16 observations', String(v)])],
            source,
          },
        },
        hist(values, label, 0, 2, 'The gap appears in the histogram'),
      ],
    };
  }
  if (id === 'dot-plot-vs-histogram') {
    const values = numeric('histogram-waiting-times'),
      label = 'Wait (minutes)',
      seen = new Map<number, number>();
    const points = values.map((v) => {
      const frequency = (seen.get(v) ?? 0) + 1;
      seen.set(v, frequency);
      return [v, frequency];
    });
    const title = 'Every wait gets its own dot',
      option = base(title, label, 'Observations at each value');
    option.xAxis = { ...(option.xAxis as object), min: 0, max: 25, interval: 5 };
    option.yAxis = { ...(option.yAxis as object), min: 0, max: 4, interval: 1 };
    option.series = [{ type: 'scatter', data: points, symbolSize: 18 }];
    return {
      id,
      heading: 'The same 16 waits: exact repeats or grouped counts',
      table: singleTable(label, values),
      explanation:
        'Three separate dots sit at two minutes. In the histogram, nine waits fall in the first interval from 0 up to (but not including) 5 minutes. That bar combines values 1, 2, 3 and 4; it does not mean nine people waited the same amount of time.',
      method:
        'Each dot preserves one original observation, including duplicates. Histogram bins start at 0 with width 5; intervals include the left boundary and exclude the right, except the final bin includes its right boundary. Neither view rounds or drops a wait.',
      views: [
        {
          title,
          caption: 'Frequencies at 1, 2, 3 and 4 minutes are 2, 3, 2 and 2. N = 16.',
          option,
          editor: {
            ...defaultPresentation,
            kind: 'dot',
            theme: 'editorial',
            title,
            label,
            values,
            meanLine: false,
            showCounts: false,
            source,
          },
        },
        hist(values, label, 0, 5, 'Nine waits share the first interval'),
      ],
    };
  }
  if (id === 'histogram-bin-width') {
    const values = numeric('histogram-class-scores');
    const views: [View, View] = [
      hist(values, 'Score', 40, 10, 'Width 10: six intervals'),
      hist(values, 'Score', 40, 20, 'Width 20: three intervals'),
    ];
    for (const view of views) view.option.yAxis = { ...(view.option.yAxis as object), max: 10, interval: 2 };
    return {
      id,
      heading: 'One score list, two bin widths',
      table: singleTable('Score', values),
      explanation:
        'Both charts contain the same 20 scores and start at 40. Width 20 combines each adjacent pair of width-10 bins: 2 + 3 = 5, 4 + 5 = 9, and 4 + 2 = 6. Taller bars here reflect wider grouping, not additional students.',
      method:
        'Counts, not density. Equal-width bins within each panel; the same start and observations across panels. Intervals include their left endpoint and exclude their right, except the final interval includes both. Both panels share a frequency axis from 0 to 10; counts grow when adjacent bins combine.',
      views,
    };
  }
  if (id === 'truncated-y-axis') {
    const table = [
      ['Group', 'Amount (units)'],
      ['A', '90'],
      ['B', '100'],
    ];
    return {
      id,
      heading: 'A ten-unit gap, two very different impressions',
      table,
      explanation:
        'B exceeds A by 10 units, or about 11.1% of A. Starting bars at zero gives a length ratio of 100 ÷ 90 ≈ 1.111. Cropping their visible baseline to 80 gives lengths 10 and 20, a ratio of 2. The right-hand chart is deliberately misleading as an amount comparison.',
      method:
        'Identical amounts and upper limit of 100. Only the visible axis minimum changes. The truncated version is a labelled teaching illustration; ChartsAI’s bar maker retains zero. Do not reuse the cropped comparison as evidence that B is twice A.',
      views: [
        bars(table, 'Zero baseline: amounts in proportion'),
        bars(table, 'Misleading example: baseline at 80', 80),
      ],
    };
  }
  if (id === 'logarithmic-scale-graph') {
    const values = [1, 10, 100, 1000],
      table = [['Step', 'Original value'], ...values.map((v, i) => [String(i + 1), String(v)])];
    const make = (log: boolean): View => {
      const title = log ? 'Log scale: each step multiplies by 10' : 'Linear scale: unequal absolute gaps',
        option = base(title, 'Step', 'Original value');
      option.xAxis = {
        ...(option.xAxis as object),
        type: 'category',
        data: ['1', '2', '3', '4'],
        boundaryGap: false,
      };
      option.yAxis = {
        ...(option.yAxis as object),
        type: log ? 'log' : 'value',
        min: log ? 1 : 0,
        max: 1000,
        ...(log ? { logBase: 10 } : {}),
        axisLabel: { fontSize: 16, formatter: (v: number) => String(v) },
      };
      option.series = [
        {
          type: 'line',
          data: values,
          symbolSize: 12,
          lineStyle: { width: 3 },
          label: { show: true, position: 'top', fontSize: 18 },
          itemStyle: { color: log ? pink : blue },
        },
      ];
      return {
        title,
        option,
        caption: log
          ? 'Original-value ticks at 1, 10, 100 and 1,000. Equal spacing means equal ratios.'
          : 'Original-value differences are 9, 90 and 900. No values are transformed in the source table.',
      };
    };
    return {
      id,
      heading: 'The same four values on linear and log axes',
      table,
      explanation:
        'A tenfold increase repeats at every step. The linear view emphasizes the largest absolute increase; the base-10 logarithmic view makes the repeated ratio visible as equal vertical steps. Read the axis labels: equal spacing no longer means an equal number of units.',
      method:
        'The log axis is native ECharts with base 10 and original-value tick labels; the plotted observations remain 1, 10, 100 and 1,000. All are positive. These are downloadable teaching illustrations; the interactive makers do not offer a log-axis control.',
      views: [make(false), make(true)],
    };
  }
  const table = [
      ['Category', 'Count'],
      ['A', '20'],
      ['B', '30'],
      ['C', '50'],
    ],
    title = 'Pie: parts of a total of 100';
  const pie = base(title, '', '');
  delete pie.xAxis;
  delete pie.yAxis;
  delete pie.grid;
  pie.series = [
    {
      type: 'pie',
      radius: '52%',
      center: ['50%', '50%'],
      clockwise: true,
      startAngle: 90,
      data: table.slice(1).map((r) => ({ name: r[0], value: Number(r[1]) })),
      label: { fontSize: 20, formatter: '{b}: {c} ({d}%)' },
      itemStyle: { borderColor: '#fff', borderWidth: 3 },
    },
  ];
  pie.color = [blue, pink, '#54785c'];
  return {
    id,
    heading: 'The same three categories, one defined whole',
    table,
    explanation:
      'The counts 20, 30 and 50 add to 100. The pie emphasizes that C is half the whole. The bars give A, B and C a shared zero baseline, making the ten-count difference between A and B easier to compare directly.',
    method:
      'Original fictional counts; mutually exclusive categories that together define this whole. Pie shares are count ÷ 100 × 100%. No negative values, omitted categories or separate denominators. The pie is a downloadable teaching illustration; only the bar view has an interactive maker.',
    views: [
      { title, option: pie, caption: 'A = 20%, B = 30%, C = 50%; total = 100.' },
      {
        ...bars(table, 'Bars: compare aligned lengths'),
        caption: 'Counts A = 20, B = 30 and C = 50, measured from zero.',
      },
    ],
  };
}

export function guideEditor(id: unknown, view: unknown, kind: string) {
  const known = comparisonId(id);
  if (!known || (view !== '0' && view !== '1')) return undefined;
  const spec = guideComparison(known).views[Number(view)].editor;
  return spec?.kind === kind ? spec : undefined;
}
export function guideEditorPath(id: ComparisonId, view: number, spec: StatSpec | DotSpec) {
  const tools = {
    histogram: 'histogram-maker',
    box: 'box-plot-maker',
    bar: 'bar-chart-maker',
    dot: 'dot-plot-maker',
    scatter: 'scatter-plot-maker',
    pareto: 'pareto-chart-maker',
  };
  return `/${tools[spec.kind]}/?guide=${id}&view=${view}#editor`;
}
