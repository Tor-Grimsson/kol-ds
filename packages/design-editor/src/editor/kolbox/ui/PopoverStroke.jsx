import { useState } from 'react'
import { Button, Dropdown, Input, PopoverPanel, TabsRow, Tooltip } from '@kolkrabbi/kol-component'
import Icon from './Icon.jsx'

/* W13 state 5: from the stroke settings button; titled, close; tabs Basic, Dynamic, Brush; Style, Width profile with
   its flip button, Join (three options), Miter angle. Style and Join are the engine's (round 2, 3.1: the real Stroke
   panel's Solid, Dashed, Dotted and Miter, Round, Bevel); the engine has no dynamic or brush stroke, no width profile
   and no miter angle, so those stay drawn, dimmed, each saying why (Uniform is the one width it draws; 28.96° is the
   miter limit every stroke takes). Join's three options are words, your icons have no join glyphs (gap).
   value: { style, join } as the options' words; onChange(patch). */
const WIDTH = 'Strokes draw at one width; no width profiles yet'
const Why = ({ label, children }) => <Tooltip variant="kolbox" label={label}>{children}</Tooltip>

export default function PopoverStroke({ anchor, open, onClose, value = { style: 'Solid', join: 'Miter' }, onChange }) {
  const [tab, setTab] = useState('Basic')
  return (
    <PopoverPanel variant="kolbox" anchor={anchor} open={open} onClose={onClose} title="Stroke settings">
      <div className="flex flex-col gap-2 px-4 pb-4">
        <TabsRow variant="kolbox" tabs={['Basic', { value: 'Dynamic', label: 'Dynamic', disabled: true, tooltip: 'No dynamic strokes yet' }, { value: 'Brush', label: 'Brush', disabled: true, tooltip: 'No brush strokes yet' }]} value={tab} onChange={setTab} className="w-full" />
        <Row label="Style">
          <Dropdown variant="kolbox" ariaLabel="Stroke style" value={value.style} options={['Solid', 'Dashed', 'Dotted']} onChange={(style) => onChange?.({ style })} className="flex-1" />
        </Row>
        <Row label="Width profile">
          <Why label={WIDTH}><Dropdown variant="kolbox" ariaLabel="Width profile" value="Uniform" options={['Uniform']} disabled className="w-full" /></Why>
          <Why label={WIDTH}><Button variant="kolbox" iconOnly="flip-horizontal" aria-label="Flip width profile" disabled/></Why>
        </Row>
        <Row label="Join">
          <TabsRow variant="kolbox" tabs={['Miter', 'Round', 'Bevel']} value={value.join} onChange={(join) => onChange?.({ join })} className="w-full min-w-0 [&>button]:px-0 [&>button]:text-help" />
        </Row>
        <Row label="Miter angle">
          <Why label="Every stroke takes the 28.96° miter limit"><Input variant="kolbox" iconLeft="angle" aria-label="Miter angle" value="28.96°" disabled readOnly className="w-full"/></Why>
        </Row>
      </div>
    </PopoverPanel>
  )
}

function Row({ label, children }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-19 shrink-0 text-label text-muted">{label}</span>
      <div className="flex min-w-0 flex-1 items-center gap-1 [&>span:first-child]:min-w-0 [&>span:first-child]:flex-1">{children}</div>
    </div>
  )
}
