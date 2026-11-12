import { useState } from 'react'
import { AppFloatNav, CanvasHint, DocumentCapsule, GlobalActions, PropertyRail, SceneBreadcrumb, SelectionMeasure, ToolRail, ZoomReadout } from '@kolkrabbi/kol-shell'
import { TimelineRail, timelineView } from '@kolkrabbi/design-editor/core'

/* The visual editor — "Visual editor · Scene editing" (kol-float--style 9:8594), plan-2026-11-04-float-views W3.1.
 * Layout, not function: full screen with its own chrome, every part shipped, placed at the frame's 1600 × 1080 boxes.
 * Text and numbers as drawn. */

const noop = () => {}

/* the mode tabs — fxr's rows; ··· is the More circle (AppFloatNav splits it off when there is a sheet) */
const MODES = [
  { path: '/editor', icon: 'desktop', label: 'Editor' },
  { path: '/labs', icon: 'globe', label: 'Labs' },
  { path: '/randomiser', icon: 'refresh', label: 'Randomiser' },
  { path: '/morph', icon: 'swap', label: 'Morph' },
]
const MORE = [
  { path: '/library', icon: 'nav-library', label: 'Library' },
  { path: '/new', icon: 'plus', label: 'New File' },
  { path: '/settings', icon: 'nav-settings', label: 'Settings' },
]

const TOOLS = [
  { id: 'select', icon: 'pointer', label: 'Select', kbd: 'V' },
  { id: 'move', icon: 'drag-handle', label: 'Move', kbd: 'M' },
  { id: 'rectangle', icon: 'square', label: 'Rectangle', kbd: 'R' },
  { id: 'ellipse', icon: 'circle', label: 'Ellipse', kbd: 'O' },
  { id: 'text', icon: 'type', label: 'Text', kbd: 'T' },
  { id: 'pen', icon: 'pen', label: 'Pen', kbd: 'P' },
  { id: 'image', icon: 'image', label: 'Image', kbd: 'I' },
  { id: 'effects', icon: 'radial-star', label: 'Effects', kbd: 'E' },
]

const TRANSPORT = [
  { id: 'play', icon: 'play', label: 'Play', selected: true },
  { id: 'pause', icon: 'pause', label: 'Pause' },
  { id: 'loop', icon: 'repeat', label: 'Loop' },
  { id: 'stop', icon: 'stop', label: 'Stop' },
  { id: 'back', icon: 'skip-start', label: 'Back' },
]

const BLEND = ['Normal', 'Screen', 'Multiply', 'Overlay'].map((v) => ({ value: v, label: v }))
const MOTION = ['Still', 'Slow orbit · 12 s', 'Fast orbit · 4 s'].map((v) => ({ value: v, label: v }))

/* the timeline: a 12 s loop, the head at 04:12; the keys where the frame draws its diamonds (lane x / clip 1140) */
const LOOP = 12, NOW = 4.12
const VIEW = timelineView(LOOP, 1, NOW)
const WAVE = Array.from({ length: 96 }, (_, i) => ((i % 10) + 1) / 10)   /* the frame's bars, 3 → 12 tall, repeating */
const ROWS = [
  { id: 'orbit', layer: { id: 'orbit', icon: 'clr-mono' }, name: 'Orbit field', lit: true, track: { id: 'orbit:rotation', label: 'Orbit · rotation', keys: [156.5, 356.5, 726.5, 1066.5].map((x) => ({ t: x / 1140, v: 0 })) } },
  { id: 'title', layer: { id: 'title', icon: 'type' }, name: 'Title group', label: 'STILL / IN MOTION' },
  { id: 'grain', layer: { id: 'grain', icon: 'radial-star' }, name: 'Film grain' },
  { id: 'background', layer: { id: 'background', icon: 'square', locked: true }, name: 'Background' },
  { id: 'ambient', layer: { id: 'ambient', icon: 'space-evenly-horizontal' }, name: 'Ambient.wav', kind: 'wave', label: 'Ambient · stereo', wave: WAVE },
]

/* the artwork's two contour families (the frame's Orbit field, 9:8911): each ring steps linearly from its first to its
 * last, brightest mid-family — the document on the canvas, not chrome */
