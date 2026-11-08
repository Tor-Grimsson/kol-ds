import { Button, ModalShell } from '@kolkrabbi/kol-component'

export const stage = 'md'

export const variants = ['lift', 'bordered', 'float']

/* the panel alone, in place — the scrim, portal and keys are the caller's (Modal, Dialog, FullscreenOverlay) */
export default function ModalShellPreview({ variant = 'lift' }) {
  const float = variant === 'float'
  return (
    <ModalShell variant={variant} className={float ? 'gap-[18px] p-6' : 'gap-4 p-5'} style={{ width: 360 }}
      header={<p className={float ? 'kol-float-section text-fg-emphasis' : 'kol-eyebrow text-fg-80'}>Header</p>}
      footer={(
        <div className="flex justify-end gap-2">
          <Button size="sm" variant={float ? 'float' : undefined} tone="ghost">Cancel</Button>
          <Button size="sm" variant={float ? 'float' : undefined} tone="inverted">OK</Button>
        </div>
      )}>
      <p className="kol-mono-12 text-fg-64">The body. Any overlay draws its parts on this one panel.</p>
    </ModalShell>
  )
}
