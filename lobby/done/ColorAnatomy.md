---
component: ColorAnatomy
source: kol-monorepo/apps/brand (component deleted upstream; re-authored from surviving CSS .kol-anatomy-sample in packages/framework/kol-framework.css#L1123-L1137)
date: 2026-07-10
status: draft
deps: [ColorSwatch]
---

# ColorAnatomy

## Purpose
A token-composition specimen — a figure that documents how a composed color is
built from tokens. It shows a color **sample**, the inline `<code>` **token
expression** that produced it (e.g. `color-mix(in srgb, var(--kol-fg-16),
transparent)` or a bare `--kol-fg-48`), and an italic **figcaption** describing
it. The upstream component was deleted; only the `.kol-anatomy-sample` CSS
survived, so the JSX is re-authored from that CSS contract + purpose.

## Anatomy
```
figure.kol-anatomy-sample (flex flex-col items-start gap-2)
├─ {sample}      OR  <ColorSwatch hex size={96} radius="sm" />   (color sample)
├─ code          (token / color-mix expression)   [code]  — styled by CSS
└─ figcaption    (italic description)              [caption] — styled by CSS
```

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| sample | node | — | sample node rendered as-is (full control of size/shape) |
| hex | string | — | color for the fallback `ColorSwatch` (ignored if `sample` given) |
| code | string | — | token / color-mix expression shown in the inline `<code>` |
| caption | string | — | italic figcaption description (author casing at call site) |

## Styling
- Figure: `.kol-anatomy-sample` + inline `flex flex-col items-start gap-2` layout.
- Sample: consumer node, or DS `ColorSwatch` (`size={96} radius="sm"` → 4px).
- Code chip: `.kol-anatomy-sample code` (framework CSS) → `font-family:var(--kol-font-family-mono)`, `font-size:11px`, `background:color-mix(in srgb, currentColor 18%, transparent)`, `padding:1px 4px`, `border-radius:3px`.
- Figcaption: `.kol-anatomy-sample figcaption` (framework CSS) → `margin-top:12px`, `font-size:12px`, `color:var(--kol-fg-48)`, `font-style:italic`.
- **Type note:** the two text descendants are styled by the surviving CSS, which is
  already fully token-based (`var(--kol-fg-48)`, `var(--kol-font-family-mono)`).
  Inline kol type classes are deliberately NOT layered on `code`/`figcaption` —
  they would conflict on font-size (11px vs `kol-mono-12`'s 12px) and font-style
  (italic prose vs mono). Reusing the CSS is the conformant path here.

## Recreation notes
Tier: **styleguide molecule**. No new CSS — reuse the surviving `.kol-anatomy-sample`
descendant rules in `packages/framework/kol-framework.css`. Compose the DS
**`ColorSwatch`** for the fallback sample chip; the `sample` node prop lets a
consumer inject a rectangular/custom sample when a square swatch doesn't fit.
Keep the `<code>` as the token readout — that is the specimen's whole point
(showing the expression, not just the resolved color).
