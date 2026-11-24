// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-11505
// source=packages/component/src/atoms/Link.jsx
// component=Link
import figma from 'figma'

// Link (new with kolbox, no variant). (F4, 2026-11-19)
const instance = figma.selectedInstance
const label = instance.getString('label')
const example = figma.code`<Link>${label}</Link>`

export default {
  example,
  imports: ["import { Link } from \"@kolkrabbi/kol-component\""],
  id: 'Link',
  metadata: { nestable: true },
}
