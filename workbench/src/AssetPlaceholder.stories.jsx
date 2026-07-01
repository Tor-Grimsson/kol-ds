import { AssetPlaceholder } from '@kolkrabbi/kol-component'

export const Default = () => (
  <div style={{ maxWidth: 360 }}>
    <AssetPlaceholder category="graphics" name="abstract-03" />
  </div>
)

export const Notes = () => (
  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
    <div style={{ width: 280 }}>
      <AssetPlaceholder category="mocks" name="business-card-bg" note="missing" />
    </div>
    <div style={{ width: 280 }}>
      <AssetPlaceholder category="icons" name="search" note="pending" aspectRatio="1 / 1" />
    </div>
  </div>
)

export const AspectRatios = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
    {['1 / 1', '4 / 3', '16 / 9'].map((ratio) => (
      <div key={ratio} style={{ width: 220 }}>
        <AssetPlaceholder category="patterns" name={ratio.replace(/\s/g, '')} aspectRatio={ratio} />
      </div>
    ))}
  </div>
)
