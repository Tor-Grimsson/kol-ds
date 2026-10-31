---
component: AppFloatNav (HubHome signed-out dock)
source: kol-fxr — Home signed out, kol-shell 0.91.2 HubHome.jsx#L306
staged: 2026-10-31
status: draft
deps: [AppFloatNav, HubHome]
---

# HomeDockShadow

## Purpose
The signed-out Home's dock floats over a live stage (fxr's growing line) and reads flat on it. The user, 2026-10-31, on a screenshot of the dock over the line: *"this needs the drop shadow blur we use in labs?"*

## Anatomy
HubHome → `<AppFloatNav variant="dock" shape="pill" … />` bottom-left, over `stage`.

## Variants
None new. The `dock` preset in `AppFloatNav.jsx` is `{ dock: true, border: false, shadow: false, active: 'circle' }`; `transport` (Labs' pill) is `shadow: true`.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| — | — | — | The ask is the default, not a new prop: a dock over a stage floats. |

## Styling
- The shadow is the one `transport` already wears (TabsRow `shadow`, `--kol-shadow-float`) — same value, both themes.

## States & interactions
Unchanged.

## Dependencies
AppFloatNav, HubHome.

## Recreation notes
- Either the `dock` preset turns `shadow: true`, or HubHome passes `shadow` when it renders the dock over a `stage`. HubHome passes no `shadow` today, so fxr has no way to turn it on.
- Acceptance (fxr plan 45 3.1): the Home dock's computed `box-shadow` equals Labs' transport pill's, in light and dark.

## Built — 2026-10-31

- **Fix:** HubHome passes `shadow={stage != null}` to its `AppFloatNav variant="dock"` (`packages/shell/src/HubHome.jsx`). The `dock` preset stays `shadow: false`: HubHome is its only in-repo caller, but `dock` is a public variant and a dock on a plain surface should not float.
- Same path as `transport`: TabsRow `shadow` → `boxShadow: var(--kol-shadow-float)`.
- Docs: kol-shell CHANGELOG "Unreleased"; `docs/documentation/04-compositions/11-shell-system.md` (signed-out Home sentence).
- Gate: `validate-syntax` clean.
- Playwright on studio-hub (signed out, stage on), 1440×900 — dock computed `box-shadow`, light and dark, equals `var(--kol-shadow-float)`: `rgba(0, 0, 0, 0.4) 0px 8px 24px -8px, rgba(0, 0, 0, 0.3) 0px 2px 6px -2px`.
- Not bumped, not published.

## ✅ RESOLUTION — 2026-10-31 · kol-shell@0.91.3

HubHome passes shadow={stage != null} to its AppFloatNav variant="dock", so the signed-out Home dock wears the transport pill's --kol-shadow-float over a stage; the dock preset stays shadow-free for plain surfaces. Measured on studio-hub: the dock's box-shadow is rgba(0,0,0,.4) 0 8px 24px -8px, rgba(0,0,0,.3) 0 2px 6px -2px in light and dark — var(--kol-shadow-float), the transport's. kol-shell 0.91.3 also carries the stage slide (translate, no resize) from 2026-10-30.

**Remainder here:** none — kol-fxr bump kol-shell 0.91.3.

