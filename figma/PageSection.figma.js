// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=456-11774
// source=packages/framework/src/PageSection.jsx
// component=PageSection
import figma from 'figma'

/* the children slot holds the section's content (a Contents index, a Table, …) */
const instance = figma.selectedInstance
const label = instance.getString('label')
const title = instance.getString('title')
const body = instance.getBoolean('showBody') ? ` body="${instance.getString('body')}"` : ''

export default {
  example: figma.code`<PageSection label="${label}" title="${title}"${body}>{children}</PageSection>`,
  imports: ["import { PageSection } from \"@kolkrabbi/kol-framework\""],
  id: 'PageSection',
}
