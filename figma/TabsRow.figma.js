// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=9-123
// source=packages/component/src/molecules/TabsRow.jsx
// component=TabsRow
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "underline": "underline", "chip": "chip", "text": "text", "float": "float" })
const type = instance.getEnum('type', { "mono": "mono", "sans": "sans", "mono-light": "mono-light" })
const icons = variant === 'underline' && instance.getBoolean('icon')
const xt = variant === 'underline' && type !== 'mono' ? ` type="${type}"` : ''

export default {
  example: icons
    ? figma.code`<TabsRow variant="${variant}"${xt} tabs={[{ id: 'a', label: 'Overview', icon: 'layers' }, …]} value={tab} onChange={setTab} />`
    : figma.code`<TabsRow variant="${variant}"${xt} tabs={tabs} value={tab} onChange={setTab} />`,
  imports: ["import { TabsRow } from \"@kolkrabbi/kol-component\""],
  id: 'TabsRow',
}
