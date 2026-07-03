---
title: Blocks/Sets split + E3 close
type: log
status: active
updated: 2026-07-03
description: Rebuilt /blocks as a shadcn-style landing (hero + category tab strip + Preview/Code stage), split full-apparatus compositions out to a new /sets page (chess moved there), and closed E3 — LabeledSection ported, the other 22 brand candidates reasoned-rejected against the current table-driven Foundations pages.
tags:
  - domain/design-system
  - domain/workflow
repo: kol-design-system
related:
  - "[[../../plan|execution plan]]"
  - "[[../../backlog/2026-07-02-brand-extraction-scan|brand extraction scan]]"
  - "[[2026-07-03-context-reset-fresh-agent|prior session]]"
---

# Session: Blocks/Sets split + E3 close

**Date:** 2026-07-03
**Summary:** Two tracks. (1) Reframed the `/blocks` concept — **blocks = UI compositions**, **sets = full apparatus** — rebuilding `/blocks` as a shadcn-style landing and standing up a new `/sets` page. (2) Closed E3: only LabeledSection earned a port; the rest were reasoned-rejected. Showcase-only; no package code changed, no changesets added.

The old `/blocks` was a flat docs-list (DocLayout + DocSection) that lumped the chess board in with UI compositions. Rebuilt as a full shadcn `/blocks` **landing** — after a first pass that was still too list-like; the user's literal ask was to diff shadcn's stage and copy it. Chess is a *set*, not a *block*.

- **`/blocks` → shadcn landing** (`pages/Blocks.jsx`): standalone `TopBar`, centred hero, a **category tab strip** (Featured + per-category) + **"Browse all blocks"**. Category/featured tabs render the **`BlockViewer` stage**; "Browse all" renders a **gallery** of every block (clipped live thumbnail + title + open-in-new-tab).
- **`lib/BlockViewer.jsx` — the shadcn stage**: Preview/Code toggle · block description · **device breakpoint toggles** (desktop/tablet/mobile) that resize an **`<iframe>` over a dot-grid** so real breakpoints fire at the frame width · fullscreen · refresh · copy-source · open-in-new-tab. Code tab shows the block's `?raw`.
- **`pages/BlockPreview.jsx` + `/blocks/preview/:slug`**: the BARE, chrome-less full-page render of one block — doubles as the iframe `src` AND the "open in new tab" slug page (user is OK with slug pages).
- **`blocks/SidebarDocs.jsx` — new featured Sidebar block**: a grouped, searchable docs sidebar + breadcrumb + skeleton content. ⚠️ **Lesson: `@kolkrabbi/kol-framework`'s `SideNav` is router-coupled app chrome — it can't render in isolation. A `MemoryRouter` wrapper throws `You cannot render a <Router> inside another <Router>` (the app + each iframe already carry a BrowserRouter).** Built the block **presentationally** (local `useState`, no router) instead — renders anywhere, closer to shadcn's `sidebar-01`. Also: a gallery card's clickable preview must NOT be a `<button>` (blocks contain their own buttons → nested-button HTML error); thumbnail is a plain div, only the title/footer are interactive.
- **Blocks gained a `category`** in their meta: SidebarDocs `sidebar` (`featured`), InspectorPanel `panel`, SettingsForm `form`, FilterBar `toolbar`. `blocks-registry.js` exposes `category`/`featured`, `CATEGORY_LABELS`, ordered `BLOCK_CATEGORIES`, `FEATURED_BLOCKS`, `getBlock(slug)`.
- **`/sets` → new page** (`pages/Sets.jsx`) on the *old* blocks-list treatment (DocLayout + PreviewCard). `lib/sets-registry.js` globs `../sets/*.jsx`. Chess moved `blocks/ChessBoard.jsx` → `sets/ChessBoard.jsx` (import path unchanged — same depth).
- **Wiring:** `/blocks/preview/:slug` + `/sets` routes in `App.jsx`; `Sets` nav link in `TopBar` + `DocLayout` overview.
- **User review round 2 — three misses, fixed:** (1) **Browse all is a stacked LIST of full stages** (shadcn shows every variant full-width, one stage under the next), with a **list/grid `ViewToggle`** — grid of compact cards is the *alternate* view, not the default. (2) **Blocks must not self-frame**: SidebarDocs had `h-[560px]` + border + rounded → could never fill anything; now `h-full w-full`, the container owns the frame. (3) **`/blocks/preview/:slug` renders full-bleed** (shadcn `/view/<block>`): a `full` block fills the viewport edge-to-edge = product UI, not a boxed preview; panel blocks centre via DemoStage. BlockViewer's in-page fullscreen deleted — the **maximize icon = open the standalone slug** (shadcn's expand semantic); separate external-link button dropped.
- **Verified live** (dev server + Playwright DOM eval): slug page = aside at 0,0 filling the full viewport, no frame/TopBar/padding; browse-all list = one iframe-stage per block, grid toggle works; block fills its stage iframe exactly (620/620) — **zero console errors**. Build clean. Block slugs are PascalCase filenames (`/blocks/preview/SidebarDocs`) — functional but a future kebab-slug field would be prettier.

## E3 close

Re-evaluated the 24-piece brand scan against the **current** showcase (Foundations pages were rebuilt table-driven / live-token *after* the scan). Full disposition in the scan doc (now `archived`).

- **Ported:** TypeSpecCard → **LabeledSection** (`showcase/src/lib/LabeledSection.jsx`) — generalized (content-agnostic, optional meta column), Tailwind-first, no separate CSS. (Swatch already done in E2.)
- **Rejected (22):** Ramp/TypeSample/SpectrumGrid + all tier-2 — redundant with the table-driven Foundations pages, no present KOL consumer (YAGNI), or brand-locked. Reasons recorded per-item.
- Net: E3's value was the **triage** — 2 ports, 22 reasoned rejections. Closed.

## Next steps

1. **Live visual pass** — validate `/blocks` landing + `/sets` render clean (HMR-ready, not smoke-tested here). The user flagged visual mistakes on other pages last session; watch for the same.
2. Populate `/blocks` with real UI blocks (login, signup, navbar, modal) — the categories now exist, the content is thin (3 blocks).
3. Batched publish of the 8 held changesets when unparked.
