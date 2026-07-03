---
component: ImageBlock
source: kol-monorepo/apps/web/src/components/prose/blocks/ImageBlock.jsx#L1-L41
date: 2026-07-03
status: draft
deps: [Image]
---

# ImageBlock

## Purpose
Renders an image inside a semantic `figure` with an optional label and caption, aspect-locked, for use inside `.kol-prose` long-form. Currently welded to `SanityImage` + a Sanity `value` object. The recreation splits out a plain caption'd **`Figure`** primitive that takes a resolved `src` and composes DS `Image` — that `Figure` is the reusable core (shared with `VideoBlock`/`VideoFigure`).

## Anatomy
- Guard: returns `null` when `value.asset` is missing.
- `<figure className="kol-prose-figure">`
  - label (optional) `<div className="kol-caption-label">`
  - aspect box `border border-fg-08 rounded overflow-hidden aspect-[5/3]`
    - `<SanityImage image={value} alt className="w-full h-full object-cover">`
  - caption (optional) `<figcaption className="kol-caption-text">`

## Variants
None. Fixed `5/3` aspect.

## Props
Current input is a single Sanity `value` object — **DROP it, flatten to:**

| prop | type | default | controls | (from Sanity `value.*`) |
|------|------|---------|----------|----------|
| src | string | — | Resolved image URL | (currently `value` → `SanityImage` builder) |
| alt | string | `''` | Alt text | `value.alt` |
| label | string | — | Small label above the frame | `value.label` |
| caption | string | — | Caption below the frame | `value.caption` |
| aspect | string | `'5/3'` | Frame aspect ratio | (hardcoded `aspect-[5/3]`) |

## Styling
- Classes: `kol-prose-figure`, `kol-caption-label`, `kol-caption-text` (prose CSS), `border-fg-08`, `rounded`, `aspect-[5/3]`, `object-cover`.
- Tokens: `border-fg-08`.
- **App-specific bits to DROP:** `SanityImage` (`apps/web/src/components/media/SanityImage.jsx` — wraps `@sanity/image-url`'s `imageUrlBuilder` + the shared `sanity` client) → replace with DS `Image` taking a **resolved `src`**. The `value` Sanity object → flat props. Hardcoded `aspect-[5/3]` → an `aspect` prop.

## States & interactions
Static. Renders nothing when the asset is missing.

## Dependencies
- `SanityImage` — to be **replaced by DS `Image`**.
- Recreation extracts a shared `Figure` primitive (also consumed by `VideoBlock`).

## Recreation notes
- Tier: **molecule** (atom-ish once the `Figure` is split out).
- Extract **`Figure`** = `<figure className="kol-prose-figure">` → optional `kol-caption-label` + aspect box (`border border-fg-08 rounded overflow-hidden aspect-[{aspect}]`) wrapping `children` + optional `figcaption.kol-caption-text`. This is the **shared shell** for both `ImageBlock` and `VideoBlock` — build it once.
- `ImageBlock` = `Figure` wrapping DS `Image({ src, alt, className: 'w-full h-full object-cover' })`. Drop `SanityImage` + the `value` shape → flat `{ src, alt, label, caption, aspect }`.
- Reconcile with the **near-duplicate** image renderer in `apps/web/src/components/portable-text/components.jsx` (a bare `<img src={asset.url} loading="lazy">` with **no** aspect box) — converge both onto the `Figure`.
- Text casing at call site: `label` / `caption` are content — render as authored, no transform.
