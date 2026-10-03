# Plan — mobile pass and the points logged with it (OPEN)

**Status:** opened 2026-10-02 evening on the user's word, after being parked that morning. His answers are in § C; build from there.

**Evidence, all in `_tmp/2026-10-02-mobile-pass/`:**
- `findings.md` — every measured defect, by pattern, with its pages
- `user-points.md` — his eleven points, verbatim, with what each means
- `full.json` — the raw crawl · `shots/` · `look/` — phone screenshots

**The gate:** `pnpm validate:phone` (`scripts/validate-gaps.mjs --phone`) — 390px, ~35 min for all 1,122 pages; `… --phone /a /b` re-reads named pages, `SHOT=<dir>` saves screenshots, `OUT=<file>` writes JSON. Checks: M1 sideways scroll · M2 page inset vs the padding ladder · M3 a framed box touching text or a control outside it. Not in the default `pnpm validate`.

## A. What the crawl found (390px, 1,122 pages)

1. **Landing** — the preview wall touches or overlaps the Source button (0 to 8px) and sits on the `$ npm i` line. `showcase/src/pages/Home.jsx`.
2. **Module and card pages (41)** — description 5px above the preview card, next heading 0px below it. They do not follow the component page's spacing.
3. **Sideways scroll (83 pages)** — 19 public, 64 lobby (dev only). Wide tables and long inline code on markdown pages have no scroller of their own; on `/components/menu-item` and `/components/menu-dropdown-item` the open menu pushes the page 201px wide.
4. **Page inset** — every page is 24px from the edge (`.shell-content-grid` padding, the chrome inset); the padding ladder says 20 on a phone. Needs his ruling: which is the law at phone width.
5. **Preview bar** — on component and module pages the knob dropdowns and the file path are cut off at the card's right edge. Seen in screenshots, not measured.
6. **Smaller** — diagram labels 3px above their boxes (`/library`, `/composition`, `/collection`, `/apps`); swatch captions 3–4px from chips on `/foundations/tokens`; placeholders on 9 card pages; `/modules/product-panel`.

## B. His points — each waits on the answer noted

1. **Rail title click expands children** (said many times; law: the label opens the home, only the chevron folds). Cause: `packages/workshop/src/shell/ShellSidebar.jsx` `chainTo` opens a group when you land on its own home (the 2026-10-01 "keep the atoms list" reading). Proposed: landing on a group's home leaves its fold as it was. Needs a gate. **Waits: go.**
2. **`/components/tier/misc`** — Misc is the must-stay-empty bucket (`showcase/src/nav/roster.js`); holds Knob, has no home, shows Document Not Found. Likely the kol-hardware `Knob` re-export lost its tier in the rename — unverified. `validate:roster` / `validate:homes` did not catch it. **Waits: go.**
3. **Game Picker "doesn't use dropdown"** — locally it does (`packages/chess/src/apparatus/GamePicker.jsx:28`). **Waits: which part looks wrong to him.**
4. **Start and Lookup break the rail rule, all one glyph** — proposed: one eyebrow Lookup holding groups Start (2) · Styles (5: Opacity, Sizes, Color, Typography, Tones) · Taxonomy (3: Names, Tiers, Placement), drawn like Components / Modules. **Waits: yes / no.**
5. **Modules: Sidenav and Footers one group?** — proposed: Navigation = Sidenav · Shell chrome · Footers. **Waits: yes / no.**
6. **A shortcut for the entire tree in any view** (`C` only folds the current space's rail) — proposed: one key opens every space's full tree as an overlay, like the search modal. **Waits: is that what he meant, and the key.**
7. **Button tone + states that match the tab toggle; tab toggle on the control size ramp** (22 · 26 · 32 · 40). Read Button's existing tones first and reuse one before adding. **Waits: go.**
8. **No question, queued:** glyphs on the drawer's Spaces rows · distinct rail glyphs instead of file / folder everywhere (`RAIL_ICONS`, `showcase/src/lib/ShellChrome.jsx`) · external links (the app links named) open in a new tab.

## C. His answers — 2026-10-02 evening (the plan is open; build these)

- **A4 inset:** both 20 on a phone — the chrome inset steps to the ladder's 20 below 768. **Built** (`kol-framework.css`), not published.
- **B3 Game Picker:** it does use `Dropdown`; his point was that the component page does not list it. Ruled wider: every component page lists what it uses and what uses it (`composition-index.json` has the data; only `ReferenceNode` shows it).
- **B4:** yes — one Lookup section, groups Start (2) · **Foundations** (5: Opacity, Sizes, Color, Typography, Tones — not "Styles", the header tab keeps that name) · Taxonomy (3: Names, Tiers, Placement).
- **B5:** yes — Navigation = Sidenav · Shell chrome · Footers.
- **B6:** yes — `T` opens every space's full tree as an overlay, like the search modal.
- **B1 · B2 · B7 · B8:** no question; build.
- The line under an open dropdown's trigger is **not part of this plan** (his word); removed from it.

## D. Built — 2026-10-02 evening (nothing published; he looks first)

- **Inset 20 on a phone** — `--kol-pad-chrome-x` steps to 20 below 768 (`kol-framework.css`).
- **B1 title click** — a group's own home leaves its fold as it was (`ShellSidebar.jsx` `chainTo`, own home checked before the children: a vault chapter's home is also its `About` row). Gate: `validate:rail-pages` P5, 40 title clicks.
- **B2 Misc** — a re-export is a roster row under its owner only (`nav/roster.js`); `validate:roster` checks the named owner exports it.
- **B3 nested components** — every component page lists Nested components and Used by, linked, from `composition-index.json` (`component-page-parts.jsx` `Nested`); the frontmatter's `composes` reads the same source.
- **B4 Lookup** — one section, groups Start · Foundations · Taxonomy, each with a page (`/library/lookup/foundations`, `/library/lookup/taxonomy`) and a home.
- **B5 Navigation** — module categories sidenav · chrome · footer are one, `navigation`; the three old homes are in `_tmp/2026-10-02-module-category-homes/`.
- **B6 `T`** — the whole tree of every space as an overlay (`ShellLayout.jsx`, rail mode `full`, `.shell-tree`).
- **B7** — `Button variant="tab"` (a bundle like `nav`, not an eighth tone) and `TabChips` drawn from it, `size` on the control ramp (default `sm`, 26).
- **B8** — the drawer's Spaces rows keep their glyphs; every rail group has its own glyph (`RAIL_ICONS`, `RAIL_ICON_RULES`); external links in markdown, MDX and the app page open a new tab.
- **A1 landing** — the hero is a minimum height on a phone and drops its doubled inset.
- **A2** — module, card and set pages render in `DocArticle`, the component page's frame.
- **A3** — `.kol-doc-body` wraps an unbroken run; `/cards` caption truncates.

**Left, measured after the build (`validate:phone` over the 26 worst pages):** the open menu on `/components/menu-item` and `/components/menu-dropdown-item` (201px); `/sets/preview/prints-store` (94px, and 24 inset — a preview route outside the shell); `/documentation/01-tokens` (3px); the 3–7px ones in § A6 (diagram labels, swatch captions, placeholders, `/modules/article-grid` row). A5 (the preview bar's dropdowns cut off) not looked at.

## Not in this plan

`/apps/rack`, `/apps/mixer`, `/apps/panels` look wrong — `backlog/2026-10-02-rack-and-mixer-apps-fail.md`. He will say what to do.
