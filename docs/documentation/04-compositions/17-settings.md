---
title: Settings
type: reference
status: active
created: 2026-10-24
updated: 2026-10-24
description: The three settings tiers
tags:
  - domain/app-shell
  - pattern/blocks
  - audience/agency-internal
aliases:
  - settings-tiers
related:
  - "[[11-shell-system|Shell system]]"
  - "[[16-app-anatomy|App anatomy]]"
---

# Settings

Three tiers, opt-in, the first one studio-hub's (his ruling 2026-10-23: *"most of the time you will only need a siderail … if you are super heavy then you might want a page, then when the page is getting heavy you might want filters"*). Each is built from the components below with or without the Hub; `AppHub settings` maps onto exactly these three. The live set is the showcase's **Settings** set.

| Tier | What it is | Built from | With the Hub |
|---|---|---|---|
| 1 · the rail | the Settings row (or `,`) opens a rail over the page. **One shape on every app** (2026-10-24): the tab row is exactly Settings · Shortcuts · About · Repo, the three drawn by the Hub from `shortcuts`, `app.about` and `app.links` — an app has no tab of its own, its rows all go under Settings; the footer holds the theme toggle (the Hub draws kol-framework's `ThemeToggle` itself) and a live reset. The rows are **typed data** — `{ type: 'choice', options, value, onChange }`, `{ type: 'switch', on, onChange }`, a text `value`, a section's `note` — and the Hub draws every control, label and note in its own class and tone; no JSX reaches the rail (`content`, a tab's `content`, a row's `render` are ignored with a dev warning) — never a page | `SettingsPanel variant="rail"` · `SettingsSections` (typed rows → `SettingsRow`, `SettingsChoice`, `SettingsSwitch`) · `TabsRow look="text"` · `SettingsFooter` | `settings={{ sections, drawer: { onReset } }}` — the default; `tabs` and `content` are the page tier's |
| 2 · the page | Settings at a route, two columns from `lg`: sections left, shortcuts, About and Repo right, no filter bar; its gear opens tier 1 | `HubSettings` (`SettingsScaffold` underneath) | `settings.page: true` |
| 3 · the filtered page | the page with its filter bar, tabs (SETTINGS · the app's · ABOUT · REPO) and search | `HubSettings filters` | `settings.filters: true` with `page` |

**Which tier.** The rail, until the content outgrows one column; then tabs in the rail; a page only when a settings surface is itself a destination (fxr's settings page with its chrome picker was one). Three tiers, not a fourth.

**The toggle is the Hub's** (2026-10-24, his review: *"wrong themetoggle"*, two apps had written `tone="sunken"`). `AppHub` draws kol-framework's `ThemeToggle` itself, `fill="none" label={false} size="sm"`, on every rail — kol-framework is kol-shell's peer for it; the `themeToggle` prop is retired. No app passes or styles it.

**What goes in the rail** (2026-10-24, his review: *"is there no criteria of what information goes into settings rail?"*). Settings holds the app's preferences and nothing else — typed rows in sections, a note where a section needs a sentence; every section the app has goes here (Mirror's render budget under its Memory), and the rail scrolls. Shortcuts is this page's keymap as rows, About is `app.about` (a string or paragraphs) over the colophon, Repo is `app.links`; the Hub draws all three on every rail, studio-hub included, so no app decides. No app tab: a fifth word does not fit the rail on one line, and the row never wraps. Reset is live on every rail: it hands the theme back to the system — the one setting the Hub owns — then runs the app's `drawer.onReset` when it has one.

**Where the pieces live.** The rows and the rail are kol-component (`SettingsPanel`, `SettingsSections`, `SettingsRow`, `SettingsChoice`, `SettingsSwitch`, `SettingsChipRow`, `SettingsFooter`); the page and its furniture are kol-shell (`HubSettings`, `SettingsScaffold`, `SettingsShortcuts`, `SettingsLinks`, `SettingsColophon`).
