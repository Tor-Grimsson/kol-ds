---
title: Reference shells
type: reference
status: active
updated: 2026-07-30
description: The documented app shells in the KOL ecosystem — the shadcn-style docs shell (this repo), the workshop shell (kol-monorepo), and the blocks/collections concept. What each is made of and when to reach for it.
aliases:
  - reference-shells
tags:
  - domain/design-system
  - pattern/app-shell
sources:
  - showcase/src/lib/ShellChrome.jsx
  - packages/workshop/src/shell/ShellLayout.jsx
related:
  - "[[../06-research/workflows/01-component-workbench|component workbench]]"
---

# Reference shells

A **shell** is the reusable page chrome an app hangs its content in: top bar, sidebar(s), content column, right rail. The KOL ecosystem now has two proven shells plus one composition concept — all valid, different use cases. This is the registry; import or port from here, don't reinvent.

## 1 — Docs shell (shadcn reference) · this repo

> **RETIRED 2026-07-30.** The app-local shell (`DocLayout` · `TopBar` · `NavDrawer` · `SidebarNav`) is deleted; the showcase now wears the workshop shell through `showcase/src/lib/ShellChrome.jsx`. Kept here as the record of what it was and why it went. See "The showcase now wears this shell" below.

It was the showcase's unified chrome, modelled on ui.shadcn.com: `TopBar` (wordmark · path-active section links · ⌘K search over the barrel-derived roster · GitHub · `ThemeToggle`), a `DocSidebar` and a `Toc` rail both defined inside `DocLayout.jsx`, used as `<DocLayout toc={TOC}>…</DocLayout>`.

Why it went: the chrome was imported by each page rather than mounted once, so fourteen files carried the same decision and drifted; and every page hand-wrote its own `toc` array, which went stale against its own headings.

### Embed mode — `?embed=1` (2026-07-30)

Any showcase URL takes `?embed=1` and renders **main content only**: no TopBar, no sidebar, no TOC rail. For iframing showcase pages into other repos (the website embeds `/components` the way it already embeds the kol-ds-fxr editor at `/workshop`).

| Aspect | Behavior |
|---|---|
| Mechanism | `showcase/src/lib/useEmbed.js`, read by `ShellChrome` — **not** per page |
| Scope | **Layout-level** — every page under the layout route is embeddable, zero page-file changes |
| Rails | The shell is **bypassed entirely** in embed mode (it is `fixed inset-0` with its own scroll regions); main content renders in a plain capped column |
| Padding | Content padding KEPT (`--kol-pad-section-*`); only chrome is dropped |
| Latch | Per-document: a doc that boots embedded stays embedded, so in-frame link-following can't pop chrome into the host |
| Nav rework | Unaffected by design — embed is defined by ABSENCE of chrome, so there is nothing to keep in sync |

