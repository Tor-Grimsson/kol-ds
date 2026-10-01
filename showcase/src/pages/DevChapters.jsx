import ChapterHome from '../lib/ChapterHome.jsx'
import { DEV_TOOLS, DEV_RECORDS } from '../nav/shell-nav.js'

/** Development › Tools and Records — each category's own page (W3, 2026-09-30: the eyebrows linked nowhere). */
export function DevTools() {
  return <ChapterHome home="tools" items={DEV_TOOLS.map((t) => ({ to: t.path, label: t.label, note: t.description }))} />
}

export function DevRecords() {
  return <ChapterHome home="records" items={DEV_RECORDS.map((t) => ({ to: t.path, label: t.label, note: t.description }))} />
}
