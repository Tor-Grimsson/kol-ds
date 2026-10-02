import { SectionLabel } from '@kolkrabbi/kol-component'

export const stage = 'sm'

export const sizes = ['md', 'sm', 'lg']

export default function SectionLabelPreview({ size = 'md' }) {
  return (
    /* one line (2026-10-01): three identical labels said nothing the first did not — size rides the toolbar */
    <SectionLabel text="COLLECTIONS" size={size} />
  )
}
