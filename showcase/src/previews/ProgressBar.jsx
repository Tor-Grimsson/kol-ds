import { ProgressBar } from '@kolkrabbi/kol-component'

export const stage = 'sm'
/* `float` (float-everything W2 row 31): the 4px capsule track */
export const variants = ['default', 'float']

/* how far along: the ink by default, a tone when it means something; the caption `value/max` or the caller's words */
export default function ProgressBarPreview({ variant = 'default' }) {
  if (variant === 'float') {
    return (
      <div className="flex w-64 flex-col gap-4">
        <ProgressBar variant="float" value={42} caption="Reading · 42%" />
        <ProgressBar variant="float" value={3} max={7} caption />
      </div>
    )
  }
  return (
    <div className="flex w-64 flex-col gap-4">
      <ProgressBar value={3} max={7} caption={(v, m) => `${v}/${m} done`} />
      <ProgressBar value={7} max={7} tone="success" caption />
      <ProgressBar value={40} />
    </div>
  )
}
