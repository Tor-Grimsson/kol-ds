# CodeBlock

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 18 across 11 files in 4 apps
- **Weighted inbound:** 33★ across 11 edges — 11×3★
- **Used in:** kol-client-canalix-contract, kol-divs, kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 2 | `kol-apps/kol-divs/src/pages/Box.jsx` |
| 3 | 2 | `kol-apps/kol-divs/src/pages/Flex.jsx` |
| 3 | 2 | `kol-apps/kol-divs/src/pages/Grid.jsx` |
| 3 | 2 | `kol-apps/kol-labs-monorepo/apps/divs/src/pages/Box.jsx` |
| 3 | 2 | `kol-apps/kol-labs-monorepo/apps/divs/src/pages/Flex.jsx` |
| 3 | 2 | `kol-apps/kol-labs-monorepo/apps/divs/src/pages/Grid.jsx` |
| 3 | 2 | `kol-website/apps/web/src/workshop-system/docs/DocumentationReader.jsx` |
| 3 | 1 | `kol-apps/kol-client-canalix-contract/src/pages/foundations/Overview.jsx` |
| 3 | 1 | `kol-apps/kol-divs/src/pages/Recipes.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/divs/src/pages/Recipes.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/workshop/Documentations.jsx` |

## Import

```jsx
import { CodeBlock } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-canalix-contract/src/pages/foundations/Overview.jsx`:

```jsx
<CodeBlock>{`/* primitive → never changes with theme */
--iris-600: #5A50C8;

/* semantic → swaps light / dark */
[data-mode="light"] { --text-primary: var(--neutral-950); }
[data-mode="dark"]  { --text-primary: var(--neutral-50); }`}</CodeBlock>
```

From `kol-apps/kol-divs/src/pages/Box.jsx`:

```jsx
<CodeBlock language="tailwind">{codeString}</CodeBlock>
          <CodeBlock language="css">{cssString}</CodeBlock>
        </div>
      </div>

      <div className="bg-fg-04 rounded-sm p-6 mt-6 flex flex-col gap-4">
        <ControlRow label="display">
          <ViewToggle viewMode={display} onViewChange={setDisplay} options={DISPLAY_OPTIONS} />
```

From `kol-apps/kol-labs-monorepo/apps/divs/src/pages/Box.jsx`:

```jsx
<CodeBlock language="css">{cssString}</CodeBlock>
        </div>
      </div>

      <div className="bg-fg-04 rounded-sm p-6 mt-6 flex flex-col gap-4">
        <ControlRow label="display">
          <ViewToggle viewMode={display} onViewChange={setDisplay} options={DISPLAY_OPTIONS} />
```

From `kol-website/apps/web/src/routes/workshop/Documentations.jsx`:

```jsx
<CodeBlock
          key={blockKey}
          code={block.lines.join('\n')}
          language={block.lang}
        />
```

From `kol-apps/kol-divs/src/pages/Flex.jsx`:

```jsx
<CodeBlock language="tailwind">{classes}</CodeBlock>
          <CodeBlock language="css">{cssString}</CodeBlock>
        </div>
      </div>

      <div className="bg-fg-04 rounded-sm p-6 mt-6 flex flex-col gap-4">
        <ControlRow label="direction"><ViewToggle viewMode={dir}   onViewChange={setDir}   options={DIRECTIONS} />
```
