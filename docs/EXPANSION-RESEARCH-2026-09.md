# Search evidence and useful resource expansion

Research date: September 8, 2026. Ahrefs Keywords Explorer, Google, United States; 43-query batch, observed in the signed-in browser. Volumes are estimates, not traffic forecasts. The interface displayed a ranking-data warning; growth percentages were excluded. Missing difficulty values are not zero difficulty. The full query list is represented below. Private course materials are not included.

| Query | US volume | Global volume | KD |
|---|---:|---:|---:|
| frequency table | 22000 | 48000 | 21 |
| mean vs median | 15000 | 20000 | 0 |
| line of best fit | 8800 | 18000 | 3 |
| histogram maker | 8100 | 12000 | 0 |
| histogram vs bar graph | 7600 | 16000 | 3 |
| pearson correlation coefficient | 5300 | 16000 | 0 |
| misleading graphs | 3800 | 6600 | 6 |
| histogram examples | 3500 | 4400 | 18 |
| scatter plot maker | 3500 | 5800 | 0 |
| bar chart maker | 3300 | 9100 | 31 |
| correlation does not imply causation | 2500 | 5300 | 0 |
| box plot maker | 2300 | 3300 | 0 |
| scatter plot examples | 2000 | 3700 | 7 |
| standard deviation vs standard error | 2000 | 3000 | 4 |
| relative frequency histogram | 1800 | 2500 | 0 |
| iris dataset | 1300 | 11000 | 47 |
| horizontal bar chart | 1200 | 5600 | 3 |
| grouped bar chart | 1100 | 5100 | 2 |
| positive correlation scatter plot | 700 | 1300 | 3 |
| box plot examples | 600 | 700 | 9 |
| bar chart examples | 500 | 1500 | 28 |
| negative correlation scatter plot | 350 | 800 | 0 |
| box plot quartiles | 300 | 600 | 20 |
| bar graph vs line graph | 300 | 600 | 0 |
| box plot outliers | 250 | 600 | 4 |
| scatter plot vs line graph | 200 | 350 | 0 |
| scatter plot no correlation | 200 | 400 | 0 |
| pareto chart maker | 150 | 350 | 1 |
| pareto chart examples | 150 | 350 | 6 |
| box plot vs histogram | 150 | 300 | 0 |
| logarithmic scale graph | 150 | 300 | 2 |
| stacked bar chart maker | 150 | 250 | 0 |
| dot plot vs histogram | 80 | 100 | 0 |
| pie chart vs bar graph | 80 | 200 | 1 |
| wine dataset | 70 | 600 | 11 |
| truncated y axis | 50 | 90 | 3 |
| abalone dataset | 40 | 90 | — |
| histogram bin width | 40 | 60 | 3 |
| 100 percent stacked bar chart | 30 | 150 | — |
| seeds dataset | 10 | 40 | — |
| glass identification dataset | 0–10 | 50 | — |
| radar chart disadvantages | 0–10 | 0–10 | — |
| missing data line graph | not in database | — | — |

## Intent and release decisions

Search results for the five makers surfaced working browser utilities: scatterplotmaker.com (paired points and regression), statisticsfundamentals.com/visual-tools/histogram-maker/ (binning), chartload.com/charts/box-plot/ (raw group observations), paretoscope.com (ranked counts and cumulative percentages), becharts.com/bar-chart-maker (grouped and stacked bars). This supports a tool-first format with visible data and downloads. It does not establish that ChartsAI will rank. Bar maker is a broader, more competitive term; the utility is also necessary for the distinct stacked and horizontal use cases.

Build five native ECharts tools, five family hubs, and thirty original worked examples (six per family). Cases change the mathematical question: skew and bin boundaries, quartile conventions and outliers, linear and nonlinear associations, totals and shares, count and cost prioritization. Do not publish title permutations of identical examples.

Comparison and method guides address the observed comparison queries with paired charts or an explicit calculation. Dataset resources require primary-source download verification, license attribution, row counts, column definitions and reproducible chart selections. Iris is competitive: treat it as a reusable reference resource, not a quick ranking promise.

## Publication gates

Check the working tool, original input, numerical claims, static chart, accessible data, exports, related links, canonical, sitemap and truthful schema. Inspect mobile rendering. Flag thin or substantially duplicate prose. Keep missing or ambiguous input visible; never silently remove rows or substitute zero. Publish checked batches while continuing development. Search Console indexing and impressions are subsequent measurements, not preconditions for completing the authorized build.

Google guidance: [scaled content abuse](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content) and [AI features](https://developers.google.com/search/docs/appearance/ai-features). Page volume alone provides no authority; AI visibility has no guaranteed special markup shortcut.
