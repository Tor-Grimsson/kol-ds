import { useState } from 'react'
import { LinkAddRow } from '@kolkrabbi/kol-component'

export const stage = 'full'

export const variants = ['float', 'filled']

/* name · URL · Add link — under the project's head, on the sheet */
export default function LinkAddRowPreview({ variant = 'float' }) {
  const [links, setLinks] = useState([])
  return (
    <div className="flex w-full flex-col gap-3">
      <LinkAddRow variant={variant} title="kol-vault" href="https://kolkrabbi.io" onAdd={(l) => setLinks((a) => [...a, l])} />
      {links.length > 0 && <ul className="kol-float-hint text-fg-64 flex flex-col gap-1 px-4">{links.map((l, i) => <li key={i}>{l.name || l.url} → {l.url}</li>)}</ul>}
    </div>
  )
}
