import { useState } from 'react'
import { ViewToggle } from '@kolkrabbi/kol-component'

export const Text = () => {
  const [v, setV] = useState('grid')
  return (
    <ViewToggle
      viewMode={v}
      onViewChange={setV}
      options={[
        { value: 'grid', label: 'Grid' },
        { value: 'list', label: 'List' },
      ]}
    />
  )
}

export const IconVariant = () => {
  const [v, setV] = useState('grid')
  return <ViewToggle variant="icon" className="w-fit" viewMode={v} onViewChange={setV} />
}

export const Single = () => {
  const [v, setV] = useState('off')
  return (
    <ViewToggle
      variant="single"
      viewMode={v}
      onViewChange={setV}
      options={[
        { value: 'off', label: 'Off' },
        { value: 'on', label: 'On' },
      ]}
    />
  )
}
