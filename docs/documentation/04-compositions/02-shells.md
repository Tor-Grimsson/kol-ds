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

**ONE rail system (2026-07-30, enforced 2026-07-30 evening):** the right TOC rail wears the LEFT tree's exact idiom — `shell-nav-item kol-mono-14` rows — and EVERY rail section label (both rails + the vault reader's sidebar) is the `kol-doc-eyebrow` voice.

This paragraph existed for a day as prose and was broken three ways in that time: on-this-page rows at `kol-mono-12` with no indent, quick actions on a third geometry (`.shell-sidebar-action`), and group headers on `kol-helper-14` — one of them directly beneath a `{/* ONE rail voice (user law) */}` comment. It is now a gate: **`pnpm validate:rails`** (`scripts/validate-rails.mjs`) reads the six rail components and fails on any type class outside `kol-mono-14` / `kol-doc-eyebrow`, or any competing row geometry. A rule with no script is folklore.

Two consequences of the sweep worth knowing: a sidebar group **with no children is now a Link, not a toggle** — it used to render a chevron that rotated over an empty body and never navigated, so "Icons" and "Components" did nothing when clicked — and the rail label no longer forks on whether the consumer passed `labelTo`.

**The brand pair:** KOLKRABBI wordmark (logo slot, links home) + the **WORKSHOP wordmark** (`wordmark-workshop.svg`, kol-brand) as the surface mark — the same pair `ShellLayout` ships as its package default. A typed `KOL DS` span held that slot for a day on a comment claiming no drawn asset existed; one did, and it wrapped to two lines in the header. Drawn asset over typed text.

**R1 · A RAIL IS NEVER A RESERVED EMPTY GUTTER (2026-07-30 evening).** Ten routes used to reserve 224px on the right and fill it with nothing — `/`, `/icons`, `/blocks`, `/blocks/:slug`, `/sets`, `/sets/:slug`, `/references`, `/references/:name`, `/lobby`, and every collection page. The cause was one line: `hasToc = Boolean(defaultTocContent)`, and an *element* is truthy even when the component inside it renders null.

Three fixes were tried and rejected before the one that shipped. Measuring the mounted column **deadlocks** — once the column unmounts the probe is gone and can never report content again. Calling a render-prop inline makes the consumer's hooks belong to `ShellLayout`, one refactor away from a crash. A boolean prop puts the answer in the consumer, which does not know it either.

**The column decides for itself.** The grid track is `auto` rather than a fixed `224px`, and the width moved onto the rail's inner wrapper as `w-56 empty:hidden`. A rail whose content renders nothing measures zero, the track collapses, and the main column takes the space back. Nothing to keep in sync, nothing to deadlock. Measured: `/` `/icons` `/blocks` `/references` go from a 224px empty gutter to 0, main 640 → 864.

That is the **floor**, not the standard. The standard is that a rail carries *On this page* when the page has headings **and at least one more section drawn from data the route already holds** — the shape `DocReaderSidebar` already ships (On this page · Related · Quick actions · Tags). Every route has the data: component pages have tags, `reuses`, origin and source path; collection pages have `composition` and prev/next; `/icons` has its group inventory; `/components` has the function chips. None of it needs new extraction. Rails are filled per category as each is readmitted, and verified in a browser — a static gate cannot see a rendered rail, so this rule is checked live rather than pretended to be linted.

**SPECIMENS ARE NOT THE PAGE.** A heading rendered inside a demo or a type specimen describes the component being shown, not the document showing it. Counting them produced two leaks: the typography page's `<h2>Sample display-md</h2>` specimens sat inside `DocSection id="prose"`, giving three TOC rows that all anchored `#prose`; and the DocsToc demo rendered its own `<section id>` + `h3`, injecting four rows named after another component's fake TOC. `useHeadings` now skips anything inside `[data-toc-skip]`, `.kol-doc-figure` or `.kol-demo-stage`. Verified: typography went 9 rows → 6, with the three `Sample …` rows gone.

**R2 · A SURFACE THAT CANNOT BE FOUND DOES NOT EXIST (2026-07-30 evening).** Three failures, all invisible until someone went looking.

`buildShellSearchItems` built rows from `r.children` only, so a top-level tab with no children contributed **nothing** — `/icons`, `/references` and `/documentation` could not be found by typing their own names. Every route is a row now, parent as well as child.

**ONE search.** Tags had their own separate box inside the tag overlay — a second global search that knew nothing about the first, and that you could only reach by clicking a tag somewhere else first. Tags are rows in ⌘K now. Because selecting one *toggles state* rather than navigating, rows may carry an **`action`** closure and `onSelect` prefers it over `href`; the shell stays ignorant of what the closure does.

