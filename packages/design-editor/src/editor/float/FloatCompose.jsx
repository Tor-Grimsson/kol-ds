import CanvasArea from '../compose/CanvasArea'
import { composePanes, composeTabs, useTabContext } from '../shell/panels/tabs'
import EditorFooter from '../shell/panels/EditorFooter'
import ActionBar from '../shell/panels/ActionBar'
import LayerEffectsWindow from '../shell/LayerEffectsWindow'
import { TextSurface } from '../compose/inspectors/TextPanel'
import InspectorRail from '../compose/InspectorRail'
import ParametersPanel from '../compose/inspectors/ParametersPanel'
import PatternPanel from '../compose/inspectors/PatternPanel'
import { FloatTransformFields, FloatAppearanceFields } from '../compose/inspectors/LayerInspector'
import { useComposeState, COVER_TYPES } from '../compose/state'
import { findLayerDeep } from '../compose/helpers'
import { pack } from '../packs'
import FloatEditorShell from './FloatEditorShell'

/**
 * FloatCompose — the editor's composition in the float chrome (plan-2026-11-05-float-editor W2.1): Compose's registry
 * (the canvas, the tabs, the panes) plus what the float chrome lays out its own way — the CARDS (his frames: Typography;
 * Colour · Swatches; Layers · Assets · History; the object inspector as Design · Parameters · Effects; the rail footer as
 * Output) and the TOOLS (the rail, its ⋮, the phone's row). Built at first render, as Compose's is — packs register as
 * their modules load.
 */
const cmd = (id) => () => window.dispatchEvent(new CustomEvent('kol:command', { detail: { id } }))

/* his object inspector's tabs (19:10408) — DESIGN holds the inspector, the generator's Generate · Style and a pattern's
 * surface; MOTION the generator's Animation; EFFECTS the effects pack's tab, as registered */
function DesignTab() {
  const { selectedId, layers } = useComposeState()
  const layer = selectedId && selectedId !== 'canvas' ? findLayerDeep(layers, selectedId) : null
  return (
    <>
      <InspectorRail />
      {layer && layer.type !== 'group' && layer.type !== 'path' && <ParametersPanel only={['generate', 'style']} />}
      {layer?.type === 'pattern' && <PatternPanel />}
    </>
  )
}
const MotionTab = () => <ParametersPanel only={['anim']} />

/* his Transform and Appearance cards (19:10125 · 19:10192) — the inspector's float fields on the selected layer */
const TransformCard = ({ layer }) => (layer ? <FloatTransformFields layer={layer} /> : null)
const AppearanceCard = ({ layer }) => (layer ? <FloatAppearanceFields layer={layer} /> : null)

