// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=456-11759
// source=packages/framework/src/DocumentIndex.jsx
// component=Contents
import figma from 'figma'

/* Contents/row is one row of DocumentIndex's Contents — the index renders them from the page's sections */
export default {
  example: figma.code`<Contents index={index} onNavigate={onNavigate} />`,
  imports: ["import { Contents } from \"@kolkrabbi/kol-framework/src/DocumentIndex.jsx\""],
  id: 'Contents',
}
