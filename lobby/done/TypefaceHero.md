---
component: TypefaceHero
source: kol-monorepo/apps/web/src/routes/foundry/components/TypefaceHero.jsx#L1-L85
date: 2026-07-03
status: draft
deps: [Pill, ButtonGroup]
---

# TypefaceHero

## Purpose
The specimen **hero** for a typeface page: a centered stack of category pill → giant display name rendered in the typeface's own `fontFamily` → description (also in-family) → download / view-specimen CTAs → a licensing caption. Data-driven from a single `typeface` object; one component replaces the former per-font `FoundryHero*.jsx` files.

## Anatomy
- `<section>` — `py-48 md:py-72 flex flex-col justify-center text-center items-center overflow-hidden`
  - inner column — `flex flex-col items-center gap-2 max-w-[1400px]`
    - pill row — `pb-5 flex flex-col items-center gap-2`
      - `Pill variant="subtle"` → `category`
    - name block — `pb-16 flex flex-col items-center gap-0`
      - `<h1>` display name — giant type, `italic` when italic, `style={{ fontFamily }}`
      - `<p>` description — `text-xl font-semibold`, `italic` when italic, `style={{ fontFamily }}`
    - CTA block — `flex flex-col items-center gap-2`
      - `ButtonGroup` — `[{Download font, primary}, {View Specimen, outline, href, onClick}]`, `align="center"`
      - licensing `<p>` — "Free for personal and commercial use", `kol-mono-xs text-auto opacity-64 pt-4`

## Variants
No discrete variants. Single structural fork: `fontStyle === 'italic'` toggles the `italic` class on both the name and description. Everything else is continuous data variation from the `typeface` object.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| typeface | object | — | single config object; fields destructured below |
| typeface.displayName | string | — | the giant `<h1>` name text |
| typeface.fontFamily | string | — | inline `font-family` on both name and description (live in-family render) |
| typeface.fontStyle | `'italic' \| …` | — | toggles `italic` on name + description |
| typeface.category | string | — | `Pill` label |
| typeface.description | string | — | the sub-line under the name |
| typeface.specimenLink | string | — | route pushed by "View Specimen" + its `href` |

## Styling
- Section: `py-48 md:py-72 flex flex-col justify-center text-center items-center overflow-hidden`; inner `max-w-[1400px]`.
- Name `<h1>`: `text-[64px] leading-[100%] md:text-[128px] font-semibold {italic?} text-auto transition-colors duration-300`, `fontFamily` inline — this is the live font-family preview render (the whole point of the hero).
- Description `<p>`: `text-xl font-semibold {italic?} text-auto transition-colors duration-300`, `fontFamily` inline.
- Licensing caption: `kol-mono-xs text-auto opacity-64 pt-4 transition-colors duration-300`.
- Tokens: `text-auto` (theme-adaptive foreground). `transition-colors duration-300` on the type for theme cross-fade.
- **App-specific bits to DROP:**
  - **`react-router-dom` `useNavigate` coupling** — `handleSpecimenClick` calls `navigate(specimenLink)`. The DS must not depend on a router; expose an `onSpecimenClick` callback (and/or plain `href`) prop and let the app wire navigation. Drop the `useNavigate` import.
  - **Hardcoded CTA copy + config** — the two buttons ("Download font" / "View Specimen") and their variants are baked in; the "Download font" button has no handler/href at all. Lift the button set to a prop (or accept `downloadHref` + `specimenLink`) rather than hardcoding.
  - **Licensing string** — "Free for personal and commercial use" is app copy hardcoded in the component; make it a prop (`licenseNote`) authored at the call site, default off.
  - **`typeface.displayName` is not in the canonical typefaceConfig shape** (which lists `id, fontFamily, …`). Either add `displayName` to the shape or fall back to `id`/`fontFamily`; flag so the DS contract is explicit.

## States & interactions
Largely presentational. Only interaction is the "View Specimen" CTA: `handleSpecimenClick` prevents default and navigates to `specimenLink` (to be replaced by a callback prop). No internal state, no hover logic of its own.

## Dependencies
`Pill`, `ButtonGroup` from `@kol/ui`. App-only: `useNavigate` from `react-router-dom` (**drop** — see Styling).

## Recreation notes
- Tier: **organism** (full page-hero section composing multiple DS atoms + live type).
- Composes **no** `@kol/ui/foundry` primitive directly — it stands on general DS atoms (`Pill`, `ButtonGroup`). It is the specimen-page hero, distinct from `FoundryCTA`. If the DS wants the CTA row to reuse `FoundryCTA`, note that as a follow-up, but the current shape is `ButtonGroup`.
- Part of the **Type Specimen sections** set — the hero that sits above the `FoundrySection`-headed sections; keep the in-family live render (`style={{ fontFamily }}`) identical to how the other sections preview the family.
- Keep the giant name driven by inline `fontFamily` (arbitrary loaded font) — do not map to a fixed KOL type class; only the size stops (`text-[64px]/md:text-[128px]`) are Tailwind.
- Text casing at call site: `displayName`, `category`, `description`, and any CTA/license strings render verbatim — no `text-transform`. Author them in intended case.
