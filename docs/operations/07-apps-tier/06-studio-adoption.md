---
title: Studio adoption
type: playbook
status: active
created: 2026-10-24
updated: 2026-10-24
audience: internal
description: Adopting the Studio in a sibling repo, step by step
tags:
  - domain/workflow
  - audience/agency-internal
  - pattern/workflow
aliases:
  - studio-adoption
related:
  - "[[INDEX|Apps tier]]"
  - "[[05-studio-parity|Studio parity]]"
  - "[[../../documentation/04-compositions/16-app-anatomy|App anatomy]]"
  - "[[../../documentation/04-compositions/17-settings|Settings]]"
---

# Studio adoption

How a sibling repo — kol-fxr, kol-mirror, kol-monitor — takes the Studio as the DS ships it after 2026-10-24, so its Home, Library, Create, settings rail and walkthrough are studio-hub's page for page. Run top to bottom in that repo's session. The worked examples are the in-tree hubs: `apps/editor-hub` (FXR), `apps/mixer-hub` (Mirror), `apps/rack-hub` (Monitor) — each file named below has its finished twin there, read it before writing yours. The pass in step 9 is the acceptance; nothing is adopted until it is green.

| Step | What it closes | The in-tree twin |
|---|---|---|
| 1 | the bump | — |
| 2 | the rail rows | `apps/editor-hub/src/AppLayout.jsx` CHROME_ROWS |
| 3 | Home as a data contract with every verb | `apps/rack-hub/src/pages/HomePage.jsx` useHome |
| 4 | Library on the same card, opening on the files | `apps/mixer-hub/src/App.jsx` LibrarySheet |
| 5 | Create on StudioCreate | `apps/rack-hub/src/pages/CreatePage.jsx` · `apps/mixer-hub/src/pages/CreatePage.jsx` |
| 6 | the settings rail as typed rows | `apps/mixer-hub/src/pages/SettingsPage.jsx` · `apps/editor-hub/src/AppLayout.jsx` useSettings |
| 7 | the walkthrough and About as data | `apps/rack-hub/src/pages/HomePage.jsx` · `apps/rack-hub/src/pages/SettingsPage.jsx` |
| 8 | what leaves: the toggle prop, colliding glyphs, the redirect | — |
| 9 | the pass against studio-hub | `_tmp/2026-10-24-hubs-pass/pass.mjs` |

## 0. Prerequisites

- The DS wave is live on the registry: `@kolkrabbi/kol-component` ≥0.296.0, `@kolkrabbi/kol-shell` ≥0.77.0, `@kolkrabbi/kol-icons` ≥0.45.0, `@kolkrabbi/kol-theme` ≥0.184.0, `@kolkrabbi/kol-framework` ≥0.53.0. Check with `curl -s https://registry.npmjs.org/@kolkrabbi/kol-shell | jq .\"dist-tags\"`.
- kol-ds-ui checked out beside the repo (`~/dev/projects/kol-ds-ui`) for the twins and the pass, with `pnpm hubs` able to run — studio-hub is the reference the pass opens.
- The repo's own rulings, read first: FXR keeps `navKeys: false` for its chromes' keys and its chromes own the phone's bottom edge; Mirror's Patch table and Clear are Create's bar actions, its modules draw through `ModuleMedia`; Monitor's HP is Create's third bar action, its module catalog sits in the rail's slot. Everything else is studio-hub's.

## 1. Bump

```
/bump
```

Then `/scan` reads clean. kol-shell now peers on kol-framework (it draws the theme toggle itself) — a repo without `@kolkrabbi/kol-framework` installs it.

## 2. The rail

The rail is `AppStudio`'s `NavRail preset="app"` — pass nothing about it. Its rows are the Studio's order: Library · Create · the tool · the app's pages, Media · Sign in · Settings pinned at the foot.

- FXR (`src/AppLayout.jsx`): Library · Editor · Labs · Randomiser · Morph, as fxr.kolkrabbi.io has them. No Chrome section, no Chrome page. Labs carries its five categories at Home — read the shape off `buildLabsCatalog` with no layer and no handlers, as `useLabsRows` in the twin does — so Labs enters and Effects expands before any pick; a pick pressed before labs is mounted opens `/labs` and runs when `railExtras` publishes its dispatch (`pendingPick`).
- Mirror (`src/App.jsx`): Library · Create · Studio.
- Monitor (`src/App.jsx`): Library · Create · Rack · Stage.
- All three: `shell={{ touch: 'drawer' }}` leaves — the pill is the preset's phone shape.
- **All three keep the Hub's Dev row** (user 2026-10-24: *"they should all have dev tab in the rail, visible only on localhost. its a feature from the hub, even if there is nothing there, IT HAS TO BE IN THE RAIL ON DEV SERVERS — its not optional"*): `dev={{ tabs }}` stays on `AppStudio`, with an empty `tabs` when the app has nothing to show; the Hub itself draws the row only on a dev server (`import.meta.env.DEV`). This step's first version said the Dev row leaves — that was wrong and cost mirror and monitor a round trip.

