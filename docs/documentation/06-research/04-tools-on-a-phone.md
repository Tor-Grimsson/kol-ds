---
title: Tools on a phone
type: reference
status: active
created: 2026-10-05
updated: 2026-10-05
description: Using a stage with panels on a phone
aliases:
  - tools on a phone
  - phone practices
tags:
  - domain/research
  - domain/layout
related:
  - "[[INDEX|research]]"
  - "[[../08-breakpoints/02-best-practices|breakpoint practices]]"
---

# Tools on a phone

Outside reading on one question: how is a tool — a stage with settings beside it — laid out and used on a small screen. [[../08-breakpoints/02-best-practices|Breakpoint practices]] covers page widths and where chrome appears; this covers use.

**This is reference, not law.** Nothing here binds a KOL app until the user rules on a row. Every line is from a page that was opened on 2026-10-05; the links are under Sources.

## The practices

| # | Practice | Who says it | In their words |
|---|---|---|---|
| 1 | **Layout follows the window, never the device** | Apple · Android | Apple: "Determine layout based on size classes, not device type or orientation." Android: "Window size classes are explicitly not determined by the size of the device screen" and "are not intended for *isTablet*‑type logic." |
| 2 | **Width decides more than height** | Android | "Available width is usually more important than available height due to the ubiquity of vertical scrolling." |
| 3 | **A tool is a main area plus a supporting pane** | Android | The supporting-pane layout names "a media editing tool with palettes, effects, and other settings in a support pane" as its example. |
| 4 | **Narrow: the pane goes under the stage. Wider: beside it** | Android | "For compact-width displays, place the supporting content below the main content or inside a bottom sheet." Medium: "split the display space equally". Expanded: "70% of the space to the main content, 30% to the supporting content." |
| 5 | **A list and its detail show one at a time when narrow** | Android | "Medium- and compact-width displays show either the list or the detail, depending on user interaction." |
| 6 | **On a phone, try a tab bar before a sidebar** | Apple | "Consider using a tab bar first. A tab bar provides more space to feature content." And: "show no more than two levels of hierarchy in a sidebar." |
| 7 | **A sheet that changes the stage stays open and leaves the stage live** | Apple | "Use a nonmodal view when you want to present supplementary items that affect the main task in the parent view." |
| 8 | **A sheet rests at two heights, and shows that it can** | Apple | Detents: "large is the height of a fully expanded sheet and medium is about half". "Include a grabber in a resizable sheet." |
| 9 | **One sheet at a time** | Apple · NN/g | Apple: "Display only one sheet at a time from the main interface." NN/g: "Do Not Stack Bottom Sheets." |
| 10 | **A sheet is for short work; long work gets a real surface** | Apple · NN/g | Apple: "For complex or prolonged user flows, consider alternatives to sheets." NN/g: "Use Bottom Sheets Only for Short Interactions." |
| 11 | **A sheet closes three ways** | Apple · NN/g | Apple: "Support swiping to dismiss a sheet." NN/g: "Include a Close Button" — a grab handle is easily missed — and "Allow the Use of Back for Dismissing the Bottom Sheet." |
| 12 | **A control is 44 across by default, 28 at the least** | Apple | iOS default control size 44×44 pt, minimum 28×28 pt. |
| 13 | **24 is the accessibility floor, not the target** | WCAG 2.5.8 | "The size of the target for pointer inputs is at least 24 by 24 CSS pixels", or smaller with 24px of clear spacing around it. |
| 14 | **The gap around a control counts as much as its size** | Apple | "about 12 points of padding around elements that include a bezel", "about 24 points" around ones without. |
| 15 | **Every gesture has a button that does the same** | Apple | "Offer alternatives to gestures… offer onscreen ways to achieve the same outcome." |
| 16 | **Nothing sits under the system's edges** | Apple | "Respecting the safe area is essential to make sure system UI and hardware features like the Dynamic Island don't obstruct content and controls." |
| 17 | **The bottom edge is not automatically the easy reach** | NN/g | The article calls bottom-sheet reachability a myth: the middle of the screen is the easiest region to tap across the ways a phone is held. |

## Window classes

Android's width classes, the only numbered ladder among the sources:

| Class | Width | What it is |
|---|---|---|
| Compact | under 600 | 99.96% of phones in portrait |
| Medium | 600 to 840 | most tablets in portrait |
| Expanded | 840 to 1200 | most tablets in landscape |
| Large | 1200 to 1600 | large tablets |
| Extra-large | 1600 and up | desktop displays |

KOL's own scale is Tailwind's — 640 · 768 · 1024 · 1280 · 1536 ([[../08-breakpoints/01-values|breakpoint values]]). The nearest KOL step to "compact ends" is `sm` (640).

## Procreate Pocket

The one shipped tool read, from its handbook's Interface page:

- The canvas takes the middle; everything else is at an edge.
- Daily tools sit top right: paint, smudge, erase, layers, color.
- Two vertical sliders ride the left edge — brush size above, opacity below. Dragging sideways off a slider makes it move in finer steps.
- Everything rarer is behind one menu, top left.
- A panel is a card that rises from the bottom over the canvas and leaves by a swipe down from its top.
- A four-finger tap slides the whole interface away and brings it back.

Lightroom and Snapseed were meant to stand beside it; neither help page could be opened, so neither is described here.

## Tensions

- **Sheet or pane.** Rows 7 and 8 describe a sheet that stays open over a live stage. Rows 10 and 17 say a sheet is for short visits and is not easier to reach. Android's row 4 offers both — "below the main content *or* inside a bottom sheet". For settings someone works in for minutes, the pane under the stage is the closer fit; the sheet is the fit for a quick pick.
- **44 or 24.** Apple's 44 is a default with a 28 minimum; WCAG's 24 is a pass mark. They are different questions — comfort and compliance.

## KOL today

| Subject | Rule | Where |
|---|---|---|
| Hit area | every pressable control clears 24×24, without moving its drawn size | [[../03-components/05-control-chrome\|control chrome]] |
| Control heights | one height per size — 22 · 26 · 32 · 40 | [[../01-foundations/09-sizes\|sizes]] |
| Page chrome | drawer below `lg`, rails at `lg` and up | [[../08-breakpoints/04-kol-ds-rules\|breakpoint rules]], law 5 |
| App shell on a phone | below 768 the rail becomes a bottom bar, or a drawer | [[../04-compositions/16-app-anatomy\|app anatomy]] |
| Labs and the randomiser | a rail on the right at a desk, a sheet along the bottom on a phone — chosen by touch, not by width | [[../04-compositions/14-design-editor-system\|design-editor system]] |

The last row is the one place KOL does the opposite of row 1 above.

## Sources

- Apple, Human Interface Guidelines — [Layout](https://developer.apple.com/design/human-interface-guidelines/layout) · [Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets) · [Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars) · [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- Android Developers — [Canonical layouts](https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts) · [Window size classes](https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes)
- W3C — [Understanding SC 2.5.8, Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- Nielsen Norman Group — [Bottom Sheets: Definition and UX Guidelines](https://www.nngroup.com/articles/bottom-sheet/)
- Procreate Pocket Handbook — [Interface](https://help.procreate.com/pocket/handbook/interface-gestures/interface)