const FAMILIES = [
  { n: 22, from: [163.3, 260.8, 83, 48.5], to: [147.8, 270.5, 125, 80], rot: 28, w: 1.4, lo: 0.24, hi: 0.63 },
  { n: 42, from: [246.1, 135.8, 78.8, 61.3], to: [230.2, 140, 210, 112.5], rot: -28, w: 2.4, lo: 0.25, hi: 0.86 },
]
function OrbitField() {
  return (
    <svg width={423} height={439} viewBox="0 0 423 439" fill="none" aria-hidden="true" className="absolute left-3 top-2.5 overflow-visible">
      {FAMILIES.flatMap((f, k) => Array.from({ length: f.n }, (_, i) => {
        const p = i / (f.n - 1)
        const [cx, cy, rx, ry] = f.from.map((a, j) => a + (f.to[j] - a) * p)
        return <ellipse key={`${k}-${i}`} cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(${f.rot} ${cx} ${cy})`} stroke="currentColor" strokeWidth={f.w} strokeOpacity={f.lo + (f.hi - f.lo) * Math.sin(Math.PI * p)} />
      }))}
    </svg>
  )
}

/* the mode pill is fixed to the viewport (a phone's); a transformed box is its containing block, so it sits where the
 * frame draws it — showcase's AppFloatNav board does the same */
const PILL_BOX = '[transform:translateZ(0)] [&_.kol-mobile-tabbar]:!flex'

export default function VisualEditor() {
  const [tool, setTool] = useState('select')
  const [tab, setTab] = useState('design')
  const [blend, setBlend] = useState('Screen')
  const [opacity, setOpacity] = useState(85)
  const [glow, setGlow] = useState(true)
  const [motion, setMotion] = useState('Slow orbit · 12 s')
  const [visible, setVisible] = useState(true)

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-surface-primary">
      {/* the top bar: the document, the modes, the global actions */}
      <DocumentCapsule name="Still in motion" status="Saved" statusIcon="check" onBack={noop} onMenu={noop} className="absolute left-6 top-8" />
      <div className={`absolute inset-x-0 top-2 h-[82px] pointer-events-none [&_nav]:pointer-events-auto ${PILL_BOX}`}>
        <AppFloatNav variant="mobile" shape="pill" labels placement="top" items={MODES} sheetItems={MORE} currentPath="/editor" onNavigate={noop} />
      </div>
      <GlobalActions onUndo={noop} onRedo={noop} onAction={noop} onAccount={noop} className="absolute right-[35px] top-9" />

      {/* the tools */}
      <ToolRail tools={TOOLS} value={tool} onChange={setTool} className="absolute left-6 top-[300px]" />

      {/* the canvas: its line above, the scene, the hint under it */}
      <SceneBreadcrumb name="Scene 01" meta="1920 × 1080 · 30 fps · 12 s" className="absolute left-32 top-[123px]" />
      <ZoomReadout value="58.3%" onMenu={noop} onFit={noop} className="absolute left-[1110px] top-[117px]" />
      {/* the artwork is dark in either theme (`.dark`, so the well and the selection take dark-theme values): the float well
       * the frame draws (9:8893, not black) */}
      <div className="dark absolute left-32 top-[152px] w-[1120px] h-[630px] overflow-hidden bg-[var(--kol-float-well)] text-ab-white shadow-[var(--kol-shadow-float)]">
        <p className="absolute left-12 top-9 font-[family-name:var(--kol-font-family-mono)] text-[11px] tracking-[1.4px] whitespace-pre opacity-60">FORM STUDIES    /    001</p>
        <p className="absolute left-12 top-[142px] kol-float-display">STILL</p>
        <p className="absolute left-12 top-[264px] kol-float-editorial">IN MOTION</p>
        <p className="absolute left-[50px] top-[466px] w-[360px] kol-float-body-lg opacity-60">A study in shape, light,<br />and everything between.</p>
        <span className="absolute left-12 top-[567px] w-[1024px] h-px bg-ab-white opacity-15" aria-hidden="true" />
        <p className="absolute left-12 top-[588px] kol-float-ruler tracking-[1px] opacity-50">EXPERIMENTS IN PERPETUAL CHANGE</p>
        <p className="absolute left-[955px] top-[588px] kol-float-ruler tracking-[1px] opacity-50">VOL. 01 / 2026</p>
        <SelectionMeasure label="Orbit field" width={754} height={771} className="!absolute left-[638px] top-[76px]">
          <div className="relative w-[440px] h-[450px]"><OrbitField /></div>
        </SelectionMeasure>
      </div>
      <CanvasHint hint={['Drag to move', 'Shift to constrain', 'Double-click to edit']} className="absolute left-32 top-[798px]" />

      {/* the transport, over the timeline's top edge — the desktop capsule, in place (9:8791) */}
      <AppFloatNav variant="transport" inline items={TRANSPORT} timecode={{ current: '00:04:12', total: '00:12:00' }} className="absolute! left-[503px] top-[790px] z-10" />

      {/* the property rail */}
      <PropertyRail
        className="absolute right-6 top-32"
        title="Properties" onCollapse={noop}
        tabs={[{ value: 'design', label: 'Design' }, { value: 'animate', label: 'Animate' }]} tab={tab} onTab={setTab}
        selected={{ icon: 'clr-mono', name: 'Orbit field', visible, onVisible: setVisible }}
        sections={[
          {
            id: 'transform', label: 'TRANSFORM', rows: [
              { type: 'fields', fields: [{ id: 'x', prefix: 'X', value: '1471' }, { id: 'y', prefix: 'Y', value: '516' }] },
              { type: 'fields', fields: [{ id: 'w', prefix: 'W', value: '754' }, { id: 'h', prefix: 'H', value: '771' }] },
              { type: 'fields', fields: [{ id: 'r', prefix: 'R', value: '−28°' }, { id: 'o', value: '100%', label: 'Opacity' }] },
            ],
          },
          {
            id: 'appearance', label: 'APPEARANCE', onAdd: noop, rows: [
              { type: 'select', label: 'Blend mode', options: BLEND, value: blend, onChange: setBlend },
              { type: 'slider', label: 'Opacity', value: opacity, onChange: setOpacity, formatValue: (v) => `${v}%` },
              { type: 'switch', label: 'Soft glow', icon: 'radial-star', on: glow, onChange: setGlow },
            ],
          },
          { id: 'motion', label: 'MOTION', meta: '◇', rows: [{ type: 'select', options: MOTION, value: motion, onChange: setMotion }] },
        ]}
      />

      {/* the timeline — the editor's sheet, handed the scene as data */}
      <TimelineRail
        className="absolute left-[104px] right-6 bottom-3"
        title="Scene 01" count={5} onAdd={noop} looping onLoop={noop} onZoom={noop} onFit={noop} onExpand={noop}
        view={VIEW} now={NOW} rows={ROWS}
      />
    </div>
  )
}
