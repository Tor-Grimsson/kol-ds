---
component: CardFeatureItem
source: kol-monorepo/apps/web/src/components/workshop/molecules/CardFeatureItem.jsx#L1-L96
date: 2026-07-03
status: draft
deps: [Icon]
---

# CardFeatureItem

## Purpose
The feature-card molecule rendered by `FeaturesCardSection`: a fixed-height card with a title + optional icon header, a flexible visual middle (image, inline SVG-as-mask tinted with `currentColor`, or an arbitrary node), and a mono description footer. The whole card is optionally a link — internal (`react-router` `Link`) or external (`<a target=_blank>`) chosen by inspecting `href`. Auto-detects an `.svg` `visual` string and renders it as a `mask-image` block so line-art inherits the theme foreground.

## Anatomy
```
<a|Link|div class="[baseClasses] border-auto [hover border]">      ← baseClasses below
  <div class="w-full flex items-center justify-between gap-2">      ← header
    <h3 class="kol-helper-uc-md text-auto text-[16px]">  {title}
    {icon && <Icon name={icon} size={16} class="flex-shrink-0 text-auto" />}
  <div class="w-full flex-1 flex items-center justify-center overflow-hidden [aspectClass]">   ← visual
    visual is string?
      .svg  → <div class="w-full h-full bg-current rounded" style={mask-image: url(visual), contain/no-repeat/center}>
      else  → <img src={visual} alt={title} class="w-full h-full object-cover rounded" style={objectPosition: imagePosition}>
    visual is node? → {visual}
    no visual → <Icon name={icon} size={96} class="text-auto" />
  <p class="kol-mono-xs text-auto opacity-50">  {description}
```
`baseClasses = w-full flex-1 h-[304px] md:h-72 p-4 md:p-6 gap-4 {backgroundColor} rounded border flex flex-col justify-between items-start overflow-hidden`

## Variants
- **Visual type** — auto: `.svg` string → `currentColor` mask block; other string → `<img object-cover>`; ReactNode → rendered as-is; nothing → large 96px fallback `Icon` (uses the header `icon` name).
- **Link mode** — `href` `http*`/`mailto` → external `<a target=_blank rel=noreferrer noopener>` (hover `border-fg-32`); other `href` → router `<Link>` (hover `border-fg-24`); no `href` → static `<div>` (no hover).
- **Aspect ratio** — `imageAspectRatio` maps to `aspect-[9/6]` | `aspect-[10/6]` | `aspect-video` | `aspect-square` | `auto` (none).

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| title | string | — | header heading (`kol-helper-uc-md`) |
| icon | string | — | `Icon` name in header; also the 96px fallback |
| visual | string \| SVG \| node | — | image URL / `.svg` mask / inline node |
| description | string | — | footer line (`kol-mono-xs opacity-50`) |
| backgroundColor | string | `bg-surface-on-inverse` | card background token class |
| href | string | — | link target; `http`/`mailto` → external anchor, else router `Link` |
| imageAspectRatio | `auto\|9/6\|10/6\|16/9\|1/1` | `auto` | visual aspect class |
| imagePosition | string | `center` | `<img>` `object-position` |

## States & interactions
- **Hover (linked cards only):** border brightens — external → `hover:border-fg-32`, internal → `hover:border-fg-24`, both `transition-all duration-300`. Static (no-`href`) card has no hover.
- No focus/selected state of its own beyond the native link focus.
- Visual middle flexes (`flex-1`) to fill between the fixed header and footer; card height is fixed (`h-[304px] md:h-72`).

## Styling
- Type: `kol-helper-uc-md` + `text-[16px]` (title), `kol-mono-xs` (description).
- Tokens: `text-auto`, `border-auto`, `bg-surface-on-inverse` (default bg), `bg-current` (SVG mask tint), hover `border-fg-24`/`border-fg-32`. `rounded`, `object-cover`.
- SVG-mask block: inline `maskImage`/`WebkitMaskImage: url(visual)` + `maskSize:contain`, `maskRepeat:no-repeat`, `maskPosition:center` — the identity trick for `currentColor` line-art; keep it.
- **App-specific bits to DROP:**
  - `Link` from `react-router-dom` — the internal-route branch. DS `Button`/card should own routing via an `as`/link-component prop rather than importing the app router.
  - `imageAspectRatio` default `auto` and the aspect map are fine; no app copy baked in here.

## Dependencies
- **Icon** (`@kol/ui/atoms`) — header icon (16px) and empty-state fallback (96px).
- **Link** (`react-router-dom`) — internal routing; a coupling to remove (see DROP).

## Recreation notes
- Tier: **molecule** (header + adaptive visual + footer; optional link wrap).
- Staged as the child of `FeaturesCardSection` — recreate the two together; the section passes exactly `{title,icon,visual,description,href,backgroundColor,imageAspectRatio}` per card.
- Prop/slot seam: keep `visual` polymorphic (string URL | `.svg` mask | node). The `.endsWith('.svg')` sniff and the `href.startsWith('http'|'mailto')` sniff are the reusable branching core — keep, but route the internal case through a DS link seam, not `react-router` directly.
- Text casing at call site: `kol-helper-uc-md` is a type-class style, not a JS transform — author `title`/`description` in their final case at the call site; no `toUpperCase`/`text-transform` in the component.
- No hard-coded copy in this file — the app copy lives in `FeaturesCardSection`'s defaults, which are dropped there.
