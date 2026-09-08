# ChartsAI: project instructions

This is the canonical guide for agents working in this project. Read it before making changes. The user's current instructions take precedence. Update this guide when a product decision actually changes; do not turn proposals into approved commitments.

## Purpose and product direction

Build excellent free chart tools and printable resources that people can discover through search, use immediately, and confidently share. The intended return is useful adoption, earned links, reputation, and authority for ChartsAI and its maker, SupaMakers. Paid conversion is not the present objective.

- Acquisition must begin with demonstrated search demand and an achievable result format. Do not depend on social buzz, outbound sales, or the founder having a ready-made audience.
- Make the downloadable result and the editing experience convincing. Show real outputs on landing pages, offer useful defaults, and deliver the artifact promised by the search query.
- Do not constrain opportunities to industries currently featured on SupaMakers.
- Do not reintroduce a generic AI chat interface, MCP proposition, account requirement, payment gate, or model API dependency without a new product decision.
- There is no obligation to preserve old engineering. Prefer proven chart libraries over building chart geometry from scratch.
- The broader aim is many valuable free tools earning SEO/AEO/GEO discovery and SupaMakers authority. Consider Remocn for AnimStats animated outputs only after search, export and licensing validation; see `docs/PRODUCT-DIRECTION.md`. Keep ChartsAI as the initial site. DashDashGo remains a separate future decision; do not split effort or cross-publish duplicate pages.

## Current scope and evidence

The live v0.5 library includes eight chart makers, 50 fictional worked examples, 20 method/comparison guides, five attributed UCI datasets, and the weekly/monthly printable habit tracker. There are 102 sitemap URLs including hubs and supporting pages. See `docs/EXPANSION-RESEARCH-2026-09.md` and `docs/EXPANSION-INVENTORY.md`. Additional printable families, Power BI/Tableau kits and AnimStats video tools remain research candidates rather than promised implementations.

Local research, when available:

- `SEO-RESEARCH-2026-09-07.md`: initial opportunity assessment and SERP evidence.
- `FOLLOWUP-2026-09-08.md`: Power BI/Tableau, import requirements, and printables.
- `keyword-shortlist.csv`: keyword screening evidence.
- `../danny_seo/`: the user's course knowledgebase. Consult the relevant research/content/authority material for strategic work; never copy course content into public deliverables.
- `../samvat.in` and `../lasereyesmeme`: implementation references, not proof of independently verified traffic results.

These research documents contain historical proposals. The current implemented scope above and newer user decisions supersede those proposals. Research files may be absent from a public checkout; do not invent their contents.

September 2026 Ahrefs evidence favored specific chart tools and habit tracker printables over a general chart library or AI chart generator. It included a ranking-data disruption warning. Volume, KD, DR, and modeled competitor traffic are directional estimates, not forecasts. Refresh consequential evidence before expanding. Do not add overlapping keyword volumes together as obtainable traffic.

Power BI/Tableau demand does not validate a generic screenshot gallery. A future resource must satisfy native intent with a working, tested report/template/theme, appropriate data, and clear replacement instructions.

## SEO and programmatic SEO requirements

Before adding an indexable page family, record its target query, country/date/source, actual SERP intent, competing result formats, distinct user value, and how the result will be validated. Low KD alone is insufficient.

- One primary URL per intent. Treat radar/spider and maker/generator synonyms together unless actual SERPs justify separation.
- Scale pages only where the underlying tool, data, template, or explanation is materially different. Do not generate pages for every color, paper size, year, or keyword permutation.
- Ship the functioning resource with the page. Avoid placeholder tools, duplicate introductions, thin galleries, and unverified datasets.
- Preserve static HTML for the main answer, headings, instructions, examples, assumptions, and internal links. Editors may hydrate with React.
- Keep unique titles, descriptions, one meaningful H1, correct canonicals, crawlable links, accurate structured data, sitemap membership, and appropriate robots directives.
- Canonicalize example/theme query states to their parent tool. Never create indexed pages or URLs containing user-entered data.
- Link hubs to tools and relevant explanatory resources naturally. Avoid sitewide keyword-heavy links or forced attribution on user exports.
- Check mobile usability, keyboard access, export quality, and loading behavior. Do not claim a Core Web Vitals pass from a successful build.
- Review legacy URLs and their evidence before production redirects. Do not blanket-redirect unrelated URLs to the homepage.

## AEO and GEO requirements

AEO here means making useful answers easy to understand and extract. GEO means making our resources discoverable and verifiable when AI search systems select sources. Neither is a guaranteed distribution channel or a substitute for a good product.

For each tool/resource, provide:

