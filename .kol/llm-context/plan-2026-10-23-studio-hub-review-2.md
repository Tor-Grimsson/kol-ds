# Plan — studio-hub, review 2 (desktop and mobile)

**Raised:** 2026-10-23, the user, reviewing `apps/studio-hub` on desktop (images 5 to 25) and on his phone (images 27 to 31). Points verbatim in each phase. Reviewed and tightened by the Fable session before the hand-off; built by an Opus session.
**Status:** READY TO BUILD 2026-10-23. Nothing built. Every phase is decided; nothing waits on a ruling. He reviews `apps/studio-hub` again when W0 to W7 stand.
**Shape:** W › phase › list.
**Laws carried:** reuse what ships, never redefine (*"a lot of things are being redefined here that DO NOT NEED TO BE"*): a piece that exists in kol-component or kol-shell is used, never re-drawn; no bullets outside a list — no middle-dot strings in UI text; `kol-helper-*` is single-line chrome only, never on text that can wrap (01-foundations/03-typography.md:29); carry-through means verbatim; tokens over literals; a molecule never imports an organism (the taxonomy gate); nothing published, no git.
**Versions:** nothing has shipped since 0.295.1 / 0.75.0 / 0.183.0, so every bullet lands under the EXISTING unpublished headings — kol-component `## 0.296.0`, kol-shell `## 0.77.0`, kol-theme `## 0.184.0`. No new version numbers.
**How a phase closes:** acceptance line first, gates green (`pnpm validate`, the standing retirements pair excepted, never mentioned; `validate:render studio-hub studio rack-hub mixer-hub editor-hub hub`), then Playwright against his own words — scripts and shots in `_tmp/2026-10-23-studio-hub-review-2/`, a dev server on a task port with `--host 127.0.0.1 --strictPort`, PID noted and killed. Playbook entry per phase in `.kol/llm-context/playbook/2026-10-23-canvas-family-and-studio-hub.md`; the plan's heading ticked `— ✅ built <date>`.
**Review surface:** `pnpm studio-hub` → `http://192.168.1.9:5190` on the MBP and on the phone (the config listens on the network; `localhost:5190` works too).

## W0 — The Hub's dialogs are the DS's

### 0.1 — `AppHub` mounts `ModalProvider` (P1) — ✅ built 2026-10-23
- The rail's Delete confirm, Rename prompt and the sign-in prompt (5.2) run through `useModal`; without a `ModalProvider` they fall back to native dialogs with a console warning. `AppShell` mounts none; `apps/hub` and `apps/mixer-hub` wrap one in `main.jsx` by hand. `AppHub` (packages/shell/src/AppHub.jsx) wraps its tree in `ModalProvider` from kol-component; a consumer's own provider above it keeps working (useModal reads the nearest). The two `main.jsx` wrappers can stay; `apps/studio-hub` adds none.
- **Acceptance:** on studio-hub, Delete on a card opens the DS dialog with no console warning.

## W1 — Covers are outputs, not UI

### 1.1 — Generated geometric covers (P1) — ✅ built 2026-10-23
- *"wrong images, use output, not screenshot of ui … just use some geometric abstractions? some gradients … what would be an output of a patch or project is a more normal thumb."* `apps/studio-hub/src/App.jsx`: the rack previews leave the files and the walkthrough; a `cover(seed)` helper in the app returns an SVG data URI — a dark ground with one of a few compositions (a gradient wash, triangles, a line grid, neon strokes, concentric rings; his references are images 5 and 6), hue and layout from the seed so every file differs; the last file keeps no cover so the placeholder is on the page once.
- The parts keep their module fronts (`/previews/modules/*.png`) — a part's picture is the part, as monitor's library shows it.
- **Acceptance:** no cover on Home, Library FILES, Home B or the rail is a UI screenshot; fourteen covers, thirteen different.

## W2 — The file rail is the settings drawer

