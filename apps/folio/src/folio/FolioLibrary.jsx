/* Folio — My library (Figma 228:13254) */
import { Link } from 'react-router-dom'
import { FolioFrame, Wordmark, Profile, Action, Icon, Jacket, ContinueCard, BOOKS, IN_PROGRESS, LABEL, SECTION } from './parts'

const NAV = [['My library', '/mockups'], ['Collections'], ['Highlights'], ['Reading journal', '/mockups/article']]
const TABS = [['All books', 48], ['Reading', 2], ['Unread', 28], ['Finished', 18]]
const VOLUMES = [['#a9c3d9', 52], ['#d9806b', 61], ['#e9cb7e', 70], ['#c5b7d5', 79]]
const COLS = [['AUTHOR', 'w-[195px]'], ['GENRE', 'w-[100px]'], ['FORMAT', 'w-[76px]'], ['READING STATUS', 'w-[142px]'], ['DATE ADDED ↓', 'w-[104px]']]
const PAGES = ['1', '2', '3', '…', '8']

function Heading({ n, title, sub, className = 'items-baseline' }) {
  return (
    <div className={`flex gap-[18px] whitespace-nowrap ${className}`}>
      <p className={`${LABEL} text-folio-muted`}>{n}</p>
      <p className={SECTION}>{title}</p>
      {sub && <p className="text-[11px] text-folio-muted">{sub}</p>}
    </div>
  )
}

function Masthead() {
  return (
    <header className="flex h-[88px] items-center justify-between border-b border-folio-ink px-[56px]">
      <Wordmark />
      <nav className="flex items-center gap-[30px] text-[13px]">
        {NAV.map(([label, to], i) => {
          const cls = i === 0 ? 'rounded-[3px] bg-folio-mint px-[16px] py-[12px] font-bold' : 'py-[12px] font-medium text-folio-muted'
          return to ? <Link key={label} to={to} className={cls}>{label}</Link> : <span key={label} className={cls}>{label}</span>
        })}
      </nav>
      <div className="flex items-center gap-[16px]">
        <Icon name="cloud-gear" />
        <p className="text-[11px] text-folio-muted">All changes saved</p>
        <Profile />
      </div>
    </header>
  )
}

