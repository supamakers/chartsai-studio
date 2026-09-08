import manifest from './dataset-manifest.json' with { type: 'json' };
import { statDefaults, type StatSpec } from '../lib/statistics';
const editorial: Record<
  string,
  {
    name: string;
    creator: string;
    doi: string;
    answer: string;
    columnNotes: string;
    interpretation: string;
    limitation: string;
    units: string;
    x: string;
    y: string;
  }
> = {
  iris: {
    name: 'Iris',
    creator: 'R. A. Fisher (1936)',
    doi: '10.24432/C56C76',
    answer:
      'Download the UCI Iris data as a headered CSV and inspect petal length against petal width. This resource pins bezdekIris.data, keeps all 150 source rows, and identifies the version so the plotted values can be reproduced.',
    columnNotes:
      'Four measurements describe sepal length, sepal width, petal length and petal width in centimetres. The final column identifies species. The repository includes both iris.data and bezdekIris.data and documents differences from Fisher’s published records; this resource consistently uses bezdekIris.data.',
    interpretation:
      'The plotted pair is petal length and petal width, retaining every row and the original numeric values. A pooled scatter can show association across the sample, but species membership may contribute to that pattern. Use the full CSV to compare species separately before describing a within-species relationship. Exactly overlapping points remain separate observations in the download.',
    limitation:
      'This historical teaching dataset is not a random sample of all irises. It does not establish current population proportions or a causal effect of one petal measurement on another. Our chart uses one colour for all observations, so it should not be mistaken for a species classifier.',
    units: 'Both plotted measurements are in centimetres.',
    x: 'Petal length (cm)',
    y: 'Petal width (cm)',
  },
  wine: {
    name: 'Wine',
    creator: 'S. Aeberhard and M. Forina (1992)',
    doi: '10.24432/C5PC7J',
    answer:
      'Use the UCI Wine CSV to explore 178 observations with a class label and thirteen chemical measurements. The ready-to-chart file selects alcohol and color intensity without standardizing or rescaling either column.',
    columnNotes:
      'The first source column is a class identifier, followed by thirteen measurements. The repository describes three cultivars from one Italian region. Its variable table does not supply units for the selected alcohol and color-intensity fields; this resource keeps the original values and does not invent units.',
    interpretation:
      'The scatter pairs alcohol with color intensity in source row order. The class code remains in the full CSV, not on either numeric axis. Treating codes 1, 2 and 3 as a continuous measurement would create an arbitrary numerical relationship. For a follow-up, split the paired data by class and compare the within-class pattern with the pooled picture.',
    limitation:
      'The sample is a historical classification dataset, not a quality ranking or a representative survey of wines. No tasting score or market outcome is supplied. A visually separated group would not establish that one cultivar is better or that alcohol causes color intensity.',
    units: 'Source values retained; selected measurement units are unspecified in the UCI variable table.',
    x: 'Alcohol (source scale)',
    y: 'Color intensity (source scale)',
  },
  glass: {
    name: 'Glass Identification',
    creator: 'B. German (1987)',
    doi: '10.24432/C5WW2P',
    answer:
      'Explore all 214 rows of the UCI Glass Identification data. The chart pairs sodium content with refractive index, while the full CSV keeps the record identifier, nine measurements and glass class code.',
    columnNotes:
      'The first column is a record identifier and the last a glass-type code. Sodium and the other elemental fields are reported as weight percent in the corresponding oxide; refractive index is a separate dimensionless measure. The repository lists class code 4 but notes that no observations of that class are present.',
    interpretation:
      'The record identifier is retained for traceability and excluded from the scatter coordinates. Sodium supplies X and refractive index supplies Y. These different measures belong on separately labelled axes; they should not be summed as though they were parts of a common total. The chart retains unusual measurements rather than deleting them to produce a smoother cloud.',
    limitation:
      'This historical dataset supports exploratory plotting and method practice. A scatter of two measurements is not a validated identification procedure or forensic conclusion. Class membership and the remaining measurements are available in the full CSV for more careful analysis, but no classifier is trained here.',
    units: 'X: sodium, weight percent in corresponding oxide. Y: refractive index, dimensionless.',
    x: 'Sodium (oxide weight %)',
    y: 'Refractive index',
  },
  seeds: {
    name: 'Seeds',
    creator: 'M. Charytanowicz, J. Niewczas, P. Kulczycki, P. Kowalski and S. Lukasik (2010)',
    doi: '10.24432/C5H30K',
    answer:
      'Download the 210-row UCI Seeds dataset with column headers and a ready-to-chart area–perimeter pair. The conversion preserves the original whitespace-separated values and adds names without changing the observations.',
    columnNotes:
      'The source has seven geometric features and a final class code. Features are area, perimeter, compactness, kernel length, kernel width, asymmetry coefficient and groove length. The repository describes three wheat varieties with seventy observations each. Units are not specified in its variable listing, so the chart labels retain the source scale.',
    interpretation:
      'Area and perimeter describe related aspects of kernel geometry. Their scatter is useful for examining the sample’s shape relationship, but the two measurements are not interchangeable. The compactness feature uses 4πA/P², which already combines area and perimeter. A follow-up analysis should recognize that mathematical dependence before treating all three fields as independent evidence.',
    limitation:
      'The plotted sample describes the supplied experimental kernels. It is not a production yield comparison or evidence of a superior variety. The chart does not infer a variety name from the class code; use the primary documentation when assigning category labels in a downstream analysis.',
    units:
      'Area and perimeter are kept on the source scale; units are not specified in the repository listing.',
    x: 'Area (source scale)',
    y: 'Perimeter (source scale)',
  },
  abalone: {
    name: 'Abalone',
    creator: 'W. Nash, T. Sellers, S. Talbot, A. Cawthorn and W. Ford (1994)',
    doi: '10.24432/C55C7W',
    answer:
      'Download all 4,177 UCI Abalone records, or use the explicitly labelled 300-row chart subset. The scatter pairs the supplied length value with ring count; it does not silently trim a full-data upload to fit the editor.',
    columnNotes:
      'The source contains a sex/category field, seven continuous physical measurements and ring count. UCI documents prior removal of missing records and scaling of continuous values by division by 200. We preserve the supplied numeric values and label length as source-scaled rather than presenting it as an untransformed millimetre measurement.',
    interpretation:
      'The chart selects source rows floor(i × 4176 / 299) + 1 for i from 0 to 299. This includes the first and last rows and spaces selected positions across the file. It is deterministic and reproducible, but it is not random sampling and carries no representativeness guarantee. The manifest lists every selected one-based row number.',
    limitation:
      'The complete CSV exceeds this editor’s 2,000-observation limit. Use the 300-row file for this chart or analyze the complete data in another environment. Ring count remains ring count; this chart does not relabel it as exact age. The subset cannot establish population relationships, and the source’s earlier preprocessing is separate from our conversion.',
    units: 'X: supplied source-scaled length. Y: ring count. No rescaling or age conversion is performed.',
    x: 'Length (source-scaled)',
    y: 'Rings (count)',
  },
};
export const datasets = manifest.map((m) => ({ ...m, ...editorial[m.id], url: `/datasets/${m.id}/` }));
export function datasetSpec(id: string, table: string[][]): StatSpec {
  const d = datasets.find((d) => d.id === id);
  if (!d) throw Error('Unknown dataset.');
  return {
    ...statDefaults,
    kind: 'scatter',
    title: `${d.name}: ${d.chartRows} observations`,
    subtitle:
      d.id === 'abalone'
        ? '300 selected rows · not a random sample'
        : 'All source rows · original measurement values',
    source: `Source: UCI ${d.name} · ${{iris:'Fisher (1936)',wine:'Aeberhard & Forina (1992)',glass:'German (1987)',seeds:'Charytanowicz et al. (2010)',abalone:'Nash et al. (1994)'}[d.id]} · doi.org/${d.doi} · CC BY 4.0`,
    xLabel: d.x,
    yLabel: d.y,
    table,
    theme: 'ocean',
    regression: false,
  };
}