const floatRegistry = () => ({
  canvas: CanvasArea,
  useTabContext,
  panes: composePanes,
  tabs: [
    ...composeTabs(),
    { tab: 'Design', label: 'Design', Component: DesignTab },
    { tab: 'Motion', label: 'Motion', Component: MotionTab },
  ],
  cards: [
    /* the text surface, out of the inspector (LayerInspector leaves it under the float chrome) — his Typography card */
    { id: 'type', title: 'Typography', Panel: TextSurface, when: ({ layer }) => layer?.type === 'text' },
    { id: 'color', tabs: ['Colour', 'Swatches', 'Stroke'], folded: true },
    { id: 'layers', tabs: ['Layers', 'Assets', 'History', 'Navigator'] },
    /* his Transform and Appearance cards (Section 5) — they step out while the inspector is open, whose Design tab
       holds the same fields (frame 04) */
    { id: 'transform', title: 'Transform', Panel: TransformCard, folded: true, yields: 'inspector',
      when: ({ layer }) => !!layer && !COVER_TYPES.includes(layer.type) },
    { id: 'appearance', title: 'Appearance', Panel: AppearanceCard, folded: true, yields: 'inspector', when: ({ layer }) => !!layer },
    /* his object inspector (19:10408): Design · Motion · Effects; the registry's Inspector, Parameters and Pattern tabs
       are held by Design (and Parameters' Animation by Motion) — an opener for any of them lights the tab holding it.
       Open, it leads the stack (frame 04). */
    { id: 'inspector', tabs: ['Design', 'Motion', 'Effects'], holds: { Inspector: 'Design', Parameters: 'Design', Pattern: 'Design' }, lead: true, folded: true },
    /* the rail footer (Transport · Output · File) — one card, its own tabs inside */
    { id: 'output', title: 'Output', Panel: EditorFooter, answers: ['Transport', 'Output', 'File'], folded: true },
  ],
  /* his rail (19:10541): Select, Zoom, Rectangle, Ellipse, Text, Pen, Image, Pattern — the image slot inserts one */
  tools: [
    { id: 'select', icon: 'pointer', label: 'Select', kbd: 'V' },
    { id: 'zoom', icon: 'search', label: 'Zoom', kbd: 'Z' },
    { id: 'rect', icon: 'square', label: 'Rectangle', kbd: 'R' },
    { id: 'ellipse', icon: 'circle', label: 'Ellipse', kbd: 'O' },
    { id: 'text', icon: 'aa', label: 'Text', kbd: 'T' },
    { id: 'pen', icon: 'pen', label: 'Pen', kbd: 'P' },
    { id: 'image', icon: 'image', label: 'Insert image', onPick: () => window.dispatchEvent(new CustomEvent('kol:insert-image')) },
    { id: 'pattern', icon: 'pattern-tool', label: 'Pattern' },
  ],
  /* the ⋮ (his More tools: Hand, Zoom, Fill / stroke, Reset colours) and the strip's folds that have no slot */
  moreTools: [
    { id: 'hand', icon: 'hand', label: 'Hand' },
    { id: 'orbit', icon: 'shape-torus', label: 'Orbit', kbd: 'C' },
    { label: 'Node select', icon: 'arrow-upleft', kbd: 'A', onPick: () => window.dispatchEvent(new CustomEvent('kol:node-edit')) },
    { id: 'triangle', icon: 'triangle', label: 'Triangle' },
    { id: 'line', icon: 'line', label: 'Line' },
    { id: 'polygon', icon: 'polygon', label: 'Polygon' },
    { id: 'star', icon: 'star', label: 'Star' },
    ...(pack('motion') ? [{ label: 'Kinetic type', icon: 'type-02', onPick: (state) => state.addLayer('kinetic') }] : []),
    { label: 'Fill / stroke', icon: 'swap', kbd: 'X', onPick: cmd('paint-toggle') },
    { label: 'Reset colours', icon: 'refresh', kbd: 'D', onPick: cmd('paint-default') },
    { label: 'Eyedropper', icon: 'eyedropper', kbd: 'I', onPick: cmd('eyedrop') },
  ],
  /* THE DOCK (7.7, his float-more 30:914): the rail's tools in a row, a family's members under its ▾ (a member with an
     `id` arms that tool and the slot shows it); hand and undo follow, then the ⌘K pill — the shell adds those */
  dockTools: [
    { id: 'select', icon: 'pointer', label: 'Select', kbd: 'V', more: [
      { id: 'select', icon: 'pointer', label: 'Select', kbd: 'V' },
      { label: 'Node select', icon: 'arrow-upleft', kbd: 'A', onClick: () => window.dispatchEvent(new CustomEvent('kol:node-edit')) },
    ] },
    { id: 'rect', icon: 'square', label: 'Rectangle', kbd: 'R', more: [
      { id: 'rect', icon: 'square', label: 'Rectangle', kbd: 'R' },
      { id: 'ellipse', icon: 'circle', label: 'Ellipse', kbd: 'O' },
      { id: 'triangle', icon: 'triangle', label: 'Triangle' },
      { id: 'line', icon: 'line', label: 'Line' },
      { id: 'polygon', icon: 'polygon', label: 'Polygon' },
      { id: 'star', icon: 'star', label: 'Star' },
    ] },
    { id: 'pen', icon: 'pen', label: 'Pen', kbd: 'P', more: [
      { id: 'pen', icon: 'pen', label: 'Pen', kbd: 'P' },
      { label: 'Eyedropper', icon: 'eyedropper', kbd: 'I', onClick: cmd('eyedrop') },
    ] },
    { id: 'text', icon: 'aa', label: 'Text', kbd: 'T', more: [
      { id: 'text', icon: 'aa', label: 'Text', kbd: 'T' },
      ...(pack('motion') ? [{ label: 'Kinetic type', icon: 'type-02', onPick: (state) => state.addLayer('kinetic') }] : []),
    ] },
    { id: 'image', icon: 'image', label: 'Insert image', onClick: () => window.dispatchEvent(new CustomEvent('kol:insert-image')) },
    { id: 'pattern', icon: 'pattern-tool', label: 'Pattern' },
    { id: 'zoom', icon: 'search', label: 'Zoom', kbd: 'Z' },
    { id: 'orbit', icon: 'shape-torus', label: 'Orbit', kbd: 'C' },
  ],
  /* his phone row (frame 06): Select, Text, Pen, Rectangle, Layers, Pattern */
  phoneTools: [
    { id: 'select', icon: 'pointer', label: 'Select' },
    { id: 'text', icon: 'aa', label: 'Text' },
    { id: 'pen', icon: 'pen', label: 'Pen' },
    { id: 'rect', icon: 'square', label: 'Rectangle' },
    { id: 'layers', icon: 'layers', label: 'Layers', onPick: () => window.dispatchEvent(new CustomEvent('kol:open-tab', { detail: { tab: 'Layers' } })) },
    { id: 'pattern', icon: 'pattern-tool', label: 'Pattern' },
  ],
  panels: [],
})
let registry = null

export default function FloatCompose() {
  return (
    <>
      <LayerEffectsWindow />
      {(() => { const GeneratorWindows = pack('generators')?.GeneratorWindows; return GeneratorWindows ? <GeneratorWindows /> : null })()}
      {/* the action band's file picker answers `kol:insert-image` (the rail's Image slot, Tools › Insert image); the
          band itself has no place in the float chrome, its verbs are Layer's rows */}
      <div hidden><ActionBar /></div>
      <FloatEditorShell registry={(registry ??= floatRegistry())} />
    </>
  )
}
