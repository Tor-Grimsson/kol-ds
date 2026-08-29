# ViewToggleWellGap — the icon toggle's well padding breaks an even row gap

**Staged:** 2026-08-28 · from **kol-website** (brand `/icons`)
**Nature:** small geometry defect on `ViewToggle variant="icon"`.

## Why

`ViewToggle variant="icon"` wraps its buttons in `p-1` — so the container's box
extends 4px past the last visible chip on every side. Put it in a normal control
row:

```jsx
<div className="flex items-center gap-4">
  <ViewToggle variant="icon" … />
  <Divider variant="vertical" />
  <span>GUIDE</span><span>CLEAR</span>
</div>
```

…and the gap reads **20px on the toggle's side, 16px on the text's** — the row
gap plus the toggle's own padding. Every consumer that sets an even gap around
this component gets an uneven one, and the fix is a negative margin on whatever
sits next to it. kol-website carries `-ml-1` on the divider.

## Ask

The well's padding is part of the component's own box, so the component should
own the correction — either the well is inset (padding drawn inward from the
declared box) or `ViewToggle` exposes the 4px so a row can subtract it. A
consumer should not need `-ml-1` to make `gap-4` mean 4.

## Definition of done

- [ ] `gap-N` around `ViewToggle variant="icon"` renders N on both sides
- [ ] kol-website deletes the `-ml-1` on its divider

---

## ✅ RESOLUTION — 2026-08-28

Shipped as **kol-component 0.121.1**:

- [x] `gap-N` around `ViewToggle variant="icon"` renders N to the chips on both sides — the well is inset (`-mx-1` beside the `p-1`): the chips sit where the box says, the well bleeds 4px into the gap
- [ ] kol-website deletes the `-ml-1` on its divider — **kol-website's**

Ceiling (ponytail): the well also bleeds 4px past a row's outer edge when the toggle is the first or last item; if that reads wrong on a gutter, that is the next ticket.

Verified in source + showcase build only. Remainder in kol-website: bump kol-component ≥0.121.1; delete the `-ml-1` on the divider.
