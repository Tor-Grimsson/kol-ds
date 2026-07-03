---
title: Feedback sweep — shell unification, open menus, framework taxonomy, social icons
type: log
status: archived
updated: 2026-07-02
description: Addressed the 8-point review in one pass — one DocLayout shell everywhere, menus render open via new defaultOpen, framework regrouped with demos, github/instagram icons, ThemeToggle solid, data exports declassified, favicon.
tags:
  - domain/design-system
  - pattern/component-docs
  - pattern/app-shell
repo: kol-design-system
related:
  - "[[session-log/2026-07-01-showcase-shadcn-rebuild|showcase shadcn rebuild]]"
  - "[[shells/01-reference-shells|reference shells]]"
---

# Session: Feedback sweep — shell unification + component-docs polish

**Date:** 2026-07-02
**Agent:** Grim (Fable 5)
**Summary:** Ran the user's 8-point review as consecutive phases in one pass. One shell everywhere, menus demo open, framework taxonomized with live demos, package fixes batched into staged changesets (held for one release).

## Changes Made

### Packages (staged, NOT published — 4 changesets)
- **kol-component (minor):** `defaultOpen` on `Dropdown`, `DropdownTagFilter`, `MenuItem`, `MenuPopover` — seeds internal open state (docs previews, restorable UI).
- **kol-framework (patch):** `ThemeToggle` icon → `variant="solid"`.
- **kol-loader (minor):** `social-github` + `social-instagram` added (user category, stroke + solid; GitHub = fill-native mark in both cuts). Auto-join the inventory via the glob.
- Plus the earlier `loader-icon-inventory` changeset — all four ship together.

### Showcase
- **Shell unified (feedback #3/#6/#7):** every docs page now wears `DocLayout` (TopBar + unified sidebar: Overview links + component tree, path-derived active + TOC). `TopBar` extracted to `lib/TopBar.jsx` (real `social-github` icon), shared with Home. **AppShell retired from the showcase**; routes flattened; `sidebars.config.js` deleted. `wide` mode for Foundations/Icons/Components (PageSection owns width).
- **Menus render open (#2):** all Menu* demos + DropdownTagFilter use `defaultOpen`; Dropdown shows 3 variants with the default one open.
- **Variants audit (#1):** widened Divider (orientations + opacity), ToggleSwitch (plain), SegmentedToggle / QuantityInput / QuantityStepper (sm·md·lg), ColorSwatch (selected / frameless / sized / transparent). Table & Tooltip already showed sets.
- **Data exports declassified (#4):** `GRAPHICS`/`GRAPHIC_RAW` filtered out of the component registry (UPPER_SNAKE rule) — 55 → 53.
- **Framework taxonomy (#5):** `framework` split into **Chrome** (AppShell, Layout, SideNav, PortalFooter, ThemeToggle), **Structure** (BrandHero, SubPageHero, PageSection), **Behaviors** (ScrollToTop). New live demos: BrandHero, SubPageHero, PageSection, PortalFooter (hero `min-h-72dvh` collapsed via arbitrary variants for preview). Composition/behavior items get honest usage + API, no fake previews. DOC_DATA now 51 entries.
- **Favicon:** `favicon-kol-ds.svg` wired, `currentColor` + `prefers-color-scheme` (visible on light & dark tabs).

### Docs
- **`docs/shells/01-reference-shells.md`** (new pillar): logs the shadcn docs shell (this repo), the workshop shell (kol-monorepo /workshop), and the blocks/collections concept — with the rule "shells are imported, never re-authored per page." Routed from `docs/INDEX.md`.

## Current state
- All pages 200, no compile errors. 49 one-file demos · 51 DOC_DATA entries · 53 registry components.
- **Nothing published** — 4 changesets held per direction; ship as one batch (loader minor, component minor, framework patch).

## Ideas / improvements ledger (from this session)
1. **Menu family refactor (own project):** the row primitives (`MenuDropdownItem/Divider/Nest`) are correct compound parts — keep. The real redundancy is **`MenuItem` vs `MenuPopover`** (two triggers, same job, different positioning tech) → unify into one; **naming inversion** (`MenuItem` is a trigger, not a row) → rename with the ecosystem (`DropdownMenu`-style). Needs consumer migration; don't rush into this batch.
2. **Promote the docs shell** (`DocLayout`/`TopBar`/`Toc`/`DocSidebar`) into `@kolkrabbi/kol-framework` once stable.
3. **Import the workshop shell** + its components from kol-monorepo for side-by-side comparison; both shells stay valid (docs vs knowledge-base use cases).
4. **Blocks section** (shadcn-style composed collections) in the showcase — user has existing collections to seed it.
5. **API tables via react-docgen** — DOC_DATA is still the one hand-authored drift vector.
6. **Atomic question, open:** do BrandHero/SubPageHero belong in `organisms` rather than the framework tier?
7. **MenuPopover positioning:** hand-rolled fixed-position doesn't track scroll (floating-ui in MenuItem does) — fold into the menu refactor.
8. **Search stub in TopBar** is non-functional — command-palette search is a natural next (shadcn parity).
9. Next per user: shadcn feature sweep (what else to adopt), then log **metrics + chess components** from the monorepo.

## Next steps
- User reviews → then commit + push + merge Version PR (ships all 4 changesets: loader 0.2.0, component minor, framework patch).
- Then: shadcn other-aspects comparison; workshop shell import; blocks section.
