import data from './editorial-data.json';
import { projectDefaults, type EditorialKind, type EditorialProject } from '../lib/editorial';
const lifeBase = {
  ...projectDefaults,
  source: 'World Bank WDI · SP.DYN.LE00.IN · UN and national sources · CC BY 4.0',
  sourceUrl: 'https://data.worldbank.org/indicator/SP.DYN.LE00.IN',
  date: '2000–2023 · retrieved 2026-09-09',
  unit: 'Life expectancy at birth (years)',
  zero: false,
  decimals: 1,
};
const pairTable = [
  ['Country', '2000', '2023'],
  ...data.life[0].slice(1).map((name, i) => [name, data.life[1][i + 1], data.life.at(-1)![i + 1]]),
];
export function editorialExample(kind: EditorialKind): EditorialProject {
  if (kind === 'line')
    return {
      ...projectDefaults,
      kind,
      title: 'A warmer endpoint, with variation along the way',
      subtitle: 'Global annual temperature anomaly · 1960–2025 · relative to 1951–1980',
      unit: 'Temperature anomaly (°C)',
      table: structuredClone(data.temperature),
      xMode: 'number',
      zero: true,
      decimals: 2,
      source: 'NASA GISS/GISTEMP v4 · GISTEMP Team (2026); Lenssen et al. (2024)',
      sourceUrl: 'https://data.giss.nasa.gov/gistemp/',
      date: '1960–2025 · retrieved 2026-09-09',
      caption:
        'Annual anomalies relative to 1951–1980, not absolute temperatures. Source revisions remain possible.',
      annotations: [
        { label: '2024', series: 'Global', text: '1.28°C above the baseline in this retrieved series.' },
      ],
    };
  if (kind === 'small-multiples')
    return {
      ...lifeBase,
      kind,
      table: structuredClone(data.life),
      title: 'Four countries, four paths through the same years',
      subtitle: 'Life expectancy at birth · annual estimates, 2000–2023',
      caption:
        'All panels use the same vertical scale. Four deliberately selected countries; this is not a world average.',
      xMode: 'number',
      frame: 'square',
    };
  if (kind === 'bar')
    return {
      ...lifeBase,
      kind,
      table: [['Country', '2023'], ...pairTable.slice(1).map((row) => [row[0], row[2]])],
      title: 'Life expectancy in four countries in 2023',
      subtitle: 'A snapshot, shown on a zero-based scale',
      zero: true,
      caption:
        'Selected countries only. Period life expectancy is a population estimate, not a prediction for an individual.',
    };
  return {
    ...lifeBase,
    kind,
    table: structuredClone(pairTable),
    title:
      kind === 'dumbbell'
        ? 'Life expectancy rose in all four selected countries'
        : 'Two endpoints show change, not the full journey',
    subtitle: 'Life expectancy at birth · 2000 and 2023',
    caption:
      'Selected countries; differences are in years. The connecting segment does not describe the intervening annual path.',
  };
}
export const editorialRoutes = {
  line: '/line-graph-maker/?publication=1#editor',
  bar: '/bar-chart-maker/?publication=1#editor',
  dumbbell: '/dumbbell-chart-maker/',
  slopegraph: '/slopegraph-maker/',
  'small-multiples': '/small-multiples-chart-maker/',
};
