# CodeBlock

- **Package:** `@kolkrabbi/kol-component`
- **Category:** primitives
- **Real-world usages found:** 7 across 4 files in 1 apps
- **Used in:** kol-divs

## Import

```jsx
import { CodeBlock } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-docs/kol-divs/src/pages/Box.jsx`:

```jsx
<CodeBlock language="tailwind">{codeString}</CodeBlock>
          <CodeBlock language="css">{cssString}</CodeBlock>
        </div>
      </div>

      <div className="bg-fg-04 rounded-sm p-6 mt-6 flex flex-col gap-4">
        <ControlRow label="display">
          <ViewToggle viewMode={display} onViewChange={setDisplay} options={DISPLAY_OPTIONS} />
```

From `kol-apparat/kol-docs/kol-divs/src/pages/Box.jsx`:

```jsx
<CodeBlock language="css">{cssString}</CodeBlock>
        </div>
      </div>

      <div className="bg-fg-04 rounded-sm p-6 mt-6 flex flex-col gap-4">
        <ControlRow label="display">
          <ViewToggle viewMode={display} onViewChange={setDisplay} options={DISPLAY_OPTIONS} />
```

From `kol-apparat/kol-docs/kol-divs/src/pages/Flex.jsx`:

```jsx
<CodeBlock language="tailwind">{classes}</CodeBlock>
          <CodeBlock language="css">{cssString}</CodeBlock>
        </div>
      </div>

      <div className="bg-fg-04 rounded-sm p-6 mt-6 flex flex-col gap-4">
        <ControlRow label="direction"><ViewToggle viewMode={dir}   onViewChange={setDir}   options={DIRECTIONS} />
```

From `kol-apparat/kol-docs/kol-divs/src/pages/Flex.jsx`:

```jsx
<CodeBlock language="css">{cssString}</CodeBlock>
        </div>
      </div>

      <div className="bg-fg-04 rounded-sm p-6 mt-6 flex flex-col gap-4">
        <ControlRow label="direction"><ViewToggle viewMode={dir}   onViewChange={setDir}   options={DIRECTIONS} />
```

From `kol-apparat/kol-docs/kol-divs/src/pages/Grid.jsx`:

```jsx
<CodeBlock language="tailwind">{codeString}</CodeBlock>
          <CodeBlock language="css">{cssString}</CodeBlock>
        </div>
      </div>

      <div className="bg-fg-04 rounded-sm p-6 mt-6 flex flex-col gap-4">
        <ControlRow label="view">
          <ViewToggle viewMode={view} onViewChange={setView} options={VIEW_OPTIONS} />
```
