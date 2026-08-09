---
title: Reference shells
type: reference
status: active
created: 2026-08-01
updated: 2026-08-09
description: The documented app shells, and their uses
aliases:
  - reference-shells
tags:
  - domain/layout
  - audience/consumer
  - pattern/app-shell
sources:
  - showcase/src/lib/ShellChrome.jsx
  - packages/workshop/src/shell/ShellLayout.jsx
related:
  - "[[../../operations/06-workflows/01-component-workbench|component workbench]]"
---

# Reference shells

A **shell** is the reusable page chrome an app hangs its content in: top bar, sidebar(s), content column, right rail. The KOL ecosystem now has two proven shells plus one composition concept — all valid, different use cases. This is the registry; import or port from here, don't reinvent.

## Docs shell

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

**One code idiom (user law 2026-07-30):** every code surface on a doc page renders through kol-component's `CodeBlock` — MDX fences (the `pre` map), the Usage import line, the install command (pm tabs above a CodeBlock), and the PreviewCard Code tab. No bespoke `pre`/copy twins. The right TOC rail wears the LEFT sidebar's idiom (`kol-mono-14` rows, `kol-doc-eyebrow` label on the shared eyebrow box, authored case). Pager names are mono. Preview stage floor is 10rem. Atomic grouping is the sidebar default.

**ONE rail system (2026-07-30, enforced 2026-07-30 evening):** the right TOC rail wears the LEFT tree's exact idiom — `shell-nav-item kol-mono-14` rows — and EVERY rail section label (both rails + the vault reader's sidebar) is the `kol-doc-eyebrow` voice.

This paragraph existed for a day as prose and was broken three ways in that time: on-this-page rows at `kol-mono-12` with no indent, quick actions on a third geometry (`.shell-sidebar-action`), and group headers on `kol-helper-14` — one of them directly beneath a `{/* ONE rail voice (user law) */}` comment. It is now a gate: **`pnpm validate:rails`** (`scripts/validate-rails.mjs`) reads the six rail components and fails on any type class outside `kol-mono-14` / `kol-doc-eyebrow`, or any competing row geometry. A rule with no script is folklore.

**THE EYEBROW BOX — one owner (user ruling 2026-08-01):** the voice law above locked what a rail label *says* and left what it *sits in* to the call site, so the two rails drifted anyway. Measured: the left eyebrow ran `shell-sidebar-toggle shell-sidebar-label` on the wrapper **and `shell-sidebar-label` again on the inner label** (two bottom margins) plus an inline height on its chevron; the right borrowed `shell-nav-group-header` — the louder *nav* row's box — plus one `shell-sidebar-label`. Same eyebrow, two boxes, `validate:rails` green throughout.

| Rule | Detail |
|---|---|
| One box class | `shell-sidebar-toggle` (collapses its section) **or** `shell-sidebar-label` (static). Never both, never beside `shell-nav-group-header` |
| One definition | Both names share a single CSS rule in `kol-components-workshop.css` — padding *and* margin — so the two kinds cannot drift from each other either |
| One rhythm | y-padding is `--kol-pad-rail-row-y`, the same token `.shell-nav-group-header` reads; bottom separation is `--kol-spacing-2` |
| Nothing inline | y-spacing set in a `style={{}}` is invisible to the stylesheet — that is how the inline height survived |
| Interactivity ≠ class | `cursor`/hover attach via `:is(button, a, [role='button'])`, not a second class at the call site |

Enforced as **R3** in the same gate. The failure mode is *count*, not value — R3 counts box owners rather than measuring pixels, because nothing here ever rendered broken, the rails just stopped agreeing.

**No chevron on a rail eyebrow (user ruling 2026-08-01):** section eyebrows still collapse and expand on click; the icon is simply not drawn. This reverses the 2026-07-30 affordance note in `DocumentationReader` — the chevron was added because bare text gave no signal, and the ruling is that the signal is not worth the glyph.

