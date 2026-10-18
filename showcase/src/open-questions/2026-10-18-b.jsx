import { useState } from 'react'
import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'
import { Icon } from '@kolkrabbi/kol-icons'
import { IconPlate } from '@kolkrabbi/kol-component'
import { SegGroup } from '../lib/icon-controls.jsx'

/* Round 13 — `video-off` (ticket IconVideoOff, kol-monitor 2026-10-18): the last icon monitor still draws from its own
 * set — Stage's background-video toggle pairs it with kol-icons' `video`. Drawn on `eye-off`'s idiom: the shipped
 * `video`, one 3→21 slash, the outline broken where the slash crosses it. Proposal: _tmp/2026-10-18-video-off/. */
export const meta = {
  round: 13,
  date: '2026-10-18',
  title: 'video-off',
  status: 'answered',
}

const MONITOR = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"> <path d=\"M3.70711 2.29289L2.29289 3.70711L4.58579 6H2V18H14.5858L20.2929 23.7071L21.7071 22.2929L3.70711 2.29289ZM6.41421 8L12.5858 14.1716V16H4V8H6.41421ZM16 7.2L22 4V16L20 14.8V6.4L16 8.4V13.17L14 11.17V6H8.82843L6.82843 4H16V7.2Z\" fill=\"currentColor\"/> </svg>"
const PROPOSED = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M7.75 6.5 H15 a1 1 0 0 1 1 1 V14.75\" /><path d=\"M14.75 17.5 H4.5 a1 1 0 0 1 -1 -1 V7.5 a1 1 0 0 1 1 -1 H5.25\" /><path d=\"M16 10.5 L20.5 8 V16 L16 13.5 Z\" /><path d=\"M3 3 L21 21\" /></svg>"

const SIZES = [24, 48, 96, 128].map((v) => ({ value: v, label: String(v) }))
const ONOFF = [{ value: true, label: 'ON' }, { value: false, label: 'OFF' }]
const GROUND = [{ value: true, label: 'LIGHT' }, { value: false, label: 'DARK' }]

const sized = (markup, size) => markup.replace(/<svg[^>]*>/, (m) => m.replace(/\s(width|height)="[^"]*"/g, '').replace('<svg ', `<svg width="${size}" height="${size}" `))
const Raw = ({ markup, size }) => <span className="relative inline-flex" style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: sized(markup, size) }} />

function Plate({ label, size, light, guide, draw, dim }) {
  return (
    <span className={`inline-flex flex-col items-center gap-1${dim ? ' opacity-60' : ''}`}>
      <IconPlate size={size} ground={light ? 'light' : 'dark'} guide={guide}>{draw(size)}</IconPlate>
      <span className="flex items-center gap-2">{draw(16)}<span className="kol-mono-12 text-strong">{label}</span></span>
    </span>
  )
}

export default function OpenQuestionsRound13() {
  usePageMeta({ tags: [], related: [] })
  const [size, setSize] = useState(96)
  const [guide, setGuide] = useState(true)
  const [light, setLight] = useState(true)
  const [compare, setCompare] = useState(false)
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader
        eyebrow="Open questions · Round 13 · 2026-10-18"
        title="video-off"
        lede="What goes into kol-icons: video-off, beside the video it pairs with on Stage's toggle. COMPARE puts monitor's source in front. Shipped 2026-10-18 in kol-icons 0.41.0 on the user's word."
      />
      <div className="flex flex-wrap items-center gap-6">
        <SegGroup label="SIZE" options={SIZES} value={size} onChange={setSize} />
        <SegGroup label="GUIDE" options={ONOFF} value={guide} onChange={setGuide} />
        <SegGroup label="GROUND" options={GROUND} value={light} onChange={setLight} />
        <SegGroup label="COMPARE" options={ONOFF} value={compare} onChange={setCompare} />
      </div>
      <DocSection id="pair" title="The pair" lede="video as shipped, video-off proposed">
        <div className="flex flex-wrap gap-x-8 gap-y-6">
          {compare && <Plate dim label="monitor" size={size} light={light} guide={guide} draw={(s) => <Raw markup={MONITOR} size={s} />} />}
          <Plate label="video" size={size} light={light} guide={guide} draw={(s) => <Icon name="video" size={s} />} />
          <Plate label="video-off" size={size} light={light} guide={guide} draw={(s) => <Raw markup={PROPOSED} size={s} />} />
        </div>
      </DocSection>
    </div>
  )
}
