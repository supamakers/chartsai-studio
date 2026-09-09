# ChartsAI production SEO, AEO, GEO and pSEO audit

Audited September 9, 2026 against https://www.chartsai.com, release v0.12.1 (`ff17cf6`). Read-only production audit; no application changes or deployment. Strategy follows the shared SupaMakers vision and Danny's research, content and authority principles: match the searcher's task, demonstrate distinct value, connect related resources, and create assets worth citing. Course material is not reproduced here.

## Decision

The technical foundation is healthy and the programmatic library contains real resources. The next release should improve trust-page accuracy, navigation and mobile delivery, then turn six existing guides into convincing visual demonstrations. Continue building while search reporting catches up. Increasing URL count alone is not the next objective.

This audit separates implementation readiness from results. Current indexing coverage, post-relaunch organic performance, real-user Core Web Vitals and actual AI citation coverage remain unestablished. No composite SEO/GEO score or traffic forecast is assigned.

## Scope and evidence

- Crawled all 119 sitemap pages and checked all 367 unique linked internal assets. Examined 21 query-route combinations sampled from 85 linked query URLs, host/slash behavior and legacy URLs.
- Reviewed all 50 worked examples, 20 guides, five dataset resources and three editorial collections through extracted live content, with close reading of representative makers, mathematical tools and printables.
- Ran three fresh mobile Lighthouse tests with analytics disabled. Inspected live crawler policy and alternate-user-agent responses.
- Read authenticated Search Console indexing, sitemap, Web and property-specific Generative AI reports; ran Google's live homepage inspection. Checked Plausible goals and the seven-day dashboard.
- Used dated September 8–9 Ahrefs research already recorded in the repository. No fresh keyword-volume extraction was performed in this audit. These estimates include a ranking-data warning and are not ranking forecasts.
- Did not repeat every browser import/export journey, perform a comprehensive backlink audit, or obtain ChatGPT/Perplexity citation experiments. HTTP asset access does not verify visual correctness.

Raw evidence and private dashboard observations are retained in ignored `artifacts/seo-audit-2026-09-09/`. Specialist reports are in its `technical/`, `content/` and `geo-performance/` subdirectories.

## Findings

| Area | What works | What needs attention |
|---|---|---|
| Technical SEO | 119/119 pages return 200; unique titles, descriptions and H1s; correct canonicals; no index blocking; every page within two clicks; 367/367 assets accessible | Search's stored relaunch/canonical state is behind live production; review a few legacy legal URLs |
| AEO | Static direct answers, input limits, steps, values, assumptions and source links | Several visual-comparison guides do not show the promised comparison; some formula citations are broad background |
| GEO | Accessible text/data, primary-source provenance, coherent maker identity and permissive crawler policy | About/Source contradict newer scope; independent recognition and actual citations unverified |
| pSEO | Distinct worked data and interpretations; useful downloads; three substantial collections rather than twelve indexed template permutations | Improve existing demonstrations and contextual links before adding further guide pages |
| Mobile performance | Zero CLS in three sampled lab runs; homepage and collection load reasonably | Dot-maker lab LCP 3.71 seconds; shared texture weight and blocking CSS/fonts deserve investigation |

### 1. Trust pages lag the product

