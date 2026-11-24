/* Folio — My library on the real Library (/demo-4). The look is /demo-3 (Figma 228:13254); the books are the catalogue's
   (shelf.js · catalogue.js): documents folded into books, titled by shelf, duplicates once. */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button, ContentCard, Dropdown, Input, SectionText, Table } from '@kolkrabbi/kol-component'
import { Icon, Jacket } from './parts'
import { VOLUMES, SHELVES, SUBSHELVES, DOCS } from './shelf'
import { fmtDate } from '../lib/catalogue'
import { Frame, Masthead, SearchOverlay, useSearchKey, Flags, searchDocs, Marked } from './Chrome'
import { useSettings, ago } from './settings'

const VOLUMES_ART = [['#a9c3d9', 52], ['#d9806b', 61], ['#e9cb7e', 70], ['#c5b7d5', 79]]
const FRESH = 6
const PER_PAGE = 12
const SORTS = { call: 'Call number', newest: 'Newest first', title: 'Title A–Z' }
const SORT = {
  call: (a, b) => a.sortKey.localeCompare(b.sortKey),
  newest: (a, b) => (b.date || '').localeCompare(a.date || ''),
  title: (a, b) => a.title.localeCompare(b.title),
}
const DOC_BY_KEY = Object.fromEntries(DOCS.map((d) => [d.key, d]))

/* the table of books' columns (KOL's Table variant="folio", Folio batch E): each cell drawn whole, its width with it */
const COLUMNS = (terms) => [
  { header: 'Title', render: (book) => (
    <div className="flex min-w-0 flex-1 items-center gap-[16px]">
      <Cover book={book} width={28} />
      <p className="kol-folio-row min-w-0 flex-1 truncate group-hover:underline"><Marked text={book.title} terms={terms} /></p>
      {book.chapters.length > 1 && <span className="kol-folio-meta-sm shrink-0 rounded-[3px] bg-folio-surface px-[8px] py-[5px] text-folio-muted group-hover:bg-folio-paper">{book.chapters.length} chapters</span>}
    </div>
  ) },
  { header: 'Call number', width: 195, render: (book) => <p className="kol-folio-meta w-[195px] shrink-0 truncate tabular-nums">{book.call}</p> },
  { header: 'Shelf', width: 110, render: (book) => <p className="kol-folio-meta w-[110px] shrink-0 truncate text-folio-muted">{book.subLabel ?? book.shelfLabel}</p> },
  { header: 'Language', width: 76, render: (book) => <p className="w-[76px] shrink-0"><Flags langs={book.langs} /></p> },
  { header: 'Origin', width: 142, render: (book) => (
    <div className="flex w-[142px] shrink-0">
      {book.origin
        ? <p className="kol-folio-meta-sm rounded-[3px] bg-folio-mint px-[8px] py-[6px] font-semibold text-folio-green">{book.origin}</p>
        : <p className="kol-folio-meta-sm text-folio-muted">—</p>}
    </div>
  ) },
  { header: 'Date', width: 104, render: (book) => <p className="kol-folio-meta-sm w-[104px] shrink-0 tabular-nums text-folio-muted">{book.date ? (book.first && book.first.slice(0, 4) !== book.date.slice(0, 4) ? `${book.first.slice(0, 4)}–${book.date.slice(0, 4)}` : fmtDate(book.date)) : 'n.d.'}</p> },
]

/* every cover is a generated jacket — scans and media thumbnails are never covers (user, 2026-11-04) */
export function Cover({ book, width }) {
  return <Jacket book={book} width={width} />
}

/* a numbered section head: KOL's SectionText variant="folio", inline (Folio batch E) */
const Heading = ({ n, title, sub }) => <SectionText variant="folio" inline eyebrow={n} headline={title} headlineSize="section" headlineAs="h2" meta={sub} gap="gap-[18px]" />

/* the pager's arrow: Button kolbox (plan-2026-11-23 W8.2) */
const SquareButton = ({ label, icon, onClick, disabled }) => (
  <Button variant="kolbox" iconOnly={icon} aria-label={label} onClick={onClick} disabled={disabled} />
)

/* W10 — the two most recent unfinished documents, from what this browser has read */
function useContinue() {
  const { reading } = useSettings()
  return Object.entries(reading)
    .filter(([key, r]) => DOC_BY_KEY[key] && r.pct < 95)
    .sort((a, b) => b[1].at - a[1].at)
    .slice(0, 2)
    .map(([key, r]) => ({ doc: DOC_BY_KEY[key], ...r }))
}

