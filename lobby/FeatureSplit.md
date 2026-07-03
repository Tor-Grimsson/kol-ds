---
component: FeatureSplit
source: kol-monorepo/apps/brand/src/components/styleguide/FeatureSplit.jsx#L1-L40
date: 2026-07-03
status: draft
deps: [Button]
---

# FeatureSplit

## Purpose
An editorial media-and-text split section: a text column (kicker / title / body / either a stats strip OR a CTA row) beside a media column (image/video with an optional gradient veil + caption). Two-column on desktop, single-column stacked below 900px. Used as the main hero on the marketing `/site` page and as a repeating "feature pull" block. The look is carried by `.site-feature*` rules — those must move with the component.

## Anatomy
```
<section class="site-feature [className]" style={bgImage?}>   ← full-bleed (100vw)
  <div class="max-w-[1200px] mx-auto grid grid-cols-1 min-[901px]:grid-cols-2 items-center gap-[clamp(48px,6vw,96px)] [innerClassName]">
    <div class="flex flex-col gap-4 max-w-[640px] [columnClassName]">   ← text column
      <span class="site-feature-kicker">   kicker
      <h1   class="site-feature-pull">      title   (supports <em> accent)
      <p    class="site-feature-body">      body
      <div  class="site-feature-meta flex flex-wrap gap-y-7 gap-x-12 pt-4">   ← stats strip (meta[])
        <div class="flex flex-col gap-0.5">
          <span class="site-feature-meta-num">   m.num
          <span class="site-feature-meta-label"> m.label
      <div class="flex flex-wrap gap-4 pt-2">   ctas   (button row)
    <div class="site-feature-visual relative aspect-[4/5] rounded-[4px] overflow-hidden">   ← media column
      {media}
      <div  class="site-feature-visual-veil" aria-hidden>   ← only if caption
      <span class="site-feature-visual-caption">  caption
```
`meta` and `ctas` are mutually exclusive by intent ("pick one"). Media column renders only when `media` is passed.

## Variants
- **stats variant** — pass `meta` (array of `{num, label}`); renders the bordered stats strip.
- **CTA variant** — pass `ctas` (a node, typically a Button row); renders a wrap-flex button row.
- **with background** — `bgImage` sets an inline cover background on the section.
- **with caption** — `caption` adds the bottom gradient veil + mono caption over the media.
- **title accent** — `title` may contain `<em>` for the italic accent-color pull (`.site-feature-pull em`).

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| kicker | node | — | mono uppercase eyebrow (accent color) |
| title | node | — | `<h1 class="site-feature-pull">`; `<em>` → italic accent |
| body | node | — | lede paragraph |
| meta | `{num,label}[]` | — | stats strip (mutually exclusive with `ctas`) |
| ctas | node | — | button row (mutually exclusive with `meta`) |
| media | node | — | image/video for the visual column; omit to hide it |
| caption | node | — | mono caption + gradient veil over media |
| bgImage | string | — | inline cover `background-image` on the section |
| className | string | `''` | extra classes on the section |
| innerClassName | string | `''` | extra classes on the grid wrapper |
| columnClassName | string | `''` | extra classes on the text column |

