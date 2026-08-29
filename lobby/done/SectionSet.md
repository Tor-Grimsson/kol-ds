---
component: SectionSet
source: kol-website/apps/web/src/routes/Studio.jsx#L1-L102
staged: 2026-08-26
status: draft
deps: [ContentMedia, AssetPlaceholder, Button, Tag, Accordion, HlsVideo, Image, OverlayGlassPanel]
---

# SectionSet — the website-section organisms, composed once

**This is a bundled SET, not one component** (the `AppShellSet` shape): the pieces compose into one coherent section family and should ship and version together — one wave, one changelog entry, the aliases landing with the renames.

## Purpose

The website sections — hero · split · cards band · CTA · FAQ — are the most
common card UI on the web and are always used together, yet in the DS every
one types its own kicker / heading / body / media by hand. The user's ask
(2026-08-26, verbatim in spirit): *"build them from components — a text section
is a component comprised of 1 section header 2 headline 3 body 4 links or
tags, with props for opting in and out; the image placeholder should take any
image and/or interactive component."* And: one **prefix**, so the family groups
in any alphabetical rail.

This is the second filing of the idea. `SectionSplit` (2026-08-15) asked for
the anatomy; the DS answered "that is `FeatureSplit`" and grew `flip` /
`titleSize` / `mediaHover`. Correct call, half the ask — the composition
layer was never built. `StudioHero` (2026-07-03, archived) was the first.

## What ships today (read 2026-08-26)

| Organism | Text | Media |
|---|---|---|
| `FullBleedHero` (111 lines) | `panel` node slot — caller authors an `OverlayGlassPanel` | media descriptor `{kind, src, poster}` or node; `Image` / `HlsVideo` |
| `FeaturedCarousel` (311) | own `OverlayGlassPanel` per slide, raw `<p>`/`<span>` | `SlideMedia`, own |
| `FeatureSplit` (~140) | raw `<span>`/`<h1>`/`<p>` on `kol-feature-split-*`; `ctas` node | bare `<div style={{aspectRatio}}>` wrapping whatever is passed |
| `FeaturesCardSection` (90) | raw header `<h2>` + lede | `CardFeatureItem` ×N |
| `CtaGlobal` (67) | raw rows | — |
| FAQ | none — `Accordion` / `AccordionPanel` molecule only | — |

Zero shared text primitive. Zero shared media slot. The card family solved
exactly this on 2026-08-15 (`ContentText` + `ContentMedia` under `ContentCard`
/ `ContentRow`) — this brief is the section-tier twin.

## The family

