// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=99-1398
// source=packages/component/src/molecules/MenuFloat.jsx
// component=MenuFloat
import figma from 'figma'

// The float menu card: Header variant=property on top (the title — the label of the button that opened it; `title` off = none),
// then the rows slot (MenuFloatRows.figma.js). AppFloatNav, DocumentCapsule, FloatActionMenu, RailTrigger and
// TopControlsBar open it; a row with `sub` opens its level beside it (beside) or in place.
const instance = figma.selectedInstance
const rows = instance.getSlot('rows')
const header = instance.getBoolean('title') ? instance.findInstance('Header') : null
const title = header ? header.getString('title') : null

export default {
  example: figma.code`<MenuFloat beside={beside} cardClass={card} onLeaf={close}${title ? ` title="${title}"` : ''}>
  ${rows}
</MenuFloat>`,
  imports: ["import { MenuFloat } from \"@kolkrabbi/kol-component\""],
  id: 'MenuFloat',
}
