# FocusRingsInConsumers — the showcase has no focus rings, a consumer gets them

**Staged:** 2026-08-15 · from **kol-fxr** (kol-design-editor)
**Nature:** action ticket. Close bar: a consumer app importing kol-theme +
kol-framework gets the same focus behaviour the DS showcase has, with zero
local CSS.

## The report

The kol-ds-ui showcase renders **no focus rings**. kol-fxr, importing the
published theme + framework, gets them — the browser default on anything the
DS does not style, plus the DS's own `:focus-visible` treatments where it does
(`.kol-btn`, `.kol-seg-cell`, `.shell-nav-item`, the `focus-visible:ring-focus`
utility).

The user does not want them, and does not want to maintain a local override to
suppress them. Whatever the showcase does to end up ringless is the thing that
should ship to consumers.

## What to work out on the DS side

- What the showcase does that a consumer does not get — a reset in the app
  layer that never made it into the published base, an import order, or a
  token that resolves to nothing there and to a real colour here.
- Whether focus treatment should be a **token-level opt-out** (a consumer sets
  one variable to turn the whole system off) rather than each consumer writing
  `outline: none !important`.

Not prescribing the fix — the DS owns this and has evidently already solved it
once. This ticket is the report, not the design.

## What stays in kol-fxr

- A local `outline: none !important` block in
  `src/editor/styles/kol-editor.css`, kept ONLY so the rings are gone today.
  **Declared stopgap — delete it on adopt.**

## ✅ RESOLUTION — 2026-08-15 · kol-theme@0.43.0

`--kol-focus-ring-quiet` minted; the pair is now a real off switch. TWO PREMISES IN THE TICKET WERE WRONG, and naming them matters more than the fix: (1) the showcase does NOT suppress focus rings — showcase/src/index.css is its only stylesheet and contains zero outline and zero :focus-visible rules, so there was never anything to port; (2) there is no 'outline: none !important' block in kol-editor.css — the real rule is narrow and unflagged, plain outline:none on input/textarea :focus-visible inside .kol-editor-shell. THE ACTUAL DEFECT: --kol-focus-ring existed but only half the rules read it. .kol-btn / .toggle-switch / .focus-visible:ring-focus read the token; the nav rails and .kol-seg-cell hardcoded their colours. So setting it transparent killed button rings and kept rail rings — a half-working opt-out, which is exactly why a consumer ended up writing local CSS. Now --kol-focus-ring is the loud 2px ring and --kol-focus-ring-quiet the 1px inset one; EVERY focus rule in the theme reads one of the two, no hardcoded focus colours remain anywhere. Defaults reproduce today's values, so nothing moved visually. NB both rings are white — --kol-accent-primary resolves to --kol-surface-on-primary (#fafafa dark / #121215 light) — the two differ in weight, not hue. .kol-seg-cell was rewired on the user's explicit call and its ring dims full-white to 32%; that one is a visual change, deliberate, his.

**Remainder here:** none — kol-fxr bump, delete the input/textarea outline:none rule from kol-editor.css, set both --kol-focus-ring and --kol-focus-ring-quiet to transparent if you want them fully off.

