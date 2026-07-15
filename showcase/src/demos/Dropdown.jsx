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
      {[['primary', 'PRIMARY'], ['grey', 'GREY'], ['outline', 'OUTLINE']].map(([variant, label]) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="kol-helper-10 text-meta">{label}</span>
          <Dropdown
            value={value}
            onChange={setValue}
            variant={variant}
            options={OPTIONS}
            defaultOpen={variant === 'primary'}
          />
        </div>
      ))}
    </div>
  )
}

/* Index card: one canonical instance, closed. */
export function Card() {
  const [value, setValue] = useState('newest')
  return <Dropdown value={value} onChange={setValue} options={OPTIONS} />
}
