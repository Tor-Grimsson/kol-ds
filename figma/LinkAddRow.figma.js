// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=581-20108
// source=packages/component/src/molecules/LinkAddRow.jsx
// component=LinkAddRow
import figma from 'figma'
const instance = figma.selectedInstance
const title = instance.getString('title')
export default {
  example: figma.code`<LinkAddRow variant="float" title="${title}" href={url} onAdd={addLink} />`,
  imports: ["import { LinkAddRow } from \"@kolkrabbi/kol-component\""],
  id: 'LinkAddRow',
}
