import { useState } from 'react'
import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'
import { ActionButton, Button, Divider, Rail, RailActions, RailHeader, RailHint, RailRow, RailSection } from '@kolkrabbi/kol-component'

/* Round 19 — what a scrimless rail is made of (plan-2026-10-25-rails W3). The patch and page rails take no scrim —
 * monitor's own ticket (SettingsPanelBackdrop): the rack stays live so a cable can be patched with the table open. With
 * no scrim and `edge={false}` the rail stood on the page's own ground and nothing said where it began (user 2026-10-25:
 * *"wrong color wrong everything"*). Three ways the same patch rail can say so, each opened over this page, for his
 * pick.
 * ANSWERED 2026-10-25 — none of the three on the role (*"border off, but ship with opt in if they want"*, *"why do some have
 * border and some do not?"*): no role draws an edge; `edge` stays on Rail as the opt-in. The page rail took the settings rail's
 * shell the same day, so the only scrimless rail left is the patch table over a live rack. */
export const meta = {
  round: 19,
  date: '2026-10-25',
  title: 'What a scrimless rail is made of',
  status: 'answered',
}

const CABLES = [['Clock · out', 'LFO · cv'], ['LFO · out', 'Mixer · cv'], ['Noise · out', 'Mixer · gate'], ['Mixer · out', 'Output · cv']]

const CANDIDATES = [
  { id: 'edge', title: 'the edge', lede: 'A hairline on the side that faces the page; the page stays live and bright. Rejected on the role — `edge` is the opt-in.', props: { edge: true } },
  { id: 'ground', title: 'a second ground', lede: 'No line; the rail stands on surface-secondary, one step off the page. Reads as a surface by tone alone — and on a dark page the step is small.', props: { className: 'bg-surface-secondary' } },
  { id: 'scrim', title: 'the scrim after all', lede: 'The settings rail’s treatment on every rail: the page dims and locks. Unmistakable — and the rack behind the patch table is no longer live, which is what monitor asked for.', props: { backdrop: true } },
]

function PatchRail({ open, onClose, props }) {
  const [cables, setCables] = useState(CABLES)
  return (
    <Rail role="patch" open={open} onClose={onClose} {...props} header={<RailHeader title="Patch table" subtitle={`${cables.length} cables`} />}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          {cables.length === 0 && <RailHint>No cables.</RailHint>}
          {cables.map(([from, to], i) => (
            <div key={`${from}-${to}`} className="flex h-8 items-center gap-2 kol-mono-12">
              <span className="truncate text-fg-80">{from}</span>
              <span className="text-fg-32">→</span>
              <span className="flex-1 truncate text-fg-80">{to}</span>
              <ActionButton chrome="inline" size="sm" icon="x" confirmIcon="x" label={`Remove ${from} to ${to}`} onAction={() => setCables((cs) => cs.filter((_, j) => j !== i))} />
            </div>
          ))}
        </div>
        <Divider />
        <RailSection label="Add a cable">
          <RailRow label="From" labelWidth="auto"><span className="kol-mono-12 text-fg-80">Clock · out</span></RailRow>
          <RailRow label="To" labelWidth="auto"><span className="kol-mono-12 text-fg-80">LFO · cv</span></RailRow>
          <RailActions><Button size="sm" onClick={() => setCables((cs) => [...cs, ['Clock · out', 'LFO · cv']])}>Add cable</Button></RailActions>
        </RailSection>
      </div>
    </Rail>
  )
}

export default function OpenQuestionsRound19() {
  usePageMeta({ tags: [], related: [] })
  const [open, setOpen] = useState(null)
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader
        eyebrow="Open questions · Round 19 · 2026-10-25"
        title="What a scrimless rail is made of"
        lede="Answered 2026-10-25: no edge on any rail — border off, the edge prop stays as the opt-in. The patch rail opens with no scrim so the rack behind it stays live (monitor's ask); the three ways it could say where it begins stay here for the record. The frame it lives on is apps/rails."
      />
      <DocSection id="candidates" title="The candidates" lede="Open each over this page.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {CANDIDATES.map((c) => (
            <div key={c.id} className="flex flex-col gap-2 rounded border border-fg-08 p-4" data-candidate={c.id}>
              <span className="kol-doc-eyebrow">{c.title}</span>
              <p className="kol-mono-12 text-meta">{c.lede}</p>
              <div><Button size="sm" onClick={() => setOpen(c.id)}>Open — {c.title}</Button></div>
              <PatchRail open={open === c.id} onClose={() => setOpen(null)} props={c.props} />
            </div>
          ))}
        </div>
      </DocSection>
    </div>
  )
}
