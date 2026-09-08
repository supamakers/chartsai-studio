export const tools = [
  {
    slug: 'dot-plot-maker',
    name: 'Dot plot maker',
    short: 'Every observation, in the picture.',
    tag: 'DISTRIBUTIONS',
    type: 'dot',
    description:
      'Create a free dot plot from pasted numbers, CSV or Excel. Edit labels and colors, see a frequency table, and download PNG, SVG or PDF. No signup or watermark.',
    intro:
      'Turn a list of numbers into a clear picture. Paste your values, make it yours, and take a finished chart with you.',
    definition:
      'A frequency dot plot places one dot above a number line for each observation. Repeated values stack vertically, so you can see which values occur most often while keeping every observation visible.',
    use: 'Use a dot plot for a small numeric dataset: class scores, counts, waiting times or measurements. Unlike a histogram, it does not group your values into bins. This tool makes frequency dot plots, rather than Cleveland dot plots for comparing categories.',
    steps: [
      {
        title: 'Bring a few numbers',
        text: 'Type a list, paste spreadsheet cells, or import CSV or Excel. Choose your numeric column in the preview.',
      },
      {
        title: 'Give them context',
        text: 'Add a title and axis label, choose a color, and optionally show the mean. Check the frequency table for exact values.',
      },
      {
        title: 'Take your chart with you',
        text: 'Download a high-resolution PNG for slides or an editable SVG for design tools. The data is also available as CSV.',
      },
    ],
    faqs: [
      {
        q: 'Is this dot plot maker free?',
        a: 'Yes. Create and download dot plots without an account, payment, or watermark. PNG, SVG, PDF and CSV downloads are included.',
      },
      {
        q: 'What data can I paste or upload?',
        a: 'Paste a list of numbers or cells copied from Excel or Google Sheets. You can also import CSV, TSV, TXT or XLSX files, select a sheet, and choose the column to plot. The chart supports up to 300 observations.',
      },
      {
        q: 'Does my data leave my browser?',
        a: 'No. File reading, chart calculations and downloads happen on your device. There is no cloud saving; refreshing the page resets your edits. Download the CSV if you want to reuse the values later.',
      },
      {
        q: 'What happens to missing values?',
        a: 'An empty or invalid value in your selected data is flagged for correction. It is not replaced with zero. Outliers and duplicate values are retained; duplicates form stacks.',
      },
      {
        q: 'How are the mean and median calculated?',
        a: 'The mean is the sum of the observations divided by their count. The median is the middle sorted observation; for an even count it is the average of the two middle observations. The range is the maximum minus the minimum.',
      },
      {
        q: 'When should I use a different chart?',
        a: 'A dense set of measurements may be easier to read as a histogram. To compare two numeric variables, use a scatter plot. For category totals, a bar chart is usually more suitable. This tool preserves values rather than rounding them into groups.',
      },
    ],
  },
  {
    slug: 'radar-chart-maker',
    name: 'Radar chart maker',
    short: 'Different strengths. A shared view.',
    tag: 'COMPARISONS',
    type: 'radar',
    description:
      'Make a free radar or spider chart with multiple series. Paste data or import Excel, edit dimensions and scales, then download PNG, SVG or PDF. No signup.',
    intro:
      'Compare a few things across the qualities that matter. Start with an example, add your scores, and see the whole profile.',
    definition:
      'A radar chart, also called a spider chart, places several quantitative dimensions on axes around a common center. Each series connects its scores into a polygon, making it possible to compare profiles across matching dimensions.',
    use: 'Use a radar chart when the dimensions have comparable scales and a consistent direction. For example, five ratings from zero to ten can share a chart. Raw prices, percentages and delivery days should not share a scale without a clearly explained transformation.',
    steps: [
      {
        title: 'Choose what to compare',
        text: 'Start with team skills, product ratings or a weekly reflection. Replace the sample names, dimensions and scores.',
      },
      {
        title: 'Make the scale explicit',
        text: 'Choose a shared maximum and check that all scores fit. The editor flags missing, negative or out-of-range values.',
      },
      {
        title: 'Export your comparison',
        text: 'Download PNG for a presentation or SVG to keep editing. Save the CSV to reuse the names and scores.',
      },
    ],
    faqs: [
      {
        q: 'Are radar charts and spider charts the same?',
        a: 'Yes. Radar chart, spider chart and web chart commonly describe the same multi-axis visualization. You can create all of them with this editor.',
      },
      {
        q: 'Can I compare multiple people or products?',
        a: 'Yes. Use one to five series, each with scores for the same three to ten dimensions. Every series uses the same axis order and shared zero-to-maximum scale.',
      },
      {
        q: 'Can I import my own spreadsheet?',
        a: 'Yes. Import CSV or Excel, select the column naming your dimensions, then choose your score columns. You can swap rows and columns in the preview. Use consistent units and check the scale after importing.',
      },
      {
        q: 'Does a bigger shape mean a better result?',
        a: 'Not necessarily. The shape and enclosed area depend on the ordering of the axes as well as the scores. Compare values on matching axes; do not treat the polygon area as an overall rating.',
      },
      {
        q: 'Can I use a different maximum for each axis?',
        a: 'This version uses one shared maximum. If your dimensions have different units, transform them to a common scale yourself and label the method clearly, or choose another chart. The tool does not normalize values silently.',
      },
      {
        q: 'Are downloads free and private?',
        a: 'Yes. PNG, SVG, PDF and CSV downloads have no account requirement or watermark. Your entered values and imported files are processed in the browser and are not sent to a server.',
      },
    ],
  },
  {
    slug: 'line-graph-maker',
    name: 'Line graph maker',
    short: 'See the change. Keep the context.',
    tag: 'TRENDS',
    type: 'line',
    description:
      'Create a free line graph with multiple lines from pasted data, CSV or Excel. Choose numeric or date spacing, style your chart, and download PNG, SVG or PDF.',
    intro:
      'Turn ordered observations into a clear story. Compare multiple lines, keep the intervals honest, and download a chart ready to use.',
    definition:
      'A line graph connects successive observations with straight segments. The horizontal axis shows an ordered variable, such as time, and the vertical axis shows a numeric value. Multiple lines compare series using the same horizontal positions and units.',
    use: 'Use a line graph to show change over time or another ordered variable. Use equal spacing for category labels, numeric spacing for measured intervals, or date spacing for elapsed days. For unrelated categories, a bar chart is usually easier to interpret.',
    steps: [
      {
        title: 'Bring your observations',
        text: 'Paste spreadsheet cells or import CSV, TSV, TXT or XLSX. Choose the label column and one to five numeric series in the preview.',
      },
      {
        title: 'Check order and spacing',
        text: 'Keep the row order you intend. Choose numeric distance or YYYY-MM-DD dates for irregular intervals; equally spaced labels do not represent elapsed time.',
      },
      {
        title: 'Label, style and download',
        text: 'Add a title, axis units and source note. Choose a visual theme, then download PNG, SVG or PDF. Save your input table as CSV.',
      },
    ],
    faqs: [
      {
        q: 'Is this line graph maker free?',
        a: 'Yes. Create and download line charts without an account, payment or watermark. PNG, SVG, PDF, CSV and ECharts configuration downloads are included.',
      },
      {
        q: 'Can I create a graph with multiple lines?',
        a: 'Yes. Plot one to five named series across two to 300 points. Every line shares the horizontal positions and vertical scale. Use the same units so the comparison makes sense.',
      },
      {
        q: 'What data format do I need?',
        a: 'Use one column for horizontal labels and one or more numeric columns for values. You can paste cells, select a sheet from Excel, choose a row range, transpose the table and map columns before importing. Files stay on your device.',
      },
      {
        q: 'How do I handle dates and irregular intervals?',
        a: 'After importing, choose Elapsed days and enter valid YYYY-MM-DD dates, or choose Numeric distance for measured positions. These modes preserve interval sizes and require strictly increasing positions. Equal spacing instead treats each row as the next equally spaced label.',
      },
      {
        q: 'Does the tool fill missing values or sort my data?',
        a: 'No. Missing or invalid values block the chart until corrected. Rows are never silently dropped, sorted, aggregated or interpolated. Numeric and date positions cannot repeat; resolve duplicate positions in your source or use equally spaced labels deliberately.',
      },
      {
        q: 'Can I show negative values or change the vertical scale?',
        a: 'Yes. Negative values and zero are retained. The vertical axis includes zero by default. In Design & details you can turn that off to fit the range more closely; the preview explains that the scale may no longer include zero.',
      },
      {
        q: 'Are line graphs and line charts the same?',
        a: 'The terms are commonly used for the same visualization. This tool uses straight segments between observations. It does not calculate a regression, forecast or smoothed trend.',
      },
    ],
  },
] as const;
