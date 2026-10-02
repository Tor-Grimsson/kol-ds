# Plan — mobile pass and the points logged with it (PARKED)

**Status:** parked 2026-10-02 on the user's word ("park it for later so we can do actual work"). Nothing below is built. Do not start any of it without his go.

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

9. **The line under an open dropdown's trigger** (2026-10-02, after it was made to draw for every tone): "im not loving the divider, but I cant with it right now." Open — his call whether it stays, goes for every tone, or changes. `Dropdown.jsx` (`.kol-dd-div`).

## Not in this plan

`/apps/rack`, `/apps/mixer`, `/apps/panels` look wrong — `backlog/2026-10-02-rack-and-mixer-apps-fail.md`. He will say what to do.
