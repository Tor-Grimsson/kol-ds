// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1218-116
// source=packages/component/src/utilities/Popover.jsx
// component=PopoverPanel
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "default": "default", "float": "float" })

export default {
  example: variant === 'float'
    ? figma.code`<PopoverPanel popover={popover} panel={false} className="kol-menu-panel kol-menu-panel--float">{children}</PopoverPanel>`
    : figma.code`<PopoverPanel popover={popover}>{children}</PopoverPanel>`,
  imports: ["import { PopoverPanel, usePopover } from \"@kolkrabbi/kol-component\""],
  id: 'PopoverPanel',
}
