import { Divider } from '@kolkrabbi/kol-component'

export const Horizontal = () => (
  <div style={{ width: 320 }}>
    <Divider />
  </div>
)

export const Vertical = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', height: 32 }}>
    <span className="kol-mono-12">Left</span>
    <Divider variant="vertical" />
    <span className="kol-mono-12">Right</span>
  </div>
)

export const Opacities = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
    {['08', '16', '32', '64'].map((o) => (
      <div key={o} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span className="kol-mono-12">opacity {o}</span>
        <Divider opacity={o} />
      </div>
    ))}
  </div>
)
