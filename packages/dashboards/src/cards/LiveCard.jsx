/** LiveCard — what is happening right now: a live dot and its label, the live count with its unit, then under a rule the
 * peak as a badge, one insight line and a note (float-everything W7 row 111, 2026-11-04; the exploration's "● RIGHT
 * NOW · 8 active visitors · 18 OCT · TRAFFIC PEAK · 910 visitors after the toolbox release.").
 *
 * `label` ("Right now") in mono ruler beside the dot — drawn here as a 6px `--ui-success` disc (LiveDot is W2's atom;
 * this is the minimal one until it lands), `value` in mono 32, `unit` in Inter body, `peak` the Badge's content,
 * `insight` in window, `note` in hint. */
import { Badge, Divider } from '@kolkrabbi/kol-component'
import { SHEET } from './_shared/float.js'

export default function LiveCard({ label = 'Right now', value, unit, peak, insight, note, className = '' }) {
  return (
    <section className={`${SHEET} flex flex-col items-start gap-4 p-4 ${className}`.trim()}>
      <span className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--ui-success)' }} aria-hidden="true" />
        <span className="kol-float-ruler text-fg-64 uppercase tracking-[0.06em]">{label}</span>
      </span>
      <span className="flex items-baseline gap-3 whitespace-nowrap">
        <span className="font-[family-name:var(--kol-font-family-mono)] text-[32px] font-medium leading-[1.1] text-fg-96 tabular-nums">{value}</span>
        {unit && <span className="kol-float-body text-fg-72">{unit}</span>}
      </span>
      <Divider className="w-full" />
      {peak && <Badge variant="secondary" size="sm">{peak}</Badge>}
      {insight && <p className="kol-float-window text-fg-96">{insight}</p>}
      {note && <p className="kol-float-hint text-fg-64">{note}</p>}
    </section>
  )
}
