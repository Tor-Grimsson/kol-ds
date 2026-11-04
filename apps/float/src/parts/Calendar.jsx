import { ThemeTile } from '@kolkrabbi/kol-styleguide'
import { useState } from 'react'
import {
  Button, CalendarDay, CalendarMonth, CalendarTimeline, CalendarWeek,
  ReadingActions, ReadingChapterNav, ReadingColumn, ReadingContents, ReadingHighlight, ReadingNotes, ReadingOverview, ReadingPanel, ReadingSettings,
} from '@kolkrabbi/kol-component'
import FamilyPage, { Part } from '../FamilyPage.jsx'

/* Calendar + reader (24-float-system.md § The parts, by family, row 11) — every part live from kol-component. */

const noop = () => {}
/* a calendar wider than a phone scrolls inside its Part, never the page */
const Wide = ({ min = 720, children }) => <div className="w-full overflow-x-auto"><div style={{ minWidth: min }}>{children}</div></div>

const TODAY = '2026-11-04'
const PHASES = [
  { label: 'Float set', start: '2026-01-01', end: '2026-12-31', emphasis: true },
  { label: 'Research', start: '2026-01-12', end: '2026-03-20' },
  { label: 'Exploration', start: '2026-03-02', end: '2026-06-15' },
  { label: 'Design system', start: '2026-05-04', end: '2026-10-30' },
  { label: 'Library', start: '2026-09-14', end: '2026-11-27' },
  { label: 'Launch', start: '2026-11-30', end: '2026-12-18' },
]
const MONTH_EVENTS = [
  { start: '2026-11-02', end: '2026-11-06', label: 'Float parts' },
  { start: '2026-11-05', label: 'Review' },
  { start: '2026-11-09', end: '2026-11-11', label: 'Library publish' },
  { start: '2026-11-18', end: '2026-11-24', label: 'Reading week' },
  { start: '2026-11-27', label: 'Ship' },
]
const WEEK_EVENTS = [
  { date: '2026-11-02', label: 'Plan the set', time: '09:30' },
  { date: '2026-11-04', label: 'Family pages', time: '10:00' },
  { date: '2026-11-04', label: 'Review', time: '15:00' },
  { date: '2026-11-06', label: 'Figma chapter', time: '11:00' },
]
const RUNNING = [
  { label: 'Float set', meta: 'W1 · PARTS PAGES', range: '02–08 NOV' },
  { label: 'Library', meta: 'W3 · FIGMA', range: '14 SEP – 27 NOV' },
]
const CHAPTERS = [
  { id: '01', label: 'First interlude' },
  { id: '02', label: 'Second interlude' },
  { id: '03', label: 'Third interlude' },
  { id: '04', label: 'Fourth interlude' },
  { id: '05', label: 'Fifth interlude' },
]
const FONTS = [{ value: 'literata', label: 'Literata' }, { value: 'georgia', label: 'Georgia' }, { value: 'inter', label: 'Inter' }]
const LEADINGS = ['1.4', '1.5', '1.6', '1.8'].map((v) => ({ value: v, label: `${v} ×` }))
const WIDTHS = ['640', '760', '880'].map((v) => ({ value: v, label: `${v} px` }))
const QUOTE = 'Attention is not always a matter of looking harder. Sometimes it is simply a willingness to remain.'

/* reading themes for ThemeTile, on the theme's own grounds and inks (no hex) */
const READING_THEMES = [
  { id: 'night', label: 'Night', bg: 'var(--kol-surface-inverse)', ink: 'var(--kol-surface-primary)' },
  { id: 'day', label: 'Day', bg: 'var(--kol-surface-primary)', ink: 'var(--kol-fg-emphasis)' },
  { id: 'grey', label: 'Grey', bg: 'var(--kol-surface-tertiary)', ink: 'var(--kol-fg-emphasis)' },
]

