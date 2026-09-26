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

The vocabulary for talking about a KOL app (user ruling 2026-09-26). Four layers, each inside the one above it. **Status: draft** — the table is refined against the monitor, mirror and fxr code in the next session; the names are settled.

| Layer | What it is | Lives in today |
|---|---|---|
| **Shell** | the frame — the rail, the layout root, the navigation keys | `kol-shell` · `AppShell` + `NavRail` |
| **Catalog** | the ContentFilters **page** — title row, filter and search, the view toggle (RECENT · SAVED), LIST · GRID, the cards, the action row under them. The whole page layout, not only the filters | `kol-shell` · `CatalogPage` |
| **Hub** | the standard pages around the work — Home (a Catalog), Settings, the shortcuts sheet, the walkthrough | **nothing yet** — monitor, mirror and fxr each assemble it from parts, which is why their small things differ |
| **Tool** | the work area itself — the rack, the editor, the media browser, the styleguide | each app's own; shared ones graduate to packages |

**An app is Shell + Hub + Tool, and the Hub has a Catalog inside it.** monitor is Shell + Hub + the rack; brand would be Shell + Hub + the brand tool. The Hub is the missing layer: defining it once in `kol-shell` is what stops the three apps rebuilding it.

## Apps tier

| App | Layers | Job |
|---|---|---|
| `apps/shell` | Shell + Hub + a placeholder tool | the reference for the Hub — judged on its own |
| `apps/<tool>` | the tool alone | the tool judged without chrome |
| `apps/<tool>-shell` | Shell + Hub + the tool | the app as it ships |

`apps/media` and `apps/media-shell` exist; `apps/shell` is next. A tool's features ship in the DS and show in `apps/<tool>`; the `-shell` app adds only the Shell and the Hub around it.

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

- The Hub's exact parts and props — from the overlap between monitor, mirror and fxr.
- Whether a tool can itself contain a Catalog (media's own file wall is catalog-shaped).
- The Home variant for a document-shaped tool (brand).
