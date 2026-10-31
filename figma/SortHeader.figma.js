// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=79-213
// source=packages/component/src/atoms/SortHeader.jsx
// component=SortHeader
import figma from 'figma'

const instance = figma.selectedInstance
const active = instance.getEnum('active', { "true": "true", "false": "false" })
const dir = instance.getEnum('dir', { "asc": "asc", "desc": "desc" })

export default {
  example: figma.code`<SortHeader label="Name" active={${active}} dir="${dir}" onClick={toggleSort} />`,
  imports: ["import { SortHeader } from \"@kolkrabbi/kol-component\""],
  id: 'SortHeader',
}
