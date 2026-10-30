import { useState } from 'react'
import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'
import { Icon } from '@kolkrabbi/kol-icons'
import { IconPlate } from '@kolkrabbi/kol-component'
import { SegGroup } from '../lib/icon-controls.jsx'

/* Round 24 — the lock pair (BrandLabToolWindow review 8, the user: *"Locked and unlocked in our kol-icons is so similar
 * its almost impossible to see the difference"*). DECIDED 2026-10-30 on the builder page (app-icon propose.cjs, glyphs mode —
 * https://claude.ai/artifact/DmzGBep2pcarV98PoB8nj4): the shipped drawing scaled to the inner keyline square, the body 0.95 of
 * that height on its base; nothing moves between states but the shackle — in unlock it is lifted to the tall keyline's top,
 * its left leg still in the body, the right leg cut at the arc's shoulder. Landed in kol-icons 0.53.3. Two rounds rejected on
 * the way: a narrower body (off the keyline) and a shackle slid sideways (*"those locks positions dont change"*). */
export const meta = {
  round: 24,
  date: '2026-10-30',
  title: 'lock and unlock, a pair that reads apart',
  status: 'decided',
}

/* the pair before this round (kol-icons 0.53.2, kept in _tmp/2026-10-30-lock-pair-before/) */
const BEFORE = {
  lock: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M17.7143 10H6.28571C5.02335 10 4 10.8954 4 12V20C4 21.1046 5.02335 22 6.28571 22H17.7143C18.9767 22 20 21.1046 20 20V12C20 10.8954 18.9767 10 17.7143 10Z\" stroke=\"currentColor\" stroke-width=\"1.5\"/><path d=\"M7 10V6C7 4.93913 7.52678 3.92172 8.46447 3.17157C9.40215 2.42143 10.6739 2 12 2C13.3261 2 14.5979 2.42143 15.5355 3.17157C16.4732 3.92172 17 4.93913 17 6V10\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/><path d=\"M12 14V17\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></svg>",
  unlock: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M17.7143 10H6.28571C5.02335 10 4 10.8954 4 12V20C4 21.1046 5.02335 22 6.28571 22H17.7143C18.9767 22 20 21.1046 20 20V12C20 10.8954 18.9767 10 17.7143 10Z\" stroke=\"currentColor\" stroke-width=\"1.5\"/><path d=\"M7 10V6C7 4.93913 7.52678 3.92172 8.46447 3.17157C9.40215 2.42143 10.6739 2 12 2C13.3261 2 14.5979 2.42143 15.5355 3.17157C16.4732 3.92172 17 4.93913 17 6\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/><path d=\"M12 14V17\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/></svg>",
}

/* his references: the current unlock as he sees it (99), Adobe Color's unlocked (74) and locked (75) */
const REFS = [
  { src: '/open-questions/2026-10-30-lock-pair/99.png', w: 112, h: 104, label: 'his screenshot, the current unlock' },
  { src: '/open-questions/2026-10-30-lock-pair/74.png', w: 92, h: 82, label: 'Adobe, unlocked' },
  { src: '/open-questions/2026-10-30-lock-pair/75.png', w: 92, h: 78, label: 'Adobe, locked' },
]

const SIZES = [24, 48, 96, 128].map((v) => ({ value: v, label: String(v) }))
const ONOFF = [{ value: true, label: 'ON' }, { value: false, label: 'OFF' }]
const GROUND = [{ value: true, label: 'LIGHT' }, { value: false, label: 'DARK' }]

const sized = (markup, size) => markup.replace(/<svg[^>]*>/, (m) => m.replace(/\s(width|height)="[^"]*"/g, '').replace('<svg ', `<svg width="${size}" height="${size}" `))
const Raw = ({ markup, size }) => <span className="relative inline-flex" style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: sized(markup, size) }} />

function Plate({ label, size, light, guide, draw }) {
  return (
    <span className="inline-flex flex-col items-center gap-1">
      <IconPlate size={size} ground={light ? 'light' : 'dark'} guide={guide}>{draw(size)}</IconPlate>
      <span className="flex items-center gap-2">{draw(16)}<span className="kol-mono-12 text-strong">{label}</span></span>
    </span>
  )
}

export default function OpenQuestionsRound24() {
  usePageMeta({ tags: [], related: [] })
  const [size, setSize] = useState(96)
  const [guide, setGuide] = useState(true)
  const [light, setLight] = useState(true)
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader
        eyebrow="Open questions · Round 24 · 2026-10-30"
        title="lock and unlock, a pair that reads apart"
        lede="Decided 2026-10-30 and landed in kol-icons 0.53.3. The set now ships the pair under Approved; Before is 0.53.2's. The shipped drawing scaled to the inner keyline square, the body 0.95 of that height on its base; nothing moves between states but the shackle, lifted to the tall keyline's top in unlock with its right leg cut at the arc's shoulder."
      />
      <div className="flex flex-wrap items-center gap-6">
        <SegGroup label="SIZE" options={SIZES} value={size} onChange={setSize} />
        <SegGroup label="GUIDE" options={ONOFF} value={guide} onChange={setGuide} />
        <SegGroup label="GROUND" options={GROUND} value={light} onChange={setLight} />
      </div>
      <DocSection id="refs" title="References" lede="what the change is based on">
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          {REFS.map((r) => (
            <figure key={r.src} className="m-0 flex flex-col gap-1">
              <img src={r.src} alt={r.label} width={r.w} height={r.h} className="rounded" style={{ width: r.w, height: r.h }} />
              <figcaption className="kol-mono-12 text-fg-48">{r.label}</figcaption>
            </figure>
          ))}
        </div>
      </DocSection>
      <DocSection id="before" title="Before" lede="kol-icons 0.53.2">
        <div className="flex flex-wrap gap-x-8 gap-y-6">
          <Plate label="lock" size={size} light={light} guide={guide} draw={(s) => <Raw markup={BEFORE.lock} size={s} />} />
          <Plate label="unlock" size={size} light={light} guide={guide} draw={(s) => <Raw markup={BEFORE.unlock} size={s} />} />
        </div>
      </DocSection>
      <DocSection id="approved" title="Approved" lede="kol-icon-set-interface/eye-lock, as the set ships it now">
        <div className="flex flex-wrap gap-x-8 gap-y-6">
          <Plate label="lock" size={size} light={light} guide={guide} draw={(s) => <Icon name="lock" size={s} />} />
          <Plate label="unlock" size={size} light={light} guide={guide} draw={(s) => <Icon name="unlock" size={s} />} />
        </div>
      </DocSection>
    </div>
  )
}
