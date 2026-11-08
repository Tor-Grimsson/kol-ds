import { ModalHeader, Button } from '@kolkrabbi/kol-component'

export const stage = 'md'
export const variants = ['default', 'float']

const noop = () => {}

/* the one modal header, both looks: the menu row (avatar · title, the plain title with a close) over the window row
 * (default: QuickLookFrame's ‹ › n / N · name · facts · ×; float: glyph · title · − · ×) */
export default function ModalHeaderPreview({ variant = 'default' }) {
  if (variant === 'float') {
    return (
      <div className="flex w-full max-w-md flex-col gap-6">
        <div className="flex flex-col gap-3 rounded-[var(--kol-float-menu-r)] bg-surface-secondary p-4">
          <ModalHeader variant="float" avatar="TG" title="Tor Grimsson" />
          <ModalHeader variant="float" title="Workspace panels" />
        </div>
        <ModalHeader variant="float" icon="user" title="Account" onMinimise={noop} onClose={noop} />
        <ModalHeader variant="float" icon="alert-triangle" title="Delete layer" onClose={noop} />
      </div>
    )
  }
  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <div className="flex max-w-md flex-col gap-3 rounded-[var(--kol-float-menu-r)] bg-surface-secondary p-4">
        <ModalHeader avatar="TG" title="Tor Grimsson" onClick={noop} />
        <ModalHeader title="Workspace panels" actions={<Button variant="float" size="sm" tone="ghost" iconOnly="x" aria-label="Close" />} />
      </div>
      <ModalHeader title="asmr-sharp.mp4" meta="1080 × 1920 · 12.4 MB" nav={{ index: 0, total: 2, onPrev: noop, onNext: noop }} onClose={noop} />
    </div>
  )
}
