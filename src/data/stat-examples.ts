import {
  statPresets,
  statPresetIds,
  statExamplePath,
  statFamilies,
  type StatPresetId,
} from '../lib/stat-presets';
export interface StatStory {
  title: string;
  answer: string;
  reading: string[];
  practice: string;
  limit: string;
  question: string;
  response: string;
}
export const statStories: Partial<Record<StatPresetId, StatStory>> = {
  'histogram-class-scores': {
    title: 'Histogram of class scores with ten-point bins',
    answer:
      'This histogram groups twenty fictional scores into ten-point intervals from 40 to 100. The count in each interval makes the concentration easier to compare while the downloadable list preserves every original score.',
    reading: [
      'The first interval, 40–under 50, contains 42 and 48. The next has 52, 56 and 58. The remaining bin counts are 4, 5, 4 and 2. Together the six counts sum to twenty, so no score has been lost at a boundary.',
      'The tallest interval is 70–under 80 with five scores. That does not make 70 or 75 the most common exact score: every supplied score occurs once. A histogram describes groups of values, so its tallest bar identifies a modal interval rather than an individual mode.',
    ],
    practice:
      'Open the editor and change the width from 10 to 20 while keeping the start at 40. The new three counts are 5, 9 and 6. This coarser view emphasizes the centre but hides the differences between adjacent ten-point intervals. Use the width that supports the question and state it when sharing.',
    limit:
      'These invented scores do not describe a real class or prove a normal distribution. There are only twenty observations, and the chosen boundaries influence the visual impression.',
    question: 'Why do the bars touch?',
    response:
      'Adjacent intervals cover adjacent parts of the numeric scale. The touching bars signal continuous numeric grouping. This is different from a category bar chart, where a gap separates independent category names.',
  },
  'histogram-waiting-times': {
    title: 'Right-skewed waiting-time histogram',
    answer:
      'This waiting-time histogram shows a concentration of short waits and a tail toward longer durations. Sixteen fictional observations are grouped into five-minute bins, making both the main cluster and the long waits visible.',
    reading: [
      'The 0–under 5 interval contains nine observations. The 5–under 10 interval contains four. The next three intervals each contain one observation: 12, 17 and 23 minutes. The counts sum to sixteen, with thirteen waits shorter than ten minutes.',
      'The sample total is 100 minutes, so the mean is 6.25 minutes. The middle two observations are both 4, giving a median of 4 minutes. Longer waits pull the average to the right of the median, but the chart retains those experiences rather than discarding them.',
    ],
    practice:
      'Compare the five-minute grouping with a width of ten. The first bar then contains thirteen waits, which is easy to summarize but less detailed. To inspect whether one-minute and four-minute waits differ in frequency, download the original values or use a stacked dot plot instead.',
    limit:
      'Waiting times are fictional and do not measure a service standard. A long tail in a small sample does not establish a named probability distribution or identify why particular waits took longer.',
    question: 'Should the 23-minute wait be removed?',
    response:
      'The picture alone gives no reason to remove it. Investigate source records if a value seems unexpected. Exclusion requires an explicit data decision; this histogram includes all sixteen valid observations.',
  },
  'histogram-two-peaks': {
    title: 'Bimodal histogram example with a gap',
    answer:
      'This constructed histogram places two clusters of fictional lengths on one numeric scale. The groups lie around 2–5 cm and 11–14 cm, separated by empty intervals that stay visible in the chart.',
    reading: [
      'With a start of zero and width of two, the bins contain 0, 5, 3, 0, 0, 1 and 7 observations. The last interval includes its upper boundary, so the two observations at 14 cm remain in the final bar. The total count is sixteen.',
      'The empty 6–under 8 and 8–under 10 intervals show a gap between the clusters. A category chart made only from occupied intervals would close that gap and change the apparent shape. The full sequence of numeric bins is part of the information.',
    ],
    practice:
      'Try a width of four to see how neighbouring intervals combine. Then inspect the original data before deciding whether there are two meaningful groups. A real explanation might depend on measurement conditions or sample membership, which this one-column dataset does not provide.',
    limit:
      'The two concentrations were designed for teaching. Their appearance does not prove two populations or a mixture model. Histogram peaks depend partly on bin alignment, and the exact observed modes are not the same thing as the tallest intervals.',
    question: 'Can a histogram hide two clusters?',
    response:
      'Yes. Wide bins can combine observations across a gap and make distinct concentrations look like one broad group. Test plausible widths while keeping the underlying observations unchanged, and report the grouping used in the published chart.',
  },
  'box-plot-two-groups': {
    title: 'Side-by-side box plots comparing two groups',
    answer:
      'These box plots compare fictional morning and evening completion times. Both groups contain eight observations, but the evening sample has a wider middle spread and a higher median.',
    reading: [
      'Using linear-interpolated quartiles, morning has Q1 11.75, median 13.5 and Q3 15.25 minutes. Evening has Q1 11.5, median 15 and Q3 18.5 minutes. Their IQRs are 3.5 and 7 minutes respectively.',
      'The morning observations range from 10 to 17; evening ranges from 8 to 22. No value lies beyond its group’s 1.5 × IQR fences, so whiskers reach the observed minimum and maximum in this particular example. That outcome follows from the values, not a universal definition of a whisker.',
    ],
    practice:
      'Compare the medians first, then compare the box lengths and full ranges. Because both samples have N = 8, unequal sample size is not a factor here. If you replace the data with uneven groups, keep the group labels repeated on each row and read N from the calculated table.',
    limit:
      'The fictional groups do not demonstrate a time-of-day effect. A box plot has no information about assignment, task difficulty or uncertainty, and the editor does not test whether a difference is statistically significant.',
    question: 'Does a taller box mean more observations?',
    response:
      'No. The box length along the numeric axis represents the interquartile range. In this chart the boxes have the same visual width, and sample counts are reported separately. Evening’s larger box describes spread, not a larger group.',
  },
  'box-plot-outlier': {
    title: 'Box plot with an outlier and visible fences calculation',
    answer:
      'This box plot keeps a large fictional observation visible as a separate point. The nine values run from 2 to 30, with most between 2 and 8. The 1.5 × IQR rule determines where the whiskers stop.',
    reading: [
      'With the default linear method, Q1 is 4, the median is 5 and Q3 is 7. The IQR is therefore 3. The lower fence is −0.5 and the upper fence is 11.5, calculated as 4 − 1.5 × 3 and 7 + 1.5 × 3.',
      'The smallest and largest observations inside the fences are 2 and 8, so these are the whisker endpoints. The value 30 appears beyond the upper whisker. The maximum in the summary remains 30: a flagged observation is still part of the dataset.',
    ],
    practice:
      'Switch the whisker rule to minimum-to-maximum to see the upper whisker reach 30. This changes the display convention without editing the source values. Keep the selected convention in the explanation so readers do not interpret two different box plots as different measurements.',
    limit:
      'An observation beyond a fence is not automatically an error or evidence of a separate population. The rule is a descriptive flag. This invented sample supplies no collection context with which to justify exclusion.',
    question: 'Why is the upper whisker 8 rather than 11.5?',
    response:
      'The fence is a calculated cutoff, while this whisker must end on an observed value within that cutoff. There is no observation at 11.5. The largest eligible observation is 8, and the next value, 30, exceeds the fence.',
  },
  'box-plot-equal-medians': {
    title: 'Box plots with equal medians and different spreads',
    answer:
      'Two groups can have the same median while looking very different in a box plot. These fictional samples both centre on 10, but the wide group has a much larger IQR and observed range.',
    reading: [
      'The narrow group has Q1 9, median 10 and Q3 11 under linear interpolation. Its IQR is 2 and its values range from 8 to 12. The wide group has Q1 5.5, median 10 and Q3 14.5, giving an IQR of 9 and a range from 0 to 20.',
      'Both samples have eight observations. The two middle values are 10 and 10 in each list, which explains the equal medians. Looking only at that shared centre would omit how tightly or loosely the other values are distributed around it.',
    ],
    practice:
      'Read the data table next to the chart and count observations on either side of 10. Then try replacing one extreme value without changing the two middle positions. The median can remain fixed while the whisker, range or outlier status changes, depending on the replacement.',
    limit:
      'A smaller spread is not automatically better. That judgement depends on the measure and purpose. These scores are fictional, and the chart does not calculate consistency targets or compare population variances.',
    question: 'Does the same median mean the same distribution?',
    response:
      'No. The median describes a central position in an ordered sample. It does not specify the range, IQR, shape or frequency of exact values. This pair is a worked example of how identical centres can accompany very different variation.',
  },
  'scatter-positive-correlation': {
    title: 'Positive correlation scatter plot with a fitted line',
    answer:
      'This fictional scatter plot shows a positive linear association: larger X measurements generally accompany larger Y measurements. Each point is one paired observation, and the dashed line is an optional least-squares summary.',
    reading: [
      'The eight X values run from 1 to 8, while Y ranges from 2 to 11. The points do not sit perfectly on a straight line: Y falls from 5 at X = 3 to 4 at X = 4. Positive association does not require every adjacent pair to increase.',
      'The fitted slope is 1.1904762 and the intercept is about 0.6428571. These come from the centred sums of products and squares, using all eight pairs. The calculated panel reports the unrounded computational results, while the plotted line spans only the observed X range.',
    ],
    practice:
      'Turn the fitted line off and inspect the points first. Then turn it back on and compare which points lie above or below it. Use the original CSV to reproduce the slope in another program with an intercept included; fitting through the origin would answer a different calculation.',
    limit:
      'The measurements were invented to demonstrate association. No real exposure or outcome is represented. A positive slope does not prove that changing X causes Y to change, nor that the relationship will hold outside these eight observations.',
    question: 'Is a positive correlation always a perfect line?',
    response:
      'No. Positive correlation describes the direction of a linear association. Points can vary around that trend. A perfect positive linear relationship has r = 1 when both variables vary; this example includes deviations and should be read as an imperfect association.',
  },
  'scatter-negative-correlation': {
    title: 'Negative correlation scatter plot example',
    answer:
      'This fictional scatter plot shows an overall downward relationship. Larger X values tend to accompany smaller Y values, while individual observations still depart from a perfectly descending line.',
    reading: [
      'The first point is (1, 15) and the last is (8, 4). Between them, Y briefly rises from 13 to 14 and later from 7 to 8. Those local reversals do not cancel the overall negative association across the full set of eight pairs.',
      'The ordinary least-squares slope is about −1.476190 and the intercept about 16.642857. The negative sign describes the fitted change in Y per one-unit increase in X. It does not imply that either variable must itself contain negative observations.',
    ],
    practice:
      'Inspect the numerical correlation and compare its sign with the slope. In a simple fitted line with an intercept, both indicate the same linear direction when defined. Keep axis units and the pairing intact when substituting your own data, and avoid sorting the X and Y columns independently.',
    limit:
      'This is a constructed pattern with no causal interpretation. The line summarizes vertical errors in Y and does not model measurement error in both axes. It also provides no confidence band or guarantee about a future observation.',
    question: 'Can correlation be negative when all values are positive?',
    response:
      'Yes. Correlation concerns how values vary together around their means. Both axes in this example contain positive values, yet high X generally accompanies low Y. The direction of association is separate from the sign of the measurements.',
  },
  'scatter-curved-relationship': {
    title: 'Curved scatter plot with zero Pearson correlation',
    answer:
      'A zero Pearson correlation does not mean there is no relationship. This exact teaching example uses Y = X² for nine X values from −4 to 4, producing a clear U-shaped pattern with zero linear correlation.',
    reading: [
      'The paired values are symmetric: X = −4 and X = 4 both have Y = 16, while −1 and 1 both have Y = 1. The positive and negative centred cross-products cancel, giving a Pearson correlation of zero despite the deterministic quadratic relationship.',
      'The least-squares straight line has slope zero and intercept 60 ÷ 9, or about 6.666667. It runs horizontally through the mean Y. That line cannot follow the U shape, illustrating why a single linear statistic is an incomplete description.',
    ],
    practice:
      'Turn the regression line off to inspect the geometry without its horizontal summary. Then compare the raw pairs with the rule Y = X². The editor fits only a straight line, so a curved model must be specified and evaluated separately rather than inferred from a low r value.',
    limit:
      'These pairs were calculated from an exact formula, not measured in an experiment. There is no random noise or uncertainty. The example demonstrates a limitation of linear correlation rather than establishing a model for a real process.',
    question: 'Does r = 0 prove independence?',
    response:
      'No. In this dataset Y is completely determined by X², so the variables are related even though their linear correlation is zero. Independence is a stronger property that cannot be concluded merely from a zero sample Pearson coefficient.',
  },
  'bar-horizontal-labels': {
    title: 'Horizontal bar chart example with long category labels',
    answer:
      'Horizontal bars give longer category names room to remain readable. This fictional feedback summary compares four requested improvements using response counts, with a shared numeric baseline.',
    reading: [
      'Clearer documentation has 48 responses, faster onboarding 32, more export options 27 and better keyboard access 19. The difference between the first and last categories is 29 responses. Reading the bar endpoints against the same axis makes that absolute difference visible.',
      'The counts sum to 126 selections. That total is not necessarily 126 people: a survey allowing multiple choices could produce several selections per respondent. The chart needs the original survey design before counts can be translated into percentages of people.',
    ],
    practice:
      'Switch to vertical orientation and compare the labels. Horizontal orientation is useful when category names become hard to read beneath narrow columns. Keep the order deliberate; this example already lists counts from high to low, but the bar maker does not reorder your rows automatically.',
    limit:
      'The feedback is fictional and should not be presented as a product survey. Counts do not show request severity, respondent representativeness or development cost. A longer bar indicates more recorded selections, not an automatic roadmap priority.',
    question: 'Should category names be shortened to fit?',
    response:
      'Use horizontal bars first when the names carry useful meaning. Shortening can help, but abbreviations should remain understandable without guessing. The original labels stay in the data table and CSV even if a dense chart has to truncate visible axis text.',
  },
  'bar-grouped-comparison': {
    title: 'Grouped bar chart comparing two periods',
    answer:
      'A grouped bar chart places two series beside each other within every category. This fictional regional example compares orders in two reporting periods, preserving a common baseline for direct comparisons.',
    reading: [
      'North rises from 42 to 55 orders, East from 35 to 47 and West from 61 to 64. South falls from 58 to 52. The absolute changes are +13, +12, +3 and −6 respectively, so not every region moves in the same direction.',
      'Period 1 totals 196 orders and Period 2 totals 218, an increase of 22 overall. Those aggregate totals do not reveal South’s decline by themselves. The grouped view keeps within-region changes visible alongside the broader pattern.',
    ],
    practice:
      'Compare this layout with stacked mode in the editor. A stack emphasizes the combined heights of the two periods, but adding periods is often not the question. Keep grouped mode when the task is comparing Period 1 with Period 2 within each region.',
    limit:
      'The orders and region labels are invented. The chart does not account for differing period lengths, exposure or regional size. Comparing counts fairly requires those definitions to be consistent, and a higher count is not necessarily a higher rate.',
    question: 'When are grouped bars preferable to stacked bars?',
    response:
      'Use grouped bars when each series needs direct comparison from a common baseline. Stacks work better for meaningful parts of a total. In this example the main question is change between periods, so neighbouring bars make that comparison easier to inspect.',
  },
  'bar-stacked-composition': {
    title: 'Stacked bar chart showing task composition',
    answer:
      'This stacked bar chart shows completed, in-progress and not-started tasks within three fictional teams. Each full bar represents the team’s task total, and the coloured segments account for its parts.',
    reading: [
      'Team A has 30 completed, 12 in progress and 8 not started, totalling 50 tasks. Team B also totals 50, composed of 24, 20 and 6. Team C totals 60, with 36 completed, 9 in progress and 15 not started.',
      'Completed tasks form the bottom segment and share a zero baseline, so their counts are straightforward to compare. The in-progress segments start at different heights, making their lengths less directly comparable. Read the data table for exact segment differences.',
    ],
    practice:
      'Switch to 100% stacked mode to compare composition independently of team size. A and C both have 60% completed despite different completed counts and totals. B has 48% completed. This is a different question from which team has completed the most tasks.',
    limit:
      'The task statuses and counts are fictional. They assume each task belongs to exactly one listed status. Overlapping status definitions would double-count tasks and make the total misleading. The chart does not measure effort, task complexity or team productivity.',
    question: 'Can overlapping categories be stacked?',
    response:
      'A parts-of-whole stack needs mutually exclusive parts that can legitimately be added. If one task appears in both completed and in-progress counts, the full bar no longer represents a distinct-task total. Fix the definitions or choose a comparison that does not imply addition.',
  },
  'pareto-defect-counts': {
    title: 'Pareto chart of defect counts with cumulative percentages',
    answer:
      'This Pareto chart ranks five fictional defect categories by reported count. The bars show the counts, and the line tracks their cumulative share of the 100 reports in the example.',
    reading: [
      'Scratches account for 42 reports, dents 25, misalignment 18, finish 10 and other 5. The cumulative shares are therefore 42%, 67%, 85%, 95% and 100%. The first three categories are needed to reach or exceed the 80% reference.',
      'Three of five categories represent 60% of the categories, not 20%. Their combined share is 85% of reports. This is why the plotted data should be read directly rather than assuming that every Pareto chart must exhibit an exact 80/20 split.',
    ],
    practice:
      'Inspect the ranked table and verify the running addition: 42 + 25 + 18 = 85. If using your own defect records, decide whether you are counting defects or defective items. An item with two recorded defect types can produce two reports, so the unit matters.',
    limit:
      'These invented counts identify no real manufacturing cause or intervention. Frequency alone omits severity, repair cost and whether a fix is practical. The chart ranks the supplied categories; it does not discover causes from raw incident descriptions.',
    question: 'Is the highest bar automatically the first problem to fix?',
    response:
      'It is the most frequent category under this counting scheme. Choosing an action also depends on impact, cost and feasibility. A separate cost-based Pareto may produce a different order, so state the decision measure before treating a ranking as a priority list.',
  },
  'pareto-support-requests': {
    title: 'Pareto chart of support requests',
    answer:
      'This fictional support example begins with unsorted category counts. The Pareto maker places sign-in, setup, export, billing and other requests in descending order and recalculates cumulative percentages.',
    reading: [
      'The original counts are billing 18, sign-in 47, export 29, setup 36 and other 10. After sorting, the cumulative counts are 47, 83, 112, 130 and 140. Sign-in alone accounts for about 33.57% of the 140 requests.',
      'The first three categories account for exactly 112 ÷ 140 = 80%. Their position on the line matches the reference. The final two categories still represent 28 requests and remain part of the dataset; reaching a threshold does not make them disappear.',
    ],
    practice:
      'Use consistent category rules when preparing a real ticket summary. Decide whether a reopened ticket counts once or again, and whether one ticket can have multiple categories. Enter aggregated values only after that decision; the tool rejects repeated category labels rather than silently merging them.',
    limit:
      'The example does not describe actual support traffic. Counts may reflect ticket classification, reporting effort or user volume as well as product friction. A Pareto ranking cannot establish why sign-in requests occurred or how much work any category requires.',
    question: 'Why did the order change after import?',
    response:
      'Descending order is an explicit part of this Pareto calculation. The input CSV keeps your supplied order, while the calculated table and chart show the ranking. For a chart that retains a custom order, use the standard bar chart maker instead.',
  },
  'pareto-downtime-minutes': {
    title: 'Pareto chart of downtime measured in minutes',
    answer:
      'A Pareto chart can rank duration rather than incident count. This fictional example totals 500 downtime minutes across five categories, so the largest bars identify where the recorded time accumulated.',
    reading: [
      'Repair contributes 240 minutes, changeover 120, material wait 90, inspection 30 and other 20. The total is 500 minutes. The cumulative percentages are 48%, 72%, 90%, 96% and 100%; the first three categories exceed the 80% reference.',
      'A duration ranking can differ from a frequency ranking. One long repair could accumulate more minutes than many brief inspections. This table does not contain incident counts, so neither the number of events nor average minutes per event can be recovered from it.',
    ],
    practice:
      'Use the same time unit in every row and ensure the periods do not overlap if you intend the sum to represent total downtime. For a real process, state the observation window and whether simultaneous stoppages are counted separately. Replace the title and source note with that context before exporting.',
    limit:
      'The durations were invented for a worked calculation. They do not establish equipment reliability, utilization or root causes. Lost time, lost output and repair cost are different measures and should not be mixed into one numeric column.',
    question: 'Can I combine hours and minutes in the same values column?',
    response:
      'Convert to one unit first. For example, two hours becomes 120 minutes when the axis is minutes. The chart treats supplied numbers as one comparable measure; it cannot infer that a value of 2 means hours while another value of 30 means minutes.',
  },
  'histogram-bin-boundaries': {
    title: 'Histogram bin boundaries: where exact endpoints go',
    answer:
      'A value on a bin boundary must be assigned once. This twelve-observation example makes the boundary convention visible by placing repeated values exactly at 5 and 10, with a final observation at 15.',
    reading: [
      'With start 0 and width 5, the intervals are [0, 5), [5, 10) and [10, 15]. Their counts are 3, 4 and 5. The notation [ includes the endpoint, while ) excludes it. Only the last interval closes on both sides.',
      'The values 5 and 5 belong to the second interval. The values 10 and 10 belong to the third. The maximum, 15, also belongs to the third because the final upper boundary is inclusive. Assigning endpoints to both adjacent bins would inflate the total.',
    ],
    practice:
      'Download the CSV and tally the intervals by hand before changing any setting. Then move the start below zero while keeping width 5. The bin alignment changes, and the new counts must still sum to twelve. Check both the range and closure rule when reproducing this chart in another program.',
    limit:
      'These are designed boundary cases, not measured frequencies from a population. Other software can use right-closed bins, producing different counts without either calculation being inherently wrong.',
    question: 'Why might another histogram put 5 in the first bin?',
    response:
      'It may use intervals open on the left and closed on the right. Compare the stated rules before comparing results. In this maker interior intervals include their lower boundary and exclude their upper boundary, so 5 starts the second interval.',
  },
  'histogram-relative-frequency': {
    title: 'Relative frequency histogram with a worked percentage table',
    answer:
      'A relative frequency histogram expresses each bin count as a share of all observations. Here twenty fictional values become four bars of 20%, 30%, 30% and 20%, preserving the shape of the count histogram.',
    reading: [
      'The bins start at 0 with width 5. Their counts are 4, 6, 6 and 4. Dividing each count by 20 and multiplying by 100 gives the displayed percentages. The percentages sum to 100 because every observation belongs to exactly one interval.',
      'The second bin, [5, 10), contains six observations: 5, 6, 6, 7, 8 and 9. The final bin includes 15 through 20, although no observation equals 20. Its count is four. Percentage height describes the interval as a whole, not each individual number inside it.',
    ],
    practice:
      'Turn relative frequency off to compare counts and percentages using the same bins. The numerical axis changes, but the relative heights remain identical. If comparing two samples with different sizes, use matching boundaries and units before comparing their percentage histograms.',
    limit:
      'This plot uses equal-width bins and percentage heights. It is not a density histogram: heights are not divided by bin width. Do not interpret its total geometric area as one or use it to compare unequal-width bins.',
    question: 'Is relative frequency the same as density?',
    response:
      'No. Relative frequency is count divided by sample size. Density also divides by interval width so that area encodes probability. With these five-unit bins, a 30% interval has probability 0.30 and density 0.06 per unit.',
  },
  'histogram-negative-values': {
    title: 'Histogram with negative and positive observations',
    answer:
      'Histograms can include values below zero. This fictional set represents signed measurement differences, grouped into equal five-unit intervals from −10 to 10. Zero is a value on the axis, not a missing-data code.',
    reading: [
      'The interval counts are 3 for [−10, −5), 4 for [−5, 0), 6 for [0, 5), and 3 for [5, 10]. The two observations at zero both belong to the third interval under the lower-inclusive convention. All sixteen observations are retained.',
      'Seven values are negative, two are zero and seven are positive. The histogram combines zeros with small positive differences, so the bars alone do not expose that exact balance. The raw list answers the sign-count question more directly.',
    ],
    practice:
      'Compare the histogram with a dot plot when you need readers to distinguish exact zeros from small changes. Keep the sign convention in the axis label: a negative difference could mean below a reference or a decrease, depending on how you calculated it.',
    limit:
      'These differences are invented. A symmetric count of positive and negative observations does not imply a zero mean or a symmetric distribution. The meaning of the reference point must come from the measurement definition.',
    question: 'Should negative observations be converted to positive values?',
    response:
      'Only if your actual question concerns absolute magnitude and you explicitly transform the data. Taking absolute values discards direction and changes the distribution. This chart keeps the supplied signs and treats negative values as valid numeric observations.',
  },
  'box-plot-small-sample': {
    title: 'Box plot quartiles for a five-value sample',
    answer:
      'Quartile conventions can visibly change a small-sample box plot. This example uses 2, 4, 7, 10 and 16 with the median-of-halves method, excluding the overall middle observation when forming the halves.',
    reading: [
      'The overall median is 7. The lower half contains 2 and 4, so Q1 is 3. The upper half contains 10 and 16, so Q3 is 13. The IQR is 10, and the fences are −12 and 28. All observations lie inside them.',
      'Switching to linear interpolation gives Q1 = 4 and Q3 = 10, with IQR = 6. The median stays 7. The two methods use the same input but locate quartiles differently; this matters particularly when only a few observations are available.',
    ],
    practice:
      'Open the example and change the quartile method. Compare the calculated table, not just the box edges. Document the method when submitting coursework or matching another application, since an unspecified quartile convention can explain an apparent disagreement.',
    limit:
      'Five observations provide a sparse description of a distribution. A box plot compresses that already small sample; inspecting all five values or drawing a dot plot can be more informative. Neither quartile convention supplies uncertainty estimates.',
    question: 'Which quartile method is correct?',
    response:
      'Both are defined conventions. The appropriate choice depends on the specification you need to follow. This example starts with medians of halves excluding the middle value; the editor also offers R type 7 linear interpolation and labels the choice explicitly.',
  },
  'box-plot-negative-values': {
    title: 'Box plots of signed changes around zero',
    answer:
      'These box plots compare signed fictional changes for two groups. Negative observations remain valid values, and the zero reference helps distinguish decreases from increases without forcing the whole distribution above zero.',
    reading: [
      'Group A contains −12, −8, −5, −2, 0, 1, 3 and 7. Its median is −1, halfway between −2 and 0. Group B contains −5, −3, 0, 2, 4, 6, 8 and 12, giving a median of 3.',
      'The central positions differ by four units. That is a difference between sample medians, not the median of paired differences. The rows are grouped observations and do not establish that each Group A value matches a particular Group B value.',
    ],
    practice:
      'Inspect the group counts and original values before interpreting the shift. If the measurements represent before-and-after changes for the same people, prepare one difference per person using a consistent subtraction order. Keep the unit and sign definition in your title or source note.',
    limit:
      'These constructed groups do not show an intervention effect. A box plot alone does not establish pairing, random assignment or statistical significance. Values below zero are not proof of poor performance without knowing the meaning of the measure.',
    question: 'Does a negative median cause a problem for a box plot?',
    response:
      'No. Quartiles are ordered numeric positions and can be negative, zero or positive. The IQR remains Q3 minus Q1, a nonnegative spread. There is no need to offset all values upward just to draw the box.',
  },
  'box-plot-range-whiskers': {
    title: 'Minimum-to-maximum box plot whiskers',
    answer:
      'A box plot can use whiskers that reach the observed minimum and maximum. This example selects that convention explicitly, so large observations are included in the whisker range rather than drawn as separate IQR flags.',
    reading: [
      'Group A spans 1 to 20 and Group B spans 2 to 12. Their medians are 4.5 and 5.5. Linear-interpolated quartiles are 2.75 and 6.25 for A, and 3.75 and 7.25 for B. Both IQRs equal 3.5.',
      'For A, the upper 1.5 × IQR fence would be 11.5, below the observation at 20. Under the selected range convention, the whisker still reaches 20. If you switch to IQR whiskers, it stops at 7 and shows 20 as a separate point.',
    ],
    practice:
      'Toggle the whisker rule while preserving the quartile method. The box and median should remain unchanged because only the whisker convention changes. When comparing published box plots, check both rules before concluding that their source data differ.',
    limit:
      'A range whisker does not say every value between its endpoints was observed. The long upper whisker in A connects a summary endpoint, not a continuous measurement series. All original observations remain available in the table.',
    question: 'Does no separate outlier point mean there are no unusual values?',
    response:
      'No. Under minimum-to-maximum whiskers this chart does not flag observations using the IQR rule. The absence of separate points reflects the selected display convention. Whether a value needs investigation depends on its context and source record.',
  },
  'scatter-no-linear-correlation': {
    title: 'Scatter plot with no linear correlation',
    answer:
      'This balanced set of eight fictional pairs has zero Pearson correlation. Its points show no overall rising or falling straight-line trend, while the complete coordinates remain available for checking the calculation.',
    reading: [
      'Each X value from 1 through 4 appears twice. The Y pairs are (2, 4), (1, 5), (1, 5) and (2, 4). Each pair has mean Y = 3, so the overall mean is 3 and the centred cross-products sum to zero.',
      'The least-squares line is horizontal at Y = 3. Pearson r and the fitted slope are both zero, but the vertical spread differs across X positions. A single coefficient does not describe all structure in a scatter plot.',
    ],
    practice:
      'Compare this example with the curved relationship example in this collection. Both have zero linear correlation, yet their point patterns differ. Look at the scatter before choosing a summary, and keep repeated X observations as separate pairs.',
    limit:
      'These points were deliberately balanced; they are not a random sample demonstrating independence. A zero sample correlation can also result from noise, cancellation or a nonlinear pattern. It cannot establish the absence of every possible relationship.',
    question: 'Can I conclude the variables are independent?',
    response:
      'No. Independence is a statement about the joint distribution, and zero linear correlation is insufficient to establish it. This small constructed sample only demonstrates how the Pearson calculation can equal zero when positive and negative contributions cancel.',
  },
  'scatter-influential-point': {
    title: 'Scatter plot with an influential high-X observation',
    answer:
      'An observation far from the other X values can strongly affect a fitted line. This fictional example contains six nearby pairs and one point at (20, 30), making its influence on the linear summary easy to inspect.',
    reading: [
      'The first six points have X from 1 to 6 and Y from 2 to 4. The final point extends both ranges substantially. It has high leverage in the descriptive sense that its X value sits far from the sample mean relative to the main cluster.',
      'A line fitted to all seven pairs balances squared vertical residuals across all seven. It can therefore give a different summary from a line fitted only to the first six. The editor does not remove the distant point or decide whether it is erroneous.',
    ],
    practice:
      'Download the original CSV, then explicitly create a second six-row version without the final point. Compare the slopes and report that this is a sensitivity check. Investigate the source record before choosing which dataset should support a real conclusion.',
    limit:
      'The coordinates are invented to illustrate sensitivity. A distant observation can be valid and informative, or it can reflect an error. Geometry alone cannot decide. The editor provides a simple fit, not formal influence diagnostics or a robust regression model.',
    question: 'Should I delete the point to improve the chart?',
    response:
      'No automatic deletion is justified. Verify its measurement and context, and explain any exclusion. A sensitivity comparison can show how much the fit depends on the observation without pretending that the preferred-looking pattern is necessarily the correct one.',
  },
  'scatter-repeated-x-values': {
    title: 'Scatter plot with repeated X measurements',
    answer:
      'Repeated X values are valid in a scatter plot. This example keeps nine paired observations at three X positions, showing the variation in Y within each position without aggregating the observations into averages.',
    reading: [
      'At X = 1, the Y values are 2, 3 and 4. At X = 2 they are 3, 4 and 6, and at X = 3 they are 5, 7 and 8. The corresponding group means are 3, 13/3 and 20/3.',
      'The three points in each vertical group are distinct observations. A scatter plot uses their actual numeric coordinates, so repeated X values share a horizontal position. Connecting them in table order would introduce lines with no defined progression.',
    ],
    practice:
      'Keep each X/Y pair on the same row when importing. To compare individual observations with group means, calculate a separate summary explicitly and label it as such. The default chart and downloaded CSV continue to show the original nine pairs.',
    limit:
      'The small constructed sample supplies no sampling scheme or uncertainty. Repeated positions are not evidence of replication quality by themselves. Exactly overlapping pairs can also hide behind one another, so the table and sample count remain necessary.',
    question: 'Does repeated X prevent a fitted line?',
    response:
      'No. The fit is defined as long as the X values vary somewhere in the sample. Repeats at a few X positions are allowed. If every X value were identical, the slope would be undefined and the editor would report that instead of drawing a fitted line.',
  },
  'bar-percent-stacked': {
    title: '100% stacked bars with unequal totals',
    answer:
      'A 100% stacked chart compares composition after dividing each category by its own total. This example uses totals of 40, 200 and 100 so readers can see why equal bar heights do not mean equal counts.',
    reading: [
      'The small group contains 20, 10 and 10, giving shares of 50%, 25% and 25%. The large group contains 50, 100 and 50, giving 25%, 50% and 25%. The medium group contains 30, 30 and 40, giving 30%, 30% and 40%.',
      'The large group has the most observations in the first series, 50, but a smaller first-series share than the small group, 25% versus 50%. Counts and proportions answer different questions; neither can substitute for the other without considering the denominator.',
    ],
    practice:
      'Switch to ordinary stacked mode to compare totals, then return to percentage mode for composition. Keep the original CSV alongside the chart so readers can recover the denominators. The calculated table reports transformed percentages while the CSV retains counts.',
    limit:
      'The groups and counts are fictional. Every category needs a positive total and nonnegative parts. A zero-total category has no defined percentage composition and is rejected rather than displayed as a misleading empty 100% bar.',
    question: 'Why are all bars the same height?',
    response:
      'Each bar is divided by its own category total, making its full height 100%. This intentionally removes differences in total size. Report counts separately when group size matters, especially when comparing a small sample with a much larger one.',
  },
  'bar-diverging-values': {
    title: 'Diverging bar chart with positive and negative changes',
    answer:
      'A diverging bar chart places positive and negative values on opposite sides of zero. These five fictional departmental changes preserve their signs, including an exact zero for Sales.',
    reading: [
      'Operations is +12, Support −8, Design +6, Research −3 and Sales 0. The signed total is +7, calculated as 12 − 8 + 6 − 3 + 0. The sum of absolute magnitudes is 29, which answers a different question about total movement.',
      'The zero baseline is the shared reference from which bar lengths extend. A negative bar is not a missing value, and the zero category remains labelled even though its bar has no visible length. The data table distinguishes zero from absence.',
    ],
    practice:
      'Use a clearly defined difference, such as current minus previous, consistently across categories. If the values are percentage-point changes, label them that way rather than calling them percent growth. Toggle orientation to choose the most readable category labels.',
    limit:
      'The changes are invented and do not describe departmental performance. Adding them is meaningful only when their units and definitions are compatible. Percentage changes with different denominators generally cannot be added as though they were absolute counts.',
    question: 'Can signed values be used in 100% stacked mode?',
    response:
      'This maker rejects them in percentage mode because that mode represents nonnegative parts of a positive total. Use grouped or ordinary stacked values for signed measurements, and keep the zero reference visible so direction remains interpretable.',
  },
  'bar-zero-category': {
    title: 'Bar chart with an explicit zero category',
    answer:
      'A category with zero observations should remain distinguishable from a missing record. This fictional weekday summary includes Tuesday with an explicit zero, preserving the complete sequence of reported days.',
    reading: [
      'The counts are Monday 4, Tuesday 0, Wednesday 3, Thursday 1 and Friday 6. They total 14. Tuesday has no bar length, but its label and table row remain present. Removing the category would hide the fact that a zero was recorded.',
      'The zero does not prove that no underlying event could have occurred. It means the supplied count is zero under the stated collection process. A blank cell would instead be incomplete input and would require correction before this maker could render the table.',
    ],
    practice:
      'Replace Tuesday’s zero with an empty cell and try applying the data to see the validation message. Restore zero only if it is a known observation. If a day was not measured, explain the gap in your reporting rather than converting absence into a numerical count.',
    limit:
      'The counts are fictional and do not establish a weekly pattern. One five-day period provides no information about seasonality or typical weekday performance. The bars preserve supplied order without inferring a time-series model.',
    question: 'Why is Tuesday still on the axis?',
    response:
      'Its category is part of the input and its value is explicitly zero. Keeping it communicates a recorded zero and preserves the intended comparison. Missing data and zero are different states, even when a chart might otherwise make both look like an absent bar.',
  },
  'pareto-cost-priorities': {
    title: 'Cost-based Pareto chart with a different priority measure',
    answer:
      'A cost-based Pareto ranks categories by a shared monetary measure rather than incident frequency. This fictional example totals 3,000 units of cost, making the cumulative calculation reproducible without implying a real business benchmark.',
    reading: [
      'Scrap contributes 1,500, rework 900, returns 400, shipping 150 and other 50. The first two categories total 2,400, exactly 80% of 3,000. The cumulative shares are 50%, 80%, about 93.33%, about 98.33% and 100%.',
      'The two largest categories are 40% of the five categories. Their 80% cost share is an observed feature of this constructed table, not an automatic 80/20 relationship. Ranking by incident count could produce a different ordering entirely.',
    ],
    practice:
      'Define which costs are included before preparing a real table: direct expense, estimated lost revenue and labour time are different quantities. Use one currency and consistent accounting period. The chart sorts supplied numeric totals but does not estimate costs from category names.',
    limit:
      'All amounts are fictional. Costs alone do not show avoidability, uncertainty or the price of an intervention. Preventing a high-cost category may require more effort than another improvement, so the rank is an input to a decision rather than a complete recommendation.',
    question: 'Can I combine counts and costs in one Pareto chart?',
    response:
      'No meaningful cumulative percentage comes from adding unlike units. Prepare separate count-based and cost-based charts, then compare their rankings. Within one chart every category must use the same measure and compatible definitions.',
  },
  'pareto-equal-categories': {
    title: 'Pareto chart where every category has equal weight',
    answer:
      'A Pareto chart need not reveal a dominant category. This example assigns 20 observations to each of five fictional categories, creating equal bars and a cumulative line that rises in identical steps.',
    reading: [
      'The total is 100 and each category contributes 20%. The cumulative shares are 20%, 40%, 60%, 80% and 100%. Four of the five categories are required to reach the 80% reference, so the data have no concentrated few under this categorization.',
      'All five values are tied. The maker preserves their supplied order when sorting equal values. Changing the order of tied categories changes their positions but not the bar heights or cumulative percentages. Position alone cannot establish greater importance among ties.',
    ],
    practice:
      'Use this case as a check against expecting every Pareto chart to support the same story. When categories are evenly weighted, investigate a different measure only if it answers a useful question. Do not keep redefining categories solely to manufacture a dramatic ranking.',
    limit:
      'The equal values are constructed for teaching. Real rounded counts can appear tied while underlying impacts differ. This chart only ranks the supplied measure; it has no information about severity, cost, uncertainty or practical intervention options.',
    question: 'Is the Pareto chart broken if there is no 80/20 pattern?',
    response:
      'No. It correctly displays descending values and their running share. The 80% reference is a reading aid, not a condition for valid data. Here reaching 80% requires 80% of the categories, which is a useful result in itself.',
  },
  'pareto-zero-category': {
    title: 'Pareto chart retaining a zero-count category',
    answer:
      'A zero-count category can remain in a Pareto chart when the overall total is positive. This fictional example places an explicit zero after four positive categories, leaving the cumulative line at 100% for the final step.',
    reading: [
      'The counts are 40, 30, 20, 10 and 0, totalling 100. Cumulative percentages are 40%, 70%, 90%, 100% and 100%. The final category adds no count, so it adds no percentage to the running total.',
      'Keeping the final label distinguishes an observed zero from an omitted category. The chart cannot determine whether the zero means no events, no exposure or a collection issue. That definition belongs in the source context accompanying a real analysis.',
    ],
    practice:
      'Compare the calculated table with the CSV and verify that the zero row remains present. Then test an all-zero table separately: it has no positive denominator, so the editor reports that cumulative percentages are undefined rather than inventing a line.',
    limit:
      'The categories and counts are fictional. A zero does not demonstrate elimination of a problem or predict future absence. It is simply the supplied value for that category in this example, and it should not replace missing or uncollected data.',
    question: 'Why does the line stay flat at the end?',
    response:
      'The previous categories already account for the entire positive total. Adding a category with value zero changes neither the running count nor its percentage. A flat final segment is therefore the correct calculation, not a rendering error.',
  },
};
export const statExamples = statPresetIds
  .filter((id) => !!statStories[id])
  .map((id) => ({
    id,
    ...statStories[id]!,
    spec: statPresets[id],
    url: statExamplePath(id),
    family: statFamilies[statPresets[id].kind],
  }));
