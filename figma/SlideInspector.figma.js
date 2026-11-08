// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1386-12377
// source=packages/deck/src/SlideInspector.jsx
// component=SlideInspector
import figma from 'figma'

export default {
  example: figma.code`<SlideInspector doc={doc} selectedIds={selectedIds} onChange={setDoc} onSelect={select} onToggleSelect={toggleSelect} onDuplicate={duplicate} mediaClient={media} onUpload={upload} />`,
  imports: ["import { SlideInspector } from \"@kolkrabbi/kol-deck\""],
  id: 'SlideInspector',
}
