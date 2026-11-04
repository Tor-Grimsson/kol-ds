import { LiveCard } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

export default function LiveCardPreview() {
  return (
    <div className="w-[284px]">
      <LiveCard value="8" unit="active visitors" peak="18 Oct · Traffic peak" insight="910 visitors after the toolbox release." note="2.0× the daily average of 459 visitors." />
    </div>
  )
}
