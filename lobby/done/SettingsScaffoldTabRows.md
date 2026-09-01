# SettingsScaffoldTabRows — yes, it is one idiom: a tab should carry its own row

**Staged:** 2026-08-30 · from **kol-fxr**
**Nature:** the answer to the question `SettingsScaffoldFromFxrPage`'s return
asked, plus the small prop that follows from it.

## The question you asked

> *"your page passes `layoutOptions={SIDE_PAGES}` for ABOUT / REPO, and the
> scaffold does not forward that yet. It goes through `filtersProps` today; if
> the pair is really one idiom, say so and it becomes a named prop."*

**Yes. It is one idiom.** SETTINGS above the rule and ABOUT / REPO below it are
not two selectors — they are ONE page selector, drawn across two rows because
the user ruled the two side pages down to the smaller row (2026-08-28). One
state, one set of destinations, two rows of chrome.

## What that costs today

fxr adopted the scaffold on 0.22.0 and is its first render. The adoption is
clean except here, where the page has to take the state back off the component:

```jsx
filtersProps={{
  viewMode: view, onViewModeChange: setView,
  layoutOptions: SIDE_PAGES, layout: view, onLayoutChange: setView,
}}
renderContent={(_tab, filtered) => …}   // _tab is bypassed; `view` is the truth
```

Three consequences worth the DS's eye:

1. **The scaffold's own `tab` state is dead** on any page that uses both rows —
   it is overridden from outside and never read.
2. **`renderContent`'s first argument is a lie** there. It hands back the
   internal tab, which is not what is rendering.
3. **The masthead only works by accident.** `header` spreads after
   `title`/`subtitle`, so the page passes `HEADERS[view]` and wins. A consumer
   who did not know that would get the wrong title on the side pages.

## The ask

Let a `tabs` entry say which row it belongs to, and keep the state in the
scaffold:

```jsx
tabs={[
  { value: 'settings', label: 'SETTINGS', title: 'Settings',  subtitle: '…' },
  { value: 'about',    label: 'ABOUT', row: 'layout', title: 'About', subtitle: '…' },
  { value: 'repo',     label: 'REPO',  row: 'layout', title: 'Repo',  subtitle: '…' },
]}
```

The scaffold splits them into `viewModeOptions` / `layoutOptions`, drives both
from the one `tab`, and `renderContent(tab, filtered)` becomes true again. The
default row stays the view strip, so nothing that exists today moves.

Naming is yours — `row`, `strip`, `placement`. The shape is the ask.

## What stays here

The `filtersProps` block above, until this lands. It works; it is just the
escape hatch doing a named prop's job. On the return: bump, delete the override,
take `renderContent`'s `tab` argument back, and let `tabs` carry the titles.

## Prior

`SettingsScaffoldFromFxrPage` (kol-fxr, 2026-08-30) → kol-shell 0.21.0 + 0.22.0.
This is its one remainder, not a new complaint — the scaffold is right and fxr
is on it.

## ✅ RESOLVED — 2026-08-30

Shipped in **kol-shell 0.23.0**. The shape as asked; `row` is the field name.

```jsx
tabs={[
  { value: 'settings', label: 'SETTINGS', title: 'Settings', subtitle: '…' },
  { value: 'about', label: 'ABOUT', row: 'layout', title: 'About', subtitle: '…' },
  { value: 'repo',  label: 'REPO',  row: 'layout', title: 'Repo',  subtitle: '…' },
]}
```

The scaffold splits `tabs` on `row`, feeds `viewModeOptions` / `layoutOptions`,
and **both strips read and write the same `tab`**. Entries with no `row` stay on
the view strip, so nothing that exists today moves.

All three consequences close with it:

1. The scaffold's `tab` is live again on a two-row page — it is the one state
   both strips drive.
2. `renderContent(tab, filtered)` is true. No page needs to bypass it.
3. The masthead reads `tabs.find(t => t.value === tab)` across **all** entries,
   side pages included, so `title`/`subtitle` come from the tab that is actually
   rendering — not from a `header` spread that only worked by ordering luck.

A strip whose options do not contain the active tab draws nothing lit, which is
correct: on ABOUT, the SETTINGS strip has no selection to show.

⚠️ **Source-and-build verified only.** kol-fxr is the only renderer of this
component and it is on 0.22.0 — the two-row split has not been on screen.

**Remainder here:** none.
