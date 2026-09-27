import { useEffect, useState } from 'react'
import { PageHeader } from '@kolkrabbi/kol-component'
import { EnvelopeGenerator, SignalReference } from '@kolkrabbi/kol-hardware'
import { EXPRESSION_SECTIONS, EXPRESSION_TABS, EXPRESSION_HELPERS } from '@kolkrabbi/kol-hardware/signal'
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

/* THE ENVELOPE GENERATOR, ALONE (deconstruction roadmap track 3, 2026-09-27) — kol-hardware's
 * EnvelopeGenerator over the one signal engine: a value over time, typed as an equation or shaped
 * as ADSR. Below it, the same reference in the other two shapes consumers mount it in — monitor's
 * EX / REF popovers on a module face, and labs' sheet — so all three can be judged side by side. */

export default function App() {
  const [picked, setPicked] = useState(null)
  const { saved, save } = useSaved()
  return (
    <div className="mx-auto flex w-full max-w-[var(--kol-content-shell)] flex-col gap-10 px-4 py-8 md:px-8">
      <PageHeader
        eyebrow="Apps tier"
        title="Curves"
        subtitle="A value over time — an equation or an ADSR envelope — on one engine, with the reference beside it."
      />
      <EnvelopeGenerator saved={saved.equation} savedAdsr={saved.adsr} onSave={save} />

      <section className="flex flex-col gap-4 border-t border-oq-08 pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="kol-doc-section-title">Reference · popover</h2>
          <code className="kol-doc-code-inline">SignalReference variant="popover" — kol-monitor's Scope+ face</code>
        </div>
        <div className="flex items-center gap-4 rounded-[4px] bg-surface-secondary p-4">
          <SignalReference variant="popover" sections={EXPRESSION_SECTIONS} tabs={EXPRESSION_TABS} onPick={setPicked} />
          <span className="kol-helper-10 text-fg-48">{picked ? `picked ${picked}` : 'pick a code'}</span>
        </div>
      </section>

      <section className="flex flex-col gap-4 border-t border-oq-08 pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="kol-doc-section-title">Reference · sheet</h2>
          <code className="kol-doc-code-inline">SignalReference variant="sheet" — the editor's labs shortcuts sheet</code>
        </div>
        <SignalReference variant="sheet" sections={EXPRESSION_SECTIONS} tabs={EXPRESSION_TABS} onPick={setPicked}
          className="rounded-[4px] bg-surface-secondary p-4" />
      </section>
    </div>
  )
}
