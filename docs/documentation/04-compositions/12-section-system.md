---
title: Section system
type: reference
status: canonical
created: 2026-08-26
updated: 2026-09-03
description: One text block, five website sections
aliases:
  - sections
  - section set
  - SectionText
sources:
  - packages/component/src/molecules/SectionText.jsx
  - packages/component/src/molecules/PageHeader.jsx
  - packages/component/src/organisms/SectionSplit.jsx
  - packages/component/src/organisms/SectionHero.jsx
tags:
  - domain/compositions
  - audience/consumer
related:
  - "[[../03-components/06-content-card-system|content card system]]"
  - "[[01-blocks-and-sets|blocks and sets]]"
  - "[[11-shell-system|shell system]]"
  - "[[../00-overview/01-package-topology|package topology]]"
---

# Section system

The website sections — hero · split · cards band · CTA · FAQ — composed from **one text block**. Before 2026-08-26 every one typed its own kicker / heading / body / media by hand; the card family had solved exactly that on 2026-08-15 (`ContentText` + `ContentMedia`), and this is the section-tier twin (SectionSet, filed from kol-website).

## The block

Every section takes **`background`** — a named surface (`primary` · `secondary` · `tertiary` · `inverse` · `auto` · `none`) or a raw utility / token string; each default is what it painted before (SectionBackgroundProp, 2026-08-27). `theme` scopes ink, `background` paints.

`SectionText` — eyebrow (`label` is its alias) · headline · body · actions, every slot opt-in; an omitted slot renders nothing. Type by **role** (`headlineSize`: `pull` · `display-01…04` · `heading-01…05`), never a threaded class. Every default class is a seam (`labelClass` / `bodyClass` / `actionsClass`), which is how the hero's eyebrow and the CTA's rows wear their own voices on one anatomy. `children` render between body and actions (the split's stats strip). No casing transforms. **The body voice is mono** (`.kol-section-text-body` = mono 16 / 22, theme ≥0.60.0 — user 2026-08-27: *"I don't want the sans anywhere"*); sans is opt-in through `bodyClass` / `slotClass`.

**Two seams added 2026-09-03 (component 0.175.0)** for compositions that own their rhythm. `actionsPlacement="inline"` puts the actions cluster in one flex row with the body, on the body's first baseline — the headline's when there is no body — and the cluster contributes **no height** (`h-0 self-center`), so a block with a control cluster measures the same as one without, at any rung. `style` reaches the root, which `slotStyle` could not.

**The block is a base.** `PageHeader` (kol-component ≥0.174.0, from kol-shell — page-header-one-masthead) is a composition of it: eyebrow · title as `h1` · sub-line · `actions` inline. `size` (sm · md · lg) picks the title role, `voice` (sans · mono) its family, `register` (app · site) the sub-line's voice — `kol-mono-14` on an app page, `kol-sans-body-01` on a site page, the one thing the two registers disagree about. `subtitleMaxWidth` is the lede's measure; the bottom rhythm is `--kol-page-header-mb` (40px). The same relation `ContentText` has to the card family: the base is the anatomy, the composition is what a page renders.

**Two primitives, by tier — ruled, not open** (page-family-is-not-a-set, kol-client-olina 2026-09-03). `ContentText` is a listing item's text: a variant × form ramp, data slots (`date` · `size` · `meta` · `tags` · `detail`), betweens and stacks, truncation. `SectionText` is a region's head: eyebrow · headline · body · actions. They share three slots, which is anatomy, not a system, and neither absorbs the other. The test: **data lines beside a title → `ContentText`; a head that introduces what follows → `SectionText`.** The brand-book page kit — `PageHero` · `PageSection` (kol-framework ≥0.39.0) — composes `SectionText` with the `kol-prose-*` voices passed as seams, the same move `PageHeader` made; `PageLayout` (was `AppShell`) is the kit's frame.

## The family

| Name | Was | Is |
|---|---|---|
| `SectionHero` | `FullBleedHero` | `variant="media"`: cover media + scrim; text props render as `SectionText` in the hero's own glass panel, or pass `panel` and your node renders verbatim. **`variant="split"`**: the viewport in two halves — media edge to edge in one (placeholder when none), the headline centred and uppercase in the other; `align` picks the media side. Round 2 (2026-08-26): `height` presets `full` · `80` · `60`, `justify="end"`, `veil`, `foot` + `overlap`, `media` as an array = the carousel, no media = the text-only hero |
| `SectionSplit` | `FeatureSplit` | text column (`SectionText`) beside the media frame; **`align: 'right' \| 'left' \| 'center'`** — media side, or one centred column. `flip` → `align="left"` |
| `SectionCards` | `FeaturesCardSection` | `SectionText` header over a row of `SectionCardItem`s + a centred action row |
| `SectionCardItem` | `CardFeatureItem` | the card `SectionCards` is made of — title + icon, visual, description (the composition is the card; its parts are card items) |
| `SectionCta` | `CtaGlobal` | `editorial`: display wordmark beside stacked label-over-value rows, each a `SectionText` · `centered`: rule · heading · mono line · Buttons (was FoundryCTA) |
| `SectionFaq` | new | `SectionText` header over `Accordion` `{ q, a }` items; `singleOpen` optional |
| `SectionNewsletter` | `NewsletterBand` | `SectionText` (centred) over the email form — Input + Button + aria-live status line — in its children slot; `title` → `headline`, `description` → `body` (2026-08-27) |
| `InspectorSection` | `Section` | the inspector's label + stack (+ `divided`); renamed so it stops sitting inside this family's rail |

Every old name stays exported as an **alias** — same render, old prop names mapped (`kicker` → `eyebrow`, `title` → `headline`, `titleSize` → `headlineSize`, `ctas` → `actions`, `mediaAspect` → `ratio`, `headerLabel` / `headerDescription` → `headline` / `body`) — with `@deprecated` in source and removal at the next major. The four existing organisms were rebuilt for parity, not redesigned.

## Width

Every section's inner grid sits on **one cap — the shell's `--kol-container-max` ladder** (100% → 1400 → 1600 → 1800), never a per-section number (user ruling 2026-08-26, after split / cards / CTA shipped on 1200 / 1400 / 1600). A reading measure inside a section (the FAQ list) is content and keeps its column cap.

## Not folded

`NewsletterBand` joined the family as `SectionNewsletter` (2026-08-27); `FramedMediaBand` is the same class and stays under its name — a follow-up when the wave has room. Media inside a section is the caller's node (an image, `HlsVideo`, an interactive card); `ContentMedia` remains the card family's slot.

## Classes

`.kol-section-text-eyebrow` (uppercase by role; the eyebrow voice is `kol-helper-12 text-meta`; the card set's role class is `kol-eyebrow`) / `-pull` / `-body` and `.kol-section-split` / `-meta*` / `-visual*` in `kol-components-organisms.css`. The old `.kol-feature-split-*` selectors sit on the same rules for one release.
