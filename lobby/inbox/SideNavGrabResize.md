---
component: SideNavGrabResize
source: kol-apps/kol-mirror/src/pages/MirrorPlayground.jsx#L21-L76 (prior art); filed from kol-website
staged: 2026-08-06
status: draft
deps: [SideNav (kol-framework), Tooltip]
---

# SideNavGrabResize

## Purpose

Replace SideNav's floating chevron Button with a **grab edge**: pointer-drag
resizes the rail, dragging under a snap threshold collapses it, double-click
resets. User verdict on the current control (2026-08-06): "I don't love the
sidebar toggle" — and he independently remembered the mirror handle as the thing
he wanted back.

## Anatomy

```
SideNav (aside, relative)
└─ grab strip   absolute, right edge, thin, full height
                cursor: col-resize · no visible chrome
```

## Prior art — the mechanics, working today

`kol-mirror/src/pages/MirrorPlayground.jsx#L21-L76` (second instance:
`components/hall-of-mirrors/SymphonyMixer.jsx#L1121`):

- `pointerdown` on the strip captures `startX` + current width; sets
  `document.body.style.cursor = 'col-resize'` and `userSelect = 'none'`.
- window-level `pointermove` applies the clamped delta — mirror clamps
  `[defaultW, defaultW * 3]`.
- `pointerup` restores cursor/userSelect.
- **Double-click resets** to the default width (`setSidebarWidth(null)`).

Mirror hardcodes the strip width and clamp as literals — consumer-app slack the
DS version must not copy (see Tokens).

## What the DS version adds beyond the prior art

- **Snap-collapse**: width dragged below a threshold snaps to the collapsed
  rail and stamps `data-sidenav="collapsed"` — the contract the rail CSS
  already keys off. Dragging back out re-expands. This merges resize and the
  collapse toggle into one gesture.
- Live width written to the existing `--kol-sidenav-w` var rather than an
  element-style literal, so consumer CSS follows it for free.
- Persistence: width + collapsed state to localStorage (`kol-sidenav` is the
  key consumers already use).

## Tokens

Existing, already in kol-theme — use them: **`--kol-sidenav-w`** (expanded
width / drag floor and reset target) and **`--kol-sidenav-w-collapsed`** (snap
target).

**No token exists** for the two values the gesture itself needs — checked the
theme CSS for `--kol-sidenav-*`; only the three above ship (`-dot-left` is the
third). Both belong in the token file first, never inline:

| mint | carries |
|---|---|
| `--kol-sidenav-grab-w` | the strip's hit width (mirror ships a bare literal here) |
| `--kol-sidenav-snap` | the width under which the drag snaps collapsed |

## States & interactions

- Idle: invisible; `col-resize` cursor on hover is the only affordance.
- Dragging: live width, no text selection, cursor held during the whole drag.
- Snapped: collapsed rail, identical to today's collapsed state.
- Double-click: default width.

## Dependencies

None new. Lives where `SideNav` lives (kol-framework owns the
`data-sidenav` contract).

## Consumers waiting

- `kol-website/apps/brand/src/components/framework/SideNav.jsx#L104-L114` — the
  DS Button toggle to retire on adoption (plus its brand-local collapse CSS in
  `styles/sidenav-collapse.css`).
- The package's own `SideNav` — it ships the chevron-less rail since 0.10.0.

## Recreation notes

- Tier: **kol-framework** — a `useDragResize` hook + the strip element inside
  `SideNav`, CSS keyed on the existing `data-sidenav` attribute.
- **A11y is not optional**: an invisible strip is unreachable by keyboard. Keep
  a focusable control (visually minimal is fine) that toggles collapse, or give
  the strip `role="separator"` + `aria-orientation="vertical"` with arrow-key
  resize. The pointer gesture is an enhancement, never the only path.
