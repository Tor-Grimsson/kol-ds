import { useState } from 'react'
import { FieldPair, Input } from '@kolkrabbi/kol-component'

export const stage = 'md'

export const variants = ['float', 'filled', 'kolbox', 'folio']

/* two values read together — a position, a size */
export default function FieldPairPreview({ variant = 'float' }) {
  const [x, setX] = useState('1471')
  const [y, setY] = useState('516')
  /* kolbox (W31.2): two slots in equal cells 8 apart, a trailing node after */
  if (variant === 'kolbox') {
    return (
      <div className="w-52">
        <FieldPair variant="kolbox"
          first={<Input prefix="X" value={x} onChange={(e) => setX(e.target.value)} width="100%" />}
          second={<Input prefix="Y" value={y} onChange={(e) => setY(e.target.value)} width="100%" />} />
      </div>
    )
  }
  /* folio (Folio batch C): Folio's SettingPair */
  if (variant === 'folio') {
    return (
      <div className="w-64">
        <FieldPair variant="folio" fields={[
          { prefix: 'X', value: x, onChange: (e) => setX(e.target.value), 'aria-label': 'X' },
          { prefix: 'Y', value: y, onChange: (e) => setY(e.target.value), 'aria-label': 'Y' },
        ]} />
      </div>
    )
  }
  return (
    <div className="w-60">
      <FieldPair variant={variant} fields={[
        { prefix: 'X', value: x, onChange: (e) => setX(e.target.value), inputMode: 'numeric' },
        { prefix: 'Y', value: y, onChange: (e) => setY(e.target.value), inputMode: 'numeric' },
      ]} />
    </div>
  )
}
