// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=21-65
// source=packages/component/src/atoms/ViewToggle.jsx
// component=ViewToggle
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "text": "text", "icon": "icon", "single": "single" })
const size = instance.getEnum('size', { "sm": "sm", "md": "md" })

export default {
  example: figma.code`<ViewToggle variant="${variant}" size="${size}" viewMode={view} onViewChange={setView} />`,
  imports: ["import { ViewToggle } from \"@kolkrabbi/kol-component\""],
  id: 'ViewToggle',
}
