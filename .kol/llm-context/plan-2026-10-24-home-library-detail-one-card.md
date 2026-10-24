# Plan — Home is the user's saves, Library is what ships, one card and one detail page across fxr · mirror · monitor

**Raised:** 2026-10-24, the user's review of the three hubs after the Studio adoption, eighteen screenshots. Points verbatim: *"why are all the patches gone from monitor … library patches shows the same 5 as in home"* · *"wrong use of card, missing fields, missing trash icon. and the patch/module detail slug is messed up"* · *"why was this not designed for in apps/monitor-hub or rack-hub"* · *"what back is this"* · *"when pressing patch card from library IT DOES NOT JUST LOAD, it goes to the same PATCH detail slug, from where you can load if you want.... same slug type as module slug"* · mirror: *"these are expressions, NOT FX and not something to store in library. remove it"* · *"broken cards MISSING FIELDS AND ICONS"* (modules, grid and list) · *"what is this a patch? is camera a patch or a module? it has missing info"* · fxr: *"home empty? both recent and saved??? … library empty both … then all of a sudden 12 appeared … all bullshit names. NONE have any images, it should screenshot a frame of its output. but why is library empty???"* · the file rail: *"why is date and size not included in file info? same with upload image?"* · *"why is edit 32px icon when others are 26px??"* · and the ruling that frames it all: *"Home and library is not the same thing … home only has to show 3-4 files … home now would only show USER saved patches, which are different from LIBRARY saves, which are more like system saves. what app ships with."*
**Status:** built 2026-10-24 — the DS wave published (kol-theme 0.185.0 · kol-component 0.297.0 · kol-shell 0.78.0 → 0.78.1), the twins green on the extended pass, mirror and monitor through their three phases (92/92 each against studio-hub), fxr through its three phases (71/71, the shipped covers drawn on demand). Open: monitor's clock-started regeneration, the logs.
**Shape:** W › phase › list.
**Laws carried:** Home = the user's saves, Library = what the app ships with (2026-10-24); **every card has the same fields and icons** — title · meta · date · size · cover with download · cog · trash, on a user save, a shipped preset and a system module alike, no exceptions and never asked again (2026-10-24: *"EVERY CARD HAS THE SAME FIELDS AND ICONS … NON NEGOTIABLE"*); **a patch's cover is its OUTPUT** — a frame of what the patch renders, never a screenshot of the tool's or editor's UI (2026-10-24); the Hub draws every card from data, no JSX reaches a Hub surface (HubHomeContract); one card on Home and Library (CatalogAppVariant); the Hub's Dev row on every rail (2026-10-24); icons take `oq-*` never `fg-*`; copy verbatim; `_tmp/`, never `rm`; the orchestrator's step message is the user's go, only the repos he named (fxr · mirror · monitor), one step per message against the twin.
**How a phase closes:** acceptance line first, gates green, then Playwright against his own words — the reference-diff pass (`_tmp/2026-10-24-hubs-pass/pass-repos.mjs`) extended with the rows each phase adds, run from kol-ds-ui against task-scoped harness servers. DS phases ship from here first (one publish wave), then the three repos take their phases by step messages.

---

## W1 — Home is the user's saves, Library is what ships

