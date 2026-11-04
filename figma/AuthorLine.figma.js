// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=435-11722
// source=packages/content/src/AuthorLine.jsx
// component=AuthorLine
import figma from 'figma'
const instance = figma.selectedInstance
const name = instance.getString('name')
const title = instance.getBoolean('showTitle') ? instance.getString('title') : undefined

export default {
  example: figma.code`<AuthorLine name="${name}"${title ? ` title="${title}"` : ''} />`,
  imports: ["import { AuthorLine } from \"@kolkrabbi/kol-content\""],
  id: 'AuthorLine',
}
