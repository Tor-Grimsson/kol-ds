# HubDevChrome — the Dev page: its rail row, its tabs, no description line

**Staged:** 2026-10-18 → kol-ds-ui · from kol-monitor

## The ask, in the user's words

> "why did the dev tab move? it was fine where it was. below stage"
> "terrible layout, I already said which fucking tab system to use and its not this one?! it was the one we use
> in ui.kolkrabbi.io components" (TabChips — `TabsRow look="chip"`)
> "and why are we puttin sub description below the tabs?"

## What it is today (kol-shell 0.66.0, `HubDev.jsx` + `AppHub.jsx:99`)

- The `code` row is forced into `bottomItems`, above Settings. Monitor's Dev row sat in the main list, under Stage.
- The tabs are `TabsRow look="text" tracked`.
- The active tab's `description` prints under the tabs.

## The ask

1. The Dev row goes in the main rail list, after the app's own rows (under Stage in monitor) — not in the bottom group.
2. The tabs are `TabsRow look="chip"` — the tabs ui.kolkrabbi.io's components pages use.
3. No description line under the tabs.

## Acceptance

monitor's `/dev` on a dev server: `</>` under Stage in the rail; chip tabs; nothing between the tabs and the content.

## ✅ RESOLUTION — 2026-10-18 · kol-shell@0.67.0

kol-shell 0.67.0: the `code` Dev row now closes the app's own rows (after `pages`, so under Stage) and Settings keeps the bottom alone; HubDev's tabs are `TabsRow look="chip"` (the ui.kolkrabbi.io component-page tabs); no description line — a tab's `description` is no longer drawn. Verified in an AppStudio harness with a Stage page: rail Use · Stage · Dev, Settings at the foot; two chip tabs; nothing between the tabs and the content.

**Remainder here:** none — kol-monitor bump kol-shell@0.67.0; drop `description` from your dev tabs (ignored now).

