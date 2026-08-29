---
component: TypefaceCardRevealText
source: kol-foundry/src/TypefaceLibraryGridWithVariables.jsx#L193 · kol-foundry/src/FontPreviewSection.jsx#L8
staged: 2026-08-27
status: draft
deps: [ContentCard, TypefaceLibraryGridWithVariables, FontPreviewSection]
---

# TypefaceCardRevealText — the typeface card's hover reveal shows the foundry's Icelandic sample, not the English pangram

## Purpose

`TypefaceLibraryGridWithVariables` passes `reveal={<p>The quick brown fox jumps
over the lazy dog</p>}` — carried verbatim from the retired `TypefaceLibraryItem`.
User (2026-08-27): *"why does it use quick brown fox? we have custom text
samples in typefaces — Rennimjúkt eðal flauel etc."* That passage already lives
in the package as `FontPreviewSection`'s private `SAMPLE_TEXT`.

## Ask

1. Export the passage once — `FOUNDRY_SAMPLE_TEXT` from `glyphData.js` (beside
   `SPECIMEN_SAMPLE_TEXT`), `FontPreviewSection` reads it instead of its own
   const.
2. The grid's card `reveal` renders its **first sentence** —
   *"Rennimjúkt eðal flauel, duft slæðist niður, silkislaufa & æðardúnn, fiður
   daðra dilur, friður."* — in the typeface's own face, same reveal ramp as
   today (`text-auto-inverse text-4xl lg:text-5xl leading-tight text-center`).
   The whole passage does not fit a 500px card at that size.

## Recreation notes

- kol-foundry only; no consumer change — kol-website renders the package grid
  and passes nothing for the reveal.
- Bar for 🟢: a kol-foundry version where `/foundry` GRID hover shows the
  Icelandic line on every card.

## ✅ RESOLUTION — 2026-08-27 · kol-foundry 0.7.1

FOUNDRY_SAMPLE_TEXT exported from glyphData (FontPreviewSection reads it); the grid's card reveal renders its first sentence in the face — rendered on the grid demo's GRID hover: 'Rennimjúkt eðal flauel, duft slæðist niður, silkislaufa & æðardúnn, fiður daðra dilur, friður.' in TGRoot at opacity 1.

**Remainder here:** none — kol-website bump kol-foundry 0.7.1; no consumer change.

