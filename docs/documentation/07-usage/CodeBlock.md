# CodeBlock

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 18 across 11 files in 4 apps
- **Used in:** kol-client-canalix-contract, kol-divs, kol-labs-monorepo, kol-website

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
