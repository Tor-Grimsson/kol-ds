import { useEffect, useState } from 'react'
import { Button, Dropdown, PageHeader, ShellDrawer, Tooltip } from '@kolkrabbi/kol-component'
import { PageShell, ShortcutsOverlay } from '@kolkrabbi/kol-shell'
import { EnvelopeGenerator, EnvelopeModeToggle, SignalReference, useEnvelopeGenerator } from '@kolkrabbi/kol-hardware'
import { EXPRESSION_HELPERS } from '@kolkrabbi/kol-hardware/signal'
import { fixtureClient } from 'media-fixture'

/* Saved curves — the fake D1's `tool_settings` row for `curves` (the editor's pattern), so a real
 * database later is one seam. A saved row is `[code, label]`, the shape the Saved tab renders. */
const TOOL = 'curves'
const helpersIn = (expr) => EXPRESSION_HELPERS.filter((h) => new RegExp(`\\b${h}\\(`).test(expr))

function useSaved() {
  const [saved, setSaved] = useState({ equation: [], adsr: [] })
  useEffect(() => {
    fixtureClient.loadToolSettings(TOOL).then((s) => { if (s?.saved) setSaved(s.saved) })
  }, [])
  const save = ({ mode, code }) => {
    const list = saved[mode] ?? []
    if (list.some(([c]) => c === code)) return
    const label = mode === 'equation' ? (helpersIn(code).join(' · ') || 'Custom') : `Envelope ${list.length + 1}`
    const next = { ...saved, [mode]: [...list, [code, label]] }
    setSaved(next)
    fixtureClient.saveToolSettings(TOOL, { saved: next })
  }
  return { saved, save }
}

/* The reference's three shapes — the ones the estate mounts it in: mirror's panel beside the
 * scope, monitor's EX / REF popovers, labs' sheet. Picked from the masthead; none stacks down
 * the page. Below lg there is no room for the panel, so it falls back to the popovers. */
const SHAPES = [
  { value: 'panel', label: 'Panel' },
  { value: 'popover', label: 'Popover' },
  { value: 'sheet', label: 'Sheet' },
]

/* The S sheet — how the tool is used, instead of copy on the page (the tool frame, rule 5) */
const SHORTCUTS = [
  {
    section: 'Scope',
    items: [
      { id: 'pan', label: 'Pan the view', combo: 'drag' },
      { id: 'handles', label: 'Shape the envelope (ADSR)', combo: 'drag A · D · S · R' },
      { id: 'knob', label: 'Reset a knob or slider', combo: '⌥ click' },
    ],
  },
  {
    section: 'Reference',
    items: [
      { id: 'load', label: 'Load a code', combo: 'click' },
      { id: 'append', label: 'Append to the expression', combo: '⌘ click' },
    ],
  },
  {
    section: 'Timing',
    items: [
      { id: 'bpm', label: 't counts beats — 60 BPM is one a second', combo: 'BPM' },
      { id: 'cycle', label: 'Cycle off runs the envelope once', combo: 'Trigger' },
    ],
  },
  {
    section: 'Help',
    items: [{ id: 'sheet', label: 'This sheet', combo: 'S' }],
  },
]

/* THE ENVELOPE GENERATOR, ALONE, IN THE TOOL FRAME (plan-2026-09-27-app-frame-and-curves) — the
 * page is kol-shell's PageShell fixed: the CURVES masthead with the mode and the reference shape on
 * the right, and the generator filling the rest of the window. Every part is kol-hardware's; this
 * file arranges them and holds the saved rows. */
export default function App() {
  const { saved, save } = useSaved()
  const g = useEnvelopeGenerator({ saved: saved.equation, savedAdsr: saved.adsr, onSave: save })
  const [shape, setShape] = useState('panel')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  /* S — the sheet. Ignored while typing: an expression field owns its own letters. */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 's' || e.metaKey || e.ctrlKey || e.altKey) return
      const el = e.target
      if (el?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el?.tagName ?? '')) return
      e.preventDefault()
      setShortcutsOpen((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const popovers = <SignalReference key={g.mode} {...g.reference} variant="popover" />
  const actions = (
    <>
      <EnvelopeModeToggle generator={g} />
      <span className="hidden lg:inline-flex">
        <Tooltip label="Reference">
          <Dropdown value={shape} onChange={setShape} options={SHAPES} />
        </Tooltip>
      </span>
      {shape === 'popover' && popovers}
      {shape === 'panel' && <span className="inline-flex lg:hidden">{popovers}</span>}
      {shape === 'sheet' && <Button tone="grey" size="sm" pressed={sheetOpen} onClick={() => setSheetOpen(true)}>REF</Button>}
    </>
  )

  return (
    <PageShell mode="fixed" className="gap-10 [--kol-page-header-mb:0]">
      <PageHeader title="CURVES" actions={actions} />
      <div className="min-h-0 flex-1">
        <EnvelopeGenerator generator={g} reference={shape === 'panel' ? 'panel' : 'none'} />
      </div>

      <ShellDrawer open={sheetOpen} onClose={() => setSheetOpen(false)} side="bottom" height="60vh">
        <SignalReference key={g.mode} {...g.reference} variant="sheet" className="kol-helper-12 p-6" />
      </ShellDrawer>
      {shortcutsOpen && <ShortcutsOverlay shortcuts={SHORTCUTS} onClose={() => setShortcutsOpen(false)} />}
    </PageShell>
  )
}
