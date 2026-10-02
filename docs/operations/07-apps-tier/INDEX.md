---
title: Apps tier
type: index
status: active
created: 2026-09-21
updated: 2026-09-29
description: Products proved as real apps before publishing
tags:
  - domain/workflow
  - pattern/workflow
  - audience/agency-internal
related:
  - "[[../INDEX|Operations]]"
---

# Apps tier

**The concept is written once, in dotfiles: `~/.dotfiles/docs/operations/systems/apps-tier/INDEX.md`. Read that first — it holds the why, the three-tier table, the data rule and the shared-shell rule. Nothing on this shelf restates it.**

What lives here is this repo's depth: which app is being built, in what order, and which are queued behind it.

| Page | What it holds |
|---|---|
| [[01-tier-rules\|Tier rules]] | How an app is wired here — shape, publishing, ownership, data, gotchas. Outlives any one app |
| [[02-media-app-plan\|Media app plan]] | The first app — phases, acceptance, and the one decision still held |
| [[03-candidate-apps\|Candidate apps]] | The roster the tier will absorb, one at a time. Only media is committed |

## The apps

**Naming (ruling D2, 2026-09-29):** `apps/<tool>` is the tool alone · `apps/<tool>-hub` is Shell + Hub + the same tool · `apps/shell` is the Shell alone · `apps/hub` is Shell + Hub around a placeholder · `apps/catalog` is the Catalog alone. `media-shell` became `media-hub` (the old URL 301s) and the old `apps/shell` (which was Shell + Hub) became `apps/hub`. The showcase's `/apps` groups every app by layer and gives each a home at `/app/<name>` — the spec there and this table say the same thing.

