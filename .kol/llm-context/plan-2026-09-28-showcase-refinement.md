# Plan — showcase refinement (structure before fixes)

**Raised:** 2026-09-28, the user's review of ui.kolkrabbi.io (13 points, 5 screenshots), in a cloud session.
**Status:** open — findings mapped, **no code changed**. Waiting on the decisions in § 3.
**Ask:** *"categorise and log these issues so we can logically deal with them … meaningful code changes
that are also structurally sound and logical going forward."* Not a fix list.

---

## 0. The one sentence

Most of the 13 points are not showcase bugs: the shell they sit in is `@kolkrabbi/kol-workshop`
(`ShellLayout` · `ShellSidebar` · `RightRail` · the search palette · `DocumentationReader`), shared with
kolkrabbi.io/workshop, and it has **no reference app** — so every structural fix has been made inside a
consumer. Build the reference first (W0), decide the site's spaces (A), and the rest falls into place.

## 1. Tags

- **DEFECT** — a law exists and the code breaks it. Fix without asking.
- **DECISION** — no law, or the ask reverses an earlier ruling. Needs the user.
- **Where** — `workshop` (package, ships to both sites) · `framework`/`theme` (package) · `showcase` (app only).

## 2. Workstreams

Order: **W0 → A → (B · D · E)**; **C** inside W0 in parallel; **F** rides whichever touches the file.

### W0 — `apps/workshop`: the shell's reference app (user, mid-review)

*"making a apps/workshop … the shared layout being used in the showcase and in the website kolkrabbi.io/workshop
— they are the same, but they dont have any demo page yet … we might want to develop it like the other apps/\*"*

- Precedent: `apps/shell` (5176) is kol-shell's Hub alone around a placeholder tool, "the reference both are
  judged against" (`docs/operations/07-apps-tier/INDEX.md`). The workshop shell has no equivalent.
- Shape: kol-workshop's shell over **fixture content** — a few spaces, a small component tree, a handful of
  vault docs with frontmatter and tags — so rails, search and geometry can be exercised without the
  showcase's 197 components. Next port 5183.
- Everything in A–D is built and checked here, published in kol-workshop / theme / framework, then adopted
  by the showcase (and kolkrabbi.io on its next bump).
- **DECISION:** the name, and whether fixture content is enough or it should read the real vault.
  User: *"is workshop the right word … so we dont attribute it to the content of one of two consumers.
  the 'app' is both layout, shell, navigation, search, tags, markdown parser"*. Precedent: an app is named
  after its package (`apps/shell` ↔ kol-shell, `apps/editor` ↔ design-editor), so `apps/workshop` follows
  `@kolkrabbi/kol-workshop`. A new name means renaming the **package** too — the kol-controls → kol-hardware
  route (deprecated re-export shim, both consumers move). `kol-docs` is taken (the dotfiles doc framework).

### A — Site structure: which spaces exist

| # | Point | Finding | Tag · where |
|---|---|---|---|
| 4 | References + Quarantine are dev spaces, not visitor spaces → one **Development** space (references, quarantine, future audits/reports) | Both are header tabs (`nav/shell-nav.js` `ALL_ROUTES`). Quarantine is the admission holding page; `/lobby` and `/demo` are already dev-only (`App.jsx:114,123`) — the 2026-07-15 audit called maintainer surfaces in a public nav a defect | DECISION · showcase |
| 9b | Documentation and Operations are both docs → fold under one parent, as `docs/` is on disk | They are separate eyebrows **by ruling** (2026-08-01, *"OPERATIONS is a seperate category EYEBROW"*, `ShellChrome.jsx:147`) and the order is gated (`validate:rails` R4b, `02-shells.md:138`) | DECISION (reverses a ruling) · showcase |
| 5 | Search as a "space" — what is it? | `/search` is a tab (`ALL_ROUTES`) and a page (`SearchResults.jsx`). See D | DECISION · showcase |
| 13 | Spaces break their layout rule — docs landing shows frontmatter; Blocks/Sets are landing pages that look wrong with rails open | `/documentation` redirects to the first vault doc (`App.jsx:102`), so the "landing" is a random doc with its frontmatter panel. Blocks/Sets roots are `CollectionLanding` | DECISION: every space root is an index page in the space's own layout, or landings hide the rails · showcase |

