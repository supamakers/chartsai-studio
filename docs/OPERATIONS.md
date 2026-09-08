# ChartsAI operations

## Automated checks

`Quality checks` runs on every push to main and every pull request. It installs the locked dependencies, builds and audits the site, runs unit tests, and exercises Chromium imports/exports. Failures retain browser evidence for seven days. The workflow has read-only repository permissions and uses pinned official GitHub actions.

`Production health` runs after a successful Production deployment, every Tuesday at 06:17 UTC (11:47 India time), and on manual dispatch. It reads the canonical sitemap, checks previously published URLs, validates page canonicals and visible structure, downloads linked example/dataset assets, and checks robots, the source ZIP and the apex redirect. Reports are retained as GitHub Actions artifacts for thirty days and summarized in the run. It makes plain HTTP requests and does not generate analytics pageviews.

View runs at https://github.com/supamakers/chartsai-studio/actions. GitHub controls scheduling and user notification preferences; schedules are best-effort. The tests run alongside the connected Vercel deployment, not as a newly imposed branch-protection or deployment-approval rule.

Run locally:

```sh
npm run check:live
```

The production baseline is `docs/site-baseline.json`. When intentionally removing or redirecting a resource, review its search evidence and update this baseline deliberately. A successful public check does not mean that Google indexed the page or that real-user Core Web Vitals passed.

## Search performance review

Use the existing Search Console domain property for ChartsAI. Select Web search, an explicit date range and the Pages tab, then export its CSV. The local report groups makers and their examples into chart families, with separate guide, dataset, printable and legacy groups.

```sh
npm run report:search -- --current /path/to/Pages.csv --period 2026-09-08:2026-09-14
npm run report:search -- --current /path/to/Pages.csv --period 2026-09-15:2026-09-21 --previous /path/to/PreviousPages.csv --previous-period 2026-09-08:2026-09-14
```

Outputs live under ignored `artifacts/search-review/`. They include summed clicks/impressions and recomputed CTR, with optional equal-duration comparisons. Query exports, invalid counts, overlapping comparison periods and duplicate exact page URLs are rejected. Page-level totals may differ from property totals; do not substitute one for the other. Source queries, filenames and page identifiers are absent from generated summaries.

This report consumes an export; it does not have an authenticated Search Console API connection and is not scheduled to fetch private metrics. The automated weekly job above measures public site health only. Keep analytics exports out of the public repository and source ZIP.

## Analytics and AI observations

The existing Plausible Chart Download goal now also receives fixed `tool=public-dataset` and file format for public-data asset clicks. No new subscription, custom property or duplicate analytics provider is needed. Interpret these as initiated downloads, not verified reuse. The existing canonical landing page separates dataset resources in the dashboard. Do not fabricate a normal visitor to bypass bot filtering.

Review Google Web performance, Google Generative AI feature impressions, Plausible referrals and actual source citations separately. A manual citation record should contain the exact question, platform, date, cited URL and whether the page is linked or merely named. Search results containing a page are not automatically AI citations. Automated checks do not manufacture traffic or new search evidence.

## Current discovery follow-up

On September 8, Search Console initially showed “Couldn't fetch” while public checks returned valid XML. After resubmission, the index reported Success with 11 discovered pages. The directly submitted child sitemap then reported **Success with all 102 discovered pages**. These are sitemap discovery counts, not indexed-page counts. Histogram, scatter, box, bar and Pareto maker indexing requests each received an “Indexing requested” confirmation. Do not repeat requests to try to accelerate processing.

The historical Web baseline covers June 7–September 6, before this launch. Keep that period separate from the new product's results. Real-user Core Web Vitals currently have insufficient data for both mobile and desktop.

The first mobile PageSpeed lab run scored 84 performance, 96 accessibility, 100 best practices and 100 SEO, with 3.4 s LCP and zero layout shift. The release responds to its concrete findings: homepage previews are pre-rendered by native ECharts, so browsing preview styles does not download the chart engine, and workflow/footer text has stronger contrast. These changes do not establish a field-performance pass or guarantee a future lab score.

Historical baselines and any unprocessed requests should be recorded with date ranges and observation times. Continue development where a distinct, researched tool is ready, while using actual indexing and useful downloads to decide which existing clusters deserve improvement.

References: [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [GitHub workflow schedules](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule), [Plausible custom events](https://plausible.io/docs/custom-event-goals).
