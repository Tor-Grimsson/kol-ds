import { Delta } from '@kolkrabbi/kol-component'

export const stage = 'hug'

/* a change against the previous value — up, down, and with no arrow */
export default function DeltaPreview() {
  return (
    <div className="flex flex-col gap-3">
      <Delta value="19.8%" from="10,740" />
      <Delta value="4.2%" direction="down" from="2,118" />
      <Delta value="0" direction="flat" from="312" fromLabel="was" />
    </div>
  )
}
