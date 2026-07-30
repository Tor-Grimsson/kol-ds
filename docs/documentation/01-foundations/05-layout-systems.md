---
title: Foundations — layout systems registry
type: reference
status: active
updated: 2026-07-30
description: THE lookup for every active layout/width/text-container system — which system owns what, where its rules live, and which contradictions are open. Read this before picking a width, a container, or a prose class.
aliases:
  - layout-systems
  - width-systems
  - container-registry
sources:
  - packages/theme/kol-theme.css
  - packages/theme/kol-typography.css
  - packages/theme/kol-type-roles.css
  - packages/theme/kol-components-workshop.css
  - packages/framework/kol-framework.css
  - showcase/src/lib/MdxDoc.jsx
  - showcase/src/lib/mdx-components.jsx
tags:
  - domain/design-system
  - domain/layout
related:
  - "[[04-layout-breakpoints|layout & breakpoints]]"
  - "[[03-typography|typography]]"
  - "[[../04-compositions/02-shells|shells]]"
  - "[[../08-breakpoints/04-kol-ds-rules|KOL-DS rules]]"
  - "[[../08-breakpoints/INDEX|breakpoints lookup]]"
---

# Layout systems registry

**Why this doc exists (2026-07-30):** the MDX docs pages shipped wearing the blog
prose container — nobody could look up which system owned the page body, so the
wrong one got reused. This is the registry that lookup should have hit. One row
per active system: what it's for, where the rules live, what it must never be
used for.

## The systems

| System | Purpose | Values | Rules live at | Never use for |
|---|---|---|---|---|
| **One-frame law** (`--kol-content-*`) | THE width family: one shell frame, content left-anchored, width is a *content* decision | shell 1800 · **panel 960** (tables / code / framed panels) · column 768 · measure 65ch | `kol-theme.css` content block | hardcoded `max-w-[Npx]` at call sites — if no cap fits, file it |
| **Framework container** (`--kol-container-max`) | The **responsive resolution of the shell** — NOT a second family (unified 2026-07-30): `.kol-page`/`.kol-page-hero`/`.kol-overlay-sheet` clamp through it | 100% → 1400 (lg) → 1600 (xl) → `var(--kol-content-shell)` (≥1920) | `kol-framework.css` `:root` blocks | referencing it in new consumer code — reach for `--kol-content-*` |
| **Full-bleed** (`.kol-full-bleed`) | THE one full-bleed: cancels the DS inset with a negative margin — container-relative, sidenav-safe | `margin-inline: calc(-1 * var(--kol-pad-section-x))` | `kol-framework.css` (with the 50vw-trap warning) | the viewport pull (`50vw`) — clips inside sidenav grids (the /review slice bug) |
| **Shell content grid** (workshop shell) | rail / main / toc gutters in the packaged shell | gap 32 · 48 ≥1600, theme-owned — **no `gap-*` utility on the element** | `kol-components-workshop.css` (`.shell-content-grid`) · ShellLayout.jsx | per-consumer gutter overrides |
| **`.kol-prose`** | **The blog/editorial system** — CMS portable text (kol-content), workshop vault viewer (`DocsArticle`) | 720px cap · 16/24 w300 editorial voice | `kol-typography.css:962` | **docs pages — ever** (user law 2026-07-30); anything containing previews/tables |
| **`kol-doc-*` roles** | **The docs voice** — DocKit chrome + MDX bodies; per-element roles, text self-caps | body/lede cap at measure (65ch of own size) · code/table/figure/caption roles | `kol-type-roles.css` | editorial/blog copy (that's kol-prose's job) |
| **MDX page system** (showcase) | Component + docs pages ARE documents; markdown typed per-tag via the doc roles; every code surface = kol-component `CodeBlock` (one code idiom, 2026-07-30); h2 carries the section air (`mt-6 first:mt-0`) | text at measure · fences/tables/Api/Install cap at **panel** · previews (stages) run the full column | `MdxDoc.jsx` + `mdx-components.jsx` + `component-page-parts.jsx` | wrapping the body in any container class; bespoke `pre`/copy twins |
| **Seam/border law** (chrome borders) | Framed chrome + seams use the OPAQUE tier, weight 08 — alpha `fg-*` borders brighten over tinted fills (the table-seam disease, fought all day 2026-07-30) | `var(--kol-oq-08)` — doc-figure, table wrapper/seams, PreviewCard tab bar | `kol-type-roles.css` (`.kol-doc-figure`) · `kol-components-organisms.css` (table) · PreviewCard.jsx | `border-fg-*` classes on framed chrome |
| **Padding ladder** (`--kol-pad-*`) | page/section/band padding rhythm — **complete and healthy** | 3-breakpoint responsive ladder | `kol-framework.css:50-74` | — leave it alone |

## The one rule of thumb

**Width is content, not page identity.** The page frame is one decision made
once (the shell); inside it, a block's cap comes from what the block *is* —
running text takes the measure, reading blocks take the column, chrome and
furniture take the frame. If you are typing `max-w-[Npx]` at a call site, the
registry above has failed you — file it, don't improvise it.

## Resolved contradictions (2026-07-30 — shipped in theme 0.13.0 + framework 0.7.0)

The kol-website audit's three findings (`lobby/WidthSystemContradictions.md`,
now carrying the full RESOLUTION table for the consumer):

| # | Was | Now |
|---|---|---|
| 1 | Two token families; law said 1800, `.kol-page` rendered 1600 | one family — `--kol-container-max` = the shell's responsive ladder, last rung `var(--kol-content-shell)` ≥1920 |
| 2 | No cap between 768 and 1800; consumers improvised `max-w-[920/960/1200px]` | `--kol-content-panel: 960px` |
| 3 | Three full-bleed mechanisms; the 50vw pull clipped inside the sidenav | `.kol-full-bleed` (negative-margin, container-relative) shipped; trap documented at the rule |

## History (how the systems got here)

- **2026-07-28** — the one-frame law declared (`--kol-content-*`, "chess law": one outer frame + nested content caps); `kol-doc-*` role set shipped.
- **2026-07-30** — shell gutter moved theme-side (workshop 0.3.1 / theme 0.12.2) after a `gap-8` utility made the 48px wide step dead code (ARCHITECTURE §5 disease, geometry edition).
- **2026-07-30** — MDX bodies stripped of `.kol-prose` (user-surfaced bug: the blog cap caged previews and tables); markdown typed per-tag through the doc roles instead.
- **2026-07-30 (later)** — the width family unified (theme 0.13.0 / framework 0.7.0): container-max became the shell's ladder, `--kol-content-panel: 960px` filled the missing stop, `.kol-full-bleed` promoted from kol-website's local utility; MDX furniture capped at panel.
