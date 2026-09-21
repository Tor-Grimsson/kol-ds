import { useState } from 'react'
import { MobileTabBar, TABBAR_H } from '@kolkrabbi/kol-component'

export const stage = 'sm'

const TABS = [
  { value: 'browse', label: 'Browse', icon: 'folder' },
  { value: 'files', label: 'Files', icon: 'view-list' },
  { value: 'kinds', label: 'Kinds', icon: 'grid' },
]

export default function MobileTabBarDemo() {
  const [tab, setTab] = useState('browse')
  return (
    /* The real bar is `position: fixed` to the viewport and `md:hidden` — it
     * shows on a phone and nowhere else. Neither is demonstrable in a stage, so
     * this frames it: a relative box the bar is pinned inside, always visible.
     * The pinning and the breakpoint are the component's; the frame is not. */
    <div className="w-full max-w-sm">
      <div
        className="relative overflow-hidden rounded border border-fg-08 bg-surface-secondary [&_.kol-mobile-tabbar]:absolute [&_.kol-mobile-tabbar]:!flex"
        style={{ height: 220 }}
      >
        <div className="p-4 kol-mono-12 text-meta">
          Showing: <span className="text-emphasis">{tab}</span>
          <p className="kol-helper-10 text-fg-48 mt-2">
            The list scrolls under the bar, so it owes it {TABBAR_H}px of room.
          </p>
        </div>
        <MobileTabBar tabs={TABS} value={tab} onChange={setTab} />
      </div>
    </div>
  )
}