### 1.1 — Monitor's Library lists the shipped patches (P: "why are all the patches gone from monitor") — ✅ built 2026-10-24 (kol-monitor phase 1)
- Library PATCHES = the shipped presets (`src/data/patches` — lineGen · smx3 · filmstrip · kaleidoscope · qvcaSynth · …, the list the Patch module's PRESET dropdown shows), never Home's saves. Home stays the library's saves (init · morph · trail-spin · raster · slit-echo).
- A shipped patch on the one card with every field and icon: title, date (the preset's stamp), size, cover = the patch's OUTPUT frame (1.6), download (the JSON), cog (the rail: tags · Modules · Connections), trash; rename · duplicate · delete write the device's library like a save does (a shipped preset the user deletes leaves his Library; nothing in the app's data changes). Type · Tags filters as before.
- A card click opens `/library/patch/<name>` (3.2), never the rack. The Load into the rack is that page's action.
- Acceptance: Library PATCHES shows every shipped preset by name with its preview; Home shows only saves; the two lists share no entry unless a save was made from a preset; clicking a patch lands on its detail page.

### 1.2 — Mirror's Library lists the shipped patches, the FX view leaves (P: "these are expressions, NOT FX") — ✅ built 2026-10-24 (kol-mirror phase 1)
- The FX view and the saved expressions leave the Library (they are the studio's Expressions tab); views are PATCHES · MODULES.
- Library PATCHES = the shipped presets (`useLibrary('patch')` where `preset`) and the registry's one-tap patches (`kind: 'Patch'` — Slit-Scan Camera and its kin), on the one card with every field and icon: title, meta = `detail` ("Live Input → Slitscan"), date, size, cover = the patch's OUTPUT frame (1.6), download, cog (kind · tags in the rail), trash; rename · duplicate · delete write the device's library for a shipped preset and a registry patch alike (a deleted one leaves his Library; the registry is untouched).
- Home stays the user's saved patches (the three starters seeded signed-out, per 2026-10-24 — his to confirm in 1.5's TALK if he wants them in Library instead).
- A card click opens `/library/patch/<id>` (3.2).
- Acceptance: no FX chip; PATCHES lists every shipped preset and registry patch with meta and cover; "Slit-Scan Camera" reads as a patch (kind · detail · tags) with no empty fields; clicking lands on the detail page.

### 1.3 — FXR's Home follows the library (P: "home empty … then all of a sudden 12 appeared") — ✅ built 2026-10-24 (kol-fxr phase 1; the restore merge was the real cause)
- Home reads `loadLibrary()` once per render; the cloud sync writes the library after load, so Home drew nothing until a verb ticked it. Home subscribes to the library's change seam (the `storage` event and the sync's own notify) and re-renders on it — RECENT and SAVED fill the moment the sync lands.
- Acceptance: a fresh signed-in load shows RECENT (the 12 newest) and SAVED without any click; signing in from an empty Home fills it without a reload.

### 1.4 — FXR's files get their picture (P: "NONE have any images, it should screenshot a frame of its output") — ✅ built 2026-10-24 (kol-fxr phase 3, `FileCover`: the pass 71/71 against studio-hub from here; user 2026-10-24: *"it does not need to make thumbnails for all those"* · *"quantise and reuse"* — no mass render: a shipped file's frame is drawn on demand, one per distinct preset at one size, cached by that key and reused by every file that points at it; the user's saves keep their captured thumb)
- Every preset without `thumb` gets one: a backfill that opens each file in its chrome headless, captures one frame (the editor's own `captureThumb`), writes `thumb` back through the library (local and, signed in, the sync). Runs once per device on load for files lacking a thumb, throttled; new saves already capture.
- The names stay the user's ("Plan08 Editor copy", "Morph W 1791…" are his test saves) — a name is never rewritten by the app.
- Acceptance: no file card shows the placeholder; each cover is a frame of that file's output; the backfill never touches a file that has a thumb.

### 1.6 — Every patch cover is the patch's OUTPUT (P: "each repo should also always use output of patch NOT UI of tool or editor") — ✅ mirror 2026-10-24 (the composited frame; the camera patch over the canonical still) · ✅ monitor 2026-10-24 (the Output/Monitor canvas with the modules powered: 39 of 41 lit, 70s and smx3 stay dark, `empty` a blank frame) · ✅ fxr 2026-10-24 (`FileCover` — the engine's own frame, on demand per preset, never a stored data URL)
- Monitor: `/previews/patches/<name>.png` are screenshots of the rack — wrong. The preview generator captures the patch's output (the Output / Monitor module's display, full frame) for every shipped preset; a save's cover is the same capture at save time.
- Mirror: a cover is the composited output frame (what the Monitor module shows), for a save (`thumb`, captured at save — already the frame since 2026-10-15), a shipped preset (`generate-patch-thumbs` re-run on the output, not the desk) and a registry patch (captured once through `/dev/capture`, never the glyph placeholder).
- FXR: 1.4's capture is the rendered frame of the file, never the editor chrome.
- Acceptance: no patch cover anywhere shows rails, knobs, panels or editor chrome — a frame of the signal only; the Playwright row compares each cover's pixels against the app's own output capture of that patch.

