import { useState } from 'react'
import { Divider, LabeledControlSection, SettingsFooter, SettingsPanel, SettingsSections, ViewToggle } from '@kolkrabbi/kol-component'
import SettingsScaffold from './SettingsScaffold.jsx'
import SettingsShortcuts from './SettingsShortcuts.jsx'
import SettingsLinks, { SettingsColophon } from './SettingsLinks.jsx'

/* taxonomy-ok: organism — nests SettingsScaffold / SettingsShortcuts / SettingsLinks (relative) + kol-component's SettingsPanel / SettingsSections */

/**
 * HubSettings — the Hub's Settings page (the Hub, 2026-09-26). monitor, mirror and fxr
 * each put the same page on `SettingsScaffold`: SETTINGS · ABOUT · REPO with the same
 * three subtitles, the same theme toggle in the masthead, About as the app's prose over
 * the colophon, Repo as a link list, and the keyboard shortcuts from the one array the
 * sheet shows. Only the app's own settings differ, so only those are passed in.
 *
 * kol-fxr's page is the richest of the three and is the reference (user, 2026-09-26:
 * "not saying its more true then other versions, just more feature rich, which we want
 * as options, based on what repo has"). Every one of its features is here, and each
 * turns on only when the app supplies what it needs:
 *
 *   sections        settings rows AS DATA (`SettingsSections`' shape). The page renders
 *                   them, and the search reads them with the shortcuts, under a Section
 *                   filter — fxr's page
 *   drawer          the gear in the masthead opens the SAME sections as a right-hand
 *                   `SettingsPanel` — one definition, two frames, so they cannot drift.
 *                   `true`, or `{ title, onReset }` (a reset foot)
 *   picker          the masthead's dropdown (fxr: open a chrome)
 *   splitShortcuts  OPTIONS / SHORTCUTS as an icon pair beside the row, instead of the
 *                   shortcuts stacked under the settings — fxr's page
 *   content         free-form sections instead of (or above) `sections` — monitor's prose
 *   tabs            extra tabs after SETTINGS (mirror's PERFORMANCE)
 *
 * ABOUT and REPO sit BELOW the rule (`row: 'layout'`) — fxr's, the page the scaffold
 * was rebuilt from (SettingsScaffoldTabRows).
 *
 * @param {Object}    app          `{ name, about, links }`
 * @param {Array}     sections     `[{ label, rows: [{ label, render | value, align? }] }]`
 * @param {boolean|Object} drawer  gear + drawer over `sections` — `{ title = 'Display settings', onReset }`
 * @param {ReactNode} content      free-form body above the sections
 * @param {Array}     tabs         `[{ value, label, title, subtitle, content }]`
 * @param {Array}     shortcuts    `[{ section, items: [{ id, label, combo }] }]`
 * @param {boolean}   splitShortcuts  the OPTIONS / SHORTCUTS pair (default off — stacked)
 * @param {ReactNode} themeToggle · picker   the masthead cluster, as SettingsScaffold
 * @param {'masthead'|'drawer'} themeIn  where the theme toggle sits (user, 2026-09-26). `masthead`
 *                                 (default) is the 2026-08-30 ruling (SettingsMastheadCluster) — and the
 *                                 only place on a page with no drawer; `drawer` puts it in the drawer's
 *                                 footer beside reset, apps/media's arrangement. `drawer` with no drawer
 *                                 falls back to the masthead, so the toggle is never lost
 * @param {Function}  comboLabel   (combo) => string, for SettingsShortcuts
 * @param {string}    tone         the page's control tone (default `sunken`, SettingsScaffold's): the
 *                                 filter row, the masthead gear AND every control in the settings rows,
 *                                 which inherit it from a `kol-tone-*` wrapper — `tone: 'primary'` in an
 *                                 app's `settings` is the one line that changes all of them
 */
const SHORTCUTS = 'Shortcuts'
/* ONE settings column for every app on the Hub (user, 2026-09-26: "the layout has 2 different
 * settings, thats wrong") — a per-app width was how two pages drifted within a day. 320 = the 160
 * label + a dropdown holding a bucket name ("R2 · kol-media"); fxr's 268 was sized for switches. */
const COLUMN = 320
const PAIR = [
  { value: 'options', label: 'OPTIONS', icon: 'slider-01' },
  { value: 'shortcuts', label: 'SHORTCUTS', icon: 'view-list' },
]

