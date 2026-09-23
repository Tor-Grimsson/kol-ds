import { QuickLookFrame, ActionButton, FileIcon } from '@kolkrabbi/kol-component'

export const stage = 'full'

export default function QuickLookFrameDemo() {
  return (
    <QuickLookFrame title="notes.txt" meta="0 B" onClose={() => {}}
      actions={<ActionButton chrome="inline" size="sm" icon="download" label="Download" href="#" />}>
      <FileIcon ext="txt" className="w-[160px] m-16" />
    </QuickLookFrame>
  )
}
