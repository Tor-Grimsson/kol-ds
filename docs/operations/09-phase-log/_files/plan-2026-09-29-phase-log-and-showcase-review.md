# Plan — phase log + showcase review

**Raised:** 2026-09-29, the user's showcase notes + screenshots (pasted this session) + the phase-log ask.
**Status:** DONE 2026-09-30 — W1–W8 built and published (see the phase log entry *Showcase build*); the user's rulings were taken on the recommendations. Open: Round 3 (settings drawer, rail icon strip) and Round 4 (glyphs) for review.
**W = workstream.** Each one logs into W1 when it closes.

---

## W1 — Phase log

A log of work done — any session, a `/kol-goal` run or not. Not a package changelog. The place to check *"did I already raise this / was this on a list"* weeks later.

1. Home: `docs/operations/09-phase-log/`, `INDEX.md` routes. Shown on the Development space, read from `docs/` like every other doc page. Nothing in the showcase reads `.kol/`.
2. Entry per session/run, two tables: **Phases** (phase · what was done · docs touched, linked) and **Decisions** (what the user ruled).
3. A finished plan is copied into the folder as an archive; the entry links to it.
4. Backfill one entry per past run (9 plans, 2026-07-30 → 09-29).
5. Going forward: each run's closing report lands here in the same pass.
6. **Open questions** on the Development space, **one page per round** (`showcase/src/open-questions/<date>.jsx`); an answered round keeps its answers and stays as the record, a new set is a new page — where a point is visual and words keep missing, it is laid out as live A/B specimens (e.g. selection: white · `--kol-fg-24` · the yellow accent) before it is written into a plan. The user picks on the page; the pick moves into the plan and the question leaves.

## W2 — Names, conventions, homes, tags (the audit)

