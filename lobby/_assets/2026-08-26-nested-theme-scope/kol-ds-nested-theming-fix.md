# KOL DS — make `data-theme` work on a subtree (nested theming)

**Status:** applied & verified in the `kol-resume` inlined copy; needs folding into canonical kol-labs DS.
**Files:** `kol-base-tokens.css`, `kol-opacity.css`
**Type:** 3 selector-list edits, **no token value changes.**

---

## Problem

Theme only flips at the root. `document.documentElement.dataset.theme = 'dark'` works,
but setting `data-theme="light"` (or `"dark"`) on any element *below* `<html>` flips the
surface but **not the text/ink** — semantic classes (`.text-emphasis`, `.text-body`,
`.text-meta`, fg-based borders) keep inheriting the root theme's ink. Result in a
dark app: a `data-theme="light"` pane renders near-white text on white.

## Root cause

The derived ink tokens are intermediate custom properties declared **only at `:root`**:

```css
/* kol-opacity.css */
:root {
  --kol-fg-08:       color-mix(in srgb, var(--kol-surface-on-primary) 8%, transparent);
  --kol-fg-emphasis: var(--kol-surface-on-primary);
  /* …14-stop ramp + named roles… */
}
```

A custom property's `var()` is resolved **at the element where that property is
declared**, and descendants inherit the *resolved* (frozen) value — they do not re-run
the `var()`. So `--kol-fg-emphasis` resolves once on `<html>` against the root's
`--kol-surface-on-primary` and freezes. A nested element that overrides
`--kol-surface-on-primary` has no local declaration of `--kol-fg-emphasis` to re-trigger
resolution, so the ink stays frozen at the root value.

Global toggle works only because it changes `--kol-surface-on-primary` **on `<html>`** —
the same element where the ink tokens are declared — so they re-resolve in place.

### Minimal proof

```css
:root  { --base: red;  --derived: var(--base); }
.scope { --base: limegreen; }
.a { color: var(--derived); }   /* renders RED   — intermediate frozen at :root */
.b { color: var(--base);    }   /* renders GREEN — direct, resolves at use-site */
```

`.a` and `.b` are both inside `.scope`. `.a` stays red; `.b` goes green. The DS's
`.text-*` classes are the `.a` case (they read an intermediate token); the raw
`.text-fg-*` / `.bg-fg-*` utilities are the `.b` case (they read the surface token
directly) and already flip correctly.

## Fix

Declare every token *derived from a themed surface token* on the **same selector list**
as the surface tokens — i.e. on the theme selectors, not only `:root`. Then a nested
theme scope re-resolves the ink at that element.

**`kol-base-tokens.css`** — light surfaces must match the nested selector too (dark
already did via `:is([data-theme="dark"], .dark)`):

```css
:root,
:is([data-theme="light"], .light) {
  --kol-surface-on-primary: #121215;
  /* …light surface tiers… */
}
```

**`kol-opacity.css`** — both fg blocks (the 14-stop ramp, and the named roles) go from
`:root` to:

```css
:root,
:is([data-theme="light"], .light),
:is([data-theme="dark"], .dark) {
  --kol-fg-01: …; /* … ramp … */ --kol-fg-96: …;
}

:root,
:is([data-theme="light"], .light),
:is([data-theme="dark"], .dark) {
  --kol-fg-subtle: var(--kol-fg-24);
  --kol-fg-meta:   var(--kol-fg-48);
  --kol-fg-body:   var(--kol-fg-64);
  --kol-fg-strong: var(--kol-fg-80);
  --kol-fg-emphasis: var(--kol-surface-on-primary);
}
```

Net effect: `data-theme="light|dark"` (and `.light`/`.dark`) now work at any nesting
level, both directions. No value changes; `:root` still matches, so existing root-level
theming is unchanged. This is the same mechanism `.bg-surface-inverse` already uses
(it re-declares the ramp for its scoped context) — generalized to the theme selectors.

## Verification

`vite build` + headless-Chrome screenshot of a `data-theme="light"` pane with the app
in dark mode: text renders dark-on-white, surrounding app chrome stays dark. Confirmed
before vs. after the edits.

## Scope / follow-ups

- **Other surface-derived tokens are still frozen at `:root`** and need the same
  treatment for *fully* robust nested theming. Audit at least:
  `--kol-border-default`, `--kol-border-focus`, `--kol-focus-ring`, and the
  `--kol-accent-*` family (all in `kol-color.css :root`). They derive from
  `--kol-surface-on-primary` / accent via `var()`/`color-mix` and will not flip on a
  subtree until co-located with the theme selectors.
- **`--kol-fg-absolute-*`** is theme-independent (derived from absolute black) — safe to
  leave; re-declaring it on theme selectors is harmless.
- **`@media (prefers-color-scheme: dark)`** sets dark surfaces on
  `:root:not([data-theme="light"])` only — auto-dark + nested theme is not covered by
  this change (explicit `data-theme` is).
- **Alternative (bigger) fix:** have the semantic `.text-*` classes resolve
  `--kol-surface-on-primary` at use-site (like the `.text-fg-*` utilities) instead of
  going through intermediate `--kol-fg-*` tokens. Removes the freeze entirely but touches
  every consumer of the intermediate tokens — not recommended unless doing a broader
  token refactor.

## Principle (for the DS going forward)

> Any token computed from a themed token (via `var()`/`color-mix`) must be declared on
> the **same selector set** as the token it depends on. Declaring a derived token only at
> `:root` freezes it to the root theme and breaks nested/scoped theming.
