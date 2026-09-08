---
name: ChartsAI Printed Resource Library
description: A homepage of blue and pink printed ink, real figures and direct resource links, alongside the established tool workbenches.
colors:
  home-blue: "#1036b8"
  home-pink: "#ce276f"
  home-paper: "#f8f2df"
  home-rule: "#395cc2"
  chart-field: "#e2edf3"
  math-field: "#f7dce7"
  print-field: "#dbe9ed"
  figure-blue: "#123ac0"
  figure-pink: "#d32f79"
  selection-paper: "#f3bdd6"
  selection-ink: "#092d9b"
  workbench-paper: "#f7f7ef"
  workbench-ink: "#263b34"
  white: "#fff"
typography:
  display:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "clamp(70px, 9.65vw, 150px)"
    fontWeight: 400
    lineHeight: 1.16
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "clamp(40px, 4.5vw, 68px)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "34px"
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: "Barlow Condensed, Arial, sans-serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.35
  introduction:
    fontFamily: "Barlow Condensed, Arial, sans-serif"
    fontSize: "clamp(23px, 2.05vw, 32px)"
    fontWeight: 500
    lineHeight: 1.22
  launch:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "clamp(32px, 3.4vw, 52px)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  navigation:
    fontFamily: "Barlow Condensed, Arial, sans-serif"
    fontSize: "22px"
    fontWeight: 600
  preview-control:
    fontFamily: "Barlow Condensed, Arial, sans-serif"
    fontSize: "20px"
  workbench-body:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "15px"
    lineHeight: 1.65
  workbench-heading:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "44px"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-1.3px"
rounded:
  paper: "0"
  workbench-field: "5px"
  workbench-button: "7px"
spacing:
  figure-gap: "12px"
  phone-gutter: "18px"
  compact-gutter: "24px"
  desktop-gutter: "40px"
  section: "72px"
components:
  launch-link:
    textColor: "{colors.home-blue}"
    typography: "{typography.launch}"
    padding: "11px 8px 13px 0"
  launch-link-hover:
    textColor: "{colors.home-pink}"
  preview-button:
    backgroundColor: "transparent"
    textColor: "{colors.home-blue}"
    typography: "{typography.preview-control}"
    rounded: "{rounded.paper}"
    padding: "7px 12px"
  preview-button-selected:
    backgroundColor: "{colors.home-blue}"
    textColor: "{colors.home-paper}"
  figure-panel:
    backgroundColor: "{colors.chart-field}"
    textColor: "{colors.home-blue}"
    rounded: "{rounded.paper}"
    padding: "10px 14px 9px"
  directory-link:
    textColor: "{colors.home-blue}"
    padding: "16px 0"
  workbench-button:
    backgroundColor: "{colors.workbench-ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.workbench-button}"
    padding: "14px 22px"
  workbench-button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.workbench-ink}"
    rounded: "{rounded.workbench-button}"
    padding: "14px 22px"
  workbench-field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.workbench-ink}"
    rounded: "{rounded.workbench-field}"
    padding: "9px 10px"
---

# Design System: ChartsAI

## Overview

**Creative North Star: "Printed Resource Library"**

The homepage pairs visibly fibrous warm paper with blue and pink spot ink. Condensed display lettering, thin rules and substantial text links give it the character of a useful printed resource collection. Real chart and worksheet outputs provide the visual substance; the composition stays open and readable rather than dividing every item into a card.

This visual world applies to the homepage, including its header and footer. It is scoped through `body.home-page` in [home.css](src/styles/home.css). Existing tool, editor and supporting-page styles remain in [global.css](src/styles/global.css), [studio.css](src/styles/studio.css) and their component stylesheets. Their DM Sans / Instrument Serif pairing and quieter workbench colors remain established; the homepage does not authorize a sitewide redesign. ChartsAI retains its existing name and SupaMakers attribution.

**Key Characteristics:**

