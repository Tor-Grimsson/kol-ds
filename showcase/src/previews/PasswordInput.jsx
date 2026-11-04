import { useState } from 'react'
import { PasswordInput, LabeledControl } from '@kolkrabbi/kol-component'

export const stage = 'md'

export const variants = ['float', 'filled']

/* masked by default; the eye reveals, the field keeps focus */
export default function PasswordInputPreview({ variant = 'float' }) {
  const [pw, setPw] = useState('correct horse')
  return (
    <LabeledControl variant={variant === 'float' ? 'float' : undefined} label="Password" className="w-80">
      <PasswordInput variant={variant} value={pw} onChange={(e) => setPw(e.target.value)} width="100%" />
    </LabeledControl>
  )
}
