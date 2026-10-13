# `MenuDropdownItem` rows are `inline-flex`, so a content-sized menu panel measures them side by side

**Staged:** 2026-10-13 · from a kol-fxr session (plan 29 § 8)
**Change:** one class on `MenuDropdownItem` (and `MenuDropdownNest`'s row), kol-component 0.251.0

---

## The problem, in one case

kol-fxr's File › Starters flyout (five rows, longest label 166px) rendered **320px** wide — its cap —
while File › Library (rows wrapped in `div`s) rendered 180. Measured on `vite preview`: with the cap
removed the Starters panel was **795px**, the five rows' widths added end to end.

`MenuDropdownItem` (`MenuItem.jsx:139`) and `MenuDropdownNest`'s row (`:175`) are
`w-full … inline-flex`. As **bare children** of a `w-max` (max-content) panel they are inline-level
boxes, so the panel's max-content is one line holding every row. `w-full` hides it in a fixed-width
panel (`MenuItem`'s own `w-[240px]` children), which is why nothing caught it.

## Ask

`inline-flex` → **`flex`** on both rows. A row is block-level then; `w-full` still fills a fixed
panel, and a content-sized panel hugs its longest label with no wrapper.

kol-fxr worked around it by making its flyout panel `flex flex-col` (`src/editor/shell/menus/MenuFlyout.jsx`);
that line can stay — it is harmless once the row is block (plan 17 #17 there).

## Verify

A `w-max` container holding five `MenuDropdownItem`s measures the longest label + padding, not their sum.

---

## Resolution — 2026-10-13 · 🟢 closed

**Shipped `@kolkrabbi/kol-component@0.252.0`.** `inline-flex` → `flex` on `MenuDropdownItem` and both nest
rows. Verified: five bare rows in a `max-content` box measure 103px = the widest row, not their sum; the
showcase's fixed-width menus unchanged. Your `flex flex-col` panel line is harmless and can stay.
