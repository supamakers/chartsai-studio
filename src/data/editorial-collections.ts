import type { TemplateKind } from '../lib/editorial-template-ids';
export const editorialCollections: Record<
  TemplateKind,
  {
    name: string;
    answer: string;
    use: string;
    avoid: string;
    read: string;
    input: string;
    question: string;
    response: string;
  }
> = {
  dumbbell: {
    name: 'Dumbbell chart examples',
    answer:
      'Dumbbell charts compare two values for each category on a shared numeric axis. These four editable examples show before/after changes and differences between groups, with the data and interpretation beside each chart.',
    use: 'Use a dumbbell when readers need both endpoints and the distance between them. Two named series let you compare years, groups or conditions without stacking two bars for every category. A circle and diamond distinguish the series even when colors are difficult to tell apart.',
    avoid:
      'The connector is not a time series, confidence interval or distribution. It contains no observations between its endpoints. If the intermediate path matters, use a line chart or small multiples. If the two columns have different units, the paired comparison is not valid.',
    read: 'Start with the unit and legend, then read the endpoints. Compute a signed difference as second value minus first. The gap length is absolute distance; a point moving left can mean improvement for waiting time but deterioration for an outcome where more is better. Explain that meaning in the headline.',
    input:
      'One category column and exactly two numeric columns. Select those columns from your spreadsheet; extra columns can stay unselected. Up to 30 categories are supported. Row order is retained.',
    question: 'Is this the same as a dot plot?',
    response:
      'Our distribution dot plot stacks individual observations at their values. These dumbbell examples connect two values for each named category. The tasks and input tables differ.',
  },
  slopegraph: {
    name: 'Slopegraph examples',
    answer:
      'A slopegraph joins two values for each category across two columns. These four editable examples show before/after changes, changing order and absolute levels, with source tables and explanations of what the lines can and cannot say.',
    use: 'Use a slopegraph to show a small set of categories at two comparable snapshots. Direct names and values at both ends let readers follow one item. Crossings can reveal changes in relative order, while the endpoint positions retain the original measurement.',
    avoid:
      'Do not infer the missing path between snapshots. A straight rising connector can hide a long intervening decline. Crowded or nearly equal endpoints also become hard to read; reduce the selection explicitly or use a dumbbell chart. Our maker supports up to 12 categories, but fewer may be clearer.',
    read: 'Read both the level and the signed change. A steeper line represents a larger difference when all categories share the same unit and snapshots. It is not a rate per day unless the time interval and calculation establish one. Changing the canvas aspect ratio changes apparent steepness without changing values.',
    input:
      'One category column and exactly two numeric columns. Name the columns with the two snapshots or conditions. Do not paste rank numbers when you intend to show points, money or another measured quantity.',
    question: 'Can a slopegraph show ranking changes?',
    response:
      'Yes. Categories can change vertical order between snapshots, as the league-points example shows. This plots the actual points. It is not a bump chart with a dedicated ordinal rank axis.',
  },
  'small-multiples': {
    name: 'Small multiples chart examples',
    answer:
      'Small multiples repeat a chart in separate panels using a shared layout and value scale. These four editable line-chart examples make several trends readable without overlapping every series in one plot.',
    use: 'Use repeated panels when the reader needs to inspect each series and compare it with the others. The same numeric range makes a given vertical distance mean the same amount in every panel. Panel titles identify the series without relying on a multicolor legend.',
    avoid:
      'Do not independently rescale panels when their levels are meant to be compared. A cropped common scale is permitted but must stay explicit. Different units or definitions need a different design; this maker does not normalize series or silently fill missing values.',
    read: 'Compare levels first, then direction, timing and interruptions. Peaks in different panels can happen in different months even if endpoint changes look similar. Repeated shapes alone do not establish a shared cause. Separate panels also sacrifice the exact crossings that an overlaid line chart can show.',
    input:
      'One ordered label, numeric position or date column, followed by one to five numeric series. Each row needs a value for every selected series. Numeric/date positions must increase; categorical labels keep their supplied order. Three or more panels use the square canvas.',
    question: 'Are trellis charts and small multiples the same?',
    response:
      'Trellis and panel charts are related names for repeated-chart arrangements. This collection specifically supplies line panels with one shared value scale; it does not promise every possible trellis chart type.',
  },
};
