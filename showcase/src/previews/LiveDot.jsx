import { LiveDot } from '@kolkrabbi/kol-component'

export const stage = 'hug'

/* the live count — the dot breathes; `live={false}` is the count alone */
export default function LiveDotPreview() {
  return (
    <div className="flex flex-col gap-4">
      <LiveDot count={8} label="active visitors" />
      <LiveDot count={0} label="active visitors" live={false} />
    </div>
  )
}
