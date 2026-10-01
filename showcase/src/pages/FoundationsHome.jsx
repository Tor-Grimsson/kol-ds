import ChapterHome from '../lib/ChapterHome.jsx'
import { DOCS_SPECIMENS } from '../nav/shell-nav.js'

/** Foundations — the Styles chapter's own page (W3, 2026-09-30); it used to BE the Tokens page. */
export default function FoundationsHome() {
  return <ChapterHome home="foundations" noteHeader="Reads" items={DOCS_SPECIMENS.map((s) => ({ to: s.path, label: s.label, note: s.source }))} />
}
