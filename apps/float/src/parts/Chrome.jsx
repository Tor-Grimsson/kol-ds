import { useState } from 'react'
import { Button, TabsRow } from '@kolkrabbi/kol-component'
import {
  AppFloatNav, CanvasHint, DocumentCapsule, GlobalActions, PanelsRestore, ProgressDock, PropertyRail, ReaderBar,
  SceneBreadcrumb, SelectionMeasure, Timecode, ToolRail, TopControlsBar, ZoomReadout,
} from '@kolkrabbi/kol-shell'
import FamilyPage, { Part } from '../FamilyPage.jsx'

/* float-set W1 — the Chrome family (24-float-system.md § The parts, by family, row 5). Every part live from kol-shell /
 * kol-component; `surface` goes to every part that takes one. The sample data is the editor's and the dashboard's. */
const noop = () => {}
/* the part's showcase component page — relative, so it resolves on ui.kolkrabbi.io and inside the showcase's Float set */
/* a wide part scrolls inside its own box, never the page */
const Wide = ({ children }) => <div className="w-full min-w-0 overflow-x-auto">{children}</div>
/* the transport is fixed to the viewport (a phone's pill); a transformed box is its containing block */
const PILL_BOX = 'relative w-[306px] max-w-full h-[82px] [transform:translateZ(0)] [&_.kol-mobile-tabbar]:!flex'

const TOOLS = [
  { id: 'select', icon: 'pointer', label: 'Select', kbd: 'V' },
  { id: 'move', icon: 'drag-handle', label: 'Move', kbd: 'H' },
  { id: 'rect', icon: 'square', label: 'Rectangle', kbd: 'R' },
  { id: 'ellipse', icon: 'circle', label: 'Ellipse', kbd: 'O' },
  { id: 'text', icon: 'type', label: 'Text', kbd: 'T' },
  { id: 'pen', icon: 'pen', label: 'Pen', kbd: 'P' },
  { id: 'image', icon: 'image', label: 'Image', kbd: 'I' },
  { id: 'effect', icon: 'radial-star', label: 'Effect', kbd: 'E' },
]
const TRANSPORT = [
  { id: 'play', icon: 'play', label: 'Play', selected: true },
  { id: 'pause', icon: 'pause', label: 'Pause' },
  { id: 'loop', icon: 'repeat', label: 'Loop' },
  { id: 'stop', icon: 'square', label: 'Stop' },
  { id: 'back', icon: 'skip-back', label: 'Back' },
]
const DOC_MENU = [{ label: 'Rename', icon: 'pencil', onPress: noop }, { label: 'Duplicate', icon: 'layers', onPress: noop }, { label: 'Move to…', icon: 'folder', onPress: noop }]
const PANELS = [{ label: 'Side panel', icon: 'panel-right', onPress: noop }, { label: 'Task index', icon: 'list-bullet', onPress: noop }]
const NAV = [
  { id: 'tasks', value: 'tasks', label: 'Tasks', icon: 'checklist', count: 5 },
  { id: 'capture', value: 'capture', label: 'Capture', icon: 'inbox', count: 3 },
  { id: 'projects', value: 'projects', label: 'Projects', icon: 'folder' },
  { id: 'calendar', value: 'calendar', label: 'Calendar', icon: 'calendar' },
  { id: 'metrics', value: 'metrics', label: 'Metrics', icon: 'bar-chart' },
  { id: 'links', value: 'links', label: 'Links', icon: 'link' },
]
const BLEND = [{ value: 'normal', label: 'Normal' }, { value: 'screen', label: 'Screen' }, { value: 'multiply', label: 'Multiply' }]

