import { EmptyState } from '@kolkrabbi/kol-component'

export const Default = () => (
  <EmptyState
    eyebrow="Phase 2"
    title="Layer inspector"
    body="Select a layer on the canvas to edit its properties."
    footer="Blend modes and effects arrive with the compose milestone."
  />
)

export const Minimal = () => <EmptyState eyebrow="Empty" title="No results" />
