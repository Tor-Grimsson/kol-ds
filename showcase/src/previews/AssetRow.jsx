import { useState } from 'react'
import { AssetRow } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

// Inline fixture — three assets, one selected; the thumbnails drawn in place of images.
const Thumb = ({ hue }) => <div className="w-full h-full" style={{ background: `linear-gradient(160deg, hsl(${hue} 30% 55%), hsl(${hue + 40} 25% 25%))` }} />

const assets = [
  { key: 'a', name: 'Luminous portrait', meta: '1200 × 1500 · PNG', hue: 28 },
  { key: 'b', name: 'Studio wall, north', meta: '4000 × 3000 · JPG', hue: 200 },
  { key: 'c', name: 'Wordmark, black', meta: '512 × 128 · SVG', hue: 0 },
]

export default function AssetRowPreview() {
  const [selected, setSelected] = useState('a')
  return (
    <div className="flex flex-col gap-3 w-full max-w-[320px]">
      {assets.map((a) => <AssetRow key={a.key} thumb={<Thumb hue={a.hue} />} name={a.name} meta={a.meta} selected={selected === a.key} onSelect={() => setSelected(a.key)} />)}
    </div>
  )
}
