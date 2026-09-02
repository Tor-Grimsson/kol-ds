# Session: The controls package, the xs ladder, and the showcase held to its own law

**Date:** 2026-09-02
**Agent:** kol-ds-ui (iMac)
**Summary:** Twelve tickets closed on arrival across kol-monitor · kol-mirror · kol-website — a twelfth package minted (`kol-controls`), the size ladder given `xs` on every family, and the showcase finally run against the DS's own full-consumption greps, which it was failing.

## Changes Made

### The twelfth package — `@kolkrabbi/kol-controls`
- **`KolControlsPackage`** (kol-monitor) — hardware panel controls for instruments, lifted class-for-class from monitor's rack: `Knob` · `Fader` · `Toggle` · `FlipToggle` · `LED` · `IconButton` · `Selector` · `PanelDropdown` · `TextInput` · `PanelLabel` · `ModuleHeader` · `JackSocket` · `LabeledJack` · `RockerSwitch` · `ParamSheet` + `armLongPress`. Three renamed only where kol-component owns the name. Tokens `--monitor-*` → `--kol-ctl-*` in kol-theme's `kol-components-controls.css` (hardware caps theme-INVARIANT off `--kol-color-ab-*`; LEDs deliberately off the palette; jack roles HEX because the glow appends a hex alpha). Consumer contexts became seams: `ModuleHeader powered`, `JackSocket`'s routing props, `iconComponent`. 15 demos, a system doc, ARCHITECTURE §3 paragraph.
- **`ControlsJackSeams`** → 0.2.0: `JackSocket ringRef` (merged callback ref — the glow loop and the consumer's hit-test registry share one element) and `LabeledJack jackComponent`.
- **`ControlsXsRung`** → 0.3.0: `TextInput` · `PanelDropdown` · `Selector` retired to `_tmp/2026-09-01-controls-retired/`; the package is now exactly the twelve with no app twin. `IconButton` stays — lit border + momentary pulse are hardware semantics.

### The xs rung — one ladder, every family (user ruling)
- theme 0.126.0 → **0.127.0**, component 0.159.0 → **0.160.0**. `xs` = `kol-mono-8` in a 22px shell (20 icon-only), `--kol-radius-xs`. First on `Input` · `Dropdown` · `Stepper` · `Button` + the glyph ladders (SOLO 12 · ADJACENT 10 · INDICATOR 8); then — *"what kind of half ass DS ships partial sizes haphazardly"* — `Textarea` · `SearchInput` · `SegmentedToggle` · `ToggleSwitch` · `Badge` · `Tag` · `IconFrame`, each with its own theme rule.
- **`Input onCommit`** (draft ref, so a blur in the same tick as the last keystroke commits what was typed) and **`Stepper options`** (steps a list, wraps, same event shape).
- **`DropdownXsList`** — the open list followed the trigger's rung; the xs row wears `kol-mono-8`, not the helper face, because the trigger's ghost stack measures in the trigger's face.
- **`StepperInlineVariant`** → 0.161.0: `layout="inline"`, `‹ value ›` on one line, 3ch floor, no field chrome.

### The showcase held to the full-consumption law
- Ran `00-overview/04-full-consumption.md`'s six greps on `showcase/` for the first time — **it failed its own checks**. Worked: the Components catalog's hand-rolled filter row → `ContentFilters`; `/icons` → brand's `IconsGallery` ported verbatim with BOTH sets (`/icons/:set`), the local `SegGroup` list retired to `_tmp/2026-09-02-icons-page-retired/`; inline `var(--kol-oq-08)` → `bg-/border-oq-08`; a raw `z-[1]` → a later sibling; Tailwind `font-mono` → the family token.
- **Gate 26 — `validate:consumption`** (`scripts/validate-consumption.mjs`): checks 2 · 5 · 6 over `showcase/src/{pages,lib,nav}`; `demos/` `sets/` `blocks/` `usage/` exempt because showing raw code is their job. Clean run recorded in `lobby/INDEX.md` history, the law notes the gate.

### Mobile defects from three consumers
- **shell**: `drawerOpenOn` (0.37.0) and its same-hour regression `ShellDrawerOpenOnUnstableDep` (0.37.1 — an array default in a dep array closed the drawer after every tap; 0.37.0 deprecated); `ShellRailCollapsedWithTapOpen` (0.38.0) then **`RailGrabTapIsALine`** (0.39.0 — the disc + chevron was my shape, not the ruling; the opener is the strip itself, thicker); `ShellDrawerCloseOnSamePath` (0.40.0 — the rung's tap decides the drawer, not only the route change); `SettingsShortcutsGridColumns` (0.36.0 — the fourth home of cols-as-command).
- **component**: `ShellDrawerBottomSide` (0.153.0), `ContentCardExpandedSplitStacks` (0.156.0), `ProfileCard` promoted (0.154.0 → 0.155.0 with shelf seams: `shelfTheme` · `shelfBackground` · `controlVariant` · `pad`), `CardTagsNoVisibleFill` + `NewsletterFormGapOffLadder` (0.158.0), `ContentFiltersViewStripOverflow` (0.163.0 `viewPlacement`), `ContentCardActionsInsetShorthand` (0.162.0), `SectionNewsletterSubmitVariant` (0.157.0), and **0.164.0** `trailingPlacement` + the open search taking the row — both found holding the showcase to the law.
- **theme**: `SliderCoarsePointerHeight` (0.122.0), `ProseTitleFixedSize` (0.125.0 — three prose display steps on the ladder, capped with `min()`), `IconButtonNoFlexShrink` (0.129.0 — `flex: none`).

### Shipped
controls **0.1.0 → 0.3.0** (new) · component 0.152.0 → **0.164.0** · theme 0.120.1 → **0.129.0** · shell 0.34.0 → **0.40.0** · workshop **0.27.0**

## Current State

### Working
- 26 gates clean; every publish verified by unpacking the npm tarball, not the source tree — that habit caught nothing broken this session, which is the point.
- Inbox 0, queue 0, ledger squared; twelve tickets closed with `lobby-close`, receipts filed.
- The showcase passes checks 2 · 5 · 6 and a gate keeps it there.

### Known Issues
- ⚠️ **`lobby-close` writes a `date · repo` staged cell for a consumer-filed ticket** that my ledger mover's regex did not match — one row squared by hand. Worth a dotfiles ticket if it recurs.
- ⚠️ **kol-website's `apps/brand/src/pages/IconsGallery.jsx` is now behind the showcase's copy** (no signal set, no SET picker). Not filed — the user has not ruled whether brand should gain it.
- ⚠️ The `metadata` gate reports 35 of 82 component MDX descriptions over 8 words — mined from package JSDoc, not enforced, still true.
- ⚠️ `Quarantine` · `SearchResults` · `Lobby` still carry small hand-rolled filter chrome; out of the gate's scope decision only because they are not catalogs.

## Next Steps
1. Ask whether kol-website's brand gallery should gain the signal set — one registry row, one ticket.
2. The remaining hand-rolled filter chrome (Quarantine, SearchResults, Lobby) onto `ContentFilters` if the user wants the sweep finished.
3. A `resolve` gate (from 2026-09-01) is still unbuilt — import every barrel in a node pass so a moved file's stale relative import fails before publish.
