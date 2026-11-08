import { useState } from 'react'
import { LabeledControl, WorkspaceSwitcher } from '@kolkrabbi/kol-component'

export const stage = 'md'

export const variants = ['float', 'default']

const WORKSPACES = [
  { value: 'personal', label: 'Personal / Kolkrabbi' },
  { value: 'studio', label: 'Studio' },
  { value: 'client', label: 'Studio / Olina' },
]

export default function WorkspaceSwitcherPreview({ variant = 'float' }) {
  const [ws, setWs] = useState('personal')
  return (
    <LabeledControl label="Workspace" variant={variant === 'float' ? 'float' : undefined} className="w-max">
      <WorkspaceSwitcher variant={variant === 'float' ? 'float' : undefined} workspaces={WORKSPACES} value={ws} onChange={setWs} />
    </LabeledControl>
  )
}
