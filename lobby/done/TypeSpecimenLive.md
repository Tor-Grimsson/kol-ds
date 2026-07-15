# Lobby spec — `TypeSpecimenLive` (BUILT 2026-07-10)

> Status: **built** this session. Lives at `packages/foundry/src/TypeSpecimenLive.jsx`,
> exported from the package barrel (default + named `readMeta`). Record, not to-do.

## Purpose

A **self-measuring** type specimen. One row per type class, each rendering a live
sample and reading its OWN `getComputedStyle` to print the resolved typeface /
weight / size / leading / tracking beside it. Because the labels are measured off
the real rendered element, they can never drift from the CSS: retune a token and
the specimen follows.

It is the live cousin of `TypeSpecCard` — where the card is a **static** data
sheet (consumer types the metric tuples by hand next to a sample), this component
**measures** the sample, so there is nothing to type and nothing to keep in sync.

## Provenance (read-only source)

Ported from the kol portfolio-kit (repo on disk: `kol-studio`):
`app/src/pages/TypeSpecimen.jsx` — the `readMeta(cs)` derivation and the
per-row `useLayoutEffect` + `getComputedStyle` self-measuring pattern.

Generalised for the design system:
- The kit's hardcoded `SPECS` row list is now the consumer-injected **`specs`** prop.
- The kit's hardcoded PP-Right-Grotesk / JetBrains-Mono weight-name maps and
  typeface labels are now **overridable props** (defaulted to the kit's fonts).
- Casing untouched — class names and samples render verbatim (KOL no-auto-casing).

## API

```jsx
<TypeSpecimenLive
  specs={[{ className: 'kol-sans-body-01', sample: 'Live copy…', label? }, …]}
  title?           // optional header <h2>, rendered verbatim
  description?     // optional header <p>, verbatim
  sampleClassName? // extra class(es) on every sample el (default 'text-emphasis'; '' to opt out)
  sansWeightNames? monoWeightNames? typefaceNames?  // measurement label maps
  className?       // class(es) on the root <div>
/>
```

`readMeta(cs, config)` is exported for consumers/tests to reuse the exact
derivation.

## Anatomy / DS conformance

- Root `div.kol-type-specimen-live` (namespaced hook for consumers; carries no rules).
- Each row: `flex flex-col gap-2 py-4 border-b border-fg-08` — hairline via Tailwind, no CSS file needed.
- Sample: consumer `className` (+ default `text-emphasis`), measured via ref.
- Meta readout: `kol-mono-10 text-meta`, class-name line in `text-body` — all
  DS-native classes present in this repo's theme.
- Header (optional): `kol-sans-heading-04` title, `kol-sans-body-03` description.
- **Robustness add (deviation from source):** re-measures once on
  `document.fonts.ready`, because `line-height` can resolve as font-dependent
  `normal` before the webfont lands, which would print a stale leading. The
  original measured once on mount only.

## Dependencies / CSS

- **Peer:** React only. No `@kolkrabbi/kol-component` primitives used.
- **CSS:** none required — Tailwind utilities + existing `kol-*` type classes.

## Verification

- `node --check` not applicable (JSX). Bracket-balance tokenizer (regex-neutralised) → BALANCED.
- Structural review against sibling `TypeSpecCard.jsx` / `TypeSample.jsx` patterns.
