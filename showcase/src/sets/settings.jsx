import { useState } from 'react'
import { Button, SettingsFooter, SettingsPanel, SettingsSections, TabsRow } from '@kolkrabbi/kol-component'
import { HubSettings } from '@kolkrabbi/kol-shell'

/* SETTINGS — the three tiers, each built without the Hub (user 2026-10-24: *"how would I tell an agent about the settings
 * tier, and how would he use it without the apphub?"*). The RAIL is the first tier and studio-hub's: `SettingsPanel
 * variant="rail"` over `SettingsSections`, with a text `TabsRow` when the content outgrows one column (Monitor: Settings ·
 * Shortcuts · About · Repo). The PAGE is `HubSettings` (`SettingsScaffold` underneath) with its two columns; the FILTERED
 * PAGE is the same with its filter bar, tabs and search. AppHub's `settings` prop maps onto exactly these three. */
export const meta = {
  title: 'Settings',
  description: 'The three settings tiers without the Hub',
  category: 'app',
  featured: true,
  type: 'reference',
  status: 'active',
  updated: '2026-10-24',
  tags: ['domain/app-shell', 'pattern/blocks'],
}
export const stage = 'full'

const SHORTCUTS = [
  { section: 'Navigate', items: [{ id: 'home', label: 'Home, then the rail', combo: '⌥ 1–9' }, { id: 'settings', label: 'Settings', combo: ',' }] },
  { section: 'Help', items: [{ id: 'sheet', label: 'Shortcuts sheet', combo: 'S' }] },
]

function useDemoSections() {
  const [aspect, setAspect] = useState('4:5')
  const [grid, setGrid] = useState(true)
  const [autoplay, setAutoplay] = useState(false)
  /* TYPED ROWS (2026-10-24): the control is named as data and SettingsSections draws it in the surface's tone */
  return [
    { label: 'Defaults', rows: [
      { label: 'Default aspect', type: 'choice', options: ['1:1', '4:5', '16:9'].map((v) => ({ value: v, label: v })), value: aspect, onChange: setAspect },
      { label: 'Show grid', type: 'switch', on: grid, onChange: setGrid },
    ] },
    { label: 'Transport', rows: [{ label: 'Autoplay', type: 'switch', on: autoplay, onChange: setAutoplay }] },
  ]
}

/* TIER 1 — THE RAIL. The Settings row (or `,`) opens it over the page; tabs inside it when the content is big. */
function RailTier({ sections }) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('settings')
  return (
    <div className="flex flex-col gap-3">
      <p className="kol-mono-14 text-meta">Tier 1, the rail. <code>SettingsPanel variant="rail"</code> over <code>SettingsSections</code>; a text <code>TabsRow</code> under the header when the content is big. studio-hub's tier, and AppHub's default.</p>
      <Button tone="grey" size="md" onClick={() => setOpen(true)}>Open the rail</Button>
      <SettingsPanel open={open} variant="rail" title="Settings" onClose={() => setOpen(false)} footer={<SettingsFooter onReset={() => {}} />}>
        <TabsRow look="text" size={12} tracked tabs={[{ id: 'settings', label: 'Settings' }, { id: 'shortcuts', label: 'Shortcuts' }, { id: 'about', label: 'About' }]} value={tab} onChange={setTab} ariaLabel="Settings tabs" />
        {tab === 'settings' && <SettingsSections sections={sections} divided />}
        {/* a string value is drawn by SettingsSections itself — mono-12 on the baseline (2026-10-24) */}
        {tab === 'shortcuts' && <SettingsSections sections={SHORTCUTS.map((s) => ({ label: s.section, rows: s.items.map((k) => ({ label: k.label, value: k.combo })) }))} divided />}
        {tab === 'about' && <p className="kol-mono-14 text-body">The reference for the three tiers.</p>}
      </SettingsPanel>
    </div>
  )
}

export default function SettingsSet() {
  const sections = useDemoSections()
  return (
    <div className="flex flex-col gap-12">
      <RailTier sections={sections} />
      <div className="flex flex-col gap-3">
        <p className="kol-mono-14 text-meta">Tier 2, the page. <code>HubSettings</code> at a route, two columns from <code>lg</code>, no filter bar. AppHub: <code>settings.page</code>.</p>
        <HubSettings app={{ name: 'Studio', about: 'The reference for the three tiers.', links: [{ label: 'Design system', url: 'https://ui.kolkrabbi.io' }] }} sections={sections} shortcuts={SHORTCUTS} filters={false} />
      </div>
      <div className="flex flex-col gap-3">
        <p className="kol-mono-14 text-meta">Tier 3, the filtered page. The same page with its filter bar, tabs and search. AppHub: <code>settings.page</code> and <code>settings.filters</code>.</p>
        <HubSettings app={{ name: 'Studio', about: 'The reference for the three tiers.', links: [{ label: 'Design system', url: 'https://ui.kolkrabbi.io' }] }} sections={sections} shortcuts={SHORTCUTS} />
      </div>
    </div>
  )
}
