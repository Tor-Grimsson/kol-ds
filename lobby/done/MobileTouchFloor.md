---
component: MobileTouchFloor
source: kol-theme type ramps (kol-helper-10 / kol-mono-10 / .kol-table-cell-title) · control heights (toggle-switch, kol-seg-cell, kol-btn-sm, Slider)
staged: 2026-08-25
status: draft
deps: []
---

# MobileTouchFloor — 10px chrome and 14–26px controls on phones (needs a ruling)

## The class (kol-website mobile audit 2026-08-25, #8)

Not one component — the ramps. Counted at 393px across web + brand:

- **Type under 11px:** `kol-helper-10` / `kol-mono-10` chrome, `th.kol-table-cell-title`
  at 10.4px, brand swatch labels — 100–430 elements per brand page, 5–36 per web page.
- **Hit areas under 36px:** `toggle-switch--bare` 34×14 and 118×20, `kol-seg-cell` 24px,
  `kol-btn-sm` 26px, `Slider` range input 19×2 (a 2px track is the whole target),
  brand table row buttons 16×16, helper-12 links 12–14px tall.

## Ask (user's rung to give — 🔴 needs-ruling)

Whether the DS wants a mobile floor at all, and where: e.g. helper/mono-10 step to 12
below `md`; interactive controls get a ≥44px hit area via padding or a `::before`
extent without changing their drawn size. Filed so the question has a home, not as a
build order.

## ✅ RESOLUTION — 2026-08-26 · kol-theme@0.51.0

Ruled, and the ruling built. NO type floor: 10px chrome (`kol-helper-10` / `kol-mono-10`, the 10.4px table header) is the chrome voice at every width — a mobile step would reflow every rail and table for a class of text that is labels, not copy. HIT FLOOR 24px (WCAG 2.5.8 AA), reached without moving the drawn size: the size scale (26/32/40) and `.kol-seg-cell` (24) already clear it; the two controls under it are lifted in kol-theme 0.51.0 — the bare `ToggleSwitch` (14px: a 12px track in a 1px border) takes a `::before` extent 24px tall centred on the button, and the `Slider` range input (2px — the track was the whole target) is 24px tall with the 2px track centred inside it by the UA, thumb unchanged, row unchanged. Verified in the showcase at 393: the extent computes 24px and hit-tests 2px beyond a labelled 20px box on both sides (`elementFromPoint` lands on the button) and 5px beyond the 14px label-less box; the slider input measures 24 in a 24 row and a 3x render shows track and thumb centred. Law written into `03-components/05-control-chrome.md` § Touch floor. Not the DS: a consumer own 16px table buttons and 12px links — same rule there, extend the hit box, never the glyph.

**Remainder here:** none — kol-website bump kol-theme >=0.51.0; the brand table 16×16 download/toggle buttons and the 12–14px links are yours — extend their hit box to 24, not the glyph.

