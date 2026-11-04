import { useState } from 'react'
import { Badge, Button, Dropdown, MenuDatePicker, NavRail, SectionText, TabsRow } from '@kolkrabbi/kol-component'
import { AccountFooter, Breadcrumb, DataStatus, FooterStrip, PeriodNav, RailDisplayControls, RailFlyout, RailTrigger, StatusStrip } from '@kolkrabbi/kol-shell'
import FamilyPage, { Part } from '../FamilyPage.jsx'

/* Navigation + layout (24-float-system.md § The parts, by family, row 9) — every part live from its package. */

const noop = () => {}

const NAV = [
  { heading: 'WORKSPACE' },
  { icon: 'home-01', label: 'Home', path: '/home' },
  { icon: 'inbox', label: 'Capture', path: '/capture', count: 12 },
  { icon: 'list-checks', label: 'Tasks', path: '/tasks', count: 5, sub: [
    { icon: 'list-bullet', label: 'Today', path: '/tasks/today', count: 3 },
    { icon: 'calendar', label: 'Upcoming', path: '/tasks/upcoming', count: 2 },
  ] },
  { icon: 'folder', label: 'Projects', path: '/projects' },
  { heading: 'LIBRARY' },
  { icon: 'film-strip', label: 'Media', path: '/media' },
  { icon: 'book-open', label: 'Reading', path: '/reading' },
]
const FLYOUT = [
  { icon: 'list-bullet', label: 'Today', path: '/tasks/today', count: 3 },
  { icon: 'calendar', label: 'Upcoming', path: '/tasks/upcoming', count: 2 },
  { icon: 'check', label: 'Done', path: '/tasks/done', count: 41 },
]
const FOOTPRINTS = [['Expanded', '--kol-shell-float-rail-open', '280'], ['Rail', '--kol-shell-float-rail-width', '72'], ['Hidden', '--kol-shell-float-rail-hidden', '0']]

/* a state of a compound part, captioned */
const State = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    <span className="kol-float-label text-fg-64">{label}</span>
    {children}
  </div>
)

export default function Navigation() {
  const [path, setPath] = useState('/tasks/today')
  const [tab, setTab] = useState('overview')
  const [range, setRange] = useState('28d')

  return (
    <FamilyPage title="Navigation + layout" body="The float rail in its four states, the page head, the tabs and filters, the strips, and the rail's footprints.">
      {(surface) => (
        <>
          <Part name="NavRail float" slug="nav-rail">
            <State label="Expanded · 280">
              <div className="h-[640px]">
                <NavRail variant="float" items={NAV} currentPath={path} onNavigate={setPath} title="Kolkrabbi" onSwitch={noop} onSearch={noop}
                  defaultExpanded={['/tasks']} footer={<RailDisplayControls onCollapse={noop} onHide={noop} />} />
              </div>
            </State>
            <State label="Rail · 72">
              <div className="h-[640px]">
                <NavRail variant="float" collapsed items={NAV} currentPath={path} onNavigate={setPath} onCollapsedChange={noop} onSearch={noop} onHide={noop} />
              </div>
            </State>
            <State label="Hidden · RailTrigger">
              <RailTrigger items={NAV.filter((i) => !i.heading)} currentPath={path} onNavigate={setPath} title="Kolkrabbi" breadcrumb={['Tasks', 'Today']} surface={surface} />
            </State>
            <State label="Hover flyout · RailFlyout">
              <RailFlyout icon="list-checks" title="Tasks" items={FLYOUT} active={path} onPick={(i) => setPath(i.path)} surface={surface} />
            </State>
          </Part>

          <Part name="PageHeader float" slug="page-header">
            <SectionText variant="float" eyebrow="DASHBOARD  /  TASKS" headline="Tasks, in focus." body="Tasks, projects, links — your living workspace."
              actions={<Button variant="float" tone="inverted" size="md" iconLeft="plus">New task</Button>} style={{ marginBottom: 0 }} />
          </Part>

          <Part name="text tabs" slug="tabs-row">
            <TabsRow variant="float" type="mono" value={tab} onChange={setTab}
              tabs={[{ id: 'overview', label: 'Overview' }, { id: 'website', label: 'Website' }, { id: 'repositories', label: 'Repositories' }, { id: 'audience', label: 'Audience' }]} />
          </Part>

          <Part name="filter row" slug="dropdown">
            <div className="flex w-full flex-wrap items-center justify-between gap-4">
              <span className="flex flex-wrap items-center gap-2">
                <Dropdown variant="float" size="md" options={[{ value: 'site', label: 'kolkrabbi.io' }]} value="site" onChange={noop} />
                <Dropdown variant="float" size="md" options={[{ value: 'all', label: '4 repositories' }]} value="all" onChange={noop} />
                <span className="kol-float-hint text-fg-64 pl-2">All traffic · No filters</span>
              </span>
              <span className="flex flex-wrap items-center gap-3">
                <span className="kol-float-hint text-fg-64">vs. previous 28 days</span>
                <MenuDatePicker variant="float" label="01–28 Oct 2026" value={range} onChange={setRange}
                  groups={[[{ key: '7d', label: 'Last 7 days' }, { key: '28d', label: 'Last 28 days' }, { key: '90d', label: 'Last 90 days' }]]} />
                <Badge variant="secondary" size="sm">Last 28 days</Badge>
              </span>
            </div>
          </Part>

          <Part name="SectionText meta" slug="section-text">
            <SectionText variant="float" headline="Website traffic" headlineAs="h2" headlineClass="kol-float-window" meta="kolkrabbi.io · Umami" className="w-full" style={{ marginBottom: 0 }} />
          </Part>

          <Part name="AccountFooter" slug="account-footer">
            <AccountFooter name="Kolkrabbi" workspace="Personal workspace" initial="K" onPress={noop} />
          </Part>

          <Part name="StatusStrip" slug="status-strip">
            <StatusStrip label="ALL SYSTEMS OBSERVING" />
          </Part>

          <Part name="Breadcrumb" slug="breadcrumb">
            <Breadcrumb items={[{ label: 'Workspace', onPress: noop }, { label: 'Analytics', onPress: noop }, 'Overview']} />
          </Part>

          <Part name="FooterStrip" slug="footer-strip">
            <FooterStrip start="KOLKRABBI / METRICS — PERSONAL OBSERVATORY" end="Illustrative data · UTC" className="w-full" />
          </Part>

          <Part name="PeriodNav" slug="period-nav">
            <PeriodNav onPrev={noop} onNext={noop} onToday={noop} surface={surface} />
          </Part>

          <Part name="DataStatus" slug="data-status">
            <DataStatus badge="Demo data" updated="UPDATED 14:32 UTC" />
          </Part>

          {/* the footprint tokens drawn as their widths — layout glue reading kol-theme's three tokens */}
          <Part name="footprints">
            <div className="flex w-full flex-col gap-2">
              {FOOTPRINTS.map(([label, token, px]) => (
                <div key={token} className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="kol-float-label text-fg-64 w-20 shrink-0">{label}</span>
                  <span className="h-6 shrink-0 rounded-[var(--kol-float-list-r)] bg-fg-16" style={{ width: `var(${token})` }} />
                  <span className="kol-float-timecode text-fg-64">{px} · {token}</span>
                </div>
              ))}
            </div>
          </Part>
        </>
      )}
    </FamilyPage>
  )
}
