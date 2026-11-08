/**
 * ProgressBar — How far along something is. A thin track and its fill, and a caption under it (record's project card:
 * `3/7 done` — DocumentLibraryAndBoardParts, kol-website 2026-10-29). The fill takes the status tones the chips wear, or
 * the ink when none is given.
 *
 * @param {number}  value
 * @param {number}  max          default 100
 * @param {boolean|ReactNode|Function} caption   `true` → `value/max`; a node; or `(value, max) => node`; omit for none
 * @param {'success'|'warning'|'error'|'info'} tone   the fill's colour (default the ink)
 * @param {'float'} variant      the float track (float-everything W2 row 31, 2026-11-04): the float slider's 3px capsule,
 *                               oq-16 under fg-64; the caption in the float label role
 *
 * The track is the Slider's (2026-11-07): `.kol-track` / `.kol-track-run` in kol-theme read the same tokens the range
 * inputs do, so a ProgressBar and a Slider at the same variant draw one track. A tone sets `--kol-track-run`.
 * @param {string}  ariaLabel
 */
const TONE = { success: 'var(--ui-success)', warning: 'var(--ui-warning)', error: 'var(--ui-error)', info: 'var(--ui-info)' }

export default function ProgressBar({ value = 0, max = 100, caption, tone, variant, ariaLabel, className = '' }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0
  const text = caption === true ? `${value}/${max}` : typeof caption === 'function' ? caption(value, max) : caption
  const float = variant === 'float'
  return (
    <div className={`flex flex-col gap-1 ${className}`.trim()}>
      <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={ariaLabel} className={`kol-track ${float ? 'kol-track--float' : ''}`.trim()}>
        <div className="kol-track-run transition-[width] duration-300" style={{ width: `${pct}%`, ...(TONE[tone] && { '--kol-track-run': TONE[tone] }) }} />
      </div>
      {text != null && text !== false && <span className={float ? 'kol-float-label text-fg-64' : 'kol-mono-10 text-meta'}>{text}</span>}
    </div>
  )
}
