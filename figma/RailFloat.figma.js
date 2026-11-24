// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1877-9436
// source=packages/component/src/molecules/RailFloat.jsx
// component=RailFloat
import figma from 'figma'

// The one float Rail shell (plan-2026-11-12-float-rails-figma 4.2): header · body · footer SLOTS, collapse-v · compact · wide
// true/false. Every Rail is a RailFloat instance with its content in the slots — PropertyRail, NavRail float and the
// reader's Contents included; the header slot holds one Header (Header.figma.js); collapse-v is the same tree, body and footer hidden.
const instance = figma.selectedInstance
const collapsedV = instance.getEnum('collapse-v', { "false": false, "true": true })
const compact = instance.getEnum('compact', { "false": false, "true": true })
const wide = instance.getEnum('wide', { "false": false, "true": true })
const footer = instance.getBoolean('showFooter')
const header = instance.getSlot('header')
const body = instance.getSlot('body')
const foot = instance.getSlot('footer')

export default {
  example: figma.code`<RailFloat header={${header}}${collapsedV ? ' collapsibleV collapsedV' : ''}${compact ? ' compact' : ''}${wide ? ' wide' : ''}${footer ? figma.code` footer={${foot}}` : ''}>
  ${body}
</RailFloat>`,
  imports: ["import { RailFloat } from \"@kolkrabbi/kol-component\""],
  id: 'RailFloat',
}
