/**
 * ProgressBar — How far along something is. A thin track and its fill, and a caption under it (record's project card:
 * `3/7 done` — DocumentLibraryAndBoardParts, kol-website 2026-10-29). The fill takes the status tones the chips wear, or
 * the ink when none is given.
 *
 * @param {number}  value
 * @param {number}  max          default 100
 * @param {boolean|ReactNode|Function} caption   `true` → `value/max`; a node; or `(value, max) => node`; omit for none
 * @param {'success'|'warning'|'error'|'info'} tone   the fill's colour (default the ink)
 * @param {'float'} variant      the float track (float-everything W2 row 31, 2026-11-04): 4px, a capsule, oq-16 under
 *                               the emphasis ink; the caption in the float label role
 * @param {string}  ariaLabel
 */
const TONE = { success: 'var(--ui-success)', warning: 'var(--ui-warning)', error: 'var(--ui-error)', info: 'var(--ui-info)' }

export default function ProgressBar({ value = 0, max = 100, caption, tone, variant, ariaLabel, className = '' }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0
  const text = caption === true ? `${value}/${max}` : typeof caption === 'function' ? caption(value, max) : caption
  const float = variant === 'float'
  return (
    <div className={`flex flex-col gap-1 ${className}`.trim()}>
      <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={ariaLabel} className={`h-1 overflow-hidden ${float ? 'rounded-full bg-oq-16' : 'rounded bg-fg-08'}`}>
        <div className={`h-full transition-[width] duration-300 ${float ? 'rounded-full' : ''}`} style={{ width: `${pct}%`, background: TONE[tone] ?? (float ? 'var(--kol-fg-emphasis)' : 'var(--kol-fg-64)') }} />
      </div>
      {text != null && text !== false && <span className={float ? 'kol-float-label text-fg-64' : 'kol-mono-10 text-meta'}>{text}</span>}
    </div>
  )
}
