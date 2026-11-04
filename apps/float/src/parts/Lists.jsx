import { useState } from 'react'
import { ContentRow, DocsToc, FlyoutRow, IndexRow, LayerRow, Pill, SpecList, Table, TaskRow, TocRow, TreeRow } from '@kolkrabbi/kol-component'
import { RankedList } from '@kolkrabbi/kol-dashboards'
import FamilyPage, { Part } from '../FamilyPage.jsx'

/* float-set W1 — the Lists + tables family (24-float-system.md § The parts, by family, row 8). Every part live from
 * kol-component 0.335.0, RankedList float from kol-dashboards 0.10.0. None takes a surface prop. */
const noop = () => {}
/* the part's showcase component page — relative, so it resolves on ui.kolkrabbi.io and inside the showcase's Float set */
const Wide = ({ children }) => <div className="w-full min-w-0 overflow-x-auto">{children}</div>
const IMG = `${import.meta.env.BASE_URL}images/stack-hero-400.jpg`

const REF = [['Direct / none', '5,280', '41.0%'], ['Google', '3,410', '26.5%'], ['github.com', '2,136', '16.6%'], ['Are.na', '1,158', '9.0%'], ['Other sources', '880', '6.8%']]
  .map(([referrer, visitors, share], id) => ({ id, referrer, visitors, share }))
const BOOKS = [
  ['The Waves', 'Virginia Woolf', 'Fiction', 'Reading · 42%', 'Today'],
  ['A Room of One’s Own', 'Virginia Woolf', 'Essays', 'Reading · 18%', 'Today'],
  ['The Garden Party', 'Katherine Mansfield', 'Fiction', 'Unread', 'Oct 29, 2026'],
  ['The Metamorphosis', 'Franz Kafka', 'Fiction', 'Finished', 'Oct 27, 2026'],
].map(([title, author, genre, status, added], id) => ({ id, title, author, genre, format: 'EPUB', status, added }))
const TOC = [
  { id: 'float-lists-overview', label: 'Overview' },
  { id: 'float-lists-anatomy', label: 'Anatomy' },
  { id: 'float-lists-props', label: 'Props', children: [{ id: 'float-lists-props-toc', label: 'toc' }, { id: 'float-lists-props-variant', label: 'variant' }] },
  { id: 'float-lists-theming', label: 'Theming' },
]
const CHAPTERS = ['First interlude', 'The sun rises', 'Second interlude', 'Bernard']
const BOOK = [
  { label: 'Author', value: 'Virginia Woolf' }, { label: 'Genre', value: 'Fiction' }, { label: 'Format', value: 'EPUB' },
  { label: 'Length', value: '297 pages' }, { label: 'Status', value: 'Reading · 42%' },
]
const INDEX = [
  { id: 'a', title: 'Design the Tasks tab (Briefs / Todos / Other)', cells: ['Briefs', { value: '—', mono: true }, 'Open'] },
  { id: 'b', title: 'Wire the capture inbox', cells: ['Todos', { value: '2026-07-04', mono: true }, 'Open'] },
]
const LINKS = [
  { label: 'kolkrabbi.io/work', value: 412, prev: 380 },
  { label: 'kolkrabbi.io/foundry/typefaces/malromur', value: 268, prev: 301 },
  { label: 'ui.kolkrabbi.io', value: 143, prev: 143 },
  { label: 'Instagram profile', value: 96, prev: 40 },
]