export default function HubSettings({
  app = {},
  sections,
  drawer,
  content,
  tabs = [],
  shortcuts = [],
  splitShortcuts = false,
  themeToggle,
  picker,
  comboLabel,
  tone = 'sunken',
  themeIn = 'masthead',
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mode, setMode] = useState('options')
  const drawerCfg = drawer === true ? {} : drawer
  const hasDrawer = !!drawerCfg && sections?.length > 0
  const themeInDrawer = themeIn === 'drawer' && hasDrawer && !!themeToggle

  const all = [
    { value: 'settings', label: 'SETTINGS', title: 'Settings', subtitle: 'Configuration and preferences' },
    ...tabs,
    { value: 'about', label: 'ABOUT', row: 'layout', title: 'About', subtitle: `${app.name ?? ''} by Kolkrabbi`.trim() },
    { value: 'repo', label: 'REPO', row: 'layout', title: 'Repo', subtitle: 'Source and deployments' },
  ]

  /* ONE FLAT LIST for the filter row: a setting row carries its section, a shortcut its
   * own group under the one Shortcuts section — fxr's page, so the chips stay few */
  const items = [
    ...(sections ?? []).flatMap((sec) => sec.rows.map((row) => ({
      id: `${sec.label}:${row.label}`, kind: 'setting', label: row.label, section: sec.label, row,
    }))),
    ...shortcuts.flatMap((sec) => (sec.items ?? []).map((k) => ({
      id: `shortcut:${k.id ?? k.label}`, kind: 'shortcut', label: k.label, combo: k.combo, section: SHORTCUTS, group: sec.section, k,
    }))),
  ]
  const filterGroups = sections?.length
    ? [{ label: 'Section', key: 'section', values: [...sections.map((s) => s.label), ...(shortcuts.length ? [SHORTCUTS] : [])] }]
    : undefined

  /* regroup what survived in the declared order — a search narrows, it never reorders */
  const liveSections = (rows) => (sections ?? [])
    .map((sec) => ({ ...sec, rows: rows.filter((i) => i.kind === 'setting' && i.section === sec.label).map((i) => i.row) }))
    .filter((sec) => sec.rows.length)
  const liveShortcuts = (rows) => shortcuts
    .map((sec) => ({ section: sec.section, items: rows.filter((i) => i.kind === 'shortcut' && i.group === sec.section).map((i) => i.k) }))
    .filter((sec) => sec.items.length)

  const renderSettings = (filtered) => {
    const rows = filtered ?? items
    const keys = liveShortcuts(rows)
    /* SPLIT: the page-wide multi-column grid, for a keymap that fills a page (monitor's) */
    if (splitShortcuts && mode === 'shortcuts') return keys.length > 0 && <SettingsShortcuts sections={keys} comboLabel={comboLabel} />
    const live = liveSections(rows)
    /* STACKED: the shortcuts are settings ROWS in the settings column (user, 2026-09-26: "why
     * doesnt items justify space between right side? where toggle and dropdown align?") — the
     * page-wide grid packed them into ~180px tracks, so the combos ended short of the controls
     * above. Same anatomy as the S sheet's rows; the combo is the row's value, right-aligned. */
    const keyRows = keys.map(({ section, items: ks }) => ({
      label: section,
      rows: ks.map((k) => ({
        id: k.id ?? k.label,
        label: k.label,
        value: <span className="text-fg-32 kol-helper-12 whitespace-nowrap">{comboLabel ? comboLabel(k.combo) : k.combo}</span>,
      })),
    }))
    return (
      <div className="flex flex-col gap-8">
        {content}
        {/* the rows are sized for the drawer's 380 (a 160 label + the control); unbounded on a
          * page the control runs the full width, so the column is capped — one column for every app (COLUMN) */}
        {live.length > 0 && <div style={{ maxWidth: COLUMN }}><SettingsSections sections={live} /></div>}
        {!splitShortcuts && keyRows.length > 0 && (
          <LabeledControlSection label="Keyboard Shortcuts">
            <div style={{ maxWidth: COLUMN }}><SettingsSections sections={keyRows} /></div>
          </LabeledControlSection>
        )}
      </div>
    )
  }

  const render = (tab, filtered) => {
    if (tab === 'settings') return <div className={`kol-tone-${tone}`}>{renderSettings(filtered)}</div>
    if (tab === 'about') return (
      <div className="flex flex-col gap-8">
        {app.about && (
          <LabeledControlSection label={app.name}>
            <div className="text-fg-48 kol-mono-14" style={{ maxWidth: 640 }}>{app.about}</div>
          </LabeledControlSection>
        )}
        <SettingsColophon />
      </div>
    )
    if (tab === 'repo') return (
      <LabeledControlSection label="Links">
        <SettingsLinks links={app.links ?? []} />
      </LabeledControlSection>
    )
    return tabs.find((t) => t.value === tab)?.content ?? null
  }

  return (
    <>
      <SettingsScaffold
        tabs={all}
        defaultTab="settings"
        header={{ size: 'sm', voice: 'mono' }}
        tone={tone}
        picker={picker}
        themeToggle={themeInDrawer ? undefined : themeToggle}
        onOpenSettings={hasDrawer ? () => setDrawerOpen(true) : undefined}
        items={items}
        filterGroups={filterGroups}
        searchKeys={['label', 'section', 'group', 'combo']}
        /* the pair picks the Settings view, so from ABOUT or REPO it also takes you back to Settings */
        trailingActions={splitShortcuts ? (tab, setTab) => (
          <>
            <ViewToggle variant="icon" size="sm" tone="sunken" options={PAIR} viewMode={mode}
              onViewChange={(v) => { setMode(v); setTab('settings') }} />
            <Divider variant="vertical" />
          </>
        ) : undefined}
        renderContent={render}
      />
      {/* the drawer is the page's other half, a SIBLING of the scaffold — never inside its scroll */}
      {hasDrawer && (
        <SettingsPanel
          open={drawerOpen}
          variant="drawer"
          title={drawerCfg.title ?? 'Display settings'}
          onClose={() => setDrawerOpen(false)}
          /* the footer's children sit before reset in its row — media's theme · reset arrangement */
          footer={(drawerCfg.onReset || themeInDrawer)
            ? <SettingsFooter onReset={drawerCfg.onReset}>{themeInDrawer ? themeToggle : null}</SettingsFooter>
            : undefined}
        >
          <SettingsSections sections={sections} divided />
        </SettingsPanel>
      )}
    </>
  )
}
