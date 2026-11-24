import { useState } from 'react'
import { OriginPicker, Input } from '@kolkrabbi/kol-component'

export const stage = 'hug'
export const sizes = ['sm', '2xs', 'xs', 'md']

/* The picker sits beside the X / Y fields it anchors — fxr's layer inspector Position row — so the
 * preview shows it next to an Input of the same size: the square is the field's height. */
export default function OriginPickerPreview({ size = 'sm' }) {
  const [v, setV] = useState([0.5, 0.5])
  /* 2xs is the 16 icon slot in a rail row: the fields stay at xs beside it */
  const field = size === '2xs' ? 'xs' : size
  return (
    <div className="flex items-center gap-2">
      <OriginPicker size={size} value={v} onChange={setV} ariaLabel="Transform origin" />
      <Input size={field} prefix="X" value={String(v[0])} readOnly chars={4} />
      <Input size={field} prefix="Y" value={String(v[1])} readOnly chars={4} />
    </div>
  )
}
