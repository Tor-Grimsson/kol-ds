// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=563-19118
// source=packages/dashboards/src/cards/Card.jsx
// component=Card
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "default": "default", "float": "float" })
const folded = instance.getEnum('folded', { "true": "true", "false": "false" })

export default {
  example: variant === 'float'
    ? figma.code`<Card variant="float" title="Briefs" count="1 open" addLabel="New brief" onAdd={add}${folded === 'true' ? ' folded' : ''} onFold={fold}>{rows}</Card>`
    : figma.code`<Card title="Open tasks" controls={<MenuMore label="Sort" items={items} />}>{body}</Card>`,
  imports: ["import { Card } from \"@kolkrabbi/kol-dashboards\""],
  id: 'Card',
}
