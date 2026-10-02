import { RackCase, RackRow } from '@kolkrabbi/kol-hardware'

export const stage = 'full'

/* The two row heights, empty: the case ground and a rail of mounting holes top and bottom. */
export default function RackRowPreview() {
  return (
    <div className="overflow-x-auto">
      <RackCase hp={40}>
        <RackRow height="1u" />
        <RackRow height="3u" />
      </RackCase>
    </div>
  )
}
