# Editorial charts extension

Reviewed September 9, 2026. This is an ordinary extension of the established workbench. It records the implemented surface, not a new global visual system. Preserve `DESIGN.md` and `.impeccable/design.json`; the homepage's blue/pink Printed Resource Library remains scoped to `body.home-page`.

## Direction and form

- **Thesis:** Source-backed publication graphics that visitors can inspect, edit and download freely.
- **Own world:** Inherit the quiet cream/green workbench and native ECharts graphics. Publication colors belong to chart content; they do not replace the surrounding identity.
- **Story:** Choose a question, supply a table, map and check the selection, explain the source and notes, then export.
- **First viewport:** Makers lead with a plain descriptive headline and prominent upload/paste controls. Their sourced initial chart remains available in static output. The hub leads with the publication purpose and a working maker link, then compares real chart outputs.
- **Form:** Operate the makers; read the worked resources and publishing guide; assess the hub through actual graphics and concrete comparison questions.

## Implemented composition

`EditorialToolPage.astro` supplies breadcrumbs, a direct tool answer, the editor and static instructions, methodology, questions and source links. `EditorialEditor.tsx` reuses `ChartJourney` and the existing import dialog. The desktop workbench inherits a 350px input column beside the preview. At 760px and below the editorial workspace stacks; preview padding reduces from 28px to 18px and export controls become a full-width column. Raw editing and design controls start collapsed.

The preview uses the shared native publication renderer. Its full-width SVG can be enlarged to a 1200px-wide scrollable view for reading dense labels. Source context, row/series-bound annotations, an accessible source table and the download step accompany the chart. A saved-project action and standard-maker return link extend the existing journey without a separate navigation system.

The editorial hub uses a two-column collection with 48px vertical and 32px horizontal gaps; it becomes one column at 760px. Real generated chart images lead each item, followed by a 28px heading and the comparison it supports. Worked resources use readable prose at a maximum of 72ch, image figures and source tables. Prose links are underlined; resource links have a two-pixel `currentColor` keyboard outline with a four-pixel offset. These are scoped editorial accessibility treatments.

## Evidence and boundaries

Source reviewed: `src/styles/editorial.css`, `src/styles/global.css`, `src/styles/studio.css`, `src/styles/dot-journey.css`, `src/components/EditorialEditor.tsx`, `src/components/EditorialToolPage.astro`, `src/pages/editorial-charts/index.astro`, `src/layouts/Layout.astro`, `PRODUCT.md`, `DESIGN.md` and `.impeccable/design.json`. Visual samples inspected: `.impeccable/review/editorial/dumbbell-390.png` and `hub-1440.png`. The screenshot set provides additional maker, homepage and mobile evidence; this documentation pass does not claim to have inspected every image or independently verified deployment.

**Pre-existing drift, not canonized or repaired:** `Layout.astro` loads `studio.css` after `global.css`; the studio overrides use DM Sans headings, paper `#f8f9f6`, ink `#202522`, muted `#606961` and blue accent `#3158df`. The incumbent design record still describes Instrument Serif workbench headings, paper `#f7f7ef` and ink `#263b34`. This discrepancy predates the editorial extension. It is reported here rather than rewriting the global design authority without an approved system change. Existing tiny footer eyebrows likewise remain an inherited defect, not a new editorial rule. Detector advisories for editorial font sizes, muted border colors and radii are local implementation observations; they do not establish new global tokens.

## Template library direction contract — September 9, 2026

THESIS: Choose a finished chart, replace the observations and keep the design. Twelve full examples across three collections make that action concrete.
OWN-WORLD: Inherit the cream/green editorial workbench. Real native chart figures lead; source tables and explanatory prose sit beside each figure. Homepage links retain the scoped printed blue/pink identity.
STORY: Compare applications, understand the interpretation and caveat, open the exact project, import replacement data, then download. Every example is visibly labelled World Bank or fictional.
FIRST VIEWPORT: Collection title, concise purpose, the three-step reuse journey, in-page example navigation and the first substantial chart. Use alternating figure/text rows on desktop and figure-first stacking on phones; no generic feature-card grid.
FORM: Read collection / Operate editor; an ordinary code-led extension of the existing editorial collection. No new visual world or concept seed applies.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Implemented template library — September 9, 2026

