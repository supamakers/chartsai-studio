import type { StatKind } from '../lib/statistics';
export const statMethods: Record<StatKind, { title: string; text: string }[]> = {
  histogram: [
    {
      title: 'Choose the grouping deliberately',
      text: 'A histogram counts individual observations inside numeric intervals. Use the bin-count control for an initial equal-width partition, or enter a start and width for boundaries you can explain. Entering a width overrides the count. The chart supports at most 50 bins; it asks you to increase width when the requested range would exceed that limit.',
    },
    {
      title: 'Know which bin contains a boundary',
      text: 'Intervals include their lower boundary and exclude their upper boundary. The final interval includes both ends so the maximum observation is retained. With boundaries 0, 5, 10 and 15, an observation of 5 belongs in the 5–10 interval, and 15 belongs in the last interval. Inspect the calculated table to verify counts.',
    },
    {
      title: 'Counts, percentages and density differ',
      text: 'Count mode shows the number of observations in each bin. Percentage mode divides every bin count by the total observation count and multiplies by 100. It is relative frequency, not probability density. Because every interval has the same width, equal horizontal widths accurately represent equal numeric spans.',
    },
    {
      title: 'Read a summary without losing the source',
      text: 'All observations remain in the downloadable input CSV, including repeated values, negative numbers and genuine zeros. A histogram can hide small groups or gaps when bins are wide. Try another justified width before describing a shape, and use the dot plot maker when a small sample needs every value visibly separated.',
    },
  ],
  box: [
    {
      title: 'Choose a quartile convention',
      text: 'The default uses linear interpolation at rank (n − 1)p in the sorted sample, equivalent to R quantile type 7. At p = 0.25, 0.5 and 0.75 this gives Q1, the median and Q3. The alternate method takes medians of the lower and upper halves, excluding the middle observation when the sample size is odd. These methods can give different results for the same small sample.',
    },
    {
      title: 'Fences and whiskers are different',
      text: 'The IQR is Q3 minus Q1. With the 1.5 × IQR rule, the lower fence is Q1 − 1.5 × IQR and the upper fence is Q3 + 1.5 × IQR. Whiskers stop at the most extreme observed values within those fences. They are not usually located exactly on the fence. Observations beyond the fences appear as separate points and stay in the input data.',
    },
    {
      title: 'Compare groups with their sample sizes',
      text: 'Use long-format data: a group name followed by one observation on each row. Repeat the group name for its other observations. This handles unequal group sizes without inventing blank values. The summary table includes each group’s N, full minimum and maximum, quartiles, IQR, whiskers and number of flagged observations.',
    },
    {
      title: 'Understand the limits of the picture',
      text: 'The standard box spans the middle half of the data. Its width does not encode sample size, and the tool does not add notches, confidence intervals or a significance test. Minimum-to-maximum whiskers are available as an explicit alternative. Selecting them changes the displayed summary; it does not remove or correct unusual values.',
    },
  ],
  scatter: [
    {
      title: 'Keep the pairing intact',
      text: 'Every row supplies one X and one Y measurement for the same observation. The chart does not sort, merge or connect the points. Repeated X values are allowed and repeated pairs remain in the data, although exact overlaps can appear as one mark. Use consistent units and keep subject matching intact before importing.',
    },
    {
      title: 'Read Pearson correlation carefully',
      text: 'Pearson r measures linear association by dividing the centred cross-product sum by the square root of the two centred sums of squares. A value near zero can coexist with a strong curved pattern. Correlation is undefined when either variable is constant, which the calculated table reports instead of returning a misleading zero.',
    },
    {
      title: 'Understand the fitted line',
      text: 'The optional line is ordinary least squares with an intercept: slope is the centred cross-product sum divided by the X sum of squares, and intercept is mean Y minus slope times mean X. The line minimizes squared vertical residuals. It is drawn only over the observed X range; the tool does not provide prediction intervals or imply reliable extrapolation.',
    },
    {
      title: 'Check the observations before the summary',
      text: 'Inspect the pattern, unusual points and sample size together. The reported R squared is r squared for this simple regression with an intercept when both variables vary. Constant X prevents a fitted slope. A scatter plot and a regression calculation alone cannot establish causation, remove confounding or justify a population claim.',
    },
  ],
  bar: [
    {
      title: 'Give categories a common baseline',
      text: 'Bars compare magnitudes through length. A numeric axis that includes zero makes those lengths interpretable. Negative values extend in the opposite direction. Category labels are kept in the supplied order, so a chronological or meaningful custom order survives import. Use a Pareto chart if you intentionally want a descending ranking and cumulative share.',
    },
    {
      title: 'Grouped and stacked answer different questions',
      text: 'Grouped bars place series side by side for direct within-category comparisons. Stacked bars accumulate parts to show their combined size. Interior stacked segments do not share a baseline, so small differences between those segments can be harder to judge. With signed stacks, positive and negative contributions accumulate on opposite sides of zero.',
    },
    {
      title: 'Normalize only when the question is about shares',
      text: '100% stacked mode divides each value by its category total, making every full bar the same height or length. All values must be nonnegative and every category must have a positive total. This transformation is explicit, and the calculated table shows the percentages. The input CSV retains the original counts or amounts.',
    },
    {
      title: 'Make labels and units readable',
      text: 'Horizontal bars give longer category names more space. Keep series units comparable: a dollar value and a headcount should not be stacked together. The tool accepts up to 50 distinct categories and five series, but fewer categories usually produce a more readable export. Duplicate category names are rejected so aggregation remains a deliberate source-data decision.',
    },
  ],
  pareto: [
    {
      title: 'Choose a measure before ranking',
      text: 'Enter one nonnegative value for each unique category. That value may be an incident count, a cost or a duration, provided the unit is consistent across rows. A category that leads by count may not lead by cost. Choose the measure that answers the decision question and make its unit visible on the left axis.',
    },
    {
      title: 'Follow the cumulative calculation',
      text: 'The tool orders categories from the largest supplied value to the smallest, retaining input order for ties. It then adds values from left to right and divides each running total by the overall total. Bars use the original measure; the line uses the right-hand percentage axis and finishes at 100%.',
    },
    {
      title: 'Use the 80% reference as a reading aid',
      text: 'The horizontal reference helps find the first category at which the cumulative share reaches or exceeds 80%. It does not force an 80/20 relationship. Equal contributions, dispersed problems or a dominant category can produce very different curves. Read the actual proportions from the table instead of assuming the first fifth of categories explains four fifths of the total.',
    },
    {
      title: 'Preserve context and small categories',
      text: 'Zero-value categories remain visible at the end and add nothing to the cumulative line. A dataset with a zero total cannot produce meaningful cumulative percentages and is rejected. Rankings do not identify root causes, severity or feasible fixes. Keep collection period, classification rules and any aggregation process alongside the exported chart.',
    },
  ],
};
export const statReferences: Record<StatKind, { name: string; url: string }[]> = {
  histogram: [
    {
      name: 'NIST: histogram definitions and uses',
      url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/histogra.htm',
    },
  ],
  box: [
    {
      name: 'NIST: box plot and fence interpretation',
      url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/boxplot.htm',
    },
    {
      name: 'R documentation: quantile methods',
      url: 'https://stat.ethz.ch/R-manual/R-devel/library/stats/html/quantile.html',
    },
  ],
  scatter: [
    {
      name: 'NIST: scatter plot interpretation',
      url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/scatterp.htm',
    },
  ],
  bar: [
    {
      name: 'ONS: axes and gridlines',
      url: 'https://service-manual.ons.gov.uk/data-visualisation/guidance/axes-and-gridlines',
    },
  ],
  pareto: [{ name: 'ASQ: Pareto chart procedure', url: 'https://asq.org/quality-resources/pareto' }],
};
