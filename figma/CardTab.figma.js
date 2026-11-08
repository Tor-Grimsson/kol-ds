// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=739-54393
// source=packages/dashboards/src/cards/Card.jsx
// component=CardTab
import figma from 'figma'

export default {
  example: figma.code`<Card tabs={[{ key, label }]} tab={tab} onTab={onTab}>{body}</Card>`,
  imports: ["import { Card } from \"@kolkrabbi/kol-dashboards\""],
  id: 'CardTab',
}