| Name | Tier | Is |
|---|---|---|
| **`SectionText`** | molecule, NEW | label · headline · body · actions — every slot opt-in (render nothing when omitted). `actions` accepts Buttons, links, or Tags. Type by ROLE prop (`headlineSize: 'display-02' … 'heading-05'`, the `FeatureSplit` `TITLE_ROLE` map), never threaded classes (DS ruling 08-15). `align: 'start' \| 'center'` sets text-align + item alignment |
| **`ContentMedia`** | molecule, EXISTING | the media slot, reused as-is: `ratio` free, `fit`, `frame` / `ring` / `radius`, children = any node (img, `HlsVideo`, an interactive card such as kol-website's `ProfileCard`). No media → `AssetPlaceholder` at ratio |
| **`SectionHero`** | organism | = `FullBleedHero` rebuilt: `ContentMedia`/descriptor background + `SectionText` inside the glass panel (`OverlayGlassPanel` stays the chrome). Keeps `height` presets, `align`, `overlayOpacity` |
| **`SectionSplit`** | organism | = `FeatureSplit` rebuilt on `SectionText` + `ContentMedia`, plus **`align: 'left' \| 'right' \| 'center'`** — left/right = media side (today's `flip`), center = text centred with media below/above. One anatomy, one prop — NOT a third component |
| **`SectionCards`** | organism | = `FeaturesCardSection`: `SectionText` header + `CardFeatureItem` row/grid |
| **`SectionCta`** | organism | = `CtaGlobal` on `SectionText` rows |
| **`SectionFaq`** | organism, NEW | `SectionText` header + `Accordion` of `{ q, a }` items; single-open optional |

`ContentText` does NOT carry over to sections — it is ruled to the card type
ramp (title / body / meta) and has no actions slot. `SectionText` is its
sibling under the same law: every text slot a prop, type by role, no casing
transforms.

## Props — `SectionText`

| prop | type | default | controls |
|---|---|---|---|
| `label` | ReactNode | — | section header / kicker (`kol-feature-split-kicker` voice) |
| `headline` | ReactNode | — | the heading |
| `headlineSize` | role | `'heading-02'` | `display-02` … `heading-05` |
| `headlineAs` | `'h1'…'h3'` | `'h2'` | element |
| `body` | ReactNode | — | lede / paragraph(s) |
| `actions` | ReactNode | — | row of Buttons / links / Tags, `flex flex-wrap gap-4` |
| `align` | `'start' \| 'center'` | `'start'` | text-align + items |
| `gap` | token step | ruled | inner rhythm |
| `className` | string | — | |

## Props — `SectionSplit`

Everything `FeatureSplit` has today (`kicker` → `label`, `title` → `headline`,
`titleSize` → `headlineSize`, `body`, `meta`, `ctas` → `actions`, `media`,
`mediaAspect` → `ratio`, `mediaHover`, `caption`, `bgImage`, `fullBleed`)
+ `align: 'left' | 'right' | 'center'`. `flip` maps to `align: 'left'`.

## Naming / migration

- Old names (`FullBleedHero`, `FeatureSplit`, `FeaturesCardSection`, `CtaGlobal`)
  stay exported as **aliases** — no consumer breaks in the wave; a deprecation
  note in the changelog.
- Collision: the inspector's `Section` molecule (27 lines, label + stack +
  `divided`) → **`InspectorSection`**, alias kept. Otherwise it sits inside the
  family rail as a stranger.
- `NewsletterBand` / `FramedMediaBand` / `FoundryCTA` are the same class; fold
  into the prefix if the wave has room (`SectionNewsletter`, `SectionMediaBand`),
  otherwise a follow-up — not a blocker.

## Styling

No new chrome. `SectionText` emits the classes the organisms already use
(`kol-feature-split-kicker` / `-body` / `TITLE_ROLE`), renamed to
`kol-section-text-*` in kol-theme with the old selectors kept one release.
`ContentMedia`'s `radius` OFF inside `SectionHero` (full-bleed clips itself) —
the same double-round law the card family ruled 08-15.

## Reference implementations (kol-website)

- `apps/web/src/routes/Studio.jsx` — hero on `FeaturedCarousel` with a local
  `StudioAboutCard` overlay (the ugly one), `StudioProcessCard` on `FeatureSplit`
  with `ProfileCard` (interactive, 200 lines) in the media slot, `FeaturesCardSection`,
  `ConnectCta` on `CtaGlobal`. **Studio is the first adopter on return.**
- `apps/web/src/components/sections/home/*` — HomeAbout (GSAP, stays local),
  HomeFoundry on `FeatureSplit`, HomeSignup on `NewsletterBand`.

## Recreation notes

Molecule first (`SectionText`), then rebuild the five organisms on it +
`ContentMedia`, one at a time, each verified in the showcase against its
current render (pixel parity is the bar for the four existing ones — this is
a composition refactor, not a redesign). `SectionFaq` is the only new surface;
`Accordion` already ships the behaviour. Text casing at the call site.

## ✅ RESOLUTION — 2026-08-26 · kol-component@0.71.0 · kol-theme@0.54.0

`SectionText` (new molecule) — label · headline · body · actions, every slot opt-in, type by role (`headlineSize`), every default class a seam — and the five organisms on it: `SectionHero` (= FullBleedHero; text props render as SectionText in its own glass panel, `panel` still renders verbatim), `SectionSplit` (= FeatureSplit + `align: 'right' | 'left' | 'center'` — media side or one centred column; `flip` → `align="left"`), `SectionCards` (= FeaturesCardSection), `SectionCta` (= CtaGlobal), `SectionFaq` (new — SectionText over Accordion `{ q, a }`, `singleOpen`). The inspector's `Section` is `InspectorSection`. Every old name is a `@deprecated` alias with its old prop names mapped — nothing breaks, removed at the next major. The organisms emit `.kol-section-text-*` / `.kol-section-split-*` (theme 0.54.0; the old `.kol-feature-split-*` selectors sit on the same rules one release). Parity measured headless in the showcase, every node's rect/font/colour before vs after: split and CTA identical; the cards band lost one wrapper div the heading never needed (same 32px box); the composed hero puts every original node on the same pixels. Not folded (follow-up, not a blocker): `NewsletterBand` / `FramedMediaBand` / `FoundryCTA`. Not built: `ContentMedia` inside sections — a section's media is the caller's node, as today.

**Remainder here:** none — kol-website bump kol-component 0.71.0 + kol-theme 0.54.0; Studio is the first adopter — hero on `SectionHero` (text props, or keep the panel), `StudioProcessCard` on `SectionSplit` with `ProfileCard` in the media slot, `FeaturesCardSection` → `SectionCards`, `ConnectCta` → `SectionCta`; retire `StudioAboutCard`.

