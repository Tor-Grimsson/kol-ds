import { AssetGrid, AssetPlaceholder } from '@kolkrabbi/kol-component'

export const stage = 'lg'

const tiles = (n, prefix) =>
  Array.from({ length: n }, (_, i) => (
    <AssetPlaceholder key={i} category="asset" name={`${prefix}-${String(i + 1).padStart(2, '0')}`} aspectRatio="1 / 1" note="tile" />
  ))

export default function AssetGridDemo() {
  return (
    <div className="flex w-full flex-col gap-8">
      {/* Default — 3 columns, gap-4 */}
      <AssetGrid>{tiles(6, 'photo')}</AssetGrid>

      {/* 4 columns, tighter gap */}
      <AssetGrid cols={4} gap="gap-2">{tiles(4, 'icon')}</AssetGrid>
    </div>
  )
}
