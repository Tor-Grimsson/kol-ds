// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=563-19118
// source=packages/dashboards/src/cards/Card.jsx
// component=Card
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('float', { "false": "default", "true": "float" })
const collapsedV = instance.getEnum('collapse-v', { "true": "true", "false": "false" })
const radius = instance.getEnum('window', { "false": "default", "true": "window" })
// rows: the float sheet's rows slot — the Card's children
const value = instance.getBoolean('showValue') ? ` value="${instance.getString('value')}"` : ''

export default {
  example: variant === 'float' && radius === 'window'
    ? figma.code`<Card variant="float" radius="window" tabs={tabs} tab={tab} onTab={setTab}${collapsedV === 'true' ? ' collapsedV' : ''} onCollapseV={toggleCollapseV} foot={foot}>{() => <Body />}</Card>`
    : variant === 'float'
    ? figma.code`<Card variant="float" title="Briefs" count="1 open"${value} addLabel="New brief" onAdd={add}${collapsedV === 'true' ? ' collapsedV' : ''} onCollapseV={toggleCollapseV}>{rows}</Card>`
    : figma.code`<Card title="Open tasks" controls={<MenuMore label="Sort" items={items} />}>{body}</Card>`,
  imports: ["import { Card } from \"@kolkrabbi/kol-dashboards\""],
  id: 'Card',
}