function ContinueCard({ doc, pct, at }) {
  const book = doc.book
  return (
    <div className="flex min-w-0 flex-1 items-center gap-[24px] border-t border-folio-rule bg-folio-surface px-[20px] pb-[20px] pt-[19px]">
      <Link to={doc.href} aria-hidden tabIndex={-1}><Cover book={book} width={94} /></Link>
      <div className="flex min-w-0 flex-1 flex-col gap-[9px]">
        <p className="kol-folio-label truncate text-folio-muted">{book.chapters.length > 1 ? doc.chapter : book.shelfLabel}</p>
        <p className="kol-folio-book truncate">{book.title}</p>
        <p className="kol-folio-meta text-folio-muted">{book.chapters.length > 1 ? `Chapter ${book.chapters.indexOf(doc) + 1} of ${book.chapters.length}` : doc.call}</p>
        <div className="kol-folio-meta flex justify-between">
          <p className="text-folio-muted">{Math.round(pct)}% read</p>
          <p className="font-bold text-folio-green">{Math.round(pct)}%</p>
        </div>
        <div className="h-[4px] w-full bg-folio-rule"><div className="h-full bg-folio-green" style={{ width: `${pct}%` }} /></div>
        <div className="flex items-center justify-between whitespace-nowrap">
          <Link to={`${doc.href}#resume`} className="kol-folio-control flex gap-[12px] rounded-[3px] bg-folio-mint px-[11px] py-[7px] text-folio-green">
            <span>Resume reading</span><span aria-hidden>→</span>
          </Link>
          <p className="kol-folio-meta-sm text-folio-muted">Last read {ago(at)}</p>
        </div>
      </div>
    </div>
  )
}

