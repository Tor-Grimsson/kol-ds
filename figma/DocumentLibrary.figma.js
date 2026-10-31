// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=262-320
// source=packages/styleguide/src/DocumentLibrary.jsx
// component=DocumentLibrary
import figma from 'figma'

export default {
  example: figma.code`<DocumentLibrary library={library} onNavigate={navigate} />`,
  imports: ["import { DocumentLibrary } from \"@kolkrabbi/kol-styleguide\"", "import { documentLibrary } from \"@kolkrabbi/kol-framework\""],
  id: 'DocumentLibrary',
}
