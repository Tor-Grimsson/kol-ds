---
component: PageHeader / HubSettings (kol-shell)
source: kol-fxr /settings at 390 (AppHub's HubSettings, kol-shell 0.62.0)
staged: 2026-10-09
status: draft
deps: [PageHeader, SettingsScaffold, ContentFilters]
---

# HubSettingsHeaderAt390 — the Settings header collapses badly on a phone

## Purpose
kol-fxr's global audit (plan 21 § A, 2026-10-09, finding A13), `/settings` at 390 wide: the header's lede *Configuration and preferences* wraps to three lines beside the *Open a chrome* dropdown and two icon buttons; below it the *SETTINGS* label, the options/shortcuts `ViewToggle` and *ABOUT · REPO* stack as three ragged rows. The same header reads fine at 1600 (one row, actions right). Shot: kol-fxr `_tmp/2026-10-09-plan-21-walk/A-settings-390.jpg`.

## Anatomy
```
PageHeader
├─ title + lede (left)
└─ actions (Open a chrome · theme · gear)        ← squeezes the lede at 390
SettingsScaffold header row
├─ PREFERENCES · filter · search (left)
├─ SETTINGS (right label)
├─ ViewToggle (options / shortcuts)
└─ ABOUT · REPO tabs                              ← three rows at 390
```

## Variants
Desktop (one row) · phone (<768): the actions drop UNDER the title, full width; the scaffold's strip becomes one scrollable row (label · toggle · tabs) or the tabs fold into the toggle.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| — | — | — | a responsive rule inside `PageHeader` / `SettingsScaffold`; no new prop |

## Styling
At 390 the `PageHeader` keeps `flex-row` with the actions cluster at natural width, so the lede column gets ~110px. Ask: `flex-col` under 768 with the actions as a full-width row; the scaffold's header row `flex-wrap` into one ordered line, not three.

## States & interactions
Unchanged.

## Dependencies
`PageHeader` (kol-component), `SettingsScaffold` / `HubSettings` (kol-shell), `ContentFilters`.

## Recreation notes
A kol-shell (+ possibly kol-component `PageHeader`) minor. kol-fxr passes nothing today (`HubSettings` is the Hub's page) and needs only the bump; if the fix wants a `header` prop, name it in the return.


---

## Resolution — 2026-10-09 · 🟢 closed

**Shipped `@kolkrabbi/kol-component@0.246.0`** (kol-shell 0.63.0 peers it). No new prop.
- `PageHeader` (via `SectionText`'s inline actions): below `md` the actions drop under the lede as
  their own full-width row; the zero-height baseline trick is a desk rule now. The lede is one line.
- `ContentFilters`: below `md` the view strip and the trailing controls share ONE wrapping line, in
  the desk's order (trailing, then the strip, so a consumer's divider sits between) — fxr's toggle ·
  SETTINGS was two ragged rows. The layout strip (ABOUT · REPO) stays in the filter row, where it is
  on the desk too, so the phone mirrors the desk's two rows instead of three.
Walked on `apps/editor-hub` `/settings` at 390 and 1600 (`_tmp/2026-10-09-fxr-four/`); desk unchanged.

For fxr: bump kol-component to ^0.246.0 and kol-shell to ^0.63.0; nothing else.
