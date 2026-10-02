import { CloseButton } from '@kolkrabbi/kol-component'

export const stage = 'hug'

/**
 * CloseButton — the one X that dismisses a thing. `variant="nav"` (bare glyph,
 * no box) at the row's rung. Every close in the system renders this, so there is
 * one to change rather than five to keep in step.
 *
 * `states={false}` swaps the Button base for IconFrame — same drawing, no hover,
 * no press, no focus wash — for a close that should not light up.
 */
export const sizes = ['sm', 'xs', 'md', 'lg']
/* the two bases ride the toolbar (2026-10-01) — they were stacked with lowercase dev notes beside
 * each (`states (Button)` · `no states (IconFrame)`) */
export const states = ['states', 'no states']

export default function Preview({ size = 'sm', state = 'states' }) {
  return <CloseButton size={size} states={state !== 'no states'} onClick={() => {}} />
}
