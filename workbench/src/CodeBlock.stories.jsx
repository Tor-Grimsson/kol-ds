import { CodeBlock } from '@kolkrabbi/kol-component'

const jsx = `import { Button } from '@kolkrabbi/kol-component'

export default function Save() {
  return <Button iconLeft="check">Save</Button>
}`

const css = `.kol-card {
  padding: 24px;
  border-radius: 4px;
  background: var(--kol-fg-04);
}`

export const Jsx = () => <CodeBlock language="jsx">{jsx}</CodeBlock>

export const Css = () => <CodeBlock language="css">{css}</CodeBlock>

export const NoLanguage = () => <CodeBlock>{'npm install @kolkrabbi/kol-component'}</CodeBlock>