1. **One conventions doc** in `docs/documentation/` — the agreed names, findable by ⌘K ("sidebar", "rail levels", "categories", "set", "block"…):
   - rail levels — **Category · Chapter · Page · Section** (ruled 2026-08-01, today buried in `04-compositions/02-shells.md` § The rail's vocabulary)
   - the spaces (top tabs) and what each holds
   - component · set · block · app · shell · hub · tool (from `16-app-anatomy`), cross-linked
2. **Every level gets a home page, written as markdown with frontmatter** (hidden by default, a shortcut shows it) so it can be tagged, searched and pinned:
   - space homes — `/components` · `/blocks` · `/sets` · …
   - category / chapter homes — e.g. Components explains the atomic system in KOL; Atoms explains what an atom is, Molecules how atoms nest, Organisms, and so on
   - Group by → a home for the categories / grouping rules
3. **Block vs set.** Set = a listing of grouped components. Block = a composition of shells/tools (rails, navigation) and how it breakpoints. Today both render the same responsive component.
4. **Component categories.** Atomic is the primary grouping; package/domain groupings become an "order by" option. Written categorisation rules.
5. **Every component checked for its placement** — the examples raised (`CloseButton` in Utilities, `PortalFooter` in Framework · Chrome, `ColorLoader` in Foundry, blocks/footers vs Portal Footer) are samples, not the list. The audit sweeps all of them.
6. **UI vs no UI.** A component with nothing visible (`PathNodeOverlay` — editing chrome with no preview, contexts, behaviours) cannot be an atom. Two kinds: components with UI (the atomic ladder) and without (their own category — function / engine / data / chrome / layout, named in the audit).
7. **One vocabulary across categories, sets and blocks** — Foundry vs Typography, Styleguide vs Brand.
8. **Docs space.** Documentation and Operations each get a home (the markdown engine explained). Guides gets a home explaining the logic behind them. Specimens moves out.
9. **Proposal: a Styles space** for the specimens (foundations, color, typography, tones, icons) — the reference lookup, with where each value comes from (the CSS / JSX files it reads). Specimen content that needs no page of its own becomes sections (e.g. Color → Brand aliases · Brand ramps · Cream ramp).
10. **Apps space (Q5: yes).** Shows the hierarchy visually — nested containers, the way Docs › Shell & Layout draws the composition — instead of a stack of tables. Name the pattern so other spaces reuse it. Engine · Shell · Hub · Catalog · Tool get homes (markdown, tagged).
11. **Tags.** Today the right rail's Tags lists the page's own tags, then the space's top tags — so a page with none (docs/menus) still shows ten, and Apps shows 0 because no app page is tagged. Rule on: own tags only or a "way in"; whether tags must nest; whether the full path is printed.
12. **Tools with no home** — tag graph, tag list, index page, the search page. Give each a place.
13. **Packages get a home.** One page for the packages (the 26 in `packages/`, grouped by tier — UI · app · engine · clients), and **one markdown page per package** with frontmatter + tags: version, tier, what it depends on, what depends on it, what it holds (its components / sets), and its changelog. Changelog in the frontmatter (latest version + date) with the full log in the body, generated from the package's `CHANGELOG.md` so it cannot drift. Today the list lives only in `docs/operations/01-release/02-shipped-packages.md`.
14. **Icons get a home.** `/icons` is reachable by URL, ⌘K and one link only (raised 2026-09-28, never placed). Either a page in the specimens group (Styles, W2.9) or its own. The shipped sets are **kol-icon-set-v1** (app chrome — the editor's tool icons live in its `tools` · `editing` · `shape-*` groups since the 2026-09-27 one-icon-system pass) and **kol-icon-set-signal** (the instrument / control vocabulary). Each set is a Set page with its groups, frontmatter and tags — so the names are findable, which is the point: nobody remembers them.
15. Deliverable: the audit with solutions; the user rules before W3–W6 build on it.

## W3 — Rails

1. Every rail follows the ladder (Category → Chapter → Page). Blocks, Sets and Docs' Guides/Specimens break it today.
2. The Category label opens its home; the chevron expands.
3. Focusing a Chapter collapses the others and expands it — not isolating the rail (Components now shows only Components + Group by).
4. Right rail matches left: a folded Category shows the count + glyph (today `THIS PAGE` / `LINKS` show neither). One component, not two.
5. Hide an empty Chapter (`Related (0)`).
6. **Pinned docs** in the right rail — the user pins the documents to keep at hand while developing (the conventions doc first), unpins when done.
7. Shortcuts: collapse / expand all Chapters; `[` / `]` toggle the rails.
8. Proposal: rails draggable to resize (the existing gsap system), three states — visible · hidden · collapsed to an icon strip, like the app shell's rail.

## W4 — Component page

1. Titles from a display name, not the filename — Action Button, not ActionButton. *(Raised many times.)*
2. **Frontmatter first, on every page — fixed in the page template, not per page.** ActionButton and PathNodeOverlay render the description (and preview) above a frontmatter block with no title/type/status/tags; Button is right.
3. **Frontmatter shows/hides on a shortcut.** Home pages hide it by default (more ceremonial); component pages show it.
4. **Props as dropdowns, not stacked copies** — size · tone · variant on Button, Dropdown, Text Input, Segmented Toggle; and state props the same way (CurveOverlay: empty · handles · both, instead of the same curve twice).
5. **Preview real estate** — content fits its preview (the overlays crop); consider scale, but flow first.

## W5 — Shell chrome

1. Top-nav right cluster — GitHub · search · settings · theme toggle · a sidebar button that reads as a hamburger. Rethink.
2. **Tooltips: one word (ruled, repeatedly — Round 1 Q4).** No bullet, no shortcut; shortcuts live in the `S` sheet only.
3. Settings (`,`) layout is wrong.
4. Focus ring on the header buttons is wrong.
5. Menu demos escape their preview — the open panel paints over the header and floats at the page bottom on scroll (docs/menus). Clip / layer it.

## W6 — Pages

1. **Home.** Buttons no longer centred; add Apps to them. The hero eats the fold — bring the live wall up. "Rendered live from the packages — dashboards, blocks, and components" goes below the fold or goes.
2. **Accent: white (user, 2026-09-30, Round 1 Q1).** kol-theme’s own accent (`--kol-surface-on-primary`), not kol-brand-color’s yellow. The dark green: dropped.
3. **color, not colour** — one spelling, the code's. Prose sweep across docs + showcase (181 `colour` against 1361 `color`).
4. **Empty states** — shadcn-style empty-state boxes existed at some point; find where they went, and use them where a page has nothing to show.
5. **Search results page** — Round 2: both pairs liked. The row becomes a component (today it is inline markup in kol-workshop `SearchPage.jsx:126`) with `variant="underline" | "wash"` — **underline the default**; wash carries its x padding, underline has none. The larger title is rejected (Round 1).
6. The labelled-panels page — `apps/panels` (built 2026-09-29) linked and reachable.
7. **Lobby (dev only)** — pads itself (`Lobby.jsx:24,50`: own `max-w` + section padding), against the 2026-09-28 rule that the shell owns page padding; drop both. It also globs `lobby/*.md` + `lobby/done/*.md`, a layout the lobby left for `inbox/` · `done/` · `archive/` — so it shows a stale queue. Rebuild it like Records: the ledger (`lobby/INDEX.md`) is the index, the rail holds Inbox · Done · Archive as chapters with counts.

## W7 — Editor

1. #12 — asset thumbnails.
2. #14 — redraw the align / rotate / flip glyphs.
3. #15 — the `tone="primary"` hover stop.
4. Panels' bool param — inline switch vs Off/On strip; one.

## W8 — Breakpoints + touch (standing)

1. Audit ui.kolkrabbi.io at every breakpoint and on a touch device — rails, header cluster, previews, dropdowns, tap targets.
2. Standing, not one-off: every W closes with a phone-width + touch pass, logged in W1. It is the first thing dropped when work is reviewed on desktop only.

## Order

W1 + W2 together, as one step: the open-questions page (W1.6) is built first, because the audit's visual calls are made on it — first entry, the selection/accent colours. The phase log (W1.1–5) goes up alongside, so the audit is its first entry. The audit (W2) then decides W3 → W6; the user rules before any of them start. W7 and W8 after.
