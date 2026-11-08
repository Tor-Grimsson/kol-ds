// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1256-4930
// source=packages/component/src/molecules/LinkAddRow.jsx
// component=LinkAddRow
import figma from 'figma'
const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "float": "float", "default": "default" })
export default {
  example: figma.code`<LinkAddRow${variant === 'float' ? ' variant="float"' : ''} title="kol-vault" href={url} onAdd={addLink} />`,
  imports: ["import { LinkAddRow } from \"@kolkrabbi/kol-component\""],
  id: 'LinkAddRow',
}
