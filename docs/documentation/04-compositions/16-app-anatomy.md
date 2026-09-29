---
title: App anatomy
type: reference
status: draft
created: 2026-09-26
updated: 2026-09-29
description: An app's six layers, engine to fixture
aliases:
  - app anatomy
  - shell catalog hub tool
  - hub
sources:
  - packages/shell/src/index.js
  - packages/shell/src/AppHub.jsx
  - packages/shell/src/HubHome.jsx
  - packages/shell/src/HubSettings.jsx
  - apps/hub/src/App.jsx
  - packages/shell/src/CatalogPage.jsx
  - packages/shell/src/SettingsScaffold.jsx
  - apps/media-hub/src/App.jsx
  - packages/shell/src/PageShell.jsx
  - apps/curves/src/App.jsx
tags:
  - domain/compositions
  - domain/architecture
  - audience/consumer
related:
  - "[[11-shell-system|shell system]]"
  - "[[../../operations/07-apps-tier/INDEX|apps tier]]"
---

# App anatomy

The vocabulary for talking about a KOL app (user ruling 2026-09-26). Four layers, each inside the one above it. **Status: draft** — the table was refined against the monitor, mirror and fxr code on 2026-09-26 and the Hub shipped as `AppHub`; it stays draft until `apps/hub` is reviewed.

