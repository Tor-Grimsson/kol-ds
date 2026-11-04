import { useState } from 'react'
import { PropertyRail } from '@kolkrabbi/kol-shell'

/* the float inspector (the gap map's row 65): header · chip tabs · the selected object · two-up fields · a select, a
   slider and a switch — every control kol-component's float */
const BLEND = [{ value: 'normal', label: 'Normal' }, { value: 'screen', label: 'Screen' }, { value: 'multiply', label: 'Multiply' }]
const MOTION = [{ value: 'orbit', label: 'Slow orbit · 12 s' }, { value: 'drift', label: 'Drift · 8 s' }, { value: 'still', label: 'Still' }]

export default function PropertyRailPreview() {
  const [tab, setTab] = useState('design')
  const [v, setV] = useState({ x: '1471', y: '516', w: '754', h: '771', r: '-28', s: '100', blend: 'screen', opacity: 85, glow: true, motion: 'orbit', visible: true })
  const set = (k) => (val) => setV((s) => ({ ...s, [k]: val }))
  return (
    <PropertyRail
      title="Properties"
      onCollapse={() => {}}
      tabs={[{ value: 'design', label: 'Design' }, { value: 'animate', label: 'Animate' }]}
      tab={tab}
      onTab={setTab}
      selected={{ icon: 'clr-mono', name: 'Orbit field', visible: v.visible, onVisible: set('visible') }}
      sections={[
        {
          label: 'TRANSFORM',
          rows: [
            { type: 'fields', id: 'pos', fields: [{ id: 'x', prefix: 'X', value: v.x, onChange: set('x') }, { id: 'y', prefix: 'Y', value: v.y, onChange: set('y') }] },
            { type: 'fields', id: 'size', fields: [{ id: 'w', prefix: 'W', value: v.w, onChange: set('w') }, { id: 'h', prefix: 'H', value: v.h, onChange: set('h') }] },
            { type: 'fields', id: 'rot', fields: [{ id: 'r', prefix: 'R', unit: '°', value: v.r, onChange: set('r') }, { id: 's', unit: '%', value: v.s, onChange: set('s') }] },
          ],
        },
        {
          label: 'APPEARANCE',
          onAdd: () => {},
          rows: [
            { type: 'select', id: 'blend', label: 'Blend mode', options: BLEND, value: v.blend, onChange: set('blend') },
            { type: 'slider', id: 'opacity', label: 'Opacity', value: v.opacity, onChange: set('opacity'), min: 0, max: 100, formatValue: (n) => `${n}%` },
            { type: 'switch', id: 'glow', label: 'Soft glow', icon: 'radial-star', on: v.glow, onChange: set('glow') },
          ],
        },
        {
          label: 'MOTION',
          meta: '◇',
          rows: [{ type: 'select', id: 'motion', options: MOTION, value: v.motion, onChange: set('motion') }],
        },
      ]}
    />
  )
}