1. A concise, visible answer explaining what it does and when to use it.
2. Exact input requirements, supported formats, export options, and meaningful limits.
3. Clear steps and at least one working example with understandable labels and units.
4. Methodology, assumptions, and limitations close to the relevant explanation.
5. Original downloadable examples or appropriately licensed, attributed external data. Clearly label fictional examples; never present them as benchmarks or findings.
6. Specific questions users encounter, answered directly without repetitive filler.
7. Consistent ChartsAI/SupaMakers identity and truthful authorship. Cite primary sources for external factual claims. Only advance review dates after a real review or change.

Keep important information in text, not only in chart pixels, canvas, hover states, or downloadable PDFs. Expose underlying values accessibly. Structured data must match the visible page; never invent reviews, ratings, expertise, customers, or awards. Do not add schema solely because it sounds relevant to AI.

`public/llms.txt` is an optional descriptive discovery file, not a ranking factor or a prerequisite for AI citations. Keep it accurate without prioritizing it over the pages themselves. Google explicitly says its AI search features require no special AI files or special schema: https://developers.google.com/search/docs/appearance/ai-features

Check actual production crawler access, including host/CDN rules and response headers. A permissive source `robots.txt` does not prove a live bot can reach the site. Distinguish search discovery controls from model-training preferences; verify current official crawler documentation before changing bot rules.

## Authority and measurement

Earn attention through reusable tools, excellent exports, original examples, transparent calculations, public source, and useful technical explanations. Use honest “made by SupaMakers” attribution and a relevant link. Never fabricate testimonials, usage counts, benchmark results, or citations. GitHub publication alone is not an authority or ranking guarantee.

After launch, establish a dated baseline and review:

- Search Console/Bing indexing, impressions, clicks, and queries by landing page.
- Successful tool use and downloads, if privacy-appropriate measurement is intentionally added.
- Referring domains, useful resource citations, branded searches, and relevant SupaMakers visits.
- Observable AI referrals and a small repeatable set of manual citation checks, recording prompt, platform, date, and cited URL. Mentions, links, visits, and conversions are different measurements.

This property has a Search Console “Generative AI features” beta report, observed on September 8, 2026. Record its impressions separately from ordinary Web search metrics; impressions are not clicks, citations, visits, or complete GEO attribution. Check the actual available report and date range rather than assuming all properties expose the same metrics. Manual AI checks vary and are not a comprehensive visibility score. Use evidence to improve existing pages before multiplying them. Do not promise rankings, traffic, backlinks, or consulting leads.

## Engineering and data integrity

- Stack: Astro static output, React, TypeScript, Apache ECharts. Inspect `package.json` and lockfile for exact versions.
- The original ChartsAI also used ECharts. This rebuild uses ECharts built-in scatter/radar/line/bar/boxplot series with SVG rendering. Lieflat Charts is inspiration only; its code is not integrated. Check licenses before copying any external implementation.
- Share chart options between preview and export. Do not replace native axes/geometry with a separate hand-drawn engine. A custom printable SVG grid is appropriate.
- Keep the initial sample visible in static HTML. Load interactive charts, spreadsheet parsing, and PDF generation only where needed.
- Default flows run locally in the visitor's browser. No backend, account or model API is required. The user authorized Plausible analytics and production deployment on 2026-09-08; keep analytics events limited to fixed identifiers and never transmit entered data. Do not silently introduce data transmission or invalidate privacy claims.
- Support practical paste/file imports with previews, sheet/column/row selection, transpose, and explicit numeric conventions. Users should not need our internal data format.
- Never silently drop invalid rows, replace missing values with zero, remove outliers, normalize scores, or choose an aggregation. Show ambiguity and preserve user control.
- Preserve current explicit size/row/series limits unless intentionally changed and tested. Radar dimensions use a declared common scale; polygon area is not a composite score.
- Teaching presets are fictional; the separate UCI collection is attributed CC BY 4.0 public data. Remove a fictional sample source note when the visitor replaces its data; preserve a source note they entered themselves.
- Keep preview and downloaded values consistent. Verify SVG escaping, PNG dimensions, PDF paper sizes, printable calendar dates, and keyboard-accessible controls when touching those features.

## File map and checks

