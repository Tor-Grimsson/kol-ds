import { Icon } from '@kolkrabbi/kol-component'

const sample = ['check', 'search', 'settings-01', 'arrow-right', 'heart-1', 'trash', 'download', 'star']

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    {[14, 16, 24, 32, 48].map((s) => <Icon key={s} name="settings-01" size={s} />)}
  </div>
)

export const StrokeVsSolid = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
      <span className="kol-mono-12" style={{ width: 56 }}>stroke</span>
      {sample.map((n) => <Icon key={n} name={n} variant="stroke" size={24} />)}
    </div>
    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
      <span className="kol-mono-12" style={{ width: 56 }}>solid</span>
      {sample.map((n) => <Icon key={n} name={n} variant="solid" size={24} />)}
    </div>
  </div>
)

export const Sampler = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 20 }}>
    {sample.map((n) => (
      <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Icon name={n} size={24} />
        <span className="kol-mono-12">{n}</span>
      </div>
    ))}
  </div>
)
