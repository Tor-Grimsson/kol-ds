# @kolkrabbi/kol-workshop

## 0.35.0 — 2026-10-01

**The showcase review** (plan-2026-09-30-showcase-review, W1–W21). Needs kol-component ≥ 0.234.0 and kol-theme ≥ 0.161.0; adds `gsap ^3.13.0` as a peer.

- **⚠ `ShellSidebar` nests to any depth** — a group's children may be groups (`.shell-nav-nest` per level); the rail opens one chain to the page you are on, deepest match first; a pathless group is never "here"; consecutive leaf rows share one `nav.shell-nav-items`.
- **`RailSection`** — a long label truncates; the count never wraps.
- **`RightRail`** — **Tags** is its own section (Tag graph, All tags via the new `tagsHref`, then the page's tags by namespace), out of Quick actions and Links; each tag's hash wears its namespace color.
- **`DocsFrontmatter`** — tags carry their namespace color (`getTagColor`); `status` renders as a `Badge` on its tone (active success · canonical info · draft warning · archived/superseded/deprecated error).
- **`DocumentationReader`** — a markdown table column is `kol-doc-table-copy` when any cell is prose, else `kol-doc-table-token`.
- **`SearchPage` / `ResultRow`** — scope, read-as and facet chips are `Tag` sm; facets fold into a `TabsRow`; tag facets are colored; the input is md; result rows lose the 80 % dim.
- **`TagGraph`** — rewritten: one force simulation, pre-settled before the first frame, GSAP entrance and focus.
- **`ShellLayout`** — `\` hides or shows both rails; the shortcut and settings labels say what the key does in one or two words.

## 0.34.0 — 2026-09-30

**The review's corrections** (plan-2026-09-30-showcase-corrections).

- **⚠ `ResultRow` is back** — un-deprecated, `underline` (default) and `wash`; `SearchPage` uses it again, `rowVariant` restored. The `ContentRow` swap in 0.33.0 had overridden a ruling.
- **⚠ Rails:** `RailSection` draws its own chevron (no `icon` prop needed — the right rail had none); a rung's label opens its page at both levels and only the chevron folds; `ShellSidebar` opens only the chapter holding the page you are on and starts every other folded, including ids it has not seen; a childless entry is a plain row, not an empty L2.
- **`DocumentationReader` takes `rail={false}`** — render the article without taking the right rail (a home sits on a page whose sections the rail must list).
- **The shell** passes `suggestions` (the spaces) to `ShellSearchOverlay`; the shortcut sheet lists "Search everything" once, `⌘ K , /`. Needs kol-component ≥ 0.231.0.

## 0.33.0 — 2026-09-30

**The shipped parts, not local ones** (the reuse pass — UI built fresh last night swapped for what the DS already ships).

- **⚠ The settings drawer is kol-component's `SettingsPanel`** — the drawer media's Display settings and Trash wear (title header, divided sections). It was a hand-built `ShellDrawer` + eyebrow + undivided `SettingsSections`.
- **⚠ The rails resize with the DS gesture** — `useDragResize` + the `.kol-rail-grab` pill (SideNav's, EditorShell's): drag resizes, a click or a drag under the snap hides the rail, arrows step, release near 256 lands on it; width lasts the session (`persistWidth` off, the 2026-09-03 ruling). Replaces 0.32.0's local grip, which also persisted the width against that ruling.
- **`SearchPage` rows are kol-component's `ContentRow`** (`variant="article"`, `media={false}`). **`ResultRow` is deprecated** — it forwards to ContentRow and is on the retirement ledger; `rowVariant` is gone.

## 0.32.0 — 2026-09-30

**Resizable rails, the header cluster** (the names audit built — plan-2026-09-29-phase-log-and-showcase-review, second goal).

- **⚠ Rails resize.** A 6px grip on the edge facing the page: drag sets the width (200–420px, remembered), double-click resets to 256. Through `--kol-shell-nav-w` / `--kol-shell-toc-w` on the shell root.
- `ShellLayout` passes `menuBelowLg` — the header's hamburger shows only below the desktop width.

## 0.31.0 — 2026-09-30

**The names audit** (plan-2026-09-29-phase-log-and-showcase-review — the names audit + W3–W6).

- **`DocumentationReader`** takes `docId` (render a doc at any URL — a home) and `showFrontmatter` (default `true`).
- **`ShellLayout`** — **⚠ new keys:** `[` and `]` toggle the left and right rails (remembered), `C` folds or opens every chapter in every rail; a `shortcuts` prop adds the consumer's own keys (`{ id, label, combo, key, run }`) to the `S` sheet and the handler. Tooltips are one word (Search · Settings).
- **`ShellSidebar`** listens for the fold broadcast (`RAIL_FOLD_EVENT`, exported).
- **⚠ `RightRail` — own tags only, grouped by namespace, the leaf printed** (`topTags` is accepted and ignored); an empty chapter does not render; a folded THIS PAGE / LINKS shows its count; **Pin / Unpin** in Quick actions and a **Pinned** chapter on every page (localStorage).
- **`ResultRow`** (new) — one search result, `variant="underline"` (default) or `"wash"`; `SearchPage` renders its rows with it (`rowVariant`) and its empty state with kol-component's `EmptyState`.

## 0.30.1 — 2026-09-29

- `TagGraph` reads its graph from kol-search's `tagGraph` (kol-markdown's `buildTagCooccurrence` is deprecated). Same drawing.

## 0.30.0 — 2026-09-28

**The shell, refined** (plan-2026-09-28-showcase-refinement — the user's review of the showcase).
Peers: kol-component ≥0.228.0 · kol-framework ≥0.45.0 · kol-theme ≥0.155.0.

- **One scroll region, edge to edge** (`#shell-scroll`, exported as `SHELL_SCROLL_ROOT`). Each rail
  and `#main` scrolled themselves inside the chrome inset, so the scrollbar sat inside the frame.
  **BREAKING for a consumer that observed `#main`** — `useScrollSpy(ids, { root: SHELL_SCROLL_ROOT })`.
  A new page starts at the top.
- **256px rails on their own tokens, one space between a rail and the page** — seams on the
  rails, main pads the page ladder only on a side that has a rail. Pages do not pad themselves.
- **Rails per space.** `renderSidebar` and a function `defaultTocContent` receive `{ activeRoute }`
  — the header route you are in — so a consumer draws each space's rails.
- **`usePageMeta({ tags, related })` / `usePageMetaValue()`** — a page tells the right rail what it
  is about; cleared on unmount. The rail had been handed empty lists on every route.
- **Search on kol-search.** The palette ranks (title › tag › heading › …), underlines every hit,
  reads `atom` as the Atoms category, and takes items in kol-search's shape or the older
  `label/sectionLabel` rows. **`searchPath`**: Enter opens `${searchPath}?q=…`; without it Enter
  keeps the in-place tag browser. **`/`** opens search (it fell through to the browser's find).
- **`SearchPage`** (new) — the results page: the query in the URL, a scope row, facets (kind ·
  category · tags) that write `kind:` · `cat:` · `tag:` tokens back into it, "read as" chips,
  ranked results. Back returns to it; a search is a link.
- **Settings** — a right drawer on the header's gear and `,`: the rails, "quick search in this
  space only", the consumer's own `settings` sections, the keymap. Remembered per viewer.
- **The sheet is kol-component's `ShortcutsOverlay` on `S`** (`?` still opens it).
- **`brandLabel`** — the second wordmark as typed Right Grotesk Tight, a string or
  `({ activeRoute }) => string` naming the space; aligned with the page text.
- **The rail follows you** — arriving in a group opens it and folds its siblings. A collapsed L1
  eyebrow shows a state glyph and how much it holds (it read as an empty category).
- `ExhibitSidebar`'s copy button lost its native `title`.

- **The engine left for the engine tier** (ARCHITECTURE §3). `src/engine/` is gone: the markdown
  half is `@kolkrabbi/kol-markdown`, the matcher `@kolkrabbi/kol-search` — both now dependencies.
  Nothing a consumer imports breaks: the root barrel and `./engine` re-export the same names (plus
  kol-markdown's `splitFrontmatter` / `joinFrontmatter`). New code imports the engines directly.
- *(0.29.0 was published without an entry here.)*

## 0.28.0 — 2026-09-03

- **The `?` shortcuts sheet wears `.kol-overlay-scrim`** (overlay-scrim-outliers
  sweep) — it drew `bg-fg-48`, the ink wash, not the class's ab-black 48.

## 0.27.0 — 2026-09-01

- **`ShellNavCollapsedContext` — a page can shed the left rail.** The TOC has
  had `ShellTocCollapsedContext` since the rails were made collapsible; the
  nav never got the matching seam, so a page could hide one rail and not the
  other. A landing page wants neither: the showcase home's docstring claimed
  "top nav (no sidebar)" and rendered under both. Same contract as the TOC
  seam — set on mount, restore on unmount, the header's own toggles keep
  working on top of it. Nothing moves for a page that does not call it.

## 0.26.0 — 2026-09-01

- **Closing the search palette survives its own query reset.** Close-and-clear
  was two calls — `closeTagMode()` then `setSearchQuery('')` — and on the
  provided path the second is `TagModeContext.setText`, which force-opens, so
  both landed in one React batch and the final state was OPEN. Scrim tap AND
  desktop scrim click were undone in their own event (Escape only worked
  because the context's window listener runs after and wins); `onSelect`'s
  destination branch carried the same pair and navigated with the palette
  still up. One `closeSearch` helper now: the provided path is
  `closeTagMode()` alone (it already resets `text`), the local path closes and
  clears. `setText` keeps its open-on-type behaviour — its call sites are all
  palette-open paths. (WorkshopSearchCloseUndoneBySetText, kol-website)

> **Gap:** 0.3.4 → 0.21.0 shipped without entries (that history lives in the repo's
> session logs). Resumed 2026-08-14 — from here every publish adds an entry, and
> breaking or global-surface changes (token renames, default flips, new bare-element
> rules) are flagged **BREAKING**.

## 0.25.0 — 2026-08-31

- **`TagModeOverlay` reads the query.** Pressing return set `expanded`,
  `ShellLayout` swapped its body for this component, and the component consulted
  `activeTags` and nothing else — so a typed query was replaced by the complete
  unfiltered tag census and ZERO document rows, by construction. Searching `rf`
  listed `project/kol-monorepo 85`, `domain/design-system 13` … not one of which
  contains `rf`.
- Document rows now render on a query OR a chip, matched with the engine's own
  `matchSearchItems` rather than a second predicate, so committed and
  uncommitted results rank identically. The tag cloud narrows to the tags present
  in the result set with counts recomputed over it; an empty query keeps the full
  census, which is a good browse state. A query that matches nothing says so.
  (TagModeOverlayIgnoresQuery, kol-website)

## 0.23.0

### Minor Changes

- **BREAKING — the DS tier is a peer, not a dependency.** kol-component · kol-icons · kol-framework · kol-theme move from
  `dependencies` to `peerDependencies` with a `>=` floor (>=0.68.1 · >=0.18.0 · >=0.23.0 · >=0.51.0).
  A 0.x caret in `dependencies` had pnpm nesting a private, stale copy of the tier
  under this package — a consumer bumped to kol-component 0.68.1 was still rendering
  this package's imports from the pinned line, so no DS fix since could reach those
  surfaces. The consumer now supplies ONE copy; the floor is the version this
  package's named imports were walked against. Same shape as kol-dashboards and
  kol-shell. Consumers: install the tier yourself and drop any `pnpm.overrides`
  forcing one copy.

## 0.22.0

### Minor Changes

- **Exhibit sections — the scaffold moves into the package.** The workshop shell
  was already shared, but the sections _above_ it were not: every consumer
  rebuilt the same landing page, the same specimen-grid page, the same prose
  companion and the same rail block by hand, so adding the next exhibit meant
  rebuilding all of it. Six new exports, all content-injected:

  - **`ExhibitOverview`** — the landing: concept, one opt-in action (the live
    instance an exhibit documents), every child page as a card.
  - **`ExhibitPage`** — an inner page as a list of sections. The two page shapes
    consumers hand-built collapse into one component, because they were never
    structurally different: a section carrying `specimens` renders a grid of
    `ExhibitCard`-headed demos, one carrying `children` renders anything, and
    `prose: true` adds the reading measure.
  - **`ExhibitSidebar`** + **`useExhibitToc`** — the rail block (on-this-page ·
    doc links · quick actions) and the hook that registers it into the shell's
    TOC slot. The hook keys its effect on the _content_ of its props, not their
    identity, so a page can pass an inline array literal without setting shell
    state in a loop — which is the trap the copied six-line `useLayoutEffect`
    block left open at every call site.
  - **`ExhibitCard`** — the specimen header (name · description · details ·
    code) inside a section.
  - **`ExhibitLinkCard`** — the child-page card on a landing grid. It arrives
    carrying its own request: the consumer's copy was annotated _"vendored
    verbatim from elder @kol/ui (no DS twin); lobby to the DS if a second
    consumer appears."_

  **Drift fixed on recreation**, in the same pass rather than reproduced: the
  source's rail block hand-rolled a collapsible section with
  `.shell-sidebar-toggle` **and** `.shell-sidebar-label` stacked on one element,
  inline `paddingRight`/`paddingBottom`/`justifyContent`, and its own chevron at
  L1. All four are things `RailSection` exists to prevent — the eyebrow-box law
  says an eyebrow wears ONE box class and sets no y-spacing inline, and the
  2026-08-01 ruling says L1 draws no chevron. The rungs come from `RailSection`
  now, so the block cannot drift from either rail; `validate:rails` R3 + R4
  assert both halves. The landing card also loses its `uppercase` utility — the
  no-`text-transform` law.

## 0.3.4

### Patch Changes

- Updated dependencies
  - @kolkrabbi/kol-framework@0.8.0
