import { useState } from 'react'
import { Dropdown } from '@kolkrabbi/kol-component'

const OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'az', label: 'A → Z' },
  { value: 'za', label: 'Z → A' },
]

export default function DropdownDemo() {
  const [value, setValue] = useState('newest')
  return (
    <div className="flex flex-wrap items-start gap-6">
      {['default', 'minimal', 'subtle'].map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="kol-helper-10 text-meta uppercase">{variant}</span>
          <Dropdown
            value={value}
            onChange={setValue}
            variant={variant}
            options={OPTIONS}
            defaultOpen={variant === 'default'}
          />
        </div>
      ))}
    </div>
  )
}
