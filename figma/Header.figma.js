// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2055-15993
// source=packages/component/src/molecules/Header.jsx
// component=Header
import figma from 'figma'

// THE header (plan-2026-11-12-one-header W1.2): variant nav · property · modal · settings; the title is text, `kind` the
// settings line, `end` a slot. Toggles: expand, collapse-h (the panel button), collapse-v (the 12 chevron; collapsedV
// flips it ⌃ → ⌄), close; minimise on modal; switch (the nav ⌄).
const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { nav: 'nav', property: 'property', modal: 'modal', settings: 'settings' })
const collapsedV = instance.getEnum('collapsedV', { "false": false, "true": true })
const title = instance.getString('title')
const kind = variant === 'settings' ? ` kind="${instance.getString('kind')}"` : ''
const icon = (variant === 'nav' || variant === 'modal') && instance.getBoolean('icon') ? ' icon={icon}' : ''
const sw = variant === 'nav' && instance.getBoolean('switch') ? ' onSwitch={openSwitcher}' : ''
const end = instance.getBoolean('showEnd') ? figma.code` end={${instance.getSlot('end')}}` : ''
const ex = instance.getBoolean('expand') ? ' onExpand={expand}' : ''
const ch = instance.getBoolean('collapse-h') ? ' onCollapseH={hide}' : ''
const cv = instance.getBoolean('collapse-v') ? `${collapsedV ? ' collapsedV' : ''} onCollapseV={toggleCollapseV}` : ''
const mi = variant === 'modal' && instance.getBoolean('minimise') ? ' onMinimise={minimise}' : ''
const cl = instance.getBoolean('close') ? ' onClose={close}' : ''

export default {
  example: figma.code`<Header variant="${variant}"${icon} title="${title}"${kind}${sw}${end}${ex}${ch}${cv}${mi}${cl} />`,
  imports: ["import { Header } from \"@kolkrabbi/kol-component\""],
  id: 'Header',
}
