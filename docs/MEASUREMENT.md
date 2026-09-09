# ChartsAI measurement

Plausible property: https://plausible.io/chartsai.com. Website: https://www.chartsai.com. Use this existing property so the historical record remains intact. The old version and the free-tool release must be compared using the launch date, not treated as one unchanged product.

## What the events mean

| Event | Trigger | Properties |
| --- | --- | --- |
| Pageview | A production HTML page loads | Canonical page URL; no query or hash |
| Chart Download | Chart/CSV/config/printable generation succeeds and the browser download is triggered | `tool`, `format` |
| Data Import | The visitor accepts a validated import preview | `tool` |
| Example Loaded | The visitor clicks an example/reset control | `tool` |
| Source Download | The visitor clicks the source ZIP link | None |
| SupaMakers Visit | The visitor clicks a SupaMakers link | None |

Allowed tools: `dot-plot`, `radar-chart`, `line-graph`, `habit-tracker`, `histogram`, `box-plot`, `scatter-plot`, `bar-chart`, `pareto-chart`, and `public-dataset`. Allowed formats: `png`, `svg`, `pdf`, `csv`, `json`. Input contents, titles, labels, filenames, source notes and habit text are never event properties. Source-download and SupaMakers events count clicks, not confirmed completion on the destination. A chart download means generation succeeded and a download was initiated; browsers do not let us prove that a person saved or opened the file. Data Import does not prove a subsequent chart/export was valid under its chosen scale. Manual edits are not counted on every keystroke.

Analytics loads only on `chartsai.com` and `www.chartsai.com`, and is skipped for a URL with `?analytics=off`. Localhost and Vercel hostnames do not load Plausible. QA should use the opt-out except for a small explicit installation test recorded in the launch notes. Fixed paths and referrer origins are sent; query-based campaign attribution is intentionally not collected in this release. External AI referrers may appear where the browser supplies them; direct visits cannot be reliably assigned to AI.

`src/lib/analytics-policy.ts` restricts event properties and page paths. `src/components/Analytics.astro` connects browser events to the site-specific Plausible script. The privacy page describes this behavior. Plausible's [data policy](https://plausible.io/data-policy) explains its request processing and aggregate statistics.

## Dashboard setup and review

On September 8, 2026, all five exact-match custom goals and both `tool` and `format` custom properties were created and saved in the existing Plausible property. Do not upgrade a plan silently. Pageviews are built in. Keep historical goals; do not reset the property.

Review weekly by landing page and traffic source:

- Visitors and successful download events; distinguish total events from unique converters.
- Download conversion by tool and format, using compatible visit/conversion definitions.
- Import-to-download behavior; do not call this a session funnel unless the analytics product actually provides one.
- SupaMakers visits, source downloads, and referring websites.
- Search Console indexation, impressions, clicks, queries and landing pages. This property also exposes a Generative AI features beta report with impressions; record these separately and do not reinterpret them as clicks or citations.
- Actual AI referrals and dated manual citation checks. These are partial observations, not a comprehensive GEO score.

Do not install a second analytics provider by default or send data from imports to analytics. Avoid arbitrary targets before the launch baseline exists. A lack of clicks immediately after launch is not a failed SEO experiment; indexing and sufficient exposure must be checked first.

## Showcase library — September 8, 2026

The 20 example details, three family hubs and library index have fixed analytics route identifiers. Static SVG/PNG/CSV/JSON download clicks reuse Chart Download with only the tool and format. A click is not proof of a completed save or reuse. Query state, search text and chart values are excluded. Compare example landing-page visits and download clicks separately from maker use. Normal-visitor ingestion remains unverified as recorded in the launch log.

## v0.5.1 operational follow-up

Public dataset CSV, chart image/config and provenance download clicks reuse Chart Download with only `tool=public-dataset` and a whitelisted format. Dataset names are not event properties; the canonical page identifies the landing resource. All 102 current page paths are bounded. See [operations](OPERATIONS.md) for the automated public-health checks and private local Search Console export reports.

## Worksheet build phase — September 8, 2026

Continue useful releases while discovery data accumulate, per the user's direction. The worksheet page and `number-line-worksheets` tool identifier join the fixed allowlist. Existing math identifiers are `coordinate-plane`, `number-line`, `slope`, `transformation`, and `quadratic`. Worksheet downloads emit Chart Download with PDF/CSV format; fresh sets emit Example Loaded. No seed, question, learner name or answer is transmitted. These events indicate an action, not learning outcomes. No traffic threshold gates the worksheet release.

## Editorial release — September 9, 2026

Four additional custom goals were configured and verified in Plausible: Import Started, Chart Edited, Project Loaded and AnimCharts Visit. Existing Data Import, Chart Download, Example Loaded, Source Download and SupaMakers Visit remain. Import starts are recorded after choosing a file or opening paste; successful mapping emits Data Import. Design changes emit Chart Edited on blur, annotation additions and explicit raw-table applies have bounded control identifiers. Project Loaded indicates successful validation and restoration. AnimCharts Visit measures a clicked handoff link, not animation creation.

All four breakdown properties were verified configured in Plausible. Breakdowns use fixed `tool`, `format`, `method` (file/paste) and `control` (design/annotation/apply). Canonical page paths identify the new makers and source resources. No private table, title, filename, source URL, note or raw query state is sent. Browser tests intercept production-host analytics to verify this policy without injecting fabricated visitor usage into the dashboard. Goal configuration and event-emission tests do not establish real visitor adoption or end-to-end normal-visitor ingestion.

Read imports, edits, downloads and SupaMakers visits by landing page as discovery accumulates. Source-backed content, extractable methods, accessible values and canonical links support SEO/AEO/GEO; they do not prove indexing, citations or earned authority. Keep shipping useful resources during this measurement period.

## Editorial templates — September 9, 2026

Template Selected records a clicked “Use this chart” link or an explicit maker dropdown selection. The fixed `template` property also joins Chart Download for template assets and exports following data replacement in the same maker session. Use tool/template/format breakdowns to compare selection and use; retain the existing distinctions between clicks, file preparation and actual publication. Query hydration does not count an additional selection. Restoring a saved project clears session lineage. See EDITORIAL-TEMPLATES-2026-09-09.md for exact boundaries and search evidence.


## Visual guide release — September 9, 2026

Six allowlisted guide IDs now accompany `Chart Download` (SVG/PNG/CSV) and `Example Loaded` (explicit supported-editor handoff) with `tool=guide-comparison`. Plausible's `guide` custom property was configured and verified in its settings. Query loading itself does not emit a guide selection. The guide property describes a public resource, never pasted content; there is no cross-session attribution promise. Iris species downloads use the existing public-dataset tool identifier.

A controlled production template journey reached the real Plausible endpoint with bounded import and template-attributed download payloads. Responses returned HTTP 202 with `x-plausible-dropped: 1`; the test traffic was excluded by Plausible bot filtering, so this is not verified dashboard ingestion or adoption. Its detailed evidence and timestamps remain in ignored `artifacts/release-0.13/`. The site IP block list had no entries. Automated browser visits are normally excluded by Plausible itself, so mock interception tests prove wiring, not ingestion. Any explicitly opted-in QA events must be reported as tests, not adoption.

Plausible documents the dropped-event header in its [Events API reference](https://plausible.io/docs/events-api). Keep automatic filtering intact; a normal unfiltered visitor is needed to confirm the dashboard end of this flow. No artificial visitor IP or analytics proxy was introduced.
