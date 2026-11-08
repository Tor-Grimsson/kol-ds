// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=744-24483
// source=packages/shell/src/FloatActionMenu.jsx
// component=FloatActionMenu
import figma from 'figma'

const instance = figma.selectedInstance
const icon = instance.getEnum('icon', { "plus": "plus", "more": "more" })

export default {
  example: figma.code`<FloatActionMenu actions={actions} icon="${icon}" variant="float" />`,
  imports: ["import { FloatActionMenu } from \"@kolkrabbi/kol-shell\""],
  id: 'FloatActionMenu',
}
