import { useState } from 'react'
import { OriginPicker, Input } from '@kolkrabbi/kol-component'

export const stage = 'hug'
export const sizes = ['sm', 'xs', 'md']

/* The picker sits beside the X / Y fields it anchors — fxr's layer inspector Position row — so the
 * preview shows it next to an Input of the same size: the square is the field's height. */
export default function OriginPickerPreview({ size = 'sm' }) {
  const [v, setV] = useState([0.5, 0.5])
  return (
    <div className="flex items-center gap-2">
      <OriginPicker size={size} value={v} onChange={setV} ariaLabel="Transform origin" />
      <Input size={size} prefix="X" value={String(v[0])} readOnly chars={4} />
      <Input size={size} prefix="Y" value={String(v[1])} readOnly chars={4} />
    </div>
  )
}
