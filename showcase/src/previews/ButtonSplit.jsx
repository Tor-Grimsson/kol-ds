import { ButtonSplit } from '@kolkrabbi/kol-component'

export const stage = 'md'

export const variants = ['default', 'float', 'kolbox', 'folio']

const noop = () => {}
const items = [{ label: 'Export PNG', onPress: noop }, { label: 'Export loop (webm)', onPress: noop }, { label: 'Record', onPress: noop }, { label: 'Batch export', onPress: noop }]

/* the main action, the divider and the ⌄ menu — primary and the grey well */
export default function ButtonSplitPreview({ variant = 'default' }) {
  /* folio (Folio batch B): primary and the paper, the ⌄ opens the list on Menu folio */
  if (variant === 'folio') return <div data-folio-theme="light" className="flex min-h-[380px] w-full items-start gap-3 justify-center bg-(--kol-folio-paper) p-6 font-(family-name:--kol-font-family-float) leading-[1.21] text-(--kol-folio-ink)"><ButtonSplit variant="folio" tone="primary" onClick={noop} items={items}>Export PNG</ButtonSplit><ButtonSplit variant="folio" onClick={noop} items={items}>Export PNG</ButtonSplit></div>
  return (
    <div className="flex gap-3">
      <ButtonSplit variant={variant} tone="primary" icon="download" onClick={noop} items={items}>Export PNG</ButtonSplit>
      <ButtonSplit variant={variant} tone={variant === 'kolbox' ? 'secondary' : 'grey'} icon="download" onClick={noop} items={items}>Export PNG</ButtonSplit>
    </div>
  )
}
