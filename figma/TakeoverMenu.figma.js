// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=433-11643
// source=packages/framework/src/website/TakeoverMenu.jsx
// component=TakeoverMenu
import figma from 'figma'

/* the open takeover. variant=desktop|phone is the breakpoint, not a prop */
export default {
  example: figma.code`<TakeoverMenu open={open} onClose={onClose} logomark={logomark} name={name} navItems={navItems} lines={lines} blurb={blurb} social={social} />`,
  imports: ["import { TakeoverMenu } from \"@kolkrabbi/kol-framework\""],
  id: 'TakeoverMenu',
}