### 1.5 — FXR's Library is its shipped presets, generated where missing (P: "each category in labs IS A CATEGORY, GENERATE/SCANLINE has 5 PRESETS … THESE ARE ALL SAVED PRESETS IN LABS … Randomiser also has presets … MORPH just needs to generate 10 presets … EDITOR, just save 10 EDITOR FILES … GENERATE THE MISSING CONTENT") — ✅ built 2026-10-24 (1,137 files: LABS 566 · RANDOMISER 551 · MORPH 10 · EDITOR 10)
- Library = every preset the app ships, as files, by chrome: **Labs** — every preset of every category and type (Effects: Halftone · Scanline · CRT · Refraction · FX Rack · Dither; Generative: Scanline · Pattern · Loops · Math · Penrose · Flow · Letter Gap · Drift · Gradients · Soft Forms · Soft Forms 3D · 3D Scene; Vector; Composition — e.g. Generative › Scanline › Spaced: Drift · Fine · Coarse · Waves · Columns), read off the labs catalog's own preset tables, one file each, opening in Labs with that preset applied. **Randomiser** — its Preset pool (the same tables; a Randomiser file records the pick), one file each. **Morph** — ten morph files generated by the app (two labs presets per file as its steps), saved as Morph files. **Editor** — ten editor files made by the app: preset files, type files, logo files, vector forms, built from the editor's own layer kinds and saved as Editor files.
- They are shipped content: written once into the library's `preset` slot with `shipped: true` on first load (the seed the other two apps have), on the one card with every field and icon, the chrome mark in the cover's corner, covers = the rendered output (1.6, generated with them). Library's view strip = the chromes: EDITOR · LABS · RANDOMISER · MORPH (the Type · Palettes · Patterns slots list under their chrome's file as its parts in the rail, not as views).
- A card click opens `/library/<chrome>/<id>` (3.2); its page carries Open (in the chrome) first.
- Acceptance: a fresh install's Library lists every labs and randomiser preset by its catalog name under its chrome, ten morph files and ten editor files, every one with an output cover and every field and icon; Home stays the user's saves only; the counts match the catalog tables.

## W2 — The one card carries its fields, on the card and in its rail

### 2.1 — The file rail shows Date and Size, and its pencil is the rows' size (P: "why is date and size not included in file info?" · "why is edit 32px icon when others are 26px??") — DS, kol-component — ✅ built 2026-10-24 (kol-component 0.297.0)
- `AppItemMenuProvider`'s rail: Details gains `Date` and `Size` rows from the item's `date` and `size` (the same values the card prints), above the consumer's `details`.
- The header's pencil is `IconFrame size="sm"` (26) like the close and the row controls, not `md` (32).
- Acceptance: the rail of any file shows Date · Size under Details; the pencil's box measures 26 × 26 beside the 26 × 26 close.

### 2.2 — Upload image: the cover is settable from the rail (P: "same with upload image?") — DS, kol-component + kol-shell — ✅ built 2026-10-24 (kol-component 0.297.0 · kol-shell 0.78.0)
- `HubHome` and the file card take `onCover(file, dataUrl)`; the rail's edit mode shows a `Cover` row with "Upload image" (the DS file picker → a resized webp data URL), and the card's cover updates. A consumer that passes no `onCover` sees no row.
- mirror passes `setThumb`; fxr the library's `thumb` write; monitor writes the save's `thumb` (a new field on a save, drawn before the preset preview).
- Acceptance: in edit mode the rail offers Upload image; picking a file changes the card's cover on Home and Library and survives a reload.

### 2.3 — Every card has the same fields and icons — modules included (P: "wrong use of card, missing fields, missing trash icon" · "broken cards MISSING FIELDS AND ICONS") — ✅ built 2026-10-24 (twins, mirror, monitor, fxr; Insert in the cover's corner, the cog on Create with kol-shell 0.78.1)
- There is no part card. A module on Library MODULES, on Create's parts, in the twins' PARTS, is THE card: title, date (the module's registry stamp or the app's build date), size (its definition's JSON), cover (the module front, contained), download (its definition as JSON), cog (the rail's Details: monitor `Category · Width · Height`, mirror `kind · group · detail`, tags), trash. No summary line on the card — his 2026-10-23 ruling stands: the card is title · date · size, a file's information is Details in the rail. The row carries the same.
- The verbs on a module write the device's library like every other item: rename gives it the user's name, duplicate a copy, delete removes it from his Library (the registry is untouched). `fileCard` is the one mapping; the twins' `partCard` is retired to it (rack-hub, mixer-hub, studio-hub's PARTS, editor-hub).
- Acceptance: on every list in every app, every card and row shows title · meta · date · size, a cover with its download, the cog and the trash — the pass's `card` row fails on any card missing one.

### 2.4 — struck 2026-10-24
- Was "download and trash on a system module — TALK". Ruled the same day: every card has the same fields and icons, non-negotiable; 2.3 carries it.

