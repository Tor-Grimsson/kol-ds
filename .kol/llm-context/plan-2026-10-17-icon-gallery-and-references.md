# Plan — icon gallery, References, CompareGrid, ⌘K, Templates

**Raised:** 2026-10-17, the user's review of ui.kolkrabbi.io › Styles › Icons and Development › Tools (images 1–7). Points verbatim: *"icon containers should also get smaller, not just the icon and guide … go from 5 columns to what is relative to the size"*; *"only fit uses the container correctly but also the zoom hover is wrong, should be off"*; *"I think the problem is the card you are using. and also list completely ignores dropdown size scaling"*; *"title bug is not fixed"*; *"guide clear could just be a iconframe toggle … then we can move list / grid there instead … in the bigger size"*; *"illegal page here without a category? … wouldnt you want some sort of categorisation? unique pages for categories, or all, or by token"*.
**Status:** ✅ built 2026-10-17 — W1–W6 except the two TALKs, published kol-component 0.265.0 · kol-shell 0.65.0 (W1–W3, W6 showcase-only). Built round 2 (2026-10-17): 5.3 · 7.1 · 7.2 · 8.1 · 8.2 · 9.1 — kol-framework 0.50.0 · kol-component 0.266.0 · kol-shell 0.66.0 · kol-foundry 0.13.0 · kol-workshop 0.40.0; plus the dev favicon system. 6.4 approved and shipped 2026-10-18. Open: nothing.
**Order:** 4.1 first — W1.1 builds on its `IconPlate`; 6.2's Gallery and Dev wait on W4.
**Shape:** W › phase › list.
**Laws carried:** every rail group gets its own page; icons use `oq`, never `fg`; no native `title`; tile and plate geometry measured in the view the user used (2000px, dark app, light ground); showcase-only phases publish nothing.
**How a phase closes:** acceptance line first, gates green, then Playwright against his own words.

---

## W1 — Icon gallery: the size control (`showcase/src/pages/IconsGallery.jsx`)

### 1.1 — The plate is the size (on 4.1's `IconPlate`) — ✅ built 2026-10-17
- Replace `ContentCard catalog` with a tile built on `IconPlate`: a plate exactly the selected size (16 → 16px … 128 → 128px), with the guide and the glyph filling it as Fit does. Fit is unchanged.
- No hover zoom. Click still copies the name.
- **Acceptance:** at every numeric size the plate's box measures the selected size ±1px, the guide's bounds equal the plate's, and no tile scales on hover.

### 1.2 — Columns follow the plate; the name is whole — ✅ built 2026-10-17
- Column width = the larger of the plate and a name floor that never breaks a name mid-word. Full name and group under the plate, no ellipsis.
- **Acceptance:** at 2000px, column count rises as size falls (non-strictly at 16–32 where the floor holds). No tile has text past its edge or cut by an ellipsis, at any size.

### 1.3 — List follows the size — ✅ built 2026-10-17
- `RowGlyph` uses the same plate at the selected size instead of a fixed 20. Fit gives the list's current thumb.
- **Acceptance:** in LIST, the row thumb measures the selected size at 16–64. 128 → TALK on the row height.

## W2 — Icon gallery: header controls

### 2.1 — GUIDE as an icon toggle, LIST / GRID in its place — ✅ built 2026-10-17
- GUIDE / CLEAR → one `IconToggle` (`grid` icon; `eye-on` / `eye-off` the alternative) beside the ground toggle.
- LIST / GRID moves into the slot GUIDE / CLEAR leaves, in that row's larger size. The row under the divider is removed.
- **Acceptance:** one control row: size · ground · guide toggle │ LIST GRID. The guide toggle carries a DS tooltip, `aria-pressed`, and the `oq` ink.

## W3 — Development › References

### 3.1 — References is a category — ✅ built 2026-10-17
- The rail entry becomes a group with its own home: what the graph measures, the canon bar, the top 10 across all kinds.
- Child pages: Components (254) · Tokens · Classes. Tokens and Classes each split by concern (color · type · layout · nav · chrome · component), one page each. Each page ranks only its slice.
- **Acceptance:** every References row in the rail has its own page, and the group title opens the home. `validate:rail-pages` is green. The counts on the pages add up to the graph's 721.