Examples: `/components?embed=1` · `/docs/type-roles?embed=1`. Page-owned `<header>`/`<aside>` elements (a DocHeader, a chess demo's own rail) are content and correctly survive.

**Status:** superseded — the shell now comes from `@kolkrabbi/kol-workshop`, so there is nothing app-local left to promote.

### Convergence with the kol-website fork (2026-07-30, workshop 0.2.0 + framework 0.6.2)

kol-website did **not** consume the package — `apps/web/vite.config.js:37` aliased `@kolkrabbi/kol-workshop` to a local copy at `apps/web/src/workshop-system/` (26 files, 2,749 lines), which is where the shell actually evolved. That copy is now folded back in, so the alias can be dropped.

| Taken from the website | Where it landed |
|---|---|
| Tooltips on every icon-only control | `packages/framework/src/ShellHeader.jsx`, `packages/workshop/src/shell/{ShellLayout,ShellSidebar}.jsx`, `compositions/WorkshopSidebar.jsx`, `tags/TagModeOverlay.jsx` |
| `<header>` landmark · `kol-mono-14` tabs · lg-rung ThemeToggle | `ShellHeader.jsx` — the website's 158-line `WorkshopHeader` fork existed ONLY for these, so it is retired, not imported |
| `aria-label` on nav/TOC asides · `id="main"` | `shell/ShellLayout.jsx` |
| Brand link split — KOLKRABBI → site home, WORKSHOP → shell root | `shell/ShellLayout.jsx` |

Five defects both copies carried, fixed here: `ShellDrawer` took `open` not `isOpen` (**no mobile nav at all**); `ShellSearchOverlay` got the pre-0.12 API (**⌘K rendered nothing**, `searchItems` + `matchSearchItems` were dead code — the shell now owns query state and feeds results); the hamburger flipped each rail independently and desynced them; `groupDocsByMajor` only matched dotted or `NN-name-index` ids, so a `NN-slug.md` vault listed **only its INDEX files**; `DocumentationReader` called a possibly-null `ShellTocContext` and crashed outside a shell.

### The showcase now wears this shell (2026-07-30)

`showcase/src/lib/ShellChrome.jsx` mounts `ShellLayout` ONCE as a route-level layout in `showcase/src/App.jsx`. Every page is content only; nothing imports a layout. The four app-local chrome files (`DocLayout.jsx`, `TopBar.jsx`, `NavDrawer.jsx`, `SidebarNav.jsx`) are **deleted** — fourteen pages had each carried their own copy of the same decision, which is how they drifted.

| Was | Now |
|---|---|
| 11 pages import `DocLayout`, 3 import `TopBar` | one layout route, pages render into `<Outlet/>` |
| each page passes a hand-written `toc` array | TOC **derived** from rendered headings (`ShellChrome`), arrays deleted |
| `?embed=1` unmounts chrome per host | `ShellChrome` bypasses the shell entirely in embed mode |
| block/set previews wrapped in chrome-suppression | they route **outside** the layout — chrome-less by contract |

Shell seams added for non-workshop consumers (kol-workshop 0.3.0): `brand` (any node), `actions` (row-1 slot), `isActive` (override prefix-only tab matching).

**THE VAULT is in the shell (2026-07-30):** the repo's `docs/` library globs through `showcase/src/lib/vault.js` → the workshop engine's `buildInventory` (collision-safe ids since 0.3.2 — duplicate basenames gain their parent folder) → a grouped `Documentation` section in the sidebar + `/docs/vault/:docId` rendered by `DocumentationReader` with the frontmatter panel — the kolkrabbi.io/workshop model on this repo's content. Rails clip horizontally (0.3.2 `overflow-x-hidden` — long tree rows used to pan the whole grid sideways).

**One code idiom (user law 2026-07-30):** every code surface on a doc page renders through kol-component's `CodeBlock` — MDX fences (the `pre` map), the Usage import line, the install command (pm tabs above a CodeBlock), and the PreviewCard Code tab. No bespoke `pre`/copy twins. The right TOC rail wears the LEFT sidebar's idiom (`kol-mono-14` rows, `shell-sidebar-label kol-helper-10` label, authored case). Pager names are mono. Preview stage floor is 10rem. Atomic grouping is the sidebar default.

**ONE rail system (2026-07-30):** the right TOC rail wears the LEFT tree's exact idiom — `shell-nav-item kol-mono-14` rows — and EVERY rail section label (both rails + the vault reader's sidebar) is the `kol-doc-eyebrow` voice. The header carries the real brand pair again: KOLKRABBI wordmark (logo slot, links home) + `KOL DS` (typed placeholder until a drawn wordmark lands in kol-brand). Every component page prints its **Source** path (provenance ruling — `scripts/extract-api.mjs` emits `component-sources.json`); MDX docs render a **Frontmatter panel** from their meta. The preview figure ALWAYS caps at the panel token (the stage-conditional cap made sibling pages disagree).

**The rail/main/toc gutter is theme-owned** (kol-workshop 0.3.1 + kol-theme 0.12.2): `.shell-content-grid` states `gap: 32px` base / `48px` ≥1600px in `kol-components-workshop.css`. A `gap-8` utility on the grid element used to outrank the layered theme rule at every width, so the 48px wide step was dead code — the ARCHITECTURE §5 utility-vs-rule disease, in geometry.

**Pages are MDX** (the shadcn model, migration completed 2026-07-30): `@mdx-js/rollup` is wired, `showcase/src/docs/*.mdx` renders through `MdxDoc` with `<Preview name="…" />` reading the demos registry, `<Api name="…" rows={…} />` merging in-document authored rows with the react-docgen extraction (now covering every UI package), `<Install name="…" />` resolving the package from the registry, and `<Parts name="…" />` rendering compound members. `ComponentPage` checks for `src/docs/components/<Name>.mdx` first (66 docs) and falls back to a generated page (header + install + extracted API) for components without one; `component-docs.js` is deleted. Doc furniture (meta rows, pager) renders from `lib/component-page-parts.jsx` on both paths. **MDX bodies do NOT wear `.kol-prose`** (user law 2026-07-30 — prose is the blog system; its 720px cap caged previews and tables too): the mdx element map types markdown per-tag through the `kol-doc-*` roles, so running text self-caps at `--kol-content-measure` while Preview/Api/Install/tables run the full main column — the one-frame law. Vite gotcha: the MDX plugin must be `include: /\.mdx$/` — it claims `.md` too by default and breaks every `?raw` markdown import.

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