### B — Rails per space

| # | Point | Finding | Tag · where |
|---|---|---|---|
| 8 | Right rail is the same everywhere except Docs and Components | `AutoToc` (`ShellChrome.jsx:82`) always passes `related=[]`, `tags=[]`, the **global** top-12 tags and the same five actions. Only the reader portals its own | DEFECT (rail shows no page context) + DECISION (what each space's rail holds) · showcase + workshop |
| 9a | Left rail never changes — Group by + Atoms always, whatever space | `ShowcaseSidebar` (`ShellChrome.jsx:135`) renders one stack on every route: Group by · Components · Tools · Documentation · Operations | DECISION: per-space rail contract · showcase |
| 10 | A collapsed parent has no state or indicator | L1 eyebrows are a "pure two-way toggle" and refuse a count by ruling (`02-shells.md` § rail ladder, `RailSection`) — nothing replaced the count as a collapsed cue | DECISION · workshop |
| 11 | Tools mirrors the header tabs; the rail doesn't highlight or collapse to the current space | Groups auto-expand on active; categories never collapse others. Tools = the header tabs again — "one body, two doors", the anti-pattern the code itself cites for Components (`ShellChrome.jsx:192`) | DECISION · workshop + showcase |

### C — Geometry

| # | Point | Finding | Tag · where |
|---|---|---|---|
| 3a | Left rail 320px, right 256px — asymmetric | Law: *"Rail widths … `16rem` both — equal since 2026-08-01"* (`05-layout-systems.md`). Code: `--kol-sidenav-w: 264px`, `320px` from 1536 (`kol-framework.css:46,282`). The token is **shared** with the brand layout's sidenav ladder (`11-shell-system.md:49`) — one token, two shells | **DEFECT** · framework |
| 3b | Gap between rail and main **plus** main's own x-padding — double | `.shell-content-grid` gap 32 → 48 (`kol-components-workshop.css:88,467`) and main's content pads `--kol-pad-section-x` (48) → up to 96px between rail and text | DEFECT-leaning; DECISION on which one owns the space · theme + workshop |
| 3c | A border on the left rail (oq-08) would make the nesting readable | The seam law already says chrome borders are `--kol-oq-08` (`05-layout-systems.md`, seam row). Check kol-shell's rail border first | DECISION · theme |
| 2 | Scrollbar sits inside the padded area | `ShellLayout.jsx:337`: `--kol-pad-chrome-x` wraps the **whole** three-column grid, and `#main` (the scroll element) sits inside it, so its scrollbar is inset from the edge and ends at main's right edge, not the viewport's | DEFECT (structure) · workshop |

### D — Search: one engine, two doors

| # | Point | Finding | Tag · where |
|---|---|---|---|
| 6 | The search page's result groups (Reference graph, Utilities, Documentation, Molecules…) were never designed; no scope | `SearchResults.jsx:52` groups by whatever `sectionLabel` each source emits — component categories, chapter names, `'Reference graph'`, `'Documentation'`, `'Surfaces'`. Groups are an accident of the sources | DEFECT · showcase |
| 7 | Header overlay: faint input; Enter opens a second view (tags) inside the overlay; filters are tags only; a result click leaves with no way back | Enter flips the palette to the tag browser — *"this palette's second state"* (`ShellLayout.jsx:396`), a 2026-08-01 ruling (one surface, tag browser as the palette's expanded body) | DECISION (reverses a ruling) · workshop |
| 7c | Screenshots (overlay, typing `atom`) | Rank: `AppHub` first — matched on description text, not name or category. Only one row highlights its match (`ColorAnatomy`). Group labels mix case (`shell` · `Atoms` · `Styleguide`). Typing `atom` does not mean the Atoms category | DEFECT · workshop |
| 7d | Screenshots (after Enter) | The overlay **widens** (610 → full main width). `Clear filters` shows with no filter set. A tag list with counts and **no heading**, then a doc list with **no heading** showing raw ids (`component-avatar`, `06-manifest-tree`). Component rows open `/documentation/<id>`, not `/components/<slug>` | DEFECT · workshop |
| 7e | `/` opens the browser's find; ⌘K opens search — `/` should too | ShellLayout binds ⌘K and `?` (its own shortcut list, `ShellLayout.jsx:152-171`); `/` is unbound | DEFECT · workshop |
| 7f | No shortcut sheet on `S`, as in the other apps | Two shortcut systems: kol-shell's `ShortcutsOverlay` (AppHub, on `S`) and ShellLayout's own `?` list. Converge on kol-shell's sheet and key | DECISION (which key) · workshop |
| 5·7 | Proposal: overlay = quick jump; **Enter → the shared search page**, with scope (space, category, type, tag, keyword, date) and smart terms (`atom`) | Needs one query model shared by both doors, and a filter set the sources can all answer | DECISION · workshop + showcase |

### E — Header wordmark

| # | Point | Finding | Tag · where |
|---|---|---|---|
| 1b | "WORKSHOP" is the website's mark; the DS should say `kol-ds-ui` / `design system`, and the label could follow the space | `ShowcaseBrand` (`ShellChrome.jsx:122`) passes `kol-wordmark` + `wordmark-workshop` SVGs — ShellLayout's package default, which kolkrabbi.io also uses. The code comment records a rule *"drawn asset over typed text, always"* | DECISION (reverses that rule; which face — Right Grotesk Tight?) · showcase, maybe a `brand` slot in workshop |

### F — Small defects

| # | Point | Finding | Tag · where |
|---|---|---|---|
| 1a | A stray `$` on the landing | `Home.jsx:414` — the prompt glyph of `$ npm i @kolkrabbi/kol-component`; only the `$` renders in the screenshot, so the command text is invisible or clipped | DEFECT · showcase — verify live |
| 12 | Quarantine table: inline, illegal table + text styles | A bare `<table className="kol-table">` (`Quarantine.jsx:83,96`) with no `.kol-table-wrapper`, so the wrapper-scoped seams never apply — it is not the `Table` component. Cells type themselves with `kol-mono-12/14` · `kol-helper-12` utilities (`HeldRow`, `Quarantine.jsx:40-63`), which ARCHITECTURE §5 forbids. Rule text carries literal backticks (`` `pnpm validate:width` ``) that nothing renders. And the page is stale: *"0 of 12 categories are out of the sidebar"* — it holds nothing | DEFECT · showcase — and feeds A-4 (retire or move under Development) |
| 6b | Wrong gap between the query input and the divider | `SearchResults.jsx:102` (`DocSection title="Query"`) | DEFECT · showcase |
| 7b | Overlay input and text very faint | the palette in `ShellLayout` | DEFECT · workshop — check against the opacity law |

## 3. Decisions for the user

1. **W0** — build `apps/workshop` first, and all shell work there? Name + fixture vs real content.
2. **A-4** — a Development space holding References, Quarantine, audits, reports?
3. **A-9b** — fold Operations under Documentation (reverses 2026-08-01)?
4. **A-13** — every space root is an index page in its space's layout (no landing-style roots except `/`)?
5. **B** — each space owns its left and right rail content; the Tools group goes (the header already lists the spaces)?
6. **C-3** — rails equal at 16rem (the law) or equal at another width; gap **or** main padding, not both; a left-rail border?
7. **D** — overlay = quick jump, Enter → the search page with scope and filters (reverses 2026-08-01)?
8. **E** — typed wordmark with a per-space label (reverses "drawn over typed")?

## 4. Screenshots still wanted

- ~~the search overlay~~ · ~~the Quarantine table~~ — received 2026-09-28, folded into D and F
- the landing `$` line at full width (is the command text there at all?)
- a collapsed parent category in the left rail

## 5. Laws read for this pass

`docs/documentation/01-foundations/05-layout-systems.md` (rail widths, seam, padding ladder, chrome inset) ·
`04-compositions/02-shells.md` (rail ladder, order) · `04-compositions/11-shell-system.md` (sidenav ladder) ·
`08-breakpoints/04-kol-ds-rules.md` · `showcase/src/lib/ShellChrome.jsx` · `showcase/src/nav/shell-nav.js` ·
`packages/workshop/src/shell/ShellLayout.jsx` · `packages/theme/kol-components-workshop.css` ·
`packages/framework/kol-framework.css`.
Not yet read: `playbook/2026-08-01-one-right-rail.md`, `playbook/2026-08-01-rail-ladder-and-search.md` —
read before B and D start.
