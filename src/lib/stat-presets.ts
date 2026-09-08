import { statDefaults, type StatKind, type StatSpec } from './statistics';
export const statFamilies = {
  histogram: {
    name: 'Histogram',
    tool: 'histogram-maker',
    hub: 'histograms',
    answer:
      'Group individual numeric observations into equal-width intervals. Choose a bin count or explicit start and width, inspect every frequency, and switch between counts and percentages.',
    input:
      'One numeric column with a header. Up to 2,000 observations. Bins are left-closed and right-open; the final bin also includes its upper boundary.',
  },
  box: {
    name: 'Box plot',
    tool: 'box-plot-maker',
    hub: 'box-plots',
    answer:
      'Compare distributions using calculated quartiles, medians and whiskers. Choose linear-interpolated quartiles or the exclusive median-of-halves method, and keep outlying observations visible.',
    input:
      'Two columns: group name and individual value. Repeat each group name for its observations. Up to eight groups and 2,000 observations in total.',
  },
  scatter: {
    name: 'Scatter plot',
    tool: 'scatter-plot-maker',
    hub: 'scatter-plots',
    answer:
      'Plot paired X and Y measurements without joining the observations. Inspect Pearson correlation and optionally draw the ordinary least-squares regression line with an intercept.',
    input:
      'Exactly two numeric columns, X then Y, with a header. Between 2 and 2,000 paired observations. Repeated pairs stay in the data.',
  },
  bar: {
    name: 'Bar chart',
    tool: 'bar-chart-maker',
    hub: 'bar-charts',
    answer:
      'Compare named categories with grouped, stacked or 100% stacked bars. Switch orientation for long labels and keep exact values available alongside the graphic.',
    input:
      'A category column followed by 1–5 numeric series. Up to 50 unique categories. Percentage stacks require nonnegative values and a positive total for every category.',
  },
  pareto: {
    name: 'Pareto chart',
    tool: 'pareto-chart-maker',
    hub: 'pareto-charts',
    answer:
      'Sort category values from largest to smallest and calculate their running share of the total. Bars show the chosen measure; the line uses a separate 0–100% axis.',
    input:
      'Two columns: unique category name and one nonnegative numeric measure. Up to 50 categories. The total must be positive; counts and costs must not be mixed.',
  },
} as const;
const base = (
  kind: StatKind,
  title: string,
  xLabel: string,
  yLabel: string,
  table: (string | number)[][],
  options: Partial<StatSpec> = {},
): StatSpec => ({
  ...statDefaults,
  kind,
  title,
  xLabel,
  yLabel,
  table: table.map((r) => r.map(String)),
  subtitle: 'Original worked example · fictional data',
  source: 'Source: fictional example data. Replace with your own.',
  ...options,
});
const h = (title: string, label: string, v: number[], o: Partial<StatSpec> = {}) =>
  base('histogram', title, label, 'Frequency', [[label], ...v.map((n) => [n])], o);
const b = (title: string, groups: Record<string, number[]>, o: Partial<StatSpec> = {}) =>
  base(
    'box',
    title,
    'Group',
    'Value',
    [['Group', 'Value'], ...Object.entries(groups).flatMap(([g, v]) => v.map((n) => [g, n]))],
    o,
  );
const s = (title: string, x: string, y: string, p: number[][], o: Partial<StatSpec> = {}) =>
  base('scatter', title, x, y, [[x, y], ...p], o);
const bar = (title: string, headers: string[], rows: (string | number)[][], o: Partial<StatSpec> = {}) =>
  base('bar', title, headers[0], 'Value', [headers, ...rows], o);
const p = (title: string, measure: string, rows: (string | number)[][], o: Partial<StatSpec> = {}) =>
  base('pareto', title, 'Category', measure, [['Category', measure], ...rows], o);
