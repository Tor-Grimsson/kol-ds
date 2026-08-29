---
title: Motion
type: reference
status: active
created: 2026-08-28
updated: 2026-08-28
description: One sheet for every keyframe and motion class
sources:
  - packages/theme/kol-animation.css
  - packages/component/src/utilities/motion.js
  - scripts/validate-motion.mjs
tags:
  - domain/tokens
  - audience/consumer
related:
  - "[[01-tokens|tokens]]"
  - "[[../03-components/05-control-chrome|control chrome]]"
---

# Motion

Every animation in the design system lives in **one file**: `kol-animation.css`
(kol-theme ≥0.84.0), imported last by both entries. User ruling 2026-08-28:
*"shouldn't we localise animation to its own css?"* — a rule given before and
agreed to repeatedly without ever landing, because each agent wrote its motion
beside the component it was building. Gate 23 is what makes it stick.

## The sheet

| | |
|---|---|
| Keyframes | **all of them.** A keyframe name is global whichever file declares it, so there is no cost to one home and no way to keep six |
| Named motion classes | a class whose whole job is to move something — `.kol-link-underline` · `.kol-media-zoom` · `.kol-media-fade` · `.kol-card.has-reveal` · `.kol-roll*` · `.kol-content-title-dim` · `.kol-collection-item` · the feature/split hover zooms · `.kol-rail-grab` |
| Reduced motion | every `prefers-reduced-motion` block. They were the tell that this file was missing: five of them, four sheets, each written by whoever was in that file |
| Scroll entrance | the reveal family — `.kol-reveal` · `-group` · `-from-left` · `-from-right`, revealed by a consumer's `.is-visible`, staggered by `--kol-reveal-delay`. Promoted from kol-website 2026-08-28; the bare `.reveal*` names stay as aliases for its live call sites |

## Excluded

A bare `transition:` inside a component's own **rest rule** — `.kol-btn`'s
background-color, `.kol-card`'s border-color. Pulling those out means two rules
for one selector, and two rules for one selector drift. **Named animations move,
per-property easing stays.**

A domain pack's physics — the foundry's pressure damping, the marquee's px/s, a
scroll-scrub timeline — is content, not chrome. It stays with its component.

## Tweens

CSS cannot express a gsap tween or a framer spring, so the same numbers are
mirrored in `@kolkrabbi/kol-component/utilities/motion`:

```js
import { EASE, DURATION, SPRING, GRAB, s } from '@kolkrabbi/kol-component/utilities/motion'
```

`EASE` (house · bounce · longFade, with the gsap-named equivalents), `DURATION`
in ms with `s()` for the tween libraries, `SPRING` (the Tilt family's two sets),
`GRAB` (the rail pill's pointer behaviour — hysteresis, marks, tweens, click
slop). `useTilt` and `ActionButton` read it; a hand-typed
`duration: 0.5, ease: 'power3.out'` in a component is a finding.

## Naming

Keyframes are `kol-*`, always — the namespace law applies here more than
anywhere, because keyframe names are global and a collision is silent. Not a
hypothetical: **Tailwind's `animate-pulse` emits `@keyframes pulse`**, every
consumer repo is on Tailwind, and two definitions of one name are resolved by
source order with no error (kol-mirror, 2026-08-28). The
chess pack's `pulse` / `fadeIn` / `numberTick` / `lineDraw` were renamed
`kol-chess-*` when the sheet was minted (2026-08-28).

## The gate

`scripts/validate-motion.mjs` (`pnpm validate:motion`, the 23rd gate):

- **M1** no `@keyframes` outside `kol-animation.css`
- **M2** every keyframe name is `kol-*`