### 3.2 — Canon mark on the DS Tooltip — ✅ built 2026-10-17
- `References.jsx:81` `title="canon candidate"` → `Tooltip`.
- **Acceptance:** no `[title]` on any References page.

### 3.3 — Gate: no page outside a group — ✅ built 2026-10-17
- `validate:rail-pages` gains P6: every rail row sits inside a group that has its own page; a loose leaf fails.
- **Acceptance:** P6 fails on today's References, passes after 3.1, and finds no other loose leaf in any space (or lists them as new phases here).

## W4 — One comparison component (CompareGridDevTab, kol-monitor)

### 4.1 — `IconPlate` (kol-component) — ✅ built 2026-10-17
- Lift the open-questions `Plate` (`showcase/src/open-questions/2026-10-09-b.jsx:55`): the box IS the size, guide (the keyline grid) and glyph fill it, ground light/dark. One plate for the gallery, open questions and `CompareGrid`.
- **Acceptance:** the plate measures its `size` ±1px at 16–128; the open-questions round renders unchanged on it.

### 4.2 — `CompareGrid` (kol-component) — ✅ built 2026-10-17
- Items `{ id, label, a, b, state? }`: A beside B, each side named by the consumer, name under the pair, the 16px real size under each side. Toolbar of toggles: size 24 · 48 · 96 · 128, guide, ground. `state` (`same` · `changed` · `missing`) is a chip and a filter; a missing side is an empty plate with the candidate name.
- **Acceptance:** monitor's Icons data (116, monitor vs kol-icons) readable at 96 with the guide on, each side named; the filter narrows by state.

### 4.3 — `HubDev` (kol-shell) — also the Dev template — ✅ built 2026-10-17
- Monitor's Dev tab supplies the CONTENT (its tabs and what they hold), not the layout — that layout is the problem the ticket names. HubDev is a new, readable layout; monitor, then mirror, fxr and the rest move onto it. An opt-in `dev` slot on `AppHub` / `AppStudio`: localhost only (`import.meta.env.DEV`), the `code` icon (`</>`), one rail row, tabs as data `dev={{ tabs: [{ value, label, content }] }}`. A `CompareGrid` is one tab's content.
- **Acceptance:** absent from a build; on localhost one `</>` rail row opens the tabs; monitor's Dev content renders on it, each tab readable without its old hand-rolled layout.

### 4.4 — The showcase's Development space — ✅ built 2026-10-17
- Always shown on localhost; in production hidden until `D` (remembered for the tab). Its icon becomes `code`. While hidden, ⌘K drops its pages; the rail gate runs with it shown.
- **Acceptance:** a production build shows no Development tab until `D`; `D` again hides it; ⌘K finds no Development page while hidden.

## W5 — The ⌘K overlay (CommandOverlayModes, kol-monitor)

### 5.1 — Two layers with a header back control — ✅ built 2026-10-17
- A drill-in shows a back arrow in the header (and Backspace on an empty field) instead of the "← All" row; typing at either layer searches everything, grouped.
- **Acceptance:** monitor `/rack`: ⌘K → Generators → its modules, the arrow returns; "noise" finds Noise from either layer.

### 5.2 — Page-aware shortcuts — ✅ built 2026-10-17
- Shortcut sections take `routes`; the sheet shows the current route's first and the rest muted under "Elsewhere". The same scope decides which keys are bound.
- **Acceptance:** monitor `/dev`: `S` shows App only, Rack and Cables muted under Elsewhere.

### 5.3 — One overlay, several modes, arrow-key navigation — ✅ built 2026-10-17
- `ShellSearchOverlay` → `CommandOverlay` with `mode` (search · add · shortcuts · go); the old name an alias. `S` opens the shortcuts mode and `ShortcutsOverlay` retires.
- Shortcuts mode opens as the whole keymap at a glance (sections visible, no drill needed); typing filters it.
- Arrows: up/down move through rows and categories; right or Enter opens a category; left goes back. Left/right only drill while the field is empty, so they still move the caret while typing.
- **Acceptance:** monitor-shaped harness: ⌘K → ↓ to Generators → → opens it → ← returns; `S` shows every section at once, typing "lock" narrows to Cable lock; the old `ShellSearchOverlay` import still works.

## W6 — Templates (Library › Composition)

### 6.1 — Templates section + home — ✅ built 2026-10-17
- Library › Composition gains Templates, between Modules and Apps (components → modules → templates → apps). Its home lists every template.
- **Acceptance:** the rail row opens its own home; `validate:rail-pages` green.