export default function Chrome() {
  const [tool, setTool] = useState('select')
  const [tab, setTab] = useState('design')
  const [nav, setNav] = useState('tasks')
  const [ins, setIns] = useState('design')
  const [page, setPage] = useState(125)
  const [v, setV] = useState({ blend: 'screen', opacity: 85, glow: true, visible: true })
  const set = (k) => (val) => setV((s) => ({ ...s, [k]: val }))
  return (
    <FamilyPage title="Chrome" body="The editor's and the dashboard's chrome — the rails, the bars, the readouts on the canvas.">
      {(surface) => (
        <>
          <Part name="ToolRail" slug="tool-rail"><ToolRail tools={TOOLS} value={tool} onChange={setTool} surface={surface} /></Part>
          <Part name="ToolRail with its ⋮" slug="tool-rail">
            <ToolRail tools={TOOLS.slice(0, 4)} value={tool} onChange={setTool} surface={surface}
              more={[{ label: 'Hand', icon: 'hand', kbd: 'H', onClick: noop }, { label: 'Reset colours', icon: 'refresh', kbd: 'D', onClick: noop }]} />
          </Part>
          <Part name="PropertyRail" slug="property-rail">
            <PropertyRail surface={surface} title="Properties" onCollapse={noop}
              tabs={[{ value: 'design', label: 'Design' }, { value: 'animate', label: 'Animate' }]} tab={tab} onTab={setTab}
              selected={{ icon: 'clr-mono', name: 'Orbit field', visible: v.visible, onVisible: set('visible') }}
              sections={[
                { label: 'TRANSFORM', rows: [
                  { type: 'fields', id: 'pos', fields: [{ id: 'x', prefix: 'X', value: '1471' }, { id: 'y', prefix: 'Y', value: '516' }] },
                  { type: 'fields', id: 'size', fields: [{ id: 'w', prefix: 'W', value: '754' }, { id: 'h', prefix: 'H', value: '771' }] },
                ] },
                { label: 'APPEARANCE', onAdd: noop, rows: [
                  { type: 'select', id: 'blend', label: 'Blend mode', options: BLEND, value: v.blend, onChange: set('blend') },
                  { type: 'slider', id: 'opacity', label: 'Opacity', value: v.opacity, onChange: set('opacity'), min: 0, max: 100, formatValue: (n) => `${n}%` },
                  { type: 'switch', id: 'glow', label: 'Soft glow', icon: 'radial-star', on: v.glow, onChange: set('glow') },
                ] },
              ]} />
          </Part>
          <Part name="transport with Timecode" slug="app-float-nav">
            <div className={PILL_BOX}>
              <AppFloatNav variant="transport" surface={surface} items={TRANSPORT} timecode={{ current: '00:04:12', total: '00:12:00' }} />
            </div>
            <Timecode current="00:04:12" total="00:12:00" />
          </Part>
          <Part name="DocumentCapsule" slug="document-capsule"><DocumentCapsule name="Still in motion" status="Saved" statusIcon="check" onBack={noop} menuItems={DOC_MENU} surface={surface} /></Part>
          <Part name="GlobalActions" slug="global-actions">
            <GlobalActions onUndo={noop} onRedo={noop} onAction={noop} onAccount={noop} />
            <GlobalActions onUndo={noop} onRedo={noop} onAction={noop} account={{ initial: 'K', label: 'Kolkrabbi' }} onAccount={noop} />
          </Part>
          <Part name="ZoomReadout" slug="zoom-readout"><ZoomReadout value="58.3%" onMenu={noop} onFit={noop} /></Part>
          <Part name="SceneBreadcrumb" slug="scene-breadcrumb"><SceneBreadcrumb name="Scene 01" meta="1920 × 1080 · 30 fps · 12 s" /></Part>
          <Part name="CanvasHint" slug="canvas-hint"><CanvasHint hint={['Drag to move', 'Shift to constrain', 'Double-click to edit']} /></Part>
          <Part name="SelectionMeasure" slug="selection-measure">
            <div className="p-8">
              <SelectionMeasure width={754} height={771} label="Orbit field">
                <div className="w-[240px] max-w-[60vw] h-[160px] rounded-[var(--kol-float-list-r)] bg-oq-08" />
              </SelectionMeasure>
            </div>
          </Part>
          <Part name="TopControlsBar" slug="top-controls-bar">
            <Wide>
              <TopControlsBar surface={surface} document={{ name: 'Studio / Dashboard', onBack: noop, menuItems: DOC_MENU }}
                tabs={NAV} tab={nav} onTab={setNav} onSearch={noop} panels={{ items: PANELS }} action={{ label: 'New task', onPress: noop }} />
            </Wide>
          </Part>
          <Part name="TabsRow with counts" slug="tabs-row">
            <TabsRow variant="float" size="xs" tabs={[{ id: 'design', label: 'Design' }, { id: 'animate', label: 'Animate' }]} value={ins} onChange={setIns} ariaLabel="Inspector" />
            <Wide>
              <TabsRow variant="float" size="lg" surface={surface} tabs={NAV} value={nav} onChange={setNav} ariaLabel="Dashboard"
                trailing={<><Button variant="float" tone="ghost" size="lg" iconOnly="search" aria-label="Search tasks" /><Button variant="float" tone="inverted" size="lg" iconLeft="plus">New task</Button></>} />
            </Wide>
          </Part>
          <Part name="PanelsRestore" slug="panels-restore"><PanelsRestore items={PANELS} surface={surface} /></Part>
          <Part name="ReaderBar" slug="reader-bar">
            <Wide><ReaderBar surface={surface} path={['My library', 'The Waves']} onBack={noop} onContents={noop} onSearch={noop} onBookmark={noop} onTools={noop} /></Wide>
          </Part>
          <Part name="ProgressDock" slug="progress-dock">
            <Wide><ProgressDock surface={surface} page={page} pages={297} onPrev={() => setPage((p) => Math.max(1, p - 1))} onNext={() => setPage((p) => Math.min(297, p + 1))} onSeek={setPage} /></Wide>
          </Part>
        </>
      )}
    </FamilyPage>
  )
}