### THE RAIL LADDER — three rungs, one component (user ruling 2026-08-01)

R3 fixed the eyebrow's box and the rails still disagreed, because the user then pointed at the **count**: `(7)` on the right rail's L1, `(8)` on the left rail's L2 — the same affordance printed on different rows. His question was the right one: *"how can we use classes to make the system work for us?"*

**The answer is that a class can't.** The three rungs already had a class each; that was never the gap. What was missing is that nothing declared them a **ladder**, and every affordance hanging off a rung — count, collapse, chevron — was hand-typed at each call site. A class is vocabulary; it cannot stop a wrong composition.

| Rung | Class | Chrome | Owner |
|---|---|---|---|
| **L1** section | `.shell-sidebar-toggle` · `kol-doc-eyebrow` | collapse · **no count** · **no chevron** | `RailSection level={1}` |
| **L2** group | `.shell-nav-group-header` · `kol-mono-14` | collapse · **count** · **chevron** | `RailSection level={2}` |
| **L3** row | `.shell-nav-item` · `kol-mono-14` | leaf link · **active** | **`RailRow`** (+ `DocsToc`) |

The proof was already in the repo: **L3 is the one rung a component already owned, and the one rung that never drifted.**

**L3 was closed 2026-08-01.** `.shell-nav-item` turned out to be a shared *name* and nothing else: **nine hand-written utility stacks across five files** wore it, and their containers disagreed too (`space-y-0` against `space-y-4` for one list). The class now owns the whole look — layout, colour, hover, focus, active — and `RailRow` owns the markup. `.shell-nav-items` owns the gap.

| | Was | Now |
|---|---|---|
| Row strings | 9 | **1** — `shell-nav-item kol-mono-14` |
| Active state | left rail only | **both**, via `is-active` |
| Container gap | `space-y-0` / `space-y-4` | `.shell-nav-items` |

**Two row owners, named:** `RailRow` and `DocsToc`. `DocsToc` cannot fold into it — it lives in kol-component, and importing kol-workshop would be a reverse dependency (ARCHITECTURE §3). R4 exempts it *by name*; the fault it stops is a hand-written row at a **call site**.

**`useScrollSpy` gained a `root`.** The shell scrolls `#main` internally (it is `fixed inset-0`), so an observer rooted at the viewport never fired — which is why the right rail could not highlight anything no matter what class it wore.

`RailSection` (`packages/workshop/src/shell/RailSection.jsx`) is now that component for L1 and L2. It picks the rung's class, it **places the count**, it owns the collapse. No rail writes a header again — you cannot misplace a count you never type.

**The count is an L2 affordance (user ruling 2026-08-01):** *"dont list counter next to eyebrow category, just inside."* A category eyebrow names a body of material; the tally belongs to the groups inside it, not to the label over them. `RailSection` **drops a `count` passed at L1** rather than rendering it — the rung refuses it, so no call site can put one back. This settles the earlier same-level question by removing the affordance from that rung entirely rather than duplicating it.

**Rail row labels are the NAME, not the title (user ruling 2026-08-01):** *"dont Foundtation - the token system, just 'foundation'."* A doc's `title` is written for the document; a rail row is not the place to read a sentence — three of eight rows wrapped to two and three lines. `cleanTitle` now drops everything from a spaced em/en dash onward, so `Type classes — the two families and when to use which` renders as `Type classes`. An unspaced dash is a compound word and survives.

| Surface | Reads |
|---|---|
| Rail row | `cleanTitle` — the short name |
| **Search** | the **full** `title`, deliberately — hunting "the two families" must still find it |
| The doc itself | untouched; this is a label decision, never a rename |

> **Known collision:** `Foundations — the token system` and `Foundations — layout & breakpoints` both shorten to **`Foundations`**, so chapter 01 shows two identically-named rows. Resolving it means retitling one of the docs — user-facing text, so it waits on a ruling.

