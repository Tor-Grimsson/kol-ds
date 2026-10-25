---
title: Site adoption
type: playbook
status: active
created: 2026-10-24
updated: 2026-10-24
audience: internal
description: Taking the site frame in a sibling repo
tags:
  - domain/workflow
  - audience/agency-internal
  - pattern/workflow
aliases:
  - site-adoption
related:
  - "[[INDEX|Apps tier]]"
  - "[[06-studio-adoption|Studio adoption]]"
  - "[[09-app-adoption|App adoption]]"
  - "[[../../documentation/04-compositions/18-site-frame|Site frame]]"
---

# Site adoption

How a site on the site rail — kol-branding, kol-website's brand app, kol-acyr-website's styleguide, kol-olina — takes the frame as the DS ships it after 2026-10-24, so its rail, its phone mode and its page parts are site-hub's.

| Step | What it closes | The reference |
|---|---|---|
| 1 | the bump | — |
| 2 | the frame: `SiteLayout` replaces the repo's `BrandLayout.jsx` | `apps/site-hub/src/App.jsx` Frame |
| 3 | the tree: foldernotes, groups, anchor rows | `apps/site-hub/src/App.jsx` NAV |
| 4 | the pages on the parts | `apps/site-hub/src/research/ResearchPages.jsx` |
| 5 | what leaves | — |
| 6 | verification | `_tmp/2026-10-24-site-hub-walk/` |

## 0. Prerequisites

- The DS wave is live on the registry: kol-component, kol-framework and kol-theme at the versions that carry `SiteLayout`, the foldernote, the uppercase groups, the clip-model collapse and the phone drawer (the phase log names them once published).
- The repo runs Vite with Tailwind v4, the cascade order and the `@source` lines of the consumer contract.

## 1. Bump

`pnpm up` the `@kolkrabbi/*` packages to the wave; `/scan` reads clean.

## 2. The frame

Mount `<SiteLayout navTree={NAV} pageWash="var(--kol-fg-02)">` as the route element and the pages as its child routes. The repo's `BrandLayout.jsx` (and a forked `SideNav.jsx` where one exists) goes to `_tmp/<date>-site-frame/`; its scroll spy, hamburger, backdrop and `?embed` branch are the frame's now (`bare` for the embed).

## 3. The tree

- A category that is a page of its own gets `to` beside its `pages` — the foldernote; its Overview sub-row goes.
- A page split into sections keeps one route with `#section` rows; a page split into sub-pages keeps routes. Either can be grouped with `{ label, children }` — within a category, every row grouped or none.
- The page's opening section joins the scroll spy first so the bare row lights at the top (site-hub's `OPENERS`).

## 4. The pages

- A foldernote's overview is `CategoryPage` from the tree; a page row's `card` puts it there.
- A page with its own controls carries `PageControls` (toggles · views · count · jump · legend), one order everywhere.
- A document wears `.kol-sheet`; an article wears `.kol-prose`.
- The brand pages are kol-styleguide's `BrandBook` and `BrandAssets`; every other page opens with `PageHeader`.

## 5. What leaves

The local frame and its CSS, the local rail fork, any article card with a hover zoom, a second search modal beside the Hub's, and every width or collapse rule the repo kept for itself.

## 6. Verification

Walk the site at 1440 and 390: the rail collapses as one motion and a press on the collapsed rail stays collapsed; the phone drawer opens top-right and closes on a destination; each foldernote opens its overview; group labels are uppercase and never light; the console is clean. The site-hub walks in `_tmp/2026-10-24-site-hub-walk/` are the shape of that check.
