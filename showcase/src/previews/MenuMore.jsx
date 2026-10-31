import { useState } from 'react'
import { MenuMore } from '@kolkrabbi/kol-component'

export function Card() {
  return <MenuMore label="Graph settings" items={[]} />
}

export default function MenuMorePreview() {
  const [unit, setUnit] = useState('day')
  return (
    <div className="flex min-h-[220px] w-full items-start justify-center">
      <MenuMore label="Graph settings" align="start" defaultOpen stayOpen items={[
        { heading: 'Graph interval' },
        ...[['hour', 'Hours'], ['day', 'Days'], ['week', 'Weeks']].map(([key, label]) => ({ key, label, current: key === unit, checked: key === unit, onClick: () => setUnit(key) })),
        { divider: true },
        { key: 'export', label: 'Export stats', trailing: 'download', onClick: () => {} },
      ]} />
    </div>
  )
}