### 2.1 — Rebuilt on `SettingsPanel`, the drawer the settings gear opens (P1) — ✅ built 2026-10-23
- *"why is there border on the siderail? … rethink this entire siderail based on settings rail and based on labs rail, convention, standards, padding, width."* The border was `Rail`'s `edge` under `backdrop={false}`; the drawer he means is `SettingsPanel variant="rail"` (packages/component/src/organisms/SettingsPanel.jsx — 380 wide, the scrim, no edge, the header row with its ×, the `SettingsFooter` foot), as `HubSettings` opens it. `AppItem.jsx`'s rail becomes exactly that: `SettingsPanel variant="rail" title="File"` with `SettingsSections divided` holding three sections — Name (one `SettingsRow` whose control is an `Input` committing through `verbs.rename` on Enter or blur), Tags (a row of `Tag` chips with ×, under it a `SettingsRow` with the add-a-tag `Input`, both through `onTags`), Details (one `SettingsRow` per `{ label, value }`) — and a footer in `SettingsFooter`'s shape holding three icon buttons (download, duplicate, delete; the same control the footer's reset is) instead of the three labelled buttons at the foot. Delete confirms via `useModal`. `Rail` leaves AppItem.jsx.
- `labs rail` (image 10) is the same anatomy — eyebrow section headings, label-left control-right rows, dividers — so nothing is invented beyond the three sections.
- **Acceptance:** with the file rail and the Display settings drawer open in turn, Playwright measures the same width, padding, header row and footer row; the rail has no border; the catalog behind it is scrimmed as the settings drawer scrims it.

## W3 — Create's catalog is the catalog

### 3.1 — The parts use the Catalog's grid, card and row (P1) — ✅ built 2026-10-23
- *"a new set of card and row … different card, layout, padding, text … someone attached an insert to the end of a random card. zoom should be off. there are 8 columns per row."* StudioCreate drew its own `auto-fill minmax(160px)` grid (hence eight columns), its own list grid, and an INSERT strip under each card.
- The grid is lifted out of `CatalogPage` into one piece, `CatalogGrid` (packages/shell/src/CatalogGrid.jsx): the measured track count (the ResizeObserver, `--kol-catalog-n`, the 6 ceiling and 160 floor), `.kol-catalog-grid`, and the list grid with `listColumns`. `CatalogPage` renders through it, byte-identical (acceptance: its Playwright numbers before and after match on `apps/catalog`); `StudioCreate` renders its parts through the same piece.
- The parts are `ContentCard variant="catalog"` and `ContentRow variant="catalog"` with `zoom: false` (the catalog default zooms a card with media; this page and Library's PARTS both pass `zoom: false` so they match — the default itself is not touched). INSERT is the card's and the row's `actions` slot — `ActionButton chrome="inline" size="sm" icon="plus" label="Insert"` — where the app card carries its cog and trash; the strip under the card goes.
- Export `CatalogGrid` from kol-shell's index; classification, a preview or a `NO_PREVIEW` line ("rendered in the CatalogPage and StudioCreate previews"); changelog bullet.
- **Acceptance:** at 1440 the parts show six per row, at 390 one list; card and row measure identical to Library's PARTS view; no hover zoom; INSERT sits in the plate.

## W4 — The rail's sections

### 4.1 — Enter recurses; only a leaf section folds (P1, ruled) — ✅ built 2026-10-23
- *"its just wrong tho. labs had it correct yesterday size and text, just didnt have the enter exit collapse expand correct … it all got messed up yesterday."* What fxr's labs rail did and he approved: enter Labs → its five sections as full rows (L1: 20px glyph in the 32px rung, `kol-helper-12 uppercase`, oq-96) → each section FOLDS its groups in place as the small L2 rows (12px glyph in a 20px box, oq-64, indented — his own August ruling, RailTwoLevelSections, untouched). In studio-hub I nested one level deeper (Chrome → Labs → fields), and `NavRail` (packages/component/src/organisms/NavRail.jsx:331) enters ONE level only, so Labs could not enter and its fields rendered as L2.
- Fix in `NavRail`: `entered` becomes a path stack; inside an entered level a row with `sub` whose rows themselves carry `sub` ENTERS (chevron-right, Back climbs one level, the mark still goes home); a row with `sub` whose rows carry none is a leaf and FOLDS in place with the L2 rows as today. `AppStudio` already passes `sub` two levels deep.
- studio-hub: Chrome enters → Editor, Labs, Randomiser, Morph; Labs enters → Effects, Generate, Vector, Composition as full rows; Effects carries two dummy groups (`sub`) so one fold is on screen; the placeholder pages stay.
- **Acceptance:** at 1440 with the rail open, Chrome → Labs shows Effects, Generate, Vector, Composition at L1 size and ink with their glyphs on the L1 glyph column; Effects folds two L2 rows; Back climbs Labs → Chrome → root. If he still disagrees on the render, the reference is fxr's labs rail before 2026-10-22 (his `agent-grand 15`).

## W5 — Media and Sign in as the apps have them

### 5.1 — Media opens the picker mirror uses (P1) — ✅ built 2026-10-23
- *"incorrect media, did you not look at mirror"* — kol-mirror's `App.jsx:280` opens `MediaLibrary variant="picker"` (the column browser with the preview pane, Cancel and Use). `AppHub.jsx`'s Media row opens `variant="picker"` with the same `open`, `client`, `accept`, `onClose`, `onSelect`; the modal variant is not used by the Hub.
- **Acceptance:** Media on studio-hub opens the column browser over the fixture; Cancel closes it; Use fires `onSelect`.

### 5.2 — Sign in asks in the DS dialog (P1) — ✅ built 2026-10-23
- *"you didnt include the sign in modal, missed opportunity."* `AppHub`'s Sign in row: signed out, the press runs `signIn.onPress` after `useModal().prompt('Password for the library sync:', '')` returns a value (fxr's `RailSignIn` flow, verbatim copy: empty cancels); signed in, `useModal().confirm('Sign out of the library sync? Saves stay on this device only.', { okLabel: 'Sign out' })` then `onPress`. `signIn={{ signedIn, onPress(password | null) }}` — the consumer gets the password (fxr signs in with it) or `null` for sign out. The reference app accepts any password. Needs W0.
- **Acceptance:** Sign in → the DS prompt → a password → the row reads Signed in with the cloud glyph; press again → the DS confirm → Sign in again.