**Section order is the law, and now a gate.** `Components · Tools · Documentation · Operations` — **re-ruled by the user 2026-08-09** (*"components, sets, blocks etc. should be before Documentation"*): in the design system's own showcase, the showcase sections outrank the written record. This reverses the 2026-07-31 order (`Documentation · Components · Tools`), which had itself been rendered backwards by `ShellChrome` until the gate existed — the lesson both times is the same: nothing holds an order but the gate.

All of it is **R4**: a rung class written by hand fails, a `({n})` span placed by hand fails, section order out of sequence fails.

### THE STYLING CONTRACT IS GENERATED (user ruling 2026-08-01)

A component page carried frontmatter, tags, install, usage prose and a props table — and said nothing about **the classes it emits or the tokens it reads**, which is the half a design system exists to define.

`scripts/extract-styling.mjs` reads it off the source into `showcase/src/usage/styling.json`, and `MetaRows` renders two rows on every page: **Classes** and **Tokens**. 72 components, 28 with token references.

| Rule | Why |
|---|---|
| **Generated, never authored** | an authored block is a second copy of the stylesheet, and it drifts the first time someone edits CSS without opening the doc |
| Comments stripped first | a docstring naming another component's classes is prose, not markup — the same trap `validate:chrome` hit with Pill |
| Import specifiers stripped | `@kolkrabbi/kol-icons` matched the class pattern and every consumer listed `kol-icons` as a class |
| Template classes kept as a family | `kol-tag--${size}` is unreadable literally, so it records `kol-tag--*` — an incomplete list that looks complete is the failure this file ends |

**The props table now parses inline markdown.** Its cells printed raw strings, so `` `primary` `` rendered its own backticks. `Table` supported `column.render` all along and `renderInlineTokens` existed — but `processInlineMarkdown`, the token producer, was module-private, so the table had no reachable way to do it. Exported, and the cells render chips.

### THE RAIL'S VOCABULARY (user ruling 2026-08-01)

Four rungs, four names, used in code comments, gate messages and here:

| Name | Row | Class | Weight |
|---|---|---|---|
| **Category** | `DOCUMENTATION` | `.shell-sidebar-toggle` / `-label` + `kol-doc-eyebrow` | — |
| **Chapter** | `Foundations (5)` | `.shell-nav-group-header` | **500** |
| **Page** | `Tokens` | `.shell-nav-item` | **400** |
| **Section** | the right rail's rows | `.shell-nav-item` (same idiom, deliberately) | 400 |

Chapter and Page were **indistinguishable**: both `kol-mono-14`, and the only difference was `.text-body` — a **colour** utility, not type (that class was renamed `.text-default` on 2026-08-01; the point stands). A parent that reads identically to its children is not a hierarchy. The weight is the difference and it stays **inside one ramp**: R1 exists to stop a second *ramp* in the rails, and a weight within one is not one.

**Both rails are `--kol-sidenav-w` wide.** The right read 14rem against the left's 16rem; two rails framing the same content at different widths is a frame nobody drew on purpose.

### THE SEARCH PALETTE'S CONTRACT (documented 2026-08-01)

**It is not `molecules/Dropdown`.** Dropdown is a SELECT — a trigger, a `value`, `onChange(value)`, rows that are options. This is a COMBOBOX: a text query filtering a live list whose rows carry a group, a hint, and may fire an action instead of selecting. Same ARIA family, different control; folding one into the other means building this inside Dropdown.

| Field | Meaning |
|---|---|
| `label` | the row's text, match-highlighted against the query |
| `group` | right-aligned origin — `Atoms`, `Documentation`, `Tags` |
| `hint` | subtext, shown when the label was **not** what matched |
| `href` | a destination — dismisses the palette |
| `action` | a closure — runs and **keeps** the palette open (tag rows) |

Built by `buildShellSearchItems` (`showcase/src/nav/shell-nav.js`).

