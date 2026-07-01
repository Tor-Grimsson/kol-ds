import { useState } from 'react'
import { Dropdown } from '@kolkrabbi/kol-component'

export default function DropdownDemo() {
  const [value, setValue] = useState('newest')
  return (
    <Dropdown
      value={value}
      onChange={setValue}
      variant="default"
      options={[
        { value: 'newest', label: 'Newest first' },
        { value: 'oldest', label: 'Oldest first' },
        { value: 'az', label: 'A → Z' },
        { value: 'za', label: 'Z → A' },
      ]}
    />
  )
}