## W6 — The overlays and the settings page

### 6.1 — ⌘K opens with its shortcut sections expanded (P1) — ✅ built 2026-10-23
- *"search still says expand all … should say collapse all and be already expanded."* `CommandOverlay.jsx`: in search mode the Shortcuts fold rows AppHub passes start `open: true` (the S sheet already does); the footer then reads Collapse all on open.
- **Acceptance:** ⌘K on studio-hub shows every key under Navigate, Canvas and Help on open; the footer reads Collapse all.

### 6.2 — Shortcut labels are labels (P1) — ✅ built 2026-10-23
- *"setting page is using helper for sentences that line break, that is illegal … this is a reference shortcut quicksheet, not a novel."* Two fixes. Data: studio-hub's `SHORTCUTS` labels become two or three words — Pages, Settings, Hide rail, Search, Pan, Zoom, Reset view, Grid, Lock, Frame rate, Every shortcut. Component: `SettingsRow` draws its label through `LabeledControl inline` (packages/component/src/molecules/LabeledControl.jsx); that inline label span becomes `whitespace-nowrap truncate` (the helper law by construction — a label can never wrap, it ends in an ellipsis); `SettingsShortcuts` keeps its combo cell nowrap.
- **Acceptance:** no shortcut label wraps at 1440 or 390; the helper gate (7.5) passes on the settings page.

