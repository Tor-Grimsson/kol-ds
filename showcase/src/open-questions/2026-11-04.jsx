import { useState } from 'react'
import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'
import { Button, Delta, IndexRow, InlineAddRow, LinkAddRow, TabsRow } from '@kolkrabbi/kol-component'
import { Card, StatTiles } from '@kolkrabbi/kol-dashboards'
import { Breadcrumb } from '@kolkrabbi/kol-shell'
import { DocumentLibrary } from '@kolkrabbi/kol-styleguide'
import { IconLoader } from '@kolkrabbi/kol-icons'

/* Round 25 — float operational, W6 and W7 (plan-2026-11-04-float-operational). Every row is the shipped part, rendered
 * with the props apps/float uses, beside a plain box at the exploration frame's size. Nothing decided; his call per row. */
export const meta = {
  round: 25,
  date: '2026-11-04',
  title: 'Float: the part’s size or the frame’s',
  status: 'open',
}

const noop = () => {}

const TRAFFIC = [
  { label: 'Unique visitors', value: '12,864', delta: <Delta value="19.8%" from="10,740" />, spark: [5, 6, 5, 7, 6, 8, 7, 9] },
  { label: 'Page views', value: '18,420', delta: <Delta value="16.4%" from="15,825" />, spark: [5, 6, 6, 7, 6, 8, 8, 9] },
  { label: 'Bounce rate', value: '42.8%', delta: <Delta value="3.2 pp" direction="down" from="46.0%" />, spark: [9, 8, 9, 7, 7, 6, 7, 5] },
  { label: 'Avg. visit duration', value: '1m 48s', delta: <Delta value="12.5%" from="1m 36s" />, spark: [5, 5, 6, 7, 6, 7, 8, 9] },
]
const TABS = [
  { id: 'tasks', label: 'Tasks', icon: 'checklist', count: 5 },
  { id: 'capture', label: 'Capture', icon: 'inbox', count: 3 },
  { id: 'projects', label: 'Projects', icon: 'folder' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar' },
  { id: 'metrics', label: 'Metrics', icon: 'bar-chart' },
  { id: 'links', label: 'Links', icon: 'link' },
]
const FILTERS = [{ id: 'all', label: 'All tasks', count: 5 }, { id: 'briefs', label: 'Briefs', count: 1 }, { id: 'todos', label: 'Todos', count: 3 }, { id: 'other', label: 'Other', count: 1 }]
const LIBRARY = {
  folders: [{ id: '', label: 'Documents' }],
  rows: [{ id: 'terms', folder: '', title: 'Terms', to: '#', kind: 'Contract', date: '2026-11-04', lang: 'is en', files: [] }],
}
const roundFlag = (code) => {
  const name = { is: 'flag-is', en: 'flag-gb', de: 'flag-de' }[code]
  return <span role="img" aria-label={code} className="inline-flex overflow-hidden rounded-full shadow-[0_0_0_1px_var(--kol-border-default)]"><IconLoader name={name} size={12} /></span>
}

/* the shipped part beside the frame's box, both numbers under them, the question last */
function Row({ part, w, h, shipped, frame, question }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start gap-8">
        <div className="flex flex-col gap-2 max-w-full overflow-x-auto">
          <div data-theme="dark" className="bg-surface-primary p-4 rounded">{part}</div>
          <span className="kol-mono-12 text-meta">shipped {shipped}</span>
        </div>
        <div className="flex flex-col gap-2 max-w-full">
          <div className="bg-fg-04 max-w-full" style={{ width: w, height: h }} />
          <span className="kol-mono-12 text-meta">frame {frame}</span>
        </div>
      </div>
      <p className="kol-helper-14">{question}</p>
    </div>
  )
}

const KEEP = 'Keep the part’s size, or move the part to the frame’s?'

