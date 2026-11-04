import { useState } from 'react'
import { WorkspaceSwitcher } from '@kolkrabbi/kol-component'

export const stage = 'md'

export const variants = ['float', 'default']

const WORKSPACES = [
  { value: 'personal', label: 'Personal / Kolkrabbi' },
  { value: 'studio', label: 'Studio' },
  { value: 'client', label: 'Studio / Olina' },
]

export default function WorkspaceSwitcherPreview({ variant = 'float' }) {
  const [ws, setWs] = useState('personal')
  return <WorkspaceSwitcher variant={variant === 'float' ? 'float' : undefined} workspaces={WORKSPACES} value={ws} onChange={setWs} />
}
