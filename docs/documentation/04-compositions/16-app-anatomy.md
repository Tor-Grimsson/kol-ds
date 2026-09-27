---
title: App anatomy
type: reference
status: draft
created: 2026-09-26
updated: 2026-09-27
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

`apps/media`, `apps/media-shell` and `apps/shell` exist (`pnpm shell`, port 5176). `apps/media-shell` runs on `AppHub` (2026-09-26): the tool loads at `/` and Home moves to `/library` (`homePath`) as a Catalog of RECENT · FAVOURITES · DRAFTS; Notes is a Catalog of the bucket's text with the editor in the page; Settings is the Hub's, carrying the same display rows as the browse drawer (`mediaSettingsSections`, one settings object). Smart folders are gone (user ruling). A tool's features ship in the DS and show in `apps/<tool>`; the `-shell` app adds only the Shell and the Hub around it.

## The tools

Known tools that ride this anatomy — the roster to be sorted next session:

- **media** — the media browser (`apps/media`)
- **brand** — the brand book (kol-styleguide `Brand`, 2026-09-27): BRAND and ASSETS over one manifest; `apps/brand` alone, media-shell's Brand tab. Its Home inside a Hub of its own is still open — likely a section index rather than a catalog of work
- **presentation editor** — the deck editor
- **note editor** — notes (kol-olina's brand notes page; `DocumentEditor` is its file-shaped sibling)
- **the fxr editor** — `@kolkrabbi/design-editor`
- **labs** and **generator** — alternate chromes on the editor
- the monitor rack, the mirror tool, and more

## Open

- monitor's tap-⌥-then-digit form is not in `navKeys` yet — monitor keeps it local until it is.
- Whether a tool can itself contain a Catalog (media's own file wall is catalog-shaped).
- The Home variant for a document-shaped tool (brand).
