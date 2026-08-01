# AccordionPanel

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 24 across 14 files in 10 apps
- **Weighted inbound:** 46★ across 14 edges — 1×5★ · 2×4★ · 11×3★
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-editor, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 5 | 3 | `kol-apps/kol-client/src/pages/foundations/ColorReasoning.jsx` |
| 4 | 5 | `kol-apps/kol-client/src/pages/foundations/ColorTokens.jsx` |
| 4 | 4 | `kol-apps/kol-client/src/pages/foundations/TypographySections.jsx` |
| 3 | 2 | `kol-apps/kol-client/src/pages/foundations/ColorUI.jsx` |
| 3 | 1 | `kol-apps/kol-client/src/components/framework/primitives/Accordion.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/components/primitives/Accordion.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/website/src/components/primitives/Accordion.jsx` |
| 3 | 1 | `kol-apps/kol-client-hrafn/src/components/primitives/Accordion.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/components/primitives/Accordion.jsx` |
| 3 | 1 | `kol-apps/kol-editor/_a-torg/_kol-packages-reference/kol-framework/src/primitives/Accordion.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/packages/component/src/primitives/Accordion.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/components/primitives/Accordion.jsx` |
| … | | _2 more_ |

## Import

```jsx
import { AccordionPanel } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client/src/pages/foundations/ColorTokens.jsx`:

```jsx
<AccordionPanel title="Brand"     meta={`${BRAND.length} tokens`} defaultOpen>
          <TokenTable rows={BRAND} />
```

From `kol-apps/kol-client-ac/src/components/primitives/Accordion.jsx`:

```jsx
<AccordionPanel>
```

From `kol-apps/kol-client/src/pages/foundations/ColorTokens.jsx`:

```jsx
<AccordionPanel title="Surfaces"  meta={`${UI_SURFACE.length} tokens`}>
          <TokenTable rows={UI_SURFACE} />
```

From `kol-apps/kol-client/src/pages/foundations/ColorTokens.jsx`:

```jsx
<AccordionPanel title="Text"      meta={`${UI_INK.length} tokens`}>
          <TokenTable rows={UI_INK} />
```

From `kol-apps/kol-client/src/pages/foundations/ColorTokens.jsx`:

```jsx
<AccordionPanel title="Structure" meta={`${UI_STRUCTURE.length} tokens`}>
          <TokenTable rows={UI_STRUCTURE} />
```
