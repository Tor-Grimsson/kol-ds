# SectionSplitVisualWidth — the split's media narrows and centres on a short viewport

**Filed:** 2026-08-31 ← **kol-website**
**Package:** `@kolkrabbi/kol-component` — `SectionSplit` / `.kol-section-split-visual`

## The defect

The media box ships as `w-auto max-w-full`, so its width is derived from the
image's aspect against whatever height the box is given. Where the box is tall
enough the width clamps to `max-w-full` and fills the column; where it is not, the
width resolves NARROWER than the column and the box centres — so the media sits
visibly inset while the copy beneath it stays at the page gutter.

## Measured on kol-website `/`, 390 wide

| viewport | text left | visual |
|---|---|---|
| 390 × 844 | 20 | `left 20 · width 350` ✅ |
| 390 × 932 | 20 | `left 20 · width 350` ✅ |
| **390 × 700** | 20 | **`left 56 · width 278`** ❌ |
| **375 × 667** | 20 | **`left 59 · width 257`** ❌ |

It is **viewport height**, not width. A nominal 844-tall test passes; a real phone
with browser chrome sits in the 660–720 band and fails. That is why this was
reported from a device four times and did not reproduce here until the height was
varied — worth knowing for anyone testing the section set.

## The ask

The media should fill its column regardless of the height it is given — the copy
beside/below it is at the gutter, and the media reading inset from that is never
the intent. `width: 100%` on the visual rather than `w-auto`, or whatever the
family's equivalent is; `max-w-full` alone is not enough because it only caps.

If `w-auto` is deliberate for some variant, then it wants a guard so it cannot
resolve narrower than the text column.

## Stopgap here meanwhile

`apps/web/src/styles/ui.css` forces `.kol-section-split-visual { width: 100% }`
under `max-width: 767px`, dated and citing this ticket. Comes out on the bump.

## Remainder here once it ships

bump kol-component; delete the stopgap block; re-check `/` foundry section on a
phone at a short viewport, not just at 844.

---

## Resolution — 2026-08-31 · 🟢 closed

**Shipped: `@kolkrabbi/kol-component` 0.145.0.** `w-auto` → `w-full` on
`.kol-section-split-visual`. `max-w-full` stays, and `centred`'s `max-w-[640px]`
still caps — a cap was never the problem, a derived width was.

### Measured on `/components/section-split`, at the heights you named
| viewport | visual left / width | column left / width | inset |
|---|---|---|---|
| 390 × 844 | 85 / 220 | 85 / 220 | **0** |
| 390 × 700 | 85 / 220 | 85 / 220 | **0** |
| 375 × 667 | 85 / 205 | 85 / 205 | **0** |

The two that failed for you (`390×700` → left 56 · width 278; `375×667` → left 59
· width 257) now sit flush on the column at every height.

**Your note about viewport HEIGHT is the useful part of this ticket** and is now a
comment on the line, so the next person testing the section set varies height and
not just width.

### Definition of done
- [x] The media fills its column regardless of the height it is given
- [x] No variant relies on `w-auto` any more, so no guard is needed
