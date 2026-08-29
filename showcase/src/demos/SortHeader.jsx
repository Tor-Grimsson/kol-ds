import { useState } from 'react'
import { SortHeader } from '@kolkrabbi/kol-component'

export default function SortHeaderDemo() {
  const [dir, setDir] = useState('asc')
  return (
    <div className="flex items-center gap-4">
      <SortHeader label="Name" active dir={dir} onClick={() => setDir((d) => (d === 'asc' ? 'desc' : 'asc'))} />
      <SortHeader label="Date" />
    </div>
  )
}
