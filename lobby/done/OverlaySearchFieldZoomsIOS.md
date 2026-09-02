# OverlaySearchFieldZoomsIOS — the 16px coarse floor misses the search overlay's field

**Filed:** 2026-09-01 ← **kol-website**
**Package:** `@kolkrabbi/kol-theme` (`kol-components-atoms.css:1345-1352`) + `@kolkrabbi/kol-component` (`ShellSearchOverlay.jsx`)
**Origin:** the gap left by `InputTypeScaleZoomsIOS` (kol-theme 0.112.0). That fix was reported as covering every field; it does not cover this one.

## The problem

Measured on production `/workshop` under real iPhone 13 emulation — **`pointer: coarse` matching true**, not a desktop viewport resize:

```
fontSize: 14px
shell:    NEITHER   (not .kol-control, not .kol-expand)
```

The floor is keyed on the shell:

```css
@media (pointer: coarse) {
  .kol-control input,
  .kol-expand input { font-size: 16px; line-height: 22px; height: 22px; }
}
```

`ShellSearchOverlay`'s field is not inside either. Its own markup is:

```html
<label class="flex w-full gap-2.5 px-4 py-3 items-center cursor-text kol-mono-14">
  …
  <input class="min-w-0 flex-1 bg-transparent border-none outline-none text-auto …" type="search">
</label>
```

The `<label>` carries `kol-mono-14` and the input inherits it. So the field computes 14px on a
phone, Safari zooms the page on focus, and — as `InputTypeScaleZoomsIOS` established — never
zooms back. Every subsequent tap and screenshot is a zoomed viewport.

This is what put the user in a zoomed page for most of a mobile review: search is one of the
first things tapped, and the zoom silently poisons every width read after it.

## The ask

Cover this field. Two obvious routes and the choice is yours:

- widen the floor's selector so it keys on something this field has (it is a `type="search"`
  input inside a labelled control shell), or
- put `ShellSearchOverlay`'s field on the same `.kol-control` shell every other DS input uses,
  so one rule keeps covering all of them.

The second is the one that stops this recurring — the first field to be built outside the shell
convention is exactly how this gap appeared.

Worth a sweep for other `<input>` elements in the DS that sit outside both shells while you are
in there.

## Remainder here once it ships

bump; re-check `/workshop` on a real iPhone — open search, tap the field, confirm the page does
not zoom.

## ✅ RESOLUTION — 2026-09-01 · kol-theme@0.117.0

Both routes at once: kol-theme 0.117.0 adds .kol-control--bare to the coarse-pointer 16px floor's selector, and kol-component 0.150.0 stamps that marker (zero chrome of its own) on SearchInput's bare body plan — so every future bare field is covered structurally, not per-site. Sweep of text-entry inputs outside both shells found one more: QuadrantSync's two number inputs (desktop inspector) — left as is, noted in the changelog.

**Remainder here:** none — kol-website bump kol-theme@0.117.0 + kol-component@0.150.0; re-check /workshop on a real iPhone — tap the search field, page must not zoom.

