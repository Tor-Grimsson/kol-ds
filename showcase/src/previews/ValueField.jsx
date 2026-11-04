import { ValueField } from '@kolkrabbi/kol-component'

export const stage = 'hug'

export const sizes = ['md', 'sm', 'lg']

/* a value the row shows and nobody types — a status with its glyph, a kind */
export default function ValueFieldPreview({ size = 'md' }) {
  return (
    <div className="flex items-center gap-3">
      <ValueField size={size} icon="circle">Open</ValueField>
      <ValueField size={size}>Briefs</ValueField>
    </div>
  )
}
