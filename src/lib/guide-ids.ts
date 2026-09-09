// Fixed public resource identifiers; safe to include in the analytics bundle.
export const comparisonIds = [
  'box-plot-vs-histogram',
  'dot-plot-vs-histogram',
  'histogram-bin-width',
  'truncated-y-axis',
  'logarithmic-scale-graph',
  'pie-chart-vs-bar-graph',
] as const;
export type ComparisonId = (typeof comparisonIds)[number];
export function comparisonId(value: unknown): ComparisonId | undefined {
  return typeof value === 'string' && comparisonIds.includes(value as ComparisonId)
    ? (value as ComparisonId)
    : undefined;
}
