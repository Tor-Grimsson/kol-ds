import { ContextMenu, MenuRow, useContextMenu } from '@kolkrabbi/kol-component'
import { CONTROL_TONES, ALIGNS, toneWrap } from '../lib/controls.js'

export const stage = 'sm'

const ROWS = ['brand-guide.pdf', 'cover.jpg', 'notes.md']

/* Right-click a row: one menu serves the whole list, and gets the row it was opened on. */
export const tones = CONTROL_TONES

export default function ContextMenuPreview({ tone }) {
  const menu = useContextMenu()
  return (
    <div className={toneWrap(tone)}>
      <ul className="flex flex-col">
        {ROWS.map((row) => (
          <li key={row} onContextMenu={(e) => menu.openAt(e, row)} className="kol-mono-14 text-body border-b border-fg-08 px-3 py-2 hover:bg-fg-04">
            {row}
          </li>
        ))}
      </ul>
      <p className="kol-mono-12 text-meta">Right-click a row.</p>
      <ContextMenu menu={menu}>
        {(row) => (
          <>
            <MenuRow onClick={() => {}}>Rename {row}</MenuRow>
            <MenuRow onClick={() => {}}>Move</MenuRow>
            <MenuRow onClick={() => {}}>Delete</MenuRow>
          </>
        )}
      </ContextMenu>
    </div>
  )
}
