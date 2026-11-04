// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=590-20447
// source=packages/component/src/molecules/ReadingNotes.jsx
// component=ReadingNotes
import figma from 'figma'

export default {
  example: figma.code`<ReadingNotes quote={quote} location="Third interlude · Page 125" note={note} onNoteChange={setNote} status="All changes saved" onView={view} onRemove={remove} footer="Note 1 / Page 125" />`,
  imports: ["import { ReadingNotes } from \"@kolkrabbi/kol-component\""],
  id: 'ReadingNotes',
}
