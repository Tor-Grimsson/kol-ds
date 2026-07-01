import { Graphic } from '@kolkrabbi/kol-component'

const Tile = ({ category, name }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 160 }}>
    <Graphic category={category} name={name} />
    <span className="kol-mono-12">{name}</span>
  </div>
)

export const Abstract = () => (
  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
    {['abstract-01', 'abstract-02', 'abstract-03', 'abstract-06'].map((name) => (
      <Tile key={name} category="abstract" name={name} />
    ))}
  </div>
)

export const Patterns = () => (
  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
    {['patt-01', 'patt-02', 'patt-03', 'patt-04'].map((name) => (
      <Tile key={name} category="patterns" name={name} />
    ))}
  </div>
)

// Unknown name → AssetPlaceholder with note="pending".
export const Missing = () => (
  <div style={{ maxWidth: 200 }}>
    <Graphic category="abstract" name="abstract-99" />
  </div>
)
