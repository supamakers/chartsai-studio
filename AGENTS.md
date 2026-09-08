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

The implemented initial scope is a dot plot maker, radar/spider chart maker, line graph maker, and weekly/monthly printable habit tracker. Each has a working editor and downloads. Version 0.4.0 adds 20 worked chart examples at `/examples/[slug]/`, three family hubs and `/examples/`. Each has original fictional data, exact editor state, static downloads and visible explanations. See `docs/SHOWCASE-RESEARCH-2026-09-08.md` for country/date/query evidence and exploratory topics. Relationship charts, other printable families, and Power BI/Tableau resources are candidates, not committed work.

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
- The original ChartsAI also used ECharts. This rebuild uses ECharts built-in scatter/radar/line series with SVG rendering. Lieflat Charts is inspiration only; its code is not integrated. Check licenses before copying any external implementation.
- Share chart options between preview and export. Do not replace native axes/geometry with a separate hand-drawn engine. A custom printable SVG grid is appropriate.
- Keep the initial sample visible in static HTML. Load interactive charts, spreadsheet parsing, and PDF generation only where needed.
- Default flows run locally in the visitor's browser. No backend, account or model API is required. The user authorized Plausible analytics and production deployment on 2026-09-08; keep analytics events limited to fixed identifiers and never transmit entered data. Do not silently introduce data transmission or invalidate privacy claims.
- Support practical paste/file imports with previews, sheet/column/row selection, transpose, and explicit numeric conventions. Users should not need our internal data format.
- Never silently drop invalid rows, replace missing values with zero, remove outliers, normalize scores, or choose an aggregation. Show ambiguity and preserve user control.
- Preserve current explicit size/row/series limits unless intentionally changed and tested. Radar dimensions use a declared common scale; polygon area is not a composite score.
- Sample datasets are fictional. Remove a fictional sample source note when the visitor replaces its data; preserve a source note they entered themselves.
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
