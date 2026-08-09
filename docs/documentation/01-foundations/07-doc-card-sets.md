---
title: Doc & card sets
type: plan
status: active
created: 2026-07-31
updated: 2026-08-01
description: Two theme-level type-role sets, one system
phases:
  - kol-doc roles in theme
  - kol-card roles in theme
  - Doc* family in kol-workshop
  - showcase dogfood swap
  - consumer opt-in (out of scope)
tags:
  - domain/showcase
  - audience/agency-internal
  - pattern/docs-as-data
related:
  - "[[../INDEX|operations index]]"
---

# Doc + card sets — one role system, two entry points

Phases 1–4 **executed same day** (theme 0.11.9 + workshop 0.1.8 + showcase swap; the rung mapping was delegated to the agent, reviewed via `/docs/type-roles`). Phase 5 (consumer opt-in) stays open. User rulings from the 2026-07-28 session are marked ⚖; open items marked ❓.

## Why

The `section header → heading → description → footer` stack is re-bastardized across 30+ repos because the real one is locked in showcase-local components (`DocHeader`/`DocSection`/`ApiTable`/`PreviewCard` — names that don't admit they're a family). Meanwhile prose content and doc chrome render the **same things** (headings, ledes, code, tables, figures) through two parallel styling systems that drift. Cards repeat the same failure at smaller scale: article/work/shop/home cards each re-pick their text stacks.

The insight (⚖ confirmed): the only real difference between prose content and doc chrome is **generated vs authored markup**. So: define each text role once in theme CSS, expose it twice — as a bare-tag selector under `.kol-prose` (generated) and as a naked `.kol-doc-*` class (authored).

## Current state

- `.kol-prose` (kol-theme) styles bare tags under a wrapper — CMS/markdown only.
- Doc chrome = hand-stacked atoms per element (`kol-helper-10 uppercase tracking-widest text-meta` for an eyebrow) inside showcase-local components no other repo can reach.
- Card text = per-component hand stacks in kol-content / kol-store / showcase (ArticleCard, WorkCard, print cards, bento/home cards).

## Target state

### 1. `kol-doc-*` — 11 content roles (kol-theme CSS)

One rule → two selectors (`.kol-prose <tag>, .kol-doc-<role>`):

| Role | Class | Prose twin |
|---|---|---|
| eyebrow (overline label, e.g. `KOL · ICONS`) | `.kol-doc-eyebrow` | — |
| heading | `.kol-doc-heading` | `h1`/`h2` |
| section title | `.kol-doc-section-title` | `h3` |
| lede | `.kol-doc-lede` | ❓ `> p:first-child` mapping to confirm |
| body | `.kol-doc-body` | `p` |
| code block | `.kol-doc-code` | `pre` |
| inline code | `.kol-doc-code-inline` | `code` |
| table | `.kol-doc-table` | `table` |
| figure | `.kol-doc-figure` | `figure` |
| caption | `.kol-doc-caption` | `figcaption` |
| footer | `.kol-doc-footer` | `footer` (rare; wired for completeness) |

⚖ Footer rides the **kol-mono ramp** (wrappable), never kol-helper (line-height-1, single-line law). Quiet ink (`text-meta` level).

### 2. `Doc*` composer family (kol-workshop)

⚖ `Doc` prefix stands. Thin composers over the classes; replaces the showcase-local kit:

- `DocHeader` — eyebrow + heading + lede
- `DocSection` — section title + body slot
- `DocTable` — absorbs `ApiTable`
- `DocFigure` — absorbs `PreviewCard`

Home = kol-workshop (already owns the docs apparatus). ❓ Exact absorb details (ApiTable's react-docgen merge path, PreviewCard's stage contract) scoped at build time.

### 3. `kol-card-*` — 6 card type roles (kol-theme CSS)

| Role | Class |
|---|---|
| title | `.kol-card-title` |
| kicker | `.kol-card-kicker` |
| meta | `.kol-card-meta` |
| excerpt | `.kol-card-excerpt` (line-clamp built in) |
| value/price | `.kol-card-value` |
| tag | `.kol-card-tag` |

Card-optimized ramp: tighter line-heights, truncation baked in. Consumed by ArticleCard, WorkCard, shop/print cards, bento/home cards — layout varies, type never re-picked.

### Adoption

⚖ **Pure opt-in.** Classes ship inert; existing stacks keep working until a repo swaps. No forced migration, no breaking release.

## Phases

1. **`kol-doc-*` roles in theme** — the 11 rules, double-selectored; rung mapping per role is a ❓ **design pass with the user** (which kol-sans/kol-mono rung each role gets).
2. **`kol-card-*` roles in theme** — same pass for the card ramp.
3. **`Doc*` family in kol-workshop** — build composers, absorb ApiTable/PreviewCard.
4. **Showcase dogfood swap** — showcase pages onto `Doc*` + roles; visual parity check with the user.
5. **Consumer opt-in** — per-repo, out of this epic's scope.

## Acceptance criteria

- Each role defined exactly once in theme; prose pages render pixel-unchanged (or user-approved deltas).
- Showcase doc pages and at least one card family run entirely on the sets.
- No `kol-helper-*` on wrappable text anywhere in the new roles (type-protocol law).
- Gates green; theme/workshop versions bumped + published; SHIPPED-PACKAGES synced.

## Open questions

- ❓ Per-role rung mapping (joint design pass).
- ❓ `.kol-doc-lede` prose twin — structural (`> p:first-child`) or authored-only.
- ❓ Excerpt clamp: fixed lines per variant or a `--kol-card-excerpt-lines` knob.
- ❓ Whether `DocHeader` also ships a footer slot or `.kol-doc-footer` stays free-floating.
