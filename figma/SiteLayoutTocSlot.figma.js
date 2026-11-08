// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=917-24980
// source=packages/framework/src/SiteLayout.jsx
// component=SiteLayout
import figma from 'figma'

/* SiteLayout's TOC rail — the slot part: a page registers its TOC through ShellTocContext, or the app passes defaultTocContent */
export default {
  example: figma.code`<SiteLayout navTree={tree} defaultTocContent={<DocsToc items={items} />} />`,
  imports: ["import { SiteLayout } from \"@kolkrabbi/kol-framework\""],
  id: 'SiteLayoutTocSlot',
}
