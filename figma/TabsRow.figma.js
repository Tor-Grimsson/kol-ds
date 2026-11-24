// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=9-123
// source=packages/component/src/molecules/TabsRow.jsx
// component=TabsRow
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "underline": "underline", "chip": "chip", "text": "text", "float": "float", "kolbox": "kolbox" })
const type = instance.getEnum('type', { "mono": "mono", "sans": "sans", "mono-light": "mono-light" })
const size = instance.getEnum('size', { "md": "md", "xs": "xs", "lg": "lg", "sm": "sm" })
// tabs: the `tabs` slot holds Tab instances (Tab.figma.js) or the Button / Button float the row renders (W10.2)
const xt = variant === 'underline' && type !== 'mono' ? ` type="${type}"` : ''

export default {
  example: variant === 'kolbox' ? figma.code`<TabsRow variant="kolbox" size="${size}" tabs={tabs} value={tab} onChange={setTab} />`
    : variant === 'float' && size === 'xs' ? figma.code`<TabsRow variant="float" size="xs" tabs={[{ id: 'design', label: 'Design' }, { id: 'animate', label: 'Animate' }]} value={tab} onChange={setTab} />`
    : variant === 'float' && size === 'lg' ? figma.code`<TabsRow variant="float" size="lg" surface="solid" tabs={[{ id: 'tasks', label: 'Tasks', icon: 'checklist', count: 5 }, …]} value={tab} onChange={setTab} trailing={actions} />`
    : variant === 'float' && size === 'sm' ? figma.code`<TabsRow variant="float" size="sm" tabs={tabs} value={tab} onChange={setTab} />`
    : figma.code`<TabsRow variant="${variant}"${xt} tabs={tabs} value={tab} onChange={setTab} />`,
  imports: ["import { TabsRow } from \"@kolkrabbi/kol-component\""],
  id: 'TabsRow',
}
