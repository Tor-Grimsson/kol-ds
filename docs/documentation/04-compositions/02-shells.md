---
title: Reference shells
type: reference
status: active
updated: 2026-07-15
description: The documented app shells in the KOL ecosystem — the shadcn-style docs shell (this repo), the workshop shell (kol-monorepo), and the blocks/collections concept. What each is made of and when to reach for it.
aliases:
  - reference-shells
tags:
  - domain/design-system
  - pattern/app-shell
sources:
  - showcase/src/lib/DocLayout.jsx
  - showcase/src/lib/TopBar.jsx
related:
  - "[[../06-research/workflows/01-component-workbench|component workbench]]"
---

# Reference shells

A **shell** is the reusable page chrome an app hangs its content in: top bar, sidebar(s), content column, right rail. The KOL ecosystem now has two proven shells plus one composition concept — all valid, different use cases. This is the registry; import or port from here, don't reinvent.

## 1 — Docs shell (shadcn reference) · this repo

The showcase's unified chrome, modelled on ui.shadcn.com. **Every docs page wears it**; Home renders only the TopBar (landing, no sidebar).

| Piece | File | Role |
|---|---|---|
| `TopBar` | `showcase/src/lib/TopBar.jsx` | Wordmark · section links (path-active) · component search (⌘K → `ShellSearchOverlay` over the barrel-derived roster; Lobby link is dev-only) · GitHub (`social-github` icon) · `ThemeToggle` |
| `DocSidebar` | in `DocLayout.jsx` | Overview links (Foundations / Icons / Components) + the full component tree, grouped by category; sticky, scrollable |
| Content column | in `DocLayout.jsx` | Default: centred `max-w-3xl`. `wide`: layout handed to the page (PageSection owns width/padding) |
| `Toc` | in `DocLayout.jsx` | "On this page" right rail, anchor links, `sub` indent |

Usage: `<DocLayout toc={TOC}>…</DocLayout>` / `<DocLayout wide>…</DocLayout>`. The sidebar derives active state from the path — no props to thread.

**Status:** app-local in the showcase. **Promotion candidate:** move into `@kolkrabbi/kol-framework` once stable, so brand app / consumers can import the same docs shell.

## 2 — Workshop shell · kol-monorepo

`kol-monorepo` `/workshop` (live: kolkrabbi.io/workshop). Richer than the docs shell — a **knowledge-base chrome**:

- Brand bar (logomark · section wordmark · search/theme/menu) over an **icon top-nav** of chapters.
- Left rail: **collapsible groups with item counts** (Workshop / Documentation trees).
- Right rail: on-this-page + **quick actions** (Back, All documentation, View components, Copy path) + **tag list**.
- Content: **markdown-docs parser** — renders frontmatter (title/date/tags/modified) as a styled header, numbered doc tree (`0.0.0` index numbering), card grids for chapter overviews.

**Status:** lives in the monorepo, not yet componentized here. **Direction (2026-07-02):** import the workshop shell + its components into the showcase to compare side-by-side with the docs shell; both stay valid — docs shell for component documentation, workshop shell for knowledge-base / chaptered content.

## 3 — Blocks / collections (concept)

shadcn's "Blocks" = pre-composed, copy-pasteable multi-component sections (dashboards, login pages, sidebars). The KOL equivalent already exists informally — composed collections across the consumer apps. **Planned:** a Blocks section in the showcase presenting KOL compositions (inspector panels, filter bars, forms) built from the packages, each a one-file demo like components.

## Verdict — 2026-07-02 (recommendation, pending user sign-off)

Both shells lived side-by-side since the workshop port; the comparison lands on **split by use-case, not winner-take-all**:

1. **The showcase keeps the docs shell.** It already carries every page; nothing in the workshop chrome improves component/API documentation.
2. **Workshop shell: keep `/workshop-preview` as the living reference; promote to kol-framework only when a second real consumer needs knowledge-base chrome** — promotion now would be speculative packaging. Promotion is its own session: componentize brand bar / left rail / right rail, and delete the vendored theme files.
3. **A6b closed en route:** the vendored `workshop/vendor/theme.js`/`useTheme.js` now share ThemeToggle's `kol-theme` storage key, default light, and treat the boot script's `<html data-theme>` as the on-load source of truth — the workshop preview can no longer flip the site dark. The files die entirely at promotion time.

## Rules of thumb

- Component/API documentation → **docs shell**.
- Chaptered knowledge base, markdown-driven, tags/quick-actions → **workshop shell**.
- Selling compositions, not parts → **blocks**.
- New page in either shell: the shell is imported, never re-authored per page.
