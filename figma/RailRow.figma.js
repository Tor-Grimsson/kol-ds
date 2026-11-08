// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1258-4880
// source=packages/workshop/src/shell/RailRow.jsx
// component=RailRow
import figma from 'figma'
// THE L3 rail row (.shell-nav-item): active steps Thin 100 → Light 300; icon is the host's glyph, trailing a count or number
const instance = figma.selectedInstance
const active = instance.getEnum('active', { "false": false, "true": true })
const label = instance.getString('label')
const icon = instance.getBoolean('icon') ? ' icon={<IconLoader name="file" size={14} />}' : ''
const trailing = instance.getBoolean('trailing') ? ` trailing="${instance.getString('trailingText')}"` : ''
export default {
  example: figma.code`<RailRow to={path}${active ? ' active' : ''}${icon}${trailing}>${label}</RailRow>`,
  imports: ["import { RailRow } from \"@kolkrabbi/kol-workshop\"", "import { IconLoader } from \"@kolkrabbi/kol-icons\""],
  id: 'RailRow',
}
