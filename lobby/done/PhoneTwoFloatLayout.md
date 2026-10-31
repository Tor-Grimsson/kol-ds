---
component: a phone page preset — AppFloatNav `panel` above, AppFloatNav `transport` below, a sheet between (studio-hub)
source: kol-fxr — Labs on a phone: src/editor/labs/LabsView.jsx#L366-400 (LabsPhoneChrome) · src/editor/styles/kol-labs.css#L195-205
staged: 2026-10-31
status: draft
deps: [AppFloatNav, AppShell, HubSettings]
---

# PhoneTwoFloatLayout

## Purpose
fxr's Labs on a phone is two floats — `AppFloatNav variant="panel"` pinned at the top, `AppFloatNav variant="transport"` over the foot — with the stage and a bottom sheet laid out around them. The floats are KOL's; the layout around them is fxr's own CSS. The user, 2026-10-31: *"the mobile layout with one floatingNav above and one below PLUS the spacing, that should be a preset/variant of a mobile settings page in /apps/studio-hub"* — he referenced studio-hub's phone page a lot when designing AppFloatNav. studio-hub's Settings has `Phone nav: Bar · Pill · Drawer` only; this two-float layout is not there.

## What fxr hand-rolls today (kol-labs.css L195-205)
| what | value | why |
|---|---|---|
| stage top inset | `padding-top: 88px` | 16 + 56 pill + 16 — the stage starts under the top float |
| sheet foot inset | `padding-bottom: calc(88px + env(safe-area-inset-bottom))` | the sheet's rows scroll clear of the transport float |
| sheet shadow | `box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.45)` | the sheet lifts off the stage upward; no rule |
| sheet top rule | `border-top: 0` | the shadow replaces it |

## Asked
1. **A phone layout preset with a float above and a float below**, the insets derived from the pill tokens (no 88 literals), showable in studio-hub's phone page beside Bar · Pill · Drawer.
2. **An upward shadow token for a bottom sheet.** `--kol-shadow-float` points down (`0 8px 24px -8px …`); fxr wrote its own upward one. One token for a sheet rising from the bottom edge.

## Recreation notes
- Acceptance: fxr's `LabsPhoneChrome` mounts the preset with its two item lists, and `kol-labs.css` L195-205 retires to `_tmp/` with no visible change at 390 wide.

## ✅ RESOLUTION — 2026-10-31 · kol-shell@0.97.0 · kol-theme@0.207.0

kol-shell 0.97.0: AppShell takes a fourth phone nav, touch="floats", beside bar, pill and drawer. Under 768 the nav is an AppFloatNav variant="panel" overlay at the top (rows and actions from barItems / barActions), and floats.transport is an AppFloatNav variant="transport" overlay over the foot. Between them the children are the stage and floats.rail is a bottom Rail (railHeight, default 50dvh). Both insets derive from the pill constants (inset + pill height + inset = 98, since the pill is 66 now — fxr's 88 assumed the old 56) plus the safe areas; the page's own ground runs up under the top float. The Rail has no top rule and takes kol-theme 0.207.0's --kol-shadow-rail-up (0 -8px 40px rgba(0,0,0,.45)). studio-hub's Settings › Phone nav shows Bar · Pill · Drawer · Floats. Open for fxr: if Labs' Home/Catalog/Params/Transport toggles should stay apart from the app's nav, ask for a floats.items override.

**Remainder here:** none — kol-fxr bump kol-shell@0.97.0 + kol-theme@0.207.0; LabsPhoneChrome mounts touch="floats" (Labs toggles as barItems, Output/File as barActions, transport items + sheetFor as floats.transport, the params Rail as floats.rail, tall mode via floats.railHeight); kol-labs.css L195-205 to _tmp/.

