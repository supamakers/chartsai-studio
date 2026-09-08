import {
  defaultPresentation,
  type ChartSpec,
  type LineSpec,
  type DotSpec,
  type RadarSpec,
} from './chart-options';

const source = 'Source: fictional example data. Replace with your own.';
function line(
  title: string,
  xLabel: string,
  yLabel: string,
  labels: string[],
  series: string[],
  values: number[][],
  options: Partial<LineSpec> = {},
): LineSpec {
  return {
    ...defaultPresentation,
    kind: 'line',
    title,
    xLabel,
    yLabel,
    labels,
    series,
    values,
    xMode: 'category',
    zeroBaseline: true,
    markers: true,
    subtitle: 'Original worked example · fictional data',
    source,
    ...options,
  };
}
function dot(title: string, label: string, values: number[], options: Partial<DotSpec> = {}): DotSpec {
  return {
    ...defaultPresentation,
    kind: 'dot',
    title,
    label,
    values,
    meanLine: true,
    showCounts: true,
    subtitle: 'Each dot is one observation · fictional data',
    source,
    ...options,
  };
}
function radar(
  title: string,
  axes: string[],
  series: string[],
  scores: number[][],
  options: Partial<RadarSpec> = {},
): RadarSpec {
  return {
    ...defaultPresentation,
    kind: 'radar',
    title,
    axes,
    series,
    scores,
    max: 10,
    filled: true,
    round: false,
    subtitle: 'Illustrative ratings · a shared 0–10 scale',
    source,
    ...options,
  };
}
export const showcaseSpecs = {
  'monthly-sales-line-chart': line(
    'Sales through a changing season',
    'Month',
    'Sales (USD)',
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    ['Sales'],
    [[4200], [4800], [4500], [6100], [6700], [7200]],
    { theme: 'ocean' },
  ),
  'multiple-line-graph': line(
    'Three routes to the same destination',
    'Week',
    'Completed orders',
    ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    ['Online', 'In store', 'Wholesale'],
    [
      [40, 65, 25],
      [55, 62, 30],
      [70, 60, 35],
      [85, 64, 40],
      [100, 68, 45],
    ],
    { theme: 'night', frame: 'wide' },
  ),
  'line-graph-negative-values': line(
    'Across the freezing point',
    'Day',
    'Temperature (°C)',
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    ['Temperature'],
    [[-4], [-2], [1], [3], [0], [-1], [2]],
    { subtitle: 'Daily readings · zero is a measured value', theme: 'ocean' },
  ),
  'uneven-time-intervals': line(
    'Four visits, fourteen days',
    'Date',
    'Plant height (cm)',
    ['2026-04-01', '2026-04-02', '2026-04-08', '2026-04-15'],
    ['Height'],
    [[10], [11], [15], [19]],
    { xMode: 'time', subtitle: 'Date spacing preserves gaps between visits' },
  ),
  'distance-time-graph': line(
    'A walk with a pause',
    'Time (minutes)',
    'Distance travelled (metres)',
    ['0', '2', '5', '7', '10'],
    ['Distance'],
    [[0], [120], [300], [300], [480]],
    { xMode: 'number', theme: 'ocean', subtitle: 'An imagined journey · cumulative distance' },
  ),
  'speed-time-graph': line(
    'Accelerate. Cruise. Stop.',
    'Time (seconds)',
    'Speed (m/s)',
    ['0', '4', '10', '14'],
    ['Speed'],
    [[0], [8], [8], [0]],
    { xMode: 'number', theme: 'night', subtitle: 'Straight segments define this fictional motion model' },
  ),
  'cumulative-frequency-graph': line(
    'How many journeys take less time?',
    'Upper boundary (minutes)',
    'Cumulative frequency',
    ['0', '10', '20', '30', '40', '50'],
    ['Journeys'],
    [[0], [4], [12], [22], [28], [30]],
    { xMode: 'number', subtitle: '30 fictional journeys · grouped into 10-minute bands' },
  ),
  'break-even-chart': line(
    'Where revenue meets total cost',
    'Units sold',
    'Amount (USD)',
    ['0', '50', '100', '150', '200', '250', '300'],
    ['Revenue', 'Total cost', 'Fixed cost'],
    [
      [0, 1200, 1200],
      [1000, 1600, 1200],
      [2000, 2000, 1200],
      [3000, 2400, 1200],
      [4000, 2800, 1200],
      [5000, 3200, 1200],
      [6000, 3600, 1200],
    ],
    {
      xMode: 'number',
      theme: 'ocean',
      frame: 'wide',
      subtitle: 'Illustrative model · $20 price · $8 variable cost per unit',
    },
  ),
  'class-score-dot-plot': dot(
    'One class. Every score.',
    'Quiz score out of 10',
    [4, 5, 5, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 9, 9, 10],
    { meanLine: false },
  ),
  'dot-plot-mean-median': dot(
    'An average is only part of the story',
    'Books read',
    [0, 1, 1, 2, 2, 2, 3, 5],
    { theme: 'ocean' },
  ),
  'dot-plot-with-outlier': dot(
    'The wait that stands apart',
    'Waiting time (minutes)',
    [2, 3, 3, 4, 4, 4, 5, 5, 6, 24],
    { theme: 'night', subtitle: 'Ten fictional waits · the longest stays in the data' },
  ),
  'dot-plot-fractions': dot(
    'Lengths measured in quarter inches',
    'Ribbon length (inches)',
    [0.5, 0.75, 0.75, 1, 1, 1, 1.25, 1.25, 1.5, 1.75],
    { meanLine: false, theme: 'ocean', subtitle: 'Quarter-inch measurements shown as exact decimals' },
  ),
  'skewed-dot-plot': dot(
    'Most calls are short. A few run longer.',
    'Call length (minutes)',
    [1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 5, 6, 8, 10, 12],
    { subtitle: 'A right-skewed example · 15 fictional calls' },
  ),
  'bimodal-dot-plot': dot(
    'Two peaks in one collection',
    'Completion time (minutes)',
    [2, 3, 3, 3, 4, 4, 5, 7, 8, 8, 9, 9, 9, 10],
    { theme: 'night', subtitle: 'Two equal modes · fictional completion times' },
  ),
  'skills-radar-chart': radar(
    'A practice plan, made visible',
    ['Research', 'Design', 'Writing', 'Coding', 'Presenting', 'Planning'],
    ['Current', 'Practice goal'],
    [
      [5, 7],
      [7, 8],
      [6, 8],
      [3, 6],
      [4, 7],
      [6, 7],
    ],
    { theme: 'ocean', filled: false },
  ),
  'product-comparison-radar-chart': radar(
    'Two products. Different trade-offs.',
    ['Usability', 'Features', 'Support', 'Affordability', 'Portability'],
    ['Product A', 'Product B'],
    [
      [9, 6],
      [6, 9],
      [8, 7],
      [7, 5],
      [5, 9],
    ],
    { theme: 'night' },
  ),
  'football-player-radar-chart': radar(
    'Different roles on the same pitch',
    ['Passing', 'Finishing', 'Dribbling', 'Tackling', 'Positioning', 'Pace'],
    ['Player A', 'Player B'],
    [
      [8, 6],
      [5, 9],
      [7, 8],
      [9, 4],
      [8, 7],
      [6, 9],
    ],
    { subtitle: 'Fictional coaching ratings · not real player statistics' },
  ),
  'customer-satisfaction-radar-chart': radar(
    'A service experience, in five dimensions',
    ['Clarity', 'Courtesy', 'Speed', 'Resolution', 'Follow-up'],
    ['Before', 'After'],
    [
      [3.2, 4.1],
      [4.2, 4.3],
      [2.8, 3.6],
      [3.5, 4.0],
      [2.4, 3.7],
    ],
    { max: 5, theme: 'ocean', subtitle: 'Illustrative mean ratings · shared 0–5 scale' },
  ),
  'competitor-analysis-radar-chart': radar(
    'Compare the offer, dimension by dimension',
    ['Onboarding', 'Documentation', 'Integrations', 'Support', 'Accessibility', 'Value'],
    ['Our concept', 'Alternative A', 'Alternative B'],
    [
      [8, 6, 7],
      [7, 9, 5],
      [5, 8, 9],
      [8, 7, 5],
      [9, 6, 7],
      [7, 5, 8],
    ],
    {
      filled: false,
      frame: 'wide',
      theme: 'night',
      subtitle: 'Three fictional offers · illustrative scores, not reviews',
    },
  ),
  'wheel-of-life-chart': radar(
    'A moment for reflection',
    ['Learning', 'Work', 'Rest', 'Friends', 'Family', 'Creativity', 'Home', 'Leisure'],
    ['Reflection'],
    [[7], [6], [4], [8], [8], [5], [7], [6]],
    { round: true, subtitle: 'Fictional reflection · 0–10 satisfaction ratings' },
  ),
} satisfies Record<string, ChartSpec>;
export type ShowcaseSlug = keyof typeof showcaseSpecs;
export const showcaseSlugs = Object.keys(showcaseSpecs) as ShowcaseSlug[];
export const showcaseGroups = {
  line: { slug: 'line-graphs', name: 'Line graph examples', tool: '/line-graph-maker/' },
  dot: { slug: 'dot-plots', name: 'Dot plot examples', tool: '/dot-plot-maker/' },
  radar: { slug: 'radar-charts', name: 'Radar chart examples', tool: '/radar-chart-maker/' },
} as const;
export function findShowcase(id: string | null, kind?: ChartSpec['kind']): ChartSpec | undefined {
  if (!id || !Object.hasOwn(showcaseSpecs, id)) return;
  const spec = showcaseSpecs[id as ShowcaseSlug];
  return !kind || spec.kind === kind ? spec : undefined;
}
export function showcaseTable(spec: ChartSpec): (string | number)[][] {
  if (spec.kind === 'dot') return [[spec.label], ...spec.values.map((v) => [v])];
  if (spec.kind === 'radar')
    return [['Dimension', ...spec.series], ...spec.axes.map((a, i) => [a, ...spec.scores[i]])];
  return [[spec.xLabel, ...spec.series], ...spec.labels.map((a, i) => [a, ...spec.values[i]])];
}
