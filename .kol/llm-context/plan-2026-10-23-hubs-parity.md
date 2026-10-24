# Plan — the three hubs match studio-hub, checked against the live siblings

**Raised:** 2026-10-23, his review of editor-hub · mixer-hub · rack-hub after my "all three carry studio-hub" report. Points verbatim: *"3 purple? should these not share the same dev favicon that the repos have?"* · *"why is there a new file in library in fxr? wrong card type and probably not using preset 'file'"* · *"monitor new file in library??? wrong card type, both grid and row"* · *"not called hall of mirrors, but mirror"* · *"WRONG card preset button"* (mirror's Library) · *"none but studio-hub uses the agreed upon siderail"* · *"mirror has both different user login icon and the only one with a dev page in the rail"* · *"still no chrome tab in FXR??? its the odd one out"* · *"those 3 repos literally are siblings of DS, they are in this TMUX session, each have @peer active agents"* · *"surely we documented kol-studio, make a checklist"*.
**Status:** built 2026-10-23, every phase — the pass green on the four apps (28 · 28 · 29 · 30 rows), the pairs compared. Open: nothing.
**Shape:** W › phase › list.
**Laws carried:** studio-hub is the reference and the only review surface for the Hub's shape; a hub's own truths (name, subtitle, favicon, pages, keys) come from its sibling repo, read live, never guessed; Home and Library are HubHome / CatalogPage `preset="app"`, files only, no foot row; the rail is kol-component's NavRail, `railSections: 'enter'`, sections as `sub`, Media · Sign in · Settings at the foot.
**How a phase closes:** acceptance line first, gates green, then Playwright against his own words — and a screenshot of the hub beside studio-hub's same page, looked at, before anything is reported.

## W1 — The checklist

### 1.1 — The Studio parity checklist, written down (P1) — ✅ built 2026-10-23
- One doc, `docs/operations/07-apps-tier/08-studio-parity.md`: every element studio-hub has, as a row — identity (name, subtitle, favicon, title), the rail (component, sections, foot rows, no Dev), the phone nav (pill, folded More, the sheet; the bar hidden on a tool page that owns the bottom edge), Home (preset app, the masthead button, its sheet, no foot row), Library (preset app, files · parts views, no foot button, module pages under it), Media (the picker), Sign in (the prompt), Settings (tiers), S, ⌘K, ⌥-digits, the file rail (read, pencil, note).
- Each row names where studio-hub does it (file:line) and how the Playwright pass checks it. `_tmp/2026-10-23-review-3/parity.mjs` is that pass, one script, every hub, 1440 and 390, screenshots named per row.
- **Acceptance:** the doc exists with every row above; the script runs against studio-hub and passes every row there first.

### 1.2 — The siblings as the source (P1) — ✅ built 2026-10-23
- Before touching a hub, read its sibling's live wiring (kol-fxr `src/AppLayout.jsx`, kol-mirror `src/App.jsx`, kol-monitor `src/App.jsx`): APP name and subtitle, the rail items and sections, favicon, keys. Written into the checklist's per-hub column.
- Ask each sibling's live agent (SendMessage to the kol-fxr, kol-mirror, kol-monitor sessions) one question: anything ruled on their rail, Library or Home since their last bump that the DS does not have yet. Their answers go into the same column.
- **Acceptance:** the per-hub column is filled from the repo and the agent, with the file:line it came from.

## W2 — Identity

### 2.1 — Names and favicons from the siblings (P1) — ✅ built 2026-10-23
- editor-hub: `name: 'FXR'` (kol-fxr AppLayout.jsx:116) — not "Effexor FXR"; mixer-hub: `name: 'Mirror'` (kol-mirror App.jsx:41) — not "Hall of Mirrors"; rack-hub: Monitor. Subtitles from the same lines.
- Favicons: each hub links its sibling's own SVG (kol-fxr `public/favicon/favicon.svg`, kol-mirror `public/svg/favicon.svg`, kol-monitor `public/svg/favicon.svg`), copied into the hub's `public/`; the `<title>` is the app's name. The three stop sharing the DS tile.
- **Acceptance:** the tab shows each sibling's own mark; `document.title` and the masthead read FXR · Mirror · Monitor.

## W3 — The rail

### 3.1 — One rail, the agreed one (P1) — ✅ built 2026-10-23
- rack-hub drops `railComponent: RackRail` (the fork that widened the rail for the rack's module catalog); kol-monitor's current App decides where that catalog lives now and the hub follows it. `railSections: 'enter'` on all three.
- mixer-hub loses the Dev row (studio-hub has none; the sketchbooks stay reachable at `/dev` by URL only, or go — kol-mirror's current App decides). Its Sign in glyph is the DS's `user`: mixer's own icon set stops registering names the DS owns (the `05-user-authentication` group), so the Hub's foot rows draw as studio-hub's.
- The phone nav is studio-hub's pill on all three, with `barHiddenOn` for the tool page whose bottom edge belongs to the tool (`/studio` on mixer-hub, `/rack` and `/stage` on rack-hub) — mirror's ruling kept without the drawer.
- **Acceptance:** at 1440 the rail of each hub, screenshotted beside studio-hub's, is the same component with the same foot; at 390 the pill, the fold and the sheet; on the tool pages the bar is away.

### 3.2 — FXR's Chrome section (P1) — ✅ built 2026-10-23
- editor-hub's rail is Library · Chrome, Chrome a section that enters: Editor, Labs, Randomiser — the shape proposed for fxr in plan-2026-10-23-studio-hub-review-2 § 3.5 and shown on studio-hub's Chrome row. Labs' categories stay Labs' `sub`, so Chrome enters → Labs enters → the categories (the recursion ruled on 2026-10-23).
- The ⌥-digit order follows the rail (Home, Library, Chrome, Settings).
- **Acceptance:** the rail reads LIBRARY · CHROME; entering Chrome shows Editor, Labs, Randomiser as full rows with Back; entering Labs after a pick shows its categories.

## W4 — Library

### 4.1 — `preset: 'app'`, no foot button, on all three (P1) — ✅ built 2026-10-23
- editor-hub: Library is the Hub's CatalogPage over the same files Home lists (the saved presets, the seed when none), `preset: 'app'`, the file card — not fxr's placeholder LibraryPage, and no New File at the foot.
- rack-hub: Library is Patches (the presets as files, preset app) · Modules (the modules as studio-hub's part cards — title and preview, no subtitle line), no New Rack at the foot; a module's page and a patch's page stay under `/library/…`.
- mixer-hub: Library is Patches · Modules the same way, no Import at the foot (Import, if mirror keeps it, is a row in the masthead button's sheet, as New is).
- **Acceptance:** grid and list on each Library draw the `app` card and row, the same as studio-hub's Library FILES and PARTS; no button under the catalog; the module pages open from a card.

## W5 — Verification

### 5.1 — The pass, and the look (P1) — ✅ built 2026-10-23
- `parity.mjs` on all four apps; every row green. Then every screenshot pair (hub beside studio-hub, same page, 1440 and 390) opened and compared by me, row by row, before the report. Gates, render, playbook.
- **Acceptance:** no row differs from studio-hub except what the sibling repo rules for its own app, and each such difference is named in the report with its file:line.

## Not in this plan
- The siblings themselves (kol-fxr, kol-mirror, kol-monitor): reference only; they adopt the Hub after the publish.
