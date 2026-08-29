---
component: FoundrySpecimenSections
source: kol-website/apps/web/src/components/sections/foundry/{FoundryOpentypeFeatures,FoundryTypefaceDetails,FoundryTypefacePairing}.jsx + components/ui/{FeatureCard,FeatureGrid,PairingCard,PairingsList}.jsx + styles/ui.css (foundry rules) — copies + screenshots in `_assets/2026-08-27-foundry-specimen-sections/`
staged: 2026-08-27
status: draft
deps: [SpecimenSectionHeader, GlyphMetricsSection, GlyphMetricsGrid, VariableFontSection, ContentFilters, ContentText, SectionCardItem, IconFrame, Divider, FontLoader]
---

# FoundrySpecimenSections — the last three specimen sections move up, their two cards join the family, and five slug-page defects in the package get fixed

Ruled on screen by the user on `/foundry/typefaces/malromur` (2026-08-27), one
pass. Eight asks. Screenshots named per ask in the assets folder.

## A. Three specimen sections → kol-foundry (the last of the fork)

`FoundryOpentypeFeatures` · `FoundryTypefaceDetails` · `FoundryTypefacePairing`
— siblings of the nine synced in `FoundryComponentsReconcile`, never in the
package. Local files are the source (copied to `_assets/…/`). They already
render on the package's `SpecimenSectionHeader` (`label` / `icon` / `size="md"`
/ `showDropdown={false}`).

## B. Their two cards, unified onto the family — not a new "Foundry card"

**OpenType Features + Typeface Details** both render `FeatureGrid` of
`FeatureCard`: a framed text tile — title (`kol-card-title uppercase`) + body
(`kol-card-excerpt text-fg-64`), optional 16px icon top-right, `fg-08` frame,
hover 1% wash + 24% frame (`ui.css` `.feature-card`). That is a
`SectionCardItem` with no visual. Ask: **`SectionCardItem` renders text-only
when it has no `visual`** (no 96px icon fallback — title + description tile at
the same frame/hover as today's `.feature-card`), so both sections are a row
of `SectionCardItem`s and the local card + CSS retire. ⚠ **Hover only, never a
persistent selected state** — the local grid kept the last-hovered card lit
(user: "this is wrong, neither All Typefaces nor Font Pairing does this");
removed locally today, must not come back.

**Font Pairings** renders `PairingsList` of `PairingCard`: two columns (face
name in its own family · tag · description) around a vertical `Divider`,
`fg-08` frame, same 1%/24% hover. Ask: a kol-foundry **`PairingCard`** on the
family's typeface voices — ruled today and applied locally, verbatim:

| slot | was | ruled |
|---|---|---|
| name | `.foundry-title` 20/28/36px in the face | unchanged — the face is the point |
| tag ("Precision") | `kol-mono-12 text-fg-64` | **`kol-mono-14 uppercase text-emphasis`** — the `ContentRow typeface` title voice |
| description | `kol-mono-10 italic text-fg-32` | **`kol-mono-12 text-meta`** — the row's body voice |
| divider | `Divider vertical` default 16px | **taller — 96px**, reads as the card's seam |

`.foundry-title` / `.pairing-card` / `.feature-card` rules from `ui.css` are in
the assets; they retire with the swap.

## C. `GlyphMetricsSection` — one axis, one dropdown

A font with no italic but a weight axis renders **two identical dropdowns**
("Light / Light"): `GlyphMetricsSection.jsx:83-91` feeds `valueOptions` into
both the style slot (`styleOptions`, because `showDropdown` is false) and the
weight slot. No italic → the style dropdown is not rendered; the axis
dropdown alone.

## D. `GlyphMetricsGrid` — the cell outline is full ink

Cells wear `outline outline-offset-[-0.5px] outline-auto` (`:239`) — a 1px
**full-ink** line. User: "why is the border so harsh? bug or design choice?" —
a bug. The family hairline: `fg-08` (`--kol-border-default`), like the metric
lines beside it already use.

## E. `GlyphMetricsGrid` — grey out glyphs the font does not carry

The grid draws every character of `glyphSets` regardless (the Ğ in
`glyph-viewer-fallback-glyph.png` is the browser's fallback face). Ask: ask
the loaded font (`FontLoader` / opentype `charToGlyphIndex` > 0) and render a
missing glyph at **`text-fg-24`, not clickable, no hover** — "that way I see
what's missing and people don't click characters that aren't part of the
font".

## F. `VariableFontSection` — plate, not frame

`:138` `rounded border border-fg-16 bg-surface-primary`. Ask: **no border,
`bg-surface-secondary`** (user offered `bg-fg-08` as the alternative; the
opaque plate is the pick — no seam through it).

## G. `ContentFilters` — the title's icon gap matches the specimen header

`ContentFilters.jsx:298` `h2 … gap-2` (8px) between the `IconFrame` and the
title; `SpecimenSectionHeader` uses `gap-3 md:gap-4` (16px at md) and reads
right (`specimen-header-gap-correct.png` vs `filters-title-gap-tight.png`).
Ask: same gap on the bar's title — 16px from md.

## Recreation notes

- A + B + C + D + E + F: kol-foundry. B's text-only tile and G: kol-component.
- Peer floor stays component ≥0.95.0 · theme ≥0.64.0.
- Bar for 🟢: kol-foundry + kol-component versions where a slug page renders
  the three sections from the package on the family cards (no `ui/Feature*`,
  `ui/Pairing*`, no `ui.css` foundry rules left in the site), one dropdown on
  a roman-only face, hairline cells, dimmed missing glyphs, a borderless
  variable-font plate, and the bar's title gap at 16.

## ✅ RESOLUTION — 2026-08-27 · kol-foundry 0.8.0 · kol-component 0.97.0 · kol-theme 0.66.0

(A) FoundryOpentypeFeatures · FoundryTypefaceDetails · FoundryTypefacePairing are in kol-foundry with the site's data as defaults (props override). (B) SectionCardItem renders text-only with no visual — the .feature-card frame + hover verbatim (kol-card-feature--text: fg-08 frame, 1% wash + 24% frame on hover, 300ms, hover only), no 96px icon; both sections are rows of it. PairingCard is a kol-foundry molecule on the ruled voices (tag kol-mono-14 uppercase text-emphasis, description kol-mono-12 text-meta, 96px Divider, .kol-pairing-card chrome). (C) GlyphMetricsSection: the axis rides the weight slot only — one dropdown on a roman-only face. (D) cells wear border-fg-08, outline gone. (E) a glyph the parsed font lacks (charToGlyphIndex 0) renders text-fg-24, no click, no hover. (F) VariableFontSection plate: no border, surface-secondary. (G) ContentFilters title gap 16 from md. Rendered: 4 tiles at min-h 180 / fg-08 → 24% on hover / no 96 icons; 3 pairing cards with a 96px seam; 1 dropdown; cell border 0.08; 5 glyphs dimmed on the demo font; plate border 0 on surface-secondary; h2 gap 16px.

**Remainder here:** none — kol-website bump kol-foundry 0.8.0 + kol-component 0.97.0 + kol-theme 0.66.0; import the three sections from the package; delete ui/FeatureCard, FeatureGrid, PairingCard, PairingsList and the ui.css foundry rules (.foundry-title, .pairing-card, .feature-card).