export default function Calendar() {
  const [chapter, setChapter] = useState('03')
  const [tab, setTab] = useState('notes')
  const [note, setNote] = useState('The intervals matter as much as the arrivals.')
  const [s, setS] = useState({ font: 'literata', size: 22, leading: '1.6', width: '760', flow: 'scroll' })
  const set = (k) => (v) => setS((o) => ({ ...o, [k]: v }))

  return (
    <FamilyPage title="Calendar + reader" body="The four calendars, and the reader — the column, its marks and actions, contents, the side panel and the book's overview.">
      {() => (
        <>
          <Part name="CalendarTimeline" slug="calendar-timeline">
            <Wide min={900}><CalendarTimeline year={2026} rows={PHASES} today={TODAY} /></Wide>
          </Part>

          <Part name="CalendarMonth" slug="calendar-month">
            <Wide><CalendarMonth month="2026-11" today={TODAY} events={MONTH_EVENTS} onSelect={noop} /></Wide>
          </Part>

          <Part name="CalendarWeek" slug="calendar-week">
            <Wide><CalendarWeek week={TODAY} today={TODAY} events={WEEK_EVENTS} running={RUNNING} onSelect={noop} /></Wide>
          </Part>

          <Part name="CalendarDay" slug="calendar-day">
            <div className="w-full max-w-[720px]">
              <CalendarDay allDay={[{ label: 'Float set · W1' }]} now="11:20"
                events={[{ start: '09:00', end: '10:30', label: 'Family pages' }, { start: '13:00', end: '14:00', label: 'Lunch' }, { start: '15:00', end: '16:30', label: 'Review' }]} />
            </div>
          </Part>

          <Part name="ReadingColumn" slug="reading-column">
            <Wide min={760}>
              <ReadingColumn position="The Waves / Interlude 03" page="125 / 297" eyebrow="THIRD INTERLUDE" title="The light, held"
                standfirst="On attention, and what it takes to stay."
                prev={{ title: 'Second interlude', onClick: noop }} next={{ title: 'Fourth interlude', onClick: noop }}>
                <p>The sun had risen higher. Blue waves, green waves swept a quick fan over the beach, circling the spike of sea-holly and leaving shallow pools of light here and there on the sand.</p>
                <ReadingHighlight note={1}>{QUOTE}</ReadingHighlight>
                <p>A faint black rim was left behind them. The rocks which had been misty and soft hardened and were marked with red clefts.</p>
              </ReadingColumn>
            </Wide>
          </Part>

          <Part name="ReadingHighlight" slug="reading-highlight">
            <div className="w-full max-w-[640px]"><ReadingHighlight note={1} onClick={noop}>{QUOTE}</ReadingHighlight></div>
          </Part>

          <Part name="ReadingActions" slug="reading-actions">
            <ReadingActions onAction={noop} onMore={noop} />
          </Part>

          <Part name="ReadingChapterNav" slug="reading-chapter-nav">
            <div className="w-full max-w-[760px]">
              <ReadingChapterNav prev={{ title: 'Second interlude', onClick: noop }} next={{ title: 'Fourth interlude', onClick: noop }} />
            </div>
          </Part>

          <Part name="ReadingContents" slug="reading-contents">
            <ReadingContents book="The Waves" author="Virginia Woolf" count="9 interludes" chapters={CHAPTERS} current={chapter} onSelect={setChapter}
              progress={42} status="Reading position saved" onFold={noop} className="max-w-full" />
          </Part>

          <Part name="ReadingPanel" slug="reading-panel">
            <ReadingPanel tab={tab} onTab={setTab} onFold={noop} className="max-w-full">
              {tab === 'notes' ? (
                <ReadingNotes quote={QUOTE} location="Third interlude · Page 125" note={note} onNoteChange={setNote} status="All changes saved"
                  onView={noop} onRemove={noop} footer="Note 1 / Page 125" />
              ) : (
                <ReadingSettings themes={READING_THEMES.map((t) => <ThemeTile key={t.id} label={t.label} bg={t.bg} ink={t.ink} selected={t.id === 'night'} />)} font={s.font} fonts={FONTS} onFont={set('font')} size={s.size} onSize={set('size')}
                  leading={s.leading} leadings={LEADINGS} onLeading={set('leading')} width={s.width} widths={WIDTHS} onWidth={set('width')}
                  flow={s.flow} onFlow={set('flow')} onReset={noop} />
              )}
            </ReadingPanel>
          </Part>

          <Part name="ReadingOverview" slug="reading-overview">
            <ReadingOverview onBack={noop} title="The Waves" author="Virginia Woolf" meta={['Fiction', 'EPUB', 'Reading']}
              cover={<img src={`${import.meta.env.BASE_URL}images/stack-hero-1600.jpg`} alt="" className="size-full object-cover" />}
              description="Six voices, from childhood to age, between interludes of the sun crossing the sea."
              place={{ title: 'Third interlude', line: 'Page 125 of 297', progress: 42 }} onResume={noop} onCollect={noop} />
          </Part>
        </>
      )}
    </FamilyPage>
  )
}
