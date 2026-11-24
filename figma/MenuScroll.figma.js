// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-12506
// source=packages/component/src/molecules/Menu.jsx
// component=MenuScroll
import figma from 'figma'

// MenuScroll (new with kolbox, a member of Menu). (F4, 2026-11-19)
const instance = figma.selectedInstance
const example = figma.code`<MenuScroll panel={panel} />`

export default {
  example,
  imports: ["import { MenuScroll } from \"@kolkrabbi/kol-component\""],
  id: 'MenuScroll',
  metadata: { nestable: true },
}