- `src/lib/showcase-specs.ts`: whitelist of 20 complete chart specifications and shared table serialization; `src/data/showcase.ts`: original editorial copy and collection definitions.
- `src/pages/examples/`, `src/components/ExampleCards.astro`, `src/styles/examples.css`: static gallery, family hubs and example resources. Generated `public/examples/assets/` files are excluded from Git/source ZIP and rebuilt by asset preparation.
- `src/pages/`: static routes and tool pages; `src/data/tools.ts`: chart page copy.
- `src/layouts/Layout.astro`: shared metadata, navigation, identity, and structured data.
- `src/lib/chart-options.ts`, `src/lib/echarts.ts`: shared native ECharts configuration/rendering.
- `src/components/EChartView.tsx`: SSR placeholder and interactive chart lifecycle.
- `src/components/DotEditor.tsx`, `RadarEditor.tsx`, `ChartControls.tsx`: editing and presentation.
- `src/lib/data.ts`, `src/components/ImportData.tsx`: parsing, mapping, and import validation.
- `src/lib/chart-export.ts`, `src/lib/export.ts`: chart downloads.
- `src/lib/tracker.ts`, tracker components: printable calendar/layout and export.
- `public/robots.txt`, `public/llms.txt`, `astro.config.mjs`: discovery and canonical site configuration.
- `scripts/prepare-assets.mjs`: sample files, social graphic, and allowlisted public source ZIP.
- `scripts/check-build.mjs`: static page/metadata/schema/resource checks.

Use Node 22.12+ or 24.x and `npm ci`. Commands:

```sh
npm run dev
npm test
npm run build
npm run test:e2e
npm run preview
```

Install Playwright Chromium if needed with `npx playwright install chromium`. Run relevant checks for the change. For chart/import/export changes, exercise actual user flows and inspect exported artifacts; for route/content changes, run the build checks. Documentation-only changes normally need only link/path/content checks. Report limitations honestly, including bundle warnings; do not equate tests with live search performance.

## Workspace, source publication, and launch

On 2026-09-08, this project was initialized in `/Users/indievish/work/chartsai_dashdashgo` and published to https://github.com/supamakers/chartsai-studio using `indievish`. The public repository's `main` branch tracks `origin/main`; the SSH remote is `git@github.com:supamakers/chartsai-studio.git`. Inspect current status before version-control work. Keep the original sibling projects intact. Repository publication does not deploy the website.

Repository name: `chartsai-studio`, under the `supamakers` GitHub organization. The user authorized creating and initializing this repository using `indievish` on 2026-09-08. Public application source fits the free-tool/authority objective. Keep local course materials, research caches, credentials, and private notes out of public publishing. The source ZIP uses an explicit allowlist; `.gitignore` separately excludes the local research Markdown files, keyword CSV, and generated download archives. Review what will actually be committed before publishing. Do not broaden the ZIP to include the whole workspace.

Production went live at `https://www.chartsai.com` on September 8, 2026 in Vercel team `supamakers`, project `chartsai-studio`. Both ChartsAI domains were moved from the older `chartsai` project; the old deployment remains available for rollback. Production headers and actual exports were verified, and Vercel preview hostnames return `X-Robots-Tag: noindex`. The sitemap was processed by Search Console and the line graph URL was queued for indexing. See `docs/LAUNCH-2026-09-08.md` for the baseline and measurement limitations. On September 8, 2026, the user authorized adding `chartsai-studio` to the existing Vercel GitHub app installation. The repository is now connected to the Vercel project; pushes to `main` should trigger production deployment. Verify the resulting deployment before claiming a change is live. Authenticated CLI deployment remains available as a fallback.

Complete authorized local work autonomously. Publishing a repository, pushing, deploying, or sending outreach must follow the user's actual authorization; do not infer these actions from a request for advice about them, and do not ask again when already authorized. Never claim publication without checking its result.

Launch requires checking the production URLs, canonical/redirect behavior, sitemap, search verification, crawler access, and actual downloads. Update this guide's dated status when these steps have really happened.

## Statistical resource expansion — September 8, 2026

`src/lib/statistics.ts` owns the five additional chart calculations and shared native ECharts options. `stat-presets.ts` contains 30 fictional specifications; `src/data/stat-examples.ts` contains their distinct worked interpretations. `StatEditor.tsx` accepts only whitelisted example or dataset query IDs. Dataset source notes are cleared when replacing the loaded data, just as fictional notes are.

Twenty guides live in `src/data/guides.json`. Five attributed UCI resources use `datasets.ts` and `dataset-manifest.json`; pinned full/chart CSVs are public. Refreshing them is explicit via `scripts/fetch-datasets.py`, followed by row-selection, checksum, numerical and license review. Do not treat Abalone's 300-row deterministic chart subset as random or representative. The full CSV retains 4,177 source rows. Keep imported dataset licenses separate from MIT source.

