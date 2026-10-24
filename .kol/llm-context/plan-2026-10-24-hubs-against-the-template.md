# Plan — the hubs against the template, point by point

**Raised:** 2026-10-24, his review of FXR, Mirror, Monitor beside studio-hub. Points verbatim: *"why isnt there a trash icon in cards in library? how can you manage your library?"* · *"why is tags in the middle, how do you edit name, description?"* · *"why is patches still not following the system … same in row, missing fields"* · *"WHY DID THE PAGEHEADER CHANGE"* · *"wrong row item · wrong grid item"* (Create) · *"the layout of the card CAN NOT CHANGE on resolution available, the field can not line break"* · *"same issue wrong everything in create"* · *"YOU ARE USING A HELPER text for paragraphs"* (Mirror's settings) · *"wrong themetoggle"* (Monitor's) · *"didnt you make a preset? HOW IS IT POSSIBLE"* · FXR's rail: *"its literally in THE STUDIO-HUB"* — Chrome enters, Labs enters, Effects expands · *"why would the indicator of chrome in the cards not be the same size as the other icon frame"* · *"studio is also wrong, where is the dotted grid?"*
**Status:** built 2026-10-24, every phase but 2.2 (parked), W6 included — the pass green against studio-hub on FXR 54/54, Mirror 71/71, Monitor 71/71 at 1440 (rail closed and open) and 390; every pair looked at. Open: his review, then the publish (kol-component 0.296.0 · kol-shell 0.77.0 · kol-icons 0.45.0).
**Shape:** W › phase › list.
**Laws carried:** studio-hub is the template, pixel for pixel; one card, one Create, one rail; a card's layout never changes with the width; helper text never wraps; ENTER / EXIT and EXPAND / COLLAPSE; FXR, Mirror, Monitor by name; removed code to `_tmp/<date>-<what>/`.
**How a phase closes:** acceptance line first, gates green, then the pass against his words, and every pair (hub beside studio-hub, same page, rail open and closed) looked at before a word is reported.

## W1 — The card and the rail, on every Home and Library

### 1.1 — One `fileCard`, every verb, both pages (P1) — ✅ built 2026-10-24
- Home and Library on FXR, Mirror and Monitor draw the same `fileCard` studio-hub does: download on the cover, the cog, the trash, rename · duplicate · tags · note through the rail. Library cards get what they lack today (download, trash, the verbs) by sharing Home's card and handlers, not a second card.
- Every hub's Home passes every handler (`onRename`, `onDuplicate`, `onRemove`, `onTags`, `onNote`, `onDownload`) over its own state — the seed or its library store — so the rail's pencil is there on all three; today Mirror and Monitor pass none and the pencil is gone.
- **Acceptance:** on each hub, Library grid and list cards carry download, cog and trash; the rail opens with the pencil; rename, tags and the note round-trip; the pass checks all three.

### 1.2 — The rail's read mode, aligned (P1) — ✅ built 2026-10-24
- In read mode every value sits on the value column's right edge, tags included, as the name does; in edit mode the rows fill. *"why is tags in the middle"*.
- **Acceptance:** the TAGS chips right-align with NAME's value at 380 wide, on studio-hub and the three.

### 1.3 — The meta line never breaks (P1) — ✅ built 2026-10-24 (the `app` group nowrap; the `app` preset's floor 208)
- The `app` card's date · size · trash row is `nowrap`; the `app` grid's column floor rises from 160 to the width that row needs, so a narrower page drops a column instead of breaking the line. Rail open or closed, the card is the same card. *"the layout of the card CAN NOT CHANGE"*.
- **Acceptance:** at 1440 with the rail open and closed, no card's meta row wraps on any hub or on studio-hub; the pass measures the row's line count.

### 1.4 — The mark wears the download's box (P1) — ✅ built 2026-10-24
- The chrome mark is the same box as the download control — same size, same chrome — in the cover's other corner; not a smaller IconFrame. *"the same size as the other icon frame"*.
- **Acceptance:** the two corner boxes measure the same on FXR's cards.

### 1.5 — Library opens on the files, parts as studio-hub's (P1) — ✅ built 2026-10-24
- Library's first view is the files (PATCHES on Mirror and Monitor, FILES on FXR), the persisted tab removed; MODULES is studio-hub's PARTS: the same card and row, checked as a pair beside studio-hub's PARTS grid and list.
- **Acceptance:** `/library` lands on the files view; the PARTS pair matches studio-hub's.

## W2 — Create is StudioCreate

### 2.1 — Mirror's and Monitor's Create on StudioCreate (P1) — ✅ built 2026-10-24
- Both run their own CreatePage copies today, which is why the masthead went mono and the part rows and cards are the old ones. They move onto `StudioCreate` as studio-hub's does: the display masthead, the one filter row, the one part card and row with Insert, the case as `children`, the app's own controls as `caseControls` and `caseActions`; the old pages to `_tmp/2026-10-24-create-on-studiocreate/`.
- **Acceptance:** Create on Mirror and Monitor is the studio-hub Create pair, header to foot, grid and list.

### 2.2 — The mixer's studio on the canvas — PARKED: his word, *"we dont have to solve this here"*
- Mirror's `/studio` is mirror's own desk, not `CanvasStudio`, so there is no dot grid: the third canvas copy named in plan-2026-10-23-canvas-family-and-studio-hub. It moves onto the engine in its own round.

