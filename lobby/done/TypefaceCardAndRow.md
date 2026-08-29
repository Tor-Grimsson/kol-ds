---
component: TypefaceCardAndRow
source: kol-website/apps/web/src/components/sections/foundry/TypefaceLibraryGridWithVariables.jsx#L132-L181 (the tuned DS card/row) · TypefaceLibraryItem.jsx#L76-L197 (the local reference)
staged: 2026-08-27
status: draft
deps: [ContentCard, ContentRow, ContentText, ContentMedia, kol-theme]
---

# TypefaceCardAndRow — the typeface row's ink ladder, the card's title voice, and a hover reveal on the card

Tuned locally on kol-website `/foundry`'s typeface library, side by side with
the local `TypefaceLibraryItem` (user's order: get it right here first, then
ONE ticket with the final values). Every value below is approved on screen.
Three asks.

## 1. `ContentRow typeface` — ink ladder

The ramp steps the name and the classification down to `text-body` (64) on
the theory that the specimen carries the one emphasis. Ruled otherwise on
screen: **name and classification are full ink, the year steps to 64.** Type
classes do not move — this is ink only.

| slot | shipped (0.94.0) | ruled |
|---|---|---|
| title | `kol-mono-14 uppercase text-body` | `kol-mono-14 uppercase` **full ink** (`text-emphasis` / `text-auto`) |
| body (styles) | `kol-mono-12 text-meta` | unchanged |
| detail (classification) | `kol-mono-14 text-body` | `kol-mono-14` **full ink** |
| date (year) | `kol-mono-12 text-meta` | `kol-mono-12 text-fg-64` |

The specimen band stays consumer content in `footer` (a measured, shrink-to-fit
alphabet — the family never owns it). Hover needs nothing: the row is a link,
the 1% wash / 24% frame already fire when it is.

## 2. `ContentCard typeface` — the title is the ROW's title

Shipped card title: `kol-mono-16 text-body`. Ruled: **the same string as the
row** — `kol-mono-14 uppercase`, full ink. Body `kol-mono-12 text-meta`
unchanged. One title voice for the typeface family in both forms.

## 3. `ContentCard typeface` — hover reveal

The card already steps its surface to `surface-inverse` on hover, and then
nothing happens: the plate keeps its ink on the inverse plate and the glyph
sits there. The shipped item's hover (verbatim, approved):

- plate text (title + body) → `opacity: 0`, 300ms
- the media (the `Ðð` glyph) → `opacity: 0`, 300ms
- a **reveal** node fades in `opacity 0 → 1`, 300ms, `absolute inset-0 flex
  items-center justify-center p-8 pointer-events-none`
- the reveal on the library: `<p class="text-auto-inverse text-4xl lg:text-5xl
  leading-tight text-center" style="font-family: <the face>; font-weight: 400">
  The quick brown fox jumps over the lazy dog</p>`

Ask: a `reveal` prop (ReactNode) on `ContentCard` — typeface only for now.
When present, the card owns the choreography (plate + media out, reveal in,
all 300ms on the house curve); the consumer owns only the node, since what it
says and which face it wears are never the family's. Without `reveal` the
card behaves as today.

Local wiring that this replaces (all on `group-hover`, since the card root is
the `.group`): `titleClass`/`bodyClass` carrying `group-hover:opacity-0
transition-opacity duration-300`, and a two-layer `media` node (glyph layer
`group-hover:opacity-0`, pangram layer `opacity-0 group-hover:opacity-100`).

## Recreation notes

- `ContentText.jsx` RAMP.typeface: `row.title` → `… text-emphasis`, `row.detail`
  → `… text-emphasis`, `row.date` → `kol-mono-12 text-fg-64` (or a role that
  resolves to 64 — `text-body` does today; either, as long as it reads 64);
  `card.title` → `kol-mono-14 uppercase text-emphasis`.
- `ContentCard.jsx` canvas layout: render `reveal` as a sibling of the plate,
  above it; a `kol-card-reveal` rule pair in kol-theme keyed on
  `.kol-card:hover` for the three opacity moves.
- Nothing else in the family moves.

## ✅ RESOLUTION — 2026-08-27 · kol-theme 0.64.0 · kol-component 0.95.0

(1) Row ink ladder as ruled: title kol-mono-14 uppercase text-emphasis, detail kol-mono-14 text-emphasis, date kol-mono-12 text-fg-64, body unchanged — measured on the comparison row: emphasis / 48 / emphasis / 64. (2) Card title = the row's string, kol-mono-14 uppercase text-emphasis — measured. (3) reveal on ContentCard (typeface / canvas): .kol-card.has-reveal — plate + media fade to 0, the reveal node to 1, 300ms house curve, hover:hover only, reduced-motion opt-out; measured plate 1→0, media 1→0, reveal 0→1. Without reveal nothing changes.

**Remainder here:** none — kol-website bump kol-theme 0.64.0 + kol-component 0.95.0; the library drops its group-hover titleClass/bodyClass wiring and the two-layer media node — media is the glyph, reveal={<p className="text-auto-inverse …" style={{ fontFamily }}>The quick brown fox…</p>}.