## 3. Home is a data contract, every verb

`home` is `HubHome`'s data: `files`, `onOpen`, `onDownload`, `onRename`, `onDuplicate`, `onRemove`, `onTags`, `onNote`, `filterGroups`, `action`. No `toCard`, no `preset`, no `rowVariant`, no `listLayout`, no `filtersTitle`, no `filtersProps` — the Hub warns on each and draws nothing from it.

- A file is `{ id, name, updatedAt (ms), bytes, cover (src | node), tags?, note?, mark?, details? }`. Pass `bytes`; the three `new Blob([JSON.stringify(x)]).size` counts go.
- Every verb, over the app's own state. FXR: `renameStored` · `duplicateStored` · `removeStored` on the library (`src/AppLayout.jsx:330`). Mirror: the patch store for Duplicate, Delete and export; rename, tags and the note over local state until the store carries them (`src/pages/HomePage.jsx:119`). Monitor: the presets are read-only data, so the files are state seeded from them and every verb writes that state (`src/pages/HomePage.jsx:112`).
- Mirror's memory slots are not files — they leave Home for Library. Monitor's `.no-card-hover` block (`monitor-overrides.css:46-63`) and `fit: 'compact'` go.
- One `fileCard(f)` beside `home`, built from the same handlers, for step 4:

```js
const fileCard = (f) => ({
  key: f.id, title: f.name, date: f.updatedAt, size: f.bytes, media: f.cover, tags: f.tags, details: f.details, mark: f.mark,
  onTags: (tags) => home.onTags(f, tags), note: f.note, onNote: (note) => home.onNote(f, note),
  verbs: { rename: (name) => home.onRename(f, name), duplicate: () => home.onDuplicate(f), remove: () => home.onRemove(f) },
  download: () => home.onDownload(f), onClick: () => home.onOpen(f),
})
```

## 4. Library is what the app ships, on the one card

**Home is the user's saves; the Library is what the app ships** (user 2026-10-24 — this step's first version listed Home's files in the Library, which was wrong). `library` is the Hub's one `CatalogPage` on `preset: 'app'` over the SHIPPED content: Monitor — PATCHES (the shipped presets, `src/data/patches`) · MODULES (`MODULE_DEFS`); Mirror — PATCHES (the shipped presets and the registry's one-tap patches) · MODULES (the desk's units) — the FX view and the saved expressions leave (they are the studio's); FXR — EDITOR · LABS · RANDOMISER · MORPH (every labs and randomiser preset off the catalog tables, ten morph files, ten editor files — seeded into the library's `preset` slot with `shipped: true` on first load). The twins are the shape: `apps/rack-hub/src/pages/shipped.jsx`, `apps/mixer-hub/src/pages/shipped.jsx`, `apps/editor-hub/src/pages/Library.jsx`.

