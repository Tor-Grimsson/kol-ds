# RailKit

**Staged:** 2026-10-24 · from a kol-monitor session
**Change:** a rail kit and an `apps/rails` reference — the one source of truth for how a Rail is built: anatomy, parts, widths and padding per tier (app · site), the bottom Rail included

---

## The problem, in one case
Every app improvises its Rails, because the DS ships the parts (`SettingsPanel`, `LabeledControlSection`, `SettingsRow`, `SegmentedToggle`, `Divider`, `Rail`) but no recipe. Monitor's patch table (`src/overlays/PatchTableOverlay.jsx`) came out 440 wide with its own padding and a hand-made table; its `H` Rail and stage Rail improvise the same way. The user (2026-10-24): *"the patch rail design sucks. wrong width wrong layout … FXR uses a system of components to structure their rails … does DS need to ship a better rail instructions? im not opposed to some sort of set or apps/rails? if we can have some reference source of truth."*

The good one is fxr's inspector rail — and it is fxr's OWN stylesheet, not the DS's: `~/dev/projects/kol-fxr/src/editor/styles/kol-editor.css` (`kol-compose-rail`, `kol-compose-rail--inspector`, `kol-compose-inspector-body`, `kol-rail-grab`), composed in `src/editor/labs/LabsView.jsx` `LabsRail` and `src/editor/compose/inspectors/*`. Its anatomy: an uppercase title; segmented tabs (Generate · Style · Animation); label/value rows (TYPE · CATEGORY · PRESET … a label column and a control column); a divider between groups; segmented Off/On rows; a hint line; full-width action buttons and an action row with icon buttons; a FOOT slot with its own segmented tabs (Transport · Output · File) and a transport row.

**Sizes are not standard either.** The app Settings Rail (`SettingsPanel variant="rail"`) is 380 wide, and its padding is different from the rail monitor built on the same component and from fxr's — the user: *"currently settings is showing 380 wide and padding is totally different in the rail and the settings."* There is no width or padding per TIER: the DS ships an `app` and a `site` variant elsewhere (cards, page headers, layouts), and a Rail should take the same split.

## The fix
1. **The kit** — the parts of a Rail as components, from fxr's inspector: `RailHeader` (title, actions, ×), `RailTabs` (segmented), `RailSection` (label, divided), `RailRow` (label · control, the label column fixed), `RailHint`, `RailActions` (full-width and icon rows), `RailFoot` (its own tabs + a slot). Names are yours; the anatomy is fxr's. `SettingsPanel` is rebuilt on the same parts, so Settings and every page Rail are one thing.
2. **Size standards per tier** — `variant="app" | "site"` on the Rail: one width (or a small ramp) and ONE padding scale per tier, written as tokens. Settings and every page Rail read them, so the 380-and-different-padding split cannot happen again. Decide the app tier's numbers from fxr's inspector and the Settings Rail side by side.
3. **`apps/rails`** — the reference: every part on its own, then whole rails — the app Settings Rail, an inspector like fxr's (tabs, rows, actions, foot transport), a list rail like monitor's patch table (rows with a per-row action, an add section) — in both tiers.
4. **The bottom Rail too** — monitor's edit Rail (`src/rack/Workbench.jsx`: a bottom `Rail`, resizable, no scrim, a push side Rail inside it with Edit · Rack · Library, the view filling the height) belongs in `apps/rails`: **openable and selectable from an action button** on the page, like every other rail there, so the bottom and side rails are judged in the same place.

## Rejected alternative
Monitor copying fxr's `kol-editor.css` rules locally — a third private copy of the anatomy, the drift this ticket exists to end.

## Definition of done
- [ ] the rail parts shipped; `SettingsPanel` built on them
- [ ] `variant="app" | "site"` with width + padding tokens per tier; Settings and page Rails read them
- [ ] `apps/rails`: the parts, the three whole rails in both tiers, and a bottom Rail like monitor's — each opened from an action button
- [ ] fxr's inspector checked against the kit (it can adopt later)
- [ ] Published; kol-monitor's receipt names the version

## 🟢 CLOSED — 2026-10-24 · kol-component 0.301.0 · kol-theme 0.189.0 live

The kit (`RailHeader` · `RailTabs` · `RailHint` · `RailActions` · `RailFoot`; `RailSection` = `LabeledControlSection`, `RailRow` = `SettingsRow`), `Rail variant="app" | "site"` + `footer` (pinned), the tier tokens (`--kol-rail-w-app` 320 · `--kol-rail-w-site` 380 · `--kol-pad-rail-*` = the overlay inset), `SettingsPanel tier` on them with `RailHeader` and its foot pinned, `apps/rails` (5206: the parts, the settings rail, an inspector like fxr's, a list rail like monitor's patch table, the bottom rail — each from its button, both tiers), `04-compositions/19-rails.md` with fxr's inspector checked against the kit (every part maps; fxr's own deviations are its 20/16 padding and the 264 · 320 ramp). The app number is decided for review on open questions round 18 (264 · 320 · 380). Walk `_tmp/2026-10-24-rail-kit/walk.mjs` 25/25, render gate on rails clean. Registry live. Receipt returned to kol-monitor's outbox.
