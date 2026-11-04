import { useState } from 'react'
import { TreeRow } from '@kolkrabbi/kol-component'

export const stage = 'sm'
export const sizes = ['sm', 'xs', 'md', 'lg']

/* one row of a float tree at each size — rest · active · a section with its chevron */
export default function TreeRowPreview({ size = 'sm' }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="flex w-[256px] flex-col gap-1">
      <TreeRow size={size} icon="home-01" label="Home" onClick={() => {}} />
      <TreeRow size={size} icon="grid" label="Dashboard" expanded={open} onToggle={() => setOpen((v) => !v)} open={open} />
      {open && <TreeRow size={size} depth={1} icon="checklist" label="Tasks" count={5} active onClick={() => {}} />}
      {open && <TreeRow size={size} depth={1} icon="folder" label="Projects" onClick={() => {}} />}
    </div>
  )
}
