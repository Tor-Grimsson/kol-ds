# SettingsScaffoldFromFxrPage — `SettingsScaffold` takes aim from fxr's `/settings`

> **⛔ DO NOT START. This is a conversation, not a task.** User ruling
> 2026-08-30: *"just make sure to no auto trigger this task, I wanna talk about
> it there."* File it, row it, leave it. No component work, no migration, no
> publish until he opens it here himself.

**Staged:** 2026-08-30 · from **kol-fxr**
**Nature:** design direction for an existing component — `SettingsScaffold`
should be re-aimed at a render the user has now approved, rather than carrying
its own third header shape.

## 1 — The approved reference

**fxr's `/settings` page is correct** (user, 2026-08-30). It is the render to
take aim from. `src/pages/SettingsPage.jsx` in kol-fxr, on kol-shell 0.19.1 /
kol-component 0.131.0.

What it is made of, top to bottom:

| band | what |
|---|---|
| masthead | `PageHeader size="sm" voice="mono"`, with the control cluster in `actions` |
| cluster | chrome `Dropdown` (`w-40`, `tone="sunken"`) · `ThemeToggle sm` · `IconFrame settings-01` — kol-r2b2's row 1 in shape |
| header row | **`ContentFilters`, the real organism** — `tone="sunken"`, `title="Preferences"` |
| filters | ONE group, `Section` — the settings sections plus `Shortcuts` |
| search | `searchKeys={['label','section','group']}` — a row's own label matches, so `loop`, `aspect`, `undo` all land |
| strips | `viewModeOptions` SETTINGS · `layoutOptions` ABOUT / REPO · `trailingActions` the OPTIONS / SHORTCUTS `ViewToggle` |
| body | `renderItem` regroups the survivors under their section eyebrows |

**The load-bearing part: the header row IS `ContentFilters`, not a shape that
resembles it.** fxr hand-wrote a lookalike to the organism's grammar on
2026-08-28 and it drifted inside the hour — the organism's search is
`size="md" iconSize={16} fieldHeight={28}`, and a copy passing none of those
renders a different pill in the same row on the next page over. The user caught
it as *"2 different content filters in settings and effexor home why"*.

`SettingsScaffold` currently draws its own header. That makes a third header
shape in the estate beside `PageHeader` and `ContentFilters`, on the one page
type every app has.

**The ask:** re-aim `SettingsScaffold` at the above. Its header row is
`ContentFilters`; the masthead stays `PageHeader`.

## 2 — The drawer lives on the page too

**The user put the settings sidebar INTO the settings page** (2026-08-30),
taking aim from how it is set up in **kol-r2b2**. His reason, verbatim:

> *"I put it in the settings page, because its a way to call up the same
> information."*

So the gear in the masthead's `actions` opens `DisplaySettingsDrawer` over the
page itself — the same drawer the editor chromes get. Both surfaces render from
ONE definition (`src/settings/AppSettings.jsx`: `{ label, rows: [{ label,
render }] }`), which is what stops them drifting the way fxr's two topbar
settings menus did. `,` / `⌥,` opens it from anywhere; a shell page with no
drawer navigates to `/settings` instead.

Worth the DS's eye when this is discussed: the scaffold is currently a page
shape only. The page-plus-drawer pair is the shape actually in use.

## 3 — Already ruled, not part of this ask

The kol-component rename (`SettingsSection` → `LabeledControlSection`) was
**closed 2026-08-27 on kol-component 0.112.0** and fxr is fully on that pair —
zero live uses of kol-shell's `SettingsSection` / `LabelRow` remain here (the
count of 8 in fxr's context was stale as of the 2026-08-30 settings work).

Whether kol-shell's duplicate pair retires, and what happens to mirror's 44 and
monitor's 19 call sites, is **kol-ds-ui's own conversation** — the user ruled
2026-08-30 that it does not belong in an fxr ticket. Recorded here only so the
discussion has the numbers.

## What stays in kol-fxr

Nothing. fxr is on the DS components and its page is the reference render, not
a fork. If the scaffold is re-aimed and fxr should move onto it, that returns as
a bump plus a swap — but that is downstream of a conversation that has not
happened.

## ✅ RESOLVED — 2026-08-30

The conversation the hold was waiting for **happened** — in session, with the
user, and it settled all three parts. Shipped: **kol-shell 0.21.0** (the
duplicates) and **0.22.0** (the scaffold).

### §1 — the header row IS ContentFilters

`SettingsScaffold` no longer draws its own `TabStrip` + `Divider`. The shape is
now `PageShell → PageHeader → ContentFilters → scrolling body`, which is fxr's
approved `/settings` exactly. **The tabs became the view strip** — the same row
fxr's SETTINGS and the home page's RECENT / SAVED run on, not a settings dialect
of it. New pass-throughs: `title` · `items` · `filterGroups` · `searchKeys` ·
`trailingActions` · `tone` (default `sunken`) · `filtersProps`.
`renderContent` now takes `(tabValue, filteredItems)` so a page can render the
survivors of a search — a TabStrip could not carry search at all.

The third header shape in the estate is gone.

### §2 — the drawer

Documented, not rebuilt. `SettingsPanel` in kol-component is the drawer
(ShellDrawer underneath: scrim, Escape, focus trap, scroll lock), and the
scaffold's docstring now says so and says where the opener goes
(`header.actions`). The page-plus-drawer pair renders from ONE definition, which
is the user's stated reason for putting the sidebar on the page: *"its a way to
call up the same information."*

### §3 — the duplicates, which were the user's actual question

Ruled: **kol-component owns the settings kit.** It is below shell in the
dependency order, it is the fuller kit, and fxr already ran on it in production.

kol-shell's `SettingsSection` + `LabelRow` were a second implementation of
`LabeledControlSection` + `SettingsRow` — dropped from the barrel and
quarantined to `_tmp/2026-08-30-shell-settings-duplicates/` (user:
*"dont ship duplicate components"*). `SettingsShortcuts` was repointed at
`SettingsRow` in the same pass. **`LabeledControlSection` is the user's chosen
name and was not touched.**

⚠️ **The record on this was wrong and is corrected here.** It was carried as
"71 call sites — a migration, not a cleanup". That counted *uses*, not files.
The real number was **two files**: mirror's and monitor's `SettingsPage.jsx`.
fxr had already moved off. Both were ticketed with the exact diff.

### Remainder here

**None.** No repo in the estate renders `SettingsScaffold` yet, so this new
shape is **source-and-build verified only, never screen-verified** — fxr's page
is the reference it was built from, not a render of it.