export const statPresets = {
  'histogram-class-scores': h(
    'Scores, grouped with care',
    'Score',
    [42, 48, 52, 56, 58, 61, 63, 66, 68, 70, 72, 74, 76, 78, 81, 83, 85, 88, 92, 97],
    { binStart: '40', binWidth: '10', theme: 'ocean' },
  ),
  'histogram-waiting-times': h(
    'Many short waits, a long tail',
    'Wait (minutes)',
    [1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 6, 7, 8, 12, 17, 23],
    { binStart: '0', binWidth: '5', theme: 'night' },
  ),
  'histogram-two-peaks': h(
    'Two concentrations in one sample',
    'Length (cm)',
    [2, 2, 3, 3, 3, 4, 4, 5, 11, 12, 12, 13, 13, 13, 14, 14],
    { binStart: '0', binWidth: '2' },
  ),
  'histogram-bin-boundaries': h(
    'Where does a boundary value go?',
    'Measurement',
    [0, 2, 4, 5, 5, 7, 9, 10, 10, 12, 14, 15],
    { binStart: '0', binWidth: '5', theme: 'ocean' },
  ),
  'histogram-relative-frequency': h(
    'The same sample, in percentages',
    'Duration (minutes)',
    [1, 2, 3, 4, 5, 6, 6, 7, 8, 9, 10, 11, 11, 12, 13, 14, 15, 16, 18, 19],
    { binStart: '0', binWidth: '5', relative: true, theme: 'night' },
  ),
  'histogram-negative-values': h(
    'Changes on both sides of zero',
    'Change (points)',
    [-9, -8, -6, -5, -4, -3, -1, 0, 0, 1, 2, 3, 4, 5, 7, 9],
    { binStart: '-10', binWidth: '5' },
  ),
  'box-plot-two-groups': b(
    'Same task. Different spreads.',
    { Morning: [10, 11, 12, 13, 14, 15, 16, 17], Evening: [8, 10, 12, 14, 16, 18, 20, 22] },
    { yLabel: 'Completion time (minutes)', theme: 'ocean' },
  ),
  'box-plot-outlier': b(
    'The unusual observation stays visible',
    { Sample: [2, 3, 4, 4, 5, 6, 7, 8, 30] },
    { yLabel: 'Value', theme: 'night' },
  ),
  'box-plot-equal-medians': b(
    'Matching centres, different variation',
    { Narrow: [8, 9, 9, 10, 10, 11, 11, 12], Wide: [0, 4, 6, 10, 10, 14, 16, 20] },
    { yLabel: 'Score' },
  ),
  'box-plot-small-sample': b(
    'Five observations, explicit quartiles',
    { Sample: [2, 4, 7, 10, 16] },
    { quartiles: 'halves', theme: 'ocean' },
  ),
  'box-plot-negative-values': b(
    'Compare signed changes',
    { GroupA: [-12, -8, -5, -2, 0, 1, 3, 7], GroupB: [-5, -3, 0, 2, 4, 6, 8, 12] },
    { yLabel: 'Change (units)', theme: 'night' },
  ),
  'box-plot-range-whiskers': b(
    'Whiskers that reach the extremes',
    { BatchA: [1, 2, 3, 4, 5, 6, 7, 20], BatchB: [2, 3, 4, 5, 6, 7, 8, 12] },
    { whiskers: 'range', yLabel: 'Duration (minutes)' },
  ),
  'scatter-positive-correlation': s(
    'Two measurements rise together',
    'X measurement',
    'Y measurement',
    [
      [1, 2],
      [2, 3],
      [3, 5],
      [4, 4],
      [5, 7],
      [6, 8],
      [7, 8],
      [8, 11],
    ],
    { regression: true, theme: 'ocean' },
  ),
  'scatter-negative-correlation': s(
    'A downward association',
    'X measurement',
    'Y measurement',
    [
      [1, 15],
      [2, 13],
      [3, 14],
      [4, 10],
      [5, 9],
      [6, 7],
      [7, 8],
      [8, 4],
    ],
    { regression: true, theme: 'night' },
  ),
  'scatter-curved-relationship': s(
    'A curve can hide behind zero correlation',
    'X',
    'Y',
    [
      [-4, 16],
      [-3, 9],
      [-2, 4],
      [-1, 1],
      [0, 0],
      [1, 1],
      [2, 4],
      [3, 9],
      [4, 16],
    ],
    { regression: true },
  ),
  'scatter-no-linear-correlation': s(
    'No linear tilt in these paired values',
    'X',
    'Y',
    [
      [1, 2],
      [1, 4],
      [2, 1],
      [2, 5],
      [3, 1],
      [3, 5],
      [4, 2],
      [4, 4],
    ],
    { regression: true, theme: 'ocean' },
  ),
  'scatter-influential-point': s(
    'One distant point changes the fit',
    'X',
    'Y',
    [
      [1, 2],
      [2, 2],
      [3, 3],
      [4, 3],
      [5, 4],
      [6, 4],
      [20, 30],
    ],
    { regression: true, theme: 'night' },
  ),
  'scatter-repeated-x-values': s(
    'Repeated X values are still observations',
    'Setting',
    'Response',
    [
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 3],
      [2, 4],
      [2, 6],
      [3, 5],
      [3, 7],
      [3, 8],
    ],
    { regression: true },
  ),
  'bar-horizontal-labels': bar(
    'Give category names room',
    ['Category', 'Responses'],
    [
      ['Clearer documentation', 48],
      ['Faster onboarding', 32],
      ['More export options', 27],
      ['Better keyboard access', 19],
    ],
    { horizontal: true, yLabel: 'Responses', theme: 'ocean' },
  ),
  'bar-grouped-comparison': bar(
    'Compare each series on a common baseline',
    ['Region', 'Period 1', 'Period 2'],
    [
      ['North', 42, 55],
      ['South', 58, 52],
      ['East', 35, 47],
      ['West', 61, 64],
    ],
    { yLabel: 'Orders', theme: 'night' },
  ),
  'bar-stacked-composition': bar(
    'The parts behind each total',
    ['Team', 'Completed', 'In progress', 'Not started'],
    [
      ['A', 30, 12, 8],
      ['B', 24, 20, 6],
      ['C', 36, 9, 15],
    ],
    { barMode: 'stacked', yLabel: 'Tasks' },
  ),
  'bar-percent-stacked': bar(
    'Compare shares when totals differ',
    ['Group', 'Option A', 'Option B', 'Option C'],
    [
      ['Small group', 20, 10, 10],
      ['Large group', 50, 100, 50],
      ['Medium group', 30, 30, 40],
    ],
    { barMode: 'percent', theme: 'ocean' },
  ),
  'bar-diverging-values': bar(
    'Positive and negative differences',
    ['Department', 'Change'],
    [
      ['Operations', 12],
      ['Support', -8],
      ['Design', 6],
      ['Research', -3],
      ['Sales', 0],
    ],
    { horizontal: true, yLabel: 'Change (units)', theme: 'night' },
  ),
  'bar-zero-category': bar(
    'Zero is a result, not a missing row',
    ['Day', 'Returns'],
    [
      ['Monday', 4],
      ['Tuesday', 0],
      ['Wednesday', 3],
      ['Thursday', 1],
      ['Friday', 6],
    ],
    { yLabel: 'Returned items' },
  ),
  'pareto-defect-counts': p(
    'Which defect types account for most reports?',
    'Defect reports',
    [
      ['Scratches', 42],
      ['Dents', 25],
      ['Misalignment', 18],
      ['Finish', 10],
      ['Other', 5],
    ],
    { theme: 'ocean' },
  ),
  'pareto-support-requests': p(
    'Sort requests before choosing a priority',
    'Requests',
    [
      ['Billing', 18],
      ['Sign-in', 47],
      ['Export', 29],
      ['Setup', 36],
      ['Other', 10],
    ],
    { theme: 'night' },
  ),
  'pareto-downtime-minutes': p('Duration tells a different story from count', 'Downtime (minutes)', [
    ['Changeover', 120],
    ['Repair', 240],
    ['Material wait', 90],
    ['Inspection', 30],
    ['Other', 20],
  ]),
  'pareto-cost-priorities': p(
    'Rank the cost, not just the incidents',
    'Cost (USD)',
    [
      ['Rework', 900],
      ['Scrap', 1500],
      ['Returns', 400],
      ['Shipping', 150],
      ['Other', 50],
    ],
    { theme: 'ocean' },
  ),
  'pareto-equal-categories': p(
    'Equal contributions have no leading category',
    'Reports',
    [
      ['A', 20],
      ['B', 20],
      ['C', 20],
      ['D', 20],
      ['E', 20],
    ],
    { theme: 'night' },
  ),
  'pareto-zero-category': p('Keep the zero category visible', 'Occurrences', [
    ['A', 40],
    ['B', 30],
    ['C', 20],
    ['D', 10],
    ['E', 0],
  ]),
} satisfies Record<string, StatSpec>;
export type StatPresetId = keyof typeof statPresets;
export const statPresetIds = Object.keys(statPresets) as StatPresetId[];
export function findStatPreset(id: string | null, kind?: StatKind) {
  if (!id || !Object.hasOwn(statPresets, id)) return;
  const s = statPresets[id as StatPresetId];
  return !kind || s.kind === kind ? s : undefined;
}
export const statExamplePath = (id: StatPresetId) =>
  `/examples/${statFamilies[statPresets[id].kind].hub}/${id}/`;
export function defaultStat(kind: StatKind) {
  return statPresets[statPresetIds.find((id) => statPresets[id].kind === kind)!];
}
