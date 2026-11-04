---
component: StyleguideNoMiddots
source: kol-styleguide@0.21.0 src/{brandBook.js,StationeryMocks.jsx,comboLayouts.jsx,LayoutGuide.jsx,PrintStudio.jsx}
staged: 2026-11-04
status: draft
deps: []
---

# StyleguideNoMiddots — no `·` in kol-styleguide's shipped copy

## Purpose
The user's standing law (kol-website, 2026-11-04): *"NO FUCKING BULLETS IN TITLES"* — and on designed copy: *"when someone completely ASSRAILS a single character like you have done to poor bullet, then I almost have to say strip them all."* kol-website stripped every `·` from its own source (139 lines in 31 files, comments excepted). What is left on record.kolkrabbi.io/brand comes from this package: `04 — LOGOS · CONCEPT`, `05 — LOGOS · TYPES`.

## The 20 lines (outside comments)
- `brandBook.js:26, 29, 30, 44, 46, 50, 51` — section labels `NN — part · name` (`01 — about · key messages`, `04 — logos · concept` …)
- `brandBook.js:89–92` — stationery rows `Business card · front`, `Envelope · DL`, `Letterhead · A4`
- `StationeryMocks.jsx:210, 341, 376, 380` — the letterhead / card contact lines and the separator span
- `comboLayouts.jsx:79, 83, 87` — `PRIMARY · 50`, `LIGHT · 25`, `DARK · 25`
- `LayoutGuide.jsx:168` — `text · token`, `bg · token`
- `PrintStudio.jsx:109` — `N sheets · A4`

## The replacement rule (the one kol-website used)
| what | before | after |
|---|---|---|
| a label's two parts | `04 — logos · concept` | `04 — logos, concept` (or the name alone) |
| an item and its variant | `Letterhead · A4` | `Letterhead, A4` |
| a value list on one line | `web  ·  city, country  ·  phone` | the parts with a gap (spans + gap), no glyph |
| a separator element | `<span>·</span>` | spacing, no glyph |

## Recreation notes
- Copy-only; no API change. A one-line check in the gates (no `·` in `src/` outside comments) keeps it from coming back.
- Consumer: kol-website bumps kol-styleguide when it ships; nothing local to undo.

## ✅ RESOLUTION — 2026-11-04

**kol-styleguide 0.22.1** (live). Every `·` gone from shipped copy: two-part labels take a comma (`04 — logos, concept`, `Letterhead, A4`, `PRIMARY, 50`, `N sheets, A4`, `entity, Kt.`, the signature's role line); the letterhead contact line and the signature's email/web line are separate spans on `gap-x-5`. New gate `validate:no-middots` (in validate-all) fails any `·` in packages/styleguide/src outside comments.
