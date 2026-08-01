---
component: Button
source: packages/component/src/atoms/Button.jsx#L47-L60 · packages/theme/kol-components-atoms.css#L205-L241
date: 2026-08-01
status: draft
deps: [Button, Icon, IconFrame]
---

# ButtonIconOnlyParity

## Purpose

`Button` with `iconOnly` renders the same thing `IconFrame` does — one glyph in a
pinned square — but disagrees with it on glyph size and can't be made round.
Two fixes and one non-fix, all bringing the icon-only Button to the parity the
atom beside it already has.

Found from a live A/B in kol-website: `apps/brand/src/components/framework/SideNav.jsx`
renders an `IconFrame sm` and a `Button size="sm" iconOnly` stacked, as the same
control. Same declared size, **different glyph**.

## The defect — icon-only takes the text-adjacent ladder

`Button.jsx:60`

```js
const resolvedIconSize = iconSize ?? (size === 'sm' ? 14 : size === 'lg' ? 18 : 16)
```

**One ladder, regardless of `iconOnly`.** The DS has two, and they split on
whether a label sits beside the glyph:

| Ladder | sm · md · lg | For |
|---|---|---|
| **Solo glyph** | **16 · 20 · 24** | an icon alone in a pinned square (28 · 32 · 36) |
| Text-adjacent | 14 · 16 · 18 | an icon inside a rung's line box, beside a label |

Stated in the DS, not inferred:

- `ThemeToggle.jsx:40` — *"solo 16/20/24 (the pinned-square pairing)"*
- `ThemeToggle.jsx:121` — *"Glyph law: text-adjacent stays inside the rung line box; solo takes the…"*
- `IconFrame.jsx:28-29` — *"the solo-glyph ladder (16/20/24 against the pinned squares 28/32/36)"*

So an icon-only Button puts a **text-adjacent glyph in a solo square** — at `sm`,
a 14 glyph in a 28 box where the law says 16.

**This exact fault has already been fixed once, in the mirror direction.**
framework **0.10.3** fixed `hop-bare` because it *"took the SOLO glyph ladder
despite carrying a label"* (`ThemeToggle.jsx:151`). Button is the same bug with
the ladders swapped, and it was never caught because nothing rendered the two
side by side until now.

### Fix

```js
const SOLO = { sm: 16, md: 20, lg: 24 }
const ADJACENT = { sm: 14, md: 16, lg: 18 }
const ladder = iconOnly ? SOLO : ADJACENT
const resolvedIconSize = iconSize ?? ladder[size] ?? ladder.md
```

`iconSize` keeps overriding either. Zero CSS.

⚠ **This is a visual break** — every existing `iconOnly` call site gains 2px of
glyph. That is the point (they are currently wrong), but it wants a minor bump
and a changeset note, not a silent patch. Known call sites in this repo:
`ShapeDropdown.jsx:69` and `AlignmentGrid.jsx:43` both pass explicit `iconSize`,
so **both are already immune**.

## New prop — `radius`

`.kol-btn` hardcodes `border-radius: var(--kol-radius-sm)`
(`kol-components-atoms.css:209`). There is no way to get a round button, so
edge-straddling and avatar-style controls hand-roll one.

Mirror `IconFrame`'s prop exactly — same name, same two values, same reasoning:

| prop | type | default | controls |
|------|------|---------|----------|
| `radius` | `'sm'` \| `'full'` | `'sm'` | `sm` = the system radius token · `full` = a full round |

`IconFrame.jsx:37-41` states the rule this must not contradict: *"Two values,
nothing between: a round frame is its own chrome idiom (edge-straddling controls,
avatars), and it is the only sanctioned exception to the hard [4px] repo
invariant."* Same words apply here.

CSS: one class beside the existing IconFrame one.

```css
.kol-btn-radius-full { border-radius: 9999px; }
```

Not a `--kol-radius-full` token — `.kol-icon-frame-radius-full` already carries
the literal (`kol-components-atoms.css:902`), and inventing a token for one
value used by two classes adds a name without adding a source of truth. **Claim,
not a shrug: no `--kol-*` token holds a full-round radius today.** If the DS
wants one, it should land in `kol-theme.css` beside `--kol-radius-sm` and both
classes should read it — that is a separate call.

## Already exists — do not re-add

**`iconSize` is already on Button** (`Button.jsx:47`, resolved at `:60`), and it
is the precedent the same prop was copied *from* when it was added to `IconFrame`
in component **0.15.3**. Consumers: `ShapeDropdown.jsx:69` (`iconSize={10}`),
`AlignmentGrid.jsx:43` (`iconSize={16}`), `Input.jsx:46` carries the twin.

The only change it needs is the one above: what it falls back to.

## Props after this brief

| prop | type | default | controls |
|------|------|---------|----------|
| `iconOnly` | string | — | icon name; makes the button a pinned square |
| `iconSize` | number | `null` | glyph px — overrides the ladder |
| `radius` | `'sm'` \| `'full'` | `'sm'` | **new** |
| `size` | `sm` \| `md` \| `lg` | `'md'` | square 28/32/36, glyph now 16/20/24 when `iconOnly` |

## Recreation notes

- **Tier: atom**, edit in place — this is a defect fix plus one additive prop, not a rebuild.
- The two ladders should become **named constants**, not inline ternaries. Half
  the reason this survived is that `(size === 'sm' ? 14 : …)` doesn't look like a
  ladder, so nobody compared it to the one in `IconFrame`.
- **Consider hoisting both ladders to one shared module.** They are currently
  transcribed in at least four places — `Button.jsx:60`, `IconFrame.jsx:44`,
  `Input.jsx` (`ICON_SIZE`), `Tag.jsx:40` (`ICON_SIZES`) — and this defect is
  exactly what independent transcriptions produce. That is the real fix; the
  ternary swap is the patch.
- Version: additive prop shipped as a patch on this component before (`radius`
  on IconFrame went 0.15.1 → 0.15.2), but the glyph change is a **visual break**
  — minor bump is the honest call.

## Open question for the DS

Does the ladder correction apply to `quiet` icon-only chrome too (e.g.
`ShapeDropdown`'s `iconSize={10}` deliberately undercuts both ladders)? Those
pass explicit sizes so nothing moves, but if a third "chrome" rung is real it
should be named rather than left as magic numbers at call sites.