**The mode is said out loud.** Two modes exist — **filter** (tags narrow a set) and **find** (a keyword jumps to a destination) — and the only signal was whether chips happened to be present. The chip row is labelled `FILTERING BY` and the placeholder becomes `Narrow these results…`.

**A tag is a path, not a string.** `domain/components/atoms` printed flat, so the namespace read as noise inside the name. The namespace dims, the leaf carries the row — the hierarchy the taxonomy already declares.

**The tag body is chrome, not prose.** It wore `.docs-article`, the prose wrapper, which centred every row and imposed a reading measure on a filter list. Its rows wore `.tag-list-item` / `.tag-list-count` — classes with **no CSS rule anywhere in the repo**, which is exactly why they centred and carried no type. They are `RailRow`s now.

**The overlay panel has no border and no shadow.** Both were tried and both were wrong: the shadow was another product's floating-card idiom, the hairline left an empty palette reading as a bordered empty box. The scrim is the separation.

**One header-icon size.** `HEADER_ICON` (`ShellHeader`) — the row mixed 18 against the ThemeToggle's 24: four controls, two scales, in one bar.

### ONE SURFACE — the palette IS the tag browser (user ruling 2026-08-01)

Matching their chrome was not unification: the app still had **two components, two mounts, two query states**. The correct shape is one surface that accepts **both tags and keywords**, because they are two facets of one query.

| Layer | Was | Now |
|---|---|---|
| Query | `searchQuery` in `ShellLayout` + `activeTags` in the context | one — `{ text, tags[] }` in `TagModeContext` |
| Surface | palette **or** tag overlay | palette **expands** into the tag body |
| Mounts | `ShellLayout` + `TagModeGate` in `App.jsx` | one, in `ShellLayout` |
| Views | list here, graph there | `list` \| `graph` on the one body |
| Chips | only in the tag overlay | in the palette input, removable |

**Enter commits and expands.** It used to test `active >= 0`, but `activeIndex` starts at 0 — a row is "highlighted" from the first keystroke, so Enter navigated somewhere you never chose. It now selects only after a real arrow or hover (`navigated`), and otherwise expands.

**A tag row keeps the palette open**; only a destination dismisses. Closing on a tag click is exactly what forced tags into a second overlay.

`TagModeGate` is deleted — it existed to mount that second overlay. `TagModeOverlay` survives as the **expanded body**: no scrim, no panel chrome, no close button, no chips of its own (the input owns them).

**No shadow.** `.kol-overlay-panel` is border-and-scrim only; `--kol-shadow-overlay`, added an hour earlier, is deleted with it — it solved the wrong problem.

### ONE SEARCH, AND TAGS ARE A CATEGORY (user ruling 2026-08-01)

The app ran **two** searches. The shell's ⌘K modal matched through the engine's `matchSearchItems` over routes, the roster and the vault. `TagModeOverlay` ran its own — a raw `Input` and `tag.toLowerCase().includes(q)` in a `useMemo` — over a corpus the first one already held, and it never called the engine at all.

The second one is **deleted, not aligned.** Tags are rows in the shell's index, carrying an `action` closure instead of an `href` because selecting a tag toggles state rather than navigating. The overlay browses — list and graph — and owns no search box.

| | Was | Now |
|---|---|---|
| Matchers | 2 (`matchSearchItems` + inline `.includes()`) | **1** — the engine |
| Tag search | its own box inside the overlay | rows in the one modal |
| Reaching the graph | an unlabelled hex glyph in the overlay's corner | a **Graph view** row in the rail |
| `view` state | local to the overlay | in the **context** — `openTagMode(tag, { view })` |

**Tags is a category**, not a tag dump: `Graph view` · `Search` · this page's tags. `Quick actions` sits on the same rung. Both are `RailSection level={2}`.

**Tag chrome:** no `color`, no `size`. Passing `color` swaps the base class off `tag-control`, and **only `tag-control` carries a `:hover` rule** — a coloured Tag silently loses its interaction state. `sm` is the default and the only size used. Colour is a separate decision, later.