### 6.3 — Settings is tiered and opt-in (P1, ruled) — ✅ built 2026-10-23
- *"why does it have content filters, why one column, why its own pages, I think maybe its an opt in, in tiers. most of the time you will only need a siderail … if you are super heavy then you might want a page, then when the page is getting heavy you might want filters, but putting all this by default is overkill."*
- Three tiers on `AppHub settings`: **drawer** (the default): the Settings row at the rail's foot and `,` open `SettingsPanel` with the sections, the theme toggle and reset in its footer — no route, no page; **`settings.page: true`**: the HubSettings page exists at `settingsPath`, the row and `,` navigate to it, the gear on it opens the drawer; the page is two columns from `lg` — sections left, `SettingsShortcuts` then About and Repo right — on the drawer's row shape, with no filter bar; **`settings.filters: true`**: the page keeps today's `ContentFilters` bar over the sections. About and Repo live on the page tier only.
- studio-hub: the drawer tier by default; a row in the drawer, "Settings page", flips the page tier live (and "Filters" under it), so he sees all three.
- **Acceptance:** with no opt-in there is no Settings route and the row opens the drawer; the page tier does not scroll at 1440 × 900 with studio-hub's content; the filters tier shows the bar.

## W7 — His mobile review

### 7.1 — Both phone navs ship; the bar steps aside for a tool (P1, ruled) — ✅ built 2026-10-23
- *"fxr on mobile uses the bottom a lot for settings, so I think we should ship both versions. at least show me the current system, which I didnt have a problem with. or we have to hide show the bottom when you're in labs or randomiser or morph?"*
- Both stay: `touch="bar"` and `touch="drawer"` (fxr's hamburger and drawer, already in `AppShell`). New on `AppShell`: `barHiddenOn` (paths; on one, the bar unmounts and `--kol-shell-bar-h` is 0) — studio-hub hides it on `/studio` and under `/chrome`. The bar's labels take the rail's row type and ink: `kol-helper-12 uppercase`, oq-64 at rest, oq-96 active, the 20px glyph — one constant in `packages/component/src/hooks/railRow.js` that `NavRail` (organism) and `TabsRow`'s stacked phone tab (molecule) both read, so neither retypes it.
- studio-hub: a row in the settings drawer, "Phone nav: bar or drawer", persisted in localStorage, feeds `shell.touch`.
- **Acceptance:** at 390 studio-hub shows the bar with the rail's type and ink; switched, the drawer; on `/studio` the bar is gone and the canvas takes the full height.

### 7.2 — A phone gets rows, no LIST GRID line; quick links are fxr's option (P1, ruled) — ✅ built 2026-10-23
- *"I do like just using row contentcard for mobile, because the grid card breaks layout … what bothers me is a new line for LIST GRID, and if we opt for just using row card on mobile, then we don't need to show it at all."* `CatalogPage` below `md` (768, the `drawerBelow` rung) draws the list with the preset's row and passes no `layoutOptions`, so the third line is gone; `phoneLayout="grid"` opts back. Home, Home B and Library all take it.
- *"fxr would use the quicklinks for picking chrome right on mobile, while monitor and mirror wouldn't."* HubHome's separate touch page (doors, recent rows, All files) goes. `touch.doors` stays as the option: on a coarse pointer or below `md`, the doors render as a 2 × 2 grid of large buttons ABOVE the catalog (the catalog itself is the rows), nothing else; no `recent`. fxr passes its chromes; monitor and mirror pass nothing.
- studio-hub: a drawer row "Quick links on the phone" flips `touch.doors` on and off.
- **Acceptance:** at 390 Home and Library show rows only, no LIST GRID strip, the filter header on two lines; with quick links on, four doors sit above the rows.

### 7.3 — Create wears the page masthead (P1) — ✅ built 2026-10-23
- *"create page both desktop and mobile is using a different header than all other pages?"* `StudioCreate.jsx`'s editable subtitle field wears `kol-mono-14 text-fg-48`; the title field's line-height is its own. Both fields take `SECTION_TEXT_LEVELS.app`'s own classes (`title` and `lede`) and no fixed heights, inside `PageHeader level="app"`, so an uneditable Create and Library's masthead are the same header; editing shows only the caret and the underline.
- **Acceptance:** Create's masthead measures the same title size, lede size and spacing as Library's at 1440 and 390.

### 7.4 — Home B holds still on the phone (P1) — ✅ built 2026-10-23
- *"home b on mobile does not do what it describes, only on desktop."* `kol-components-shell.css:69` sizes the fixed page with `100vh`, which on iOS Safari is taller than the visible viewport, so the foot sits under the browser chrome and the page scrolls. Both `.kol-shell-page` and `.kol-shell-page--fixed` take `100dvh` with the `100vh` line kept above it as the fallback (kol-theme 0.184.0). Then verify the fill chain at 390: the catalog region scrolls, the action row sits above the bar.
- **Acceptance:** at 390 (Playwright, isMobile) the page does not scroll, the rows do, New and Walkthrough sit just above the bar with 1 file and with 14; the CSS carries `dvh`.

### 7.5 — No helper on a sentence, and a gate so it cannot ship again (P1) — ✅ built 2026-10-23
- *"I hate that you still use helper for paragraphs even though I have said this LAW … you are the DS agent, why does this happen?"* It happens because no gate reads it. Instances to fix now: `apps/studio-hub/src/App.jsx` — the `Placeholder` text (`kol-helper-12` on a sentence → `kol-mono-12 text-meta`), the Case's "No rows yet. Add one from the bar below." (→ `kol-mono-12 text-fg-32`), "Empty 3U row" stays a label; every other `kol-helper-*` in studio-hub, StudioCreate and HubHome checked the same way.
- New gate `scripts/validate-helper-text.mjs` (`pnpm validate:helper-text`, in `validate-all.mjs` after `views`): over `packages/*/src`, `apps/*/src`, `showcase/src/{pages,lib,nav,previews}` JSX, H1 — an element whose literal `className` carries `kol-helper-*` and whose direct literal text has five or more words, or contains `. `, or ends with a period, fails with file:line; H2 — `kol-helper-*` beside `whitespace-normal`, `line-clamp-*` or `text-wrap` fails. Literal text only; the law is cited in the header (01-foundations/03-typography.md:29). Self-test like validate-props has.
- **Acceptance:** the gate fails on the old placeholder line and passes after the fix; `pnpm validate` carries it and is clean.

### 7.6 — New and Walkthrough as one round action button on desktop Home — TALK (user 2026-10-23, *"for another session"*)
- His reference is apps/catalog's `VariantsButton`: not a component — the DS `Button` as `iconOnly size="lg" tone="inverted" radius="full"` with `--kol-shadow-lg`, fixed at the page's top-right, opening a `PopoverPanel`. The idea: Home's foot row (New, Walkthrough) folded into one such button, multi-purpose; what it opens (a menu of the two, or New direct and Walkthrough in a menu) is his call.
- Nothing built. Opens when he says so.

### 7.7 — The phone nav as the mobile shape of the whole design system, media first — PARKED (user 2026-10-23, *"for later"*)
- *"continue with the phone nav and expand the concept into mobile kol-ds ui. starting with media which would be primed for such a sync/alignment."* The folded pill, the sheet beside the ×, the 44px rows with 22px glyphs, the card's chrome — today they are `PhoneNav` and `TabsRow` in a Hub. The next step is the same vocabulary across every surface a phone draws, and the media surfaces are the first: the picker, the explorer, the row menus (`···`), the crumb row and the search well, aligned to one set of phone rules instead of each page's own.
- Nothing built. Opens when he says so; the first session reads r2b2 on a phone beside studio-hub's picker and names the deltas as points.

## Not in this plan
- fxr, mirror and monitor adopting any of it (after his sign-off and the publish, as before).
- A fourth settings tier, or a settings page layout beyond two columns.
- `rack-hub`'s shell on `AppStudio` and the mixer's third canvas copy (carried from plan-2026-10-23-canvas-family-and-studio-hub.md). rack-hub's stage (`apps/rack-hub/src/stage/usePanZoom.js`) is that copy too: it kept its own `useTouchGestures.js` on 2026-10-23 so the app boots; it moves to `useCanvasViewport` with the rest.
