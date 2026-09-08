import { showcaseSpecs, showcaseGroups, type ShowcaseSlug } from '../lib/showcase-specs';

type Story = {
  title: string;
  answer: string;
  reading: string[];
  method: string[];
  caution: string;
  question: string;
  response: string;
};
const stories: Record<ShowcaseSlug, Story> = {
  'monthly-sales-line-chart': {
    title: 'Monthly sales line chart example',
    answer:
      'A monthly sales line chart connects sales totals in calendar order. This editable example shows six fictional monthly totals in US dollars, including a March dip and a stronger second quarter.',
    reading: [
      'January starts at $4,200 and June ends at $7,200: a rise of $3,000, or about 71.4% relative to January. The line does not rise every month. March falls $300 from February before April increases by $1,600.',
      'The six monthly totals add to $33,500. That total describes this six-month period; the June point alone describes June. Joining the points helps readers follow the sequence without confusing a monthly amount with a cumulative total.',
    ],
    method: [
      'Use one row per month and one numeric column per sales series. Keep months in calendar order, identify the currency, and use the same definition of sales throughout: orders booked, invoices issued and cash received are different measures.',
      'This chart uses equally spaced category labels because each point represents a consecutive month. The vertical axis includes zero. Replace the six figures with your totals, then update the title, currency and source before exporting a report.',
    ],
    caution:
      'These invented figures are not a business benchmark or a seasonal forecast. Six points cannot establish that a pattern repeats annually. Discounts, refunds and tax treatment must be handled consistently in your own source data.',
    question: 'Should missing sales months be entered as zero?',
    response:
      'Only enter zero if sales were actually zero. A missing record is unknown, not zero. Resolve the missing month in your source data before making a continuous monthly comparison; the editor does not infer missing totals.',
  },
  'multiple-line-graph': {
    title: 'Multiple line graph example with three series',
    answer:
      'A multiple line graph compares two or more series on the same ordered axis. This example follows online, in-store and wholesale orders over five weeks, using one shared unit and a separate line for each channel.',
    reading: [
      'Online orders rise from 40 to 100, while in-store orders move from 65 to 68 and wholesale orders rise from 25 to 45. Online first exceeds in-store at Week 3, where the plotted totals are 70 and 60.',
      'The online increase is 60 orders. Wholesale grows by 20 orders, even though its proportional increase is also substantial. Comparing the slopes answers an absolute-change question; comparing percentage growth requires a separate calculation with each channel’s own starting value.',
    ],
    method: [
      'Arrange a table with Week as its first column and one column for each channel. Every row must describe the same reporting window across all three channels. Keep the series names short enough to read in the legend.',
      'All lines share the completed-orders axis. This avoids mixing counts with revenue or conversion percentages. Use the legend and markers to identify series, then read their values at the same week. The wide export gives the three lines and legend more space.',
    ],
    caution:
      'The straight segment between Week 2 and Week 3 does not reveal the exact day when online orders overtook in-store orders. These are weekly totals, not continuously observed cumulative counts. The channel names and numbers are fictional.',
    question: 'Can I compare revenue and orders on these lines?',
    response:
      'Use a common measure for the lines on this chart. Revenue and order counts have different units. Create separate charts, or explicitly calculate a common indexed measure in your source table and label it accurately; this example has no secondary axis.',
  },
  'line-graph-negative-values': {
    title: 'Line graph with negative values: temperature example',
    answer:
      'A line graph can show positive, zero and negative observations on the same numeric axis. This fictional week of temperature readings crosses 0°C several times, making the sign of each value meaningful.',
    reading: [
      'Monday is −4°C and Thursday is 3°C, a difference of 7°C. Friday is exactly 0°C. Saturday falls below freezing again at −1°C before Sunday reaches 2°C. A zero observation belongs in the data just like any other measured value.',
      'The observed range is 7°C, from the lowest reading of −4°C to the highest of 3°C. There are three negative readings, three positive readings and one zero. The connecting line makes the sequence visible while the markers identify actual observations.',
    ],
    method: [
      'Enter signed numbers in the temperature column, including a normal minus sign for readings below zero. Use one consistent unit. Celsius and Fahrenheit readings cannot be mixed in the same column without converting them first.',
      'Days use a category axis in their original order. The vertical scale spans both sides of zero, and the chart preserves negative values instead of clipping or replacing them. Update the time-of-day convention in your subtitle if these are daily morning readings rather than daily averages.',
    ],
    caution:
      'The line crossing zero between two days is an interpolation, not a recorded freezing time. These seven points cannot describe the highest or lowest temperature within each day. Percentage changes across Celsius zero would also be misleading because Celsius has an arbitrary reference zero.',
    question: 'Does the zero-baseline option erase negative values?',
    response:
      'No. Including zero in the axis range does not turn negative values into zero or remove them. The chart must still show the full observed range. Keep the source values signed and check the data table when interpreting a crossing.',
  },
  'uneven-time-intervals': {
    title: 'Line graph with uneven time intervals',
    answer:
      'Use a time axis when observations occur on irregular dates. This plant-height example spaces four visits by their actual dates, preserving gaps of one, six and seven days instead of making every visit look equally far apart.',
    reading: [
      'The first two readings are 10 cm on April 1 and 11 cm on April 2. The next reading is 15 cm on April 8, followed by 19 cm on April 15. The last two increases are both 4 cm, but they occur over different durations.',
      'The average increase between the first two visits is 1 cm per day. Between April 2 and April 8 it is about 0.67 cm per day; between April 8 and April 15 it is about 0.57 cm per day. Actual time spacing makes those different average rates visible in the slopes.',
    ],
    method: [
      'Use unambiguous ISO dates such as 2026-04-08 in the first column and measured heights in the second. Choose the editor’s date/time axis mode. Keep observations in chronological order; the line connects the rows you provide.',
      'The supplied table deliberately omits days without observations. It does not insert estimated daily measurements. You can change the dates and heights, but retain real intervals if the purpose is to compare rates rather than simply list visits. Keep the unit and measurement procedure consistent.',
    ],
    caution:
      'A straight line between visits assumes a linear visual connection, not proof of constant biological growth. The plant and measurements are invented. There are no observations of what happened between visits, and the chart does not fit a growth model.',
    question: 'Why not label the points Visit 1, Visit 2, Visit 3 and Visit 4?',
    response:
      'That is useful for comparing visits as categories, but equal spacing hides elapsed time. When the question involves change per day, use dates on a time axis so a one-day interval and a seven-day interval occupy different widths.',
  },
  'distance-time-graph': {
    title: 'Distance–time graph example with a stop',
    answer:
      'A distance–time graph plots cumulative distance travelled against elapsed time. In this worked example, a walker covers 300 metres in five minutes, pauses for two minutes, then reaches 480 metres at ten minutes.',
    reading: [
      'From 0 to 5 minutes, the rise is 300 metres over 5 minutes, so the average speed is 60 metres per minute. Between minutes 5 and 7 the distance remains 300 metres: the horizontal segment represents the pause.',
      'From minute 7 to minute 10, distance increases by 180 metres over 3 minutes, again 60 metres per minute. Across the whole journey, including the pause, average speed is 480 ÷ 10 = 48 metres per minute. Reading only the moving segments would miss the effect of stopped time.',
    ],
    method: [
      'Enter elapsed minutes as numeric x values and cumulative metres as y values. Numeric spacing matters here: the intervals are 2, 3, 2 and 3 minutes. Category spacing would make unequal durations appear equal and distort the slopes.',
      'Read a segment’s average speed as change in distance divided by change in time. Keep units attached to the answer. The example’s straight moving segments define a simple constant-speed model for each interval; the markers are the supplied observations.',
    ],
    caution:
      'Cumulative distance travelled cannot decrease. A graph that falls may instead represent position or distance from a starting point, where direction matters. This imagined journey is a teaching model and does not establish how a real walker accelerated between observations.',
    question: 'Does a flat distance–time line mean constant speed?',
    response:
      'It means zero speed over that interval in this cumulative-distance model: time passes without additional distance. A straight rising line represents a constant positive speed in the model. A steeper rising line represents a larger distance change per unit time.',
  },
  'speed-time-graph': {
    title: 'Speed–time graph example with distance calculation',
    answer:
      'A speed–time graph shows how speed changes over time. This example accelerates from 0 to 8 m/s in four seconds, stays at 8 m/s for six seconds, and returns to rest at fourteen seconds.',
    reading: [
      'The initial straight segment rises by 8 m/s in 4 seconds, giving an acceleration magnitude of 2 m/s². The flat middle segment represents constant speed, not a stop. The final straight segment decreases speed by 8 m/s in 4 seconds.',
      'Distance is the area under this nonnegative speed curve. The first triangle contributes ½ × 4 × 8 = 16 metres; the rectangle contributes 6 × 8 = 48 metres; the last triangle contributes another 16 metres. Total distance is 80 metres and average speed is 80 ÷ 14, about 5.71 m/s.',
    ],
    method: [
      'Choose a numeric horizontal axis with elapsed seconds. Enter the four corner points in increasing time order. The straight connections are part of this piecewise-linear model, so the triangular and rectangular areas have an explicit interpretation.',
      'For your own data, use more observations when the motion changes within an interval. Keep seconds and metres per second consistent or convert units before calculating area. Editing the chart changes the displayed values; the explanatory calculation on this example page remains tied to the original four points.',
    ],
    caution:
      'Speed is nonnegative. A velocity–time graph can have negative values and its signed area describes displacement; that is a different quantity. This page does not calculate arbitrary areas automatically or infer acceleration from unobserved motion.',
    question: 'Why is the horizontal middle segment not a pause?',
    response:
      'Its height is 8 m/s, so the object keeps moving at that speed. A pause on a speed–time graph lies at zero speed. On a distance–time graph, a pause is instead a horizontal segment at the distance already travelled.',
  },
  'cumulative-frequency-graph': {
    title: 'Cumulative frequency graph example with grouped data',
    answer:
      'A cumulative frequency graph shows how many observations fall below successive boundaries. This example accumulates 30 fictional journey times in ten-minute bands, starting at zero and ending at the full sample count.',
    reading: [
      'The underlying band frequencies are 4, 8, 10, 6 and 2 for 0–under 10, 10–under 20, 20–under 30, 30–under 40 and 40–under 50 minutes. Adding them successively gives 4, 12, 22, 28 and 30.',
      'At the 30-minute boundary, the cumulative count is 22: twenty-two journeys are shorter than 30 minutes under this boundary convention. The middle cumulative position is 15. Linear interpolation within the 20–30 minute band gives 20 + ((15 − 12) ÷ 10) × 10 = 23 minutes as a grouped median estimate.',
    ],
    method: [
      'Use upper class boundaries as numeric x values and cumulative counts as y values. Include the lower starting boundary with zero. Plot counts that never decrease and check that the final count equals the total number of observations.',
      'This editor draws the values supplied in your table; it does not turn raw journey times into grouped frequencies. Calculate the bands and running totals first. Keep a consistent convention for observations exactly on a boundary, and state that convention alongside the chart.',
    ],
    caution:
      'The joining segments are a grouped-data approximation. They do not reveal exact individual times, and the estimated median is not an exact median calculated from raw observations. There is no evidence here that journeys are uniformly distributed within each band.',
    question: 'Is this an empirical cumulative distribution function?',
    response:
      'This example is a grouped cumulative-frequency polygon, often taught as an ogive. An exact empirical cumulative distribution from raw observations is a step function. The straight segments here support approximate readings between class boundaries and should be described as estimates.',
  },
  'break-even-chart': {
    title: 'Break-even chart example: revenue and total cost',
    answer:
      'A break-even chart compares revenue with total cost at different sales volumes. This fictional example uses a $20 selling price, an $8 variable cost per unit and $1,200 in fixed costs, reaching break-even at 100 units.',
    reading: [
      'Revenue is 20 × units sold. Total cost is 1,200 + 8 × units sold. At 100 units, both are $2,000, so the model’s profit is zero. The fixed-cost line remains at $1,200 throughout the illustrated volume range.',
      'At 50 units, revenue is $1,000 and total cost is $1,600: a $600 loss in this model. At 200 units, revenue is $4,000 and total cost is $2,800: a $1,200 profit. The vertical gap between the revenue and total-cost lines gives that difference.',
    ],
    method: [
      'Calculate the table before plotting. The per-unit contribution is $20 − $8 = $12, and fixed cost divided by contribution gives 1,200 ÷ 12 = 100 units. Each row then evaluates the same revenue and cost formulas at its stated volume.',
      'Use a numeric units-sold axis so spacing corresponds to sales volume. Keep all amounts in the same currency and period. The downloaded CSV contains the resulting numbers, not spreadsheet formulas; changing a price in the subtitle will not recalculate the lines.',
    ],
    caution:
      'This simplified illustration assumes constant unit price and variable cost, fixed costs within the shown range, and sales of every counted unit. It excludes taxes, inventory timing and capacity changes. It is a worked chart example, not a financial forecast or an interactive break-even calculator.',
    question: 'What if the variable cost is equal to or above the selling price?',
    response:
      'Then contribution per unit is zero or negative. With positive fixed costs, this simple model has no positive-volume break-even point. Do not apply the example’s 100-unit result to another cost structure; rebuild the table using its actual assumptions.',
  },
  'class-score-dot-plot': {
    title: 'Dot plot example with class quiz scores',
    answer:
      'A stacked dot plot places one dot for each observation above its numeric value. This example shows all 16 fictional quiz scores on a ten-point scale, so repeated scores are visible as taller stacks.',
    reading: [
      'Four students have a score of 7, making 7 the most frequent score. Three students score 6 and three score 8. The single dots at 4 and 10 are the lowest and highest observations; the observed range is 10 − 4 = 6 points.',
      'The ordered middle observations, in positions 8 and 9, are both 7, so the median is 7. Seven of the sixteen scores are 8 or higher. Counting dots gives the sample size directly without needing to estimate the height of a bar or combine histogram intervals.',
    ],
    method: [
      'Enter the individual scores, keeping repetitions. Four observations of 7 require four entries of 7, not a row containing the value 7 and the count 4. The chart stacks exact repeats automatically and preserves every observation.',
      'The horizontal coordinate represents the score; vertical stacking represents frequency. The vertical position of one dot does not indicate a second student attribute. The mean reference is disabled in this example to keep the first reading focused on counts, modes and the median.',
    ],
    caution:
      'The class and quiz are fictional, and the scores do not show educational progress or explain why any student received a result. A different marking scale would require new labels. Avoid including student names when sharing a class distribution.',
    question: 'Is this the same as a dot chart comparing categories?',
    response:
      'No. This is a stacked frequency dot plot of individual numeric observations. A category dot chart places a summarized value beside each named category. Here the repeated dots at one score count observations; they do not represent separate labelled categories.',
  },
  'dot-plot-mean-median': {
    title: 'Dot plot mean and median: a worked example',
    answer:
      'A dot plot can show the observations behind the mean and median. In this eight-person fictional reading example, the values are 0, 1, 1, 2, 2, 2, 3 and 5 books: both the mean and median are 2.',
    reading: [
      'The sum is 16 books across 8 observations, so the mean is 16 ÷ 8 = 2. The middle positions in the sorted list are the fourth and fifth observations; both are 2, so their average and the median are also 2.',
      'The mode is 2 because three dots are stacked there, more than at any other value. The person with zero books still counts as an observation. The shared mean, median and mode in this small dataset do not mean every person read two books.',
    ],
    method: [
      'Provide one value per person or observation, including real zeros and repeated values. The vertical dashed reference marks the arithmetic mean. Read the median from the ordered observations; the dashed line is not a separate median marker.',
      'To compare sensitivity, imagine removing the value 5: the remaining total is 11 across 7 observations, and the mean becomes about 1.57 while the median remains 2. That is a teaching comparison, not a reason to delete a legitimate observation from a real dataset.',
    ],
    caution:
      'These are invented whole-number counts over an unspecified example period. They are not reading targets or population estimates. The mean describes a balance point, not necessarily a value observed in other datasets; a median can also fall between two observed values.',
    question: 'Why can the mean and median match when the dots are not perfectly symmetric?',
    response:
      'They measure different properties. This particular sum produces a mean of 2 and the two middle values also produce 2. Their equality alone does not prove symmetry, normality or any distributional model, especially with only eight observations.',
  },
  'dot-plot-with-outlier': {
    title: 'Dot plot with an outlier: waiting-time example',
    answer:
      'A dot plot keeps an unusually large observation visible beside the rest of a dataset. Here nine fictional waits lie between 2 and 6 minutes, while one wait lasts 24 minutes. All ten observations remain in the chart.',
    reading: [
      'The full set totals 60 minutes across 10 observations, giving a mean of 6 minutes. The fifth and sixth sorted values are both 4, so the median is 4 minutes. The long right-hand gap makes the 24-minute wait easy to notice.',
      'For comparison only, the nine waits excluding 24 total 36 minutes and have a mean of 4. That two-minute difference illustrates the mean’s sensitivity to a large observation. It does not establish that the longest wait was an error or should be removed.',
    ],
    method: [
      'Enter every observed wait as its own numeric value. Exact repeats stack vertically. Keep a continuous numeric horizontal axis so the large gap between 6 and 24 minutes is represented honestly rather than visually compressed into adjacent categories.',
      'Investigate the unusual record in the original source if this pattern appears in your data. Check its unit, collection conditions and transcription. If a correction is justified, document the reason and preserve an audit trail instead of silently dropping the inconvenient point.',
    ],
    caution:
      'The 24-minute value is visually unusual in this constructed example. The tool does not run an outlier test or classify data errors. Small samples can produce unstable summaries, and a single unusual observation may represent an important real experience.',
    question: 'Does the dot plot automatically remove outliers?',
    response:
      'No. The editor plots the valid numeric observations you supply and calculates summaries from them. The dashed mean line includes the 24-minute value here. Any exclusion must be your explicit, justified data decision, not an automatic chart-cleaning step.',
  },
  'dot-plot-fractions': {
    title: 'Dot plot with fractions: quarter-inch measurements',
    answer:
      'This fraction dot plot represents quarter-inch ribbon lengths using exact decimal equivalents. Each dot is one ribbon, with repeated lengths stacked together. The axis displays decimals such as 0.75 and 1.25 rather than typeset fractions.',
    reading: [
      'The ten lengths are 0.5, 0.75, 0.75, 1, 1, 1, 1.25, 1.25, 1.5 and 1.75 inches. Three ribbons are exactly one inch long. Four ribbons measure at least 1.25 inches: two at 1.25, one at 1.5 and one at 1.75.',
      'The total length is 10.75 inches, or 10¾ inches. The middle two observations are both 1 inch, so the median length is 1 inch. The difference between the longest and shortest ribbons is 1.75 − 0.5 = 1.25 inches.',
    ],
    method: [
      'Convert these quarter fractions before entering numeric data: ½ = 0.5, ¾ = 0.75, 1¼ = 1.25, 1½ = 1.5 and 1¾ = 1.75. These particular fractions have exact finite decimal equivalents, so the conversion does not round their values.',
      'Use one row for each physical ribbon, including duplicates. Keep inches as the unit throughout. For a classroom activity, download the chart alongside the data and ask readers to translate axis decimals back into fractions before comparing or adding lengths.',
    ],
    caution:
      'This example supports fraction reasoning through decimal coordinates. It does not provide a fraction-entry parser or a custom fraction-labelled axis. Repeating fractions such as one third require an explicit precision decision and do not behave like the quarter fractions used here.',
    question: 'Can I type 1/4 directly as a numeric observation?',
    response:
      'Use 0.25 for one quarter in this editor. A slash fraction is not the same input as a decimal number. Convert deliberately, preserve the measurement unit, and inspect the import preview before using the resulting plot.',
  },
  'skewed-dot-plot': {
    title: 'Right-skewed dot plot example',
    answer:
      'A right-skewed dot plot has a longer tail toward larger values. This fictional collection of fifteen call lengths concentrates around two to four minutes, with a few longer calls extending the right side to twelve minutes.',
    reading: [
      'The sorted values are 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 5, 6, 8, 10 and 12. The eighth observation is 3, making the median 3 minutes. The total is 68 minutes, so the mean is 68 ÷ 15, approximately 4.53 minutes.',
      'The mean lies to the right of the median in this example because the longer calls pull the arithmetic average upward. Four calls last exactly 3 minutes, the most frequent value. The tail direction refers to where the distribution stretches, not where the tallest stack sits.',
    ],
    method: [
      'Plot individual durations using a shared numeric unit and include the longer calls. One dot represents one call; a stack of four at 3 minutes means four separate three-minute observations. The dashed line shows the mean calculated from all fifteen values.',
      'Describe the shape together with sample size and a relevant summary. A median answers a different question from total workload: the median here is 3 minutes, but staffing time for all these calls depends on the full 68-minute total. Choose the summary that matches the decision.',
    ],
    caution:
      'This is an illustrative shape, not a fitted probability distribution or evidence about a real call centre. A small sample’s appearance can change substantially when more observations arrive. Longer calls need not be mistakes and should not disappear during cleaning.',
    question: 'Is right-skewed the same as most values being on the right?',
    response:
      'No. Skew direction describes the longer tail. In this chart most values are toward the lower end, while a small number of larger values extend to the right. Read the entire spread rather than naming the shape from the tallest stack alone.',
  },
  'bimodal-dot-plot': {
    title: 'Bimodal dot plot example with two peaks',
    answer:
      'A bimodal dot plot has two most frequent values. This constructed completion-time dataset has equally tall stacks at 3 and 9 minutes, creating two peaks with a gap around the centre.',
    reading: [
      'The values are 2, 3, 3, 3, 4, 4, 5, 7, 8, 8, 9, 9, 9 and 10 minutes. Both 3 and 9 occur three times, making them the two modes. No other value occurs as frequently.',
      'The 14 observations sum to 84, giving a mean of 6 minutes. The seventh and eighth sorted values are 5 and 7, so the median is also 6. Yet nobody in the example completed the task in exactly 6 minutes. The shared mean and median conceal the two concentrations.',
    ],
    method: [
      'Retain exact repeated observations and use a numeric axis. Do not replace the individual times with a precomputed frequency column when loading this stacked-dot editor. It builds the stacks from the repeated values itself.',
      'Read the modes from stack heights, then compare them with the mean reference. If a real dataset shows two concentrations, examine relevant source information such as task type or collection conditions. Keep any proposed explanation separate from what the chart alone establishes.',
    ],
    caution:
      'Two peaks do not prove there are two underlying populations, and this chart contains no labels identifying groups. The fictional example was designed to have equal modes. Rounding and small sample size can create or hide peaks in real measurements.',
    question: 'Can a bimodal dataset have its average in an empty gap?',
    response:
      'Yes. The mean is a calculated balance point, so it does not have to equal an observation. Here both mean and median are 6 while the observations jump from 5 to 7. Reporting the modes and showing the dots preserves information the average leaves out.',
  },
  'skills-radar-chart': {
    title: 'Skills radar chart example with a practice goal',
    answer:
      'A skills radar chart compares ratings across several named capabilities on a common scale. This fictional example places current self-ratings beside practice goals for six skills, making the gaps available for discussion.',
    reading: [
      'Coding moves from a current rating of 3 to a goal of 6, and presenting from 4 to 7. Those are the largest gaps at three scale points each. Design begins at 7 and has a goal of 8, a smaller gap of one point.',
      'Research and writing each have two-point gaps, while planning has a one-point gap. The outline format keeps both series readable without overlapping filled areas. The gaps describe stated ratings and intentions, not a measured rate of learning or a probability of achieving the goal.',
    ],
    method: [
      'Use one row per skill and a column for each assessment. Define what values on the shared 0–10 scale mean before scoring. For example, agree on observable tasks associated with selected levels rather than treating a higher number as self-explanatory.',
      'Keep the same dimensions, axis order and maximum when comparing later assessments. Update the source and subtitle with the assessment context. The editor accepts the supplied scores directly; it does not evaluate competence, assign a rubric or normalize different kinds of evidence.',
    ],
    caution:
      'These ratings are invented and are not a validated assessment instrument. A goal is not an observed result. Polygon area is not an overall skill score, and changing axis order can change the visual shape without changing any underlying rating.',
    question: 'Can I use this to rank team members?',
    response:
      'The chart can display scores, but ranking requires a fair, consistent assessment process that this example does not provide. For a practice conversation, focus on specific behaviours and evidence behind each dimension. Avoid turning the polygon’s size into an unsupported performance grade.',
  },
  'product-comparison-radar-chart': {
    title: 'Product comparison radar chart example',
    answer:
      'A product comparison radar chart displays two products across a shared set of rated criteria. This fictional example compares usability, features, support, affordability and portability on a common 0–10 scale.',
    reading: [
      'Product A scores 9 for usability and 8 for support, compared with Product B’s 6 and 7. Product B scores 9 for both features and portability, where Product A scores 6 and 5. Neither option has the higher rating on every dimension.',
      'Affordability is a rating: Product A receives 7 and Product B receives 5. Those numbers are not dollar prices. The comparison makes trade-offs visible, but it does not specify whether portability matters more than support for a particular buyer.',
    ],
    method: [
      'Choose criteria that match the intended use and define the scoring rubric. Make higher values consistently mean a more favourable result. A raw price, battery duration and satisfaction score cannot be placed on this common scale without an explicit, documented transformation.',
      'Use identical axes and maximum values for both products. Replace the fictional labels and ratings with your evidence, and include sources and observation dates. Keep factual measurements separate from judgement-based ratings so readers can understand how each score was produced.',
    ],
    caution:
      'Product A and Product B are placeholders, not reviews of real products. The filled polygon is a visual profile, not a weighted recommendation. Axis order changes polygon area, so the larger-looking shape should not be treated as the objectively better purchase.',
    question: 'How should I show actual prices?',
    response:
      'Use a table or a separate chart with currency units. If this radar uses an affordability score, publish the rule that converts price into that score and state the relevant pricing date. Never label a 0–10 rating as a price measurement.',
  },
  'football-player-radar-chart': {
    title: 'Football player radar chart example',
    answer:
      'A football radar chart compares profiles across named dimensions. This example uses fictional coaching ratings for two players across passing, finishing, dribbling, tackling, positioning and pace, all on a shared 0–10 scale.',
    reading: [
      'Player A has higher passing, tackling and positioning ratings: 8 versus 6, 9 versus 4, and 8 versus 7. Player B has higher finishing, dribbling and pace ratings: 9 versus 5, 8 versus 7, and 9 versus 6.',
      'The largest difference is tackling, with a five-point gap. That describes this made-up rating table, not a count of successful tackles. The profiles suggest different strengths for discussion; they do not establish which player is better for every role or match situation.',
    ],
    method: [
      'Use comparable measures and define their meaning before plotting. These axes are subjective ratings, so the editor uses the numbers as supplied. It does not fetch match statistics, calculate percentiles or adjust for minutes played, position, league or possession.',
      'If you build a real statistical version, choose a consistent comparison population and time window. Document any per-90 conversion and percentile calculation outside the chart. Change the labels to match the actual transformed measure, and preserve the same scale across the compared players.',
    ],
    caution:
      'No real athlete, scouting record or performance dataset is represented here. A rating of 8 is not an 80th percentile unless you explicitly calculate and label it that way. Filled area is not a player-quality index, and role context matters when interpreting dimensions.',
    question: 'Can I paste raw goals, passes and tackles into one radar?',
    response:
      'The editor can plot numbers, but those quantities have different units and ranges. A meaningful shared-scale comparison needs a documented transformation first. Otherwise a large count may dominate the picture simply because it is measured on a larger numeric scale.',
  },
  'customer-satisfaction-radar-chart': {
    title: 'Customer satisfaction radar chart example',
    answer:
      'A customer satisfaction radar chart compares ratings for different parts of an experience. This fictional before-and-after example uses a common 0–5 plotting scale across clarity, courtesy, speed, resolution and follow-up.',
    reading: [
      'Follow-up rises from 2.4 to 3.7, a gain of 1.3 rating points. Clarity rises by 0.9, speed by 0.8, resolution by 0.5 and courtesy by 0.1. Follow-up shows the largest absolute difference between the two supplied profiles.',
      'Courtesy remains the highest rated dimension after the change at 4.3, while speed is the lowest at 3.6. These comparisons describe synthetic summary values. The chart does not tell us how varied individual responses were or whether the same people answered both times.',
    ],
    method: [
      'Use a row for each question or dimension and columns for the comparison periods. Keep question wording, response scale and scoring direction consistent. If the survey response choices run from 1 to 5, state that separately: the plotting axis here begins at zero.',
      'Calculate the summaries from your survey data before importing them. Record response counts, dates and the treatment of unanswered questions in the accompanying report. The editor plots supplied means; it does not collect responses, weight samples or perform a significance test.',
    ],
    caution:
      'The before-and-after values are invented and do not demonstrate the effect of a real intervention. Without respondent-level data, sampling details and uncertainty, visual differences cannot establish causation or statistical significance. Treat 1.3 as rating points, not a 1.3% improvement.',
    question: 'Does an outward line mean the service definitely improved?',
    response:
      'It means the supplied rating is higher on that dimension. Whether a real difference reflects a service change depends on the survey design, sample and uncertainty. Show that context alongside the chart and avoid turning a visual change into a causal claim.',
  },
  'competitor-analysis-radar-chart': {
    title: 'Competitor analysis radar chart example',
    answer:
      'A competitor analysis radar chart compares several offers against the same criteria. This editable example uses three fictional profiles across onboarding, documentation, integrations, support, accessibility and value.',
    reading: [
      'Our concept has the highest supplied ratings for onboarding, support and accessibility. Alternative A leads documentation at 9, while Alternative B leads integrations at 9 and value at 8. The example deliberately distributes strengths across the three profiles.',
      'Our concept’s integration rating is 5, compared with 8 and 9 for the alternatives. That difference could prompt further research in a real comparison. It is not evidence of a market opportunity here because the offers and their scores were invented to explain the chart.',
    ],
    method: [
      'Build an evidence table before assigning real scores. Define each criterion, record the source and date, and explain the mapping from observed features or tests to a common 0–10 rating. Use the same evaluation procedure for your own offer and alternatives.',
      'The chart uses outlines and a wide frame to reduce overlap among three profiles. Keep labels short and criteria distinct. If a rating is unknown, investigate or change the comparison scope rather than entering zero: zero is a score, not a missing-data marker.',
    ],
    caution:
      'These are hypothetical offers and illustrative scores, not independent reviews. The profile does not include criterion weights or calculate a winner. Changing axis order changes the polygon shape, and combining overlapping criteria can overemphasize one aspect of an offer.',
    question: 'Should our product be highest on every axis?',
    response:
      'Only show ratings supported by the stated evaluation. A useful comparison explains trade-offs and makes its evidence inspectable. Designing the scores to guarantee a favourable shape would undermine the resource’s value and the credibility of the publisher.',
  },
  'wheel-of-life-chart': {
    title: 'Wheel of life chart example for reflection',
    answer:
      'A wheel of life chart places personal reflection ratings around a circle. This example uses a radar polygon with eight fictional 0–10 satisfaction ratings, offering a starting point for a private reflection exercise.',
    reading: [
      'Friends and family have ratings of 8, while rest has a rating of 4 and creativity a rating of 5. Learning and home are at 7; work and leisure are at 6. These values describe the invented profile used to demonstrate the layout.',
      'A lower score can become a prompt for a specific question, such as what would make rest feel more satisfactory. It does not automatically establish a problem, a priority or a need to make every dimension equal. Different areas can matter differently at different times.',
    ],
    method: [
      'Rename the eight dimensions to fit your reflection and define the endpoints of the rating scale in your own words. Enter one rating per dimension. Keep the maximum at 10 if you want the existing scale, and update the title and source before downloading.',
      'This is a connected radar polygon with a circular grid, rather than a printable worksheet with independently shaded wedge sectors. You can export it for a journal or revisit the same dimensions later. Keep axis order and rating meanings consistent if comparing reflections over time.',
    ],
    caution:
      'The wheel is a reflection aid, not a diagnostic instrument or a validated measure of wellbeing. Its polygon area is not an overall life score. The example’s numbers are fictional, and a chart cannot determine what choices or support are appropriate for an individual.',
    question: 'Do all parts of the wheel need to reach ten?',
    response:
      'No target is prescribed here. The ratings are prompts for your own interpretation, and priorities can change. Consider what each dimension means to you and whether one small, specific adjustment would be useful, rather than treating a perfectly full shape as a requirement.',
  },
};
export const examples = Object.entries(stories).map(([slug, story]) => ({
  slug: slug as ShowcaseSlug,
  ...story,
  spec: showcaseSpecs[slug as ShowcaseSlug],
}));
export const groups = Object.entries(showcaseGroups).map(([kind, group]) => ({
  ...group,
  kind,
  examples: examples.filter((e) => e.spec.kind === kind),
}));
export const groupIntro: Record<string, { answer: string; sections: { title: string; text: string }[] }> = {
  line: {
    answer:
      'Line graph examples show change across ordered categories, numeric intervals or dates. Explore eight worked examples, from monthly sales to distance–time and cumulative frequency graphs. Each includes editable data, a finished chart and a calculation you can check.',
    sections: [
      {
        title: 'Choose the right horizontal axis',
        text: 'Consecutive months can use equally spaced category labels. Elapsed minutes need a numeric axis, and irregular observation dates need a time axis. Equal spacing would distort the meaning of slopes when the intervals differ. Compare the journey and plant-height examples to see the difference.',
      },
      {
        title: 'Read the units before reading the slope',
        text: 'A distance–time slope describes speed, while a speed–time slope describes change in speed. The same flat shape can mean a pause in one graph and continued motion in another. Every example states the axis units and explains what its straight connections assume.',
      },
      {
        title: 'Use the complete example',
        text: 'Open any chart to inspect its exact values, worked interpretation and limitations. Download the original SVG, PNG or CSV, or load the complete settings into the free line graph maker. All datasets are fictional teaching examples; replace them with your own observations before presenting findings.',
      },
    ],
  },
  dot: {
    answer:
      'These six stacked dot plot examples show individual observations, repeated values and distribution shapes. Learn to read a class score distribution, calculate mean and median, and examine outliers, fractions, skew and two modes using the exact plotted data.',
    sections: [
      {
        title: 'One dot means one observation',
        text: 'These are frequency dot plots. Repeated values stack vertically above a numeric axis. They differ from category dot charts, which position a summarized value next to each category name. The data downloads preserve individual observations, including every repetition and genuine zero.',
      },
      {
        title: 'Go beyond the average',
        text: 'The outlier example shows how one large value changes the mean. The bimodal example has a mean and median in an empty gap between its two peaks. Reading the dots alongside the summaries helps avoid describing a whole distribution with one number.',
      },
      {
        title: 'Prepare numbers without changing their meaning',
        text: 'Use consistent units and convert quarter fractions to their exact decimal equivalents. Do not remove unusual observations or substitute zero for missing values automatically. Each worked example includes the original list, downloadable files and a direct link to the dot plot editor.',
      },
    ],
  },
  radar: {
    answer:
      'Explore six radar chart examples comparing skills, products, player profiles, satisfaction and personal reflection. Each spider chart uses explicitly defined, shared-scale ratings and includes the data, an editable version and guidance on avoiding misleading comparisons.',
    sections: [
      {
        title: 'A common scale needs a clear meaning',
        text: 'Radar axes must have comparable numeric ranges and an explicit scoring direction. A raw price and a count of features do not become comparable simply because they appear on the same polygon. These examples use fictional ratings and state where a rubric or transformation would be needed for real evidence.',
      },
      {
        title: 'Compare dimensions, not polygon area',
        text: 'Look at individual axes and differences between the series. Reordering axes can change the shape and enclosed area without changing the ratings. None of these examples treats area as an overall score, declares an objective winner or supplies unsupported product or player reviews.',
      },
      {
        title: 'Keep context with the download',
        text: 'Choose an example to see its scale, interpretation and limitations. Open the exact profile in the free radar chart maker to replace labels and values. Use the source note to describe your own evidence, and keep the same axes and maximum when comparing later observations.',
      },
    ],
  },
};

export const methodReferences: Partial<Record<ShowcaseSlug, { name: string; url: string }>> = {
  'speed-time-graph': {
    name: 'OpenStax Physics: velocity–time graphs and area',
    url: 'https://openstax.org/books/physics/pages/2-4-velocity-vs-time-graphs',
  },
  'distance-time-graph': {
    name: 'OpenStax Physics: position–time graphs and slope',
    url: 'https://openstax.org/books/physics/pages/2-3-position-vs-time-graphs',
  },
  'cumulative-frequency-graph': {
    name: 'CIMT: cumulative frequency worked lessons',
    url: 'https://www.cimt.org.uk/sif/datascience/ds5/interactive/s1.html',
  },
  'break-even-chart': {
    name: 'US Small Business Administration: planning and break-even analysis',
    url: 'https://www.sba.gov/counseling/plan-your-business/',
  },
  'line-graph-negative-values': {
    name: 'Office for National Statistics: axes and gridlines',
    url: 'https://service-manual.ons.gov.uk/data-visualisation/guidance/axes-and-gridlines',
  },
};
