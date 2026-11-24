import { Button, ModalShell } from '@kolkrabbi/kol-component'

export const stage = 'md'

export const variants = ['lift', 'bordered', 'float', 'kolbox', 'folio']

/* the panel alone, in place — the scrim, portal and keys are the caller's (Modal, Dialog, FullscreenOverlay) */
export default function ModalShellPreview({ variant = 'lift' }) {
  /* kolbox (W31.2 batch 4): kolbox's panel, its own header (title, close) and a footer of buttons */
  if (variant === 'kolbox') return <ModalShell variant="kolbox" title="Popover" onClose={() => {}} footer={<><Button variant="kolbox" tone="ghost">Cancel</Button><Button variant="kolbox" tone="primary">Apply</Button></>}><p className="kol-kolbox-help px-4 pb-4 text-oq-64">The body is the children.</p></ModalShell>
  /* folio (Folio batch B): Folio's paper behind its rule; the shadow and the parts are the caller's */
  if (variant === 'folio') return <div data-folio-theme="light" className="flex min-h-[380px] w-full items-start justify-center bg-(--kol-folio-paper) p-6 font-(family-name:--kol-font-family-float) leading-[1.21] text-(--kol-folio-ink)"><ModalShell variant="folio" className="gap-[4px] p-[20px]" style={{ width: 360 }}><p className="kol-folio-label text-(--kol-folio-muted)">Header</p><p className="kol-folio-body">The body. Any Folio overlay draws its parts on this one panel.</p></ModalShell></div>
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
