import { useState } from 'react'
import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'
import { PhoneNav, TransportPill } from '@kolkrabbi/kol-shell'

/* Round 22 — the phone Labs layout on the DS (PhoneNavTopAndFold + TransportPill, kol-fxr 2026-10-27, frame E — his approved
 * proposal, https://claude.ai/artifact/KRTF3jBpfpHUsEpyroDqRD). Built: TabsRow's pill takes `edge` (top) · `border` ·
 * `shadow` · `active="circle"` · `foldable` (swipe to an edge tab); PhoneNav takes `placement="top"`, `foldable`,
 * `moreKeepsOpen` and panel items (`onPress` · `selected`); TransportPill is the same pill of action slots, one opening a
 * sheet above it. The frame below is a 390 phone; every piece is the shipped component. Published 2026-10-27 on his "do the
 * tickets", the round open for his review. */
export const meta = {
  round: 22,
  date: '2026-10-27',
  title: 'The phone Labs layout: nav on top, transport pill',
  status: 'open',
}

const LENGTHS = [2, 4, 8, 12, 16]

function Phone() {
  const [panel, setPanel] = useState('params')
  const [transport, setTransport] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [loop, setLoop] = useState(4)
  const toggle = (p) => setPanel((cur) => (cur === p ? null : p))
  const nav = [
    { id: 'home', icon: 'nav-home', label: 'Home', selected: false, onPress: () => { setPanel(null); setTransport(false) } },
    { id: 'catalog', icon: 'grid', label: 'Catalog', selected: panel === 'catalog', onPress: () => toggle('catalog') },
    { id: 'params', icon: 'layers', label: 'Params', selected: panel === 'params', onPress: () => toggle('params') },
    { id: 'transport', icon: 'play', label: 'Transport', selected: transport, onPress: () => setTransport((t) => !t) },
    { id: 'output', icon: 'download', label: 'Output', path: '/output' },
    { id: 'settings', icon: 'nav-settings', label: 'Settings', path: '/settings' },
  ]
  const transportItems = [
    { id: 'play', icon: 'play', label: 'Play', selected: playing, onPress: () => setPlaying(true) },
    { id: 'pause', icon: 'pause', label: 'Pause', selected: !playing, onPress: () => setPlaying(false) },
    { id: 'loop', icon: 'stopwatch-solid', label: 'Loop length' },
    { id: 'stop', icon: 'stop', label: 'Stop', onPress: () => setPlaying(false) },
    { id: 'rewind', icon: 'rewind', label: 'Rewind' },
  ]
  const sheetFor = { loop: LENGTHS.map((n) => ({ label: `${n} s`, checked: n === loop, onPress: () => setLoop(n) })) }
  return (
    /* the components are fixed to the viewport and show below 768: the frame's `transform` contains them, `!flex` lifts the
     * breakpoint for the pills and the edge tabs */
    <div
      data-theme="dark"
      className="relative overflow-hidden rounded border border-fg-08 bg-surface-primary [&_.kol-mobile-tabbar]:!flex [&_.kol-mobile-tabbar-tab]:!flex"
      style={{ width: 390, height: 760, maxWidth: '100%', transform: 'translateZ(0)' }}
    >
      <div className="absolute inset-x-0 kol-mono-12 text-meta text-center" style={{ top: 300 }}>
        the stage ({playing ? 'playing' : 'paused'}, loop {loop} s)
      </div>
      {panel && (
        <div className="absolute inset-x-0 bottom-0 bg-surface-secondary p-6 kol-mono-12 text-meta" style={{ height: 300, paddingBottom: 96 }}>
          {panel === 'params' ? 'Params panel' : 'Catalog panel'}
        </div>
      )}
      <PhoneNav items={nav} shape="pill" placement="top" border={false} active="circle" foldable moreKeepsOpen onNavigate={() => {}} />
      {transport && <TransportPill items={transportItems} sheetFor={sheetFor} foldable />}
    </div>
  )
}

export default function OpenQuestionsRound22() {
  usePageMeta({ tags: [], related: [] })
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader
        eyebrow="Open questions · Round 22 · 2026-10-27"
        title="The phone Labs layout: nav on top, transport pill"
        lede="kol-fxr's frame E on the shipped components. The nav pill sits on top with no hairline and the 44 circle; More opens below it without closing the open panel. The transport is the same pill at the bottom with a shadow; the stopwatch opens the loop lengths. Swipe either pill sideways to fold it into an edge tab, tap the tab to bring it back. Published in kol-component 0.304.0, kol-shell 0.83.0 and kol-icons 0.47.0; open for your review."
      />
      <DocSection id="phone" title="On a phone">
        <Phone />
      </DocSection>
    </div>
  )
}
