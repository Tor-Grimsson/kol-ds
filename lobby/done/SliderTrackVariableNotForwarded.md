---
component: Slider
source: packages/component/src/molecules/Slider.jsx (the docstring and the signature disagree) · packages/theme/kol-components-atoms.css#L674 (`.slider-black`)
staged: 2026-08-30
status: draft
deps: [Slider]
---

# SliderTrackVariableNotForwarded

## The ask

`Slider`'s own docstring documents a per-instance override that cannot be
passed:

> Track color is exposed as the `--kol-slider-track` CSS variable on
> `.slider-black`; override per-instance via
> `style={{ '--kol-slider-track': '...' }}`.

The component takes no `style` prop. Its signature destructures 21 named props
and has no rest spread, so a consumer's `style` is dropped on the floor —
silently, which is the worst kind.

## Why the obvious workaround does not work either

Setting the variable on an ancestor is the natural fallback, and it fails for a
second, separate reason: `.slider-black` declares `--kol-slider-track:
var(--kol-fg-64)` **on the element itself**, and an element's own declaration
beats anything it would inherit. So the variable is unreachable from above *and*
unreachable from the props.

The dual rail added in 0.133.0 gets this right and is the model:

```css
.kol-slider-dual-playhead { background: var(--kol-slider-playhead, var(--kol-accent-primary)); }
```

A **fallback**, not a declaration — so an ancestor sets it and it inherits. That
is why kol-mirror can colour the playhead from a `className` and cannot colour
the track the same way.

## Contract

Either half fixes it; the first is smaller and matches the sibling rule.

| | |
|---|---|
| **preferred** | `.slider-black` uses `var(--kol-slider-track, var(--kol-fg-64))` and drops the self-declaration, exactly as `.kol-slider-dual-playhead` does. The variable then inherits and the documented override works from any ancestor |
| alternative | forward `style` (and ideally `...rest`) onto the range input, making the docstring literally true |
| either way | the docstring stops promising a seam that is not wired |

## What it costs the consumer meanwhile

kol-mirror wants full-ink tracks at every fader in the instrument. With no prop
and no inherited variable, it carries a cascade rule instead:

```css
.control-slider .slider-black { --kol-slider-track: var(--kol-surface-on-primary); }
```

That is a consumer stylesheet reaching into a DS class by specificity — the
shape the 2026-08-27 consumption pass in that repo spent a session removing. It
is one line and it is correct today, but it is the wrong mechanism, and it is
only there because the right one is not connected.

Filed while adopting `SliderDualThumbAndPlayhead`, which shipped the same day
and otherwise landed clean — 18 call sites moved with no edit.

## ✅ RESOLVED — 2026-08-30

Shipped in **kol-theme 0.98.0** + **kol-component 0.134.0**. Both halves, because
the docstring promised two routes and only fixing one would have left it half
false.

**The CSS (preferred half).** `.slider-black` no longer declares
`--kol-slider-track` on itself; both track pseudo-elements read
`var(--kol-slider-track, var(--kol-fg-64))`. The variable now inherits, so an
ancestor can set it — exactly what `.kol-slider-dual-playhead` was already doing,
which is the sibling rule this should have matched from the start.

**The prop.** `style` is forwarded to the wrapper on both branches. The
component destructured 21 named props with no rest spread, so a consumer's
`style` was dropped silently.

Docstring rewritten to describe what is now true, and to name both routes.

### The diagnosis was exactly right

Two independent blocks, either one of which alone would have hidden the other:
no `style` prop, and a self-declaration that beats inheritance. Fixing only the
prop would have left ancestor styling broken; fixing only the CSS would have
left the documented per-instance route dead. Hence both.

**Remainder here:** none. The consumer's
`.control-slider .slider-black { --kol-slider-track: … }` cascade rule can go —
`style={{ '--kol-slider-track': 'var(--kol-surface-on-primary)' }}` on the
component, or the variable set once on the instrument's own wrapper, both work
now.
