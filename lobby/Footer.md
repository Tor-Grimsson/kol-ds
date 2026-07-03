---
component: Footer
source: kol-monorepo/apps/web/src/components/layout/Footer.jsx#L1-L148
date: 2026-07-03
status: draft
deps: [Icon, KolWordmark]
---

# Footer

## Purpose
The site footer — shipped in two variants from one file: a compact single-row bar (`FooterSimple`, L13-L51) and a full tall footer with the wordmark, link columns, and a back-to-top control (default `Footer`, L53-L148). The DS has no footer at all; this fills that gap. Currently app-welded (hardcoded KOL routes, socials, and copyright) — spec it behind a clean prop seam.

## Anatomy
```
FooterSimple (compact):
<footer class="relative z-10 bg-surface-tertiary px-4 py-6 md:px-6 lg:px-8">
  <div class="flex justify-between items-center">
    <p class="kol-label-compact text-xs uppercase">© {year} Kolkrabbi</p>
    <div class="flex items-center gap-4">{socials.map → <a><Icon size=16/></a>}</div>
    <button onClick={scrollToTop} class="kol-label-compact text-xs uppercase">↑ Back to top</button>

Footer (full):
<footer class="relative z-10 bg-surface-tertiary pt-12 px-4 pb-8 md:pt-16 … min-h-[500px]">
  <div flex-col justify-between min-h-[…]>
    <div flex md:flex-row md:justify-between gap-8…>
      <div class="reveal h-10 lg:h-12"><Link to="/"><Wordmark/></Link></div>       ← brand
      <div flex gap-12… pt-[40px]>
        <column> Menu:     Work · Prints · Stack · Foundry · Studio                 ← links[]
        <column> Workshop: Design System · Components · Apparat · Documentation     ← links[]
        <column> Follow:   Instagram · Behance · Dribbble · YouTube · TikTok        ← socials[]
    <div class="relative z-20">
      <div class="border-t" (--kol-border-default, opacity .6)/>
      <div flex justify-between>
        <p>© {year} Kolkrabbi</p>
        <button onClick={scrollToTop} onMouseEnter={handleHover}>↑ Back to top</button>  ← hover bounce
```
Column links are `kol-heading-sm` at inline `fontSize: 32px`, colored `var(--kol-surface-on-primary)`, with per-link JS `onMouseOver/Out` opacity swaps and `reveal` entrance (`--reveal-delay`).

## Variants
- **FooterSimple** — one flex row: copyright · social-icon strip · back-to-top. `bg-surface-tertiary`, `py-6`. For dense/utility pages.
- **Footer (full)** — `min-h-[500px]`, wordmark + three link columns (Menu / Workshop / Follow) + a bottom rule with copyright and an animated back-to-top (hover triggers a delayed `translateY(-4px) scale(1.1)` bounce, 800ms, via `isAnimating` state).

## Props
*(current: none — all data hardcoded. Target prop seam below.)*
| prop | type | default | controls |
|------|------|---------|----------|
| variant | `'simple'`\|`'full'` | `'full'` | which layout (unify the two exports under one component) |
| links | array of `{ label, items: [{ label, href/to }] }` | — | the link columns (full) — replaces hardcoded Menu/Workshop |
| socials | array of `{ name, href, label }` | — | social icons/links (both variants) |
| brand | node | `<KolWordmark/>` | brand block slot (full: wordmark link; drop hardcoded `to="/"`) |
| backToTop | bool \| fn | `true` | show the back-to-top control; optional custom handler (default `scrollTo({top:0})`) |
| copyright | node | — | replaces the hardcoded "© {year} Kolkrabbi" |

## States & interactions
- **Back to top:** `scrollToTop` = `window.scrollTo({ top: 0, behavior: 'smooth' })`. Full variant adds a hover micro-interaction: `handleHover` sets `isAnimating` true after 100ms, resets after 800ms, animating the `↑` glyph (`translateY`/`scale`).
- **Link hover:** inline `onMouseOver/onMouseOut` toggling `opacity` (0.7 ↔ 1) per link — not CSS `:hover`.
- **Reveal:** `.reveal` + `--reveal-delay` CSS for staggered entrance (app animation hook).
- No open/close, focus-trap, or keyboard wiring — static content region.

## Styling
- Tailwind utilities + KOL tokens: `bg-surface-tertiary`, `kol-label-compact`, `kol-heading-sm`; colors via CSS vars `--kol-surface-on-primary`, `--kol-border-default`. Socials via `Icon` (16px). Column heads `text-xs uppercase`.
- **Note (KOL rule):** `text-xs uppercase` on the copyright/column labels is a `text-transform`. Per KOL conventions components shouldn't auto-uppercase — author the label strings in their final case at the call site and drop the `uppercase` on recreation.
- Transitions: `transition-opacity` on links + the 800ms back-to-top bounce.
- **App-specific bits to DROP / convert (this is the whole extraction job):**
  - **Hardcoded `socialLinks`** (L5-L11, the 5 KOL socials) → `socials` prop.
  - **Hardcoded route links** — Menu (`/work`, `/prints`, `/stack`, `/foundry`, `/studio`) and Workshop (`/workshop/*`) → `links` prop.
  - **Hardcoded copyright** "© {year} Kolkrabbi" (both variants) → `copyright` prop (keep the auto year as default).
  - **react-router `Link`** (brand + column links) → accept `href`/`to` per link + a `linkComponent` seam so it's router-agnostic; brand becomes the `brand` slot (drop `to="/"`).
  - The per-link inline `onMouseOver/Out` opacity JS should become a CSS `:hover` rule on recreation.

## Dependencies
- **@kol/ui:** `Icon` (socials), `KolWordmark` (brand — full variant).
- **react-router-dom:** `Link` — to be abstracted behind link props / `linkComponent`.
- React `useState` (full variant's hover animation).

## Recreation notes
- Tier: **organism** (page-region chrome). Ship both layouts under **`## Variants`** of one `Footer` (a `variant` prop) rather than two exports — or keep `FooterSimple` as a thin preset that renders `<Footer variant="simple"/>`.
- Prop seams to add: **`links[]`**, **`socials[]`**, **`brand`**, **`backToTop`**, **`copyright`** — this is the clean seam the brief calls for; nothing else should be hardcoded.
- Compose **Icon** for socials and **KolWordmark** as the default `brand` slot. Convert the inline hover-opacity JS to CSS and gate the back-to-top bounce on `prefers-reduced-motion`.
- Drop the app CSS hooks (`reveal`/`--reveal-delay`) or expose entrance animation as an opt-in prop — don't hard-require the app's animation stylesheet.
