import { AssetGrid, AssetPlaceholder } from '@kolkrabbi/kol-component'

const tiles = (n, prefix) =>
  Array.from({ length: n }, (_, i) => (
    <AssetPlaceholder key={i} category="asset" name={`${prefix}-${String(i + 1).padStart(2, '0')}`} aspectRatio="1 / 1" note="tile" />
  ))

export const Default = () => (
  <AssetGrid>{tiles(6, 'photo')}</AssetGrid>
)

export const TwoColumns = () => (
  <AssetGrid cols={2}>{tiles(4, 'mock')}</AssetGrid>
)

export const FourColumnsTightGap = () => (
  <AssetGrid cols={4} gap="gap-2">{tiles(8, 'icon')}</AssetGrid>
)
