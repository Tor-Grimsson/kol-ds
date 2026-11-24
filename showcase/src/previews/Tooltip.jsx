import { Tooltip, Button } from '@kolkrabbi/kol-component'

export const variants = ['default', 'kolbox', 'folio']

/* kolbox (W31.2 batch 4): the CSS-placed tip on the floating surface */
export default function TooltipPreview({ variant = 'default' }) {
  /* folio (Folio batch A, 2026-11-22): the CSS-placed hairline tip on Folio's paper */
  if (variant === 'folio') return <div data-folio-theme="light" className="rounded bg-[var(--kol-folio-paper)] px-4 pb-4 pt-12 text-[var(--kol-folio-ink)]"><Tooltip variant="folio" label="Export video"><Button variant="folio" iconOnly="download" aria-label="Export" /></Tooltip></div>
  if (variant === 'kolbox') return <Tooltip variant="kolbox" label="Add page"><Button variant="kolbox" iconOnly="plus" aria-label="Add page" /></Tooltip>
  return (
    <>
      <Tooltip label="Add item" shortcut="N" placement="bottom">
        <Button tone="outline" iconOnly="plus" />
      </Tooltip>
      <Tooltip label="Settings" placement="top">
        <Button tone="ghost" iconOnly="settings-01" />
      </Tooltip>
    </>
  )
}