export default function OpenQuestionsRound25() {
  usePageMeta({ tags: [], related: [] })
  const [tab, setTab] = useState('tasks')
  const [filter, setFilter] = useState('all')
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader
        eyebrow="Open questions · Round 25 · 2026-11-04"
        title="Float: the part’s size or the frame’s"
        lede="The float views miss the exploration where a shipped part has its own size. Each row shows the part as apps/float renders it beside a plain box at the frame’s size, with both numbers under them. Nothing changes until you rule on a row. The last section asks whether the Rails view stays one page or gets a board with every Rail state."
      />
      <DocSection id="stat-tiles" title="StatTiles float lg">
        <Row part={<div className="w-[1000px]"><StatTiles variant="float" size="lg" columns="grid-cols-4" items={TRAFFIC} /></div>}
          w={1000} h={132} shipped="143 tall" frame="132 tall" question={KEEP} />
      </DocSection>
      <DocSection id="tabs-row" title="TabsRow float">
        <Row part={<TabsRow variant="float" surface="solid" size="lg" value={tab} onChange={setTab} ariaLabel="Dashboard" tabs={TABS} />}
          w={774} h={48} shipped="hug, 719 wide" frame="fixed, 774 wide" question="Keep the tabs hugging their labels, or fix them to the frame’s width?" />
      </DocSection>
      <DocSection id="card-items" title="Card float, items under the head">
        <Row part={<div className="w-[640px]"><Card variant="float" title="Archive" count={2}><div className="flex gap-16 kol-float-body text-fg-64"><span>buy milk</span><span>call dentist</span></div></Card></div>}
          w={640} h={76} shipped="100 tall, items under the head" frame="76 tall, items inline" question="Keep the items under the head, or put them inline as the frame does?" />
      </DocSection>
      <DocSection id="link-add-row" title="LinkAddRow">
        <Row part={<div className="w-[640px]"><LinkAddRow variant="float" title="kol-vault" href="#" onAdd={noop} /></div>}
          w={640} h={126} shipped="106 tall" frame="126 tall" question={KEEP} />
      </DocSection>
      <DocSection id="quick-add" title="Quick add">
        <Row part={<div className="w-[640px]"><InlineAddRow variant="float" label="Quick add — e.g. “Lunch with Ada Friday 12pm”" onAdd={noop} /></div>}
          w={640} h={42} shipped="36 tall" frame="42 tall" question={KEEP} />
      </DocSection>
      <DocSection id="breadcrumb" title="Breadcrumb capsule">
        <Row part={<Breadcrumb items={['Workspace', 'Analytics', 'Overview']} />}
          w={274} h={44} shipped="48 tall" frame="44 tall" question={KEEP} />
      </DocSection>
      <DocSection id="new-task" title="New task Button">
        <Row part={<Button variant="float" tone="inverted" size="md" iconLeft="plus">New task</Button>}
          w={132} h={38} shipped="116 × 36" frame="132 × 38" question={KEEP} />
      </DocSection>
      <DocSection id="filter-capsule" title="Filter capsule">
        <Row part={<TabsRow variant="float" surface="solid" size="sm" tabs={FILTERS} value={filter} onChange={setFilter} ariaLabel="Task filters"
          trailing={<Button variant="float" tone="ghost" size="sm">Open only</Button>} />}
          w={706} h={40} shipped="540 × 36" frame="706 × 40" question={KEEP} />
      </DocSection>
      <DocSection id="index-row" title="IndexRow">
        <Row part={<div className="w-[640px]"><IndexRow title="Rename a card" onCheck={noop} onClick={noop}
          cells={[{ value: 'Todos', width: 120 }, { value: 'S', mono: true, width: 60 }, { value: 'Open', width: 60 }]} /></div>}
          w={640} h={32} shipped="28 tall" frame="32 tall" question={KEEP} />
      </DocSection>
      <DocSection id="type-roles" title="Type roles">
        <div className="flex flex-col gap-8">
          <Row part={<span className="kol-float-sheet text-fg-96">Dashboard</span>}
            w={400} h={44} shipped="kol-float-sheet, 38" frame="36, 40 and 44 across the frames" question="Keep 38, or take one of the frame’s sizes?" />
          <Row part={<span className="kol-float-window text-fg-96">Linked resources</span>}
            w={400} h={26} shipped="kol-float-window, 18" frame="20" question="Keep 18, or move to 20?" />
          <Row part={<div className="flex flex-col gap-2"><span className="kol-float-label text-fg-64">UNIQUE VISITORS</span><span className="kol-float-timecode text-fg-64">UNIQUE VISITORS</span></div>}
            w={400} h={40} shipped="Inter labels (kol-float-label)" frame="mono labels" question="Keep the labels in Inter, or set them in mono as the frame does?" />
        </div>
      </DocSection>
      <DocSection id="lang-mark" title="DocumentLangMark flag frame">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col gap-2"><DocumentLibrary library={LIBRARY} columns={['title', 'lang']} langMark="flags" /><span className="kol-mono-12 text-meta">shipped: 2px-rounded square</span></div>
            <div className="flex flex-col gap-2"><DocumentLibrary library={LIBRARY} columns={['title', 'lang']} langMark={roundFlag} /><span className="kol-mono-12 text-meta">round (rounded-full on the same Icon)</span></div>
          </div>
          <p className="kol-helper-14">Keep the square frame on the flags, or make them round?</p>
        </div>
      </DocSection>
      <DocSection id="rails" title="W7: the Rails view">
        <div className="flex flex-col gap-3">
          <p className="kol-helper-14">Built as drawn: one page, the nav Rail expanded and the bottom Rail (<a className="underline" href="/apps/float/#/views/rails">/apps/float/#/views/rails</a>). The alternative is every Rail state on one board.</p>
          <p className="kol-helper-14">Keep the one page, or add a board with every Rail state?</p>
        </div>
      </DocSection>
    </div>
  )
}
