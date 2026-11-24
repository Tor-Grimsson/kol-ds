// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-11840
// source=packages/component/src/molecules/ButtonSplit.jsx
// component=ButtonSplit
import figma from 'figma'

// ButtonSplit variant="kolbox"; iconOnly=false is the name half and the chevron half (the document title). (F4, 2026-11-19)
const instance = figma.selectedInstance
const text = instance.findLayers((n) => n.type === 'TEXT')[0]
const label = text && 'textContent' in text ? text.textContent : ''
const example = figma.code`<ButtonSplit variant="kolbox" items={items}>${label}</ButtonSplit>`

export default {
  example,
  imports: ["import { ButtonSplit } from \"@kolkrabbi/kol-component\""],
  id: 'ButtonSplitKolbox',
  metadata: { nestable: true },
}
