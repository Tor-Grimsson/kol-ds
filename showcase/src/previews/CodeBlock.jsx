import { CodeBlock } from '@kolkrabbi/kol-component'

export const stage = 'lg'

/* Size rides the toolbar picker. */
export const sizes = ['sm', 'md']

export const variants = ['default', 'folio']

export default function CodeBlockPreview({ variant = 'default', size = 'md' }) {
  /* folio (Folio batch E): Folio's fenced code, the language and Copy over oneLight on its code ground */
  if (variant === 'folio') return <div data-folio-theme="light" className="w-full bg-[var(--kol-folio-paper)] p-6 leading-[1.21] text-[var(--kol-folio-ink)] [font-family:var(--kol-font-family-float)]"><CodeBlock variant="folio" language="jsx" code={`import { Button } from '@kolkrabbi/kol-component'\n\nexport default function Save() {\n  return <Button tone="primary">Save changes</Button>\n}`} /></div>
  return (
    <CodeBlock language="jsx" size={size}>{`import { Button } from '@kolkrabbi/kol-component'

export default function Save() {
  return <Button tone="primary">Save changes</Button>
}`}</CodeBlock>
  )
}
