// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1256-4816
// source=packages/component/src/molecules/InlineAddRow.jsx
// component=InlineAddRow
import figma from 'figma'
const instance = figma.selectedInstance
const size = instance.getEnum('size', { "sm": "sm", "md": "md" })
export default {
  example: figma.code`<InlineAddRow variant="float"${size === 'sm' ? ' size="sm"' : ''} label="New brief" onAdd={add} />`,
  imports: ["import { InlineAddRow } from \"@kolkrabbi/kol-component\""],
  id: 'InlineAddRow',
}
