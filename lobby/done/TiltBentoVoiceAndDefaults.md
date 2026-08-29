---
component: TiltBentoVoiceAndDefaults
source: kol-component/src/molecules/TiltBento.jsx#L113-L166
staged: 2026-08-27
status: draft
deps: [TiltBento, kol-theme]
---

# TiltBentoVoiceAndDefaults — the subtitle rides a retired class, and two defaults force every call site to restate

Found executing `TiltFamilyForks` on kol-website: the seven `/` highlight tiles
are on `TiltBento` (kol-component 0.110.0) and build green — but one voice is
**dead in the shipped CSS** and two defaults silently change what renders.

## 1. `kol-mono-text` emits NOTHING — the subtitle has no voice

`TiltBento.jsx:165` renders the subtitle as `kol-mono-text text-absolute-white`.
That class was **retired in kol-theme** — `kol-typography.css:976`:

> `.kol-mono-text` retired — consumers use Tailwind `font-mono` (single-class …)

Measured in kol-website's built CSS after the bump:

```
.kol-mono-text{…}   → 0 rules emitted
.kol-mono-12{font-family:var(--kol-font-family-mono);font-size:12px;font-weight:400;line-height:16px}
```

So every `TiltBento` subtitle currently inherits the ambient font — no mono, no
size, no line-height. The description one line below is on `kol-mono-12` and
renders correctly, which is what makes it obvious on screen. Pick the rung the
family should carry (the retired fork rendered the subtitle at `kol-mono-14`,
one rung above its `kol-mono-10` description) and put a live class there.

## 2. Two defaults that change the render on adoption

| prop | fork's default (what shipped for a year) | TiltBento's default | effect on swap |
|---|---|---|---|
| `titleClassName` | `kol-sans-heading-02 text-light-fixed uppercase` | `kol-sans-heading-01 text-absolute-white` | a rung bigger, casing lost |
| `buttonLabel` | `'View Project'` | **none** | the CTA renders an empty `Button` |

Neither is wrong as a *decision* — `heading-01` may well be the right family
default and "author the label" is a fair rule. Flagging them because a consumer
that swaps by the ticket's import-line instruction gets a silently different
page: five of kol-website's seven tiles took the fork's title default, and all
seven took the label default. **kol-website now passes both explicitly on all
seven tiles**, so the site is correct today and needs nothing back — this is
about the next repo to adopt.

Worth a line in the component's docstring either way: `buttonLabel` has no
default *by design*, so an `href` with no label is a call-site bug, not a gap.

## 3. Not asked for, noted

There is no `subtitleClassName` / `descriptionClassName` seam — deliberate, and
right. Item 1 is a broken class, not a missing seam; please fix it in the
component rather than opening those.

## Definition of done

- [ ] a `TiltBento` subtitle renders in the mono voice at a live rung, measured in a built consumer's CSS
- [ ] `titleClassName` / `buttonLabel` defaults confirmed or changed, and the docstring says which

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.113.0

The subtitle rode `kol-mono-text` (retired, zero rules) — now `kol-mono-14`, one rung above the mono-12 description as the fork drew it. `titleClassName` default confirmed (`kol-sans-heading-01 text-absolute-white`, the family's; the fork's heading-02 uppercase is a call-site pass); `buttonLabel` has no default BY DESIGN — both stated in the docstring. No new seams. 21 gates clean; verified in source (measured in a built consumer's CSS is yours).

**Remainder here:** none — kol-website: bump kol-component 0.113.0; the seven tiles already pass title + label explicitly, nothing else changes.
