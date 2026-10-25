import { useState } from 'react'
import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'
import { AppItemMenuProvider, ContentCard } from '@kolkrabbi/kol-component'
import { SegGroup } from '../lib/icon-controls.jsx'

/* Round 17 — the card's back (ticket AppCardBackCover, kol-monitor 2026-10-24). Monitor's patch covers are the patch's
 * OUTPUT now; the rack screenshots they replaced are still worth seeing, and the user wants both on one card: the output
 * in front, the rack revealed on hover. The card's `flip` rode `selected`, so hover could not have it without the card
 * reading as selected. Built: `back` (the second cover) + `backReveal` (how it shows), three treatments, on monitor's
 * real pairs (/previews/patches · /previews/racks). Hover or Tab onto a card. The pick is his; the losers go after. */
export const meta = {
  round: 17,
  date: '2026-10-24',
  title: "The card's back",
  status: 'open',
}

const PAIRS = ['init', 'kaleidoscope', 'rutt-etra', 'wireframe']
const titleOf = (name) => name.replace(/([A-Z])/g, ' $1').replace(/[-_]/g, ' ').trim()
const DAY = 86400000
const STAMP = Date.parse('2026-10-19T12:00:00Z')

const TREATMENTS = [
  { mode: 'flip-image', title: 'flip-image · the pick for now', lede: 'The media turns — the print flip\'s 0.4s turn with a real back face. The text plate and the corner controls (download, mark) stay put, so every control is reachable while the back shows. The default in the tree until the ruling.' },
  { mode: 'flip-card', title: 'flip-card', lede: 'The whole card turns — plate, text, controls and its own ground are the front face; the back is a full face on the card\'s surface, bare. Nothing stays behind (AppCardWholeFlip). Its cost: nothing on the card can be pressed while the back shows.' },
  { mode: 'hover', title: 'hover', lede: 'The back cuts in over the front with no motion — a swap, not a fade (the user\'s "not fade"). Plate and controls stay put.' },
]

const ONOFF = [{ value: true, label: 'ON' }, { value: false, label: 'OFF' }]
const noop = () => {}

function Pairs({ mode, selected, flipped }) {
  return (
    <AppItemMenuProvider>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {PAIRS.map((name, i) => (
          <ContentCard
            key={name}
            variant="app"
            title={titleOf(name)}
            date={STAMP - i * DAY}
            size={2400 + i * 310}
            media={`/previews/patches/${name}.png`}
            back={`/previews/racks/${name}.png`}
            backReveal={mode}
            backHover
            flipped={flipped}
            selected={selected}
            verbs={{ rename: noop, duplicate: noop, remove: noop }}
            download={noop}
            onClick={noop}
          />
        ))}
      </div>
    </AppItemMenuProvider>
  )
}

export default function OpenQuestionsRound17() {
  usePageMeta({ tags: [], related: [] })
  const [selected, setSelected] = useState(false)
  const [flipped, setFlipped] = useState(false)
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader
        eyebrow="Open questions · Round 17 · 2026-10-24"
        title="The card's back"
        lede="A second cover on the app card, revealed on hover and on keyboard focus: monitor's patch output in front, the rack it was built on behind. Three treatments on the same four pairs; hover any card (these opt the hover in with backHover — it is off by default, and FLIPPED turns every card on the page the way a key would). SELECTED proves the selected state holds still while the back shows. Touch gets nothing — the front is the card. Reduced motion turns both flips into the cut."
      />
      <div className="flex flex-wrap items-center gap-6">
        <SegGroup label="SELECTED" options={ONOFF} value={selected} onChange={setSelected} />
        <SegGroup label="FLIPPED" options={ONOFF} value={flipped} onChange={setFlipped} />
      </div>
      {TREATMENTS.map((t) => (
        <DocSection key={t.mode} id={t.mode} title={t.title} lede={t.lede}>
          <Pairs mode={t.mode} selected={selected} flipped={flipped} />
        </DocSection>
      ))}
    </div>
  )
}
