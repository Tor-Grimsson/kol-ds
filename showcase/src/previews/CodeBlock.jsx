import { CodeBlock } from '@kolkrabbi/kol-component'

export const stage = 'lg'

/* Size rides the toolbar picker. */
export const sizes = ['sm', 'md']

export default function CodeBlockPreview({ size = 'md' }) {
  return (
    <CodeBlock language="jsx" size={size}>{`import { Button } from '@kolkrabbi/kol-component'

export default function Save() {
  return <Button tone="primary">Save changes</Button>
}`}</CodeBlock>
  )
}
