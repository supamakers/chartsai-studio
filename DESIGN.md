---
name: ChartsAI Printed Resource Library
description: Blue and pink printed ink connects the free resource library, reading pages and tool workbenches.
colors:
  home-blue: "#1036b8"
  home-pink: "#ce276f"
  home-paper: "#f8f2df"
  home-rule: "#395cc2"
  ink: "#192751"
  muted: "#4c5875"
  line: "#bcc6de"
  surface-tint: "#edf1f8"
  chart-field: "#e2edf3"
  math-field: "#f7dce7"
  print-field: "#dbe9ed"
  figure-blue: "#123ac0"
  figure-pink: "#d32f79"
  selection-paper: "#f3bdd6"
  selection-ink: "#092d9b"
  white: "#fff"
typography:
  display:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "clamp(70px, 9.65vw, 150px)"
    fontWeight: 400
    lineHeight: 1.16
    letterSpacing: "-0.025em"
  page-title:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "clamp(38px, 5vw, 72px)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "40px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  home-headline:
    fontFamily: "Anton, Impact, sans-serif"
    fontSize: "clamp(40px, 4.5vw, 68px)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  body:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.65
  home-body:
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
  step-title:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    letterSpacing: "-0.025em"
  control:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.5
  metadata:
    fontFamily: "DM Sans, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  paper: "0"
  control: "5px"
  card: "7px"
  surface: "8px"
  circle: "50%"
spacing:
  figure-gap: "12px"
  phone-gutter: "18px"
  compact-gutter: "24px"
  desktop-gutter: "40px"
  section: "72px"
components:
  button-primary:
    backgroundColor: "{colors.home-blue}"
    textColor: "{colors.white}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "14px 20px"
  button-primary-hover:
    backgroundColor: "{colors.selection-ink}"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.home-blue}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "14px 20px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-tint}"
  field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 11px"
  step-badge:
    backgroundColor: "{colors.home-blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.circle}"
    width: "27px"
    height: "27px"
  launch-link:
    textColor: "{colors.home-blue}"
    typography: "{typography.launch}"
    padding: "11px 8px 13px 0"
  launch-link-hover:
    textColor: "{colors.home-pink}"
  figure-panel:
    backgroundColor: "{colors.chart-field}"
    textColor: "{colors.home-blue}"
    rounded: "{rounded.paper}"
    padding: "10px 14px 9px"
  example-card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.card}"
  preset:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.control}"
    padding: "7px 12px"
---

# Design System: ChartsAI

## Overview

**Creative North Star: "Printed Resource Library"**

The Printed Resource Library pairs visibly fibrous warm paper with blue and pink spot ink. Condensed display lettering, thin rules and substantial text links connect the homepage, resource collections, reading pages and tool interfaces. Real chart and worksheet outputs provide the visual substance.

The user extended this approved identity across the site on September 9, 2026. [brand.css](src/styles/brand.css) owns shared color roles, headings, navigation, footer and control treatments; [Layout.astro](src/layouts/Layout.astro) loads the shared fonts and applies the brand to every route. [home.css](src/styles/home.css) continues to own the homepage's composition and larger Barlow copy. Reading pages and controls use DM Sans. ChartsAI retains its existing name and SupaMakers attribution.

**Key Characteristics:**

- Blue ink connects headings, links and actions; pink provides selective emphasis.
- Paper surrounds the library while white chart and input surfaces protect the work.
- One wordmark, four-link navigation and footer carry across page families.
- Semantic text and genuine mathematical outputs remain independent of decorative treatment.

## Colors

### Primary

**Home blue** is now the shared heading, navigation, link and action ink; the retained token name reflects its homepage origin. **Home rule** supplies separators and upload boundaries. Native homepage figures use their separately defined **figure blue** for chart marks and labels.

### Secondary

**Home pink** marks punctuation, current navigation, hover feedback and focus outlines. **Figure pink** distinguishes a data series and the slope line. Emphasis does not replace series names or descriptions.

### Neutral

**Home paper** is the site ground beneath the repeating paper raster. **Ink** supports reading and control text; **muted** supports secondary information; **line** separates controls and workspaces. **White** protects inputs and chart surfaces. **Surface tint** provides quiet selected and supporting regions; **chart field**, **math field** and **print field** remain the homepage's pale figure substrates. Text selection uses **selection paper** and **selection ink**, with selection ink also providing the primary-button hover shade.

The shared CSS maps the legacy paper, rust, accent, lime and serif property names onto the new roles to keep existing components consistent. Those aliases are implementation compatibility, not additional colors or a revived serif typeface.

