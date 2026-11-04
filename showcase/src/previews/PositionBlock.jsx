import { PositionBlock } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

export default function PositionBlockPreview() {
  return (
    <div className="w-full max-w-[920px]">
      <PositionBlock title="The third interlude" page="Page 125 of 297" pct={42} onClick={() => {}} />
    </div>
  )
}
