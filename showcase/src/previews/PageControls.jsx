import { useState } from 'react'
import { PageControls } from '@kolkrabbi/kol-component'

export const stage = 'full'

const SERIES = [
  { id: 'greyscale', label: 'Greyscale', color: '#5B5B5D' },
  { id: 'burgundy', label: 'Burgundy', color: '#7A1F2B' },
  { id: 'cream', label: 'Cream', color: '#F3EADF' },
]
const SECTIONS = [{ id: 'overview', label: 'Overview' }, { id: 'stops', label: 'Stops' }, { id: 'anchors', label: 'Anchors' }, { id: 'notes', label: 'Notes' }]

/* The page's own controls in one strip: series chips, a view switch and the count on the first row,
 * the section tabs on the second, a dot legend on the third — every page the same order. Not content
 * filters: it drives the page's rendering, not a collection's facets. */
export default function PageControlsPreview() {
  const [hidden, setHidden] = useState(() => new Set())
  const [detail, setDetail] = useState('full')
  const [jump, setJump] = useState('overview')
  const toggle = (id) => setHidden((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const showing = SERIES.filter((s) => !hidden.has(s.id))
  return (
    <div className="w-full">
      <PageControls
        sticky={false}
        toggles={{ label: 'Series', items: SERIES.map((s) => ({ id: s.id, label: s.label, active: !hidden.has(s.id) })), onToggle: toggle }}
        views={[{ label: 'Detail', value: detail, onChange: setDetail, options: [{ value: 'full', label: 'Every stop' }, { value: 'anchors', label: 'Anchors only' }] }]}
        count={`${showing.length} / ${SERIES.length}`}
        jump={{ label: 'Jump to', value: jump, onChange: setJump, tabs: SECTIONS }}
        legend={showing.map((s) => ({ id: s.id, label: s.label, color: s.color }))}
      />
    </div>
  )
}
