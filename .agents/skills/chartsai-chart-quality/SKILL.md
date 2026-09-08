---
name: chartsai-chart-quality
description: Review or improve data charts and coordinate diagrams with source-to-output value checks, explicit scale decisions and visual export inspection. Use when building or revising a chart from supplied data.
---

# ChartsAI chart quality

This is an experimental repository skill by SupaMakers. Preserve the user's intended comparison, data and output format. Do not route the task through a hosted service or add a model/API dependency. Its checks establish specific invariants, not proof that a model produces better charts.

## Decide what the picture should communicate

Identify the observational unit and question before choosing the encoding. Preserve an explicit chart choice unless it makes that question misleading; explain any proposed replacement. Distinguish a distribution of individual observations from a comparison of categories. A coordinate diagram needs equal physical X/Y units; an ordinary scatter plot does not universally require them.

For counts or magnitude bars, show the zero baseline. For signed bars include zero and both extremes. A line chart can use a narrower scale when the domain and the scale are explicit. Radar comparisons need common units or an explicitly agreed normalization; polygon area is not a composite score. A regression line and a polyline joining observations answer different questions.

## Keep a traceable data contract

Record the selected source rows/columns, units, missing-value handling, and any requested sorting, grouping or normalization. Never silently remove invalid observations, turn missing values into zero, drop repeated positions or make totals to resolve duplicate categories. Keep source references truthful when replacing an example.

Use [scripts/check-projection.mjs](scripts/check-projection.mjs) for an unchanged row/column projection. Read [references/projection-contract.md](references/projection-contract.md) for its JSON input. Extract plotted rows from the actual render specification or export; copying the source into both fields would invalidate the check. Explicit transformations require a separate calculation check against their declared method; this identity checker is not suitable for aggregates.

## Make the output readable

Check the actual target size: label length, overlap, clipping, contrast, distinguishable series and useful annotations. Use direct labels when they clarify the comparison. Reuse an established renderer for chart axes/geometry. A shared SVG grid is appropriate for printable coordinate worksheets. Keep values accessible outside the image; a hidden-answer exercise must not expose its answer in visible captions or accessibility text before reveal.

Use the same specification for preview and exports. Inspect a real downloaded file and its dimensions/page size. For practice sheets, verify that question and answer-key pages use the same points and that revealing the screen answer does not put it onto the question page. Report unsupported characters, precision or overlapping-label limits honestly.

## Evidence and limits

Run the deterministic checker fixtures with `node --test scripts/check-projection.test.mjs` from this skill directory. To evaluate model improvement, follow [references/evaluation.md](references/evaluation.md). Keep authored failure fixtures separate from model-generated baselines. Do not invent an improvement score, benchmark result, source or citation. Publishing this folder as source is not an installable skill launch or evidence of search demand.
