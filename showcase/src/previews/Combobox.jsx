import { useState } from 'react'
import { Combobox } from '@kolkrabbi/kol-component'

export const stage = 'md'

const options = ['/', '/blog', '/work', '/stack', '/about', '/contact'].map((p) => ({ value: p, label: p }))

export default function ComboboxPreview() {
  const [v, setV] = useState('')
  return (
    <div className="w-full max-w-xs">
      <Combobox value={v} onChange={setV} options={options} placeholder="Select a value" ariaLabel="Page" />
    </div>
  )
}
