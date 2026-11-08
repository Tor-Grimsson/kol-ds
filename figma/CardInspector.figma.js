// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1040-26166
// source=packages/design-editor/src/editor/float/FloatCompose.jsx
// component=CardInspector
import figma from 'figma'

// the object inspector: a float Card on the window round with the Design · Motion · Effects tabs (the inspector card of FloatCompose)
export default {
  example: figma.code`<Card variant="float" radius="window" tabs={[{ key: 'Design', label: 'Design' }, { key: 'Motion', label: 'Motion' }, { key: 'Effects', label: 'Effects' }]} tab={tab} onTab={setTab} folded={folded} onFold={fold}>{() => <Body />}</Card>`,
  imports: ["import { Card } from \"@kolkrabbi/kol-dashboards\""],
  id: 'CardInspector',
}
