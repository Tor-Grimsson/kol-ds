/** ProjectCard — a project's card: a mono eyebrow and a status pill, the name, a line about it, its completion as a
 * progress line, and one action (float-everything W7 row 105, 2026-11-04; the exploration's "REPO · Active ·
 * kol-studio · Completion 50% · Details →").
 *
 * `eyebrow` ("REPO") in mono, `status` ("Active") a well pill at the right, `title` in Inter section, `description`
 * body, `progress` = `{ label, pct, note }` (the 6px line), `action` the label of the float button `onAction` fires. */
import { Button } from '@kolkrabbi/kol-component'
import { SHEET, WELL } from './_shared/float.js'
import ProgressLine from './_shared/ProgressLine.jsx'

export default function ProjectCard({ eyebrow, status, title, description, progress, action, onAction, className = '' }) {
  return (
    <section className={`${SHEET} flex flex-col p-7 ${className}`.trim()}>
      <header className="flex items-center justify-between gap-4">
        <span className="kol-float-timecode text-fg-64 uppercase">{eyebrow}</span>
        {status && <span className="kol-float-hint text-fg-96 h-7 px-5 inline-flex items-center rounded-full" style={WELL}>{status}</span>}
      </header>
      <h3 className="kol-float-section text-fg-96 mt-9">{title}</h3>
      {description && <p className="kol-float-body text-fg-64 mt-3 max-w-[60ch]">{description}</p>}
      {progress && <div className="mt-16"><ProgressLine label={progress.label} pct={progress.pct} note={progress.note} thick /></div>}
      {action && <div className="flex justify-end mt-8"><Button variant="float" tone="grey" onClick={onAction} iconRight="arrow-right">{action}</Button></div>}
    </section>
  )
}
