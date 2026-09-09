import { statDefaults, analyzeStat, type StatSpec } from './statistics';
import type { Table } from './data';

/** Full pinned source rows in their original order; no aggregation or sampling. */
export function irisSpeciesSpec(full: Table): StatSpec {
  const species = full[0].indexOf('species'),
    length = full[0].indexOf('petal_length');
  if (species < 0 || length < 0 || full.length !== 151)
    throw Error('Expected the pinned 150-row Iris source with species and petal_length.');
  const names = new Set(['Iris-setosa', 'Iris-versicolor', 'Iris-virginica']);
  if (full.slice(1).some((row) => !names.has(row[species]) || !row[length]?.trim()))
    throw Error('Unexpected Iris species or missing petal length.');
  const spec: StatSpec = {
    ...statDefaults,
    kind: 'box',
    theme: 'ocean',
    title: 'Iris petal lengths by species',
    subtitle: 'All 150 pinned source rows · 50 per species',
    source: 'Source: UCI Iris · Fisher (1936) · doi.org/10.24432/C56C76 · CC BY 4.0',
    xLabel: 'Species',
    yLabel: 'Petal length (cm)',
    table: [['Species', 'Petal length (cm)'], ...full.slice(1).map((row) => [row[species], row[length]])],
  };
  const result = analyzeStat(spec);
  if (result.boxes?.length !== 3 || result.boxes.some((b) => b.count !== 50))
    throw Error('The pinned source must retain 50 observations per species.');
  return spec;
}
