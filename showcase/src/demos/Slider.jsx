import { useState } from 'react'
import { Slider } from '@kolkrabbi/kol-component'

export default function SliderDemo() {
  const [value, setValue] = useState(40)
  return (
    <Slider label="Opacity" min={0} max={100} step={1} value={value} onChange={setValue} variant="minimal" />
  )
}
