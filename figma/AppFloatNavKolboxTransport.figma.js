// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-12547
// source=packages/shell/src/AppFloatNav.jsx
// component=AppFloatNav
import figma from 'figma'

// AppFloatNav variant="kolbox" transport (kolbox's ToolbarTransport). (F4, 2026-11-19)
const instance = figma.selectedInstance
const example = figma.code`<AppFloatNav variant="kolbox" transport />`

export default {
  example,
  imports: ["import { AppFloatNav } from \"@kolkrabbi/kol-shell\""],
  id: 'AppFloatNavKolboxTransport',
  metadata: { nestable: true },
}
