import { useState } from 'react'
import { ColorSwatch } from '@kolkrabbi/kol-component'

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>{children}</div>
)

export const Sizes = () => (
  <Row>
    {[16, 20, 24, 32].map((s) => (
      <ColorSwatch key={s} hex="#FF6F00" size={s} />
    ))}
  </Row>
)

export const Radius = () => (
  <Row>
    {['none', 'tight', 'sm', 'full'].map((r) => (
      <ColorSwatch key={r} hex="#3b5bdb" size={32} radius={r} />
    ))}
  </Row>
)

export const Transparent = () => (
  <Row>
    {['warning', 'error', 'info', 'success'].map((t) => (
      <ColorSwatch key={t} size={32} showTransparent transparentTone={t} />
    ))}
  </Row>
)

export const Interactive = () => {
  const palette = ['#FF6F00', '#3b5bdb', '#121215', '#2f9e44']
  const [selected, setSelected] = useState('#3b5bdb')
  return (
    <Row>
      {palette.map((hex) => (
        <ColorSwatch
          key={hex}
          hex={hex}
          size={32}
          selected={selected === hex}
          onClick={() => setSelected(hex)}
        />
      ))}
    </Row>
  )
}
