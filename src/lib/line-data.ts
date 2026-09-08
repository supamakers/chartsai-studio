import { readNumber, type Table } from './data';
import type { LineSpec } from './chart-options';

/** Validate without dropping, sorting, aggregating or coercing missing observations. */
export function validateLineTable(table: Table, mode: LineSpec['xMode']) {
  const labels = table.slice(1).map((row) => row[0]?.trim() ?? '');
  const series = table[0]?.slice(1).map((v) => v.trim()) ?? [];
  const values = table.slice(1).map((row) => series.map((_, i) => readNumber(row[i + 1] ?? '')));
  let error = '';
  if (labels.length < 2 || labels.length > 300 || series.length < 1 || series.length > 5)
    error = 'Use 2–300 points and 1–5 series. No observations have been removed.';
  else if (labels.some((v) => !v || v.length > 40) || series.some((v) => !v || v.length > 22))
    error =
      'Name every point and series. Use labels up to 40 characters and series names up to 22 characters.';
  else if (new Set(series).size !== series.length)
    error = 'Give each series a different name so the legend is unambiguous.';
  else if (values.some((row) => row.some((v) => v === null)))
    error =
      'Every selected value needs a valid number. Missing values are not zero and are not connected across.';
  else if (mode !== 'category') {
    const positions = labels.map((label) => {
      if (mode === 'number') return readNumber(label);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(label)) return null;
      const d = new Date(label + 'T00:00:00Z');
      return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === label ? d.getTime() : null;
    });
    if (positions.some((v) => v === null))
      error =
        mode === 'time'
          ? 'Use real dates in YYYY-MM-DD format, such as 2026-09-08. Ambiguous dates are not guessed.'
          : 'Each horizontal label must be a valid number for numeric spacing.';
    else if (positions.some((v, i) => i > 0 && v! <= positions[i - 1]!))
      error =
        'For numeric or date spacing, put points in strictly increasing order with no duplicate positions. Rows are never sorted or aggregated automatically.';
  }
  // Numeric positions use the same parser for validation and plotting.
  const normalizedLabels = mode === 'number' && !error ? labels.map((v) => String(readNumber(v))) : labels;
  return {
    labels: normalizedLabels,
    series,
    values: values as number[][],
    error,
  };
}
