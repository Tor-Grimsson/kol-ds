// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-13761
// source=packages/component/src/organisms/ColorPickerPopover.jsx
// component=ColorPickerPopover
import figma from 'figma'

// ColorPickerPopover variant="kolbox" (kolbox's PopoverColor). (F4, 2026-11-19)
const instance = figma.selectedInstance
const example = figma.code`<ColorPickerPopover variant="kolbox" anchor={anchor} open onClose={onClose} color={value} onChange={onChange} />`

export default {
  example,
  imports: ["import { ColorPickerPopover } from \"@kolkrabbi/kol-component\""],
  id: 'ColorPickerPopoverKolbox',
  metadata: { nestable: true },
}
