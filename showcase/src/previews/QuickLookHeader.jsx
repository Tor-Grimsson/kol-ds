import { QuickLookHeader } from '@kolkrabbi/kol-component'

export const stage = 'md'
export const variants = ['default', 'float']

/* a window's title row — the default is QuickLookFrame's; float is the float window's: glyph · title · − · × */
export default function QuickLookHeaderPreview({ variant = 'default' }) {
  if (variant === 'float') {
    return (
      <div className="flex w-[342px] max-w-full flex-col gap-6">
        <QuickLookHeader variant="float" icon="user" title="Account" onMinimise={() => {}} onClose={() => {}} />
        <QuickLookHeader variant="float" icon="alert-triangle" title="Delete layer" onClose={() => {}} />
      </div>
    )
  }
  return (
    <div className="w-full max-w-xl">
      <QuickLookHeader title="asmr-sharp.mp4" meta="1080 × 1920 · 12.4 MB" nav={{ index: 0, total: 2, onPrev: () => {}, onNext: () => {} }} onClose={() => {}} />
    </div>
  )
}
