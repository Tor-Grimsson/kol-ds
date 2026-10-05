# Plan — fxr labs, the generator, /apps/panels

**Raised:** 2026-10-03, from `session-bridge/handoff-2026-10-03-1853-mixer-parked-fxr-labs-next.md`. The user: *"handoff plan we are doing the remaining items, plan it out, answer your own questions and get it done … local only, nothing goes to other repos, and dont publish anything"* · *"remember yagni principles and to check the codebase, dont be lazy"*.
**Status:** built 2026-10-03. Local only — nothing published, kol-fxr not touched, no lobby ticket filed. Waits on the user's eye.

## A. What I looked at before planning

- **Live:** `fxr.kolkrabbi.io` — `/` · `/library` · `/settings` · `/labs` (empty, a generator loaded, its tabs, a folded section, both rails) · `/randomiser`; `labs.kolkrabbi.io` (the older site labs' shape came from); `mirror.kolkrabbi.io/expressions`.
- **kol-fxr's source** (reference clone, read only): nine files — `App.jsx` (router), `AppLayout.jsx` (kol-shell `AppShell`), Home and Library on `CatalogPage`, Settings on `SettingsScaffold`. Every chrome it mounts comes from `@kolkrabbi/design-editor`.
- **Here:** `packages/design-editor/src/editor/labs/*` and `mobile/*`, `apps/editor`, `apps/panels`, `apps/controls`, `apps/curves`, and `rack-hub` as the wiring to copy.
- **Measured:** `apps/editor`'s `/labs` (package source on today's packages) against live fxr labs at 1600×1000. The stage and the params are the same. What differs is in § D.

## B. My answers to the open questions

| Question | Answer | Why |
|---|---|---|
| What is "the generator"? | fxr's Generator — the randomiser chrome (`MobileView`, Generator + Effects, touch-first) | His sentence was *"then its fxr, specifically labs. then eventually generator"* — both are fxr's chromes, and fxr's own chooser names them Generate · Editor · Labs. **Not** the envelope generator in `apps/curves` |
| An `apps/labs` alone plus a hub, or a rebuild of `apps/controls`? | One new app, `apps/editor-hub` | `apps/editor` already is the tool alone: every chrome from source on one rail. What is missing is fxr itself. Naming D2: `<tool>-hub` = Shell + Hub + the same tool |
| Copy fxr's shell, or rebuild on `AppStudio`? | Copy fxr's nine files | They already sit on what ships (`AppShell` · `CatalogPage` · `SettingsScaffold`), and a rehearsal has to run the code fxr runs. Same method as rack-hub |
| What is wrong with `/apps/panels`? | It is invented: `AutoControls` in two made-up columns under a page header. No real panel looks like that | Same failure as the first rack and mixer |
| What happens to `apps/controls`? | Nothing in this run | All three of its pages now have a live app (rack · mixer · editor-hub). Retiring it is his call |

## C. The build

1. **`apps/editor-hub`** (`pnpm editor-hub`, 5198) — kol-fxr's `App` · `AppLayout` · `HomePage` · `LibraryPage` · `SettingsPage`, copied, on this repo's packages, design-editor read from source. Routes as fxr: `/` · `/library` · `/editor` · `/labs` · `/randomiser` · `/settings` · `/output`. Registered where rack-hub is (root script, `vercel.json` rewrite, showcase `/apps`, apps-tier doc, `validate:render`).
2. **fxr labs** — `/labs` against live at 1600×1000 and 390 touch. A difference is fixed here if it is a regression, or written into the bump notes if it is a ruled change.
3. **The generator** — `/randomiser` the same way, phone first.
4. **`apps/panels`** — the real panel surfaces with no stage: labs' catalog on the rail, labs' `LabsParams` in its real rail frame, the editor's own inspector beside it; on a phone the same rail at the drawer's size. The invented page goes to `_tmp/`.
5. **Bump notes** — `backlog/2026-10-03-fxr-bump-notes.md`: the edits fxr needs and what the bump visibly changes.
6. Gates for what was touched; my servers killed.

## D. Results

**`apps/editor-hub`** (`pnpm editor-hub`, 5198) is kol-fxr on this repo's packages: its nine files copied, the router's `basename` the one edit to its code plus five deprecated `Button` props renamed. Registered in the root scripts and build chain, `vercel.json`, the showcase's `/apps`, the apps-tier doc and `validate:render`.

**fxr labs and the generator, against live** — 25 states at 1600×1000 and 390×844 touch. Home and Library are identical to live at desktop. Five things were wrong and are fixed in the packages, unreleased:

