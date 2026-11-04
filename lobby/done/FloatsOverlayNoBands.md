---
component: AppShell touch="floats"
source: kol-fxr — Labs on a phone, kol-shell 0.99.2 AppShell.jsx#L452-459
staged: 2026-11-03
status: draft
deps: [AppShell, AppFloatNav]
---

# FloatsOverlayNoBands

## Purpose
The user, 2026-11-03: *"the floating nav ISNT FLOATING its blocks its own section above and below the content … the point is for the nav to hover over the other elements."*

`touch="floats"` reserves a band for each float: the stage's scroll region has `padding-top: safe-top + 98`, so the stage starts below the top float over a strip of bare ground. The bottom Rail has `padding-bottom: 98 + safe-bottom`, so the transport float sits over a strip of bare ground under the Rail's rows. kol-fxr asked for both insets in PhoneTwoFloatLayout ("the stage starts under the top float"). That was wrong, and this ticket reverses it.

## Change
- **Top:** the stage runs from the top of the screen, under the status bar and under the top float. No `padding-top` on the stage region. The wash rule stays (one owner per pixel).
- **Bottom:** the Rail's rows run under the transport float. The last row must still scroll clear of it, but clearing it must not add a visible band while the Rail is not scrolled. Use scroll padding or a trailing spacer inside the scroll, never padding on the Rail's box.
- Without a Rail, the stage already runs under the transport. Keep that.

## Acceptance
- At 390×844 with `touch="floats"`: the stage's top edge is at y=0, behind the top float, and the top float is fully over the stage.
- With a Rail open: the transport float is over the Rail's rows, not over empty ground, and the last row can still be scrolled fully clear of the float.
- studio-hub's Settings › Phone nav › Floats shows the same.

## ✅ RESOLUTION — 2026-11-03

Shipped in **@kolkrabbi/kol-shell 0.99.3**. AppShell.jsx (`touch="floats"` column): the stage's `padding-top` (safe area + 98) is gone, so it starts at y=0 under the status bar and the top float; the wash rule is unchanged. The bottom Rail's `padding-bottom` (98 + safe area) is gone; its rows sit in a `relative` wrapper with an `absolute top-full` spacer of 98 + safe area, which adds scroll range but no height, so the rows run under the transport float with no band while unscrolled and the last row still scrolls clear. No kol-theme change. Checked on studio-hub (Phone nav › Floats, /chrome/labs) at 390×844, light and dark: stage top 0, Rail box 162 = its rows (scroll range 98), transport over the Params rows; scrolled to the end the last row's bottom is 746, the transport's top 762. 1440×900 unchanged (the floats column only renders under 768).
