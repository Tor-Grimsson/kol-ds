// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=433-11585
// source=packages/framework/src/website/Footer.jsx
// component=WebsiteFooter
import figma from 'figma'

/* `© <year> <owner>` and back to top. variant=desktop|phone is the breakpoint, not a prop */
export default {
  example: figma.code`<WebsiteFooter owner={owner} />`,
  imports: ["import { WebsiteFooter } from \"@kolkrabbi/kol-framework\""],
  id: 'WebsiteFooter',
}