export default function FolioShelf() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const shelf = SHELVES.some((s) => s.id === params.get('shelf')) ? params.get('shelf') : 'all'
  const subs = SUBSHELVES[shelf] ?? null
  const sub = subs?.some((x) => x.id === params.get('sub')) ? params.get('sub') : 'all'
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('call')
  const [page, setPage] = useState(0)
  const [fresh, setFresh] = useState(0)
  const [searching, setSearching] = useSearchState()
  const reading = useContinue()

  /* W8 — the shelf's search field runs kol-search over every document's text; a book matches if a chapter does */
  const hits = useMemo(() => (q.trim() ? searchDocs(q) : null), [q])
  const matched = useMemo(() => {
    if (!hits) return VOLUMES
    const ids = new Set(hits.map((h) => h.item.doc.book?.id))
    return VOLUMES.filter((v) => ids.has(v.id))
  }, [hits])
  const count = (id) => matched.filter((b) => b.shelf === id).length
  const inShelf = shelf === 'all' ? matched : matched.filter((b) => b.shelf === shelf)
  const onShelf = sub === 'all' ? inShelf : inShelf.filter((b) => b.sub === sub)
  const sorted = hits ? onShelf : [...onShelf].sort(SORT[sort])
  const pages = Math.max(1, Math.ceil(sorted.length / PER_PAGE))
  const rows = sorted.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)
  const terms = q.trim().split(/\s+/).filter(Boolean)
  /* the six covers fill the row at any width (W1.1), never below the frame's 201px */
  const freshRow = useRef(null)
  const [coverW, setCoverW] = useState(201.33)
  useEffect(() => {
    const el = freshRow.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setCoverW(Math.max(201.33, (e.contentRect.width - 5 * 24) / 6)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [hits, shelf])

  /* Fresh: on "My library" the newest book from each of the six classes (page n = each class's n-th newest); on one
     shelf, its six newest per page */
  const newestOf = (list) => list.filter((b) => b.date).sort(SORT.newest)
  const perClass = SHELVES.slice(0, 6).map((s) => newestOf(matched.filter((b) => b.shelf === s.id)))
  const newest = newestOf(onShelf)
  const freshPages = Math.max(1, Math.min(8, shelf === 'all' ? Math.max(...perClass.map((l) => l.length)) : Math.ceil(newest.length / FRESH)))
  const freshBooks = shelf === 'all' ? perClass.map((l) => l[fresh]).filter(Boolean) : newest.slice(fresh * FRESH, fresh * FRESH + FRESH)

  const pick = (id) => { setParams(id === 'all' ? {} : { shelf: id }); setPage(0); setFresh(0) }
  const pageList = [...new Set([0, 1, 2, page, pages - 1])].filter((p) => p >= 0 && p < pages).sort((a, b) => a - b)
  let n = 0
  const num = () => String(++n).padStart(2, '0')
  const here = SHELVES.find((s) => s.id === shelf)

  return (
    <Frame>
      <Masthead shelf={shelf} onSearch={() => setSearching(true)} />
      <SearchOverlay open={searching} onClose={() => setSearching(false)} />

      <div className="flex items-end gap-[32px] px-[56px] pb-[32px] pt-[36px]">
        <SectionText variant="folio" eyebrow={here ? here.note : 'Your own little world'} headline={here ? here.label : 'My library'} body="Old favorites, new discoveries, and the next good chapter." className="min-w-0 flex-1" />
        <div className="flex w-[360px] items-end gap-[28px] pb-[4px]">
          <div className="flex h-[79px] w-[170px] items-end gap-[8px]" aria-hidden>
            {VOLUMES_ART.map(([bg, h]) => (
              <div key={bg} className="flex w-[36px] flex-col gap-[10px] pt-[18px]" style={{ background: bg, height: h }}>
                <div className="h-[12px] bg-[#eeeadc]" />
                <div className="h-[8px] bg-[#eeeadc]" />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-[6px] whitespace-nowrap">
            <p className="kol-folio-figure">{onShelf.length}</p>
            <p className="kol-folio-meta text-folio-muted">books &amp; counting</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[22px] px-[56px]">
        <div className="flex items-center gap-[12px]">
          <Input variant="kolbox" size="md" iconLeft="search" aria-label="Search" placeholder="Search titles, call numbers and the text itself" value={q}
            onChange={(e) => { setQ(e.target.value); setPage(0); setFresh(0) }} className="min-w-0 flex-1"
            slotRight={q
              ? <button type="button" onClick={() => setQ('')} className="kol-kolbox-meta shrink-0 text-(--kol-oq-64) hover:text-(--kol-surface-on-primary)">Clear</button>
              : <button type="button" onClick={() => setSearching(true)} className="kol-kolbox-meta shrink-0 text-(--kol-oq-64) hover:text-(--kol-surface-on-primary)">⌘ K</button>} />
          {import.meta.env.DEV && (
            <Button variant="kolbox" tone="primary" onClick={() => navigate('/new')} className="shrink-0">
              New document<span aria-hidden>+</span>
            </Button>
          )}
          <Dropdown variant="kolbox" ariaLabel="Sort" value={hits ? 'Best match' : sort} disabled={Boolean(hits)} onChange={(v) => { setSort(v); setPage(0) }} options={Object.entries(SORTS).map(([value, label]) => ({ value, label }))} className="shrink-0" />
        </div>
        <div className="flex items-center justify-between whitespace-nowrap border-b border-folio-rule">
          <div className="flex gap-[32px]">
            {[{ id: 'all', label: 'All books' }, ...SHELVES].map((s) => {
              const on = shelf === s.id
              return (
                <button key={s.id} type="button" onClick={() => pick(s.id)} className={`-mb-px flex items-start gap-[10px] pb-[16px] ${on ? 'shadow-[inset_0_-3px_0_var(--kol-folio-ink)]' : 'text-folio-muted hover:text-folio-ink'}`}>
                  <span className={`kol-folio-control ${on ? 'font-bold' : 'font-medium'}`}>{s.label}</span>
                  <span className="kol-folio-meta-sm">{s.id === 'all' ? matched.length : count(s.id)}</span>
                </button>
              )
            })}
          </div>
          <p className="kol-folio-meta text-folio-muted">A shelf that’s entirely yours.</p>
        </div>
        {subs && (
          <div className="flex flex-wrap gap-[8px]" aria-label={`${here.label} sub-shelves`}>
            {[{ id: 'all', label: `All ${here.label.toLowerCase()}` }, ...subs].map((x) => {
              const on = sub === x.id
              const n = x.id === 'all' ? inShelf.length : inShelf.filter((b) => b.sub === x.id).length
              return (
                <Button variant="kolbox" key={x.id} pressed={on} aria-pressed={on} onClick={() => { setParams(x.id === 'all' ? { shelf } : { shelf, sub: x.id }); setPage(0); setFresh(0) }}>
                  {x.label}<span className="kol-folio-meta-sm">{n}</span>
                </Button>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-[36px] px-[56px] py-[32px]">
        {!hits && shelf === 'all' && reading.length > 0 && (
          <div className="flex flex-col gap-[18px]">
            <div className="flex items-baseline justify-between whitespace-nowrap">
              <Heading n={num()} title="Pick up where you left off" />
              <p className="kol-folio-meta text-folio-muted">{reading.length} in progress</p>
            </div>
            <div className="flex gap-[24px]">
              {reading.map((r) => <ContinueCard key={r.doc.key} {...r} />)}
              {reading.length === 1 && <div className="flex-1" />}
            </div>
          </div>
        )}

        {!hits && freshBooks.length > 0 && (
          <div className="flex flex-col gap-[22px]">
            <div className="flex items-center justify-between">
              <Heading n={num()} title="Fresh on your shelf" sub={shelf === 'all' ? 'The newest from each shelf.' : 'The newest on this shelf, by date.'} />
              <div className="flex items-center gap-[12px]">
                <p className="kol-folio-meta text-folio-muted">{String(fresh + 1).padStart(2, '0')} / {String(freshPages).padStart(2, '0')}</p>
                <SquareButton label="Previous" icon="arrow-left" disabled={fresh === 0} onClick={() => setFresh(fresh - 1)} />
                <SquareButton label="Next" icon="arrow-right" disabled={fresh >= freshPages - 1} onClick={() => setFresh(fresh + 1)} />
              </div>
            </div>
            <div ref={freshRow} className="flex gap-[24px]">
              {freshBooks.map((book) => (
                <ContentCard key={book.id} variant="folio" href={book.href} linkComponent={Link} style={{ maxWidth: coverW }} media={<Cover book={book} width={coverW} />}
                  title={book.title} meta={book.chapters.length > 1 ? `${book.chapters.length} chapters` : book.call} label={<>{book.shelfLabel}<Flags langs={book.langs} size={12} /></>} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-[22px] px-[56px] pb-[30px] pt-[8px]">
        <div className="flex items-center justify-between border-t border-folio-ink pt-[27px]">
          <Heading n={num()} title={hits ? 'Found' : 'All books'} sub={`${sorted.length} ${sorted.length === 1 ? 'book' : 'books'}`} />
          <p className="kol-folio-label text-folio-muted">{hits ? `Matching “${q}”` : `Sorted by ${SORTS[sort]}`}</p>
        </div>
        <Table variant="folio" rows={rows} rowHref={(book) => book.href} linkComponent={Link} columns={COLUMNS(terms)}
          empty={<p className="kol-folio-body py-[24px] text-folio-muted">Nothing on this shelf matches “{q}”.</p>} />
        <div className="flex items-center justify-between">
          <p className="kol-folio-meta text-folio-muted">Showing {sorted.length ? page * PER_PAGE + 1 : 0}–{page * PER_PAGE + rows.length} of {sorted.length} books</p>
          <div className="kol-folio-meta flex items-center gap-[18px]">
            <Button variant="kolbox" disabled={page === 0} onClick={() => setPage(page - 1)}>← Previous</Button>
            {pageList.map((p, i) => (
              <span key={p} className="flex items-center gap-[18px]">
                {i > 0 && p - pageList[i - 1] > 1 && <span className="flex size-[30px] items-center justify-center">…</span>}
                <Button variant="kolbox" pressed={p === page} aria-current={p === page ? 'page' : undefined} onClick={() => setPage(p)}>{p + 1}</Button>
              </span>
            ))}
            <Button variant="kolbox" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>Next →</Button>
          </div>
        </div>
        <footer className="flex items-start justify-between whitespace-nowrap border-t border-folio-rule pt-[23px] text-folio-muted">
          <p className="kol-folio-nav">A good book is a place to begin again.</p>
          <p className="kol-folio-label">Your library. Your pace.</p>
        </footer>
      </div>
    </Frame>
  )
}

/* the ⌘K overlay's open state, with the key bound */
function useSearchState() {
  const [open, setOpen] = useState(false)
  useSearchKey(setOpen)
  return [open, setOpen]
}
