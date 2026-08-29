# PageHeaderTrailingSlot — a control beside the header means dismantling the component

**Staged:** 2026-08-28 · from **kol-website** (brand `/icons`)
**Nature:** missing seam on kol-shell `PageHeader`.

## Why

`/icons` needed the size control sitting on the **subtitle's** baseline, right —
kol-r2b2's header is the reference: wordmark left, controls right, on the line.

`PageHeader` renders `eyebrow` / `h1` / `subtitle` as a closed `<header
className="flex flex-col">` with an inline `marginBottom: 40`. There is no
trailing slot, so a consumer has two bad options:

1. **Wrap the whole component in a flex row.** Flexbox exposes only a flex
   item's FIRST baseline, and PageHeader is a column — so the control aligns to
   the `h1`, never the subtitle. `align-items: last baseline` reaches the
   subtitle's LAST line, which is a different wrong answer on a two-line lede.
   The wrapper also shrinks the header to content width unless the consumer adds
   `flex-1 min-w-0`, silently re-flowing the subtitle.
2. **Take the subtitle out of the component** and re-render it as a bare
   `<p className="text-oq-64 kol-mono-14">`, then cancel the header's inline
   bottom margin with `!important` and restore the 40 on the new row.

kol-website is on (2). That is a consumer re-implementing a DS text role, off
copied classes, plus an `!important` — three tells at once.

```jsx
<PageHeader size="sm" voice="mono" title={meta.title} />
<div className="flex justify-between gap-6" style={{ alignItems: 'last baseline', marginTop: 12, marginBottom: 40 }}>
  <p className="text-oq-64 kol-mono-14 max-w-[800px]">{lede}</p>
  <Dropdown … /> <Button … /> <ThemeToggle … />
</div>
```
```css
[id^="icons-"] header { margin-bottom: 0 !important; }
```

## Ask

- `actions` (or `trailing`) on `PageHeader`, aligned to the **subtitle's first
  baseline** when a subtitle is present, to the title's when it is not.
- `subtitleMaxWidth` (or a `subtitleClass` seam) — the lede wants a measure and
  today that is another consumer rule reaching inside the component.
- The `marginBottom: 40` moves off the inline style so it can be overridden at
  all.

## Definition of done

- [ ] a control cluster passed to `PageHeader` lands on the subtitle's baseline
- [ ] the lede takes a measure without a consumer selector
- [ ] kol-website deletes its bare `<p>`, the `!important` margin rule and the
      `max-width` rule, and passes the cluster as a prop

---

## ✅ RESOLUTION — 2026-08-28

Shipped as **kol-shell 0.15.0**:

- [x] a control cluster passed as `actions` lands on the subtitle's first baseline — the lede and the cluster share one `items-baseline` row (flexbox exposes a flex item's FIRST baseline, so one row is the only way to land on the subtitle's line rather than the h1's); on the title's baseline when there is no subtitle
- [x] `subtitleMaxWidth` — the lede's measure, a prop
- [x] the bottom rhythm is `--kol-page-header-mb` (default 40px) — inline still (the block owns its rhythm), but through a variable a consumer can re-point
- [ ] kol-website deletes its bare `<p>`, the `!important` margin rule and the `max-width` rule, and passes the cluster as `actions` — **kol-website's**

No `actions` = the old DOM, byte for byte.

Verified in source + showcase build only. Remainder in kol-website: bump kol-shell ≥0.15.0; pass the cluster as `actions` and the measure as `subtitleMaxWidth`; delete the bare `<p>`, the `!important` margin rule and the `max-width` rule.
