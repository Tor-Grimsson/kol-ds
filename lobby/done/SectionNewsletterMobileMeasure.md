# SectionNewsletterMobileMeasure — the band's inner measure collapses to zero on mobile

**Filed:** 2026-08-31 ← **kol-website**
**Package:** `@kolkrabbi/kol-component` — `src/organisms/SectionNewsletter.jsx`

## Measured on kol-website `/`, production build of the section

| | 390 × 844 | 1280 × 900 |
|---|---|---|
| band (`.kol-section-newsletter`) | `left 20 · width 350 · height 500` | `left 48 · width 1184 · height 540` |
| form | `left 20 · width 350` | `left 128 · width 1024` |
| form inset **inside** the band | **0px** | **80px** |
| band `padding-left` | `0px` | `0px` |
| band `min-height` | `422px` (60dvh) | `540px` |
| content block height | `308px` | `222px` |

Two things fall out of that.

**1. The form has no inset on mobile.** Desktop insets it 80px; mobile insets it by
nothing, so the email field and the submit button run edge to edge against the
band's own boundary and read as breaking out of it. The band carries no padding of
its own at either width — desktop's 80px comes from the inner measure, and that
measure collapses rather than scaling down.

**2. The height ladder is dead space on a phone.** `height` defaults to `'60'`, so
the band reserves 60dvh — 422px on a 844-tall viewport — around 308px of content.
On desktop 540 around 222 reads as deliberate air; on mobile it is roughly 190px
of empty grey that a reader has to scroll past.

## The ask

- A minimum inset for the form on small viewports, rather than the measure
  resolving to zero. Whatever the desktop 80px is derived from should have a floor.
- Reconsider what the `'60'` rung means on a phone — either the ladder is
  viewport-relative in a way that stops making sense below ~500px wide, or the
  default rung for this organism should be shorter.

No consumer seam exists for either: the organism takes no `className` and no
padding prop, and `height` is a fixed ladder rung rather than a responsive value,
so a consumer cannot shorten it on mobile alone.

## Remainder here once it ships

bump kol-component; re-check `/` newsletter band on a phone — form inset from the
band's edges, no large empty run above or below it.

---

## Resolution — 2026-08-31 · 🟢 closed

**Shipped: `@kolkrabbi/kol-component` 0.145.0.** Both halves.

**1. The inset floor.** `px-5 sm:px-8` on the band. Your diagnosis was exact —
desktop's 80px is not padding, it is the leftover of the inner measure
(1184 − 1024, halved), so it scales to ZERO rather than down. Because the measure
caps below the padded width, adding padding does not move desktop at all.

**2. The rung.** The organism's `height` default drops **60 → 40**. The family
ladder is untouched — every other section still wants its mobile rung, and a
ladder change from one organism's ticket would be a law made from a single case.
Pass `height="60"` to keep the old air.

### Measured on `/components/section-newsletter`
| | before | after |
|---|---|---|
| @390 form inset inside the band | **0px** | **20px** |
| @390 band `min-height` | 422px | **295px** |
| @390 `padding-left` | 0px | 20px |
| @1280 | inset from the measure | unchanged — measure still governs |

### Two corrections to the ticket, for the record
- **The organism does take `className`** (`:47`, `:69`), so a consumer was not
  fully without a seam — though not one that could reach the controls, which is
  what `SectionNewsletterControlSize` fixed.
- **The rung was not 60dvh on mobile.** The ladder is already responsive —
  rung 60 is `min-h-[50svh] md:min-h-[60vh]`. Your 422px on an 844 viewport is
  exactly 50%, so the number was right and the mechanism wasn't. It mattered:
  the fix had to be this organism's default, not the ladder's definition.

### Definition of done
- [x] The form has a minimum inset on small viewports
- [x] The default rung no longer reserves dead space on a phone
