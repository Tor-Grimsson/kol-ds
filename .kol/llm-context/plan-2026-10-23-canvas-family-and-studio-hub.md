# Plan — The canvas family and the studio hub

**Raised:** 2026-10-23, the user in session, reviewing HubHomeContract's surface. Points verbatim: *"studio would be the 'create' 'studio/rack' with zoom grab to move etc. the container of the content? while studio-hub would be specific hub of those apps?"*, *"there is also a canvas the mirror and monitor use that is a bit different, it has a dotted grid and shortcuts"*, *"CanvasStudio with 2 variants? or one with props? and then the other one can be CanvasEditor? so the canvas components are prefix-grouped?"*, *"we should have them as similar as possible, exactly to not maintain many different versions? create a convention?"*, *"apps/studio would then just show that canvas? and apps/studio-hub would be the endpoint of this ticket?"*
**Status:** W2, W3, W4 BUILT 2026-10-23, unpublished, awaiting his review of `apps/studio-hub`. GO 2026-10-23 (*"w1 - w3 is go /kol-goal /playbook get it done, then I review"*), W4 with them. W1 built, unpublished; his review of 2026-10-23 is W4 (eleven points — he was shown `apps/hub` as the ticket's product, which it is not; `apps/hub` stays as it is). Open: W2, W3, W4; then his review; publish after, outside the plan.
**What he reviews:** `apps/studio-hub` only — `pnpm studio-hub` serves it with `--host`, so the phone opens `http://<the Mac's LAN IP>:5190/#/` (vite prints the Network line); dark by default; installable to the home screen (3.2). Every review link names exactly what is on it.
**Shape:** W › phase › list.
**Laws carried:** no bullets outside a list — no middle-dot strings in UI text or in messages, a comma or a bracket instead (ruled 2026-10-23); ARCHITECTURE §3 (no reverse deps; same job → a variant, the old name an alias on the ledger); D2 2026-09-29 (`apps/<tool>` = the tool alone; `apps/<tool>-hub` = Shell + Hub + the tool); carry-through means verbatim (the lift ports the rack viewport and the desk class-for-class); tokens over literals; the touch rung (09-sizes); HubHomeContract's two conditions (built in an app first; his sign-off before any app adopts).
**How a phase closes:** acceptance line first, gates green, then Playwright against his own words.

## What is what (read off the code, 2026-10-23)

| | Where it lives today | Model |
|---|---|---|
| the editor's canvas | kol-component `organisms/Canvas.jsx` — `Canvas` + `PanZoomViewport` + `CanvasZoomContext` (ported from fxr 2026-09-03) | a letterboxed 1080-virtual **frame** with rulers and guides; Space+drag, ⌘-wheel / pinch zoom 2–3200 %, ⌘0, `f` fps; a `backdrop` slot |
| the rack's canvas | kol-monitor `rack/RackViewport.jsx` + `hooks/useDotGrid.js` + `useTouchGestures.js` (copied into `apps/rack`) | an infinite **surface**: dot grid `--kol-fg-12` 1px on a 36px cell scaled by the zoom and offset by the pan, `g` toggles; Space+drag, wheel and pinch zoom 0.1–2, `L` lock, snap, view persisted |
| the desk's canvas | kol-mirror `SymphonyMixer.jsx:765–1135` (copied into `apps/mixer`) — "kol-monitor's exactly" | the same surface; plus its 2026-10-15 rule: a plain wheel pans, ⌥/⌘-wheel and a trackpad pinch zoom at the cursor, ⌥0 resets, `G`, `L` |

Three canvases, one in the DS, and the one the user calls the studio is the one that is not.

## W1 — Home is a data contract (HubHomeContract) — ✅ built 2026-10-23, unpublished

### 1.1 — `HubHome` closed; `apps/hub` the review surface — ✅ built
- `files`, `template`, `onOpen`, `onDownload`, `onRename`, `onDuplicate`, `onRemove`, `filterGroups` (`exclusive`), `action`; the Hub draws every card on `preset="app"`. kol-shell 0.76.0 in the tree. `apps/hub`, `apps/studio`, `apps/editor-hub`, `apps/mixer-hub` and the preview on it.
- **Acceptance:** RECENT = template + 12 newest, SAVED = every file; a consumer prop outside the contract warns in dev and changes nothing — verified in a browser, record in `lobby/inbox/HubHomeContract.md`.

### 1.2 — The mobile pass — ✅ built (kol-theme 0.184.0)
- Measured at 390, 768, 1440, both layouts, both themes; the inline control's touch reach is 32; the date and size wrap at 390 kept, decided for review.
- **Acceptance:** no horizontal scroll at any width; every control on the card reaches the touch rung — measured.

### 1.3 — Sign-off — after W2, W3 and W4
- He reviews `apps/studio-hub` when W2, W3 and W4 stand. Publish and the receipts to fxr, mirror and monitor are not this plan's — they follow his sign-off, as always.

## W2 — The canvas family: one engine, two surfaces, prefix-grouped

**The call (recommended, for his ruling):** not two variants and not one component with a mode prop — **one engine, two components**. The two differ in MODEL (a fixed virtual frame with rulers and guides vs an infinite surface whose grid moves with the work), so a `variant` would be a branch through every line of one file. What must not drift is the gestures, the keys and the zoom context, and those become the engine both read. Prefix-grouped as the family convention already is (`Content*`, `Settings*`, `Hub*`, `Rail*`): **`CanvasEditor`** and **`CanvasStudio`**.

### 2.1 — The convention — ruled 2026-10-23 (the modifier); the names stand as recommended — ✅ built 2026-10-23
- `useCanvasViewport` — `PanZoomViewport`'s pan, zoom, pinch, touch and keys lifted into one hook over the existing `CanvasZoomContext`; both components read it, neither owns a gesture.
- `CANVAS_KEYS`, one table: Space+drag, middle-drag pan; wheel pinch and **⌘-wheel** zoom at the pointer; **⌘0** reset; `G` grid; `L` lock; `F` fps. **Ruled 2026-10-23:** ⌘ is the canvas's modifier (*"yes I agree"*); **⌥ is the Hub's — ⌥1 … ⌥9 are its pages** — so the desk's ⌥-scroll / ⌥0 go, no ⌥ alias, and ⌥-drag pan goes with them.
- Documented as a 03-components page (the canvas family, the key table, which surface for what) and a row in the names doc.
- **Acceptance:** the two components answer the same gesture with the same number (zoom step, clamp, anchor); the component page shows both; `pnpm validate` clean.

### 2.2 — Lift `CanvasStudio` (P1) — ✅ built 2026-10-23
- Diff monitor's `RackViewport` + `useDotGrid` + `useTouchGestures` against mirror's desk first; the lift takes whichever rule is newer (mirror's wheel-pans / pinch-zooms, 2026-10-15–16).
- The dot grid on tokens: `--kol-fg-12` 1px on a 36px cell, scaled by the zoom and offset by the pan — both apps' exact rule; `G` toggles, `grid` sets the default; `L` locks; the view is the consumer's (`view` / `onViewChange`, persisted by whoever wants it); snap stays in the rack (it is the rack's HP, not the canvas's).
- Touch: two fingers pan and pinch at the midpoint, one finger pans unless it is on a control — `useTouchGestures` verbatim.
- **Acceptance:** `apps/rack`'s viewport and `apps/mixer`'s desk run on `CanvasStudio` with no visible change — Playwright reads the grid cell, the pan offset and the zoom before and after, at 1440 and 390.

### 2.3 — `CanvasEditor` is the editor's canvas, renamed — ✅ built 2026-10-23
- `Canvas` → `CanvasEditor`; `PanZoomViewport` stays behind `panEnabled` as today; `Canvas`, `PanZoomViewport`, `PanViewport` on the retirement ledger as aliases. design-editor (the mirror) and fxr resolve by alias and rename on their own bump.
- **Acceptance:** the editor renders unchanged on the alias names; three ledger rows; `validate:retirements` clean.

## W3 — `apps/studio` and `apps/studio-hub`

### 3.1 — `apps/studio` = the studio canvas alone (P1) — ✅ built 2026-10-23
- Today's `apps/studio` folder becomes `apps/studio-hub` (3.2). A new `apps/studio` shows `CanvasStudio` under the tool frame (`PageShell mode="fixed"`, STUDIO masthead): the dot grid, pan, zoom, `G`, `L`, touch, and nothing else — the tool judged without chrome, as `apps/rack` and `apps/mixer` are.
- **Acceptance:** at 1440 and 390 the surface pans and zooms by the key table; `validate:render studio` clean.

### 3.2 — `apps/studio-hub` = the Hub around a studio, THE review surface (P1) — ✅ built 2026-10-23
- The rename: folder, port row on `/apps`, root script, the build list, the `vercel.json` rewrite, the app's home at `/app/studio-hub`.
- **The whole shape, as his review asks (W4, points 1–5):** the mark = Home, Library, Create (empty is fine), Studio (Use — the canvas, empty is fine), the pinned foot: Media, Sign in, Settings. Home takes the full HubHomeContract state (the verbs, download, the filter) with real images (4.1); Use shows `CanvasStudio`; Create keeps its header over it.
- **Reachable from his phone:** the root script runs `vite --host`; the boot script stamps dark when nothing is stored (explicit > system > light still holds for a stored choice); a web manifest (`public/apps/studio-hub.webmanifest`, `display: standalone`) and the Apple meta tags so Add to Home Screen on the LAN URL opens it standalone — `localhost` itself never resolves on the phone, the Mac's IP does.
- `AppStudio` the component keeps its name — an App composition, like `AppHub`. **TALK** only if he wants `StudioHub` on the ledger instead.
- **Acceptance:** `/apps/studio-hub/#/` shows the contract Home and every row above renders a page; opened from a phone on the LAN it is dark and installs to the home screen; `validate:views` and `validate:render studio-hub` clean.

### 3.3 — `rack-hub` and `mixer-hub` on it — ✅ built 2026-10-23
- `rack-hub` moves from its hand-wired `CatalogPage` Home onto `AppStudio` + `HubHome`, so monitor's rehearsal exercises the contract; both rehearsals take `CanvasStudio` (2.2).
- **Acceptance:** both Homes match `apps/studio-hub`'s; the render gate clean on both.

### 3.4 — Create: a catalog and a studio on one page, monitor's page made once — ruled 2026-10-23 (the case controls stay the consumer's slot) — ✅ built 2026-10-23
- Not accounted for until 2026-10-23 (*"what about the create tab, which is a combination of catalog and studio?"*): the Studio has a `create` slot (a header over whatever the app passes) and nothing more; monitor's Create and mirror's port of it are the same page written twice.
- **Reference monitor, not mirror** (his call: monitor is tried and tested). Read off `kol-monitor/src/pages/CreatePage.jsx`: `PageShell` fixed on the case view and scrolling on the modules view; an editable, persisted masthead (name, description); `ContentFilters` with the view strip CASE ⇄ MODULES, the modules view a catalog of the parts (groups Category and Size, LIST and GRID), the case view the studio canvas (`RackViewport` → `CanvasStudio`) with the dot grid under the whole page; Add row (1U, 3U) and Set HP as dialogs; a part dragged or sent from the pool lands in the case; the workbench.
- **What the DS makes once:** the composition — `StudioCreate`: the two views, the parts catalog, the canvas, the editable masthead, the dot grid, the drag-or-send seam (`onPlace(part)`), the case controls slot. **What stays the consumer's:** the case model (rows and HP are the rack's, channel strips the desk's; `caseControls` is their slot), the parts themselves, the workbench. The editor has no Create and passes none.
- `apps/studio-hub` shows it on dummy parts: a handful of module cards in the pool, an empty case on the canvas, Add row adding a placeholder row.
- **Ruled 2026-10-23:** Add row and Set HP stay the consumer's dialogs in the `caseControls` slot (*"slot is fine"*).
- **Acceptance:** monitor's Create renders on `StudioCreate` with no visible change (Playwright at 1440 and 390: the view strip, the pool's groups, the case's grid, Add row); `rack-hub`'s copy and `mixer-hub`'s port run on it.

### 3.5 — The three align to the studio shape; fxr's rail — TALK, to be SHOWN — ✅ built 2026-10-23, shown on apps/studio-hub for his ruling
- The point is not any one of the three (*"its about unification and simplification and standardisation … they dont align on the fucking structure they work within"*): the DS defines the structure once — `AppStudio`'s full shape — and each repo fills content. fxr moves furthest, which is all "fxr aligns" means.
- **Touch:** every app's phone lands on Home with the phone nav; fxr's SELECT CHROME overlay and its `/` → `/randomiser` redirect go; New File opens the chooser from Home.
- **fxr's rail (his idea, 2026-10-23):** the base level stays simple — **Chrome** is the point of entry; enter Chrome → Editor, Labs, Randomiser, Morph; enter Labs → its fields (Effects, Generate, …) fold. *"I cant visualise this through text, I have to see something"* — so `apps/studio-hub` carries a dummy **Chrome** section built exactly so (`railSections="enter"`, two levels), and he rules on the render, not on prose.
- **Acceptance:** at 390 each app opens on Home with every row reachable from the phone nav and no overlay before the first tap; the Chrome section enters and folds as described, on screen.

## W4 — His review of `apps/hub`, 2026-10-23 — the eleven points, second pass

*"I did review pnpm hub and its not correct."* The surface was the Hub alone around a placeholder; the review surface is the studio hub (3.2). His corrections of 2026-10-23 (second message) are folded in; what is still open is marked TALK.

### 4.1 — Points 1–5: the page set is the Studio's, made once (→ 3.2) — ✅ built 2026-10-23
- Home (the mark — *"mark is home, thats how we have been doing it"*, no extra row), Library, Create (empty is fine), Studio (Use, empty is fine), the pinned foot: **Media, Sign in**, Settings. All three apps have Media and Sign in today, each hand-wired; `AppStudio` takes `media={…}` (the DS modal library) and `signIn={…}` (the user row, a person while local, a cloud while synced; the press is the consumer's) so the rows exist once. The reference app: the media fixture and a dummy session that toggles.
- **Acceptance:** every row renders a page or opens its door at 1440 and 390; `validate:render studio-hub` clean.

### 4.2 — Point 6: real images (P1) — ✅ built 2026-10-23
- *"just show something real, that the point of this."* Every cover on the review surface is a real image from `public/` (the chrome previews, the stack hero, the media fixture's photos); you can see where the image starts and ends.
- **Acceptance:** no glyph covers; one deliberate no-cover specimen shows the placeholder.

### 4.3 — Points 7 + 8: the `meta` line is ILLEGAL — it leaves the app card and row (P1, ruled) — ✅ built 2026-10-23
- *"those cards were fully designed, in apps/catalog … that '6 layers 4:5' is ILLEGAL and layout BREAKING … this meta line I didnt design for or approve … it cant be just inserted without BREAKING THE LAYOUT"* (Image 3: a card with the line and one without put date and size on different baselines). AppCardMeta (kol-component 0.292.0, kol-monitor's ask) shipped a slot he never ruled — the ruling is reversed here.
- Fix: `meta` is removed from the `app` card and row text (`title`, then date and size — the designed layout); `summary` leaves the contract's card; monitor's "12 modules, 10 connections" moves to the info surface (4.5). *"I hate using bullets like this"* — no middle-dot strings on a card. The row then holds its 72 rung with a square thumb (the ragged list of Image 2/4 was this line).
- **Acceptance:** every app card's plate measures the same height with or without extra data; every row is 72 with a 72 × 72 thumb; the ledger carries the reversal.

### 4.4 — Point 8: the list is THREE columns per row, as ruled (P1) — ✅ built 2026-10-23
- *"I had already ruled this in preset file 3 columns per row, not one single column."* The ticket's "list = the app row stacked, one per line" was the filing agent's claim, not his ruling (2026-10-22: `listColumns` 3 for a file, app, slide row). `HubHome` drops its `listLayout="stack"`; the `app` preset's three columns stand.
- **Acceptance:** at 1440 the list shows three rows across; tracks never under 240.

### 4.5 — Point 9: opt in to the filters or do not use the catalog; a file's info surface — TALK (one call) — ✅ built 2026-10-23, shown on apps/studio-hub for his ruling
- *"either you opt in to the filter system, if not then why use it? it becomes pointless to use catalog if its unusable"* — a line to each repo in the receipts: declare your groups and tag your files, or Home is not a catalog for you. The contract keeps `filterGroups` opt-in.
- *"if each card/project had a settings/info maybe an overlay or siderail then you could have edit tags there, along with much more metadata"* — the cog opens a **file info surface**: name, tags (editable), the metadata the card no longer carries (layers, aspect, modules, connections, dates, size), and the verbs. **Recommend the side rail** (kol-component's `Rail`, the editor's inspector idiom — the catalog stays visible while you edit tags); the overlay is the alternative. One DS piece, every app's. **Ruled 2026-10-23: the side rail** (*"yeah makes sense to me"*).
- **Acceptance:** the cog opens the surface; a tag edited there filters on Home at once.

### 4.6 — Point 10: ⌘K in the Hub (P1, recommended scope) — ✅ built 2026-10-23
- *"what do you think?"* — one modal, not two: `AppHub` mounts the search modal on ⌘K over **files, pages, shortcuts** as categories (the showcase's ⌘K model); `S` keeps opening it in shortcuts mode. A second modal for pages would be the drift again.
- **Acceptance:** ⌘K from any Hub page; a file's name + Enter opens it; a page's name + Enter navigates; Esc closes.

### 4.7 — Point 11: the S sheet opens expanded (P1) — ✅ built 2026-10-23
- `CommandOverlay mode="shortcuts"` opens with every section expanded; the control reads Collapse all; drill-in stays for a long map.
- **Acceptance:** `S` shows every key of every section on open; one press folds them all.

### 4.8 — The blank start leaves the catalog — ruled 2026-10-23 (*"yeah drop it"*) — ✅ built 2026-10-23
- *"empty row not having icons: why would you have an empty row? if you did, how would you delete it?"* (Image 4, the "Empty tool" row). The template — fxr's New File, mirror's Empty Studio, monitor's Empty 7U — rides RECENT as a card with no verbs, and in the list it reads as a file nobody can delete. Files only in the catalog; the blank start is the **New** button at the foot (and the first door on the touch Home, 4.10). `template` leaves the contract.

### 4.9 — Point 1b: the catalog as Home — PARKED: keep as is (his call, 2026-10-23)
- *"do we need catalog in 'home' or do we want a different layout? for now lets keep as is."* Agreed: changing Home's layout while unifying the three structures would move the target; revisit when 4.10 stands and the three are on one shape.

### 4.10 — Point 11b: Home on touch is a simplified selection — TALK, to be SHOWN — ✅ built 2026-10-23, shown on apps/studio-hub for his ruling
- *"home mobile could have an alternative to the catalog on mobile bp or touch devices? simplified selection."* On a coarse pointer Home draws its touch form — the doors (New, Recent, Library, …) as a simple selection, the catalog behind it or below it. Built as a dummy on `apps/studio-hub` at 390 so he rules on the render.
- **Acceptance:** at 390 touch, Home opens on the selection; a desk keeps the catalog.

### 4.12 — Home at the viewport's height, the catalog scrolls inside — his idea, to be SHOWN — ✅ built 2026-10-23, shown on apps/studio-hub for his ruling
- *"maybe we should do 100vh and have the content vertically scroll at some point? such that in that view new file and walkthrough are always at the same place regardless of content? justify vertically, catalog content fills a certain height?"* Home on `PageShell mode="fixed"`: masthead and filter row at the top, the catalog in its own scroll region, the action row (New, Walkthrough) pinned at the foot — the same place on every app, with one file or a hundred.
- Built on `apps/studio-hub` for him to see, beside the scrolling page it has now; he rules on the render.
- **Acceptance:** at 1440 and 390 the action row sits at the same y with 1 and with 40 files; the catalog scrolls, the page does not.

### 4.11 — The modifiers (→ 2.1) — ruled
- **⌥ + number = the Hub's page shortcuts (⌥1 Home … ⌥9); ⌘ = the canvas, globally (⌘-wheel zoom, ⌘0 reset, ⌘= / ⌘−).** No ⌥ on the canvas.

## Not in this plan

- `CanvasStudio` is the background only: the dot grid, pan, zoom, lock and the keys. The modules, cables and workbench on top of it stay monitor's code; the channel strips on top of it stay mirror's code.
