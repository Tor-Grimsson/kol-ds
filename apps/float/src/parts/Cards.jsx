import { useState } from 'react'
import { MenuMore } from '@kolkrabbi/kol-component'
import {
  AssetRow, CaptureCard, Card, ContinueCard, CoverTile, FloatCard, FoldedHead, KanbanColumn, LinkCard, LiveCard, NoteCard,
  PositionBlock, ProjectCard, SectionHead, SourceCard, StatTiles, TaskCard,
} from '@kolkrabbi/kol-dashboards'
import FamilyPage, { Part } from '../FamilyPage.jsx'

/* float-set W1 — the Cards + tiles family (24-float-system.md § The parts, by family, row 7). Every part live from
 * kol-dashboards 0.10.0. The cards take no surface prop — they sit on the page's ground as they are.
 * GroupCard and CollapsedGroup are not exports: per 09-dashboards-system.md they are `Card variant="float"` (the group
 * sheet) and the same card `folded` (the collapsed group). */
const noop = () => {}
/* the part's showcase component page — relative, so it resolves on ui.kolkrabbi.io and inside the showcase's Float set */
/* the sample picture — the app's one image stands in for captures, covers and thumbnails */
const IMG = `${import.meta.env.BASE_URL}images/stack-hero-800.jpg`

const spark = [320, 340, 310, 360, 420, 380, 400, 470, 430, 520, 480, 510, 600, 560, 620, 700, 650, 680, 720, 690, 760, 740, 800, 780, 860, 820, 900, 940, 880, 1036]
const TRAFFIC = [
  { key: 'visitors', label: 'Unique visitors', value: '12,864', delta: '↗ 19.8%', note: 'from 10,740', spark },
  { key: 'pageviews', label: 'Pageviews', value: '1,036', note: 'Last 30 days', spark: spark.map((v, i) => v * (1 + Math.sin(i) * 0.3)) },
]
const SMALL = [
  { key: 'repo', label: 'Repository views', value: '6,180', note: '15–28 Oct · 14 days' },
  { key: 'clones', label: 'Clones', value: '212', note: '15–28 Oct · 14 days' },
]
const ASSETS = [
  { key: 'a', name: 'Luminous portrait', meta: '1200 × 1500 · PNG' },
  { key: 'b', name: 'Studio wall, north', meta: '4000 × 3000 · JPG' },
  { key: 'c', name: 'Wordmark, black', meta: '512 × 128 · SVG' },
]
const more = <MenuMore label="Sort" minWidth={200} items={[{ heading: 'Sort by' }, { key: 'count', label: 'Count', checked: true }, { key: 'name', label: 'Name' }]} />

