# Plan — Float, all of it

**Raised:** 2026-11-04, the user, on the float gap map (kol-float--style XY6adCImPaxDuHDO6OdUw9, page `↳　float style`): *"I want a plan that just rams through everything, I dont wana do this in tiny pieces"*, then *"other agent is done you are good to go on the plan /kol-goal /playbook get it done"*.
**Status:** ACTIVE — 2026-11-04. Open: all.
**Shape:** W › phase › list.
**Source:** the W3 build list on the page (150 of 168 elements: 77 differ, 73 missing). Each W2 board row is the acceptance specimen: the exploration piece is the target look.
**Laws carried:** float = Inter + JetBrains Mono. No borders without his approval. Icons use oq, never fg. `variant` is the only word. Every look/API change lands in the Figma library the same turn. Packages ship raw source. Never delete: retired code → `_tmp/`, retired masters → `_trash`. Library publish is his click; npm publish is mine once verified.
**How a family closes:** every row on its board flips to `have` (the library instance sits beside the exploration piece and matches), the repo gates covering the change are green, a Playwright shot of the showcase preview matches the exploration piece, Code Connect emits the new props. Families run as background agents, one at a time.

## W0 — Defaults, decided for review
- 0.1 Radii: menu 8 · sheet/panel 20 · window 28 · pill. `--kol-float-menu-r` 26 → 20 (touch 30 → 24); `--kol-float-window-r` 28 new.
- 0.2 Focus: a 2px ring in `--kol-surface-on-primary` on every float control (accessibility basics are never simplified away).
- 0.3 Selection on float: `--kol-fg-16` (white 16%), not `--kol-oq-16` — the approved glass fix, now the rule for solid too.
- 0.4 No hairline edges: the exploration's 7% white rim stays out (no-borders law).
- 0.5 Button roles are tones: primary = `inverted` · secondary = `secondary` · quiet = `ghost` · destructive = `danger`. No new role words.
- 0.6 Type: the exploration's 12 roles as `kol-float-*` classes in kol-theme on `--kol-font-family-float: "Inter"`, Inter self-hosted (`public/fonts/inter/InterVariable*.woff2`, OFL, fetched 2026-11-04).
- 0.7 States: hover `--kol-fg-08` lift, pressed `--kol-fg-16`, disabled 40% — one ladder for every float control.

## W1 — Foundations
- 1.1 kol-theme: the tokens above into `kol-design-tokens.css` (float block), the Inter `@font-face` into `kol-typography.css`, the `kol-float-*` type classes.
- 1.2 Figma: `float/*` variables (radii, state alphas) and the 12 Inter text styles in the library's foundations.
- Acceptance: W2.0 rows 2 · 3 · 5 read have.

## W2 — Controls (rows 6–35)
- 2.1 Button float: role tones × hover · pressed · focus · disabled; icon-only sm/md/lg; keyboard-hint slot (`kbd` prop); text link = `bare`; 30 small pill = `sm` on touch.
- 2.2 Tag, Badge, Pill, ToggleSwitch, ToggleCheckbox, Slider, QuantityInput, Dropdown trigger, ViewToggle: `variant="float"`.
- 2.3 SegmentedToggle float `count` on a segment; Kbd draws ⌘ as the command icon in the library too.
- 2.4 New: Delta, LiveDot, SizeChip (kol-component atoms); ThemeTile (kol-styleguide); ProgressBar float 4px.
- 2.5 Date chip = MenuDatePicker trigger float.

## W3 — Fields (rows 36–45)
- 3.1 Input float: focus · error (+ message) · disabled; LabeledControl float; Textarea float; SearchInput float with the kbd hint.
- 3.2 New: FieldPair (two-up), PasswordInput (eye), InlineAddRow, LinkAddRow, ColorField (swatch + hex), ValueField (read-only).

## W4 — Menus (rows 46–60)
- 4.1 Menu family float look: MenuPanel 8 radius sheet 20, rows 34, destructive row (`tone="danger"`), Dropdown fused float.
- 4.2 ContentFilters float (capsule chips with counts); Avatar + Menu composed as `AccountMenu`.
- 4.3 New: PanelsMenu (name · state · action rows), WorkspaceSwitcher.

## W5 — Chrome (rows 61–81)
- 5.1 New in kol-shell: ToolRail, PropertyRail (SettingsSections float with header collapse, chip tabs, section +), Timecode in AppFloatNav transport, DocumentCapsule, GlobalActions, ZoomReadout, SceneBreadcrumb, CanvasHint, SelectionMeasure, TopControlsBar, PanelsRestore, ReaderBar, ProgressDock.
- 5.2 TabsRow float: icon + label + count slot in a 56 pill.

