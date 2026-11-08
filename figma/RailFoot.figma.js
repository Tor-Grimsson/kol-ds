// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1486-13750
// source=packages/component/src/organisms/RailKit.jsx
// component=RailFoot
import figma from 'figma'
const instance = figma.selectedInstance
const tabs = instance.getBoolean('tabs') ? ' tabs={tabs} value={tab} onChange={setTab}' : ''
export default {
  example: figma.code`<RailFoot${tabs}>{children}</RailFoot>`,
  imports: ["import { RailFoot } from \"@kolkrabbi/kol-component\""],
  id: 'RailFoot',
}