**The Readable Ink Rule.** Keep body copy, navigation and numerical marks crisp; apply textured ink only to the focal headline lettering.

## Typography

Self-hosted Anton (400) supplies the wordmark and page/section headings. Self-hosted Barlow Condensed (400, 500, 600) supplies shared navigation and homepage copy. Self-hosted DM Sans (400, 500, 600, 700) supplies reading pages, fields, buttons and step headings. Native chart/export typography remains owned by the selected chart theme; homepage chart labels intentionally use Arial at their SVG rendering size.

The page-title role is the common non-homepage H1: balanced text, a 23ch maximum and 16px bottom margin. At 480px and below it uses `clamp(36px, 10vw, 48px)`. Section headings inherit Anton with local sizes appropriate to their composition. The general headline role is the shared starting point, not a mandate that all H2s have identical dimensions. Step headings use DM Sans; chart-journey steps reduce from 20px to 18px below 760px. Example category metadata is ordinary sentence-case supporting text beneath its title, not a heading.

The display role is the desktop base headline. Its two semantic lines are vertically expanded with `scaleY(1.18)` from the top-left, preserving live text. Above 1600px, its font size is 158px. At 1200px and below it becomes 9.3vw; at 860px and below it becomes `clamp(64px, 13.5vw, 112px)` without the transform; at 480px and below it is 16.1vw with a 1.05 line height and −0.015em tracking. Do not generalize this focal-letter treatment to ordinary headings.

The home-headline role covers lower section headings, reducing to 48px at 860px and 40px at 480px. Figure headings use `clamp(25px, 2.48vw, 38px)` at desktop, 29px at 1200px, 34px at 860px and 29px at 480px. Directory and resource headings use 34px Anton, reducing to 30px on phones.

Homepage copy starts at the recorded home-body role; section explanatory paragraphs use 26px/1.4 with a 65ch maximum, reducing to 23px on phones. The introduction has a 45ch maximum, becoming 38ch in the stacked opening. These are context-specific sizes, not a uniform mathematical type scale.

**The Task Typography Rule.** Use Anton to orient, Barlow to navigate the library, and DM Sans to read and operate.

## Layout

Page composition remains local: resource collections can compare figures, prose can use a readable measure, and editors retain adjacent input/preview regions. The common content container has a 1320px maximum; the shared header has a 1600px maximum and the homepage library a 1680px maximum.

The header uses 40px outer gutters on desktop, 24px below 1200px and 18px below 480px. At 860px it wraps into a wordmark/credit row followed by one complete navigation row; links stay on single lines and all four remain visible. Navigation reduces from 22px through 21px and 20px to 18px on phones. The standard header height is 80px; between 1201px and 1680px it scales proportionally with viewport width.

Common chart journeys retain a 350px input column beside the preview, reducing to 300px at 1100px and stacking at 760px. Download controls stack where needed. Numeric summaries use two equal columns below 600px; values remain single-line within their cells and can scroll when necessary. Meaningful labels remain with their values.

The homepage retains its approved opening composition. Its desktop opening uses a 0.91fr / 1.09fr grid, with the introduction and launch links on the left and three figure bands on the right. At the 1536px reference width, the header is 80px high, the opening gap and left margin are 40px, and figure rows are 300px, 255px and 263px with 12px gaps. The right opening inset is 24px. Between 1201px and 1680px, the final stylesheet proportionally scales these opening measurements using viewport units; the values above are not fixed throughout that range.

At 1200px the opening uses 24px padding and a 25px gap, with 280px / 250px / 260px figure rows. At 860px the opening stacks introduction, launch links, then figures; the figure divider disappears, rows become content-sized and gaps become 16px. The shared header follows the responsive behavior above. At 480px the page uses 18px side gutters, both chart samples and practice exercises stack individually, and launch rows retain a 68px minimum height. Related Guides/datasets links wrap as one group.

Below the opening, sections use 40px side margins and 72px vertical padding, reducing to 24px / 55px at 1200px and 18px / 44px at 480px. The three-column tool directory becomes two columns at 860px and one at 480px. Paired explanatory sections and the three resource links stack at 860px. Preserve readable content order and all direct destinations when changing widths.

## Elevation & Depth

Depth comes from paper, fine rules and tonal fields. Shared workspaces, example cards and primary buttons have no box shadow. White chart and field surfaces keep accurate outputs legible against the paper ground. This does not recolor a chart's selected background or palette.

