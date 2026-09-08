# ChartsAI

Free dot plots, radar charts, line graphs and printable habit trackers, made by SupaMakers. Built with Astro, React, TypeScript and Apache ECharts. Data processing and exports run in the visitor's browser. No account, backend or model API is required. Production uses Plausible for aggregate visits and fixed tool events; chart inputs stay on-device.

## Run

Use Node.js 22.12+ or 24.x (Vercel uses 24.x; local checks also run on 22.22.2).

```sh
npm ci
npm run prepare:assets
npm run dev
```

Open http://127.0.0.1:4321. To prepare the public source archive and original sample downloads, run `npm run prepare:assets`. A production build runs this automatically.

```sh
npm test
npm run build
npm run test:e2e
npm run preview
```

The browser checks use Playwright Chromium. Install it once with `npx playwright install chromium`. Production HTML, CSS, JS, sitemap and public assets are written to `dist/`. Serve it with any static host that supports directory indexes and a custom `404.html`.

## What works

- Dot plot: up to 300 observations, repeated-value stacking, mean/median/range, frequency table, SVG/PNG/PDF and CSV downloads.
- Line graph: 2–300 points, 1–5 series, categorical/numeric/UTC date spacing, editable table, SVG/PNG/PDF/CSV and ECharts JSON downloads. Missing values and non-increasing numeric/date positions are rejected.
- Radar chart: 3–10 named dimensions, 1–5 series, explicit shared scale, direct table editing, SVG/PNG/PDF and CSV downloads.
- Import: paste or CSV/TSV/TXT/XLSX, sheet selection, row range, transpose, header and column selection, US/European number style. Missing or invalid scores block plotting. Files stay on-device.
- Habit tracker: weekly or calendar-correct monthly, up to eight habits, title, A4/US Letter landscape, ink-friendly header, PDF download. PDF uses a high-resolution rendering of the same SVG preview.

All nine preset datasets and fifty showcase datasets are original, fictional illustrations. They are not research or benchmark findings. Import limits are 8 MB per file, 2 MB of pasted text, 2,000 data rows and 100 columns; oversized inputs are rejected, not silently truncated. Currency symbols are formatting; percentages remain percentage points (12% → 12). Statistical calculations use ordinary JavaScript floating-point numbers.

## Chart engine and presentation

ECharts built-in scatter, radar and line series replace the original hand-drawn chart components. `src/lib/chart-options.ts` is the shared option builder; `src/lib/echarts.ts` registers only the chart types, components and SVG renderer needed. Static examples use ECharts SSR, and `EChartView` loads the interactive engine on the client. The ECharts engine is larger than a handwritten two-chart renderer; it is dynamically loaded, while initial example graphics are already in HTML. Excel and PDF modules load only when requested.

Three themes (Editorial, Blueprint, After hours), standard/presentation/square export sizes, subtitles and source notes are available in Design & details. Chart exports include PNG, vector SVG, raster PDF and reusable ECharts JSON. Changing sample values removes the fictional source note. Values and scores are unchanged by presentation settings. Native tooltips expose records; the dot frequency table and radar input table expose exact data without pointer interaction.

## Worked example library

`/examples/` contains 50 original worked examples across eight chart families. Each page includes an accessible data table, method and limitations, static SVG/PNG/CSV/ECharts JSON downloads and an exact editor handoff. Eight family hubs organize the collection. All resource pages render their main content without JavaScript. Gallery filters have no indexable URL variants.

Specifications live in `src/lib/showcase-specs.ts` and editorial text in `src/data/showcase.ts`. Run asset preparation before development or asset-dependent tests; production builds do this automatically. Generated `public/examples/assets/` files are omitted from Git and the source ZIP to keep the source small and reproducible. The September research and release criteria are documented in `docs/SHOWCASE-RESEARCH-2026-09-08.md`.

## Search and content architecture

