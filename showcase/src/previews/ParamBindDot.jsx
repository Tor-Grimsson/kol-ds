import { useState } from 'react'
import { ParamBindDot, Slider } from '@kolkrabbi/kol-component'

export const stage = 'sm'
export const sizes = ['sm', 'xs', 'md']

const SOURCES = [['none', 'Constant'], ['track', 'Keyframes'], ['lfo', 'LFO'], ['mouse', 'Mouse']]

/* fxr's param row: a slider, the dot in the trailing slot; the menu binds the param to a source */
export default function ParamBindDotPreview({ size = 'sm' }) {
  const [mode, setMode] = useState('none')
  const [v, setV] = useState(40)
  const bound = mode !== 'none'
  return (
    <div className="flex w-[260px] items-center gap-2">
      <span className="kol-helper-12 text-body w-16 shrink-0">Opacity</span>
      <div className="flex-1 min-w-0"><Slider min={0} max={100} value={v} onChange={setV} /></div>
      <ParamBindDot size={size} bound={bound} mode={SOURCES.find(([k]) => k === mode)?.[1]} label="Opacity"
        items={SOURCES.map(([k, label]) => ({ label, checked: mode === k, onClick: () => setMode(k) }))} />
    </div>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  return <ParamBindDot bound mode="LFO" label="Opacity" items={[{ label: 'Constant', onClick: () => {} }, { label: 'LFO', checked: true, onClick: () => {} }]} />
}
