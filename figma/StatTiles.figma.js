// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=563-19191
// source=packages/dashboards/src/cards/StatTiles.jsx
// component=StatTiles
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "default": "default", "float": "float" })
const size = instance.getEnum('size', { "sm": "sm", "lg": "lg" })

export default {
  example: variant === 'float'
    ? figma.code`<StatTiles variant="float" size="${size}" items={items} />`
    : figma.code`<StatTiles size="${size}" items={items} />`,
  imports: ["import { StatTiles } from \"@kolkrabbi/kol-dashboards\""],
  id: 'StatTiles',
}
