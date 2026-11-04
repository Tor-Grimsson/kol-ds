// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=439-22687
// source=packages/framework/src/website/WebsiteLayout.jsx
// component=WebsiteLayout
import figma from 'figma'

/* regions: navbar (WebsiteNavbar) · page (slot = children) · footer (WebsiteFooter). variant=desktop|phone is the
 * breakpoint, not a prop */
export default {
  example: figma.code`<WebsiteLayout name={name} wordmark={wordmark} logomark={logomark} navItems={navItems} takeover={takeover} owner={owner}>{page}</WebsiteLayout>`,
  imports: ["import { WebsiteLayout } from \"@kolkrabbi/kol-framework\""],
  id: 'WebsiteLayout',
}
