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