### 6.2 — One page per template — ✅ built 2026-10-17
- Shaped like a component page: live preview · anatomy (which header, which blocks) · the component behind it · the apps that use it · props.
- In order: Document (brand page, assets) · Catalog (`CatalogPage`) · Gallery (on `IconPlate` / `CompareGrid`) · Browser (`MediaLibrary`, its own header) · Tool (full-bleed) · Index (the Development home) · Dev (`HubDev`).
- **Acceptance:** each template page renders a live preview and names its header, blocks, component and consumers.

### 6.3 — Blocks — ✅ built 2026-10-17
- One page per body block: text · media · iframe · imported layout · heading · section · table · link list, each with a preview; template pages link to the blocks they use.
- **Acceptance:** every block a template names has its page.

### 6.4 — One header — open-questions round first, then build — ✅ approved + shipped 2026-10-18
- **Round (✅ up 2026-10-17 — Round 11, `/development/open-questions/2026-10-17`):** the header variations side by side on Development › Open questions (the brand page's page + section headers, the decks Catalog header, DocHeader, media's header) and the proposed one with its props; the user picks the default look. **TALK until picked.**
- **Build (after the pick):** `PageHeader` becomes the one header, built on `SectionText`: eyebrow · title · description · media (a logo) · actions, each shown only when passed; a fixed set of text styles; `level` page | section (a section header IS SectionText). `DocHeader` wraps it. SectionText stays for bodies and hero panels.
- **Acceptance:** the brand page's two headers and the decks header render from the one component at its defaults with only props changed.

## W7 — The app loader (AppLoader, kol-monitor)

### 7.1 — `loaderApp({ graphic })` + `hideLoaderApp()` (kol-framework) — ✅ built 2026-10-17
- A Vite plugin writes the static loader (the app's mark on the theme's ground, pulsing) into `index.html`; `hideLoaderApp()` fades it after first paint. Reduced motion: no pulse, no fade.
- **Acceptance:** a harness app with no hand-written loader shows its mark on a cold load (both themes) and it is gone after first paint.

### 7.2 — `LoaderIntro` (stays in kol-foundry — it is drawn by TextPressure) + the Loaders set — ✅ built 2026-10-17
- `IntroLoader` → `LoaderIntro`, moved from kol-foundry to kol-component beside `LoaderOverlay`; the old name an alias on the ledger.
- A Loaders set: the KOL loaders live, the others listed by where they live. Decided: kolkrabbi.io's intro → `LoaderIntro` (the website moves onto it); `LoaderOverlay` stays; olina's and acyr's stay in their repos (client brand); fxr's and mirror's copies → `LoaderApp`.
- **Acceptance:** the set page shows LoaderApp · LoaderIntro · LoaderOverlay running and the other four by path.

## W8 — Rail and Overlay (RailOverlay, kol-monitor)

### 8.1 — `Rail` — ✅ built 2026-10-17
- `ShellDrawer` → `Rail` (alias kept): `side` left · right · top · bottom, `push` | `over`, padding per side; every internal user moved in the same pass.
- `useDragResize` takes top and bottom edges. `SettingsPanel`'s drawer / overlay modes map onto Rail / Overlay.
- **Acceptance:** `Rail side="bottom"` resizes from its top edge; nothing in the packages imports `ShellDrawer` but the alias.

### 8.2 — The two words in the docs — ✅ built 2026-10-17
- One docs entry: Rail (docked, collapses) and Overlay (floats, closes); drawer · shelf · panel · sheet retired as names.
- **Acceptance:** the components docs use only rail and overlay for these surfaces.

## W9 — Stacked tabs (TabsStackedLayout, kol-monitor)

### 9.1 — One tab component: `TabsRow` with a `look` — ✅ built 2026-10-17
- `TabsRow` (the most used) takes `look`: underline (today's) · chip (TabChips) · text (TabStrip) · stacked (icon over label, MobileTabBar's). "Fixed to the bottom on a phone" is `placement="phone"`.
- `TabChips`, `TabStrip` and `MobileTabBar` become aliases onto it, on the retirement ledger.
- **Acceptance:** all four looks render from `TabsRow`; stacked renders inline in a desktop container with no override; the phone bar is `look="stacked" placement="phone"`; every old import still renders the same.
