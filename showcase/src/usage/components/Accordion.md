# Accordion

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 13 across 13 files in 10 apps
- **Weighted inbound:** 39★ across 13 edges — 13×3★
- **Used in:** kol-client, kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-editor, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client/src/components/framework/primitives/Accordion.jsx` |
| 3 | 1 | `kol-apps/kol-client/src/pages/foundations/ColorTokens.jsx` |
| 3 | 1 | `kol-apps/kol-client/src/pages/foundations/ColorUI.jsx` |
| 3 | 1 | `kol-apps/kol-client/src/pages/foundations/TypographySections.jsx` |
| 3 | 1 | `kol-apps/kol-client-ac/src/components/primitives/Accordion.jsx` |
| 3 | 1 | `kol-apps/kol-client-acyr-website/apps/website/src/components/primitives/Accordion.jsx` |
| 3 | 1 | `kol-apps/kol-client-hrafn/src/components/primitives/Accordion.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/src/components/primitives/Accordion.jsx` |
| 3 | 1 | `kol-apps/kol-editor/_a-torg/_kol-packages-reference/kol-framework/src/primitives/Accordion.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/packages/component/src/primitives/Accordion.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/components/primitives/Accordion.jsx` |
| 3 | 1 | `kol-apps/kol-lightroom/src/components/primitives/Accordion.jsx` |
| … | | _1 more_ |

## Import

```jsx
import { Accordion } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client/src/pages/foundations/ColorTokens.jsx`:

```jsx
<Accordion>
        <AccordionPanel title="Brand"     meta={`${BRAND.length} tokens`} defaultOpen>
          <TokenTable rows={BRAND} />
```

From `kol-apps/kol-client-ac/src/components/primitives/Accordion.jsx`:

```jsx
<Accordion>
```

From `kol-apps/kol-client/src/pages/foundations/ColorUI.jsx`:

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

From `kol-apps/kol-client/src/pages/foundations/TypographySections.jsx`:

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
