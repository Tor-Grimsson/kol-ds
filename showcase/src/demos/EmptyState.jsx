import { EmptyState } from '@kolkrabbi/kol-component'

export const stage = 'sm'

export default function EmptyStateDemo() {
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
