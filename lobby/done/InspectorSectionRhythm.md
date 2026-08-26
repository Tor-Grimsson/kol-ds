# InspectorSectionRhythm — `Section` needs the divider + density it is already faked around

**Staged:** 2026-08-15 · from **kol-fxr** (kol-design-editor)
**Nature:** action ticket. Close bar: a consumer stacking `Section`s in a rail
needs ZERO local CSS to get correct spacing and dividers.

## The ask

`molecules/Section.jsx` today is label + `flex flex-col gap-2` + children.
That is the anatomy but not the rhythm — it has no notion of what happens
*between* two Sections. Every consumer that stacks them in an inspector rail
therefore writes the same local CSS.

Give `Section` the between-siblings treatment:

- **`divided`** (or a `SectionStack` parent that owns it) — a hairline between
  adjacent sections: `border-top: 1px solid var(--kol-fg-08)` on
  `section + section`, with the pad below it.
- **`density`** — the rail case wants a tighter inner gap than `gap-2`.

## The evidence — what kol-fxr maintains locally today

`src/editor/labs/labs.css`, the entire param-density block:

```css
.kol-editor-labs .kol-params-section          { gap: 0.5rem; }
.kol-editor-labs .kol-params-section + .kol-params-section {
  border-top: 1px solid var(--kol-fg-08);
  padding-top: 1.25rem;
}
```

`.kol-params-section` is a hook class the consumer puts on every `Section` for
the sole purpose of reaching them from CSS. That class should not need to
exist.

**Numbers, for reference, not as a demand:** 8px inner gap, hairline at
`--kol-fg-08`, 20px pad below the rule. The 20px above comes from the rail
body's own `gap-5`, so a symmetric space–divider–space falls out. Whether the
DS wants those exact values is the DS's call — the point is that the rule
belongs to `Section`, not to five consumers each retyping it.

## Why it went there

The user's ruling this session, verbatim in effect: *"you dont need to maintain
labs css locally, what is the point? what is there that isnt answered in kol
ui?"* Section spacing and dividers are component anatomy. A consumer deciding
them per-repo is how two repos end up with different rail rhythms.

## Related, same root

The repo also carried `.kol-editor-labs .kol-helper-10.tracking-widest {
text-transform: uppercase }` — a local override re-imposing a casing the DS had
deliberately dropped. It has been **deleted** (2026-08-15), not filed: the DS
policy (casing is authored, never transformed) is correct and the consumer was
wrong. Noted only because it is the same disease as the block above — consumer
CSS reaching into DS atoms because the atom did not cover the case.

## What stays in kol-fxr

- The `.kol-params-section` hook class + the two rules, live until this ships.
- **On ship: adopt.** Delete the block, drop the hook class, pass the prop.

## ✅ RESOLUTION — 2026-08-15 · kol-component@0.46.0 + kol-theme@0.43.0

`Section` gained a `divided` prop; the hairline is `.kol-section--divided + .kol-section--divided` (border-top --kol-fg-08, padding-top 20px). The rule sits on the ADJACENT PAIR, so the first section in a stack never carries a stray top border and no consumer needs :not(:first-child) — that pair selector is exactly what cannot be expressed as a utility class, which is why every consumer had to invent a hook class. The ticket's second ask, `density`, was deliberately NOT built: kol-fxr's local override is `gap: 0.5rem`, which is exactly Section's shipped `gap-2` — a no-op, so there is no second density to name until a real one appears.

**Remainder here:** none — kol-fxr bump, then delete the .kol-params-section hook class and both its rules from labs.css.

