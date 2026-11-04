// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=514-18900
// source=packages/component/src/molecules/CodeBlock.jsx
// component=CodeBlock
import figma from 'figma'

const instance = figma.selectedInstance
const size = instance.getEnum('size', { "md": "md", "sm": "sm" })
const bare = instance.getEnum('bare', { "false": "false", "true": "true" })
const filename = instance.getString('filename')
const showFilename = instance.getBoolean('showFilename')
const copy = instance.getBoolean('copy')
const fn = showFilename ? ` filename="${filename}"` : ''
const sz = size !== 'md' ? ` size="${size}"` : ''
const br = bare === 'true' ? ' bare' : ''
const cp = copy ? '' : ' copy={false}'

export default {
  example: figma.code`<CodeBlock${fn} language="css"${sz}${br}${cp} code={css} />`,
  imports: ["import { CodeBlock } from \"@kolkrabbi/kol-component\""],
  id: 'CodeBlock',
}
