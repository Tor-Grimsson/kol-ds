import { useState } from 'react'
import { AppFloatNav } from '@kolkrabbi/kol-shell'
import { TimelineRail, timelineView } from '@kolkrabbi/design-editor/core'
import FamilyPage, { Part } from '../FamilyPage.jsx'

/* Timeline (24-float-system.md § The parts, by family, row 12). design-editor/core ships the Timeline's Rail
 * (`TimelineRail` + `timelineView`) — the engine-bound `Timeline` is not exported and renders through the same Rail,
 * so both Parts draw it from data, as apps/float's visual editor does. No showcase component page exists for either. */

const noop = () => {}
const Wide = ({ children }) => <div className="w-full overflow-x-auto"><div className="min-w-[760px]">{children}</div></div>
/* the transport pill is fixed to the viewport (a phone's); a transformed box is its containing block — VisualEditor's glue */
const PILL_BOX = 'relative h-[82px] w-[306px] [transform:translateZ(0)] [&_.kol-mobile-tabbar]:!flex'

const LOOP = 12
const WAVE = Array.from({ length: 96 }, (_, i) => ((i % 10) + 1) / 10)
const keys = (xs) => xs.map((t) => ({ t, v: 0 }))
const SCENE = [
  { id: 'orbit', layer: { id: 'orbit', icon: 'clr-mono' }, name: 'Orbit field', lit: true, track: { id: 'orbit:rotation', label: 'Orbit · rotation', keys: keys([0.14, 0.31, 0.64, 0.94]) } },
  { id: 'title', layer: { id: 'title', icon: 'type' }, name: 'Title group', label: 'STILL / IN MOTION' },
  { id: 'grain', layer: { id: 'grain', icon: 'radial-star' }, name: 'Film grain' },
  { id: 'background', layer: { id: 'background', icon: 'square', locked: true }, name: 'Background' },
  { id: 'ambient', layer: { id: 'ambient', icon: 'space-evenly-horizontal' }, name: 'Ambient.wav', kind: 'wave', label: 'Ambient · stereo', wave: WAVE },
]
const TITLES = [
  { id: 'headline', layer: { id: 'headline', icon: 'type' }, name: 'Headline', lit: true, track: { id: 'headline:opacity', label: 'Headline · opacity', keys: keys([0.05, 0.2, 0.8, 0.95]) } },
  { id: 'rule', layer: { id: 'rule', icon: 'minus' }, name: 'Rule', track: { id: 'rule:width', label: 'Rule · width', keys: keys([0.1, 0.45]) } },
  { id: 'logo', layer: { id: 'logo', icon: 'image' }, name: 'Logo', label: 'kolkrabbi.svg' },
]
const TRANSPORT = [
  { id: 'play', icon: 'play', label: 'Play', selected: true },
  { id: 'pause', icon: 'pause', label: 'Pause' },
  { id: 'loop', icon: 'repeat', label: 'Loop' },
  { id: 'stop', icon: 'square', label: 'Stop' },
  { id: 'back', icon: 'skip-back', label: 'Back' },
]

export default function Timeline() {
  const [now, setNow] = useState(4.12)
  const [zoom, setZoom] = useState(2)
  const [looping, setLooping] = useState(true)
  const seek = (frac) => setNow(frac * LOOP)

  return (
    <FamilyPage title="Timeline" body="The editor's timeline on its transport — toolbar, ruler, layer tracks, lanes and the playhead — and the same Rail drawn from data.">
      {(surface) => (
        <>
          <Part name="Timeline">
            <div className="flex w-full flex-col items-center">
              <div className={`${PILL_BOX} pointer-events-none [&_nav]:pointer-events-auto -mb-6 z-10`}>
                <AppFloatNav variant="transport" items={TRANSPORT} timecode={{ current: '00:04:12', total: '00:12:00' }} />
              </div>
              <Wide>
                <TimelineRail surface={surface} title="Scene 01" count={SCENE.length} onAdd={noop} looping={looping} onLoop={() => setLooping((l) => !l)}
                  onZoom={noop} onFit={noop} onExpand={noop} view={timelineView(LOOP, 1, now)} now={now} seek={seek} rows={SCENE} />
              </Wide>
            </div>
          </Part>

          <Part name="TimelineRail">
            <Wide>
              <TimelineRail surface={surface} title="Titles" count={TITLES.length} mode="Curve" zoom={zoom} onZoom={() => setZoom((z) => (z >= 4 ? 1 : z * 2))} onFit={() => setZoom(1)}
                view={timelineView(LOOP, zoom, now)} now={now} seek={seek} rows={TITLES} />
            </Wide>
          </Part>
        </>
      )}
    </FamilyPage>
  )
}
