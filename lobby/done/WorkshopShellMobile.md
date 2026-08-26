---
component: WorkshopShellMobile
source: kol-workshop ShellHeader (nav.flex.flex-1.gap-6) · kol-dashboards two-up cards
staged: 2026-08-25
status: draft
deps: [ShellHeader]
---

# WorkshopShellMobile — header tabs clip, dashboard two-up cards overflow

## The defects (kol-website mobile audit 2026-08-25, #5)

1. **ShellHeader tabs.** `nav.flex.flex-1.gap-6` measures 613px on every
   `/workshop/*` page at 393px, no wrap, no scroll: Docs · Design System · Brand
   render, Dashboard / Apparat / Chess are clipped and unreachable. The ⌘K search
   and hamburger survive; the section tabs do not.
2. **Dashboard two-up cards.** On `/workshop/dashboard/components`
   `div.flex-1.space-y-4` (right 414) and `div.flex-1.dash-card` (right 416) overflow
   the 393 viewport — a fixed two-column flex that never stacks.

## Ask

Tabs become a horizontally scrollable strip below `md` (scroll-snap, edge fade,
active tab scrolled into view); dashboard card rows stack below `md`.

## ✅ RESOLUTION — 2026-08-26 · kol-framework@0.23.0

Half DS, half consumer. The tab strip already scrolls — `.kol-shell-header-tabs { overflow-x: auto }`, measured on production at 393: 345 wide, 613 of content, `scrollLeft` moves — but its scrollbar is hidden and the ACTIVE tab sat off-screen (`Dashboard` at x=347–445 in a strip ending at 369): the page you were on was the one tab you could not see. ShellHeader now scrolls the active tab to the strip start edge, before paint, only when it is out of view; the strip snaps to tab starts on a flick (`scroll-snap-type: x proximity` — not mandatory, which would refuse the last tabs). Verified in the showcase at a width where two tabs overflow: fresh load on the second tab → scrollLeft 44, tab fully in the strip; fresh load on the first → 0, untouched; route change → 44. No edge fade: the 2026-07-28 ruling against scroll-edge paint stands. The two-up cards are NOT DS chrome: `div.flex-1.space-y-4` and `div.flex-1.dash-card` are kol-website own `flex flex-row gap-6 items-start` rows in `apps/web/src/routes/workshop/DashboardComponents.jsx` (lines 182, 202, 220, 555, 579); `.dash-grid` in kol-dashboards already stacks by container query and is not used there. That half returns as the consumer remainder; kol-dashboards and kol-workshop have nothing to bump. 20 gates clean.

**Remainder here:** none — kol-website bump kol-framework >=0.23.0 (kol-workshop + kol-dashboards unchanged); stack the `flex flex-row gap-6` rows in `DashboardComponents.jsx` below `md`, or put them on `.dash-grid`.

