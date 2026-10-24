import { CloseButton } from '@kolkrabbi/kol-component'

export const stage = 'hug'

/**
 * CloseButton — the one X that dismisses a thing. `variant="nav"` (bare glyph,
 * no box) at the row's rung. Every close in the system renders this, so there is
 * one to change rather than five to keep in step.
 *
 * `hover={false}` keeps the box and drops the wash; `frame={false}` is the glyph alone.
 */
export const sizes = ['sm', 'xs', 'md', 'lg']
/* the two bases ride the toolbar (2026-10-01) — they were stacked with lowercase dev notes beside
 * each (`states (Button)` · `no states (IconFrame)`) */
export const states = ['default', 'no hover', 'no frame']

export default function Preview({ size = 'sm', state = 'default' }) {
  return <CloseButton size={size} hover={state !== 'no hover'} frame={state !== 'no frame'} onClick={() => {}} />
}
