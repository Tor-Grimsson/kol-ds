---
component: Pill (+ Tag, chip family)
source: kol-website apps/brand /review · packages/component/src/atoms/Pill.jsx · packages/theme (pill classes)
date: 2026-07-30
status: issue — DS decision needed
deps: [Tag, Badge]
---

# Pill — wrong defaults, and a missing `primary` variant

Consumer-side finding from the brand audit. Nothing was changed DS-side; call
sites now pass `size="sm" variant="subtle"` explicitly as the workaround.

## What the DS ships today

`Pill.jsx` signature: `({ children, variant = 'outline', size = 'md', className = '' })`

| axis | values | default | class map |
|---|---|---|---|
| variant | `outline` · `subtle` · `inverse` | **outline** | `.pill-outline` · `.pill-subtle` · `.pill-inverse` |
| size | `sm` · `md` · `lg` | **md** | `.pill-sm` · `.pill-md` · `.pill-lg` |

JSX map and theme CSS agree exactly — three variants, three sizes, no orphans
on either side. There is **no `primary` variant**.

## The issues

1. **Default variant is `outline`** — contradicts the standing user law that
   nothing defaults to outline (Button defaults to primary; outline needs a
   stated reason). Pill is the one chip that opts out, and it looks like the
   elder file's behavior carried into the DS package unexamined during
   adoption rather than a re-decision.
2. **Default size is `md`** — the user's chip law is **sm by default** across
   the family. Same fix shape as the ThemeToggle rung work: the default should
   be the common case, not the loud one.
3. **No `primary` variant exists** — so "Pill defaults to primary" is
   currently unimplementable. Either add a `primary` (filled, matching the
   Button-primary treatment) and make it the default, or rule that `subtle`
   IS the primary-equivalent for chips and make THAT the default.

## User ruling so far (2026-07-30)

Consumers use **`subtle`** for static category markers. Whether `subtle`
becomes the new default (cheap, no new CSS) or a real `primary` variant is
authored first (fuller, matches the Button family) is the DS call to make —
the user said he'd fix it on this side.

## Related laws (context for whoever picks this up)

- Static label → **Pill**. Interactive/filterable → **Tag** (its states signal
  interaction; never use a Tag for something that isn't clickable). System
  status/count → Badge.
- Chip sizing: **sm**, not md.
- Tag has the same audit pending: check its default variant/size against these
  laws while Pill is open.

---
## ✅ RESOLVED 2026-07-30 — kol-component 0.14.0 (user ruling: "grey can be primary, outline secondary")
Pill joins Button's vocabulary: `primary` = the grey fill (`pill-subtle` classes, default) · `secondary` = outline · `inverse` unchanged. `subtle`/`outline` stay as deprecated aliases — zero breakage. Demo + Pill.mdx + api tables updated.
