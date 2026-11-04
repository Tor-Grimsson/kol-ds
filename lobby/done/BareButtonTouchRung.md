# BareButtonTouchRung — a bare Button keeps its type on touch; CalendarHeatmap takes a week count

**Staged:** 2026-11-03 · from kol-website (`apps/metric`, plan `.kol/llm-context/plans/2026-11-03-metric-mobile.md` W1.1)
**User:** *"metric is really not mobile optimised"* — then *"plausible.io [the reference] already had this down… just diff"*. The diff at 402×874 against plausible.io traced the worst of it to the first ask below.

No stopgap in kol-website: the consumer waits for the release and bumps.

## 1. `Button variant="bare"` is caught by the touch rung

- `packages/component/src/atoms/Button.jsx:68–72` — bare renders `<button className="kol-menu-btn …">` and its doc says *"the button keeps its type"*.
- `kol-theme/kol-components-atoms.css:1393` (0.210.0) — under `@media (pointer: coarse)` the rung `:is(… .kol-menu-btn.kol-menu-btn)` sets `font-size: 16px; line-height: 22px`.
- So every bare surface types 16 on a phone, whatever class it carries. In metric: card tabs set `kol-helper-12` render 16px (plausible's are 12px / 600), so TOP PAGES · ENTRY PAGES · EXIT PAGES overflow a 330px card; bar-row labels (`kol-helper-12`) render 16 and wrap ("Outbound Link: Click" on two lines).
- It also contradicts the `MobileTouchFloor` ruling (2026-08-26): no type floor — small chrome type is the same at every width; reach the hit floor by extending the box, never the glyph.

**Ask:** the touch rung skips the bare variant — bare keeps the type its className gives it on every pointer, as the doc promises. MenuItem's rows (also `kol-menu-btn`) keep the rung if that is intended; the general fix is that the rung matches the menu row, not the class bare borrows for its focus ring.

**Acceptance:** at 402 with touch emulation, a bare Button with `kol-helper-12` computes `font-size: 12px`; a MenuItem row still computes 16px; the bare hit area is unchanged.

## 2. `CalendarHeatmap` has no week count

- `packages/dashboards/src/charts/Heatmap.jsx:121–123` — always 53 weeks back from `end`. On a phone metric wraps it in `min-w-[640px]` and scrolls it sideways, opened at today.

**Ask:** a `weeks` prop (default 53) so a consumer can show the last N weeks at a phone width (metric will pass 26 below md).

**Acceptance:** `weeks={26}` draws 26 columns ending on `end`'s week, month labels over their first week as now; default output unchanged.

## Remainder in kol-website once it ships

Bump kol-component / kol-theme / kol-dashboards; metric's Deploy activity passes `weeks={26}` below md and drops its `min-w-[640px]` scroller.

## ✅ RESOLUTION — 2026-11-03

**kol-theme 0.210.1 · kol-component 0.333.2 · kol-dashboards 0.8.0**

1. **Bare keeps its type on touch.** `Button variant="bare"` stamps `kol-menu-btn--bare` beside the borrowed `kol-menu-btn` (`packages/component/src/atoms/Button.jsx:73`); the touch rung's `:where()` now excludes it — `:where(:not(.kol-hw-panel, .kol-hw-panel *, .kol-menu-btn--bare))` (`packages/theme/kol-components-atoms.css:1398`), specificity unchanged. MenuItem rows keep the rung.
2. **`CalendarHeatmap weeks`** (default 53) — `packages/dashboards/src/charts/Heatmap.jsx:123,126`: `weeks` columns, the last one `end`'s week; month labels unchanged.

Checked in `apps/metric` at 402×874, touch emulated (`pointer: coarse` true): bare `kol-helper-12` tab = 12px / 12px (16px without the marker); site-picker MenuItem rows = 16px / 22px; bare hit box 32px tall either way. `weeks={26}` → `repeat(26, 1fr)`, last column `end`'s week, labels May … Nov; default → 53 columns as before.
