import { ColorField } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* a color as a row — the swatch, its name, the hex; with `onClick` the row opens a picker */
export default function ColorFieldPreview() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <ColorField label="Background" value="#0b0b0b" onClick={() => {}} />
      <ColorField label="Accent" value="#3740d3" />
    </div>
  )
}