| Fix | Package | What it was |
|---|---|---|
| Rail icons blank on `/editor` and `/randomiser` | kol-icons | an `<Icon>` rendered before the icon chunk landed never updated; a lazy route under Suspense held that gap open |
| Segmented strips as bare text | design-editor | the 2026-09-27 sync set `variant="filled"` on labs' and the randomiser's strips — against the labs-skin ruling of 2026-09-01; the randomiser's roll-scope strip had no button shape |
| Labs' phone drawer too big | design-editor | kol-theme's touch rung lifted the drawer's `md` controls to 16px / 36px; "Scanline" truncated and a row fell off the fold |
| Labs' Loops row dead | design-editor | pressing it did nothing — live fxr has this today |
| Crop half outside the inspector | design-editor | a photo layer's transform cluster was 163px in a 140px track — found in `apps/panels` |

After them, labs at desktop differs from live by 0.17–0.22%, all of it the transport footer the user re-ruled on 2026-09-27; the phone drawer by 0.7%; the randomiser's generator sheet by 1.0%. Everything else that differs is a ruled change and is listed for his eye in `backlog/2026-10-03-fxr-bump-notes.md` § 4.

**`apps/panels`** is labs with the stage taken out: labs' catalog on the rail, labs' `LabsParams` + `EditorFooter` in the rail's own markup, and the compositor's `SelectionPalettePanel` beside it; on a phone, labs' touch drawer. All 21 catalog rows open with a clean console. The invented page is in `_tmp/2026-10-03-panels-invented-page/`.

**Gates:** `pnpm validate` 31 of 32 — `retirements` 2 (`AppShell`, `BrandHero` in kol-framework, due before this work; the iMac's drop). `validate:render` clean on editor · editor-hub · panels · hub · shell · mixer-hub. Both apps build; the built editor-hub and panels open under their `/apps/…` base with a clean console.

**Found, not fixed:**
- kol-fxr's lazy chromes do not split: its shell pages import the same package entry statically (bump notes § 5).
- The randomiser's media picker is hard to read on a light phone — identical on live (bump notes § 5).
- `apps/controls` is now covered page for page by live apps (bump notes § 6). Left in place.

**Not checked:** export and recording, real iOS Safari.

**Test kit:** `_tmp/2026-10-03-fxr-labs-testbed/` — `hub-compare.mjs` (every state, mine against live, `TOUCH=1 W=390 H=844` for a phone) · `touch-probe.mjs` (the drawer's controls, measured) · `rail-probe2.mjs` (the rail icons) · `dead-rows.mjs` (every labs row pressed) · `panels-walk.mjs` (every panels pick) · `console.mjs` · `shots.mjs` · `static.mjs` (the built output, served as the deploy serves it). They expect editor-hub on 5398 and panels on 5391.

## E. 2026-10-05 — labs and the generator alone, on one frame

The user, on the first round: *"what about labs and generate? where are those?"* — they were routes inside `editor-hub`, under a name that hid them. Then: *"main issue is with the menu bars they opposide open, and they dont follow the same structure i.e. one starts a y=x and the other starts at y=x opppisite"*. Plan approved as written (*"do it"*).

**What was measured before anything changed** (1600×1000 and 390×844 touch): labs' controls hung from the top — a top bar at y 0–48, params dropping in from the right under it, leaving 126px of a 390 stage; a right rail from y 0 at a desk. The generator's rose from the bottom at every width — a sheet from y 512 on a phone, the same sheet 1552px wide from y 716 at a desk.

**Built:**
- `apps/labs` (`pnpm labs`, 5199) and `apps/generator` (`pnpm generator`, 5200) — each tool alone from design-editor's source. Labs keeps a rail because the rail is its catalog; the generator has no shell.
- One frame for both, per device. **Phone: a sheet along the bottom** — labs' top bar and right drawer are gone, its rail is the grid's second row (≤ 50dvh), the stage refits above. **Desk: a rail on the right** — the generator's panel takes labs' width, insets and `sm` rung; the first bar starts at y 52 in both.
- `PanelHeader` · `PanelPills` (`editor/components/PanelHeader.jsx`), lifted out of the generator and worn by both.
- Labs' touch footer is one row until a tab is tapped (it would have filled the sheet).
- Two bugs: the generator's collapsed row ran 38px off a 390 screen; the transport's loop length had no width on a phone.
- `apps/panels` on a phone shows labs' sheet instead of the drawer.

**Rulings this touches.** It overrides *"labs needs both sidebars"* (2026-09-01) for the params side, on his yes. Kept: the hamburger top-right with nav from the left (kol-chess, 2026-09-01); the generator's sheet on a phone (2026-08-12); the tab sets as they are.

**Checked:** `_tmp/2026-10-03-fxr-labs-testbed/frame-check.mjs` — fourteen measurements across both tools at both sizes, all passing, console clean (`LABS` / `GEN` point it at the two apps, 5399 and 5400). Screens: `frame/` and `frame2/`.

**Quarantined:** `_tmp/2026-10-05-labs-touch-top-bar/` — labs' touch top bar and the drawer's CSS.

**Not done:** the two tools' tab sets still differ (labs: Gen · Style · Anim plus Output · File below; the generator: Generate · Effects · Transport · Output). Left on purpose.
