# PageHeaderActionsGrowsBlock — `actions` makes the masthead 10px taller, so no two pages line up

**Filed:** 2026-08-28 → **kol-ds-ui**
**Entry:** `~/dev/projects/kol-ds-ui/lobby/inbox/PageHeaderActionsGrowsBlock.md`
**Ledger:** `~/dev/projects/kol-ds-ui/lobby/INDEX.md` — **the truth about this ticket**
**Last known:** 🔵 `filed` 2026-08-28
**Measured live in two consumers**, same kol-shell 0.19.0, same props otherwise.

## The defect

`PageHeader` puts the `actions` cluster in a flex row **with the subtitle**:

```jsx
<div className="flex items-baseline justify-between gap-6" style={{ marginTop: 12 }}>
  {lede}
  {cluster}
</div>
```

A flex row takes the height of its tallest child. The lede is one line of
`kol-mono-14` — **18px**. A cluster of `sm` controls (`IconFrame` /
`ThemeToggle` / `Dropdown`, all pinned 28 since kol-theme 0.90.0) is **28px**.

So the masthead is **10px taller on any page that has actions**:

| consumer | actions | header block |
|---|---|---|
| **kol-monitor** `/` | none | **65.2** = 35.2 h1 + 12 + 18 |
| **kol-fxr** `/settings` | 3 sm controls | **75.2** = 35.2 h1 + 12 + 28 |

Both on `kol-mono-heading-03` (32px / 35.2 line box) — the titles are identical.
Screenshots of both DevTools overlays are with this ticket's filer.

**Why it matters:** the masthead is the one block every page in an app shares.
A consumer cannot put a control cluster on one page without that page's title
block, rule, and everything below it sitting 10px lower than every other page —
and there is no prop to opt out. It is invisible until two pages are compared
side by side, which is exactly how it was found.

## The ask

The cluster should sit on the subtitle's line **without growing the row** —
centred against that 18px line box, overflowing it symmetrically (±5px) rather
than pushing the block down. The header's height should be a function of its
TEXT only, so `actions` is free.

`items-baseline` was chosen deliberately (`PageHeaderTrailingSlot`, kol-website
2026-08-28) so the cluster lands on the subtitle's baseline rather than the
h1's — that intent is right and should survive; it is the row's *height* that
must stop depending on the cluster.

Not a fix, but for reference: the numbers above are with every control at the
`sm` rung. `md` would make the gap 14px, so it is not a one-off constant.

## What stays here

Nothing — fxr is on the DS component and passes `actions` as documented. On the
return: bump and re-measure `/settings` against kol-monitor's `/`; they should
both read 65.2.

**Remainder here:** bump, re-measure `/settings` against monitor's 65.2.
**State:** 🔵 filed 2026-08-28

---

## ✅ RESOLUTION — 2026-08-28

**kol-shell 0.19.1.** The cluster is now `h-0 self-center` — a zero-height box centred on the row, so its children overflow it symmetrically and the row's height is the lede's alone.

Two things that made this the right shape rather than a patch:

- **No constant.** You noted the gap is 10px at `sm` and 14 at `md`; a negative margin would have had to know the control rung. A zero-height box is correct at every rung because it measures nothing at all.
- **Horizontal layout is untouched.** The box still takes its width, so `justify-between` holds and a long lede still cannot run under the controls — which an absolutely-positioned cluster would have broken.

The `items-baseline` intent from `PageHeaderTrailingSlot` survives for the lede; only the cluster opts out of the row's cross-axis sizing.

This was a defect in a feature shipped hours earlier the same day, found by measuring two consumers against each other — which is the only way it could have been found, as you say.

Verified in source + showcase build only. Remainder in kol-fxr: bump to 0.19.1 and re-measure `/settings` against kol-monitor's `/` — both should read 65.2.
