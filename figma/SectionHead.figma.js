// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=559-19043
// source=packages/dashboards/src/cards/SectionHead.jsx
// component=SectionHead
import figma from 'figma'

const instance = figma.selectedInstance
const folded = instance.getEnum('folded', { "true": "true", "false": "false" })

export default {
  example: figma.code`<SectionHead title="Briefs" count="1 open" meta="Last 30 days" value="1,036"${folded === 'true' ? ' folded' : ''} onFold={fold} />`,
  imports: ["import { SectionHead } from \"@kolkrabbi/kol-dashboards\""],
  id: 'SectionHead',
}
