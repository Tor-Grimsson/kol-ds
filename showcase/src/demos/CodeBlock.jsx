import { CodeBlock } from '@kolkrabbi/kol-component'

export const stage = 'lg'

/* Size rides the toolbar picker. */
export const sizes = ['sm', 'md']

export default function CodeBlockDemo({ size = 'md' }) {
  return (
    <CodeBlock language="jsx" size={size}>{`import { Button } from '@kolkrabbi/kol-component'

export default function Save() {
  return <Button variant="primary">Save changes</Button>
}`}</CodeBlock>
  )
}
