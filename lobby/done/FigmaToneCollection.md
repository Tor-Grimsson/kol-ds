---
component: Figma library — tone as a variable collection
source: kol-ds-ui/packages/component/src/utilities/tone.js · Figma ❖ library--kol-ds-ui (n48kE2bJtrFjl7wxst30xH)
staged: 2026-10-31
status: draft
deps: [Button, Dropdown, every toned control]
---

# FigmaToneCollection

## Purpose
In code, tone is a token switch: a `kol-tone-*` class on any ancestor sets the `--kol-tone-*` bundle and every control under it paints from that, else its family's fallback (`utilities/tone.js`, tone-is-the-ground-axis 2026-09-03). The Figma library doesn't model it. Tone exists only as a **variant on Button** (`tone`: primary · secondary · inverted · ghost · sunken · outline), and Dropdown has no tone at all (`variant`: filled · outline, `size`). The user, 2026-10-31, from kol-atlas: *"how would you change tone on dropdown?"* — today you can't. The `color` collection holds only `tone/border`.

## Anatomy
- New variable collection `tone`, modes = the code's `TONES`: primary · secondary · inverted · outline · ghost · grey · sunken (`default` is not a mode; it is "no explicit mode", inherit).
- Variables = the bundle in `TONE_VARS`: bg · fg · border · hover-bg · hover-fg · hover-border · active-bg · pressed-bg · pressed-fg · panel-bg · panel-border(-w) (image fields where Figma can carry them). Each aliases the `color` collection (`fg/*`, `oq/*`, `surface/*`), so Light/Dark still flips them.
- Toned components bind their fills, strokes and text to `tone/*`, never to a variant per tone.

## Variants
- **Retires:** Button's `tone` variant (6 options) — the mode replaces it. Button keeps `variant` accent · danger · nav (· tab · tab-filled · float as they are).
- Dropdown keeps `variant` filled · outline and `size`; tone comes from the mode.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| tone (variable mode) | mode on frame / instance | inherit (Auto) | ground + ink bundle of every control inside |

## Styling
Values come straight from kol-theme's TONE bundles (`kol-components-molecules.css`), per mode, aliased to existing `color` variables — no raw hex.

## States & interactions
hover / active / pressed read `tone/hover-*`, `tone/active-*`, `tone/pressed-*`; disabled stays as today.

## Dependencies
`color` collection (Light/Dark). Consumers: Button, Dropdown, Input, IconToggle, Pill, TabsRow and every control that reads `--kol-tone-*` in code.

## Recreation notes
Library work in Figma (kol-figma-agent). Set the mode on a wrapper frame and every control inside follows, exactly like a `kol-tone-*` wrapper in code. Migrating existing Button instances: map each `tone=X` instance to mode X before the variant is removed. Publish, then consumers (kol-atlas proxy--atlas lab boards) swap.

## ✅ RESOLUTION — 2026-10-31 · figma library (unpublished — the user publishes)

tone collection (7 modes, 16 vars aliasing color/*); Button/Dropdown/Input/Textarea bound to tone/*; Button tone variant retired, 128 instances moved to explicit modes; specimen on 02-styleguide; Code Connect republished

**Remainder here:** none — kol-atlas bump figma library (unpublished — the user publishes).

