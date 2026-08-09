---
title: Layout systems registry
type: reference
status: active
created: 2026-08-01
updated: 2026-08-09
description: Which system owns which width, and where
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
  - domain/layout
  - audience/consumer
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
| **One-frame law** (`--kol-content-*`) | THE width family: one shell frame, content left-anchored, width is a *content* decision | shell 1800 · **canvas 87.5rem** (the page body inside the shell's main column — item fields) · **panel 960** (tables / code / framed panels) · column 768 · measure 65ch | `kol-theme.css` content block | hardcoded `max-w-[Npx]` at call sites — if no cap fits, file it |
| **Framework container** (`--kol-container-max`) | The **responsive resolution of the shell** — NOT a second family (unified 2026-07-30): `.kol-page`/`.kol-page-hero`/`.kol-overlay-sheet` clamp through it | 100% → 1400 (lg) → 1600 (xl) → `var(--kol-content-shell)` (≥1920) | `kol-framework.css` `:root` blocks | referencing it in new consumer code — reach for `--kol-content-*` |
| **Full-bleed** (`.kol-full-bleed`) | THE one full-bleed: cancels the DS inset with a negative margin — container-relative, sidenav-safe | `margin-inline: calc(-1 * var(--kol-pad-section-x))` | `kol-framework.css` (with the 50vw-trap warning) | the viewport pull (`50vw`) — clips inside sidenav grids (the /review slice bug) |
| **Shell content grid** (workshop shell) | rail / main / toc gutters in the packaged shell | gap 32 · 48 ≥1600, theme-owned — **no `gap-*` utility on the element** | `kol-components-workshop.css` (`.shell-content-grid`) · ShellLayout.jsx | per-consumer gutter overrides |
| **`.kol-prose`** | **The blog/editorial system** — CMS portable text (kol-content), workshop vault viewer (`DocsArticle`) | 720px cap · 16/24 w300 editorial voice | `kol-typography.css:962` | **docs pages — ever** (user law 2026-07-30); anything containing previews/tables |
| **`kol-doc-*` roles** | **The docs voice** — DocKit chrome + MDX bodies; per-element roles, text self-caps | body/lede cap at measure (65ch of own size) · code/table/figure/caption roles | `kol-type-roles.css` | editorial/blog copy (that's kol-prose's job) |
| **MDX page system** (showcase) | Component + docs pages ARE documents; markdown typed per-tag via the doc roles; every code surface = kol-component `CodeBlock` (one code idiom, 2026-07-30); h2 carries the section air (`mt-6 first:mt-0`) | text at measure · fences/tables/Api/Install cap at **panel** · previews (stages) run the full column | `MdxDoc.jsx` + `mdx-components.jsx` + `component-page-parts.jsx` | wrapping the body in any container class; bespoke `pre`/copy twins |
| **Card wall** (masonry columns) | THE demo/card wall — column count derives from the wall's **own width**, never the viewport: the shell rails eat width that viewport breakpoints can't see, so a forced count compresses every card (user call 2026-08-09) | `columns: 4 20rem` — min card 20rem, cap 4; the count falls 4→3→2→1 as the wall narrows | `Home.jsx` (bento wall) · `Components.jsx` (waterfall index) | `sm:columns-2 … xl:columns-4` viewport steps — that is how the compression started |
| **Inline-code chip** (`.kol-doc-code-inline` · `.kol-table-token`) | ONE chip, two entry points — prose inline code and a code token inside a Table. Fill, radius and colour are one answer (`--kol-fg-08` · `--kol-radius-sm` · `--kol-fg-80`); only **size** differs, relative in prose (`0.875em`) and fixed in chrome. They had drifted on every one of those values. `.kol-doc-table-token` is **not** a chip — it is a `td` slot that types a whole cell, sharing only the word | fill `--kol-fg-08` · radius `--kol-radius-sm` | `kol-type-roles.css` (inline code) · `kol-components-organisms.css` (`.kol-table-token`) | a hand-rolled Tailwind lookalike — that is how the second spelling started |
| **Seam/border law** (chrome borders) | Framed chrome + seams use the OPAQUE tier, weight 08 — alpha `fg-*` borders brighten over tinted fills (the table-seam disease, fought all day 2026-07-30) | `var(--kol-oq-08)` — doc-figure, table wrapper/seams, PreviewCard tab bar | `kol-type-roles.css` (`.kol-doc-figure`) · `kol-components-organisms.css` (table) · PreviewCard.jsx | `border-fg-*` classes on framed chrome |
| **Padding ladder** (`--kol-pad-*`) | page/section/band padding rhythm for **page content** | 3-breakpoint responsive ladder | `kol-framework.css` `:root` blocks | shell chrome — that is the chrome inset below |
| **Chrome inset** (`--kol-pad-chrome-x`) | the inset for shell **chrome** — header rows + the shell content frame. Flat, not stepped. Added 2026-07-31 on the user's ruling ("it's what lives in kolkrabbi") | `var(--kol-spacing-6)` at every width | `kol-framework.css` `:root` | page containers — those take `--kol-pad-section-x` |
| **Rail stack** (`.shell-rail-stack` · `-inner`) | the SECTION container in every rail — categories at 24, groups inside a category at 16. Added 2026-08-01 after the user found one layout shipping as **four** idioms: `flex flex-col gap-6` (left), `space-y-6` (right), `space-y-4` (sidebars), `space-y-0` (rows). `space-y-*` is a margin on every child but the first, so it fights the eyebrow box, which owns its own margin — flex `gap` does not | `--kol-spacing-6` outer · `--kol-spacing-4` inner | `kol-components-workshop.css` | a `space-y-*` or `gap-*` utility on a rail container — that is how the four started |
| **Rail row indent** (`--kol-pad-rail-row-x`) | the row's TEXT edge, so anything that must line up with a row (the tag shelf) reads the indent instead of retyping it. It was the last value of `.shell-nav-item`'s padding shorthand and unreadable from anywhere else | `1.25rem` | `kol-theme.css` `:root` | page content |
| **Rail row rhythm** (`--kol-pad-rail-row-y`) | the y-padding EVERY sidebar row shares — the eyebrow (`.shell-sidebar-toggle` / `.shell-sidebar-label`) and the nav group header (`.shell-nav-group-header`). Added 2026-08-01; see the eyebrow-box law in [[../04-compositions/02-shells\|shells]] | `0.375rem` — deliberately **off** the `--kol-spacing-*` scale (a tighter chrome rhythm than `--kol-spacing-1`) | `kol-theme.css` `:root` | page content — this is rail chrome only |
| **Rail widths** (`--kol-sidenav-w` · `--kol-shell-toc-w`) | the workshop shell's two rail **grid tracks**. Both are fixed: the right rail holds its column even with nothing in it (user ruling 2026-08-01), because a rail that vanishes on a heading-less page re-flows main and the same shell renders at two widths | `16rem` both — equal since 2026-08-01 (this row still said `14rem` right until 2026-08-01 evening) | `kol-framework.css` `:root` | `--kol-toc-w` — that is the BRAND layout's rail, a different shell |

## Rule

**Width is content, not page identity.** The page frame is one decision made
once (the shell); inside it, a block's cap comes from what the block *is* —
running text takes the measure, reading blocks take the column, chrome and
furniture take the frame. If you are typing `max-w-[Npx]` at a call site, the
registry above has failed you — file it, don't improvise it.

### The component declares its own width (2026-08-01)

A table used to be capped by whatever `<div>` a page happened to wrap it in, and
`validate:width` policed that by grepping the page for the token *name*. So a
legitimately wide data table had to buy clearance with a magic `width-ok:`
comment — a string a human must remember and a gate cannot reason about.

**`Table` declares its width instead**, and applies the cap on its own wrapper:

| `width` | Cap | For |
|---|---|---|
| `panel` *(default)* | `--kol-content-panel` | prose tables — props, tokens, specimens |
| `column` | none; the content column | data tables whose columns need the room (the reference graph's seven) |

Both are correct by construction, so the gate stopped checking for a token name
and asserts the real law: **a Table may not be hand-wrapped in a panel cap**,
because the prop is the seam. On its first run that rule caught three pages
already doing it. `width-ok:` was deleted rather than kept — an exemption that
survives becomes precedent.

`CodeBlock` keeps the original page-level rule; it has no width prop.

## Left anchoring

The law's own sentence has always been *"one frame, content **LEFT-ANCHORED**
inside"*, and it names the sanctioned pattern verbatim: `mx-auto max-w-shell`.
Only that one. The rule in full:

| Cap | `mx-auto`? | Why |
|---|---|---|
| `--kol-content-shell` | ✅ **yes** — this is THE frame centring in the viewport | it is the frame token |
| `canvas` · `panel` · `column` · `measure` | ❌ **never** | these are content *inside* the frame; centring them is centring twice |

`ShellLayout`'s main column carried `mx-auto` for a canvas cap, so above the
canvas width the page content drifted away from the rail it lines up with —
the user caught it by eye. Four call sites were centring capped content.

Enforced as **W4** in `pnpm validate:width`. The exemption is the **token**,
not a file or a magic comment, because the law already draws the line in its
own vocabulary.

## Resolved contradictions

The kol-website audit's three findings (`lobby/WidthSystemContradictions.md`,
now carrying the full RESOLUTION table for the consumer):

| # | Was | Now |
|---|---|---|
| 1 | Two token families; law said 1800, `.kol-page` rendered 1600 | one family — `--kol-container-max` = the shell's responsive ladder, last rung `var(--kol-content-shell)` ≥1920 |
| 2 | No cap between 768 and 1800; consumers improvised `max-w-[920/960/1200px]` | `--kol-content-panel: 960px` |
| 3 | Three full-bleed mechanisms; the 50vw pull clipped inside the sidenav | `.kol-full-bleed` (negative-margin, container-relative) shipped; trap documented at the rule |

## History

- **2026-07-28** — the one-frame law declared (`--kol-content-*`, "chess law": one outer frame + nested content caps); `kol-doc-*` role set shipped.
- **2026-07-30** — shell gutter moved theme-side (workshop 0.3.1 / theme 0.12.2) after a `gap-8` utility made the 48px wide step dead code (ARCHITECTURE §5 disease, geometry edition).
- **2026-07-30** — MDX bodies stripped of `.kol-prose` (user-surfaced bug: the blog cap caged previews and tables); markdown typed per-tag through the doc roles instead.
- **2026-07-30 (later)** — the width family unified (theme 0.13.0 / framework 0.7.0): container-max became the shell's ladder, `--kol-content-panel: 960px` filled the missing stop, `.kol-full-bleed` promoted from kol-website's local utility; MDX furniture capped at panel.
