import { ProgressBar } from '@kolkrabbi/kol-component'

export const stage = 'sm'

/* how far along: the ink by default, a tone when it means something; the caption `value/max` or the caller's words */
export default function ProgressBarPreview() {
  return (
    <div className="flex w-64 flex-col gap-4">
      <ProgressBar value={3} max={7} caption={(v, m) => `${v}/${m} done`} />
      <ProgressBar value={7} max={7} tone="success" caption />
      <ProgressBar value={40} />
    </div>
  )
}