Generated chart images/configurations are rebuilt during asset preparation and excluded from Git and the source ZIP; pinned CSVs and provenance source metadata are included. `tests/statistics.test.ts` and `tests/browser/statistics.spec.ts` cover calculations, exact handoffs, source selections and actual downloads. `scripts/check-expansion.ts` records resource and editorial quality checks. Expansion targets 103 HTML / 102 indexable routes; counts are not a claim of search performance.

The v0.5.0 expansion was verified live on September 8 at 09:42 UTC from code commit `90c8f63`, deployment `dpl_5MAgPeHqthPE1JMkySYR6Sk5vbGi`. All 102 sitemap pages, 150 new linked assets, canonical redirects, crawler files, source ZIP and actual live PDF/CSV exports passed checks. See `docs/EXPANSION-RELEASE-2026-09-08.md`. Search visibility and normal-visitor analytics ingestion remain subsequent measurements.

## Operations follow-up

Version 0.5.1 adds bounded public-dataset download events, GitHub CI and a weekly public production-health check. `docs/OPERATIONS.md` describes schedules, report semantics and the private local Search Console export reporter. Do not confuse the scheduled public checker with authenticated analytics collection. Private search/analytics exports remain in ignored artifacts. Search Console initially showed a sitemap fetch error during the September 8 follow-up; after resubmission the child sitemap reported Success with all 102 discovered pages. Discovery and acknowledged indexing requests are not indexed-page counts. Homepage style previews now use generated native ECharts SVG files; interactive editors still load ECharts. Keep the engine off the homepage and retain the exact example/style handoff.


## Consistent chart journeys — v0.6.0

All eight chart makers use the same Upload a file / Paste data → select and check columns → preview → download journey. `ChartJourney.tsx` shares the entry controls, sample/data badge, preview heading and download step; `chart-journey.ts` defines chart-specific input guidance and limits. `dot-journey.css` is the shared stylesheet (its historical name is retained).

`ImportData.tsx` maps one numeric column for dot plots/histograms, explicit X/Y columns for scatter, optional groups plus a value column for box plots, categories and measures for bar/Pareto, and labels/dimensions with selected series for line/radar. Radar imports require an explicit common scale; line imports expose horizontal spacing and use the selected number convention for numeric X and Y. Do not manufacture totals for repeated categories or normalize radar scores. A no-group box plot uses one clearly labelled group while retaining every input value.

Require confirmation and validate the complete selection before replacing the current chart. Import failures stay in the dialog, cancellations preserve the chart, successful imports focus the preview, and cancellation restores focus to the initiating control. Only remove unchanged sample/dataset attribution; preserve user-edited titles and source notes. Keep row range, sheet, header, transpose and number-format controls accessible. Raw statistical-table drafts require Apply data; downloads remain disabled while unapplied edits differ from the plotted data. Optional raw editing and design settings are initially collapsed so upload/paste remain prominent on phones.

`tests/browser/all-journeys.spec.ts` covers actual file uploads, explicit mappings and exact CSVs for all eight makers, plus grouped/ungrouped box plots, X/Y pairing, category errors, radar scales and European numeric X/Y. The existing dot, statistics, line, export, example and analytics tests remain required regression checks. This release changes usability, not the number of indexable pages or the statistical definitions.

## Coordinate plane pilot — v0.7.0

The September 8 educational pilot adds `/coordinate-plane-generator/`, bringing the build to 104 HTML pages / 103 sitemap URLs. The original eight statistical chart makers remain unchanged. Search screening and adjacent candidates are recorded in `docs/EDUCATION-RESEARCH-2026-09-08.md`. Number lines, slope, transformations and quadratic tools remain research candidates.

`src/lib/coordinate-plane.ts` owns point parsing, range validation, equal-unit geometry and SVG diagram/worksheet rendering. Custom SVG coordinate grids are intentional, as with the printable tracker. `CoordinateEditor.tsx` offers blank, diagram, plotting and reading modes, plus a separate PDF answer key. Points are local, max 12, labels unique, coordinates −50 to 50; fractions convert to numeric values. The X/Y unit scale must remain equal. Downloads stop for invalid settings; no out-of-range point is dropped. Screen answers and PDF question-page visibility are separate. PDFs are high-resolution raster pages; SVG graph downloads are vector. The same renderer creates ready-made static PDFs at build time.

Generated `public/coordinate/assets/` files stay out of Git and the source ZIP and are rebuilt. `tests/coordinate-plane.test.ts` and `tests/browser/coordinate.spec.ts` check the mathematical and export behavior. The bounded analytics allowlist includes the new tool and only fixed public assets.