| Layer | What it is | Lives in today |
|---|---|---|
| **Engine** | plain JS, no UI — parse, index, rank (ARCHITECTURE §3's engine tier). Its app is a lab, not a tool | `kol-markdown` · `kol-search` |
| **Shell** | the frame — the rail, the layout root, the navigation keys, **the phone bar**, **the app's one masthead** | `kol-shell` · `AppShell` + `NavRail` + `PhoneNav` |
| **Catalog** | the ContentFilters **page** — title row, filter and search (the kol-search engine), the view toggle (RECENT · SAVED), LIST · GRID, the cards, the action row under them. The whole page layout, not only the filters | `kol-shell` · `CatalogPage` |
| **Hub** | the standard pages around the work — Home (a Catalog), Settings, the shortcuts sheet, the walkthrough — and the keys that reach them. **Every page opt-in** | `kol-shell` · `AppHub` (parts: `HubHome` · `HubSettings`) |
| **Tool** | the work area itself — the rack, the editor, the media browser, the styleguide | each app's own; shared ones graduate to packages |
| **Fixture** | fake, mutable data and the wiring the apps share — no page of its own | `apps/media-fixture` · `apps/workshop-fixture` |

**An app is Shell + (Hub) + Tool, and a Hub's Home is a Catalog.** The Shell is not optional; the Hub is, page by page (2026-09-29: `home` and `settings` are opt-in on `AppHub` — no prop, no page, no rail row, no key). monitor is Shell + Hub + the rack; media-hub is Shell + Settings + the media tool, with no Home. `AppHub` is Shell + Hub in one call: the app describes itself and passes its tool as children.

**One app, one masthead (ruling D3, 2026-09-29).** `AppShell masthead` — **no default** (user, 2026-09-29: unset, every page keeps its own props, so a consumer's bump moves nothing) — `display` (the display voice, uppercase as a role, no description — MEDIA, CURVES) or `mono` (the mono title with its description) — is read by every page inside: `PageHeader`, the Hub's pages, `CatalogPage` and a tool's own title (`utilities/masthead.js` in kol-component). A Catalog with no Shell sets `header.masthead` itself. Before this, media-hub wore both voices, one per page.

**The phone bar (2026-09-29).** `AppShell touch="bar"` — `AppHub`'s default — takes the rail off below 768 and puts it in a bottom bar (kol-component's `MobileTabBar`): up to five destinations, else four + **More**, a sheet with the rest and Settings. The content column pads by `--kol-shell-bar-h` and `PageShell` subtracts it, so a full-height page ends above the bar. `touch="drawer"` (the hamburger) still exists; its fixed trigger sat over the masthead's controls, which is why the Hub left it.

## The Hub

Read off monitor, mirror and fxr (2026-09-26) — each assembled the same Hub by hand:

| Part | What all three did | The Hub's rule |
|---|---|---|
| Frame | the same `AppShell` props: Settings pinned bottom, kol-brand mark, `\`, `,`, `touch="drawer"`, `pageWash fg-02` | `AppHub`'s defaults (since 2026-09-29: `touch="bar"`, no `masthead` default, Settings only when `settings` is passed); anything else through `shell` |
| ⌥-digits | a local handler ×3 — `navKeys` missed the bottom rows | `navKeys` walks mark → items → bottom rows; on by default |
| Home | `CatalogPage` + mono masthead + RECENT · SAVED + a Walkthrough toggle + a Get-started step | `HubHome`: views RECENT · SAVED (caps, renamable), `items` may be `(view) => items`, walkthrough opt-in with its X inside the card, list = the file row stacked (brand's) |
| Settings | `SettingsScaffold` with SETTINGS · ABOUT · REPO, the same subtitles and theme toggle, About = prose + colophon, Repo = links, shortcuts at the foot | `HubSettings`: fxr's page as the reference, every feature opt-in — `sections` (rows as data, searched) · `drawer` (the gear opens the same sections) · `picker` · `splitShortcuts` (OPTIONS / SHORTCUTS) · `content` · extra `tabs`; ABOUT · REPO below the rule |
| Shortcuts sheet | `S` in monitor and mirror, `?` in media-hub (now `S`) | `S`, app-wide, off with `shortcutsKey={null}` |

**Routes.** `/` is Home, `/settings` is Settings, any other path is the tool. Router-agnostic, like `AppShell`.

## The Studio

**The Studio is the Hub plus the workstation's page set** (apps review §6c, 2026-09-29) — what fxr ·
mirror · monitor each hand-build, monitor.kolkrabbi.io the reference. `AppStudio` in kol-shell:

| page | path | prop | what |
|---|---|---|---|
| Home | `/` | `home` | the landing Catalog — RECENT · SAVED, New ‹thing›, Walkthrough; the mark goes here |
| Library | `/library` | `library` | a `CatalogPage` of the content (monitor: patches, modules) |
| Create | `/create` | `create` | a Catalog-headed editor page: `header` over the editor (monitor: CASE · MODULES) |
| Use | `/use` | `use` | the tool, full-bleed — no page padding, no wash (monitor: the rack) |
| — | `pages[].path` | `pages` | opt-in pages (monitor: Stage) |
| Settings | `/settings` | `settings` | `HubSettings`, pinned at the rail's foot |

The **order** is the Studio's; each slot renames with `{ path, label, icon }` (monitor's Use is
"Rack" at `/rack`), and an omitted slot is not there. **Mono by default** — fxr · mirror · monitor
are mono by ruling; `masthead="display"` overrides. Everything else is `AppHub`'s: keys, the bar,
the sheet. Notes, presentation and brand are create tools and can ride it too; a home-shaped app
(brand-hub) stays on `AppHub`.

## Apps tier

Named by what they hold (ruling D2, 2026-09-29 — `-shell` apps were Shell + Hub, so the name lied):

| App | Layers | Job |
|---|---|---|
| `apps/shell` | the Shell alone + ten placeholder pages | the reference for the Shell — the rail and the phone bar's More overflow |
| `apps/hub` | Shell + Hub + a placeholder tool | the reference for the Hub — judged on its own |
| `apps/studio` | Shell + Hub + the Studio pages, placeholders | the reference for the Studio — the workstation shape |
| `apps/catalog` | the Catalog alone | the reference for the Catalog — the masthead option, the engine in its search |
| `apps/<tool>` | the tool alone | the tool judged without chrome |
| `apps/<tool>-hub` | Shell + Hub + the tool | the app as it ships — `media-hub`, `notes-hub`, `presentation-hub` |
| `apps/<engine>` | the engine, as a lab | `markdown`, `search` — input in, what the engine reads out |

The showcase's `/apps` groups them by layer; each has a home at `/app/<name>` with its spec (layers, packages, opt-ins, port, what a consumer repo sets).

## Tool frame

The page a tool gets (user ruling 2026-09-27, `plan-2026-09-27-app-frame-and-curves`). Every `apps/<tool>` app had invented its own; this is the one frame, read off what already existed.

| # | Rule | Source |
|---|---|---|
| 1 | **Frame** — the tool mounts in `<PageShell mode="fixed">`: `width="bleed"` (the app tier), padding `--kol-shell-page-pad` (= `--kol-pad-section-x`, 20 → 48px), 100vh, overflow hidden; the body flexes to fill (`flex-1 min-h-0`) | kol-shell `PageShell` · `.kol-shell-page--fixed` |
| 2 | **One geometry** — the page a tool gets in `apps/<tool>` is the page it gets inside `apps/<tool>-shell` | *the tool in the shell is the same tool* |
| 3 | **Masthead** — the tool's own title only, display voice (`kol-sans-display-03`: MEDIA, CURVES), its controls on the right on the same line. No eyebrow, no subtitle, no description | apps/media |
| 4 | **Viewport** — the tool fits the window; nothing sits below the fold. A secondary surface (a reference, a sheet) opens from the masthead instead of stacking down the page | apps/media · mirror `/expressions` |
| 5 | **Text** — no explanatory copy on the page. Usage goes in the `S` sheet (`ShortcutsOverlay`) or a tooltip. A label only where a control is ambiguous without one | user, repeated (editor findings #10 · #13) |
| 6 | **Rhythm** — `gap-10` between units, none inside them; one control height per row | apps/media's `gap-10` (2026-08-27) · `09-sizes` |

**A reference page is not a tool.** `apps/controls` shows specimens rather than doing work, so it keeps rules 1–3 and 5–6 but scrolls (`mode="scroll"`) — its content is a list, and a list below the fold is still reachable.

**Where each app stands** (2026-09-27):

| App | Frame |
|---|---|
| curves | the reference — `PageShell` fixed, CURVES + mode + reference shape |
| media | `PageShell` fixed (was the site tier's `--kol-container-max` + `breakpoint-padding`) |
| controls | `PageShell` scroll — a reference page; CONTROLS + the page switch |
| notes · presentation | the lists are title-only (NOTES · DECKS, through `media-fixture/wiring`); the note editor was already fixed; the deck editor is fixed · bleed (was `capped`) |
| brand | unchanged — a book, it scrolls; its Home is still open (below) |
| editor | unchanged — `DesignEditor` draws its own full-window chrome |

**In code**, rule 1 plus rule 3 is:

```jsx
<PageShell mode="fixed" className="gap-10 [--kol-page-header-mb:0]">
  <PageHeader title="CURVES" actions={controls} />
  <div className="flex min-h-0 flex-1 …">{/* the tool */}</div>
</PageShell>
```

`apps/media-hub` runs on `AppHub`: the tool loads at `/`, and since 2026-09-29 the rail is Browse + Settings and nothing else — the Library Home, Notes, Decks and Brand left (notes, decks and brand are their own apps, and come back as opt-ins when they are ready to). Settings is the Hub's and the ONE settings place: it carries media's display rows (`mediaSettingsSections`, one settings object), the tool's gear hands over to it (`MediaLibrary onOpenSettings`), and the page has no drawer of its own. Smart folders are gone (user ruling). A tool's features ship in the DS and show in `apps/<tool>`; the `-hub` app adds only the Shell and the Hub around it.

**Notes and presentation open on a blank editor (2026-09-29).** *"you open it and start writing, then you decide what you want to do with it"* — `Notes open={NEW_NOTE}` and `Decks open={NEW_DECK}` are a document not saved yet; the first Save names and files it. The list is a page you go to, not the landing.

## The tools

Known tools that ride this anatomy — the roster to be sorted next session:

- **media** — the media browser (`apps/media`)
- **brand** — two apps since 2026-09-29, both on VOYAGER (`apps/voyager-fixture`): `apps/brand` is the CATALOGUE of brand building blocks (kol-styleguide's blocks in kol-framework's `PageLayout`), and `apps/brand-hub` is a client's HOME — kol-styleguide's `Brand` (BRAND and ASSETS over one manifest) on `AppHub`, with notes · decks · media as opt-in tools and the editor as an opt-in app. That home is what the DS offers the `brand.<domain>` sites (brand.kolkrabbi.io, brand.olina-productions.xyz)
- **presentation editor** — the deck editor (`apps/presentation`, `apps/presentation-hub`)
- **note editor** — notes (kol-olina's brand notes page; `DocumentEditor` is its file-shaped sibling; `apps/notes`, `apps/notes-hub`)
- **the fxr editor** — `@kolkrabbi/design-editor`
- **labs** and **generator** — alternate chromes on the editor
- the monitor rack, the mirror tool, and more

## Open

- monitor's tap-⌥-then-digit form is not in `navKeys` yet — monitor keeps it local until it is.
- Whether a tool can itself contain a Catalog (media's own file wall is catalog-shaped).
- The Home variant for a document-shaped tool (brand) — brand-hub opens on the book itself, with no Catalog Home (2026-09-29).