[Source](https://www.chartsai.com/source/) still says v0.9.0 and eight editors. The current release has eleven chart makers, publication projects and additional sourced resources. [About](https://www.chartsai.com/about/) describes examples universally as original/fictional and explains only older methods.

Update both together: current inventory/version, actual rendering and review responsibilities, and separate license scopes for original examples, CC0 fictional template data, UCI/World Bank material and NASA attribution. Advance dates only after reviewing the content. Avoid invented expertise or reviewer credentials. The top-level current-scope paragraph of `AGENTS.md` also lags its later release entries; reconcile that during the same maintenance pass.

### 2. Guides need the actual visual answer

All 20 guide pages contain one borrowed example image. This is not automatically thin content, but it leaves specific search tasks incompletely answered:

| Existing URL | Required improvement |
|---|---|
| [/guides/box-plot-vs-histogram/](https://www.chartsai.com/guides/box-plot-vs-histogram/) | Plot the same observations both ways; explain the shape information lost in the summary |
| [/guides/dot-plot-vs-histogram/](https://www.chartsai.com/guides/dot-plot-vs-histogram/) | Show exact repeated values alongside their grouped frequencies |
| [/guides/histogram-bin-width/](https://www.chartsai.com/guides/histogram-bin-width/) | Display both bin-width settings already discussed numerically |
| [/guides/truncated-y-axis/](https://www.chartsai.com/guides/truncated-y-axis/) | Compare the stated 90/100 values at zero and truncated baselines, with the misleading version clearly identified as a teaching demonstration |
| [/guides/logarithmic-scale-graph/](https://www.chartsai.com/guides/logarithmic-scale-graph/) | Replace the unrelated linear scatter illustration with an actual linear/log comparison; explain positive-input restrictions and equal-ratio spacing |
| [/guides/pie-chart-vs-bar-graph/](https://www.chartsai.com/guides/pie-chart-vs-bar-graph/) | Show an actual pie and bar comparison of the same parts and total |

Use native ECharts illustrations, exact accessible tables, original explanations and downloadable comparison graphics/CSV. Offer exact editor handoffs where supported. Static log/pie teaching visuals need not imply that the interactive makers support those modes. Keep the existing URLs; do not add synonym pages or pad word counts.

Historical Ahrefs US estimates in [expansion research](EXPANSION-RESEARCH-2026-09.md) include box plot versus histogram 150/month, dot plot versus histogram 80, logarithmic scale graph 150, pie versus bar 80, truncated Y axis 50 and histogram bin width 40. These justify relevant task coverage, not a large acquisition forecast. Refresh SERPs before substantial new tool investment.

### 3. Complete the older navigation

The homepage and [editorial hub](https://www.chartsai.com/editorial-charts/) already prominently expose templates. They are not hidden or orphaned.

The [examples directory](https://www.chartsai.com/examples/) omits the editorial collections. The [chart directory](https://www.chartsai.com/charts/) links all eleven makers, but its question-based chooser covers only dot, radar and line. Complete that chooser and connect finished templates from Examples. Add a relevant line-chart link to the [NASA worked resource](https://www.chartsai.com/editorial-charts/temperature-record/), which has only two page inlinks.

### 4. Reconcile the relaunch with search reporting

On September 9, Google's stored inspection of the www homepage still reported an older duplicate/canonical state from its September 7 crawl: no declared canonical and the apex homepage selected. Today's live Google Inspection Tool fetch succeeded, reported indexing allowed, and detected `https://www.chartsai.com/` as the declared canonical. That verifies current eligibility, not Google's final canonical selection or inclusion.

The aggregate indexing report was dated September 4, before the rebuild. The sitemap index showed Success with a September 8 read date; its displayed discovery count was behind the current 119-URL sitemap. Web and AI report periods ended September 6, also before relaunch. Do not present those figures as results of the new product. Search retrieval also surfaced old paid-product copy; direct live HTML is correct.

Follow up on the canonical homepage and representative maker, example, guide and template URLs as stored reports refresh. Earlier indexing requests already exist; repeated requests do not accelerate the queue. No need to pause building.

Legacy `/terms-of-use` and `/privacy-policy` still return 404 while `/terms/` and `/privacy/` exist. Review appropriate permanent mappings. Map `/cookie-policy` only if the destination covers its old purpose. Retired authentication/dashboard routes have no current equivalent and should not be blanket-redirected to the homepage. Historical blog URLs need content/backlink evidence before choosing a replacement.

### 5. Reduce mobile delivery costs

Single Lighthouse 13.4.1 mobile runs, simulated slow network and 4× CPU slowdown, with analytics off:

| Page | Performance score | LCP | CLS | TBT |
|---|---:|---:|---:|---:|
| Homepage | 94 | 2.25 s | 0 | 0 ms |
| Dot plot maker | 86 | 3.71 s | 0 | 26 ms |
| Dumbbell examples | 98 | 1.97 s | 0 | 0 ms |

`paper.png` transfers about 260 KiB on every sampled page; `ink.webp` adds about 231 KiB on the homepage. Compress/resize the decorative textures while retaining the design. Investigate shared font/CSS delivery: the dot maker's measured LCP element was its heading. Do not assume ECharts removal is the fix. Retest the maker and actual interactions after changes.

These are lab observations, not field CWV passes or failures. PageSpeed API returned quota 429; field LCP/INP/CLS were unavailable.

### 6. Preserve the useful pSEO system and deepen its evidence

Retain the 50 worked examples, five datasets and three template collections. Their data, questions and interpretations materially differ; this audit found no justification for blanket deletion/noindex or keyword-permutation expansion. Shared boilerplate alone is not a demonstrated penalty.

After the guide batch, deepen [Iris](https://www.chartsai.com/datasets/iris/) with a reproducible species-grouped distribution comparison and exact grouped-box-plot handoff. Round visible statistical summaries to documented useful precision while preserving raw values. Treat this as a usefulness experiment, not an easy-ranking claim for the competitive dataset query.

Use the existing World Bank multi-view resource as the model for future authority assets: one meaningful question, primary data, explicit selection/method, multiple informative views, source CSV, editable project, downloadable output and limitations. Validate each new topic's search intent before allocating a new URL. No new broad page family is approved by this audit.

## Measurement and authority

Plausible's required goals, including Template Selected and Chart Download, are configured. Its seven-day dashboard contains pageviews, including older routes and the radar maker; that does not establish full ingestion of the newest template events or useful independent adoption. Today's empty dashboard is not proof of broken tracking. Private counts and dates are in the ignored measurement note.

Next verification: confirm one controlled template-selection → data replacement → download journey reaches the correct Plausible goal/property breakdown, recording and separating that QA session. Continue bounded identifiers only; never send user data. Static download events are clicks and client exports are prepared files, not proof of saved or published work.

Measure organic landing-page visits, successful use, template-attributed downloads, relevant SupaMakers visits, referring domains and observed citations separately. Establish a small fixed set of AI-search checks with prompt, platform, date and cited URL; avoid claiming a universal GEO score. Search Console's property-specific AI beta impressions are not clicks or complete citation attribution. Bing reporting/access was not verified in this audit.

Authority work should produce reusable evidence and truthful ownership/review information. This audit did not establish independent backlinks or adoption. Public source, organization profiles and permissive bots support verification but do not themselves confer authority.

## Ordered next release

1. **Accuracy and discovery:** refresh About/Source/current-scope documentation; complete Examples/Charts pathways; review equivalent legacy legal redirects. Acceptance: factual inventory/license consistency, relevant links, correct redirect destinations and unchanged canonical intent.
2. **Mobile delivery:** optimize shared textures and investigate font/CSS blocking. Acceptance: comparable before/after lab evidence plus mobile editing/export checks; preserve the visual identity.
3. **Six visual guide upgrades:** start with box/histogram, dot/histogram, bin width and axis-baseline comparisons; then fix log/pie illustration gaps. Acceptance: same-data figures, verified values, accessible explanations, useful downloads, truthful handoffs and bounded analytics.
4. **One deeper sourced example:** species-aware Iris comparison, precise display formatting and tested data handoff. Expand further only from new evidence of distinct search tasks.
5. **In parallel:** verify new event ingestion and review relaunch indexing/citations on a modest recurring cadence. Measurement remains active while building continues.

## Primary guidance

Google states that its AI features use normal SEO requirements and need no special AI file or schema: [AI features](https://developers.google.com/search/docs/appearance/ai-features). Main answers should remain visible and structured data should match them.

Google emphasizes original value and task satisfaction rather than a preferred word count: [helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content). Its [scaled-content policy](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content) concerns low-value manipulation, not programmatic generation by itself.

Accurate SoftwareApplication markup is present, but the tools lack ratings/reviews needed for [Google app rich results](https://developers.google.com/search/docs/appearance/structured-data/software-app). Never invent those to satisfy a validator. `llms.txt` is optional; missing RSL or IndexNow is not a Google indexing defect.

Search and training crawlers differ: [OpenAI bot documentation](https://developers.openai.com/api/docs/bots), [Anthropic crawler guidance](https://support.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), and [Perplexity crawler documentation](https://docs.perplexity.ai/docs/resources/perplexity-crawlers). Alternate-UA probes passed, but only the homepage's Google live inspection supplied an actual Google inspection fetch in this audit.