The four working tool pages and two category hubs render their descriptions, sample graphics, instructions and FAQs in static HTML. The editors hydrate with React. The homepage demo opens the matching tool, example and visual theme. Titles, descriptions, canonical URLs, Organization/WebSite/WebPage/SoftwareApplication/BreadcrumbList structured data, social images, sitemap and robots directives are included. `/llms.txt` provides a concise optional discovery aid; it is not a ranking mechanism.

Preset query links load real examples and canonicalize to their parent tool. User-entered data is never put into URLs or generated SEO pages. `src/data/tools.ts` holds the chart page content. Add a page only when it supplies a distinct working tool or materially distinct useful resource. Avoid generating near-identical pages for every color, date or synonym.

Authorship, assumptions, method limitations, original datasets and an MIT source archive support verification and reuse. There are no fabricated reviews, customers, credentials or popularity claims. Search rankings and AI citations are outcomes to measure after publication, not guaranteed by this implementation.

## Launch

Live at **https://www.chartsai.com** since September 8, 2026. Vercel team `supamakers`, project `chartsai-studio`, Node 24.x, Astro static output. The apex domain redirects to www. Preview hosts carry `noindex`; production remains indexable. DashDashGo and AnimStats are separate sites.

The verified Search Console property has processed `/sitemap-index.xml`; the new line graph URL was submitted for indexing. This is discovery setup, not a claim that Google has indexed or ranked the new tools. See the [launch baseline](docs/LAUNCH-2026-09-08.md) and [measurement definitions](docs/MEASUREMENT.md).

The Vercel GitHub app is connected to `supamakers/chartsai-studio`. Pushes to `main` trigger production builds. Check the resulting Vercel deployment before treating a push as live. If a manual deployment is needed, use the authenticated CLI after relevant checks and source publication:

```sh
npx vercel link --yes --project chartsai-studio --scope supamakers
npx vercel --prod --yes --scope supamakers
```

Do not commit `.vercel/` or environment files. Preserve legacy deployment information for rollback. After deployment, verify live pages, redirects, headers and downloads.

Public source ZIP generation uses an explicit allowlist. Private research notes, `.seo-cache`, `.env`, `node_modules`, test artifacts and build outputs are excluded. Regenerate the archive whenever the source changes.

## License

Original code and sample datasets: MIT, copyright 2026 SupaMakers Limited. Dependencies retain their own licenses; DM Sans and Instrument Serif are distributed through Fontsource under their upstream font licenses. Exported user charts and trackers require no visible credit. Optional links to ChartsAI or SupaMakers are welcome.

## Product direction

See [AGENTS.md](AGENTS.md) for ongoing project instructions and [the expansion notes](docs/PRODUCT-DIRECTION.md) for the free-tool portfolio and Remocn/AnimStats assessment.

## Statistical tools and attributed data (v0.5.0)

Five additional native ECharts makers cover histograms, box plots, scatter plots, grouped/stacked/100% bars and Pareto charts. Raw observations are preserved. Bin boundaries, quartile conventions, regression coefficients and transformed percentages are exposed in calculated tables. New distribution/scatter inputs support up to 2,000 observations; bars/Pareto support 50 categories. The original dot/line/radar limits are unchanged.

Twenty `/guides/` resources provide original comparison and method explanations. Five `/datasets/` resources provide pinned UCI CSVs under CC BY 4.0, separate from MIT application code and fictional teaching data. Source authors, files, checksums and exact plotted row selections are recorded in `src/data/dataset-manifest.json`. Abalone's full 4,177-row CSV exceeds the editor limit; its chart uses an explicitly labelled deterministic 300-row subset. Normal builds do not fetch upstream data; `python scripts/fetch-datasets.py` is an intentional refresh operation that requires revalidation.

The September expansion produces 103 HTML pages including the noindex 404, and 102 sitemap URLs. Page count is an inventory, not evidence of indexing, authority or traffic. See `docs/EXPANSION-RESEARCH-2026-09.md` for observed search evidence.
