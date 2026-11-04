// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=433-11574
// source=packages/framework/src/website/Navbar.jsx
// component=WebsiteNavbar
import figma from 'figma'

/* the bar: wordmark, the tools slot (WorkViewToggle on /work), menu button. variant=desktop|phone is the breakpoint (32 / 16 side pad), not a prop */
export default {
  example: figma.code`<WebsiteNavbar wordmark={wordmark} logomark={logomark} name={name} navItems={navItems} takeover={takeover} tools={tools} />`,
  imports: ["import { WebsiteNavbar } from \"@kolkrabbi/kol-framework\""],
  id: 'WebsiteNavbar',
}
