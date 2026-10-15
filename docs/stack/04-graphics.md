---
title: Graphics
type: plan
status: draft
created: 2026-10-14
updated: 2026-10-14
description: Graphic candidates for the KOL post
aliases:
  - stack-graphics
tags:
  - domain/stack
  - audience/public
related:
  - "[[05-motion|motion]]"
  - "[[03-mixed|mixed]]"
---

# Graphics

Every candidate, captured from the live showcase at `ui.kolkrabbi.io`'s dev server on
2026-10-14, both themes. The dark one is embedded; the light twin sits beside it with the same
name. Where the element is SVG in the DOM, an `.svg` isolate sits beside the `.png` with the
theme's colours baked in, so it is a real vector, not a screenshot.

## Constraints

Stack's image sizes, from kol-website's stack page doc:

| Slot | Size | Note |
|---|---|---|
| Cover | 1200 × 600 (2:1) | `ArticleHeader`; the crop is enforced |
| Inline image | 1200 × 675 (16:9) | `ImageBlock` enforces 16:9, so every inline graphic goes on a 16:9 plate |
| Card thumbnail | 16:9 | Stack home and read-other-posts cards |
| Browse thumbnail | 512 × 512 (1:1) | `ArticleCardMini` |

So the chosen graphics are composed onto 16:9 plates in the page's own surface colour before
upload, not uploaded raw. The SVG isolates make that a layout step, not a re-capture.

## Diagrams

Drawn by hand as SVG from the shipped-packages table and the lobby ledger. Both carry the
post's argument and nothing else does.

**Round trip vs fork and return.** The thesis in one picture: five hops for every change on
top, the editor's fork-and-return below. Goes beside the *Round trips* section.

![[_assets/graphics/diagram-round-trip-vs-fork--dark.png]]

**Package topology.** The tiers, arrows at what is consumed, the one built package on top.
Goes beside *The shape*.

![[_assets/graphics/diagram-package-topology--dark.png]]

## Foundations

**Icon sheet, interface set.** All 243 icons from the set's own files, 24 grid, 1.5 stroke,
one colour. A true vector sheet. The signal set (101) is the same file with `signal` in the name.

![[_assets/graphics/icon-set-interface-sheet--dark.png]]

**Icon gallery page.** The same icons as the showcase renders them, with names. Busier than the
sheet; a fallback.

![[_assets/graphics/icon-set-interface-gallery--dark.png]]

**Opacity ladder.** The fourteen-stop `fg` ink ramp off the color page, swatches and the
utility classes each stop mints. The one token idea KOL has that shadcn does not. Goes beside
*Function first*. Tall; it crops to its top eight rows on a 16:9 plate.

![[_assets/graphics/opacity-ladders--dark.png]]

**Palette reference.** The five brand ramps as swatch rows with hex values. Clean, but it says
"brand" when the post says the brand is an input.

![[_assets/graphics/module-palette-reference--dark.png]]

**Type scale.** Display to caption with the spec cards. Reads well; fonts are real.

![[_assets/graphics/module-type-scale--dark.png]]

**Clearspace diagram.** The three-layer logo construction shipped this morning in
kol-component 0.260.0. A vector. The brand-as-input point, drawn.

![[_assets/graphics/clearspace-diagram--dark.png]]

**Logo card and logomark.** The brand marks on their cards. Vectors. Quiet; fine for the
*Origin* section if anything is wanted there.

![[_assets/graphics/logo-card--dark.png]]

## Components

**Charts.** Seven hand-rolled SVG charts, no d3: line, donut, sparkline, heatmap, histogram,
scatter, candlestick. Every one is a vector isolate. The line chart is the strongest alone.

![[_assets/graphics/line-chart--dark.png]]

![[_assets/graphics/heatmap--dark.png]]

![[_assets/graphics/donut-chart--dark.png]]

**Envelope generator.** The signal engine with its oscilloscope and the expression reference.
Dense and very KOL. Vector.

![[_assets/graphics/envelope-generator--dark.png]]

**Knob, LED, rocker switch, slider.** The hardware atoms at 2×. Small; they work as a strip.

![[_assets/graphics/knob--dark.png]]

![[_assets/graphics/rocker-switch--dark.png]]

**Chess board.** Mid-game, one piece set. Vector. Pretty, but it says nothing about the post.

![[_assets/graphics/chess-board--dark.png]]

**Button, segmented toggle, tool palette, icon frame, colour swatch.** The core atoms. Useful
only as a "these are the parts" strip.

![[_assets/graphics/tool-palette--dark.png]]

## Sets

Whole assemblies, 1400 × 900. These are the "function first" evidence.

**Rack.** Ninety-two modules' worth of knobs, jacks and cables. The strongest single image in
the set.

![[_assets/graphics/set-rack--dark.png]]

**Design editor.** The compositor with a selection and the inspector. The fork-and-return
subject, pictured.

![[_assets/graphics/set-design-editor--dark.png]]

**Mixer.** Channel strips and faders.

![[_assets/graphics/set-mixer--dark.png]]

**Metrics dashboard.** The dashboard cards and charts in a grid.

![[_assets/graphics/set-metrics-dashboard--dark.png]]

**App shell, media library, chess apparatus.** The remaining sets, captured for completeness.

![[_assets/graphics/set-app-shell--dark.png]]

## Modules

**Bento wall.** Six media tiles with display type. The best cover candidate: it is handsome, it
is 16:9-ish, and it shows nothing that dates.

![[_assets/graphics/module-bento-wall--dark.png]]

**Search modal, inspector panel, colour picker, shell rail states, shell topbar.** Captured;
the search modal is the better of these if one is wanted. The module preview opens on an empty
index, so the frame below is the showcase's own modal, which has rows.

![[_assets/motion/search-modal-page--dark.png]]

![[_assets/graphics/module-inspector-panel--dark.png]]

## Pages

**Tag graph.** The docs vault's tags as a force graph, settled. A vector. Striking, and it is
the "docs that render the system" point.

![[_assets/graphics/tag-graph--dark.png]]

**Home hero and the bento row.** The showcase's own front door. Cover alternates.

![[_assets/graphics/home-hero--dark.png]]

## Shortlist

My pick, in page order. Six inline plus the cover.

| Slot | Graphic | Why |
|---|---|---|
| Cover | `module-bento-wall` | Looks like a product, dates nothing, crops to 2:1 without loss |
| The shape | `diagram-package-topology` | The only picture of the tiers |
| Round trips | `diagram-round-trip-vs-fork` | The thesis |
| Function first | `set-rack` | The fader-is-not-a-slider argument, visibly |
| Function first | `opacity-ladders` | The one token idea worth showing |
| What works | `tag-graph` | Docs that render the system |
| Origin | `clearspace-diagram` | Brand as input, drawn, and it shipped today |

Dropped from the shortlist and why: the charts are good but generic; the icon sheet is strong
but reads as a poster, not a point; the editor set duplicates the rack's job.

## Open calls

- **Dark or light plates.** Everything was captured in both. The site's article pages follow the
  reader's theme, so one plate colour will clash with half the readers. Recommend dark plates
  with a 1px `oq-08` keyline, the showcase's own preview chrome.
- **SVG or PNG in Sanity.** `ImageBlock` runs assets through the image pipeline and enforces
  16:9. Recommend PNG at 2400 × 1350 for the inline slots and keep the SVGs in this folder.
- **Cover text.** None. The header draws the title.
