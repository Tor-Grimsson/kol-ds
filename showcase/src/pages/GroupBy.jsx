import { Link } from 'react-router-dom'
import { SegmentedToggle } from '@kolkrabbi/kol-component'
import HomeDoc from '../lib/HomeDoc.jsx'
import { groupComponents } from '../nav/registry.js'
import { useGrouping, GROUP_OPTIONS } from '../lib/grouping.jsx'

const linkCls = 'kol-doc-body underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64'

/** Group by — the Components category's own page (2026-09-30): its home, the switch, and every
 * chapter of the active axis linked to its page. */
export default function GroupBy() {
  const { mode, setMode } = useGrouping()
  const base = mode === 'atomic' ? '/components/tier' : '/components/function'
  return (
    <div className="flex flex-col gap-10 pb-24">
      <HomeDoc id="group-by" />
      <SegmentedToggle options={GROUP_OPTIONS} value={mode} onChange={setMode} size="sm" />
      <ul className="flex flex-col gap-2">
        {groupComponents(mode).map(([key, label, items]) => (
          <li key={key} className="kol-doc-body">
            <Link className={linkCls} to={`${base}/${key}`}>{label}</Link>
            <span className="text-subtle"> · {items.length}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
