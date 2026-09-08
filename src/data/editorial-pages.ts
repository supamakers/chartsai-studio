export const editorialPages = {
  dumbbell: {
    slug: 'dumbbell-chart-maker',
    name: 'Dumbbell chart maker',
    title: 'Free Dumbbell Chart Maker — Paired Comparisons | ChartsAI',
    description:
      'Make a dumbbell chart from two values per category. Import CSV or Excel, add labels and source notes, and export SVG, PNG, PDF or HTML free.',
    answer:
      'A dumbbell chart shows two values for each category as connected dots on one numeric axis. Use it to compare before and after measurements, two groups, or two reporting periods without stacking a pair of bars for every category.',
    input:
      'Choose one category column and exactly two numeric columns. Name the columns in the order you want readers to compare them: for example, Country, 2000, 2023. The first value uses a circle and the second a diamond, so color is not the only identifier. Up to 30 categories are accepted.',
    methods: [
      [
        'Read the endpoints, then the gap',
        'The horizontal positions encode the original values. The connector spans the interval between them; it is not a third measurement. Subtract the first value from the second to describe signed change. A value moving left is a decrease, even if another category moves right. Nothing is sorted, averaged or combined automatically.',
      ],
      [
        'Choose comparable units',
        'Both columns must measure the same quantity on the same scale. Counts and percentages cannot share a meaningful comparison axis simply because both are numbers. For percentages, subtracting endpoints gives percentage points, not percent change. Relative percent change requires division by the starting value and is undefined when that value is zero.',
      ],
      [
        'When a line chart says more',
        'Two endpoints can conceal a peak, a reversal or a disruption between them. If that intermediate path changes the story, include the full annual series in a line chart or small multiples. A before-and-after difference alone does not demonstrate that an intervention caused the change.',
      ],
      [
        'Keep the comparison readable',
        'Zero is optional because position, rather than bar length, carries the value. The numeric axis remains visible. Turn on direct labels for a small table, and check close or identical endpoints at the size your article will display. For crowded charts, reduce the selected categories explicitly or increase the canvas size; this tool never removes categories to make them fit.',
      ],
    ],
    faqs: [
      [
        'Is this the same as a dot plot?',
        'It is a paired comparison plot. Our distribution dot plot stacks individual observations at their numeric values; it answers a different question. A dumbbell links two measurements belonging to the same category.',
      ],
      [
        'Can I upload a wide spreadsheet?',
        'Yes. Upload CSV, TSV, TXT or Excel and select the category plus the two columns you need. Choose the sheet, row range and number convention before applying. Extra columns are not plotted unless selected.',
      ],
      [
        'Can I show a decrease or a negative number?',
        'Yes. Negative values are supported. Endpoint order is retained, and the numeric axis includes both extremes. The connector has no implied direction beyond the two named series.',
      ],
    ],
  },
  slopegraph: {
    slug: 'slopegraph-maker',
    name: 'Slopegraph maker',
    title: 'Free Slopegraph Maker — Two-Period Charts | ChartsAI',
    description:
      'Create a slopegraph with two values per category. Compare endpoints, label each series, add source notes and download SVG, PNG, PDF or HTML free.',
    answer:
      'A slopegraph connects each category’s value in one period to its value in another. Shared vertical positions show the values; rising and falling segments reveal the direction and size of change between those two endpoints.',
    input:
      'Use a category column followed by exactly two numeric columns, such as Country, 2000, 2023. Both columns must share a unit. This maker accepts up to 12 categories so the names and endpoint values have room beside the chart.',
    methods: [
      [
        'A comparison chart, not an algebra calculator',
        'The slopegraph compares categories between two named conditions or dates. It does not compute the algebraic slope of an arbitrary pair of coordinates. The distance between its two columns is a layout choice. A steeper segment means a larger difference on this chart, not a separately calculated rate per day or year.',
      ],
      [
        'Use one value scale at both ends',
        'Both endpoints use the same vertical scale. A higher position means a higher value in either period. Ranking can change when lines cross, but line crossings do not mark the date at which one series overtook another. The intervening observations are not present. If the exact timing matters, use a full time series.',
      ],
      [
        'What the worked example establishes',
        'The linked World Bank example compares life expectancy estimates in four selected countries in 2000 and 2023. The endpoints show a positive difference in every selected country. They do not establish uninterrupted annual improvement. The companion small-multiple view retains all 24 annual observations to make that distinction inspectable.',
      ],
      [
        'Manage close labels honestly',
        'Direct endpoint names and values are always included. Native label layout moves close labels where possible without changing the plotted coordinates. Check the SVG at its final publication size: tightly packed or identical values can still be difficult to read. A dumbbell plot separates categories into rows and is often clearer for those comparisons. Never alter data values merely to separate labels.',
      ],
    ],
    faqs: [
      [
        'Does the chart calculate percent change?',
        'No. The endpoints retain your supplied values. Subtract second minus first for absolute change; divide that difference by a nonzero first value for relative change. A percentage-based source requires care to distinguish percent from percentage points.',
      ],
      [
        'Can I add more than two periods?',
        'Use the line graph maker for a sequence of three or more ordered periods. This slopegraph intentionally compares two columns and rejects an extra selected value column.',
      ],
      [
        'Is this different from the slope calculator?',
        'Yes. The algebra slope calculator works with coordinates and rise over run. This tool is for categorical comparisons in reports, articles and presentations.',
      ],
    ],
  },
  'small-multiples': {
    slug: 'small-multiples-chart-maker',
    name: 'Small multiples chart maker',
    title: 'Free Small Multiples Chart Maker — Shared Scales | ChartsAI',
    description:
      'Create small multiple line charts with a shared value scale. Import CSV or Excel, compare each series, and export SVG, PNG, PDF or HTML free.',
    answer:
      'Small multiples repeat the same chart for separate series, using a common layout and value scale. Each series gets its own panel, so readers can compare patterns without untangling several overlapping lines.',
    input:
      'Supply one ordered label, numeric position or date column followed by one to five numeric series. Every row needs a value for every selected series. Use 2–300 rows. Each value column becomes one line-chart panel; the row labels and supplied order are shared.',
    methods: [
      [
        'A shared scale makes comparisons meaningful',
        'Every panel uses the same minimum and maximum, computed from all supplied values. A value at the same vertical position therefore means the same amount in every panel. The maker does not independently rescale panels to make weak and strong changes look similar. Include zero when the story requires absolute magnitude, or disclose a narrower scale when emphasizing variation.',
      ],
      [
        'Choose the horizontal spacing deliberately',
        'Equal spacing is suitable for ordered categories. Numeric spacing reflects actual distance, including gaps between reporting years. Date spacing requires real YYYY-MM-DD dates and preserves elapsed days. Numeric and date positions must increase strictly; unsorted or repeated positions are flagged instead of being silently sorted or combined.',
      ],
      [
        'Keep units and definitions consistent',
        'A shared axis is useful only when the measures can be compared. Do not place revenue in dollars beside a conversion rate in percent and interpret the heights as equivalent. Standardization or indexing can answer a different question, but must be calculated and explained explicitly before import. This maker does not normalize your input.',
      ],
      [
        'Inspect the shape and the levels',
        'Read each panel’s direction, turning points and range, then compare its level with the others. The World Bank worked example uses the same axis for four countries across 2000–2023. That preserves differences in estimated life expectancy while showing changes within each country. These countries were selected for illustration; the panels are not a representative world sample.',
      ],
    ],
    faqs: [
      [
        'Are small multiples also called trellis or panel charts?',
        'Yes. Those terms describe a related repeated-chart arrangement. Here the repeated design is specifically a line chart with shared scales, one numeric series per panel.',
      ],
      [
        'Can I use a separate axis range for each panel?',
        'This maker deliberately uses one shared range. Independent ranges can be useful for other questions but would make absolute heights incomparable. Use separate charts with explicit scales if that is what your analysis requires.',
      ],
      [
        'What happens to missing values?',
        'The complete selected table is validated before it replaces the chart. Missing values are not filled with zero or connected across. Correct the data or explicitly select a complete comparable range; the importer does not delete incomplete observations for you.',
      ],
    ],
  },
} as const;
