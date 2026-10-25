---
title: App adoption
type: playbook
status: active
created: 2026-10-24
updated: 2026-10-24
audience: internal
description: Taking the app frame in a sibling repo
tags:
  - domain/workflow
  - audience/agency-internal
  - pattern/workflow
aliases:
  - app-adoption
related:
  - "[[INDEX|Apps tier]]"
  - "[[08-site-adoption|Site adoption]]"
  - "[[06-studio-adoption|Studio adoption]]"
  - "[[../../documentation/04-compositions/11-shell-system|Shell system]]"
  - "[[../../documentation/04-compositions/16-app-anatomy|App anatomy]]"
---

# App adoption

How a tool with a hand-rolled rail takes the app frame as the DS ships it after 2026-10-24 — kol-shell's `AppShell` for its own layout, so its rail, its phone mode, its keys and its page scaffold are `apps/shell`'s. A consumer never picks a rail; it picks a frame. Two exist: `SiteLayout` from kol-framework ([[08-site-adoption|Site adoption]]) and `AppShell` from kol-shell (this page). The Hub and the Studio are this frame plus a preset set and run [[06-studio-adoption|Studio adoption]] instead.

| Step | What it closes | The reference |
|---|---|---|
| 1 | the bump | — |
| 2 | the frame: `AppShell` replaces the repo's layout root | `apps/shell/src/App.jsx` AppRail |
| 3 | the rows: items, sections, the foot | `apps/shell/src/App.jsx` PAGES and SETTINGS |
| 4 | the pages on `PageShell` | `apps/shell/src/App.jsx` Page |
| 5 | what leaves | — |
| 6 | verification | `pnpm validate:render` on `shell` |

## 0. Prerequisites

- The DS wave is live on the registry: `@kolkrabbi/kol-shell` ≥0.78.1 and what it peers on — `@kolkrabbi/kol-component` ≥0.296.0, `@kolkrabbi/kol-framework` ≥0.53.0, `@kolkrabbi/kol-theme` ≥0.184.0, `@kolkrabbi/kol-icons` ≥0.16.0. Check with `curl -s https://registry.npmjs.org/@kolkrabbi/kol-shell | jq .\"dist-tags\"`.
- The repo runs Vite with Tailwind v4, the cascade order and the `@source` lines of the consumer contract; `@source "../node_modules/@kolkrabbi/kol-shell/src"` is among them, or the rail renders unstyled.
- The repo is a tool on the app rail — not a Hub, not a Studio app, not a site.

## 1. Bump

```
/bump
```

Then `/scan` reads clean. kol-shell peers on kol-framework (it draws the theme toggle itself) — a repo without `@kolkrabbi/kol-framework` installs it.

## 2. The frame

Mount `<AppShell>` as the layout root with the router's element as its children, and wire `currentPath` and `onNavigate` from the router at the call site — the shell is router-agnostic and never navigates on its own. The repo's own layout root (`AppLayout.jsx`, `Shell.jsx`, whatever it is called) goes to `_tmp/<date>-app-frame/`.

What a plain app passes, and nothing else:

| Prop | Pass | Why |
|---|---|---|
| `items` · `bottomItems` · `logomark` | the rows of step 3 | the rail's content |
| `currentPath` · `onNavigate` | the router's | every click, the mark included, goes through the app |
| `rail` | nothing | `app` is the default, and `railSections` is the preset's (`enter`) |
| `touch` | `"bar"` | below 768 the rail becomes the bottom bar — five destinations, else four and More. `pill` floats the bar over the page, `drawer` is the hamburger; the reference's is `bar` |
| `masthead` | `"display"` or `"mono"` | one voice for every title inside. No default: unset, each page keeps its own props |
| `pageWash` | `'var(--kol-fg-02)'` or nothing | `PageShell` paints it over the shell's primary back; unset, the page is the back |
| `navKeys` | `true` | ⌥1…9 walk the rail's rows in the order on screen, the mark first |
| `railToggleKey` | `'\\'` | toggles the rail; the rail returns on every route change |
| `settingsPath` · `settingsKey` | `'/settings'` · `','` | the settings row and the key toggle — pressed on the page, they return you where you were |

`railComponent` is a seam for proving a rail change, never for keeping a fork. `drawerBelow`, `drawerOpenOn`, `barItems`, `barActions` and `barHiddenOn` stay at their defaults unless the tool owns the phone's bottom edge — then `barHiddenOn` names its paths and the bar steps aside there.

## 3. The rows

- An item is `{ icon, path, label }`; `icon` is a kol-icons name. `bottomItems` is Settings, pinned under the rule. `logomark` is `{ svgUrl, title }`, at the top in both states, and it navigates to `/`.
- A section is an item with `sub` rows. One rule says how it opens: a section whose rows hold sections of their own **enters** — its rows replace the list under a Back row, and Back **exits**; a section whose rows are leaves **expands** in place and **collapses**. Those are the only four words. Nothing opens on arrival.
- A section with `to` is a foldernote: its icon and label open `to`, the caret alone expands or enters.
- The theme toggle is not a row. It lives on the settings page.

## 4. The pages

- A page is `PageShell` — `mode="fixed"` for a tool (the page holds the viewport, the body flexes and scrolls), `mode="scroll"` for a document; `width="bleed"` is the app tier and the default. It pads by `--kol-shell-page-pad`, subtracts the phone bar's height and paints `pageWash`; a page root that is not `PageShell` reads `--kol-shell-page-wash` itself.
- It opens with `PageHeader`, then the body. The reference's page is the whole of it:

```jsx
<PageShell mode="fixed" className="gap-10 [--kol-page-header-mb:0]">
  <PageHeader title="ONE" />
  <div className="flex-1 min-h-0">…</div>
</PageShell>
```

- The settings page is `SettingsScaffold`, with kol-framework's `ThemeToggle` on it.
- `PageBleed` breaks the gutter for a full-width embed; nothing else does.

## 5. What leaves

The local layout root and its CSS (rail width variables, active-state rules, the offset the content kept for the rail), the local rail or `NavRail` fork, the hamburger and its backdrop, the hand-written ⌥-digit and settings-key handlers, the page scaffold each page re-declared, and every `user-select`, scrollbar-gutter or page-padding rule the repo kept for itself. All of it to `_tmp/<date>-app-frame/`, none of it deleted.

## 6. Verification

Walk the app at 1440 and 390 beside `apps/shell` (`pnpm shell`, the Variants button on Rail: App). At 1440 the rail is 48px closed and the grab edge opens it, a press on a section enters or expands as the rule says, `\` toggles the rail, ⌥1 lands on the mark and ⌥2 on the first item, `,` opens settings and `,` again returns. At 390 the bar holds five destinations or four and More, More opens a rail with the rest and Settings, and a full-height page ends above the bar. The console is clean at both. In this repo `pnpm validate:render` opens `shell` at `#/one` and `#/settings` at both widths; the consumer's Playwright check is the same walk.
