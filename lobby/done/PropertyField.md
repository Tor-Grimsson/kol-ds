---
component: Input (property-field variant) — or a new atom
source: kol-fxr — inspector prefixed inputs (X/Y, W/H, R°, opacity %, corner radius, weight)
staged: 2026-08-12
status: draft
deps: [Input]
---

# PropertyField — the Figma property input: affordance + value + unit, ONE tight container

## Purpose
The rebuilt inspector needs Figma's property field everywhere: a filled container holding a dim affordance (letter `X` / `W` / `R`, or an icon), the bright value, and its unit **adjacent** — `X 240`, `0°`, `100%`, `⛶ 4`. The DS `Input` can't express it and the consumer is fighting it with hacks.

## Current behaviour
- `Input`'s `prefix`/`suffix` spans carry fixed `pr-1`/`pl-1`, and the inner `<input>` is either `flex-1` (suffix pushed to the far shell edge — `0      °`) or `size`-attr sized, which **number inputs ignore** per HTML.
- kol-fxr's stopgaps: `chars` to drop flex-1 + inline `width: Nch` recomputed per value length + negative-margin suffix nodes. It works ~80% and is exactly the two-ways-drift smell.

## Ask
A `variant="property"` on Input (or a `PropertyField` atom) with:
- `affordance` — letter string or icon node, dim (text-meta), fixed gap (~6px) to the value
- value hugs its own length (number-safe — don't rely on `size`); `unit` renders IMMEDIATELY after the value (0px gap): `0°`, `100%`, `-0.01em`
- shell fills its grid cell (w-full) with the content left-packed
- same draft/commit-friendly controlled API as Input (the editor wraps it in NumberField)

## States & interactions
Focus/disabled inherit Input's. No spinners (number type already hides them).

## Recreation notes
Every stopgap named above is live in kol-fxr `LayerInspector.jsx` (AxisField) + `TextPanel.jsx` (MetricInput) and gets deleted on adoption.

---

## Resolution (2026-08-12) — 🟢 closed

Shipped in **@kolkrabbi/kol-component@0.36.0** (registry-verified) as
`variant="property"` on Input — a behaviour variant riding the filled chrome:
`affordance` (letter or icon node, text-meta, 6px gap), the value hugs its own
length via mono ch-width (`calc(len·1ch + 2px)` — number-safe, no `size` attr),
`unit` renders immediately after the value (0 gap), shell `w-full`
left-packed. Controlled usage only (width tracks `value`). NB the existing
`PropertyInput` molecule (stacked label + Stepper) is a different anatomy and
stands untouched. Adoption is kol-fxr's: replace the AxisField/MetricInput
ch-width + negative-margin hacks.
