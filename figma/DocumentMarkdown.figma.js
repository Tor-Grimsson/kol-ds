// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1746-15816
// source=packages/styleguide/src/DocumentLibrary.jsx
// component=DocumentMarkdown
// the markdown download beside the files row: an icon-only nav sm Button carrying row.source as a .md file.
import figma from 'figma'

export default {
  example: figma.code`<DocumentMarkdown row={row} />`,
  imports: ["import { DocumentMarkdown } from \"@kolkrabbi/kol-styleguide\""],
  id: 'DocumentMarkdown',
}
