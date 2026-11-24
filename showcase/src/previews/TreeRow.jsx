import { useState } from 'react'
import { TreeRow } from '@kolkrabbi/kol-component'

export const stage = 'sm'
export const sizes = ['sm', 'xs', 'md', 'lg']

/* one row of a float tree at each size — rest · active · a section with its chevron */
export const variants = ['default', 'kolbox', 'folio']

export default function TreeRowPreview({ size = 'sm', variant = 'default' }) {
  /* folio (Folio migration batch D): a shelf and its documents, the current one lit */
  if (variant === 'folio') return (
    <div className="flex w-60 flex-col px-2 py-2" style={{ background: 'var(--kol-folio-paper)', color: 'var(--kol-folio-ink)' }}>
      <TreeRow variant="folio" label="Studio" count={3} expanded onToggle={() => {}} />
      <TreeRow variant="folio" href="#" label="A Markdown sampler" active />
      <TreeRow variant="folio" href="#" label="Laying Plans" />
      <TreeRow variant="folio" href="#" label="Attack by Stratagem" />
      <TreeRow variant="folio" label="Self" count={3} expanded={false} onToggle={() => {}} />
    </div>
  )
  /* kolbox (plan-2026-11-18-kolbox-system W31.2 batch 5) */
  if (variant === 'kolbox') return (
    <div className="flex w-60 flex-col gap-1">
      <TreeRow variant="kolbox" label="Page 1" active />
      <TreeRow variant="kolbox" label="Page 2" />
      <TreeRow variant="kolbox" tree expanded icon="square" label="Group" />
      <TreeRow variant="kolbox" tree depth={1} icon="circle" label="Ellipse" active />
      <TreeRow variant="kolbox" size="sm" icon="home-01" label="Home" active />
      <TreeRow variant="kolbox" size="md" label="Inter 12" />
      <TreeRow variant="kolbox" size="lg" icon="search" label="Search files" active />
      {/* a library tree (Folio on kolbox, 2026-11-22): a shelf with its count and its documents as links, one current */}
      <TreeRow variant="kolbox" label="Studio" count={3} expanded onToggle={() => {}} />
      <TreeRow variant="kolbox" href="#" label="A Markdown sampler" active />
      <TreeRow variant="kolbox" href="#" label="Laying Plans" />
      <TreeRow variant="kolbox" label="Self" count={3} expanded={false} onToggle={() => {}} />
    </div>
  )
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
