// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=21-65
// source=packages/component/src/atoms/ViewToggle.jsx
// component=ViewToggle
import figma from 'figma'

const instance = figma.selectedInstance
// variant text · icon at sm (2026-11-07); tone="sunken" is the instance's `tone` mode.
const variant = instance.getEnum('variant', { "text": "text", "icon": "icon" })
const xv = variant === 'icon' ? ' variant="icon"' : ''
export default {
  example: figma.code`<ViewToggle${xv} viewMode={view} onViewChange={setView} />`,
  imports: ["import { ViewToggle } from \"@kolkrabbi/kol-component\""],
  id: 'ViewToggle',
}
