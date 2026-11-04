import { useState } from 'react'
import { FieldPair } from '@kolkrabbi/kol-component'

export const stage = 'md'

export const variants = ['float', 'filled']

/* two values read together — a position, a size */
export default function FieldPairPreview({ variant = 'float' }) {
  const [x, setX] = useState('1471')
  const [y, setY] = useState('516')
  return (
    <div className="w-60">
      <FieldPair variant={variant} fields={[
        { prefix: 'X', value: x, onChange: (e) => setX(e.target.value), inputMode: 'numeric' },
        { prefix: 'Y', value: y, onChange: (e) => setY(e.target.value), inputMode: 'numeric' },
      ]} />
    </div>
  )
}
