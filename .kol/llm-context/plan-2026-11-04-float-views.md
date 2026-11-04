# Plan — Float views + FloatLayout in apps/float

**Raised:** 2026-11-04, the user, after the element plan (`plan-2026-11-04-float-everything.md`) closed with no views built. Points verbatim: *"we need a place to experiment the layouts.. im saying apps/float"* · *"we will make the visual editor (layout not function)"* · *"we will make record-dashboard-tool … and the alternative · sidebar · float layout · folio ebook libary reaader · metrics"* · *"And we need this in a layout shell … LayoutFloat or FloatLayout? we would use the sidebar obvio."* · *"we need a home for float. a place to check what exists."*
**Status:** W1–W3 built — 2026-11-04 (kol-component 0.337.0 · kol-shell 0.102.1 · kol-dashboards 0.11.0 · design-editor 0.27.0). DONE — W4 moved to its own plan (`plan-2026-11-04-float-set.md`).
**Shape:** W › phase › list.
**Laws carried:** views are built ONLY from shipped KOL parts (`@kolkrabbi/*`) — a missing part goes back into its package first, never drawn locally; float tokens + Inter; no borders; icons on oq; `variant` is the only word; never delete (→ `_tmp/`); never git; agents on Opus/Sonnet, check once at the end; one board at a time; never name the outside icon library.
**How a phase closes:** measurable acceptance line first, gates green, then Playwright at 1600 × 1080 against the exploration frame and his words.

Source file: kol-float--style `XY6adCImPaxDuHDO6OdUw9`, page `_source`.

## W1 — FloatLayout (the shell)

### 1.1 — FloatLayout in kol-shell — ✅ built 2026-11-04
Source: "Float · Adaptive workspace — full-size mock UI" (9:15449); its rule sheet "Float · Adaptive workspace — cards, panels & selection" (9:15179).
- Assemble from shipped parts: NavRail float (72 rail · 280 expanded · hidden + trigger · hover flyout), TopControlsBar, a content slot, PropertyRail as the shared inspector slot, PanelsRestore as the hidden-panel pill.
- Behaviour from the rule sheet: expanded / folded workspace, one inspector whose fields follow the selection, hidden-panel recovery.
- Acceptance: rail 72 / 280 / 0 measured; top bar 64 tall; inspector 272 wide on radius 20; restore pill visible exactly when a panel is hidden; no horizontal scroll at 390; zero hex colours and zero local component definitions in the file.

## W2 — apps/float

### 2.1 — The app — ✅ built 2026-11-04
- `apps/float` on FloatLayout, one route per view below, a Home that lists them; dev server on the network like the other apps.
- Acceptance: every route renders with no console errors; `pnpm --filter float build` green; app imports only `@kolkrabbi/*` + React.

## W3 — The views (layout, not function)

Each view: exploration text and numbers as drawn; built from shipped parts; Playwright screenshot beside the Figma frame.
Acceptance for every phase: the view's key boxes (rail, bars, panels, cards) within ±4 px of the frame at 1600 × 1080; type Inter / JetBrains Mono at the frame's sizes; no part redrawn locally.

### 3.1 — Visual editor (9:8594, "Visual editor · Scene editing") — ✅ built 2026-11-04
- Full screen with its own chrome — no app rail (the frame is the whole screen).
- Top bar (document capsule, mode tabs Editor · Labs · Randomiser · Morph, more, undo/redo, Export, account), tool rail, canvas with selection measure, transport with timecode, property rail, the Timeline.

### 3.2 — Record dashboard tabs (13:5037) — ✅ built 2026-11-04
- The record dashboard tool navigated by tabs.

### 3.3 — Record dashboard float (9:14340) — ✅ built 2026-11-04
- The same record dashboard without tabs, on the FloatLayout aspect (rail, inspector, restore pill).

### 3.4 — Rails (9:14486) — ✅ built 2026-11-04
- Every float rail in one view: the nav rail in all its states (expanded 280, rail 72, hidden with its trigger, hover flyout), the tool rail, the property / inspector rail, the bottom rail (timeline), and the overlay.

### 3.5 — Float layout / adaptive workspace (9:15449) — ✅ built 2026-11-04
- The shell itself shown full, with the Tasks content (Briefs, Todos, Other) and the inspector.

### 3.6 — Folio (13:6897) — PARKED: its own app, its own plan
- A whole system, not one view: library, reader (article = single, ebook = chapters), writer (md, text, code) and the connections between them. Proposed home `apps/folio` (one word, singular — the bulletin's app-naming law); planned separately.

### 3.7 — Metrics (13:6898) — ✅ built 2026-11-04

## W4 — Homes for float — moved to `plan-2026-11-04-float-set.md`

## Open — TALK

- None. (Folio → `apps/folio`, agreed 2026-11-04; its own plan.)
