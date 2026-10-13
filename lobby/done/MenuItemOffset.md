# `MenuItem` — an `offset` prop, so a menu bar's panel sits on the bar's line

**Staged:** 2026-10-13 · from a kol-fxr session (plan 31 § 1, the user walking the menu bar against macOS and Affinity)
**Change:** `molecules/MenuItem.jsx` — `usePopover({ … offset: 4 })` is hardcoded; kol-component 0.255.0

---

## The problem, in one screenshot

kol-fxr's menu bar is `h-8` with `size="sm"` triggers (26px). The panel floats 4px under the *trigger*,
which is ~7px under the bar's bottom hairline, and wears its own hairline on top — so the user sees
two lines and a gap between them (*"why the gap? line to line, fix it"*). macOS and Affinity put the
panel's top edge on the bar's bottom line; the menu reads as the bar unfolding, not a card floating
under it.

## Ask

`offset` prop on `MenuItem` (number, **default 4** — every existing call site unchanged), handed to
`usePopover`. Negative values allowed, so a consumer can land the panel's top border on the bar's
border when the trigger sits inside a taller bar. Nothing else changes; flyouts are untouched.

## Verify

Showcase `MenuItem` at the default: pixel-identical to 0.255.0. `offset={0}`: the panel's top touches
the trigger's bottom. `offset={-2}`: overlaps by 2.

For fxr on the return: bump; `MenuTop` passes the measured value (one const beside `PANEL`).

## ✅ RESOLUTION — 2026-10-13 · kol-component@0.256.0

New `MenuItem offset` (number, default 4), handed to `usePopover`; negatives overlap. Verified on the showcase (`/components/menu-item`, offset variants 4 · 0 · -2): panel top minus trigger bottom measured 4, 0 and -2 px.

**Remainder here:** none — kol-fxr bump kol-component ^0.256.0; `MenuTop` passes the measured offset.

