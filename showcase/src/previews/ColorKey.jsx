import { ColorKey } from '@kolkrabbi/kol-dashboards'

export const stage = 'sm'

// Inline fixture — a store's file types.
export default function ColorKeyPreview() {
  return (
    <div className="flex gap-4 kol-helper-12 text-fg-64">
      <ColorKey color="var(--kol-palette-blue)" label="video" value="4.2 GB" />
      <ColorKey color="var(--kol-palette-green)" label="images" value="1.1 GB" />
      <ColorKey color="var(--kol-palette-orange)" label="fonts" />
    </div>
  )
}
