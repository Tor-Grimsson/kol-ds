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

export default function Demo({ size = 'sm' }) {
  return (
    <div className="flex flex-col gap-6">
      {[true, false].map((states) => (
        <div key={String(states)} className="flex items-center gap-6">
          <span className="kol-helper-10 text-meta w-28">
            {states ? 'states (Button)' : 'no states (IconFrame)'}
          </span>
          <CloseButton size={size} states={states} onClick={() => {}} />
        </div>
      ))}
    </div>
  )
}
