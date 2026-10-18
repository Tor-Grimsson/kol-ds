# ShortcutsOverlayList — the `S` sheet is a list, not a search

**Staged:** 2026-10-18 → kol-ds-ui · from kol-monitor

## The ask, in the user's words

> "shortcuts are wrong! 1. you dont need to have search input, its alist of shortcuts NOT A SEARCH. 2. are these
> all relevant to the page you are on? 3. why doesnt it expand collapse? or enter exit? and what the fuck is RUN
> susposed to do?"
> "why are we showing disabled shortcuts, named category elsewhere/stage?? so dumb"

## What it is today (kol-component 0.267.0, `CommandOverlay mode="shortcuts"`, opened by AppHub's `S`)

- A search field ("Search shortcuts…") on top.
- Every section: the page's first, the rest muted and disabled under "Elsewhere · <section>".
- A footer "↵ Run".
- AppHub's `S` handler matches `e.key.toLowerCase()`, so ⇧S opens it too.

## The ask

1. No search field — a list of the keys.
2. Only the current page's sections (plus sections with no `routes`). No Elsewhere, no disabled rows.
3. No Run footer; no Enter-to-run.
4. `S` opens and closes it (toggle), Esc closes it.
5. AppHub's `S` ignores ⇧S.

The user is also comparing it against a right side rail (monitor's local `src/overlays/ShortcutsRail.jsx` on ⇧S:
a `Rail side="right"` with `SettingsRow` label + combo per item). If he picks the rail, that is the shape to ship.

## Acceptance

On monitor's `/rack`, `S` shows App + Rack + Cables + View + Pointer, nothing from Stage, no field, no footer; `S`
again closes it; ⇧S does not open it.

## ✅ RESOLUTION — 2026-10-18 · kol-shell@0.68.0

kol-shell 0.68.0 + kol-component 0.268.0: AppHub's `S` sheet is `ShortcutsOverlay` — a list, no search field, no Run footer, no Enter-to-run; `S` toggles it, Esc closes it, ⇧S is ignored. Only the current page's sections are drawn (plus sections with no `routes`) — the muted Elsewhere block is gone from `ShortcutsOverlay` and from `CommandOverlay`'s shortcuts mode. Verified in apps/hub: ⇧S no sheet; `S` open, `S` closed; Esc closes; no field, no Run.

**Remainder here:** none — kol-monitor bump kol-shell@0.68.0 + kol-component@0.268.0; `ShortcutsRail.jsx` stays or goes on the user's call.
