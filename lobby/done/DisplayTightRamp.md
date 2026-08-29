---
component: DisplayTightRamp
source: kol-website/apps/web/src/routes/Stack.jsx#L118-L150 + components/sections/home/HomeHero.jsx
staged: 2026-08-27
status: draft
deps: [kol-theme, SectionText]
---

# DisplayTightRamp — display-01/02 go Tight 500; `kol-display-lg` retires; one type system

## Purpose

kol-theme carries two display voices side by side:

| class | face | size |
|---|---|---|
| `.kol-display-lg` | **Right Grotesk Tight 500** (`--kol-font-family-sans-tight`, `TightMedium`), uppercase baked in | `--kol-text-display-tight-01` = 48 / 64 |
| `.kol-sans-display-01` / `-02` | Right Grotesk **Narrow** 500 | 56 / 80 · 44 / 56 |

`display-lg` is the last survivor of the retired size-named ramp (`xs/sm/md/lg`)
— kept when the Tight cut was added, never folded into the numbered roles.
User, 2026-08-27: *"the lg is correct, MORE correct than the numbered ramp …
I thought we just had narrow and compact … make 01 and 02 tight 500, replace
the lg and retire lg … delete that old system out of theme so we only have
one system."*

## Ask

1. **`.kol-sans-display-01` and `.kol-sans-display-02` → Right Grotesk Tight,
   weight 500** (the `display-lg` face). Sizes stay on the numbered tokens.
   Case stays a role (`headlineCase="upper"` on `SectionText`), not a transform
   on the class — `display-lg`'s baked uppercase does not carry over.
   `display-03` / `-04`: the DS's call whether the Tight face runs the whole
   display ramp (recommended — one face per ramp) or stops at 02.
2. **Retire `.kol-display-lg`** — alias to `display-02` (its nearest size,
   44/56 vs 48/64) for one release, then delete. `--kol-text-display-tight-01`
   and `--kol-font-family-sans-tight` stay as tokens; the class goes.
3. **Delete the old size-named system** — after this, no `-xs/-sm/-md/-lg/-xl`
   type class exists in kol-theme (`display-lg` is the only one left; the
   `heading-*` size names are already gone).
4. Retirements ledger row + BREAKING changelog entry.

## Consumer state (kol-website)

- `kol-display-lg` ×5 (HomeHero, Stack, NotFound, PrintsGridGsap, Demo) →
  `kol-sans-display-02` on return.
- Dead already: `kol-heading-lg` ×5 · `kol-heading-md` ×3 · `kol-heading-xs`
  ×1 (ErrorBoundary, DashboardComponents, Demo, NotFound) — classes that no
  longer exist in the theme; swapped to numbered heading roles in the same
  pass here.

## ✅ RESOLUTION — 2026-08-27 · kol-theme 0.59.0

The display ramp is Right Grotesk Tight 500, one face, four rungs, no tracking: .kol-sans-display-01/02/03 move off Narrow, .kol-sans-display-04 (32/36/40) ships — SectionHero's media headline defaulted to that role since component 0.80.0 with no rule behind it. The elder voice (kol-display-lg / -section / -section-sm / -subsection) ships as aliases onto 01 / 02 / 03 / 03 keeping their uppercase, first CSS rows in 04-retirements.md; the gate now detects CSS aliases and lists importers (kol-website x8, kol-mirror x4, kol-chess x2). Measured all eight classes at 1280/768/390.

**Remainder here:** none — kol-website bump kol-theme 0.59.0; swap kol-display-lg -> kol-sans-display-01 uppercase (NOT 02 — lg and 01 are both 96px at desktop; 02 tops at 64), kol-display-section -> kol-sans-display-02 uppercase, kol-display-section-sm -> kol-sans-display-03 uppercase; the dead kol-heading-lg/md/xs swaps you already did stand.

