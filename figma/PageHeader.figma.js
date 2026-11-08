// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1007-134240
// source=packages/component/src/molecules/PageHeader.jsx
// component=PageHeader
import figma from 'figma'
// rebuilt 2026-11-07: PageHeader renders SectionText at its level (page · app); phone is the app level below md
const instance = figma.selectedInstance
const level = instance.getEnum('level', { "page": "page", "app": "app" })
export default {
  example: figma.code`<PageHeader${level === 'app' ? ' level="app"' : ''} eyebrow={eyebrow} title={title} subtitle={subtitle} />`,
  imports: ["import { PageHeader } from \"@kolkrabbi/kol-component\""],
  id: 'PageHeader',
}
