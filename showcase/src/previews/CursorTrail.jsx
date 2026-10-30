import { CursorProvider, CursorTrail } from '@kolkrabbi/kol-framework'

export const stage = 'full'
/* the trail follows the pointer across its whole document */
export const frame = 360

/* the intro's trail: three followers on springs, each chasing the one before it — move the pointer */
export default function CursorTrailPreview() {
  return (
    <CursorProvider>
      <div className="h-full min-h-[320px] bg-[var(--kol-color-absolute-black)] flex items-center justify-center kol-mono-12 text-[var(--kol-color-absolute-white)]">Move the pointer</div>
      <CursorTrail />
    </CursorProvider>
  )
}