function Introduction() {
  return (
    <div className="flex items-end gap-[32px] px-[56px] pb-[32px] pt-[36px]">
      <div className="flex min-w-0 flex-1 flex-col gap-[12px]">
        <p className={`${LABEL} text-folio-muted`}>YOUR OWN LITTLE WORLD</p>
        <h1 className="text-[72px] font-bold leading-none tracking-[-3.4px]">My library</h1>
        <p className="text-[13px] text-folio-muted">Old favorites, new discoveries, and the next good chapter.</p>
      </div>
      <div className="flex w-[360px] items-end gap-[28px] pb-[4px]">
        <div className="flex h-[79px] w-[170px] items-end gap-[8px]">
          {VOLUMES.map(([bg, h]) => (
            <div key={bg} className="flex w-[36px] flex-col gap-[10px] pt-[18px]" style={{ background: bg, height: h }}>
              <div className="h-[12px] bg-[#eeeadc]" />
              <div className="h-[8px] bg-[#eeeadc]" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-[6px] whitespace-nowrap">
          <p className="text-[56px] font-bold leading-none tracking-[-2.5px]">48</p>
          <p className="text-[11px] text-folio-muted">books &amp; counting</p>
        </div>
      </div>
    </div>
  )
}

function Controls() {
  return (
    <div className="flex flex-col gap-[22px] px-[56px]">
      <div className="flex items-center gap-[12px]">
        <label className="flex h-[44px] min-w-0 flex-1 items-center gap-[12px] rounded-[3px] border border-folio-rule bg-folio-paper px-[14px]">
          <Icon name="search" size={18} />
          <input placeholder="Search by title, author, or keyword" className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-folio-muted" />
          <span className="text-[11px] text-folio-muted">⌘ K</span>
        </label>
        <Action glyph="⌄">All genres</Action>
        <Action glyph="⌄">All collections</Action>
        <Action glyph="+" primary>Add a book</Action>
      </div>
      <div className="flex items-center justify-between whitespace-nowrap border-b border-folio-rule">
        <div className="flex gap-[32px]">
          {TABS.map(([label, n], i) => (
            <button key={label} type="button" className={`-mb-px flex items-start gap-[10px] pb-[16px] ${i === 0 ? 'shadow-[inset_0_-3px_0_var(--color-folio-ink)]' : 'text-folio-muted'}`}>
              <span className={`text-[12px] ${i === 0 ? 'font-bold' : 'font-medium'}`}>{label}</span>
              <span className={`text-[10px] ${i === 0 ? 'text-folio-muted' : ''}`}>{n}</span>
            </button>
          ))}
        </div>
        <p className="text-[11px] text-folio-muted">A shelf that’s entirely yours.</p>
      </div>
    </div>
  )
}

function Shelf() {
  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex items-center justify-between">
        <Heading n="02" title="Fresh on your shelf" sub="A few new worlds to get lost in." />
        <div className="flex items-center gap-[12px]">
          <p className="text-[11px] text-folio-muted">01 / 08</p>
          <button type="button" aria-label="Previous shelf" className="flex size-[32px] items-center justify-center border border-folio-rule"><Icon name="arrow-left" /></button>
          <button type="button" aria-label="Next shelf" className="flex size-[32px] items-center justify-center border border-folio-rule"><Icon name="arrow-right" /></button>
        </div>
      </div>
      <div className="flex gap-[24px]">
        {BOOKS.map(book => (
          <div key={book.title} className="flex min-w-0 flex-1 flex-col gap-[12px]">
            <Jacket book={book} width={201.33} />
            <div className="flex flex-col gap-[6px]">
              <p className="min-h-[38px] text-[16px] font-bold leading-[1.2] tracking-[-0.3px]">{book.title}</p>
              <p className="text-[11px] text-folio-muted">{book.author}</p>
              <p className="text-[10px] text-folio-muted">{book.genre}, EPUB</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Catalog() {
  return (
    <div className="flex flex-col gap-[22px] px-[56px] pb-[30px]">
      <div className="flex items-center justify-between border-t border-folio-ink pt-[27px]">
        <Heading n="03" title="All books" sub="48 titles" />
        <div className="flex items-center gap-[14px]">
          <p className={`${LABEL} text-folio-muted`}>SORT BY</p>
          <Action glyph="⌄">Recently added</Action>
          <div className="flex gap-[4px] border border-folio-rule p-[4px] text-[15px]">
            <button type="button" aria-label="List view" className="bg-folio-mint p-[7px] text-folio-green">☰</button>
            <button type="button" aria-label="Grid view" className="p-[7px] text-folio-muted">▦</button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex h-[34px] items-center gap-[20px] border-b-2 border-folio-ink text-[10px] font-semibold text-folio-muted">
          <span className="size-[14px] shrink-0 border border-folio-rule" />
          <p className="min-w-0 flex-1">TITLE</p>
          {COLS.map(([label, w]) => <p key={label} className={`shrink-0 ${w}`}>{label}</p>)}
          <span className="w-[18px] shrink-0" />
        </div>
        {BOOKS.map(book => (
          <div key={book.title} className="flex h-[70px] items-center gap-[20px] border-b border-folio-rule">
            <span className="size-[14px] shrink-0 border border-folio-rule" />
            <div className="flex min-w-0 flex-1 items-center gap-[16px]">
              <Jacket book={book} width={28} />
              <p className="min-w-0 flex-1 text-[14px] font-semibold">{book.title}</p>
            </div>
            <p className="w-[195px] shrink-0 text-[11px]">{book.author}</p>
            <p className="w-[100px] shrink-0 text-[11px] text-folio-muted">{book.genre}</p>
            <p className="w-[76px] shrink-0 text-[10px] text-folio-muted">EPUB</p>
            <div className="flex w-[142px] shrink-0">
              {book.reading
                ? <p className="rounded-[3px] bg-folio-mint px-[8px] py-[6px] text-[10px] font-semibold text-folio-green">{book.status}</p>
                : <p className={`rounded-[3px] bg-folio-surface py-[6px] text-[10px] text-folio-muted ${book.status === 'Unread' ? '' : 'px-[8px]'}`}>{book.status}</p>}
            </div>
            <p className="w-[104px] shrink-0 text-[10px] text-folio-muted">{book.added}</p>
            <button type="button" aria-label="Book options" className="shrink-0"><Icon name="more-circle" size={18} /></button>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-folio-muted">Showing 1–6 of 48 books</p>
        <div className="flex items-center gap-[18px] text-[11px]">
          <p className="text-folio-muted">← Previous</p>
          {PAGES.map((p, i) => (
            <button key={p} type="button" className={`flex size-[30px] items-center justify-center ${i === 0 ? 'bg-folio-mint font-bold' : 'bg-folio-paper'}`}>{p}</button>
          ))}
          <p className="font-semibold">Next →</p>
        </div>
      </div>
      <footer className="flex items-start justify-between whitespace-nowrap border-t border-folio-rule pt-[23px] text-folio-muted">
        <p className="text-[13px] font-medium">A good book is a place to begin again.</p>
        <p className={LABEL}>YOUR LIBRARY. YOUR PACE.</p>
      </footer>
    </div>
  )
}

export default function FolioLibrary() {
  return (
    <FolioFrame>
      <Masthead />
      <Introduction />
      <Controls />
      <div className="flex flex-col gap-[36px] px-[56px] py-[32px]">
        <div className="flex flex-col gap-[18px]">
          <div className="flex items-baseline justify-between whitespace-nowrap">
            <Heading n="01" title="Pick up where you left off" />
            <p className="text-[11px] text-folio-muted">2 books in progress</p>
          </div>
          <div className="flex gap-[24px]">
            {IN_PROGRESS.map(p => <ContinueCard key={p.book.title} {...p} />)}
          </div>
        </div>
        <Shelf />
      </div>
      <Catalog />
    </FolioFrame>
  )
}