## W3 — The detail page is the Studio's

### 3.1 — `StudioDetail` in kol-shell, built in the twins (P: "why was this not designed for in rack-hub" · "what back is this") — ✅ built 2026-10-24 (kol-shell 0.78.0)
- One scaffold for a module's or a patch's page: the masthead (`SectionText level="app"`, title · subtitle) with the back as a text link `‹ Back` in the eyebrow — never a pill, never a `Button`; the prose column (Description · Controls table · Specifications · Code fold with "View full source") and the preview column; the bottom actions as data `[{ label, onClick }]` (Insert · Load · Code), drawn by the scaffold as DS Buttons.
- Built in `apps/rack-hub` (module and patch pages) and `apps/mixer-hub` (module and patch pages) from the apps' data, so the twins have it before any repo adopts; `ModuleDetailPage` / `PatchDetailPage` there become data over `StudioDetail`.
- Acceptance: the two twins' detail pages render through `StudioDetail` with the text back link; the pass gains a `library.detail` row diffing the page's class tree against studio-hub's own detail page (studio-hub gets one for a PART).

### 3.2 — One slug scheme: `/library/module/<id>` and `/library/patch/<id>` (P: "the patch/module detail slug is messed up … same slug type as module slug") — ✅ built 2026-10-24 (twins and the three repos)
- Every app: a module card opens `/library/module/<id>`, a patch card opens `/library/patch/<id>`; the old `/library/<id>` redirects to the module page so nothing breaks.
- A patch card never loads the patch on click; its detail page carries Load (monitor: into the rack · mirror: into the studio) as the first action.
- Acceptance: both slugs resolve in all three apps; a patch click from Library lands on the detail page; Load on that page does what the click used to.

### 3.3 — Monitor and mirror adopt `StudioDetail` — ✅ built 2026-10-24
- Their `ModuleDetailPage` and `PatchDetailPage` (mirror gets a patch page) become data over `StudioDetail`, by step messages against the twins; the local Back button and the bottom Button rows go.
- Acceptance: the pass's `library.detail` row green against studio-hub in both; the Back is the text link; Insert · Load · Code work.

### 3.4 — FXR's detail page — ✅ built 2026-10-24 (`/library/<chrome>/<id>`)
- Every shipped and saved file gets its page on `StudioDetail` at `/library/<chrome>/<id>`: the output cover as the preview, the file's parts (type · palette · pattern · layers · aspect · the morph's steps) as the prose column, actions Open (in its chrome) · Download · Duplicate.
- Acceptance: the pass's `library.detail` row green for fxr; Open lands in the right chrome with the file loaded.

## W4 — The twins and the pass carry it, so the next adoption needs no song and dance

### 4.1 — Twins and reference — ✅ built 2026-10-24
- `apps/rack-hub` · `apps/mixer-hub` · `apps/editor-hub` · `apps/studio-hub`: Library = what ships (rack-hub: the presets; mixer-hub: the presets and registry patches; editor-hub: per 1.5; studio-hub: its PARTS with meta), Home = the saves; detail pages on `StudioDetail`; the part card with meta.
- `06-studio-adoption.md` step 4 rewritten (Library is the shipped content, never Home's files; the slug scheme; the detail page); `16-app-anatomy.md` Home vs Library stated as law.

### 4.2 — The pass — ✅ built 2026-10-24 (cover.output is read by each repo's report, not a pixel row)
- `pass-repos.mjs` gains: `library.files` reads the shipped list (count ≥ the app's preset count, no entry shared with Home unless derived), `*.card` on every list requires title · meta · date · size · download · cog · trash (2.3), `cover.output` compares each patch cover to the app's output capture (1.6), `library.detail` (3.1), `rail.details` has Date · Size (2.1), `rail.pencil` 26 × 26.
- Acceptance: all three repos green on the extended pass; the DS twins green against studio-hub.

---

## Order

1. DS first, one wave: 2.1 · 2.2 · 3.1 (kol-component, kol-shell) with 4.1's twins and 4.2's pass rows — published together.
2. Monitor: 1.1 → 1.6 → 2.3 → 3.2 → 3.3 (one step message per phase).
3. Mirror: 1.2 → 1.6 → 2.3 → 3.2 → 3.3.
4. FXR: 1.3 → 1.5 (the shipped content, generated) → 1.4 and 1.6 (covers) → 2.3 → 3.2 → 3.4.
