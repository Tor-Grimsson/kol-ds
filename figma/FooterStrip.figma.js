// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=569-19871
// source=packages/shell/src/WorkspaceStrips.jsx
// component=FooterStrip
import figma from 'figma'

const instance = figma.selectedInstance

export default {
  example: figma.code`<FooterStrip start="5 open tasks" end={['Briefs', 'Todos', 'Other']} />`,
  imports: ["import { FooterStrip } from \"@kolkrabbi/kol-shell\""],
  id: 'FooterStrip',
}
