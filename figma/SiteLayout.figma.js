// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=385-12042
// source=packages/framework/src/SiteLayout.jsx
// component=SiteLayout
import figma from 'figma'

/* the regions: sideNav (swap), header above the page (swap, on with showHeader — a document page's DocumentHeader),
 * page (slot) */
const instance = figma.selectedInstance
const header = instance.getBoolean('showHeader') ? ' header={<DocumentHeader title={client} tabs={tabs} value={value} onChange={navigate} menus={menus} />}' : ''

export default {
  example: figma.code`<SiteLayout navTree={tree} sideNav={{ isActive }} pageWash="var(--kol-fg-02)"${header} />`,
  imports: ["import { SiteLayout } from \"@kolkrabbi/kol-framework\""],
  id: 'SiteLayout',
}