## Styling
- Tailwind utilities (inline, keep): section is full-bleed via the shared `.site-feature` rule; grid `grid-cols-1 min-[901px]:grid-cols-2 items-center gap-[clamp(48px,6vw,96px)] max-w-[1200px] mx-auto`; text column `flex flex-col gap-4 max-w-[640px]`; meta strip `flex flex-wrap gap-y-7 gap-x-12 pt-4`; CTA row `flex flex-wrap gap-4 pt-2`; media `relative aspect-[4/5] rounded-[4px] overflow-hidden`.
- Inline style: `bgImage` → `{ backgroundImage:url(...), backgroundSize:'cover', backgroundPosition:'center' }`.
- **`.site-feature*` CSS to CAPTURE and move with the component** (from `apps/brand/src/styles/kol-site.css`):
  - `.site-feature` — `width:100vw; margin-left:calc(50% - 50vw)` (full-bleed, shared selector), `background:var(--kol-surface-primary)`, `color:var(--kol-surface-on-primary)`, `padding:var(--kol-pad-page-y) var(--kol-pad-page-x)`.
  - `.site-feature-kicker` — `font-family:var(--kol-font-family-mono); font-size:18px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:var(--kol-accent-primary)`.
  - `.site-feature-pull` — `font-family:"Right Grotesk"; font-weight:700; font-size:clamp(40px,5.5vw,72px); line-height:1.05; letter-spacing:-0.02em; color:var(--kol-surface-on-primary)`.
  - `.site-feature-pull em` — `font-family:'Right Grotesk'; font-feature-settings:"liga","dlig"; font-weight:700; font-style:italic; color:var(--kol-accent-primary)`.
  - `.site-feature-body` — `font-family:"Right Grotesk Text","Right Grotesk"; font-weight:400; font-size:16px; line-height:1.6; color:color-mix(in srgb, var(--kol-surface-on-primary) 72%, transparent)`.
  - `.site-feature-meta` — `border-top:1px solid color-mix(in srgb, var(--kol-surface-on-primary) 8%, transparent)`.
  - `.site-feature-meta-num` — `font-family:"Right Grotesk Wide","Right Grotesk"; font-weight:900; font-size:32px; line-height:1; letter-spacing:-0.02em; color:var(--kol-surface-on-primary)`.
  - `.site-feature-meta-label` — `font-family:var(--kol-font-family-mono); font-size:10px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:color-mix(in srgb, var(--kol-surface-on-primary) 48%, transparent)`.
  - `.site-feature-visual img` — `width:100%; height:100%; object-fit:cover; display:block`.
  - `.site-feature-visual-veil` — `position:absolute; inset:0; background:linear-gradient(180deg, transparent 0%, transparent 60%, color-mix(in srgb, var(--kol-surface-primary) 48%, transparent) 100%); pointer-events:none`.
  - `.site-feature-visual-caption` — `position:absolute; left:24px; bottom:24px; font-family:var(--kol-font-family-mono); font-size:10px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:color-mix(in srgb, var(--kol-surface-on-primary) 80%, transparent)`.
- **App-specific bits to DROP / re-tier:** the full-bleed `width:100vw; margin-left:calc(50% - 50vw)` is shared across every `.site-*` landing section — recreate as a DS `fullbleed` modifier, don't inherit the grouped selector. Padding uses app-defined `--kol-pad-page-y/x` (declared in `kol-framework.css`, not `packages/theme`) — swap for DS padding tokens/props. Raw `"Right Grotesk*"` font families are hard-coded brand fonts — swap for DS `--kol-font-family-sans*` tokens (mono already tokenized). Keep the `--kol-surface-*`/`--kol-accent-primary` tokens (DS-tier).

## States & interactions
No hover/focus/selected of its own — it's a layout section. Interactivity is entirely inside the `ctas`/`media` you pass (Buttons, video). Responsive behavior: single column below 901px (`grid-cols-1`), two columns at/above via `min-[901px]:grid-cols-2`. `caption` presence gates both the veil and the caption element.

## Dependencies
- **Button** (DS) — not imported directly, but `ctas` is conventionally a row of DS Buttons; list as a composition dependency.
- `media` and `ctas` are consumer-supplied nodes — no hard import. No router, brand-data, or editor coupling in the component itself.

## Recreation notes
- Tier: **organism** (composite editorial section).
- Props that stay props: all slots (`kicker`/`title`/`body`/`meta`/`ctas`/`media`/`caption`), plus the three `*ClassName` escape hatches and `bgImage`.
- The `.site-feature*` CSS is the component's identity — port it into the DS component's own stylesheet (scoped, e.g. `kol-feature-*`) rather than depending on `kol-site.css`. Rename off the `site-` prefix.
- Tokens to swap: app padding tokens → DS padding; raw Right Grotesk families → DS font tokens; keep surface/accent/mono tokens and the `color-mix` alpha treatments.
- Text casing: `.site-feature-kicker`, `.site-feature-meta-label`, `.site-feature-visual-caption` all set `text-transform:uppercase`. Per KOL rules, drop the auto-transform — author kicker/label/caption strings in their final case at the call site. Push back if a consumer asks the component to force casing.
- Keep the `meta` XOR `ctas` intent (pick one) documented; both are optional and independently gated.
- Preserve the `media`-gated visual column and `caption`-gated veil so an omitted media/caption emits no empty nodes.
