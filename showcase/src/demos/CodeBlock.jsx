import { CodeBlock } from '@kolkrabbi/kol-component'

export const stage = 'lg'

export default function CodeBlockDemo() {
  return (
    <CodeBlock language="jsx">{`import { Button } from '@kolkrabbi/kol-component'

export default function Save() {
  return <Button variant="primary">Save changes</Button>
}`}</CodeBlock>
  )
}
