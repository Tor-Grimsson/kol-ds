---
component: StudioHero
source: kol-monorepo/apps/web/src/components/sections/studio/StudioHero.jsx#L1-L35
date: 2026-07-03
status: archived
deps: [HlsVideo, OverlayGlassPanel, Button]
---

> **Archived 2026-07-09** — orphaned; identical to FullBleedHero(video variant) + OverlayGlassPanel, both built.

# StudioHero

# ⚠ Reconciliation headline
**This is not a new component — it is `FullBleedHero` (video variant) + `OverlayGlassPanel`, already spec'd.** It is also **orphaned** (imported nowhere in the app). Recreate it as a *composition example / variant*, or drop it. Do not stage a third bespoke hero.

## Purpose
An autoplaying HLS-video full-viewport hero with a centered frosted-glass content card (eyebrow / title / description / CTA). Structurally identical to `FullBleedHero` except the background is `HlsVideo` instead of `<img>`, and the section is `100vh`-minus-header tall. Every hardcoded value in it is a call-site prop waiting to happen.

## Anatomy
- `<section className="relative w-full h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] overflow-hidden">`
  - background `<HlsVideo src poster className="absolute inset-0 w-full h-full object-cover object-center">`
  - overlay `<div className="absolute inset-0 z-10 flex items-center justify-center">`
    - **glass card** (= `OverlayGlassPanel`) `flex flex-col items-center text-center gap-4 md:gap-6 px-6 py-8 rounded-[2px]`, inline `color-mix(in srgb, var(--kol-surface-primary) 80%, transparent)` + `backdrop-filter: blur(1px)`:
      - eyebrow `<p className="kol-mono-xs text-fg-64 tracking-[0.5px] uppercase">Kolkrabbi</p>`
      - title `<h1 className="kol-heading-xl md:kol-display-md text-auto">Studio & Atelier</h1>`
      - description `<p className="kol-mono-sm text-auto opacity-80 max-w-[480px]">…</p>`
      - CTA `<Link to="/work"><Button variant="primary" size="sm">View Work</Button></Link>`

## Variants
None. It is the video-background variant of `FullBleedHero`. The `100vh - header` height is the only structural difference from `FullBleedHero`'s fixed `h-[440px] md:h-[640px]`.

## Props
Currently **zero props** — everything is hardcoded. Proposed seam:
| prop | type | default | controls |
|------|------|---------|----------|
| src | string | — | HLS `.m3u8` master URL |
| poster | string | — | Poster still URL |
| height | string | `'h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)]'` | Section height |
| eyebrow | string | — | Uppercase kicker (was `"Kolkrabbi"`) |
| title | ReactNode | — | Heading (was `"Studio & Atelier"`) |
| description | string | — | Sub text (was the studio blurb) |
| cta | `{ label, href }` | — | Button label + destination (was `View Work` → `/work`) |

## States & interactions
- Background video autoplays via `HlsVideo` (muted/looped playback owned by that component).
- Single CTA → router `Link`. Otherwise static.

## Styling
- Type tokens: eyebrow `kol-mono-xs text-fg-64 tracking-[0.5px]`, title `kol-heading-xl md:kol-display-md text-auto`, description `kol-mono-sm text-auto opacity-80`.
- Glass card = the exact `OverlayGlassPanel` values (`color-mix … 80%` + `blur(1px)`, `rounded-[2px]`, centered).
- **App-specific bits to DROP:**
  - **Hardcoded CDN:** `cdnBase = 'https://f005.backblazeb2.com/file/kolkrabbi/website'` + the `.../hls-library/.../studio/hls/master.m3u8` and `.../asset-library/studio/…/video-still-1200.jpg` paths → `src`/`poster` props.
  - **Hardcoded route:** `<Link to="/work">` → `cta.href` (router-agnostic; DS `Button href`).
  - **Hardcoded brand copy:** `"Kolkrabbi"`, `"Studio & Atelier"`, the studio blurb, `"View Work"` → props / neutral.
  - **`uppercase` on the eyebrow** — drop the `text-transform`; author the kicker in the case it should render at the call site (KOL casing rule).
- Header-offset heights (`calc(100vh - 3.5rem/4rem)`) assume the app shell header — keep as a tunable `height`, don't bake the shell dimension in.

## Dependencies
- **`HlsVideo`** (staged, `lobby/HlsVideo.md`) — background video.
- **`OverlayGlassPanel`** (staged) — the content card.
- **`Button`** (DS) — CTA; use `href` instead of wrapping in a router `Link`.

## Recreation notes
- **Headline: fold into `FullBleedHero` + `OverlayGlassPanel`, or drop.** It is orphaned and duplicates the hero pattern. Two acceptable outcomes: (1) add a video-background variant to `FullBleedHero` (accept `HlsVideo` as the media layer) and rebuild this as `<FullBleedHero variant="video" src=… ><OverlayGlassPanel>…</OverlayGlassPanel></FullBleedHero>`; or (2) archive it as dead code. Do **not** recreate it as a standalone bespoke hero.
- Tier: **organism** (hero section) — but only as a composition of two staged pieces.
- Prop/slot seam: media (`src`/`poster`) + content props (`eyebrow`/`title`/`description`/`cta`), or better, a `children` slot carrying an `OverlayGlassPanel` so the card content is fully caller-owned.
- Text casing at call site: eyebrow authored uppercase in the string (drop `uppercase` class); title/description/CTA authored as-is.
