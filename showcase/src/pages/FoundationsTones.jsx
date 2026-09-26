import { useState } from 'react'
import {
  Button, Dropdown, IconFrame, Input, SearchInput, SettingsChoice, SettingsSwitch, ViewToggle,
} from '@kolkrabbi/kol-component'
import { ThemeToggle } from '@kolkrabbi/kol-framework'
import { DocHeader, DocSection } from '@kolkrabbi/kol-workshop'

/**
 * FoundationsTones — the control set on any ground, in any tone (user, 2026-09-26: "a page
 * where I can select the surface class and have a bunch of icon containers, buttons, dropdowns,
 * text fields etc. that change … 2 dropdowns, one for tone, one for surface").
 *
 * Every control below is rendered with NO tone or variant of its own, inside one wrapper that
 * carries the picked surface and the picked `kol-tone-*` class — which is exactly how a page
 * tones its controls (tone-is-the-ground-axis). "none" is the absence of a tone: each control
 * falls back to its family's default.
 */
/* ordered by how far the fill sits from the page — sunken below it, secondary the page itself,
 * then up to the ink (user, 2026-09-26). Dark theme: darkest → brightest; light theme: the same
 * list runs the other way, because sunken is the one below the page in both. Outline and ghost
 * paint no fill, so they sit apart. */
const D = { divider: true }
const TONE_OPTIONS = [
  { value: 'none', label: 'none (inherit)' }, D,
  ...['sunken', 'secondary', 'primary', 'grey', 'inverted'].map((v) => ({ value: v, label: `kol-tone-${v}` })), D,
  ...['outline', 'ghost'].map((v) => ({ value: v, label: `kol-tone-${v}` })),
]
/* the surface CLASSES kol-theme ships (kol-color.css) — sunken is a control tone, not a surface class */
const SURFACES = ['primary', 'secondary', 'tertiary', 'inverse']

/* the PAGE WASH — a translucent fg film over the surface (AppShell `pageWash`, ShellPageWash):
 * fg-02 is the app tier's (AppHub's default, monitor · mirror · fxr), fg-04 monitor's rack */
const WASHES = { none: '', 'fg-02': 'bg-fg-02', 'fg-04': 'bg-fg-04' }

const opts = (list, fmt = (v) => v) => list.map((v) => ({ value: v, label: fmt(v) }))

export default function FoundationsTones() {
  const [tone, setTone] = useState('sunken')
  const [surface, setSurface] = useState('primary')
  const [wash, setWash] = useState('fg-02')
  const [view, setView] = useState('grid')
  const [on, setOn] = useState(true)
  const [aspect, setAspect] = useState('4:5')
  const [text, setText] = useState('')

  return (
    <>
      <DocHeader
        eyebrow="KOL · Foundations"
        title="Tones"
        lede="The control set on a ground. Pick the surface the controls sit on, the wash a page films over it, and the tone a wrapper gives them — every control below passes no tone of its own and inherits it."
      />

      <DocSection id="visualiser" title="Visualiser">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="kol-helper-12 text-meta">Surface</span>
          <Dropdown className="w-44" size="sm" options={opts(SURFACES, (v) => `bg-surface-${v}`)} value={surface} onChange={setSurface} aria-label="Surface" />
          <span className="kol-helper-12 text-meta ml-4">Wash</span>
          <Dropdown className="w-32" size="sm" options={opts(Object.keys(WASHES))} value={wash} onChange={setWash} aria-label="Wash" />
          <span className="kol-helper-12 text-meta ml-4">Tone</span>
          <Dropdown className="w-44" size="sm" options={TONE_OPTIONS} value={tone} onChange={setTone} aria-label="Tone" />
        </div>

        <div
          className={`bg-surface-${surface} ${tone === 'none' ? '' : `kol-tone-${tone}`} rounded border border-fg-08 overflow-hidden`}
        >
          {/* the wash is a film ON the surface, the way a page paints it over AppShell's primary */}
          <div className={`${WASHES[wash]} flex flex-col gap-8 p-8`}>
          <Row label="Buttons">
            <Button size="sm">Button</Button>
            <Button size="md">Button</Button>
            <Button size="md" iconLeft="plus">With icon</Button>
            <Button size="md" iconOnly="settings-01" aria-label="Settings" />
          </Row>
          <Row label="Icon frames">
            <IconFrame name="settings-01" size="sm" aria-label="Settings" />
            <IconFrame name="search" size="sm" aria-label="Search" />
            <IconFrame name="refresh" size="md" aria-label="Refresh" />
            <IconFrame name="x" size="md" aria-label="Close" />
            <ThemeToggle fill="none" label={false} size="sm" />
          </Row>
          <Row label="Dropdowns">
            <Dropdown className="w-40" size="sm" options={opts(['1:1', '4:5', '16:9'])} value={aspect} onChange={setAspect} aria-label="Aspect" />
            <div className="w-40"><SettingsChoice options={['1:1', '4:5', '16:9']} value={aspect} onChange={setAspect} ariaLabel="Aspect (SettingsChoice)" /></div>
          </Row>
          <Row label="Fields">
            <div className="w-56"><Input size="sm" value={text} onChange={(e) => setText(e.target.value)} placeholder="Input" /></div>
            <div className="w-56"><SearchInput size="sm" value={text} onChange={(e) => setText(e.target.value)} placeholder="Search" /></div>
          </Row>
          <Row label="Toggles">
            <ViewToggle variant="icon" size="sm" viewMode={view} onViewChange={setView} />
            <SettingsSwitch on={on} onChange={setOn} />
          </Row>
          </div>
        </div>
      </DocSection>
    </>
  )
}

function Row({ label, children }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="kol-helper-12 text-meta">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}
