import { EmptyState } from '@kolkrabbi/kol-component'

export const stage = 'sm'

export const variants = ['default', 'float']

export default function EmptyStatePreview({ variant = 'default' }) {
  /* float (W6 row 92): the empty inspector — the panel stays open, nothing irrelevant shows */
  if (variant === 'float') {
    return (
      <div className="flex h-[388px] w-[308px] flex-col gap-4 rounded-[var(--kol-float-menu-r)] bg-surface-secondary p-4">
        <span className="kol-float-body text-fg-emphasis">Inspector</span>
        <div className="flex-1 flex flex-col px-2 pt-10">
          <EmptyState variant="float" title="Nothing selected" body={'Select a task to see its fields.\nNo irrelevant controls or empty values.'} footer="Panel stays open." />
        </div>
      </div>
    )
  }
  return (
    <div className="flex w-full flex-col gap-8">
      <EmptyState
        eyebrow="Phase 2"
        title="Layer inspector"
        body="Select a layer on the canvas to edit its properties."
        footer="Blend modes and effects arrive with the compose milestone."
      />
      <EmptyState eyebrow="Empty" title="No results" />
    </div>
  )
}