## W6 — Windows (rows 82–94)
- 6.1 QuickLookHeader float (icon · title · minimise · close); Modal / Dialog `variant="float"` (28 radius, scrim only when blocking); confirm with the warning header; QuickLookFrame float = the utility window (tabs, autosave footer, resize corner); MediaPicker float panel.
- 6.2 New: SummaryLine, EmptyState, NoticeBanner; NavDrawer float.

## W7 — Cards + tiles (rows 95–114) — FIRST with W10: record and metric are on them this week
- 7.1 kol-dashboards Card float (sheet 20, title · count · controls · fold); StatTiles float with sparkline + delta; the small metric tile.
- 7.2 New card kinds as Card children/variants: FloatCard (mono lines), SectionHead (count + description), GroupCard (rows + add row), FoldedHead, SourceCard, CaptureCard, KanbanColumn, ProjectCard, LinkCard, CollapsedGroup, CoverTile, ContinueCard, AssetRow float, LiveCard, TaskCard, NoteCard, PositionBlock.
- 7.3 Figma: the kol-dashboards set drawn in the library for the first time (none of it is there today).

## W8 — Lists + tables (rows 115–126)
- 8.1 Table float (mono head, share column, cover + status cells); RankedList float; TocRow numbered + current; ContentRow url + ↗; SpecList float.
- 8.2 New rows: IndexRow, TaskRow, LayerRow, TreeRow, FlyoutRow.

## W9 — Navigation + layout (rows 127–144)
- 9.1 NavRail float: expanded (280, switcher, search, tree, display controls), rail (72, 44 slots, active bar), hidden + trigger, hover flyout; nav item with count + chevron.
- 9.2 PageHeader float (mono eyebrow, subtitle); TabsRow text tabs; filter row composed; SectionText meta-right; Divider.
- 9.3 New: AccountFooter, StatusStrip, Breadcrumb, FooterStrip, PeriodNav, DataStatus. Layout footprints 280 / 72 / 0 as kol-theme tokens.

## W10 — Charts (rows 153–157) — FIRST with W7
- 10.1 LineChart float: metric selector, legend, y scale, date axis; the card form (title · meta · value · 30 days ago → Today).
- 10.2 New in kol-dashboards: Sparkline, WeeklyBars, ProportionBar, Legend.

## W11 — Calendar + reader (rows 158–161, 145–152)
- 11.1 kol-component organisms, record the consumer: CalendarTimeline, CalendarMonth, CalendarWeek, CalendarDay, event chip, time gutter, quick-add bar.
- 11.2 Reader: ReadingColumn (Prose float with position line + highlight), Highlight + note marker, PassageActions, ChapterNav, ContentsPanel (DocsToc numbered + progress), NotesPanel, ReadingSettings, BookOverview.

## W12 — Timeline (rows 162–167) — built HERE (his ruling 2026-11-04: *"you don't choose what to build … that includes timeline and everything … grab the latest version from FXR … nothing in the plan is negotiable"*; the ticket filed earlier that day was withdrawn)
- 12.1 Refresh the `packages/design-editor` mirror from kol-fxr's current source first (the 2026-10-08 pattern: fxr develops, the DS mirrors after the fact), so the timeline lands on fxr's latest.
- 12.2 In `packages/design-editor`: Timeline — toolbar · ruler · LayerTrack · lane (keyframes, clip, waveform) · playhead — on the float tokens, driven by `createTransport()` (kol-hardware). From the W2.12 board (node 47:8853).
- 12.3 Figma library: the component drawn; rows 162–167 → have; design-editor published; a note to fxr that the mirror carries it.

## W13 — Icons (row 168)
- 13.1 The 42 missing glyphs through `/lobby-icon` from the W2.13 tiles; 07-icons re-synced; Code Connect.

## W14 — Close
- 14.1 The gap map regenerated: inventory and boards re-run, zero differs, zero missing.
- 14.2 Publish wave (kol-theme, kol-component, kol-dashboards, kol-shell, kol-styleguide, kol-icons), registry verified once; library publish is his click; receipts for W12.

**Order:** W0 · W1 · W7 · W10 · W2 · W3 · W4 · W5 · W6 · W8 · W9 · W11 · W12 · W13 · W14.
