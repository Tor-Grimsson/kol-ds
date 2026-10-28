/* VOYAGER's stationery — every layout on kol-branding's /guide/stationery canvas page as plain HTML boards (moved here from
 * apps/stationery/src/boards, 2026-10-28, so apps/stationery's desk and apps/print's PrintStudio read one set). The boards
 * name the marks by token (`__LOCKUP__` · `__LOGOMARK__` · `__WORDMARK__`); the fixture's mark files are Vite URLs known
 * only at runtime, so `stationeryBoard(name)` hands the board back with them filled in. A4 boards are 1190 × 1684. */
import { MARKS } from './assets.js'

const FILES = import.meta.glob('./stationery/*.html', { query: '?raw', import: 'default', eager: true })
const mark = (id) => MARKS.find((m) => m.id === id)?.url ?? ''
const TOKENS = () => ({ __LOCKUP__: mark('lockup-horizontal-01'), __LOGOMARK__: mark('logomark-01'), __WORDMARK__: mark('wordmark') })

export const STATIONERY_NAMES = Object.keys(FILES).map((p) => p.replace('./stationery/', '').replace('.html', '')).sort()

export function stationeryBoard(name) {
  const raw = FILES[`./stationery/${name}.html`] ?? ''
  return Object.entries(TOKENS()).reduce((s, [k, v]) => s.replaceAll(k, v), raw)
}
