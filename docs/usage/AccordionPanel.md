# AccordionPanel

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 21 across 11 files in 7 apps
- **Used in:** kol-client, kol-client-ac, kol-client-hrafn, kol-client-kolkrabbi, kol-editor, kol-labs-single, kol-lightroom

## Import

```jsx
import { AccordionPanel } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-client/kol-client/src/pages/foundations/ColorTokens.jsx`:

```jsx
<AccordionPanel title="Brand"     meta={`${BRAND.length} tokens`} defaultOpen>
          <TokenTable rows={BRAND} />
```

From `kol-apparat/kol-editors/kol-editor/_a-torg/_kol-packages-reference/kol-framework/src/primitives/Accordion.jsx`:

```jsx
<AccordionPanel>
```

From `kol-client/kol-client/src/pages/foundations/ColorTokens.jsx`:

```jsx
<AccordionPanel title="Surfaces"  meta={`${UI_SURFACE.length} tokens`}>
          <TokenTable rows={UI_SURFACE} />
```

From `kol-client/kol-client/src/pages/foundations/ColorTokens.jsx`:

```jsx
<AccordionPanel title="Text"      meta={`${UI_INK.length} tokens`}>
          <TokenTable rows={UI_INK} />
```

From `kol-client/kol-client/src/pages/foundations/ColorTokens.jsx`:

```jsx
<AccordionPanel title="Structure" meta={`${UI_STRUCTURE.length} tokens`}>
          <TokenTable rows={UI_STRUCTURE} />
```