**There is no part card.** Every item — a save, a shipped preset, a module — is THE card with every field and icon: title · date · size · cover with download · cog (the rail: Date · Size · Details · tags · note · Files — the file's images, quicklook, remove, upload, the cover and back picked from them) · trash (*"EVERY CARD HAS THE SAME FIELDS AND ICONS … NON NEGOTIABLE"*). The verbs write the device's library (rename · duplicate · delete · tags · note · cover); the app's data is untouched. **A patch's cover is its rendered OUTPUT** — never a screenshot of the rack, the desk or the editor (step 4b).

The view state is `useState(…)` — never persisted; it lands on the patches. No foot button. A card click opens the item's page (step 4a), never the tool.

### 4a. The detail page — `StudioDetail`, one slug scheme

`/library/module/<id>` and `/library/patch/<id>` (FXR: `/library/<chrome>/<id>`) ride as `children` with a router; the old `/library/<id>` redirects to the module page. Each page is kol-shell's `StudioDetail` (≥0.78.0) from data — `back` (the text link, history back), `title` · `subtitle`, `description`, `sections` of rows, `code`, `preview` (the output image, or the rendered front), `actions` (Load · Insert · Add to Create · Open — DS Buttons) — the app's own `ModuleDetailPage` / `PatchDetailPage` become data over it; the local Back button, heading classes and button rows go. Twins: `apps/rack-hub/src/pages/{ModuleDetailPage,PatchDetailPage}.jsx`, `apps/mixer-hub/src/pages/{ModuleDetailPage,PatchDetailPage}.jsx`.

### 4b. Covers are the output

Monitor: the preview generator captures the Output / Monitor module's display for every shipped preset (the rack screenshots in `/previews/patches` go), a save's cover is the same capture at save time. Mirror: the composited frame — a save's `thumb`, `generate-patch-thumbs` re-run on the output for the presets, a capture per registry patch. FXR: a rendered frame per file (the backfill for files without `thumb`).

## 5. Create on StudioCreate

The page is kol-shell's `StudioCreate`, passed as `create={{ shell: false, bar: false, children: <CreatePage /> }}` — `shell: false` or the page sits inside a second shell, 96px narrower than the reference.

- `header` with `onTitleChange` / `onSubtitleChange` (the display masthead, the pencil in the filter row); `parts` · `partGroups` · `toCard` (the part card above); `onPlace` for Insert; `onPartPointerDown` for drag-to-place; `labels` (`CASE` / `MIXER`, `MODULES`, `All Modules`); `page` / `onPageChange` so Insert shows the case; `caseLink: { label, onClick }` — data, not a span.
- Monitor renders its viewport through `canvas={({ gridRef }) => <RackViewport gridRef={gridRef} … />}` with the zoom bridged (`onZoomChange` / `zoomSetterRef`); its row controls are the twin's Buttons under `caseControls`; Rows · HP · Case preview are `StudioCreateAction`s.
- Mirror draws its desk as `children` on the page's own canvas; Patch table · Case preview · Clear are its `StudioCreateAction`s.
- The repo's own CreatePage, its dialogs and grids go to `_tmp/<date>-create-on-studiocreate/`.

## 6. The settings rail, typed rows

`settings` is `{ sections, drawer: { onReset } }` and nothing else. The rail's tab row is the Hub's — Settings · Shortcuts · About · Docs, the links under About, Docs from `app.docs` `[{ label, paragraphs }]` (SettingsRailDocsTab, 2026-10-24) — so `tabs` leaves (Monitor's three were the Hub's; Mirror's Performance sections go under `sections` below Memory). `content` leaves: a sentence is a section's `note`, a text row is `{ label, value }`.

- A control is named, never rendered: `{ label, type: 'choice', options: [{ value, label }], value, onChange }` or `{ label, type: 'switch', on, onChange }`. A `render` row is refused on the rail. The detail of a dropdown option is the row's `hint`, not part of its label.
- FXR: the editor's `AppSettings.jsx` rows carry `render` closures — rewrite the six as typed rows over `useAppSettings` / `setAppSetting`, and `drawer.onReset` writes the store's defaults back (the twin's `useSettings`); the Theme row goes, the Hub's toggle is the one.
- Mirror: `drawer.onReset` is `resetQuality`. Monitor: no `onReset` yet — the Hub's reset still runs (the theme back to the system).

## 7. The walkthrough and About as data

- A step's Get started `actions` are `[{ label, onClick, icon? }]`; the Hub draws the DS Button and closes the walkthrough before each handler. The repo's own Button there goes.
- A step's image is `cover: '/images/…'`, drawn by the panel; an SVG drawing stays `illustration`.
- `app.about` is a string or an array of paragraphs — no `<p>`, no `<code>`.

## 8. What leaves

- `themeToggle` on `AppStudio` / `AppHub` — the Hub draws kol-framework's toggle itself; a passed value warns.
- Any `registerIcons` glyph whose name the DS set ships no longer resolves (kol-icons 0.45.0 warns per name) — rename the drawing or drop the file. Mirror's `refresh`, `settings-01`, `user`, `image`, `cloud` and the rest of the 97 collisions.
- FXR's `/` → `/randomiser` touch redirect (`src/AppLayout.jsx:308`) — a phone gets Home like the other two; New File opens the chooser on touch.
- Every local Button, Dropdown or class string that a Hub surface used to accept.

## 9. Verification

1. In kol-ds-ui: `pnpm hubs` (studio-hub on 5190) — the reference.
2. In the repo: its dev server on the network, and this repo's pass against it — copy `_tmp/2026-10-24-hubs-pass/pass.mjs`, add the repo as a target (`port`, `mode: 'path' | 'hash'`, `files`, `parts`, `labsPath`) and its allowlist with a `file:line` per ruled difference from step 0, then `node pass.mjs <repo>`.
3. Green means every row — the class tree with every datum stripped, the card and row boxes, the one-line date · size, the two corner boxes, the file rail's right edge, the settings rail's tabs, controls, toggle and reset, the walkthrough's button, the rail's one rule, the helper law, the phone — or an allowed, cited difference. Read the pairs in `shots/` beside `ref-*.png` before reporting.
4. `pnpm validate:render <app>` clean in kol-ds-ui's terms, or the repo's own render gate.
5. The receipt: close the DS's ticket on the registry version and the pass's numbers.