- Blue ink carries readable text; pink provides selective emphasis.
- Actual paper and ink textures give the opening its printed material character.
- Ruled text links and square figure fields organize the library.
- Semantic text and genuine mathematical outputs remain independent of decorative treatment.

## Colors

### Primary

**Home blue** is the main text, navigation and selected-control ink. **Home rule** supplies fine separators. The figures use their separately defined **figure blue** for native chart marks and labels; preserve that distinction when maintaining the renderer.

### Secondary

**Home pink** marks punctuation, arrows, hover feedback, focus outlines and selective letter registration. **Figure pink** distinguishes a data series and the slope line. Pink emphasis does not replace series names or descriptions.

### Neutral

**Home paper** supports the repeating paper raster. **Chart field**, **math field** and **print field** are pale substrates for the three figure bands. Selection uses **selection paper** behind **selection ink**. The workbench palette tokens describe the incumbent surfaces outside the homepage, not alternate homepage themes.

**The Readable Ink Rule.** Keep body copy, navigation and numerical marks crisp; apply textured ink only to the focal headline lettering.

## Typography

Self-hosted Anton (400) supplies the display, launch links, wordmark and section headings. Self-hosted Barlow Condensed (400, 500, 600) supplies body copy, controls and navigation. The CSS fallback stacks are recorded above. Native chart labels intentionally use Arial, generally 12–14px at their SVG rendering size.

The display role is the desktop base headline. Its two semantic lines are vertically expanded with `scaleY(1.18)` from the top-left, preserving live text. Above 1600px, its font size is 158px. At 1200px and below it becomes 9.3vw; at 860px and below it becomes `clamp(64px, 13.5vw, 112px)` without the transform; at 480px and below it is 16.1vw with a 1.05 line height and −0.015em tracking. Do not generalize this focal-letter treatment to ordinary headings.

The headline role covers lower section headings, reducing to 48px at 860px and 40px at 480px. Figure headings use `clamp(25px, 2.48vw, 38px)` at desktop, 29px at 1200px, 34px at 860px and 29px at 480px. The title role covers directory and resource headings, reducing to 30px on phones.

Body copy starts at the recorded body role; section explanatory paragraphs use 26px/1.4 with a 65ch maximum, reducing to 23px on phones. The introduction has a 45ch maximum, becoming 38ch in the stacked opening. These are context-specific sizes, not a uniform mathematical type scale.

## Layout

The library has a centered 1680px maximum width. Its desktop opening uses a 0.91fr / 1.09fr grid, with the introduction and launch links on the left and three figure bands on the right. At the 1536px reference width, the header is 80px high, the opening gap and left margin are 40px, and figure rows are 300px, 255px and 263px with 12px gaps. The right opening inset is 24px. Between 1201px and 1680px, the final stylesheet proportionally scales these opening measurements using viewport units; the values above are not fixed throughout that range.

At 1200px the opening uses 24px padding and a 25px gap, with 280px / 250px / 260px figure rows. At 860px the opening stacks introduction, launch links, then figures; the figure divider disappears, rows become content-sized and gaps become 16px. The header wraps its navigation onto a complete second row. At 480px the page uses 18px side gutters, both chart samples and practice exercises stack individually, and launch rows retain a 68px minimum height. Related Guides/datasets links wrap as one group.

Below the opening, sections use 40px side margins and 72px vertical padding, reducing to 24px / 55px at 1200px and 18px / 44px at 480px. The three-column tool directory becomes two columns at 860px and one at 480px. Paired explanatory sections and the three resource links stack at 860px. Preserve readable content order and all direct destinations when changing widths.

## Elevation & Depth

Depth comes from material and tonal fields. The repeating [paper raster](public/brand/paper.png) is visible on the page ground; figure overlays repeat it at 540px, with grayscale, contrast 1.35, opacity 0.85 and multiply blending. These overlays ignore pointer events, while panel contents sit above them. Chart images also use multiply blending. The style-preview frame is square, ruled, and has no box shadow or rotation.

