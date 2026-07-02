# Accordion

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 10 across 10 files in 7 apps
- **Used in:** kol-client, kol-client-ac, kol-client-hrafn, kol-client-kolkrabbi, kol-editor, kol-labs-single, kol-lightroom

## Import

```jsx
import { Accordion } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-client/kol-client/src/pages/foundations/ColorTokens.jsx`:

```jsx
<Accordion>
        <AccordionPanel title="Brand"     meta={`${BRAND.length} tokens`} defaultOpen>
          <TokenTable rows={BRAND} />
```

From `kol-apparat/kol-editors/kol-editor/_a-torg/_kol-packages-reference/kol-framework/src/primitives/Accordion.jsx`:

```jsx
<Accordion>
```

From `kol-client/kol-client/src/pages/foundations/ColorUI.jsx`:

```jsx
<Accordion>
        <AccordionPanel title="Neutrals" meta={`${NEUTRALS.length} tokens`} defaultOpen>
          <div className="kol-prose mb-6">
            <p>
              Cool grey scale — slate-leaning to contrast warm burgundy. Surfaces
              go dark-to-light in dark mode; ink runs the inverse. Border and divider
              split the remaining structural duties.
            </p>
          </div>
          <SwatchGrid items={NEUTRALS} />
```

From `kol-client/kol-client/src/pages/foundations/TypographySections.jsx`:

```jsx
<Accordion>
          {active.display && (
            <AccordionPanel
              title="Display"
              meta={`${active.display.length} specimens`}
              defaultOpen
            >
              {active.display.map((d) => (
                <DisplaySpec key={d.token} family={active.label} fontFamily={active.family} spec={d} />
```
