# `Dropdown` takes no accessible name

**Staged:** 2026-10-13 · from a kol-fxr session (plan 29 § 12)
**Change:** one prop on `molecules/Dropdown.jsx`, kol-component 0.251.0

---

## The problem, in one case

kol-fxr's Color pane has a view picker — a `Dropdown` with Hue · Wheel · HSL · RGB (Affinity's
`RGB ▾`). The trigger (`Dropdown.jsx:239-241`) carries `aria-haspopup` and `aria-expanded` but no
name; the props (`:59-116`) have nothing to pass one through. A screen reader hears "Hue, popup
button", with no word for what it chooses. `SegmentedToggle` takes `ariaLabel` for exactly this.

## Ask

`ariaLabel` on `Dropdown`, set as the trigger's `aria-label` (same name and shape as
`SegmentedToggle`'s). kol-fxr passes `ariaLabel="Color view"` on the bump (plan 17 #19 there).

## Verify

The trigger's accessible name is the label, and its value is still announced.

---

## Resolution — 2026-10-13 · 🟢 closed

**Shipped `@kolkrabbi/kol-component@0.252.0`.** `ariaLabel` on `Dropdown`, same name as `SegmentedToggle`'s.
An `aria-label` replaces the button's text, so the current value rides after it: the trigger's name
is `"Color view, Hue"` — the value is still announced, as Verify asked. Verified on the showcase
Dropdown preview: `aria-label="Sort, Newest first"`.
