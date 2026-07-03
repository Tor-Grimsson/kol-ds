---
title: Review fixes, menu unification, and the monorepo ports (workshop shell, chess, color/type reference)
type: log
status: archived
updated: 2026-07-02
description: Closed the review list (selection, light default, stable TOC, categories back, waterfall, Docs nav), unified the menu triggers, and ported from kol-monorepo — the workshop shell, the presentational chess board, and the brand app's color + typography reference pages.
tags:
  - domain/design-system
  - pattern/component-docs
  - pattern/app-shell
repo: kol-design-system
related:
  - "[[session-log/2026-07-02-one-system-five-parts|one system five parts]]"
  - "[[shells/01-reference-shells|reference shells]]"
---

# Session: Review fixes + monorepo ports

**Date:** 2026-07-02
**Agent:** Grim (Fable 5)
**Summary:** Third pass of the day — closed the user's review list, finally unified the menu family, and executed three verbatim ports from kol-monorepo (workshop shell, chess board, color/typography reference). All ports byte-diff-verified by the port agents; only import paths adapted.

## Review fixes
- **Text selection restored** — `kol-framework.css` sets `user-select:none` globally (deliberate editor-app rule); the docs site opts back in via `showcase/src/index.css`.
- **Light theme default** — boot script in `index.html` (light unless `localStorage.kol-theme` says otherwise); dark-default is a per-repo preference, not a rule.
- **TOC rail always reserved** — main column no longer shifts between pages with/without a TOC.
- **Categories restored** — sidebar + index grouped by atoms/molecules/primitives/organisms/graphics/framework tiers again (A→Z within groups = stable slots); function tags remain filter chips only. Flat-only was over-rotation.
- **Waterfall index** — `columns-*` + `break-inside-avoid` + capped card previews (`max-h-56`); tall demos can't blow holes in the grid.
- **TopBar** — Docs link added (shadcn order); search is the KOL `Input` (filled/sm); GitHub icon in a 32px box aligned with ThemeToggle.
- **Prev/next pager** on component pages (shadcn parity).

## Menu family — unified (was repeatedly deferred; done now)
- **`MenuPopover` is a deprecated alias of `MenuItem`** (`packages/component`): identical APIs, duplicate implementations (hand-rolled fixed positioning vs floating-ui); one floating-ui implementation remains. Changeset staged (`menu-unify.md`, minor). Alias removal + ecosystem renaming (trigger should read as a "menu", rows as "items") queued for next major.
- **`/docs/menus`** — the family table, "which one do I use", composition standards (panel min-width, 16px icon column, shortcut slot, defaultOpen policy).

## Monorepo ports (all verbatim; imports-only adapted; agents diff-verified)
- **Workshop shell** → `showcase/src/workshop/shell/` (ShellLayout/Header/Sidebar/Drawer/SearchOverlay + WorkshopSidebarContent + DocsToc + the `shell-*` CSS section extracted byte-for-byte from `packages/ui/css/components.css`) + `vendor/` (SearchInput, Wordmark, KolLogomark, useTheme/theme). Zero PORT-stubs. Live at **`/workshop-preview`** (standalone chrome, splat route) with sample nav groups + counts, ⌘K search, right-rail TOC + quick actions. Linked from the sidebar Docs group.
- **Chess** → `showcase/src/workshop/chess/` (ChessBoard 193 + ChessPiece 191 + 49 piece SVGs byte-identical + the 1225-line chess CSS) + `chess.js` dep (showcase-local). Block **"Chess board"** at `/blocks` — two boards, FENs validated by executing chess.js (Ruy Lopez Breyer; Najdorf on `brown` theme). The chess *apparatus* (controls/archive/variations) stayed behind — context-entangled, needs a props refactor; metrics dashboards also deferred (live kolkrabbi.io APIs; the `@kol/ui/dashboards` card library is the portable piece when wanted).
- **Color + Typography reference** (brand app `/reference` model) → `showcase/src/data/{color,typography}.js` (verbatim) + **`/foundations/color`** (brand aliases with swatch/resolves-to/use, ramps with live hex, cream, greyscale, UI surface/state/absolute/opacity) + **`/foundations/typography`** (family tokens, sans atomic classes with live samples + size/family/weight, prose, mono, hierarchy, cuts) + `lib/resolve-css-var.jsx`. In sidebar Overview. (Port agent was killed by a tmux crash mid-report but had already written everything; verified complete + wired after.)

## Current state
- All routes green on a fresh dev server, 0 compile errors. 4 changesets staged (loader inventory, loader social icons, component defaultOpen, component menu-unify) — publishing stays parked.
- Both shells now live side-by-side: docs shell (every docs page) vs workshop shell (`/workshop-preview`) — the comparison the TopBar alignment decision was waiting for.

## Ideas / notes
- Chess apparatus port = refactor context-reads to props (medium); metrics = mock-data fixtures + `@kol/ui/dashboards` port (low-medium).
- Packaging calls (confirmed direction): chess ≠ kol-component (own package if it proves shared); workshop shell → kol-framework candidate after shell comparison; dashboard cards → possible kol-component graduates.
- `wordmarkBrand`/`logomarkBrand` class hooks don't exist in kol-theme (brand chrome, out of DS scope) — harmless, wordmark renders via currentColor.
- Remaining from the shadcn sweep: ⌘K palette on the docs shell (the workshop shell already has one — could be THE shared search), Copy Page, "New" dots, block viewport toggles, changelog page.

## Next steps
- User review of: review-fixes, `/docs/menus`, `/workshop-preview`, chess block, `/foundations/color` + `/foundations/typography`.
- Then: shell comparison decision (docs shell vs workshop shell vs merge) → TopBar alignment → promotion into kol-framework.
