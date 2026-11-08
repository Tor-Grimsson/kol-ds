// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1363-10461
// source=packages/notes/src/Notes.jsx
// component=Notes
import figma from 'figma'

/* drawn as MarkdownPage uses it: the margin notes after a passage */
export default {
  example: figma.code`<Notes list={notes} ctx={ctx} />`,
  imports: ["import { Notes } from \"@kolkrabbi/kol-notes\""],
  id: 'Notes',
}
