import { ModalHeader, Button } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* the top row of a float sheet — avatar · title, and the plain title with a close */
export default function ModalHeaderPreview() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3 rounded-[var(--kol-float-menu-r)] bg-surface-secondary p-4">
      <ModalHeader variant="float" avatar="TG" title="Tor Grimsson" />
      <ModalHeader title="Workspace panels" actions={<Button variant="float" size="sm" tone="ghost" iconOnly="x" aria-label="Close" />} />
    </div>
  )
}
