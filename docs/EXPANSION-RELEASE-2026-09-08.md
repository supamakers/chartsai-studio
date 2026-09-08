# ChartsAI v0.5.0 expansion

The release adds five working statistical chart makers and 67 static routes. The complete site builds 103 HTML pages including the noindex 404, with 102 sitemap entries. This inventory includes collection, legal and supporting pages; it is not a claim that all entries are research articles or that search engines have indexed them.

## Useful output

- Eight chart makers in total: existing dot, line and radar plus histogram, box plot, scatter, bar and Pareto.
- Fifty original fictional worked examples, with thirty added in this release. Each has complete input, a static chart, calculations, interpretation, limitations, downloads and an exact editor handoff.
- Twenty chart-choice and method guides, with original arithmetic and source references.
- Five attributed UCI dataset resources: Iris, Wine, Glass Identification, Seeds and Abalone. Full headered CSVs, exact chart selections, source hashes, licenses and authors are available. Abalone's 300-row selection is explicitly deterministic and not representative sampling; the complete 4,177-row CSV is separate.

Search evidence and the full per-route inventory are in [research](EXPANSION-RESEARCH-2026-09.md) and [inventory](EXPANSION-INVENTORY.md).

## Validation

79 unit tests and 81 browser tests passed locally. Checks cover bin-boundary assignment, quartile conventions, fences and actual whiskers, regression coefficients, constant decimal variables, percentage denominators, stable Pareto sorting, exact CSV/JSON handoffs for every new example, UCI source row selections, actual SVG/PNG/PDF exports, CSV/Excel imports and responsive pages. Mobile chart title overlap found during visual inspection was corrected.

The static build checks every page's title, H1, description, canonical, JSON-LD and local resources. The expansion audit checks all new artifacts, sitemap inclusion, distinct editorial copy and the public source ZIP boundary. The maximum shared five-word-phrase check is a review heuristic, not a ranking metric. Short editorial text was reviewed with the working artifact, data and calculation rather than padded to a word target.

The build still reports a JavaScript chunk above 500 kB. Chart engines and spreadsheet/PDF modules load for interactive workflows; static examples, guides and data remain available without JavaScript. Tests do not establish Core Web Vitals field performance.

## Measurement

Plausible retains fixed route/tool/format events and strips query strings and hashes. Entered titles, values and filenames are not sent. New tools and resource routes are included in that bounded policy. Dataset CSV clicks currently are not a separate custom goal; maker downloads are measured through the existing Chart Download goal. Normal human-visitor ingestion and search outcomes require subsequent observation.

Sitemaps, canonical pages, crawlable text, visible calculations, attribution and truthful Article/Dataset/SoftwareApplication schema support discovery and interpretation. They do not guarantee indexing, rankings or AI citations. Follow Search Console impressions/indexing and useful-tool downloads, rather than treating page volume as authority.
