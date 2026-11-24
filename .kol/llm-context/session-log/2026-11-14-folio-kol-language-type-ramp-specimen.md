# Session: Folio web-style page, KOL component language, type ramp and the Specimen system

**Date:** 2026-11-14
**Agent:** Claude (Opus 5.5) + kol-figma-agent runs
**Summary:** Folio's record-style views squared off and mapped onto KOL components; agents now start from the KOL vocabulary; a new type ramp defined and documented; the Specimen sheet system built in the type file and moved into the library on a new Styleguide page, connected to tokens.

## Changes Made

### Files Modified
- `.kol/llm-context/plan-2026-11-13-ebook-web-style*.md`, `plan-2026-11-14-folio-float-prep.md`, `plan-2026-11-14-kol-language.md`, `plan-2026-11-14-folio-default.md`, `plan-2026-11-14-ds-pass.md`, `plan-2026-11-14-type-ramp.md` — the session's plans.
- `docs/documentation/01-foundations/15-type-ramp.md` (new) — ramp (48 steps: size + line height only), ramp/style/set definitions, MarkdownPage's three reading styles, tracking per font, guidelines, formulas.
- `docs/documentation/01-foundations/16-type-references.md` (new) — Material, Atlassian, Tailwind, Carbon compared.
- `docs/documentation/INDEX.md`, `01-foundations/INDEX.md` — read-first row and index rows.
- `packages/theme/kol-typography.css` — `--kol-font-family-sans` → Inter (unpublished, held for his go: changes every consumer).
- `~/.dotfiles/claude/skills/kolds` → `kol-ds`, `claude-kol-ds` → `kol-ds-claude` (updated: 26 packages, two styles, taxonomy always read); `~/.dotfiles/ref/skill.md`, `bin/ref` names.
- `~/.dotfiles/claude/agents/kol-figma-agent.md` — step 0 loads `kol-ds-claude` first; copy the code, never choose.
- `~/.dotfiles/claude/skills/kol-figma/LAW.md` — rule 21 (copy the code, never choose), rule 22 (new work gets its own section).

### Features Added/Removed
- Float file `↳ ebook-web-style`: record style only, sections by view, surfaces, Quick Look, editor states, Parts section, KOL-language table (540:4456) with library instances, find & replace dialog in both styles.
- Float file `↳ folio-default`: Folio vs KOL default comparison, KOL screens on the Inter mode.
- Library: `fg-inverse` + `oq-inverse` full scales, QuickLookFrame variants by kind, `type` modes Inter / Special Gothic (display cuts only) / JetBrains Mono / Schibsted Grotesk / Public Sans, ramp variables; page `↳ Styleguide` with the Specimen components and a Previews section (2153:1973), bound to theme/spacing/type.
- Type file (`mmBE8t8EcxSdN7g4bUeHok`): stripped of links, Type kit, Specimen page (31:12399), Specimen test (39:27295) rebuilding his views from instances.

## Current State

### Working
- Specimen system passes his view test (39:27295 vs 36:42385; font column 40:30756 matches 36:39993).
- Library Styleguide page connected to tokens; previews built.

### Known Issues
- Library not yet published after the Styleguide work (his).
- Raw values without tokens on Specimen (paddings 120/96/100, a few gaps, radii 24/8); navy inks now neutral KOL ink.
- Display samples D1–D3 cut off at 1360 inner width; tabular figures not settable by plugin.
- Inter in code built but unpublished (affects every consumer).

## Next Steps
1. His publish of the library; the type file's sheets switch to library Specimen.
2. W5 rulings on ramp, weights and sets; then W7 (kol-theme ramp tokens, kol-styleguide Specimen in code).
3. Parked DS round items in AGENT-CONTEXT (Quick Look look-check, PlaybackBar tone, rails review, Special Gothic, type ramp rebuild of the old styles).