The three collection pages contain four complete examples each. Each example pairs a real native chart figure with its comparison question, interpretation, publishing caveat and exact “Use this chart” handoff. A source label distinguishes retained World Bank observations from original fictional CC0 examples. An expandable accessible table and direct editable-project, source-CSV, SVG, PNG and PDF links accompany every figure. These are substantial example resources, not twelve separate indexed template pages.

Desktop examples use alternating figure/prose rows with a 1.25fr / 1fr column ratio, a 48px gap and 48px vertical padding, separated by fine rules. At 760px and below they stack figure first with a 24px gap and 32px vertical padding. The first chart loads eagerly; later figures load lazily. Source tables can scroll horizontally without widening the page. Download links and source-table summaries have a 44px minimum target height. Example titles use `clamp(26px, 3vw, 38px)` at a 1.1 line height. Collection headings on phones use `clamp(36px, 10vw, 56px)` and preserve whole words. These measurements describe this collection's implementation, not new global tokens.

The opening presents a direct answer, the three-step choose/replace/download journey, and in-page example links. The editor's existing example selector now includes the matching four templates and identifies the selected design beside the import flow. Applying replacement data retains the palette, canvas and label settings; unchanged sample semantics and old annotations clear while user-authored context survives. The hub exposes the three collections together near its opening. Its maker/template actions wrap with 16px vertical and 24px horizontal spacing. Homepage entry links retain the existing printed identity and three primary paths.

## Template finish evidence and limits

This documentation pass checked `src/styles/editorial.css`, `src/styles/studio.css`, `src/pages/editorial-charts/[collection].astro`, the template references in `src/components/EditorialEditor.tsx`, `src/pages/editorial-charts/index.astro`, `src/pages/index.astro`, and `scripts/prepare-assets.mjs`, alongside `PRODUCT.md`, `DESIGN.md` and `.impeccable/design.json`. It visually sampled `.impeccable/review/templates/dumbbell-390.png` and `hub-1440.png`; the retained capture set also includes all three collections, editor, hub and homepage at 390px and 1440px. It does not claim an independent inspection of every capture.

The finish reviewer first requested fixes to mobile collection-heading breaks and hub action spacing, then returned a ship verdict for those two fixes; the remaining checks had passed the initial review. The coordinating implementation pass reported 120 site HTML pages / 119 sitemap URLs, 137 unit tests, six projection tests, 147 browser tests, and 20 targeted browser checks after the fixes passing. It also reported 12 generated template PNGs with embedded deterministic-render provenance and zero missing provenance records. The asset preparation source contains the corresponding origin metadata. These are local build, behavior and artifact results, not live search or usage measurements.

The coordinating pass verified the fixed-ID Plausible Template Selected goal and template property on September 9. Configuration and bounded event attribution do not establish adoption. Production verification remains separate; no deployment claim is made by this documentation pass.

`PRODUCT.md` already describes the twelve templates and three collections, so no capability amendment was needed. The incumbent global design record and sidecar remain unchanged. The previously recorded studio/global typography and palette drift, and inherited tiny footer eyebrows, remain uncanonized and unrepaired: this ordinary extension does not authorize a global system refresh.

## Shared identity supersession — September 9, 2026

The user subsequently authorized extending the selected Printed Resource Library identity across every page. The homepage-only scope, cream/green workbench direction and preserve-stale-DESIGN instructions above are historical and superseded by [site-identity.md](site-identity.md) and the refreshed root [DESIGN.md](../../DESIGN.md). Keep these surfaces' established compositions and native chart/export themes; inherit the shared blue/pink paper shell, Anton orientation headings, Barlow navigation and DM Sans reading/controls. The former global font/palette mismatch and footer eyebrows are resolved by this approved system refresh rather than canonized as alternate brand rules.
