import { useState } from 'react'
import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'
import { Button, SettingsFooter, SettingsPanel, SettingsSections } from '@kolkrabbi/kol-component'

/* Round 18 — the app tier's rail width (ticket RailKit, kol-monitor 2026-10-24: *"currently settings is showing 380 wide and
 * padding is totally different in the rail and the settings"*). One width per tier is now a token (`--kol-rail-w-app`,
 * `--kol-rail-w-site`) that the settings rail and every page rail read. The site tier keeps the 380 locked 2026-08-27. The
 * app tier is 320 in the tree — the shell rail's open width on a wide screen, and the narrowest that keeps a 160 label
 * column beside a usable control; fxr's inspector rides the shell rail's 264 · 320 ramp, monitor's patch table had 440.
 * The same settings rail at the three candidates, for his pick.
 * ANSWERED 2026-10-25 — 380 (*"why is settings now less wide? it was fine before?"*): `--kol-rail-w-app` is 380, the settings
 * rail as it was on 2026-08-27; the site tier was 380 already. kol-theme Unreleased. */
export const meta = {
  round: 18,
  date: '2026-10-24',
  title: "The app rail's width",
  status: 'answered',
}

const ASPECTS = ['1:1', '4:5', '16:9'].map((v) => ({ value: v, label: v }))
const WIDTHS = [
  { w: 264, note: "the shell rail's open width below 1536 — fxr's inspector at a desk" },
  { w: 320, note: "the tree's number while this was open — the shell rail's open width from 1536" },
  { w: 380, note: 'THE ANSWER — the settings rail as locked 2026-08-27 (kol-r2b2); both tiers' },
]

function Candidate({ w, note, open, onOpen, onClose }) {
  const [prefs, setPrefs] = useState({ aspect: '4:5', grid: true, autoplay: false })
  const set = (k) => (v) => setPrefs((p) => ({ ...p, [k]: v }))
  return (
    <div className="flex flex-col gap-2 rounded border border-fg-08 p-4">
      <span className="kol-doc-eyebrow">{w} wide</span>
      <p className="kol-mono-12 text-meta">{note}</p>
      <div><Button size="sm" onClick={onOpen}>Open at {w}</Button></div>
      <SettingsPanel open={open} onClose={onClose} variant="rail" tier="app" width={w} title="Settings" subtitle={`${w} wide`} footer={<SettingsFooter onReset={() => setPrefs({ aspect: '4:5', grid: true, autoplay: false })} />}>
        <SettingsSections divided sections={[
          { label: 'Defaults', rows: [
            { label: 'Default aspect', type: 'choice', options: ASPECTS, value: prefs.aspect, onChange: set('aspect') },
            { label: 'Show grid', type: 'switch', on: prefs.grid, onChange: set('grid') },
          ] },
          { label: 'Transport', rows: [{ label: 'Autoplay', type: 'switch', on: prefs.autoplay, onChange: set('autoplay') }] },
        ]} />
      </SettingsPanel>
    </div>
  )
}

export default function OpenQuestionsRound18() {
  usePageMeta({ tags: [], related: [] })
  const [open, setOpen] = useState(null)
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader
        eyebrow="Open questions · Round 18 · 2026-10-24"
        title="The app rail's width"
        lede="Answered 2026-10-25: 380 — the settings rail as it was. One width per tier, as a token the settings rail and every page rail read; the app tier had been 320 in the tree while this was open. The same settings rail at 264, 320 and 380 stays here for the record. The rails on their frame are apps/rails."
      />
      <DocSection id="candidates" title="The candidates" lede="The same rail, three widths.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {WIDTHS.map((c) => <Candidate key={c.w} {...c} open={open === c.w} onOpen={() => setOpen(c.w)} onClose={() => setOpen(null)} />)}
        </div>
      </DocSection>
    </div>
  )
}
