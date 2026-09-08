import type { StatKind } from '../lib/statistics';
export const statHubNotes: Record<StatKind, { title: string; text: string }[]> = {
  histogram: [
    {
      title: 'Choose an example by the question inside the distribution',
      text: 'The score example starts with familiar ten-point intervals and shows how a wider grouping combines counts. Waiting times introduce a long right tail, while the two-peaks example preserves an empty gap between clusters. Use these cases to compare the shape a histogram reveals with the exact observations it groups. Each page includes the full numeric list, so a reader can check whether a visual peak represents repeated exact values or several different values sharing an interval.',
    },
    {
      title: 'Inspect the decisions that change a histogram',
      text: 'The boundary example puts repeated observations exactly on interval endpoints. It is designed to expose whether a rule counts them once. The relative-frequency example changes the vertical measure from counts to percentages without changing boundaries. Signed changes demonstrate that zero and negative observations belong on the numeric scale. Together these cases cover grouping, denominator and sign decisions that are easy to miss when starting from a polished picture.',
    },
    {
      title: 'Adapt a case without inheriting its story',
      text: 'Start with the example closest to your input, open its exact settings, and replace the observation list. A waiting-time title does not make arbitrary numbers waiting-time evidence. Supply the actual units and source, inspect the new bin counts and write a fresh interpretation. If only grouped counts are available, do not paste them as though each count were an individual measurement. The histogram editor expects raw observations and calculates their frequencies.',
    },
  ],
  box: [
    {
      title: 'Start with the comparison you need to make',
      text: 'The two-group example compares completion times with equal sample sizes, while the equal-median example shows why a shared centre can hide different variation. Signed changes place boxes on both sides of a meaningful zero reference. These cases help separate sample size, centre and spread: a longer box describes the middle numeric range, not the number of observations or whether a group performed better.',
    },
    {
      title: 'Use the convention cases to check another calculation',
      text: 'The five-observation example is small enough to calculate quartiles by hand. Switching between linear interpolation and medians of halves changes its box edges without changing its median. The outlier example distinguishes a calculated fence from an observed whisker endpoint. The range-whisker example shows the same data under a convention that reaches the minimum and maximum. These are explicit method differences, not alternative measurements.',
    },
    {
      title: 'Keep the observations available after summarizing',
      text: 'A box plot compresses a distribution and can conceal repeated values, gaps and multiple peaks. Download the full list when those details matter. To make your own comparison, repeat a group label beside each individual observation and check N in the summary. Unequal sample sizes, different collection conditions or subjective group definitions need explanation outside the box geometry. The editor does not supply a significance test or decide whether an unusual point should be excluded.',
    },
  ],
  scatter: [
    {
      title: 'Read patterns before reading one coefficient',
      text: 'The positive and negative examples show overall linear directions with local deviations. The curved case gives an exact U shape with zero Pearson correlation, while a separate balanced example also has zero correlation with a different point pattern. Comparing them makes a practical point: a coefficient describes a particular property of the pairs, not the complete relationship. Every example keeps the coordinates available beside the picture.',
    },
    {
      title: 'Check what a fitted line depends on',
      text: 'The influential-point case adds a distant observation to a nearby cluster. It provides a starting point for an explicit sensitivity comparison, without automatically removing the point. The repeated-X case shows why several measurements at one setting remain valid observations. A fitted line can use those repeats as long as X varies somewhere in the sample. The editor reports undefined correlation or slope when constant variables prevent the corresponding calculation.',
    },
    {
      title: 'Preserve pairing when adapting an example',
      text: 'Keep X and Y from the same observation on one row. Sorting the columns separately destroys that association, even if both columns still contain the original numbers. Start with the paired CSV, select exactly two numeric columns and inspect all selected rows. Add an appropriate title and units, then decide whether a straight-line summary is useful. The optional fit does not establish causality, provide uncertainty bands or justify extrapolating beyond the observed X range.',
    },
  ],
  bar: [
    {
      title: 'Choose between amounts, parts and shares',
      text: 'Grouped bars compare each series from a common baseline. Ordinary stacks emphasize meaningful totals and their components. Percentage stacks instead compare composition after dividing each category by its own total. The collection includes a worked case for each question, with raw counts retained even when the plotted values become percentages. Changing the layout should follow a change in the question, not just a preference for a different silhouette.',
    },
    {
      title: 'Use labels and signs as part of the explanation',
      text: 'The horizontal example gives longer category names room and preserves the supplied ranking. The diverging example places signed changes on opposite sides of zero. The weekday case keeps a recorded zero visible as a labelled category with no bar length. These details help distinguish direction, absence and naming choices. They also show why a blank cell cannot be replaced with zero simply to complete a chart.',
    },
    {
      title: 'Prepare categories before asking the chart to compare them',
      text: 'Enter a unique category label followed by one to five comparable numeric measures. Repeated categories need an explicit aggregation in the source, and overlapping parts should not be stacked as if they formed a distinct-item total. Use the input and calculated tables to inspect exactly what a bar encodes. A longer bar does not automatically mean better performance, and a higher percentage does not necessarily correspond to a larger absolute count.',
    },
  ],
  pareto: [
    {
      title: 'The measure determines the ranking',
      text: 'The defect and support examples rank report counts. The downtime case ranks minutes, and the cost case ranks monetary amounts. These are different decision measures and can produce different orders for the same underlying events. Each example uses one compatible unit throughout its values column, then sorts categories from largest to smallest and calculates a running share of the positive total.',
    },
    {
      title: 'Test the 80% reference against the actual table',
      text: 'The defect example needs three of five categories to pass 80%, while the support example reaches exactly 80% after its first three. Equal categories need four of five to reach that level. None is required to follow a universal 80/20 pattern. The zero-category case also keeps an explicit zero at the end, where it adds no further percentage and leaves the cumulative line flat.',
    },
    {
      title: 'Turn a ranking into a considered next step',
      text: 'A high bar identifies the largest supplied amount, not the cause of the problem or the best intervention. Compare frequency with severity, cost and feasibility using separately defined evidence. Keep category rules stable across reporting periods and explain whether one incident can contribute to several categories. The original CSV preserves input order, while the chart and calculated table show the descending ranking. That distinction makes the transformation inspectable instead of leaving readers to guess why the order changed.',
    },
  ],
};
