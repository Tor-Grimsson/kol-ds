/** SourceCard — a connected source and its state: a mono code, the name, a status pill, then the message, its detail
 * and one action (float-everything W7 row 102, 2026-11-04; the exploration's "#KOL-OB · Obsidian · Needs attention ·
 * Retry").
 *
 * `code` in mono ruler, `title` in Inter window, `status` a well pill, `message` body, `detail` hint, `action` the
 * label of the float button `onAction` fires. Nothing is required but the title — a healthy source shows code,
 * title and status. */
import { Button } from '@kolkrabbi/kol-component'
import { SHEET, WELL } from './_shared/float.js'

export default function SourceCard({ code, title, status, message, detail, action, onAction, className = '' }) {
  return (
    <section className={`${SHEET} flex flex-col items-start p-6 ${className}`.trim()}>
      {code && <span className="kol-float-ruler text-fg-64 uppercase">{code}</span>}
      <h3 className="kol-float-window text-fg-96 mt-1">{title}</h3>
      {status && <span className="kol-float-label text-fg-64 h-7 px-3 inline-flex items-center rounded-full mt-4" style={WELL}>{status}</span>}
      {message && <p className="kol-float-body text-fg-96 mt-5">{message}</p>}
      {detail && <p className="kol-float-hint text-fg-64 mt-2 max-w-[34ch]">{detail}</p>}
      {action && <Button variant="float" tone="sunken" size="sm" className="mt-4" onClick={onAction}>{action}</Button>}
    </section>
  )
}