export default function Lists() {
  const [at, setAt] = useState(0)
  const [checks, setChecks] = useState({})
  const [sel, setSel] = useState('a')
  const [taskDone, setTaskDone] = useState(false)
  const [layers, setLayers] = useState([
    { id: 'orbit', name: 'Orbit field', icon: 'circles-three', visible: true, locked: false },
    { id: 'glow', name: 'Soft glow', icon: 'drop-circle', visible: false, locked: false },
    { id: 'bg', name: 'Background', icon: 'layers', visible: true, locked: true },
  ])
  const [layer, setLayer] = useState('orbit')
  const flip = (id, k) => setLayers((ls) => ls.map((l) => (l.id === id ? { ...l, [k]: !l[k] } : l)))
  const [open, setOpen] = useState(true)
  return (
    <FamilyPage title="Lists + tables" body="Tables, contents, link rows, spec sheets and the rows every float list is built from.">
      {() => (
        <>
          <Part name="Table float" slug="table">
            <Wide>
              <div className="flex flex-col gap-10">
                <Table variant="float" caption="Referrers" width="column" className="max-w-[620px]" rows={REF} columns={[
                  { accessor: 'referrer', header: 'Referrer', style: { width: '70%' } },
                  { accessor: 'visitors', header: 'Visitors', align: 'right' },
                  { accessor: 'share', header: 'Share', align: 'right' },
                ]} />
                <Table variant="float" framed caption="Books" width="column" className="max-w-[940px]" rows={BOOKS} columns={[
                  { accessor: 'title', header: 'Title', sans: true, sortable: true, render: (r) => (
                    <span className="inline-flex items-center gap-3"><img src={IMG} alt="" className="h-6 w-[18px] shrink-0 rounded-[2px] object-cover" />{r.title}</span>
                  ) },
                  { accessor: 'author', header: 'Author', sans: true },
                  { accessor: 'genre', header: 'Genre', sans: true },
                  { accessor: 'format', header: 'Format' },
                  { accessor: 'status', header: 'Reading status', render: (r) => <Pill variant="float">{r.status}</Pill> },
                  { accessor: 'added', header: 'Date added', sans: true, sortable: true },
                ]} />
              </div>
            </Wide>
          </Part>
          <Part name="DocsToc float + TocRow" slug="docs-toc">
            <div className="w-[280px] max-w-full"><DocsToc toc={TOC} variant="float" /></div>
            <div className="flex w-[480px] max-w-full flex-col gap-0.5">
              {CHAPTERS.map((c, i) => <TocRow key={c} number={i + 1} label={c} current={at === i} onClick={() => setAt(i)} />)}
            </div>
          </Part>
          <Part name="ContentRow float" slug="content-row">
            <div className="flex w-[848px] max-w-full flex-col gap-2">
              <ContentRow variant="float" title="Instagram · @kolkrabbi_" url="www.instagram.com/kolkrabbi_" href="https://www.instagram.com/kolkrabbi_" />
              <ContentRow variant="float" title="Are.na · Float studies" url="www.are.na/kolkrabbi/float" href="https://www.are.na/kolkrabbi/float" />
            </div>
          </Part>
          <Part name="SpecList float" slug="spec-list"><div className="w-[400px] max-w-full"><SpecList variant="float" title="Book information" items={BOOK} /></div></Part>
          <Part name="IndexRow" slug="index-row">
            <Wide>
              <div className="flex w-[940px] max-w-full min-w-[560px] flex-col gap-1">
                {INDEX.map((r) => (
                  <IndexRow key={r.id} title={r.title} cells={r.cells} selected={sel === r.id} onClick={() => setSel(r.id)}
                    checked={!!checks[r.id]} onCheck={(v) => setChecks((d) => ({ ...d, [r.id]: v }))} />
                ))}
              </div>
            </Wide>
          </Part>
          <Part name="TaskRow" slug="task-row">
            <div className="flex w-[940px] max-w-full flex-col gap-3 rounded-[var(--kol-float-menu-r)] bg-surface-secondary p-6">
              <TaskRow title="Design the Tasks tab (Briefs / Todos / Other)" date="2026-07-01" done={taskDone} onDone={setTaskDone} onDate={noop} />
              <TaskRow title="Wire the capture inbox" date="2026-07-04" done={false} onDone={noop} onDate={noop} />
            </div>
          </Part>
          <Part name="LayerRow" slug="layer-row">
            <div className="flex w-[268px] flex-col gap-1">
              {layers.map((l) => (
                <LayerRow key={l.id} icon={l.icon} name={l.name} selected={layer === l.id} onClick={() => setLayer(l.id)}
                  visible={l.visible} onToggleVisible={() => flip(l.id, 'visible')} locked={l.locked} onToggleLock={() => flip(l.id, 'locked')} />
              ))}
            </div>
          </Part>
          <Part name="TreeRow" slug="tree-row">
            <div className="flex w-[256px] flex-col gap-1">
              <TreeRow icon="home-01" label="Home" onClick={noop} />
              <TreeRow icon="grid" label="Dashboard" expanded={open} onToggle={() => setOpen((v) => !v)} open={open} />
              {open && <TreeRow depth={1} icon="checklist" label="Tasks" count={5} active onClick={noop} />}
              {open && <TreeRow depth={1} icon="folder" label="Projects" onClick={noop} />}
            </div>
          </Part>
          <Part name="FlyoutRow" slug="flyout-row">
            <div className="flex w-[284px] max-w-full flex-col gap-1">
              <FlyoutRow icon="checklist" label="Tasks" count={5} active onClick={noop} />
              <FlyoutRow icon="inbox" label="Capture" count={3} onClick={noop} />
              <FlyoutRow icon="folder" label="Projects" onClick={noop} />
            </div>
          </Part>
          <Part name="RankedList float" slug="ranked-list">
            <div className="w-[560px] max-w-full bg-surface-secondary rounded-[var(--kol-float-menu-r)] px-5 pb-5 pt-1 flex flex-col">
              <RankedList variant="float" rows={LINKS} total={931} column="Link" valueLabel="Clicks" onPick={noop} />
            </div>
          </Part>
        </>
      )}
    </FamilyPage>
  )
}
