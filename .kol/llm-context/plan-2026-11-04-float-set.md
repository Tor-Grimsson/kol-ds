# Plan — Float is a set

**Raised:** 2026-11-04, the user, after plan-2026-11-04-float-views closed (its W4 "homes for float" moves here). Points verbatim: *"we need a home for float. a place to check what exists."* · *"why wouldnt you just group it as a set? instead? since it more then a style? its a fuckign family of UI components views and styles"* · *"I want a FUCKING NEW PLAN"*.
**Status:** W1–W4 built — 2026-11-04. Open: his library publish.
**Shape:** W › phase › list.
**Laws carried:** shipped KOL parts only; float tokens + Inter; no borders; icons on oq; `variant` is the only word; every rail group opens its own page; never delete (→ `_tmp/`); never git; agents on Opus/Sonnet, check once at the end; Figma canvases #1E1E1E and the library page-naming rule; never name the outside icon library.
**How a phase closes:** measurable acceptance line first, gates green, then Playwright against his words.

Agreed 2026-11-04: float is a family (parts, views, styles), so it is a **set** — the Controls set's pattern (`showcase/src/sets/controls.jsx` mounts `apps/controls` as is, so the two cannot drift).

## W1 — Parts pages in apps/float

### 1.1 — The family pages + the two group pages — ✅ built 2026-11-04
- The app's nav gets two groups: **Parts** (the 13 families of `docs/documentation/04-compositions/24-float-system.md` § The parts, by family — Foundations · Controls · Fields · Menus · Chrome · Windows · Cards + tiles · Lists + tables · Navigation + layout · Charts · Calendar + reader · Timeline · Icons) and **Views** (the six views of plan-2026-11-04-float-views W3).
- Each family is its own page: every part in it rendered live from its package, named, linking to its showcase component page; text tabs at the top switch the page between solid · glass dark · glass light, glass over an image.
- Each group opens its own page (the rail-group law): Parts → the family index, Views → the views index.
- Acceptance: 13 family pages + 2 group pages + 6 views routed; every part named in the doc's family row appears on its page (script: doc names vs rendered `data-part` names, 0 missing); the surface tabs change the ground on every page; 0 console errors on every route; no sideways scroll at 390; app imports only `@kolkrabbi/*` + React.

## W2 — The Float set in the showcase

### 2.1 — sets/float.jsx mounts apps/float — ✅ built 2026-11-04
- `showcase/src/sets/float.jsx` mounts `apps/float`'s App as is (meta like the Controls set, `stage = 'full'`), classified and admitted like the other sets.
- Acceptance: the set opens in the showcase and every apps/float route renders inside it with 0 console errors; the showcase build is green; the set's page and `pnpm float` show the same parts (same route list).

## W3 — Float in the Figma library

Library ❖ library--kol-ds-ui (n48kE2bJtrFjl7wxst30xH), today: Cover · ➤ Library (Components, Icon masters) · ➤ Styles (Foundations, Icons, Icons WIP) · ➤ Collection (Apps, Sets) · _trash. Points: *"so in figma where does everything go?"* · *"what aboutu apps??? thats where the uis live?"*

### 3.1 — The masters stay put — ✅ built 2026-11-04
- Float parts stay masters on `↳ Components`, float tokens/styles on `↳ Foundations`, glyphs on `↳ Icon masters` — the library publishes from there; nothing moves.
- Acceptance: 0 master components created or moved outside those three pages by this W.

### 3.2 — The `➤　Float` chapter: a page per family — ✅ built 2026-11-04
- New chapter after ➤ Collection (divider `---` before it): `　　↳　Foundations` … `　　↳　Icons`, the 13 families of `24-float-system.md`, each holding linked instances of every part in the family, solid and glass side by side where the part has glass. Canvases #1E1E1E; names per the library's page-naming rule. No Views page — views are app screens (3.3).
- Acceptance: 13 family pages in the doc's order; every part named in the doc's family row present (0 missing); every node a linked instance of its master (0 loose copies, 0 detached).

### 3.3 — The six views on `↳ Apps` — ✅ built 2026-11-04
- An `apps/float` section on `　　↳　Apps`, laid out like the other apps there: the six views of plan-2026-11-04-float-views W3 as screens (1600 × 1080), each built from linked instances.
- Acceptance: 6 screens in the section; 0 loose copies, 0 detached; each screen's key boxes within ±4 px of its apps/float route at 1600 × 1080.

### 3.4 — One Float tile on `↳ Sets` — ✅ built 2026-11-04
- `　　↳　Sets` gets a Float tile like the other sets, pointing to the `➤　Float` chapter.
- Acceptance: the tile exists and its link opens the chapter's first page.

## W4 — FloatLayout in Figma (the kol-figma protocol: screens are slotted layout instances)

Point: *"didnt we use shell layout before and slots?"* · *"its not a fix, ITS PROTOCOL"*. W3.3 hand-placed the chrome; the protocol (`kol-figma` skill § 3) says a layout gets its slotted master first.

### 4.1 — FloatLayout master with slots — ✅ built 2026-11-04
- On ↳ Components › modules beside AppShell / SiteLayout: slots nav · bar · content · inspector, the nav Rail as a variant 280 · 72 · hidden (RailTrigger), the Panels pill shown when a Rail is hidden, a phone variant; measured from kol-shell `FloatLayout` on the live apps/float route; `figma/FloatLayout.figma.js`, Code Connect published.
- Acceptance: rail 72 / 280 / 0, bar 64, inspector 272 r20 — each ±0 px of the live DOM; every fill/gap/radius bound; Code Connect live.

### 4.2 — The six screens as FloatLayout instances — ✅ built 2026-11-04
- The apps/float section on ↳ Apps rebuilt: workspace and record float as FloatLayout instances with their content in the slots; the bare views (visual editor, record tabs, Rails, metrics) from parts' instances; positions from the live DOM at 1600 × 1080, the app's text (TEXT properties, not master sample text).
- Acceptance: key boxes ±4 px of the live route; 0 unlinked/detached; no hand-placed chrome on a FloatLayout screen.

### 4.3 — Home, Parts and Views on FloatLayout — ✅ built 2026-11-04
- The three app pages drawn as FloatLayout instances in the same section, so the section holds the whole app.
- Acceptance: 3 screens, ±4 px of the live routes; 0 unlinked.

## Open — TALK

- None.
