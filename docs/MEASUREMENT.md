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

Allowed tools: `dot-plot`, `radar-chart`, `line-graph`, `habit-tracker`. Allowed formats: `png`, `svg`, `pdf`, `csv`, `json`. Input contents, titles, labels, filenames, source notes and habit text are never event properties. Source-download and SupaMakers events count clicks, not confirmed completion on the destination. A chart download means generation succeeded and a download was initiated; browsers do not let us prove that a person saved or opened the file. Data Import does not prove a subsequent chart/export was valid under its chosen scale. Manual edits are not counted on every keystroke.

Analytics loads only on `chartsai.com` and `www.chartsai.com`, and is skipped for a URL with `?analytics=off`. Localhost and Vercel hostnames do not load Plausible. QA should use the opt-out except for a small explicit installation test recorded in the launch notes. Fixed paths and referrer origins are sent; query-based campaign attribution is intentionally not collected in this release. External AI referrers may appear where the browser supplies them; direct visits cannot be reliably assigned to AI.

`src/lib/analytics-policy.ts` restricts event properties and page paths. `src/components/Analytics.astro` connects browser events to the site-specific Plausible script. The privacy page describes this behavior. Plausible's [data policy](https://plausible.io/data-policy) explains its request processing and aggregate statistics.

## Dashboard setup and review

Create exact-match custom goals for the five named events above. Register `tool` and `format` as custom properties if available on the existing plan. Do not upgrade a plan silently. Pageviews are built in. Keep historical goals; do not reset the property.

Review weekly by landing page and traffic source:

- Visitors and successful download events; distinguish total events from unique converters.
- Download conversion by tool and format, using compatible visit/conversion definitions.
- Import-to-download behavior; do not call this a session funnel unless the analytics product actually provides one.
- SupaMakers visits, source downloads, and referring websites.
- Search Console indexation, impressions, clicks, queries and landing pages.
- Actual AI referrals and dated manual citation checks. These are partial observations, not a comprehensive GEO score.

Do not install a second analytics provider by default or send data from imports to analytics. Avoid arbitrary targets before the launch baseline exists. A lack of clicks immediately after launch is not a failed SEO experiment; indexing and sufficient exposure must be checked first.