## W3 — Settings: the content and the toggle

### 3.1 — No helper on wrapping text, anywhere a hub draws settings (P1) — ✅ built 2026-10-24, further than written: the rail tier takes rows only, never JSX (`content` ignored with a dev warning; a string value drawn by the DS in mono-12; a section's `note`); the runtime row is in the pass
- Mirror's Memory rows wear `kol-helper-12` on sentences — the law. They become `kol-mono-12`; the pass gets a runtime row that fails on any `kol-helper-*` element taller than one line, on every page it visits, so a variable's text is caught too (the lint reads literals only).
- **Acceptance:** zero wrapping helper elements on all four apps' Home, Library, Settings rail.

### 3.2 — One theme toggle, drawn by the Hub (P1) — ✅ built 2026-10-24: `themeToggle` is the component and the Hub renders it with its own props; an element's props are replaced
- Monitor's and FXR's toggles pass `tone="sunken"`, Mirror's and studio-hub's not — four apps, two toggles. The Hub draws it: `AppHub` takes the `ThemeToggle` component (`themeToggleComponent`) and renders it with the Hub's own props, the way it takes `iconComponent`; a node is still accepted. All four pass the component.
- **Acceptance:** the footer toggle is one element, same box, on all four settings rails.

## W4 — FXR's rail is the template's

### 4.1 — Labs always carries its categories (P1) — ✅ built 2026-10-24 (the catalog's shape read lazily, a pick before labs is mounted opens /labs and runs once its dispatch arrives)
- At Home, Chrome EXPANDED instead of ENTERING because its rows were leaves: Labs' categories reach the rail only after a labs pick. Labs gets its five categories statically from the editor's labs catalog, each with its leaf items, so by the one rule Chrome enters, Labs enters, Effects expands — studio-hub's pair, at Home and on `/labs` alike. Morph joins Chrome's rows if the editor copy carries its route.
- **Acceptance:** from Home: CHROME › enters to EDITOR · LABS › · RANDOMISER; LABS › enters to EFFECTS › · GENERATIVE · VECTOR · COMPOSITION · MODULATION; EFFECTS expands to its items in place; the three pairs match studio-hub's screenshots 103–107.

## W5 — Verification

### 5.1 — The pass, the pairs (P1) — ✅ built 2026-10-24: `_tmp/2026-10-24-hubs-pass/pass.mjs` diffs each hub against studio-hub directly (the class tree with every datum stripped, the measurements, a runtime helper row), an allowlist with file:line per hub; `docs/operations/07-apps-tier/05-studio-parity.md` rewritten to it
- New rows for every acceptance above; the pass green on all four at 1440 (rail open and closed) and 390; the pairs for Home, Library grid and list, Create, Settings rail, the Labs rail looked at beside studio-hub's before the report.
- **Acceptance:** green, and no pair differs except what the sibling repo rules for its own app, each such difference named with its file:line.

## W6 — His second review (2026-10-24): one shape, no JSX, FXR's rail

### 6.1 — What goes in the rail (P1) — ✅ built 2026-10-24
- Exactly Settings · Shortcuts · About · Repo on every rail, the three drawn by the Hub from what every app passes; no app tab (his ruling: *"not 2 lines"* — Mirror's render budget goes under Settings as sections). The Hub draws kol-framework's ThemeToggle itself; reset is live on every rail — the theme back to the system, then the app's own.
- **Acceptance:** the four rails read the same tab row and the same footer; the pass's `settings.tabs` and `settings.reset` rows green with no allowance.

### 6.2 — Rows as data, controls the Hub's (P1) — ✅ built 2026-10-24
- A row names its control (`choice` · `switch`) and `SettingsSections` draws it in the rail's tone; `render` is refused on the rail. FXR's six settings become typed rows over the editor's store (kol-fxr's AppSettings on adoption). The walkthrough's buttons, `app.about` and Create's link are data too, each warning in dev on an element.
- **Acceptance:** the pass's `settings.controls` row (every control kind is the reference's) and `walkthrough.button` row green on all three.

### 6.3 — A registered glyph never overrides a DS name (P1) — ✅ built 2026-10-24 (kol-icons 0.45.0)
- The resolver takes the packaged sets first; a consumer's glyph only fills a name the DS has none for, with a dev warning per collision.
- **Acceptance:** Mirror's reset wears the DS `refresh`.

### 6.4 — The dropdown names (P1) — ✅ built 2026-10-24
- Mirror's options carry the label alone; the picked option's detail is the row's hint.

### 6.5 — The expanded rows, a group (P1) — ✅ built 2026-10-24
- `NavRail` draws expanded rows inside `.kol-rail-group`, the sm rung (26) on a 4px gap, glyph and type unchanged. The rung is his to rule on the NavRail page.
- **Acceptance:** the pass's `rail.labs` row reads the group's rung and gap on both apps.

### 6.6 — FXR's rail (P1) — ✅ built 2026-10-24
- Library · Editor · Labs · Randomiser · Morph; Labs enters and Effects expands; the Chrome section and page are gone; Morph a placeholder until the mirror carries its route.
- **Acceptance:** `rail.labs` green walking Labs → Effects against the reference's Chrome → Labs → Effects.

## Not in this plan
- The siblings adopting any of it — after the publish.