### THE RIGHT RAIL HOLDS ITS COLUMN, EMPTY OR NOT (user ruling 2026-08-01)

The TOC rail used to vanish on any route with no headings — Home, most of all. Its grid track was `auto` and the width lived on the rail's inner wrapper (`w-56 empty:hidden`), so an empty rail measured zero and main reclaimed the space. That was **deliberate**, and it was wrong: it makes the layout a property of the page's *content*, so `/` and `/foundations` rendered main at two different widths.

| | Was | Now |
|---|---|---|
| Track | `auto` | **`var(--kol-shell-toc-w)`** — fixed |
| Width declared on | the rail's inner wrapper | the **grid track** |
| Mount condition | `hasToc && !tocCollapsed` | **`!tocCollapsed`** |
| Empty rail | collapses, main reflows | **holds its column** |

`hasToc` survives for one job — whether the header offers a toggle at all, since a control that collapses an already-empty rail is noise. **Collapsing is a user action and is allowed to change the layout; content appearing is not.**

Verified: `/` and `/foundations` compute an identical `grid-template-columns`. Both rail widths are tokens now — `--kol-sidenav-w` left, `--kol-shell-toc-w` right (`kol-framework.css`), distinct from the brand layout's `--kol-toc-w`, which is the same concept in a different shell at a different width.

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

**Which element the cap belongs to — the rails are chrome, not page (2026-07-31 correction).** The frame fix above landed on the wrapper that holds *all three columns*, so the whole chrome centred and both rails were dragged inward off the viewport edge. The law it was applied from is written about a **page** — *"Every page: mx-auto max-w-shell … content LEFT-ANCHORED inside"* (`kol-theme.css`, Content widths) — and a nav rail is not page content. The shape:

| Element | Width |
|---|---|
| Chrome frame (holds the grid) | **full available width**, `--kol-pad-chrome-x` only — no cap, no `mx-auto` |
| Nav rail · TOC rail | justify to the frame's padding edges; each rail's width lives on its own track/content |
| `MainColumn` content | `mx-auto`, capped at **`--kol-content-canvas`** — the one cap that binds the page body, made once here rather than in every page |
| `fullHeight` main | deliberately uncapped; it *is* the fill-the-viewport escape hatch (iframe embeds) |

**One inset for both header and frame (2026-07-31, user ruling).** The header carried its own improvised Tailwind steps while the frame carried the page ramp, so the sidebar hung right of the wordmark directly above it. Both now read `--kol-pad-chrome-x` — shell chrome is not page content and gets its own, tighter, flat inset. `--kol-sidenav-w` was corrected to the rail width every grid track already used, so the header's brand block finally lines up with the sidebar column it exists to align to.

The same disease as `--kol-container-max` resolving short of `--kol-content-shell`: one element, two answers. `validate:width`'s W1 was a file-wide regex, so an uncapped main and a capped frame — opposite defects — both passed it; it now asserts the cap is **inside** `MainColumn`, **is the canvas token**, and is **absent everywhere else** in the file.

**Why canvas and not shell on the main column (2026-07-31).** Capping main at the frame token was code that could never fire: the middle grid track is the viewport minus both rails, both gutters and the chrome inset — about 1516 of room at a 2200 window — so it never approached the frame value and every page inherited whatever the window gave it. `--kol-content-canvas` is the rung that actually binds. It is set **once**, here; a brief attempt to make every page carry its own cap flagged 14 files that were already correct and would have pushed one number into 14 call sites — the improvisation the width law exists to stop. A page declares its own cap only when its content is *narrower* than the body: a table, a code block, a reading column.

The TOC column also renders at `xl`, matching the breakpoint at which the grid actually declares a third column. At `lg` it put three children in a two-column grid between 1024 and 1279px: the rail wrapped to an implicit second row and `h-full` split the height, giving `<main>` ~373px of a 900px window — which is why `/icons` and `/components` read as empty pages when they were rendering 165 icons and 188 components. Every component page prints its **Source** path (provenance ruling — `scripts/extract-api.mjs` emits `component-sources.json`); MDX docs render a **Frontmatter panel** from their meta. The preview figure ALWAYS caps at the panel token (the stage-conditional cap made sibling pages disagree).

