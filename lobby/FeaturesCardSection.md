---
component: FeaturesCardSection
source: kol-monorepo/apps/web/src/components/sections/shared/FeaturesCardSection.jsx#L7-L127
date: 2026-07-03
status: draft
deps: [ButtonGroup, CardFeatureItem, Button]
---

# FeaturesCardSection

## Purpose
A feature-showcase section organism: an optional two-part header (heading + mono lede) over a responsive grid of feature cards, capped by an optional centered `ButtonGroup` of CTAs. Fully prop-driven — `features[]` render as `CardFeatureItem` molecules, `actions[]` feed the `ButtonGroup`, and every wrapper/grid/header container exposes a `className` escape hatch. This is the canonical "N-up feature cards + CTA" band used on Home, Studio, Foundry in-development, and every Collections overview page. Currently ships with hard-coded default `features`/`actions` (studio homepage copy + CDN images) — those defaults are app content and must NOT move into the DS.

## Anatomy
```
<section class="w-full [sectionClassName]">
  <div class="[wrapperClassName]">                         ← default: w-full flex flex-col gap-8 md:gap-10 max-w-[1400px] mx-auto
    {showHeader &&
      <div class="[headerClassName]">                       ← default: w-full pt-[224px]
        <div class="flex items-center h-8">
          <p class="kol-heading-md text-auto">              {headerLabel}
        <p class="kol-mono-sm text-auto opacity-60 mt-3 [headerTextWidthClass]">   {headerDescription}
    }
    <div class="[cardsWrapperClassName]">                    ← default: self-stretch inline-flex flex-col md:flex-row md:h-72 justify-start items-center gap-6
      {features.map(f =>
        <div class="reveal flex-1" style={--reveal-delay: index*0.15s}>
          <CardFeatureItem title icon visual description href backgroundColor imageAspectRatio />
      )}
    {shouldShowActions &&
      <div class="reveal-group w-full flex justify-center [buttonGroupClassName]">   ← default pad: pt-10 pb-24
        <ButtonGroup buttons={actions} align={buttonAlign} />
    }
```
Header, cards, and action row are each independently gated (`showHeader`, `features.length`, `showActions && actions.length > 0`).

## Variants
- **With / without header** — `showHeader` toggles the heading + lede block.
- **With / without CTA row** — `showActions` (and a non-empty `actions[]`) toggles the `ButtonGroup`.
- **Card count / layout** — driven entirely by `features[]` length; default `cardsWrapperClassName` is a horizontal flex row (`md:flex-row md:h-72`) that a consumer can swap for a grid via the override.
- **Action alignment** — `buttonAlign` (`center` default) passed through to `ButtonGroup`.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| features | `{title,icon,visual,description,href,backgroundColor,imageAspectRatio}[]` | app defaults (DROP) | cards rendered as `CardFeatureItem` |
| showHeader | boolean | `true` | render header block |
| headerLabel | node | app default (DROP) | `kol-heading-md` title |
| headerDescription | node | app default (DROP) | `kol-mono-sm` lede |
| showActions | boolean | `true` | render CTA `ButtonGroup` |
| actions | `{label,variant,href,className}[]` | app defaults (DROP) | buttons passed to `ButtonGroup` |
| sectionClassName | string | `''` | extra classes on `<section>` |
| wrapperClassName | string | `w-full flex flex-col gap-8 md:gap-10 max-w-[1400px] mx-auto` | outer column |
| cardsWrapperClassName | string | `self-stretch inline-flex flex-col md:flex-row md:h-72 justify-start items-center gap-6` | card grid/row |
| buttonGroupClassName | string | `pt-10 pb-24` | CTA row padding |
| buttonAlign | string | `center` | `ButtonGroup` alignment |
| headerClassName | string | `w-full pt-[224px]` | header container |
| headerTextWidthClass | string | `w-full md:w-[30%]` | lede width |

## States & interactions
No interaction of its own — a layout section. All hover/focus lives inside `CardFeatureItem` (whole-card link) and the `ButtonGroup` buttons. Each card wrapper carries the `reveal` scroll-reveal class with a staggered `--reveal-delay` (`index * 0.15s`); the CTA wrapper carries `reveal-group`. Responsive: cards stack column-wise below `md`, become a fixed-height (`md:h-72`) row at `md`+.

## Styling
- Type: `kol-heading-md` (header title), `kol-mono-sm` (lede, `opacity-60`).
- Tokens: `text-auto` foreground; layout via Tailwind utilities (all inline, keep). `max-w-[1400px] mx-auto` page constraint.
- **App-specific bits to DROP:**
  - `cdnBase` + the `variant` theme-suffix logic (`-w` for light) that builds Backblaze image URLs — app CDN + asset scheme, not DS.
  - `defaultFeatures` (Type Foundry / Client Work / Collections / Workshop copy, icons, routes, images) — app content.
  - `defaultActions` ("Explore Projects" `/work`, "Get in Touch" `mailto:hello@kolkrabbi.io`, `border border-fg-08`) — app copy/routes.
  - `headerLabel`/`headerDescription` string fallbacks ("Typefaces & Design Systems…") — app copy.
  - `useTheme` import exists only to compute the image `-w` suffix; drop it with the CDN defaults.
  - `reveal` / `reveal-group` / `--reveal-delay` scroll-reveal classes are app animation infra — re-tier as a DS reveal modifier or drop.

## Dependencies
- **ButtonGroup** (`@kol/ui`) — renders the CTA row from `actions[]`.
- **CardFeatureItem** — staged separately (`lobby/CardFeatureItem.md`); the card molecule this section composes.
- **Button** (via `ButtonGroup`) — composition dependency for the action buttons.

## Recreation notes
- Tier: **organism** (header + card grid + CTA composed from a molecule).
- **Taxonomy dedupe:** three near-identical implementations exist in the app — this file, `sections/home/WorkshopFeatures.jsx`, and `workshop/organisms/CardFeatures.jsx`. Staging this one is the reconciliation target; the other two collapse into it and are deleted on adoption. (This is the most-consumed of the three — 8 route consumers.)
- Prop/slot seam: keep `features[]` and `actions[]` as the two data slots; keep the `*ClassName` overrides so the same organism serves a horizontal row (Home) and a grid (Collections). Everything hard-coded (CDN base, default features, default actions, header fallbacks) is app content — drop from the DS default, make the props required or empty-default.
- Text casing at call site: header/lede/labels are authored strings — no auto-transform. Card titles carry their own casing inside `CardFeatureItem`.
- The `reveal`/`--reveal-delay` stagger is presentational animation from the app layer — recreate as an optional DS reveal wrapper or omit; do not hard-couple the DS organism to app scroll-reveal CSS.
