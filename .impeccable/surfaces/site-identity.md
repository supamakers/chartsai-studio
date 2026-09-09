---
version: 1
slug: site-identity
primary_target: src/layouts/Layout.astro
related_targets: [src/styles/brand.css, src/styles/home.css]
---
# Shared ChartsAI identity

Mode: Read / Operate, with the existing Persuade homepage. The user explicitly requested visual consistency across pages on September 9, 2026. Extend the already chosen Printed Resource Library identity across the site. This authorizes replacing the old green workbench styling and refreshing the global design record; it does not require a new composition or identity choice.

## Direction contract

THESIS: A visitor can move from the homepage to a collection and into a maker without appearing to change products.
OWN-WORLD: Retain the approved blue and pink ink, paper field, Anton headings and Barlow navigation. Use DM Sans for extended reading and controls; white chart and input surfaces protect the work.
STORY: Recognize the same brand and navigation, find a clear page title and action, read or operate, and download the same accurate output.
FIRST VIEWPORT: The same wordmark, four navigation links and maker credit on every route. Existing page compositions remain; shared heading treatment, blue actions and paper surrounds connect their differing tasks.
FORM: Existing layouts, inherited printed identity; no new concept seed or comp round applies to this consistency correction.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Implemented system and review evidence — September 9, 2026

`src/styles/brand.css` owns shared ink/paper/neutral roles and overrides legacy aliases after the existing global/studio styles. `Layout.astro` supplies self-hosted Anton, Barlow Condensed and DM Sans; the same wordmark, four-link navigation, SupaMakers credit and footer appear on all routes. The paper/ink raster assets are reused without alteration. Homepage composition and Barlow body copy remain local; reading and controls use DM Sans. Native chart themes and export rendering stay independent of the surrounding site identity.

The finish review found four bounded issues and the corrected captures resolved them: the shared coordinate/worksheet step badges are 27px; mobile numeric summaries use two columns with single-line values; example category metadata sits below card titles; and redundant Unicode icons were removed from shared footer/example/worksheet links. The final reviewer reported no observed regression and a ship disposition for the scored fixes, with the other initial checks already holding. This records that bounded verdict, not a fresh exhaustive audit.

The coordinating pass reported 150 passing browser regressions, 137 passing unit tests plus six projection fixtures, and identity checks across 16 page families at three viewport sizes. The retained identity screenshot set covers home, hub, dumbbell, slopegraph, multiples, maker, dot, math, print and examples at 1440px and 390px. This documenter sampled `hub-1440.png` and `dumbbell-390.png` directly and reviewed the shared CSS, layout, homepage and representative control/card styles. Reported raster provenance is two covered assets and zero missing; no new image generation or concept round occurred.

The one detector run produced 689 advisories, many tied to superseded DESIGN font/radius references. The authorized global record and sidecar now describe the observed CSS. No detector rerun is claimed. Legacy overridden CSS declarations remain implementation debt, not alternate brand authority. Any residual tiny legacy label or glyph advisories are not canonized as reusable components; their elimination is not claimed by this documentation pass.

`DESIGN.md` and its schema-version-2 sidecar are refreshed together. Historical homepage/editorial briefs carry explicit supersession notes. `PRODUCT.md` already states the approved sitewide brand commitment, so no product edit was needed. Local review and test results do not establish production deployment, live search performance or adoption; production verification remains the coordinating pass's responsibility.
