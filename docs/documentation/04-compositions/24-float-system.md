---
title: Float system
type: reference
status: active
created: 2026-11-04
updated: 2026-11-08
description: The float style — detached controls, sheets and windows over a scene — its foundations, every part, and where each lives
aliases:
  - float
  - floating
  - float style
sources:
  - packages/theme/kol-design-tokens.css
  - packages/theme/kol-type-float-classes.css
  - packages/theme/kol-components-atoms.css
  - packages/shell/src/AppFloatNav.jsx
  - .kol/llm-context/plan-2026-11-04-float-everything.md
tags:
  - domain/compositions
  - domain/foundations
related:
  - "[[../01-foundations/01-tokens|tokens]]"
  - "[[../01-foundations/03-typography|typography]]"
  - "[[11-shell-system|shell system]]"
  - "[[09-dashboards-system|dashboards system]]"
  - "[[14-design-editor-system|design-editor system]]"
---

# Float system

**Float** is KOL's second look: controls, sheets and windows that float over a scene instead of sitting in a
page. Round 3 accepted it (W16, 2026-10-31: `variant="float"` on Button, Input, Tooltip, SegmentedToggle,
TabsRow, the pill nav, the sign-in box, the More sheet). On 2026-11-04 the whole exploration was torn to its
elements in Figma (kol-float--style `XY6adCImPaxDuHDO6OdUw9`, page `↳ float style`: 168 elements, each beside
KOL's nearest part, labelled have · differs · missing) and the user ruled it all gets built — *"a plan that just
rams through everything"*. The plan is `plan-2026-11-04-float-everything.md`; this page is the system it
describes, kept current as each family lands.

**The word.** It is `variant="float"` on a component that has a default look, and a `surface` (`solid` ·
`glass-dark` · `glass-light`) on a composed float. Never "floating", never a second word for the same thing.

## Foundations

| What | Token / class | Value |
|---|---|---|
| Sans | `--kol-font-family-float` | Inter, self-hosted at `/fonts/inter/` (OFL). JetBrains Mono stays the mono. |
| Type roles | `kol-float-display` … `kol-float-ruler` | twelve fixed voices — see [[../01-foundations/03-typography|typography § Float roles]] |
| Control type | `--kol-float-t-{sm,md,lg}` | 12 · 13 · 14 at weight 500 (touch 13 · 15 · 16) |
| Control height | `--kol-float-h-{sm,md,lg}` | 28 · 36 · 44 (touch 36 · 44 · 52); a control is a pill |
| Glyph | `--kol-float-ic` | 18 (20) |
| Radii | `--kol-float-list-r` · `-menu-r` · `-window-r` | a bare list 8 · a sheet or panel 20 · a window 28 (touch 10 · 24 · 32) |
| Menu row | `--kol-float-row` · `--kol-float-inset` | 40 (48) · 6 |
| Focus | `--kol-float-focus` | a 2px ring of the ink on `:focus-visible`, every float control |
| Selection | `--kol-fg-16` | translucent, never `--kol-oq-16`, so glass shows through |
| States | the tone ladder | hover and pressed come from the control's tone; disabled is 40% |
| Inverted ladder | `--kol-float-hover-opacity` · `--kol-float-press-scale` | 0.88 · 0.96 — an inverted float button (and FloatActionMenu's round +, `.kol-float-action`) keeps its fill: rest the solid ink · hover the same fill at 0.88 · pressed scaled to 0.96 · open (×) the same fill and the float shadow |
| Motion | `--kol-float-duration` · `-duration-rail` · `--kol-float-ease` · `--kol-float-enter-scale` · `-enter-shift` | 200ms · 300ms · the house curve · 0.96 · 4px — see Motion below |
| Edges | none | no hairline rims — the no-borders law holds on float |
| Roles | tones | primary = `inverted` · secondary = `secondary` · quiet = `ghost` · destructive = `danger` |
| Solid ground | `--kol-surface-secondary` + `--kol-shadow-float` | `.kol-float-solid` |
| Glass | `--kol-glass-dark-*` · `--kol-glass-light-*` | `.kol-float-glass-dark` · `-light` (`-m` for a sheet or box); a skin on the same shapes |
| Tooltip | `--kol-float-tip-h` · `-tip-t` | 24 · 11 (28 · 12), an inverted pill |

Figma: `radius/float/*`, `type/font/float`, text styles `float/<role>`, effect styles `glass/*` and `shadow/float`.

## The parts, by family

One row per family of the plan. **Where** names the package that owns it; **state** flips as the family lands
(the gap map's board rows read `have` when it has).

| W | Family | Parts | Where | State |
|---|---|---|---|---|
| 1 | Foundations | the table above | kol-theme 0.211.0 · the library | shipped 2026-11-04 |
| 2 | Controls | Button float (roles × states, icon-only, `kbd`, `bare`), Tag, Badge, Pill, ToggleSwitch, ToggleCheckbox, Slider, QuantityInput, Dropdown trigger, ViewToggle, ProgressBar, SegmentedToggle `count`, Kbd, Delta, LiveDot, SizeChip, ThemeTile (kol-styleguide), the date chip | kol-component 0.334.0 · kol-styleguide 0.21.0 · kol-theme 0.211.1 | shipped 2026-11-04 |
| 3 | Fields | Input states, LabeledControl, Textarea, SearchInput; FieldPair, PasswordInput, InlineAddRow, LinkAddRow, ColorField, ValueField | kol-component 0.334.0 | shipped 2026-11-04 |
| 4 | Menus | MenuBar (the app bar, kol-shell 0.109.0), the Menu family float, a destructive row, Dropdown fused, ContextMenu + MenuFlyout, ContentFilters; PanelsMenu, WorkspaceSwitcher, AccountMenu | kol-component 0.334.0 · kol-shell 0.109.0 | shipped 2026-11-04 · MenuBar 2026-11-05 |
| 5 | Chrome | ToolRail (+ `more`, the ⋮ — 0.109.0; the dock — horizontal, a tool's ▾ `more`, `end`, the ⌘K `search` pill — 0.113.0), PropertyRail (xs tabs, the `tab` lit — 0.103.0), transport with Timecode (`inline` the desktop 48 capsule — 0.103.0), DocumentCapsule, GlobalActions, ZoomReadout, SceneBreadcrumb, CanvasHint, SelectionMeasure, TopControlsBar, TabsRow with counts, PanelsRestore, ReaderBar, ProgressDock | kol-shell 0.101.1 · kol-component 0.335.0 (TabsRow counts + `trailing`, inspector tabs, SectionLabel +) | shipped 2026-11-04 |
| 6 | Windows | ModalHeader float (was QuickLookHeader, 0.357.0), Dialog float (+ `blocking`; `container` opens it inside a box), the useModal float confirm (ModalProvider `container`), QuickLookFrame float (the utility window), MediaLibrary float (the asset window); SummaryLine, EmptyState float, NoticeBanner, NavDrawer | kol-component 0.335.0 | shipped 2026-11-04 |
| 7 | Cards + tiles | Card float (+ the editor card: `tabs`, `foot`, `defaultFolded`, `radius="window"` — kol-dashboards 0.13.0), StatTiles float (sparkline + delta), the small metric tile; the card kinds (FloatCard, SectionHead, GroupCard, FoldedHead, SourceCard, CaptureCard, KanbanColumn, ProjectCard, LinkCard, CollapsedGroup, CoverTile, ContinueCard, AssetRow, LiveCard, TaskCard, NoteCard, PositionBlock) | kol-dashboards 0.10.0 | shipped 2026-11-04 |
| 8 | Lists + tables | Table float, DocsToc float + TocRow, ContentRow float (the link row), SpecList float; IndexRow, TaskRow, LayerRow, TreeRow, FlyoutRow (RankedList float is kol-dashboards 0.10.0) | kol-component 0.335.0 | shipped 2026-11-04 |
| 9 | Navigation + layout | NavRail float (expanded · rail · hidden · flyout), PageHeader float, text tabs, filter row, SectionText meta; AccountFooter, StatusStrip, Breadcrumb, FooterStrip, PeriodNav, DataStatus; footprints 280 · 72 · 0 | kol-component (NavRail expanded · rail, PageHeader, text tabs, filter row, SectionText) · kol-shell 0.101.0 (RailTrigger, RailFlyout, RailDisplayControls, the strips, the footprint tokens in kol-theme 0.211.1) | shipped 2026-11-04 (kol-component 0.335.0: NavRail float, SectionText float + meta, TabsRow mono tabs; the filter row composed) |
| 10 | Charts | LineChart float (selector, legend, scales, the card form); Sparkline, WeeklyBars, ProportionBar, Legend | kol-dashboards 0.10.0 | shipped 2026-11-04 |
| 11 | Calendar + reader | CalendarTimeline, CalendarMonth, CalendarWeek, CalendarDay; ReadingColumn, ReadingHighlight, ReadingActions, ReadingChapterNav, ReadingContents, ReadingPanel (+ ReadingNotes, ReadingSettings), ReadingOverview | kol-component 0.336.0 (organisms; the small parts molecules by the placement test) | shipped 2026-11-04 |
| 12 | Timeline | Timeline (toolbar · ruler · LayerTrack · lane · playhead) on the editor's transport; `TimelineRail` + `timelineView` — the same sheet from data, no engine (layouts: apps/float) | design-editor 0.26.0 (mirror of kol-fxr); TimelineRail 0.27.0 | shipped 2026-11-04 |
| — | Frame | FloatLayout — NavRail float (280 · 72 · 0 + RailTrigger + RailFlyout on hover), TopControlsBar, the content, one inspector slot, PanelsRestore while a Rail is hidden (plan-2026-11-04-float-views W1.1); `bottom` Rail under content + inspector and `eyebrow` under the bar (float-operational W1.1 · W4.2); `railMode` `push` · `overlay`, the rail keys `\` · `⇧\` (`railKeys`), RailTrigger's Show navigation row, the rail on `--kol-shadow-float` (2026-11-04); `panels={false}` drops Panels ⌄ (the way back is Show navigation and `⇧\`; an app that hides the inspector then controls `inspectorHidden`), `search` draws the search modal (CommandOverlay `surface`: RailTrigger's card, the float SearchInput, float rows lit fg-16) on the frame's `surface`; `bar.menu` draws FloatActionMenu (the inverted round +, × while open, its float sheet to the left) in the top-right corner | kol-shell 0.102.0 → 0.107.0 · kol-component 0.337.0 (`NavRail float onItemHover`) · 0.340.0 (CommandOverlay `surface`) | built 2026-11-04; runs in `apps/float` |
| 13 | Icons | 104 glyphs walked; 4 promoted (inbox · highlighter · diamond-plus — since retired, drawn by `ball` · lockup), the rest existing drawings under role names | kol-icons 0.61.0 | shipped 2026-11-04 |

## Where it is used

The float look is opt-in per component and composed in a few places: the Hub's phone nav and dock
(`AppFloatNav`), the signed-out Home's sign-in box (`AccountForm variant="box"`) and More sheet, the design
editor's chrome (design-editor), and — as each family lands — the record dashboard and metric (kol-website) on
the dashboards set. A consumer never sets `variant="float"` on a control by hand inside a composed float; the
float component passes it down.

## Motion

CSS transitions and keyframes only, no gsap (FloatActionStatesAndMotion, kol-component 0.341.0 · kol-shell 0.108.0 · kol-theme 0.212.0). The classes live in `kol-animation.css`; reduced motion turns all of it off.

| Piece | Motion | Class |
|---|---|---|
| The + card, RailTrigger's card, RailFlyout | fade in from 0.96 and 4px off the trigger's side, out the same way before unmount | `PopoverPanel motion` → `.kol-float-motion` (`data-side`, `data-exit`) |
| Search modal (CommandOverlay — the float card everywhere since kol-component 0.344.0; `anchor` sits it on the dock) | the card as above over a fading scrim | `.kol-float-motion` · `.kol-float-fade` |
| NavRail float | expand ↔ collapse eases the width, the new rows fade in; FloatLayout's hide ↔ show opens the width from 0 and closes it to 0, fading | `.kol-float-rail` (`is-entering` · `is-exiting`) |
| FloatActionMenu | the + turns 45° into the × and back (`iconMotion="rotate"`, default; `"swap"` exchanges the icon) | `.kol-float-turn` |
| Float buttons and rows | background, color, opacity and scale ease on the float clock | `.kol-btn-float` · the rows of the More sheet, RailFlyout, the rail and the float menu |

`motion` on FloatLayout, NavRail float, RailTrigger, RailFlyout, CommandOverlay, TopControlsBar, FloatActionMenu and PopoverPanel: `true` (default) the tokens · `false` none · `{ duration, ease }` per app (ms, a CSS curve or an `EASE` array). `floatMotion(motion)` resolves it; `useFloatPresence(open, ms)` holds a float in the tree while it leaves.

## Rules that came out of the map

- Radii are three, by role: list 8, sheet 20, window 28. Not one float radius.
- The `kbd` cap draws ⌘ as the `command` icon, never a typed character.
- A float control's type is Inter 500 at the control's size; its mono stays for digits (timecode, ruler, kbd).
- Selection on a float is `--kol-fg-16`; an opaque fill reads as a slab on glass.
- A float menu's panel is the theme's float surface, never its trigger's ground — an inverted trigger's tone does not ride onto `Menu variant="float"` (FloatMenuPanelInk, kol-component 0.340.1).
- An inverted float button never greys on hover: the fill stays, the opacity drops (`--kol-float-hover-opacity`). The square inverted Button keeps its `oq-inverse-40` · `-48` rungs; the label never swaps on either.
- The scrim is for a blocking task only: `Dialog` and the useModal prompts keep it; a utility window (`QuickLookFrame variant="float"`, `MediaLibrary variant="float"`, `NavDrawer`) leaves the scene live.
- The float's navigation rows are one row at four sizes (`TreeRow` xs · sm · md · lg), so sidebar, flyout and drawer read as one list.
- A calendar draws no gridlines: columns read by alignment and the weekend's fg-02, events are fg-16 bars; the exploration's 1px grid is the no-borders law's.
- The reading face is the reader's choice (`font`, default Literata, which the consumer loads — Georgia stands in); everything around the text stays Inter and JetBrains Mono. Reader parts share one family word: `Reading…`.
- The exploration's glass tiers (54 · 70 · 82 %) are a skin and were not adopted; KOL's two glass surfaces stay.