| Workspace | Runs on | What it is |
|---|---|---|
| `apps/media` | `pnpm media` · `/apps/media` | the media tool alone |
| `apps/media-hub` | `pnpm media-hub` (5175) · `/apps/media-hub` | the same tool on kol-shell's `AppHub` — Browse at `/` and Settings, nothing else (2026-09-29: Library, Notes, Decks and Brand left — notes/decks/brand are their own apps). No Home; one settings place (the tool's gear hands over through `onOpenSettings`); the phone bar |
| `apps/notes` | `pnpm notes` (5177) · `/apps/notes` | the notes tool alone — kol-notes over the fixture's fake D1 `notes` table, through media-fixture's `useNotesTool`. Opens on a blank note (`NEW_NOTE`); the list is `#list` |
| `apps/notes-hub` | `pnpm notes-hub` (5187) · `/apps/notes-hub` | Shell + Hub + notes — Write (a blank note, `/`) and Notes (`/notes`) on one rail |
| `apps/presentation` | `pnpm presentation` (5178) · `/apps/presentation` | the decks tool alone — kol-deck over the fake D1 `decks` table, through `useDecksTool`; exports PNG · PDF · PPTX · `.deck.json`. Opens on a blank deck (`NEW_DECK`); the shelf is `#list` |
| `apps/presentation-hub` | `pnpm presentation-hub` (5188) · `/apps/presentation-hub` | Shell + Hub + decks — Edit (a blank deck, `/`) and Decks (`/decks`) on one rail |
| `apps/brand` | `pnpm brand` (5179) · `/apps/brand` | **the brand catalogue** (2026-09-29) — every building block a brand is made of, one route each, on VOYAGER: color (ramps · swatches · anchors · combinations), type (families · scale), logo (displays · clearspace · scaling), stationery (business card · set), assets (downloads · imagery · business data). kol-framework's `PageLayout` is its frame, so the brand-book frame is proved here too. Real paths under the Vite base |
| `apps/brand-hub` | `pnpm brand-hub` (5193) · `/apps/brand-hub` | **a client's home on VOYAGER** — what `apps/brand` showed until 2026-09-29: kol-styleguide's `Brand` (the book at `/`, the assets at `/assets`) on `AppHub`, with notes · decks · media as opt-in tools and the editor as an opt-in app, switched in Settings (per browser). What a `brand.<domain>` site is made of |
| `apps/shell` | `pnpm shell` (5186) · `/apps/shell` | the Shell alone — `AppShell` around ten placeholder pages, so the phone bar's More overflow is always on screen |
| `apps/hub` | `pnpm hub` (5176) · `/apps/hub` | the Hub alone around a placeholder tool — Home, Settings, the `S` sheet, the walkthrough |
| `apps/studio` | `pnpm studio` (5190) · `/apps/studio` | the Studio alone around placeholder pages — kol-shell's `AppStudio`: Home · Library · Create · Use · Stage (opt-in) · Settings, mono; the workstation fxr · mirror · monitor hand-build |
| `apps/catalog` | `pnpm catalog` (5189) · `/apps/catalog` | the Catalog alone — `CatalogPage` on the kol-search engine, with the masthead option (DISPLAY · MONO) |
| `apps/editor` | `pnpm editor` (5180) · `/apps/editor` | the design editor alone — `@kolkrabbi/design-editor` read from its **source** (a Vite alias, since the package's exports point at `dist/`) — and **every chrome it exports on one rail** (2026-09-29): `/` the editor · `/labs` · `/randomiser` (Generator + Effects) · `/core` (no packs, a full load) · `/output` (no rail); a phone at `/` lands on the randomiser. All of them browse the fixture bucket and keep preferences in the fake D1's `tool_settings` row, set once through `setMediaClient` / `setSettingsStore` |
| `apps/panels` | `pnpm panels` (5191) · `/apps/panels` | parameter panels alone — design-editor's own `AutoControls` + `BindDot` over its own schemas (every effect, every generator preset, the four layer schemas), read from its source under the `design-editor-src/` alias. Each panel renders as the rail (inline rows) and as the inspector (label above); stacked at phone width. No stage, no engine — a panel bug shows without an image in the way |
| `apps/voyager-fixture` | — (imported) | VOYAGER, the fake client: its files carried from `_tmp/kol-client` (7 marks · 7 stationery · 7 deck · 10 diagrams · 41 graphics · 4 mood · Playfair's two variable files — anything over 2 MB as a 1600px JPEG render, 9.7 MB in all), a manifest in kol-brand's shape (`VOYAGER_BRAND` + `VOYAGER_LOGO_SOURCES`, so kol-styleguide's `Brand` renders it) and invented business data in the client sites' shape (`BRAND_INFO` · `BIO` · `TIMELINE` · … · `OPEN_QUESTIONS`, every link on `.example`). `node src/fixture.test.mjs` checks both |
| `apps/fixtures` | `pnpm fixtures` (5192) · `/apps/fixtures` | every fixture on one page — media · workshop · voyager behind a dropdown, what each holds shown as data (`#<fixture>/<view>`) |
| `apps/controls` | `pnpm controls` (5181) · `/apps/controls` | the controls reference — kol-hardware's parametric set (incl. `EnvelopeGenerator`), kol-component's app controls and panel formats, and the compositions consumers build (module front, mixer channel front/back, params rail, editor parts), each specimen listing where the same thing is still hand-built. Reference only, nothing wired; the page in the hash (`#app`, `#compositions`) |
| `apps/curves` | `pnpm curves` (5182) · `/apps/curves` | the envelope generator alone — kol-hardware's `EnvelopeGenerator` (equation \| ADSR) over the one signal engine (`@kolkrabbi/kol-hardware/signal`), and its `SignalReference` as a panel, popover or sheet, picked from the masthead's Reference dropdown |
| `apps/rack` | `pnpm rack` (5194) · `/apps/rack` | the rack test bed (2026-10-02) — kol-hardware's `RackCase` with a 3U and a 1U row, modules with headers, labeled controls in both heights, and the touch hold (`onHold`) that opens `ParamSheet`. No audio, no routing. The showcase's Rack set mounts its entry file |
| `apps/mixer` | `pnpm mixer` (5195) · `/apps/mixer` | the mixer test bed (2026-10-02) — a row of `ChannelStrip`s with their knobs and sliders and the same touch hold. No audio, no routing. The showcase's Mixer set mounts its entry file |
| `apps/workshop` | `pnpm workshop` (5183) · `/apps/workshop` | kol-workshop's shell alone over `workshop-fixture`, built to the space table — per-space rails, index roots, the search page, settings, the `S` sheet. Every shell change is built and judged here before the showcase takes it (plan-2026-09-28-showcase-refinement) |
| `apps/markdown` | `pnpm markdown` (5184) · `/apps/markdown` | kol-markdown alone — a fixture doc or your own text beside what the engine reads: rendered · frontmatter and its round-trip · structure · tags · inventory · corpus counts |
| `apps/search` | `pnpm search-app` (5185) · `/apps/search` | every search surface — the ⌘K search modal, the results page (the query, how it was read, results with their reasons, facets), `/` focus, and RESULTS · GRAPH (the index's tags as a network, kol-search `tagGraph`). `pnpm search` is pnpm's own registry search, hence the name |
| `apps/workshop-fixture` | — (private package) | the invented corpus the three apps above share: 19 markdown docs with frontmatter across documentation · operations · development, 24 components, 3 blocks, 2 sets, the showcase's spaces — built into the vault tree, the component tree and kol-search items |
| `apps/media-fixture` | — (private package) | the imagined olina setup both apps run on: a fake bucket (`bucket.js`) and a fake D1 (`d1.js`), the client over them, and `useFixtureMedia` — the wiring both apps share so neither grows a copy |

A media feature ships in the DS and shows in `apps/media`; `apps/media-hub` adds only the Shell and Hub around it. `apps/shell` and `apps/hub` are the references those layers are judged against.

**Checked by rendering, not only by reading (2026-09-29):** `pnpm validate:render` serves every app here, opens its routes at 1440 and 390, and fails on a row of controls at two heights (R1), overlapping controls (R2), settings dropdowns at two tones (R3) or a page that throws (R0). Required before a publish.

**Nothing hidden (2026-09-29):** `pnpm validate:views` (in `pnpm validate`) fails on a view a package exports — a name ending View · Page · Screen · Layout · Editor · Library · Explorer · Dashboard · Book · Hub · Shell · Studio — that no app and no showcase page renders, directly or through a parent. design-editor's `LabsView` and `MobileView` went unmounted here for months; the bug that emptied their media picker had no page to show up on. Packages with no app of their own yet — kol-dashboards · kol-chess · kol-content · kol-foundry · kol-store — are reached through showcase pages and go to the showcase review.

**Save to home screen:** the tool apps carry a web manifest (`public/apps/<name>.webmanifest`, `display: standalone`) and the Apple meta tags. A consumer repo that wants the same sets both — each app's home in the showcase says so.

Build order came in as a ticket: `lobby/inbox/apps-tier-media-first.md`.