**The rail/main/toc gutter is theme-owned** (kol-workshop 0.3.1 + kol-theme 0.12.2): `.shell-content-grid` states `gap: 32px` base / `48px` ≥1600px in `kol-components-workshop.css`. A `gap-8` utility on the grid element used to outrank the layered theme rule at every width, so the 48px wide step was dead code — the ARCHITECTURE §5 utility-vs-rule disease, in geometry.

**Pages are MDX** (the shadcn model, migration completed 2026-07-30): `@mdx-js/rollup` is wired, `showcase/src/docs/*.mdx` renders through `MdxDoc` with `<Preview name="…" />` reading the demos registry, `<Api name="…" rows={…} />` merging in-document authored rows with the react-docgen extraction (now covering every UI package), `<Install name="…" />` resolving the package from the registry, and `<Parts name="…" />` rendering compound members. `ComponentPage` checks for `src/docs/components/<Name>.mdx` first (66 docs) and falls back to a generated page (header + install + extracted API) for components without one; `component-docs.js` is deleted. Doc furniture (meta rows, pager) renders from `lib/component-page-parts.jsx` on both paths. **MDX bodies do NOT wear `.kol-prose`** (user law 2026-07-30 — prose is the blog system; its 720px cap caged previews and tables too): the mdx element map types markdown per-tag through the `kol-doc-*` roles, so running text self-caps at `--kol-content-measure` while Preview/Api/Install/tables run the full main column — the one-frame law. Vite gotcha: the MDX plugin must be `include: /\.mdx$/` — it claims `.md` too by default and breaks every `?raw` markdown import.

**The rail is CATEGORY → chapter → page (2026-07-31).** The left rail used to render three unrelated blocks, the first labelled `Showcase` — the app's own name, standing where a body of material should. It listed `Foundations` and `Icons` as top-level surfaces beside `Documentation`, which is the vault that *contains* them: one body of content, two doors, no parent.

Now: `Documentation` (the vault, chapters filtered by admission) · `Components` (tiers) · `Tools` (Blocks, Sets, References, Quarantine — routes the app serves, not a body of material). Foundations and Icons left `ALL_ROUTES` and became **chapters**; their live React pages are **slot-pages** inside those chapters (`showcase/src/lib/chapter-pages.js`) — a page is a slot, and the renderer is a property of the page, not of the chapter. The admission gate moved with them: it keys on chapter, so admitting Foundations opens chapter 01 *inside* Documentation. Full system: [[../../operations/04-content-pipeline/INDEX|the content pipeline]].

Two gates grew to cover the move: `validate:reachable` E1b (a slot-page must contribute a search row **and** have a real Route — a route that changes house without telling search is the defect that file exists to stop) and `validate:vault-links`.

**THE ADMISSION GATE — the sidebar shows what has been read against its rule (2026-07-30 night).** The showcase sidebar is *derived* — component rows from the package barrels (`roster.js`), surfaces from a list (`shell-nav.js`) — so quarantining a category cannot be a hand-edit of a nav array. It is a gate on the derivation: `showcase/src/lib/admitted.js` holds one hand-authored `ADMITTED` set and the category table beside it, the same seam and spirit as `classification.js`.

| Layer | Full list | What the shell renders |
|---|---|---|
| Surfaces | `ALL_ROUTES` | `SHELL_ROUTES` — admitted, plus Quarantine |
| Components | `TOP_LEVEL` | `ADMITTED_COMPONENTS`, filtered at the LIST |
| Vault tree | `VAULT_TREE` | only while `documentation` is admitted |
| Search | `ALL_ROUTES` + the whole roster | unfiltered, always |

