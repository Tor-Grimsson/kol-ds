// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=54-301
// source=packages/component/src/molecules/Rail.jsx
// component=Rail
import figma from 'figma'
const instance = figma.selectedInstance
const role = instance.getEnum('role', { patch: 'patch', page: 'page', settings: 'settings', bottom: 'bottom' })

export default {
  example: figma.code`<Rail role="${role}" open={open} onClose={close} header={<RailHeader title={title} />}>{rows}</Rail>`,
  imports: ["import { Rail, RailHeader } from \"@kolkrabbi/kol-component\""],
  id: 'RailRole',
}
