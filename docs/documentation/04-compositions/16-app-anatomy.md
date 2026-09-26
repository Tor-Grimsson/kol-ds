---
title: App anatomy
type: reference
status: draft
created: 2026-09-26
updated: 2026-09-26
description: Shell, Catalog, Hub, Tool — an app's layers
aliases:
  - app anatomy
  - shell catalog hub tool
  - hub
sources:
  - packages/shell/src/index.js
  - packages/shell/src/AppHub.jsx
  - packages/shell/src/HubHome.jsx
  - packages/shell/src/HubSettings.jsx
  - apps/shell/src/App.jsx
  - packages/shell/src/CatalogPage.jsx
  - packages/shell/src/SettingsScaffold.jsx
  - apps/media-shell/src/App.jsx
tags:
  - domain/compositions
  - domain/architecture
  - audience/consumer
related:
  - "[[11-shell-system|shell system]]"
  - "[[../../operations/07-apps-tier/INDEX|apps tier]]"
---

# App anatomy

The vocabulary for talking about a KOL app (user ruling 2026-09-26). Four layers, each inside the one above it. **Status: draft** — the table was refined against the monitor, mirror and fxr code on 2026-09-26 and the Hub shipped as `AppHub`; it stays draft until `apps/shell` is reviewed.

| Layer | What it is | Lives in today |
|---|---|---|
| **Shell** | the frame — the rail, the layout root, the navigation keys | `kol-shell` · `AppShell` + `NavRail` |
| **Catalog** | the ContentFilters **page** — title row, filter and search, the view toggle (RECENT · SAVED), LIST · GRID, the cards, the action row under them. The whole page layout, not only the filters | `kol-shell` · `CatalogPage` |
| **Hub** | the standard pages around the work — Home (a Catalog), Settings, the shortcuts sheet, the walkthrough — and the keys that reach them | `kol-shell` · `AppHub` (parts: `HubHome` · `HubSettings`) |
| **Tool** | the work area itself — the rack, the editor, the media browser, the styleguide | each app's own; shared ones graduate to packages |

**An app is Shell + Hub + Tool, and the Hub has a Catalog inside it.** monitor is Shell + Hub + the rack; brand would be Shell + Hub + the brand tool. `AppHub` is Shell + Hub in one call: the app describes itself and passes its tool as children.

## The Hub

Read off monitor, mirror and fxr (2026-09-26) — each assembled the same Hub by hand:

| Part | What all three did | The Hub's rule |
|---|---|---|
| Frame | the same `AppShell` props: Settings pinned bottom, kol-brand mark, `\`, `,`, `touch="drawer"`, `pageWash fg-02` | `AppHub`'s defaults; anything else through `shell` |
| ⌥-digits | a local handler ×3 — `navKeys` missed the bottom rows | `navKeys` walks mark → items → bottom rows; on by default |
| Home | `CatalogPage` + mono masthead + RECENT · SAVED + a Walkthrough toggle + a Get-started step | `HubHome`: views RECENT · SAVED (caps, renamable), `items` may be `(view) => items`, walkthrough opt-in with its X inside the card, list = the file row stacked (brand's) |
| Settings | `SettingsScaffold` with SETTINGS · ABOUT · REPO, the same subtitles and theme toggle, About = prose + colophon, Repo = links, shortcuts at the foot | `HubSettings`: fxr's page as the reference, every feature opt-in — `sections` (rows as data, searched) · `drawer` (the gear opens the same sections) · `picker` · `splitShortcuts` (OPTIONS / SHORTCUTS) · `content` · extra `tabs`; ABOUT · REPO below the rule |
| Shortcuts sheet | `S` in monitor and mirror, `?` in media-shell (now `S`) | `S`, app-wide, off with `shortcutsKey={null}` |

**Routes.** `/` is Home, `/settings` is Settings, any other path is the tool. Router-agnostic, like `AppShell`.

## Apps tier

| App | Layers | Job |
|---|---|---|
| `apps/shell` | Shell + Hub + a placeholder tool | the reference for the Hub — judged on its own |
| `apps/<tool>` | the tool alone | the tool judged without chrome |
| `apps/<tool>-shell` | Shell + Hub + the tool | the app as it ships |

`apps/media`, `apps/media-shell` and `apps/shell` exist (`pnpm shell`, port 5176). `apps/media-shell` runs on `AppHub` (2026-09-26): the tool loads at `/` and Home moves to `/library` (`homePath`) as a Catalog of RECENT · FAVOURITES · DRAFTS; Notes is a Catalog of the bucket's text with the editor in the page; Settings is the Hub's, carrying the same display rows as the browse drawer (`mediaSettingsSections`, one settings object). Smart folders are gone (user ruling). A tool's features ship in the DS and show in `apps/<tool>`; the `-shell` app adds only the Shell and the Hub around it.

## The tools

Known tools that ride this anatomy — the roster to be sorted next session:

- **media** — the media browser (`apps/media`)
- **brand** — styleguide, about, references (in kol-olina today); a Hub whose Home is likely a section index rather than a catalog of work — a Home variant, decided when brand arrives
- **presentation editor** — the deck editor
- **note editor** — notes (kol-olina's brand notes page; `DocumentEditor` is its file-shaped sibling)
- **the fxr editor** — `@kolkrabbi/design-editor`
- **labs** and **generator** — alternate chromes on the editor
- the monitor rack, the mirror tool, and more

## Open

- monitor's tap-⌥-then-digit form is not in `navKeys` yet — monitor keeps it local until it is.
- Whether a tool can itself contain a Catalog (media's own file wall is catalog-shaped).
- The Home variant for a document-shaped tool (brand).
