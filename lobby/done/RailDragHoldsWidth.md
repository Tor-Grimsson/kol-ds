---
component: NavRail (useRailDrag) — the app rail's grab
source: kol-fxr — every route's rail (AppStudio → AppHub → NavRail preset="app"), kol-component 0.322.0 organisms/NavRail.jsx useRailDrag
staged: 2026-10-31
status: draft
deps: [NavRail, AppShell]
---

# RailDragHoldsWidth

## Purpose
The user, 2026-10-31 (screenshots in `_assets/RailDragHoldsWidth/`): *"why cant I set the siderail custom? it just snaps to collapsed and expanded? if user clicks on the rail then it should snap between the two. but you should be able to drag it however you want, it will just get reset on rail click"*

Today `useRailDrag`'s release ends in `snapTo(w > (CLOSED + open) / 2 ? open : CLOSED)` — every drag snaps to the nearer state — and the move clamps to `[CLOSED, open]`, so the rail can never be wider than the open width either.

## Asked
- **Release keeps the dragged width** — no snap after a drag.
- **A click on the grab still snaps** collapsed ⇄ expanded (today's toggle), and that resets a custom width.
- **The upper bound is a max width**, not the open width (the DS's call on the number).
- **The rows follow the width**: labels and sub rows show past a threshold, icons only below it — never labels clipped in a narrow strip. `onSnap` / `railOpen` report from that threshold.

## Recreation notes
- Acceptance (fxr's): drag 380 → 300, let go: 300 ±2 one second later; drag to 560: stays 560; click from 300 → 48, click again → 380; a drag under the label threshold shows icons only; on a recording the release has no jump.

## ✅ RESOLUTION — 2026-10-31 · kol-component@0.327.0

kol-component 0.327.0, NavRail's app rail (useRailDrag): a drag follows the pointer from 48 to a max of 560 and stays where it is let go — no snap, no jump (sampled across the release). A click on the grab (or Enter / Space) still snaps: any width above 48 → 48, 48 → the open width (--kol-shell-rail-open, 380), so a click resets a custom width. Below 160 the rail is icons only (a container query hides labels, section chevrons and the title), and railOpen / onSnap / aria-expanded report from that 160 threshold, live during a drag. Checked on studio-hub at 1440, light and dark: 380 → drag 300 → 302 after 1 s; drag 560 → 560; drag 900 → 560; click 300 → 48 → 380; drag 122 → icons only. Notes: the width is not persisted; a click at an icons-only custom width (e.g. 120) collapses to 48; the rail is now a container, so a position:fixed element placed inside the rail slot positions against the rail (popovers and tooltips portal to body and are unaffected).

**Remainder here:** none — kol-fxr bump kol-component@0.327.0; check any fixed-position element fxr places inside the rail slot.