The repeating [paper raster](public/brand/paper.png) is visible on the page ground; figure overlays repeat it at 540px, with grayscale, contrast 1.35, opacity 0.85 and multiply blending. These overlays ignore pointer events, while panel contents sit above them. Chart images also use multiply blending. The style-preview frame is square, ruled, and has no box shadow or rotation.

Headline words clip the [ink raster](public/brand/ink.webp) to selectable text using `background-clip: text`, with a 640px background size. Only GOOD and CLEAR carry pink `drop-shadow(2px 1px 0 …)` registration, reducing to 1px / 1px on phones. This is printed ink offset, not container elevation. Matching figure bands gain a pink 2px inset outline effect when their category link is hovered or keyboard-focused.

**The Material Boundary Rule.** Keep texture and registration in the printed surface; do not distress chart geometry, labels, input fields or exported values.

## Shapes

Homepage figure fields and preview frames have square corners and ruled edges. Controls use modest rounding; example cards retain their observed small radius and broader surfaces use the shared surface radius. This is one visual identity with task-appropriate forms. Circular step badges and chart-theme swatches remain functional exceptions. Directional arrows are inline SVG paths with non-scaling strokes; redundant decorative Unicode link icons are not part of the system.

## Components

### Buttons and fields

Primary buttons use blue fill and white DM Sans text; secondary buttons use white fill, blue text and the neutral line. Their shared minimum height is 44px, with local larger or compact variants. Hover darkens primary blue or tints secondary surfaces without moving the button. Fields use white backgrounds, the neutral boundary, the field padding recorded above, DM Sans and a blue caret. Checkboxes, radios and ranges use blue accents. Numeric inputs and tables use tabular numbers.

Shared keyboard focus is a pink 3px outline with 4px offset; homepage focus retains a 5px offset. Error, disabled and import states remain explicit in their owning components. Under reduced motion, animations/transitions and smooth scrolling stop. These source rules do not imply an independent complete accessibility audit.

### Navigation and footer

The same Anton wordmark, pink punctuation, Barlow navigation and SupaMakers credit appear on every route. Navigation contains Charts, Math tools, Printables and Examples. Current links are pink and underlined; hover is pink. Keep navigation accessible without JavaScript. The footer uses visible 22px Anton section headings, DM Sans links/body at 14px/1.7 and a 12px lower row. It retains the same paper ground and blue rules as the header.

### Journey steps, summaries and metadata

Steps present numbered blue circles beside DM Sans task headings. The shared coordinate/worksheet badge is 27px; the established chart-journey badge is 26px. The numeric labels remain clear rather than depending on color. Input and preview sections use white surfaces with a blue-tinted journey header. The upload target uses a dashed rule and pale tint. Category metadata sits beneath example-card titles in the recorded metadata role. Sample data badges continue to distinguish sample/custom state through text.

### Cards, figures and launch links

Example cards use a white field, a fine neutral border, modest rounded corners and no shadow. Their category labels are supporting metadata below titles. Editorial collections retain figure-led rows and source tables; the shared identity does not turn all resources into cards.

Homepage launch links remain full-width ruled rows with Anton labels and pink SVG arrows. Hover/focus moves the arrow 5px over 180ms with `cubic-bezier(0.16, 1, 0.3, 1)` and emphasizes the associated figure. Reduced motion keeps still focus feedback. Figure panels retain intrinsic image dimensions, meaningful alternatives and genuine native/shared-renderer output. The homepage directory remains directly linked in static HTML.

### Presets and style preview

Preset controls use white fields, neutral borders and a tinted selected state with explicit state semantics. The homepage's bounded style preview uses square text buttons and circular theme swatches. Selection uses paper text on blue and `aria-pressed`; controls remain disabled until hydration while the initial graphic and maker link remain useful in static HTML. Selection carries the exact example/style into the maker without loading ECharts into the homepage browser.

## Do's and Don'ts

### Do:

- Do apply the shared brand through Layout and brand.css while keeping page composition appropriate to reading or operating.
- Do retain real semantic headline text, image alternatives and working static links.
- Do use genuine native chart outputs and the shared printable renderers.
- Do preserve keyboard emphasis, reduced-motion feedback and the forced-colors headline fallback.
- Do use the supplied paper and ink assets visibly while keeping small text and numerical marks crisp.
- Do keep all four navigation destinations visible on phones.

### Don't:

- Don't spread headline texture or registration into body text, controls or data geometry.
- Don't replace native axes with decorative hand-drawn chart geometry.
- Don't turn every directory item into a floating card or apply letter-registration effects as container shadows.
- Don't let surrounding brand styling recolor selectable chart export themes or change their exact maker handoff.
- Don't restore the superseded green workbench identity or Instrument Serif interface headings.