That seam had a bug worth recording: `ShellLayout` reshapes engine results into the overlay's row shape, and the projection rebuilt each row as a fixed set of fields — **silently dropping `action`**. The row rendered, matched, highlighted, clicked, and did nothing. It looked correct at every step, which is why `validate-reachable` now asserts the projection preserves it.

**The node graph has an entry point.** It was reachable only by clicking a tag inside `/documentation/:docId`, and its only control was gated on `hasFilters` — the button did not exist in the DOM until a tag was already active, so the graph could only be discovered by accident. `TagModeGate` now wraps every shell route, and the graph toggle is always present; with no tags active it renders the whole map, which is the view worth opening cold. Verified from `/foundations`: ⌘K → tag row → graph, 39 nodes and 135 edges.

**Shortcuts are one list.** There was no help UI anywhere: ⌘K was an unlabelled icon button and `Alt+B` was an undocumented duplicate. A `?` sheet now renders **from the same array that binds the keys**, so a shortcut cannot be documented-but-unbound or bound-but-undocumented. `Alt+B` is dropped. The handler ignores keystrokes aimed at inputs, textareas and contenteditable.

**R3 · GENERATED WINS — the drift rule (2026-07-30 evening).** Every doc surface here has two layers: a generator that reads the source, and a hand-authored layer on top. Where they disagree about a **fact**, the generator wins.

`mergeApi` (`showcase/src/lib/component-page-parts.jsx`) used to prefer the authored `def`/`type`, so a default that changed in the source kept rendering its old value forever. That is not hypothetical: `ThemeToggle.mdx` announced *"the default flipped at 0.10.0"* in prose three lines above an `<Api>` row still claiming `fill: subtle`, and `Tag.mdx` claimed `size: md` against a source that says `sm`. Both shipped.

The split is by KIND, not by source: **`type` and `def` are machine facts** and now take the generated value; **`desc` is prose a human writes** and still takes the authored one.

Correcting the render is not enough — a merge that silently fixes a wrong value leaves the wrong value in the file, where the next reader believes it. **`pnpm validate:drift`** (`scripts/validate-drift.mjs`) fails on the disagreement itself, comparing only where the generator *has* a value, so a hand-authored row for something react-docgen cannot see (`children`, `iconLeft / iconRight`) is not drift.

**The fix for a hit is to DELETE the authored value, never to retype it.** The contract stated in `mdx-components.jsx` is that extraction-covered components pass `name` alone and stay drift-free by construction; blanking a `def` to `—` hands the field back to the generator permanently. Retyping it just resets the clock on the next drift.

**ONE metadata contract (2026-07-30 evening):** the frontmatter panel is `DocsFrontmatter`, and it is now the ONLY one — the showcase's `MdxDoc` carried a second panel with the opposite strategy (a denylist over `meta` where the reader used an allowlist), so the two surfaces disagreed about what metadata even is.

It **orders** rather than filters: contract fields first (`title` · `type` · `status` · `updated` · `tags` · `description` · `aliases` · the optional set), legacy sample-dialect keys next, then any key it doesn't recognise — so a field can never be dropped for being unfamiliar. `related` is the single deliberate omission, because the rail already renders it as live links.

All three surfaces now carry the same fields: the vault's 46 markdown docs already did; the 66 component MDX pages are generated onto it by **`pnpm sync:mdx-frontmatter`** (idempotent, author values always win, gated in CI by `pnpm validate:frontmatter`); and the 30 set/block JSX modules — which are not markdown, so their contract lives in the module's `meta` export — were converged the same day.

**Rail sections wear the tree's header (2026-07-30 evening):** rotating chevron, label, count, on both rails. They were bare text that collapsed on click with no chevron and no count, so the only way to learn they were interactive was to click something inert and watch the panel disappear.

**THE frame (2026-07-30 evening):** `ShellLayout`'s content wrapper caps at `--kol-content-shell`, centred, on the `--kol-pad-section-x` ramp. It previously carried `w-full px-4 md:px-5 lg:px-6` — no cap at all, and Tailwind's 16/20/24 steps instead of the ramp's 20/32/48 — so **every consumer page inherited the raw viewport** (measured 2152px of frame in a 2200px window, against an 1800px law). Every per-page width complaint was downstream of that one line. Now gated by **`pnpm validate:width`**.

The TOC column also renders at `xl`, matching the breakpoint at which the grid actually declares a third column. At `lg` it put three children in a two-column grid between 1024 and 1279px: the rail wrapped to an implicit second row and `h-full` split the height, giving `<main>` ~373px of a 900px window — which is why `/icons` and `/components` read as empty pages when they were rendering 165 icons and 188 components. Every component page prints its **Source** path (provenance ruling — `scripts/extract-api.mjs` emits `component-sources.json`); MDX docs render a **Frontmatter panel** from their meta. The preview figure ALWAYS caps at the panel token (the stage-conditional cap made sibling pages disagree).

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
