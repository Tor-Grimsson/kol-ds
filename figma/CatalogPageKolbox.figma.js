// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-14281
// source=packages/shell/src/CatalogPage.jsx
// component=CatalogPage
import figma from 'figma'

// CatalogPage variant="kolbox" (kolbox's Browser, the home page). (F4, 2026-11-19)
const instance = figma.selectedInstance
const sidebar = instance.getSlot('sidebar')
const main = instance.getSlot('main')
const example = figma.code`<CatalogPage variant="kolbox" sidebar={${sidebar}}>${main}</CatalogPage>`

export default {
  example,
  imports: ["import { CatalogPage } from \"@kolkrabbi/kol-shell\""],
  id: 'CatalogPageKolbox',
  metadata: { nestable: true },
}
