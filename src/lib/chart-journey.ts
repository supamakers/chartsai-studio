export const chartInputs = {
  dumbbell: {
    name: 'dumbbell chart',
    input:
      'Use one category column and exactly two value columns. Up to 30 categories; extra spreadsheet columns are fine.',
    mapping: 'Choose category labels and exactly two numeric series. The two values stay paired on each row.',
    preview: 'Each connected pair compares two values for one category.',
    unit: 'category',
    min: 1,
    max: 30,
  },
  slopegraph: {
    name: 'slopegraph',
    input:
      'Use one category column and exactly two value columns. Up to 12 categories for readable endpoint labels.',
    mapping: 'Choose category labels and two ordered numeric columns, such as 2000 and 2023.',
    preview: 'Each line compares two endpoints; it does not show the intermediate path.',
    unit: 'category',
    min: 1,
    max: 12,
  },
  'small-multiples': {
    name: 'small multiples chart',
    input:
      'Use an ordered label, number or date column and 1–5 numeric series. Up to 300 rows, one panel per series.',
    mapping: 'Choose ordered horizontal labels and the numeric series to show in separate panels.',
    preview: 'Every panel uses the same vertical scale.',
    unit: 'point',
    min: 2,
    max: 300,
  },

  dot: {
    name: 'dot plot',
    input: 'Plot up to 300 numbers. Extra columns are fine — you’ll choose which one to use next.',
    mapping: 'Choose one numeric column. Each selected value becomes one dot.',
    preview: 'Each dot is one value. Repeated values stack up.',
    unit: 'value',
    min: 1,
    max: 300,
  },
  histogram: {
    name: 'histogram',
    input: 'Use up to 2,000 measurements in one numeric column. Choose that column after uploading.',
    mapping: 'Choose the measurements to group into bins. Supply individual values, not a frequency table.',
    preview: 'Values are grouped into bins. You can adjust the bin settings below.',
    unit: 'value',
    min: 1,
    max: 2000,
  },
  box: {
    name: 'box plot',
    input: 'Use a numeric column, with an optional group column. Up to 2,000 values across eight groups.',
    mapping:
      'Choose individual measurements and, optionally, their groups. With no group column, all values make one box.',
    preview: 'Each box summarizes a group. Outliers remain visible as individual points.',
    unit: 'value',
    min: 1,
    max: 2000,
  },
  scatter: {
    name: 'scatter plot',
    input: 'Use two numeric columns: one for X and one for Y. Each row becomes a point. Up to 2,000 pairs.',
    mapping:
      'Choose X (horizontal) and Y (vertical). Values on the same row stay paired; extra columns are ignored only when unselected.',
    preview: 'Each point uses X and Y from the same row. A trend does not establish causation.',
    unit: 'point',
    min: 2,
    max: 2000,
  },
  bar: {
    name: 'bar chart',
    input: 'Use a category column and one to five numeric series. Up to 50 categories; supply their totals.',
    mapping:
      'Choose the category labels and numeric series. Use one row per category; repeated categories need explicit totals before import.',
    preview: 'Each category compares the selected series. Change the arrangement below.',
    unit: 'category',
    min: 1,
    max: 50,
  },
  pareto: {
    name: 'Pareto chart',
    input: 'Use a category column and one numeric measure, such as count or cost. Up to 50 categories.',
    mapping:
      'Choose categories and one nonnegative measure. Use one row per category, with totals already calculated.',
    preview: 'Categories are ranked by your measure, with a cumulative percentage line.',
    unit: 'category',
    min: 1,
    max: 50,
  },
  line: {
    name: 'line graph',
    input:
      'Use a label, date or X column and one to five numeric series. Up to 300 rows, in your chosen order.',
    mapping:
      'Choose the horizontal labels or positions, then the numeric series. Select equal, numeric or date spacing; rows are never sorted for you.',
    preview:
      'Lines connect your rows in the supplied order. Check the horizontal spacing before downloading.',
    unit: 'point',
    min: 2,
    max: 300,
  },
  radar: {
    name: 'radar chart',
    input: 'Use 3–10 dimensions and one to five score series. All scores need the same declared scale.',
    mapping:
      'Choose the dimension names and score series, then declare the shared scale. Use comparable units; scores are never normalized for you.',
    preview: 'Compare scores along matching axes. The shape is a profile, not an overall score.',
    unit: 'dimension',
    min: 3,
    max: 10,
  },
} as const;
export type JourneyKind = keyof typeof chartInputs;
export type ImportSettings = { radarMax?: number; lineMode?: 'category' | 'number' | 'time' };