**Quarantine gates the tree, never existence.** Every held route still resolves, still renders and still answers ⌘K by name — R2 is not suspended by the gate meant to be reversible, and `validate-reachable` now asserts search reads `ALL_ROUTES` rather than the admitted subset. `/quarantine` lists every held category with what it holds, the rule it awaits (linked into the vault by suffix match, so a moved doc degrades to text) and why. Readmitting is one line; so is sending a category back, **with its reason recorded**.

The component filter is applied to the LIST, not to the groups: in `function` grouping mode the buckets are functions rather than tiers, so a group-level filter would let a held organism back in through the Structure bucket.

The 219 generated usage docs were filtered **out of the tree** on 2026-07-30 while staying bundled, searchable and routable. That stopgap is gone as of 2026-07-31: the generators emit to `showcase/src/usage/components/` and the vault holds only authored docs, so the filter had nothing left to hide. Filtering a symptom is not moving a cause — see [[../../operations/04-content-pipeline/01-sources|content pipeline → sources]].

## Workshop shell

`kol-monorepo` `/workshop` (live: kolkrabbi.io/workshop). Richer than the docs shell — a **knowledge-base chrome**:

- Brand bar (logomark · section wordmark · search/theme/menu) over an **icon top-nav** of chapters.
- Left rail: **collapsible groups with item counts** (Workshop / Documentation trees).
- Right rail: on-this-page + **quick actions** (Back, All documentation, View components, Copy path) + **tag list**.
- Content: **markdown-docs parser** — renders frontmatter (title/date/tags/modified) as a styled header, numbered doc tree (`0.0.0` index numbering), card grids for chapter overviews.

**Status:** lives in the monorepo, not yet componentized here. **Direction (2026-07-02):** import the workshop shell + its components into the showcase to compare side-by-side with the docs shell; both stay valid — docs shell for component documentation, workshop shell for knowledge-base / chaptered content.

## Blocks concept

shadcn's "Blocks" = pre-composed, copy-pasteable multi-component sections (dashboards, login pages, sidebars). The KOL equivalent already exists informally — composed collections across the consumer apps. **Planned:** a Blocks section in the showcase presenting KOL compositions (inspector panels, filter bars, forms) built from the packages, each a one-file demo like components.

## Verdict

Both shells lived side-by-side since the workshop port; the comparison lands on **split by use-case, not winner-take-all**:

1. **The showcase keeps the docs shell.** It already carries every page; nothing in the workshop chrome improves component/API documentation.
2. **Workshop shell: keep `/workshop-preview` as the living reference; promote to kol-framework only when a second real consumer needs knowledge-base chrome** — promotion now would be speculative packaging. Promotion is its own session: componentize brand bar / left rail / right rail, and delete the vendored theme files.
3. **A6b closed en route:** the vendored `workshop/vendor/theme.js`/`useTheme.js` now share ThemeToggle's `kol-theme` storage key, default light, and treat the boot script's `<html data-theme>` as the on-load source of truth — the workshop preview can no longer flip the site dark. The files die entirely at promotion time.

## Rules

- Component/API documentation → **docs shell**.
- Chaptered knowledge base, markdown-driven, tags/quick-actions → **workshop shell**.
- Selling compositions, not parts → **blocks**.
- New page in either shell: the shell is imported, never re-authored per page.
- **Every icon control in the header is `IconFrame variant="nav" size="lg"`** (2026-08-01). Six controls had been running four containers and two glyph sizes — GitHub, search, hamburger and both rail toggles now share one frame and take the glyph from `SOLO`; `ShellHeader`'s private `iconBtnCls` is deleted and the showcase's hand-written GitHub anchor with it. Not `Button`: header chrome takes a click but must never light up, so `IconFrame` gained an interactive path instead. The theme toggle keeps its full-ink no-hover model, which is a 2026-07-30 ruling and not drift. Law + gate: [[../03-components/05-control-chrome\|control chrome]] § Icon box.
