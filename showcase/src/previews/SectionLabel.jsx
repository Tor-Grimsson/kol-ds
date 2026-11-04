import { SectionLabel } from '@kolkrabbi/kol-component'

export const stage = 'sm'

export const sizes = ['md', 'sm', 'lg']
export const variants = ['default', 'float']

export default function SectionLabelPreview({ size = 'md', variant = 'default' }) {
  /* float (W5 row 68): a rail section's header with its + */
  if (variant === 'float') return <div className="w-[240px]"><SectionLabel variant="float" text="APPEARANCE" onAdd={() => {}} addLabel="Add appearance" /></div>
  return (
    /* one line (2026-10-01): three identical labels said nothing the first did not — size rides the toolbar */
    <SectionLabel text="COLLECTIONS" size={size} />
  )
}
