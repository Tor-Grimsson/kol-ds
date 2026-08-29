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
 * @param {Object}   props.header - PageHeader props spread onto the scaffold's header (`voice`, `size`, `titleClass`, `eyebrow`)
 */
export default function SettingsScaffold({ tabs = [], defaultTab, renderContent, header }) {
  const [tab, setTab] = useState(defaultTab ?? tabs[0]?.value)
  const active = tabs.find((t) => t.value === tab)

  return (
    <PageShell mode="fixed">
      {/* `header` is spread onto the PageHeader (PageHeaderMonoTitle addendum,
        * kol-fxr 2026-08-27): a consumer could not reach this title at all —
        * `voice="mono"`, `size`, `titleClass`, `eyebrow` all pass through */}
      <PageHeader title={active?.title} subtitle={active?.subtitle} {...header} />
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
      {/* fg-96 on helper-14 — the tab strip's role (PageHeaderMonoTitle addendum 2,
        * kol-fxr 2026-08-27; was fg-80 / helper-16 with no seam) */}
      <h2 className="text-fg-96 kol-helper-14" style={{ marginBottom: 16 }}>{title}</h2>
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
      {/* 160 wide, but it yields and truncates when the row is squeezed — the label
        * is the prose, the value is the datum (SettingsShortcutsComboWrap, 2026-08-27) */}
      <span className="text-fg-48 kol-helper-12 truncate" style={{ flex: '0 1 160px', minWidth: 0 }}>{label}</span>
      {typeof children === 'string'
        ? <span className="text-fg-32 kol-helper-12">{children}</span>
        : children}
    </div>
  )
}
