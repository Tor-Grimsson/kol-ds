# AccordionPanel

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 24 across 14 files in 10 apps
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-editor, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-website

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
