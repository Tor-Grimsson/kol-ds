import { SummaryLine } from '@kolkrabbi/kol-component'

export const stage = 'sm'

/* the line under a form that says what the action will produce */
export default function SummaryLinePreview() {
  return (
    <div className="w-[392px] max-w-full">
      <SummaryLine label="Estimated size" value="18.4 MB" />
    </div>
  )
}