The repository skill `.agents/skills/chartsai-chart-quality/SKILL.md` is an experimental internal workflow, not a marketed skill launch. Its source-projection checker has deterministic failure fixtures and is included in `npm test`. Apply it for chart/coordinate revisions; read its projection contract before using the checker. Do not claim model improvement without the documented baseline/skill-assisted evaluation. Publishing source does not establish skill search demand or a benchmark win.

## Educational suite — v0.8.0

The user approved the four remaining educational tools after the coordinate-plane pilot. `/number-line-generator/`, `/slope-calculator/`, `/geometry-transformation-calculator/` and `/quadratic-graph-calculator/` join it under `/math-tools/`. The build contains 109 HTML / 108 sitemap URLs. See `docs/EDUCATION-EXPANSION-2026-09-08.md` for intent, dated estimates, competition and limitations. This supersedes the pilot's “research candidates” status for these four tools only.

`src/lib/math-tools.ts` owns calculations, native ECharts algebra options, SVG number lines/polygon-grid overlays and shared worksheet composition. `MathEditor.tsx` owns the common explore/practise/download journey. `src/data/math-pages.ts` contains distinct original explanations; `MathToolPage.astro` supplies static accessible content, examples and accurate schema. Custom number lines and transformations reuse the printable geometry exception; statistical and algebra chart axes remain native ECharts. Do not make a second graph engine for exports.

Preserve signed slope differences, undefined vertical slopes and errors for repeated source points. Transformations use 3–6 distinct perimeter vertices, reject degenerate/self-intersecting polygons and never drop off-grid images. Equal physical units apply to slope/geometry; quadratic graphs intentionally use independent X/Y scales, disclosed in the UI. The quadratic tool accepts bounded coefficients and computes numerical real roots; no free-form expression evaluation or symbolic/complex-root promise. Number lines retain repeated values and require every endpoint/jump to fit.

Practice mode and PDF answer visibility are separate. SVG/PNG match screen visibility; CSV includes underlying/calculated answers and is labelled accordingly. Static and interactive PDFs share the same renderer. Math asset filenames and analytics are allowlisted; custom values stay local. No indexed query-state permutations.

The chart-quality skill now has seven frozen original evaluation tasks. These are prompts/fixtures, not generated baseline outputs. No fresh-context LLM comparison has been run, so the skill remains experimental. Do not claim benchmark improvement or create a promotional skill page based on passing application tests.

## Number-line worksheet expansion — v0.9.0

The user explicitly chose continued building while discovery and usage measurements mature. Keep privacy-preserving measurement in place; do not pause useful bounded releases waiting for traffic.

`/number-line-worksheets/` is one substantive multi-question resource, distinct from the custom single-diagram generator. `src/lib/number-line-worksheets.ts` owns deterministic sets, question models and page layout; it calls the existing `numberLineSvg` with compact rendering and endpoint-only labels for reading tasks. Keep preview and both static and browser PDF exports on this same path. All question pages precede all answer pages. There are 6/9/12 exercises, three per sheet, with integers, fractions and unit-jump operations. Fraction windows span two units within 0–5; fraction step choices are 1/2, 1/4, 1/5 and 1/10. Reading and plotting tasks differ intentionally in available labels. No grading or curriculum certification is claimed.

Three original six-question packs are generated under `public/worksheets/assets/` and excluded from Git and the source ZIP. They include four-page A4/Letter PDFs, a first-page SVG and questions/answers CSV. Query presets stay canonical to the worksheet page. Do not multiply indexed pages by seed, denominator, count or paper size. Research and search-data limitations are recorded in `docs/NUMBER-LINE-WORKSHEETS-RESEARCH-2026-09-08.md`. Expected site totals: 110 HTML / 109 sitemap routes. Verify production before claiming this release is live.

## Homepage expansion — v0.10.0

The user selected the Printed Resource Library design for the homepage on September 9, 2026. Its three primary paths are charts, math tools and printables. `src/styles/home.css` scopes the blue/pink paper identity to `body.home-page`; preserve the existing tool workbenches and their shared mobile navigation. `src/components/HomeFigures.astro` renders native ECharts and shared number-line examples at build time using `src/lib/home-figures.ts`. No chart engine is loaded in the homepage browser. The lower interactive style preview retains the exact example/style handoff.

The static homepage directly lists all 15 tool/builders (eight chart makers, five math tools and two printable builders) and links examples, guides, datasets, methods and source. Its ItemList reflects those visible links. Existing 110 HTML / 109 sitemap route totals remain unchanged. Tests cover full sample retention, row-to-series mapping, equal slope-axis units, no-JavaScript entry paths and keyboard/reduced-motion feedback. Local design decisions, mockups and review evidence stay out of deployment and the public source archive. See PRODUCT.md and DESIGN.md for durable product and homepage design context.