Headline words clip the [ink raster](public/brand/ink.webp) to selectable text using `background-clip: text`, with a 640px background size. Only GOOD and CLEAR carry pink `drop-shadow(2px 1px 0 …)` registration, reducing to 1px / 1px on phones. This is printed ink offset, not container elevation. Matching figure bands gain a pink 2px inset outline effect when their category link is hovered or keyboard-focused.

**The Material Boundary Rule.** Keep texture and registration in the printed surface; do not distress chart geometry, labels, input fields or exported values.

## Shapes

Homepage figure fields and preview frames have square corners. Thin rules provide separation and link structure. Directional arrows are inline SVG paths with non-scaling strokes, not text glyph substitutes. Preview theme controls retain their established circular swatches and selected checkmarks. The incumbent workbench keeps its own rounded fields and buttons.

## Components

### Launch links and navigation

Launch links are full-width ruled rows, with large Anton labels and pink SVG arrows. Hover changes the text to pink. Hover or keyboard focus moves the arrow 5px over 180ms with `cubic-bezier(0.16, 1, 0.3, 1)` and emphasizes the associated figure through CSS. Header navigation is Barlow Condensed, uppercase, weight 600; its spacing compresses before wrapping onto a second row. These remain ordinary working links without JavaScript.

Homepage keyboard focus uses a pink 3px outline with 5px offset. Under reduced motion, arrow transforms and arrow/panel transitions stop and smooth scrolling becomes automatic; the still focus and panel feedback remains. In forced colors, textured headline text becomes `CanvasText`, its background is removed, and registration is removed. Do not infer a complete forced-colors audit of every tool from this targeted headline fallback.

### Figure fields and directory rows

Figure fields combine a descriptive heading, genuine sample graphics, visible supporting text and direct tool links. Their images have intrinsic dimensions and meaningful alternatives. Directory links use a 25px semibold tool name above a 20px description, with a thin bottom rule and 16px vertical padding. Hover underlines and colors the tool name pink. All 18 current tool links are present in static HTML.

[HomeFigures.astro](src/components/HomeFigures.astro) renders dot, line and slope figures through native ECharts at build time. [home-figures.ts](src/lib/home-figures.ts) retains every sample observation and series mapping. The slope plot uses 300×180 pixels for 10×6 units, preserving equal physical units. Number-line previews reuse the shared SVG renderer. Decorative assets must never become sources for mathematical geometry or labels.

### Style preview and controls

The embedded style preview is a bounded demonstration of existing export styles. Square text buttons select radar or dot; selection uses paper text on blue and `aria-pressed`. Circular style swatches retain selected checkmarks and accessible names. Controls remain disabled until hydration, while the initial graphic and maker link remain useful in static HTML. Selection swaps generated SVG files and carries the exact example/style into the maker; it does not load ECharts into the homepage browser.

### Established workbench controls

Existing input fields keep white backgrounds, muted green borders, modest rounding and DM Sans text. Primary buttons keep dark green fill and white text; secondary buttons remain transparent with a muted border. Preserve their established focus, error, disabled and import states in their own stylesheets. No new homepage input or form style is established by this release.

## Do's and Don'ts

### Do:

- Do scope the printed identity to the homepage and preserve the established editor workbenches.
- Do retain real semantic headline text, image alternatives and working static links.
- Do use genuine native chart outputs and the shared printable renderers.
- Do preserve keyboard emphasis, reduced-motion feedback and the forced-colors headline fallback.
- Do use the supplied paper and ink assets visibly while keeping small text and numerical marks crisp.

### Don'ts:

- Don't spread headline texture or registration into body text, controls or data geometry.
- Don't replace native axes with decorative hand-drawn chart geometry.
- Don't turn every directory item into a floating card or apply letter-registration effects as container shadows.
- Don't let homepage styling recolor the selectable chart export themes or change their exact maker handoff.
- Don't infer an all-site identity replacement from this homepage system.
