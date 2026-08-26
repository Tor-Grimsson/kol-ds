import { useState } from 'react'
import { Divider } from '@kolkrabbi/kol-component'
import PageShell from './PageShell.jsx'
import PageHeader from './PageHeader.jsx'
import TabStrip from './TabStrip.jsx'

/**
 * SettingsScaffold — the settings-page idiom both shells re-implemented
 * inline: fixed PageShell, tab-driven PageHeader, TabStrip, Divider, then a
 * `flex:1 overflow:auto` body. Content is consumer-authored via
 * `renderContent(tabValue)` — sections/rows are content, not markup.
 *
 * Building blocks exported for the body: `SettingsSection` (h2 + column) and
 * `LabelRow` (the 160px label-column row — the de-facto standard both repos
 * and monitor's ColorPickerPage share).
 *
 * Shortcuts single-source: both repos hand-maintained the shortcut list twice
 * (settings + overlay) and both pairs drifted. Feed ONE array to both your
 * `ShortcutsOverlay` and a `LabelRow` map here.
 *
 * @param {Array} props.tabs - `[{ value, label, title, subtitle }]` — title/subtitle feed the header
 * @param {Function} props.renderContent - `(tabValue) => node`
 */
export default function SettingsScaffold({ tabs = [], defaultTab, renderContent }) {
  const [tab, setTab] = useState(defaultTab ?? tabs[0]?.value)
  const active = tabs.find((t) => t.value === tab)

  return (
    <PageShell mode="fixed">
      <PageHeader title={active?.title} subtitle={active?.subtitle} />
      <TabStrip
        options={tabs}
        value={tab}
        onChange={setTab}
        className="gap-6"
        style={{ marginBottom: 24 }}
      />
      <Divider className="mb-6" />
      <div style={{ flex: 1, overflow: 'auto', paddingTop: 4, paddingBottom: 4 }}>
        {renderContent?.(tab)}
      </div>
    </PageShell>
  )
}

/** Section — `h2` header + 8px column, the body block both repos share. */
export function SettingsSection({ title, children }) {
  return (
    <div>
      <h2 className="text-fg-80 kol-helper-16" style={{ marginBottom: 16 }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {children}
      </div>
    </div>
  )
}

/**
 * LabelRow — 160px flex-shrink-0 label column + value. `align="center"` for
 * control rows (a toggle), `align="baseline"` (default) for text rows.
 */
export function LabelRow({ label, align = 'baseline', children }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: align }}>
      <span className="text-fg-48 kol-helper-12" style={{ width: 160, flexShrink: 0 }}>{label}</span>
      {typeof children === 'string'
        ? <span className="text-fg-32 kol-helper-12">{children}</span>
        : children}
    </div>
  )
}
