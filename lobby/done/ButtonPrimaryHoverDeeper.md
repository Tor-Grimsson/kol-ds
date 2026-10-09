---
component: Button (tone primary, hover)
source: kol-fxr/src/editor/compose/inspectors/LayerInspector.jsx#L275
staged: 2026-10-09
status: draft
deps: [Button]
---

# ButtonPrimaryHoverDeeper — `tone="primary"` greys on hover; it should go deeper

## Purpose
The user, 2026-09-03 (editor-chrome-review #15), on the inspector's full-width *Shape parameters* row (`Button tone="primary" size="sm" className="w-full"`): *"this button tone primary, has werid hover state ... should not grey - should go deeper? go to primary or teriry or oq-ab-\* something"*. Held as his ruling; filed now from plan 20 § 8 (kol-fxr, 2026-10-09) with the ruling as the ask: **hover goes deeper, never flatter.**

## Anatomy
`.kol-btn.kol-tone-primary` — rest fill, hover fill, pressed fill (kol-theme's button sheet).

## Variants
Every size; `quiet` and `pressed` untouched — this is the plain primary's hover only.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| — | — | — | a theme rule, no prop |

## Styling
- Today (kol-theme 0.169.0, light): the primary fill lightens toward grey on hover — reads as disabled-ish.
- Ask: hover one step DEEPER than rest (the opaque ladder's next step — `oq-ab-*` in his words — or the tertiary fill), pressed one more. Dark theme mirrors: deeper = toward the surface's far end.
- Nothing hand-rolled in kol-fxr; the row is the DS button as shipped.

## States & interactions
rest → hover (deeper) → active (deeper still) → disabled (unchanged).

## Dependencies
kol-theme's `kol-btn` tone rules; `Button`.

## Recreation notes
A kol-theme minor; the showcase's button page shows the three steps side by side so the user rules on the depth. kol-fxr needs only the bump.


---

## Resolution — 2026-10-09 · 🟢 closed

**Shipped `@kolkrabbi/kol-theme@0.170.0`.** Measured first: the rungs came off the PAGE's ladder,
which runs the other way from the rest fill — light rest 242 → hover 245 (lighter: the grey he
reported) → press 224; dark rest 25 → hover 10 → press 31 (lighter). One step was wrong in each
theme. Hover and press now step DOWN from the rest fill itself, 8 then 16, in both themes:
light 242 → 234 → 226, dark 25 → 17 → 9 (`rgb(from var(--kol-surface-secondary) calc(r - 8) …)`).
Built on the recommendation; Round 9 on the open-questions page shows the three steps in both
themes for his review.

For fxr: bump kol-theme to ^0.170.0; nothing else.