export default function Cards() {
  const [folded, setFolded] = useState(false)
  const [headFolded, setHeadFolded] = useState(false)
  const [done, setDone] = useState(false)
  const [taskSel, setTaskSel] = useState(true)
  const [asset, setAsset] = useState('a')
  return (
    <FamilyPage title="Cards + tiles" body="The float sheet, the stat tiles and every card kind the dashboards and the reader hold.">
      {() => (
        <>
          <Part name="Card float" slug="card">
            <div className="w-[640px] max-w-full">
              <Card variant="float" title="Briefs" count="1 open" controls={more} addLabel="New brief" onAdd={noop}>
                <TaskCard size="sm" title="Design the Tasks tab (Briefs / Todos / Other)" date="2026-07-01" done={done} onToggle={setDone} />
              </Card>
            </div>
          </Part>
          <Part name="StatTiles float" slug="stat-tiles"><div className="w-[880px] max-w-full"><StatTiles variant="float" size="lg" items={TRAFFIC} /></div></Part>
          <Part name="the small metric tile" slug="stat-tiles"><div className="w-[880px] max-w-full"><StatTiles variant="float" size="sm" items={SMALL} /></div></Part>
          <Part name="FloatCard" slug="float-card">
            <div className="w-[220px]">
              <FloatCard title="01 / Chrome" support="Pills · rail · transport" lines={['Background blur / 24 px', 'Edge / 1 px white 12%', 'Shadow / 0 8 24 −8', 'Black / 25%']} />
            </div>
          </Part>
          <Part name="SectionHead" slug="section-head">
            <div className="w-[608px] max-w-full flex flex-col gap-4 bg-surface-secondary rounded-[var(--kol-float-menu-r)] p-5">
              <SectionHead title="Briefs" count={1} folded={headFolded} onFold={() => setHeadFolded((f) => !f)} />
              <SectionHead title="Pageviews" meta="Last 30 days" value="1,036" />
            </div>
          </Part>
          <Part name="GroupCard" slug="card">
            <div className="w-[640px] max-w-full">
              <Card variant="float" title="Todos" count="2 open" folded={folded} onFold={() => setFolded((f) => !f)} addLabel="New todo" onAdd={noop}>
                <TaskCard size="sm" title="Wire the capture inbox" date="2026-07-04" done={false} onToggle={noop} />
                <TaskCard size="sm" title="Rename a card" chip="S" done={false} onToggle={noop} />
              </Card>
            </div>
          </Part>
          <Part name="FoldedHead" slug="folded-head">
            <div className="flex flex-col gap-2 w-[220px]">
              <FoldedHead title="Briefs" count={1} onClick={noop} />
              <FoldedHead title="Todos" count={4} onClick={noop} />
              <FoldedHead title="Other" onClick={noop} />
            </div>
          </Part>
          <Part name="SourceCard" slug="source-card">
            <SourceCard className="w-[312px] max-w-full" code="#KOL-OB" title="Obsidian" status="Needs attention" message="Unable to load captures." detail="The source returned an unexpected response (JSON parse error)." action="Retry" onAction={noop} />
            <SourceCard className="w-[312px] max-w-full" code="#KOL-GH" title="GitHub" status="Synced 4 min ago" />
          </Part>
          <Part name="CaptureCard" slug="capture-card">
            <div className="w-[296px] max-w-full"><CaptureCard src={IMG} title="#kol-ob bingo" meta="124d" onNext={noop} onOpen={noop} /></div>
            <div className="w-[296px] max-w-full"><CaptureCard title="Float studies — read the glass recipe again" meta="2d" onPrev={noop} onNext={noop} action="Archive" onAction={noop} /></div>
          </Part>
          <Part name="KanbanColumn" slug="kanban-column">
            <KanbanColumn className="w-[320px] max-w-full" title="Lobby" count={1}>
              <CaptureCard src={IMG} title="#kol-ob bingo" meta="124d" onNext={noop} />
            </KanbanColumn>
            <KanbanColumn className="w-[320px] max-w-full" title="In review" count={0} />
          </Part>
          <Part name="ProjectCard" slug="project-card">
            <div className="w-[656px] max-w-full">
              <ProjectCard eyebrow="Repo" status="Active" title="kol-studio" description="Local-only studio dashboard. Home of this board."
                progress={{ label: 'Completion', pct: 50, note: '1 / 2 done' }} action="Details" onAction={noop} />
            </div>
          </Part>
          <Part name="LinkCard" slug="link-card">
            <div className="flex flex-col gap-2 w-[400px] max-w-full">
              <LinkCard title="kolkrabbi.io" meta="Studio site" href="https://kolkrabbi.io" />
              <LinkCard title="ui.kolkrabbi.io" meta="Design system" href="https://ui.kolkrabbi.io" />
            </div>
          </Part>
          <Part name="CollapsedGroup" slug="card">
            <div className="w-[640px] max-w-full"><Card variant="float" title="Profiles" count="3" folded onFold={noop} /></div>
          </Part>
          <Part name="CoverTile" slug="cover-tile">
            <CoverTile src={IMG} title="The Waves" author="Virginia Woolf" width={160} onClick={noop} />
            <CoverTile src={IMG} title="Orlando" author="Virginia Woolf" width={160} onClick={noop} />
          </Part>
          <Part name="ContinueCard" slug="continue-card">
            <div className="w-[624px] max-w-full">
              <ContinueCard src={IMG} eyebrow="The third interlude" title="The Waves" author="Virginia Woolf" page="Page 125 of 297" pct={42} onResume={noop} lastRead="Last read 2 hours ago" />
            </div>
          </Part>
          <Part name="AssetRow" slug="asset-row">
            <div className="flex flex-col gap-3 w-[320px] max-w-full">
              {ASSETS.map((a) => <AssetRow key={a.key} src={IMG} name={a.name} meta={a.meta} selected={asset === a.key} onSelect={() => setAsset(a.key)} />)}
            </div>
          </Part>
          <Part name="LiveCard" slug="live-card">
            <div className="w-[284px] max-w-full">
              <LiveCard value="8" unit="active visitors" peak="18 Oct · Traffic peak" insight="910 visitors after the toolbox release." note="2.0× the daily average of 459 visitors." />
            </div>
          </Part>
          <Part name="TaskCard" slug="task-card">
            <div className="w-[940px] max-w-full bg-surface-secondary rounded-[var(--kol-float-menu-r)] p-2">
              <TaskCard title="Design the Tasks tab (Briefs / Todos / Other)" group="Brief" date="2026-07-01" done={done} onToggle={setDone} selected={taskSel} onClick={() => setTaskSel((s) => !s)} />
            </div>
          </Part>
          <Part name="NoteCard" slug="note-card">
            <div className="w-[400px] max-w-full">
              <NoteCard eyebrow="Reading note / Page 125" onClick={noop}>The intervals matter as much as the arrivals. A thought to take into the next chapter.</NoteCard>
            </div>
          </Part>
          <Part name="PositionBlock" slug="position-block">
            <div className="w-[920px] max-w-full"><PositionBlock title="The third interlude" page="Page 125 of 297" pct={42} onClick={noop} /></div>
          </Part>
        </>
      )}
    </FamilyPage>
  )
}
