/* Folio — My library on the real Library (/demo-4). The look is /demo-3 (Figma 228:13254); the books are the catalogue's
   (shelf.js · catalogue.js): documents folded into books, titled by shelf, duplicates once. */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
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

/* every cover is a generated jacket — scans and media thumbnails are never covers (user, 2026-11-04) */
export function Cover({ book, width }) {
  return <Jacket book={book} width={width} />
}

function Heading({ n, title, sub }) {
  return (
    <div className="flex items-baseline gap-[18px] whitespace-nowrap">
      <p className="kol-reader-label text-folio-muted">{n}</p>
      <h2 className="kol-reader-section">{title}</h2>
      {sub && <p className="kol-reader-meta text-folio-muted">{sub}</p>}
    </div>
  )
}

const SquareButton = ({ label, icon, onClick, disabled }) => (
  <button type="button" aria-label={label} onClick={onClick} disabled={disabled} className="flex size-[32px] items-center justify-center border border-folio-rule hover:bg-folio-surface disabled:opacity-40">
    <Icon name={icon} />
  </button>
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
        <p className="kol-reader-label truncate text-folio-muted">{book.chapters.length > 1 ? doc.chapter : book.shelfLabel}</p>
        <p className="kol-reader-book truncate">{book.title}</p>
        <p className="kol-reader-meta text-folio-muted">{book.chapters.length > 1 ? `Chapter ${book.chapters.indexOf(doc) + 1} of ${book.chapters.length}` : doc.call}</p>
        <div className="kol-reader-meta flex justify-between">
          <p className="text-folio-muted">{Math.round(pct)}% read</p>
          <p className="font-bold text-folio-green">{Math.round(pct)}%</p>
        </div>
        <div className="h-[4px] w-full bg-folio-rule"><div className="h-full bg-folio-green" style={{ width: `${pct}%` }} /></div>
        <div className="flex items-center justify-between whitespace-nowrap">
          <Link to={`${doc.href}#resume`} className="kol-reader-control flex gap-[12px] rounded-[3px] bg-folio-mint px-[11px] py-[7px] text-folio-green">
            <span>Resume reading</span><span aria-hidden>→</span>
          </Link>
          <p className="kol-reader-meta-sm text-folio-muted">Last read {ago(at)}</p>
        </div>
      </div>
    </div>
  )
}

export default function FolioShelf() {
  const [params, setParams] = useSearchParams()
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
        <div className="flex min-w-0 flex-1 flex-col gap-[12px]">
          <p className="kol-reader-label text-folio-muted">{here ? here.note : 'Your own little world'}</p>
          <h1 className="kol-reader-title">{here ? here.label : 'My library'}</h1>
          <p className="kol-reader-body text-folio-muted">Old favorites, new discoveries, and the next good chapter.</p>
        </div>
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
            <p className="kol-reader-figure">{onShelf.length}</p>
            <p className="kol-reader-meta text-folio-muted">books &amp; counting</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[22px] px-[56px]">
        <div className="flex items-center gap-[12px]">
          <label className="flex h-[44px] min-w-0 flex-1 items-center gap-[12px] rounded-[3px] border border-folio-rule bg-folio-paper px-[14px]">
            <Icon name="search" size={18} />
            <input value={q} onChange={(e) => { setQ(e.target.value); setPage(0); setFresh(0) }} placeholder="Search titles, call numbers and the text itself" className="kol-reader-body min-w-0 flex-1 bg-transparent outline-none placeholder:text-folio-muted" />
            {q ? <button type="button" onClick={() => setQ('')} className="kol-reader-meta text-folio-muted hover:text-folio-ink">Clear</button> : <button type="button" onClick={() => setSearching(true)} className="kol-reader-meta text-folio-muted hover:text-folio-ink">⌘ K</button>}
          </label>
          {import.meta.env.DEV && (
            <Link to="/new" className="kol-reader-control flex h-[42px] shrink-0 items-center gap-[12px] rounded-[3px] border border-folio-green bg-folio-green px-[16px] text-folio-paper">
              New document<span aria-hidden className="kol-reader-glyph">+</span>
            </Link>
          )}
          <label className="relative flex h-[42px] shrink-0 items-center gap-[12px] rounded-[3px] border border-folio-rule bg-folio-paper px-[16px] hover:bg-folio-surface">
            <span className="kol-reader-control">{hits ? 'Best match' : SORTS[sort]}</span>
            <span aria-hidden className="kol-reader-glyph">⌄</span>
            <select aria-label="Sort" value={sort} disabled={Boolean(hits)} onChange={(e) => { setSort(e.target.value); setPage(0) }} className="absolute inset-0 cursor-pointer opacity-0">
              {Object.entries(SORTS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
          </label>
        </div>
        <div className="flex items-center justify-between whitespace-nowrap border-b border-folio-rule">
          <div className="flex gap-[32px]">
            {[{ id: 'all', label: 'All books' }, ...SHELVES].map((s) => {
              const on = shelf === s.id
              return (
                <button key={s.id} type="button" onClick={() => pick(s.id)} className={`-mb-px flex items-start gap-[10px] pb-[16px] ${on ? 'shadow-[inset_0_-3px_0_var(--color-folio-ink)]' : 'text-folio-muted hover:text-folio-ink'}`}>
                  <span className={`kol-reader-control ${on ? 'font-bold' : 'font-medium'}`}>{s.label}</span>
                  <span className="kol-reader-meta-sm">{s.id === 'all' ? matched.length : count(s.id)}</span>
                </button>
              )
            })}
          </div>
          <p className="kol-reader-meta text-folio-muted">A shelf that’s entirely yours.</p>
        </div>
        {subs && (
          <div className="flex flex-wrap gap-[8px]" aria-label={`${here.label} sub-shelves`}>
            {[{ id: 'all', label: `All ${here.label.toLowerCase()}` }, ...subs].map((x) => {
              const on = sub === x.id
              const n = x.id === 'all' ? inShelf.length : inShelf.filter((b) => b.sub === x.id).length
              return (
                <button key={x.id} type="button" onClick={() => { setParams(x.id === 'all' ? { shelf } : { shelf, sub: x.id }); setPage(0); setFresh(0) }} className={`kol-reader-control flex items-center gap-[8px] rounded-[3px] border px-[12px] py-[8px] ${on ? 'border-folio-mint bg-folio-mint text-folio-green' : 'border-folio-rule text-folio-muted hover:text-folio-ink'}`}>
                  {x.label}<span className="kol-reader-meta-sm">{n}</span>
                </button>
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
              <p className="kol-reader-meta text-folio-muted">{reading.length} in progress</p>
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
                <p className="kol-reader-meta text-folio-muted">{String(fresh + 1).padStart(2, '0')} / {String(freshPages).padStart(2, '0')}</p>
                <SquareButton label="Previous" icon="arrow-left" disabled={fresh === 0} onClick={() => setFresh(fresh - 1)} />
                <SquareButton label="Next" icon="arrow-right" disabled={fresh >= freshPages - 1} onClick={() => setFresh(fresh + 1)} />
              </div>
            </div>
            <div ref={freshRow} className="flex gap-[24px]">
              {freshBooks.map((book) => (
                <Link key={book.id} to={book.href} className="group flex min-w-0 flex-1 flex-col gap-[12px]" style={{ maxWidth: coverW }}>
                  <Cover book={book} width={coverW} />
                  <span className="flex flex-col gap-[6px]">
                    <span className="kol-reader-shelf line-clamp-2 min-h-[38px] group-hover:underline">{book.title}</span>
                    <span className="kol-reader-meta text-folio-muted">{book.chapters.length > 1 ? `${book.chapters.length} chapters` : book.call}</span>
                    <span className="kol-reader-meta-sm flex items-center gap-[6px] text-folio-muted">{book.shelfLabel}<Flags langs={book.langs} size={12} /></span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-[22px] px-[56px] pb-[30px] pt-[8px]">
        <div className="flex items-center justify-between border-t border-folio-ink pt-[27px]">
          <Heading n={num()} title={hits ? 'Found' : 'All books'} sub={`${sorted.length} ${sorted.length === 1 ? 'book' : 'books'}`} />
          <p className="kol-reader-label text-folio-muted">{hits ? `Matching “${q}”` : `Sorted by ${SORTS[sort]}`}</p>
        </div>
        <div className="flex flex-col">
          <div className="kol-reader-label flex h-[34px] items-center gap-[20px] border-b-2 border-folio-ink text-folio-muted">
            <p className="min-w-0 flex-1">Title</p>
            <p className="w-[195px] shrink-0">Call number</p>
            <p className="w-[110px] shrink-0">Shelf</p>
            <p className="w-[76px] shrink-0">Language</p>
            <p className="w-[142px] shrink-0">Origin</p>
            <p className="w-[104px] shrink-0">Date</p>
            <span className="w-[18px] shrink-0" />
          </div>
          {rows.map((book) => (
            <Link key={book.id} to={book.href} className="group flex h-[70px] items-center gap-[20px] border-b border-folio-rule hover:bg-folio-surface">
              <div className="flex min-w-0 flex-1 items-center gap-[16px]">
                <Cover book={book} width={28} />
                <p className="kol-reader-row min-w-0 flex-1 truncate group-hover:underline"><Marked text={book.title} terms={terms} /></p>
                {book.chapters.length > 1 && <span className="kol-reader-meta-sm shrink-0 rounded-[3px] bg-folio-surface px-[8px] py-[5px] text-folio-muted group-hover:bg-folio-paper">{book.chapters.length} chapters</span>}
              </div>
              <p className="kol-reader-meta w-[195px] shrink-0 truncate tabular-nums">{book.call}</p>
              <p className="kol-reader-meta w-[110px] shrink-0 truncate text-folio-muted">{book.subLabel ?? book.shelfLabel}</p>
              <p className="w-[76px] shrink-0"><Flags langs={book.langs} /></p>
              <div className="flex w-[142px] shrink-0">
                {book.origin
                  ? <p className="kol-reader-meta-sm rounded-[3px] bg-folio-mint px-[8px] py-[6px] font-semibold text-folio-green">{book.origin}</p>
                  : <p className="kol-reader-meta-sm text-folio-muted">—</p>}
              </div>
              <p className="kol-reader-meta-sm w-[104px] shrink-0 tabular-nums text-folio-muted">{book.date ? (book.first && book.first.slice(0, 4) !== book.date.slice(0, 4) ? `${book.first.slice(0, 4)}–${book.date.slice(0, 4)}` : fmtDate(book.date)) : 'n.d.'}</p>
              <span className="shrink-0 text-folio-muted group-hover:text-folio-ink"><Icon name="arrow-right" size={18} /></span>
            </Link>
          ))}
          {rows.length === 0 && <p className="kol-reader-body py-[24px] text-folio-muted">Nothing on this shelf matches “{q}”.</p>}
        </div>
        <div className="flex items-center justify-between">
          <p className="kol-reader-meta text-folio-muted">Showing {sorted.length ? page * PER_PAGE + 1 : 0}–{page * PER_PAGE + rows.length} of {sorted.length} books</p>
          <div className="kol-reader-meta flex items-center gap-[18px]">
            <button type="button" disabled={page === 0} onClick={() => setPage(page - 1)} className="text-folio-muted hover:text-folio-ink disabled:opacity-40">← Previous</button>
            {pageList.map((p, i) => (
              <span key={p} className="flex items-center gap-[18px]">
                {i > 0 && p - pageList[i - 1] > 1 && <span className="flex size-[30px] items-center justify-center">…</span>}
                <button type="button" onClick={() => setPage(p)} className={`flex size-[30px] items-center justify-center ${p === page ? 'bg-folio-mint font-bold' : 'hover:bg-folio-surface'}`}>{p + 1}</button>
              </span>
            ))}
            <button type="button" disabled={page >= pages - 1} onClick={() => setPage(page + 1)} className="font-semibold disabled:opacity-40">Next →</button>
          </div>
        </div>
        <footer className="flex items-start justify-between whitespace-nowrap border-t border-folio-rule pt-[23px] text-folio-muted">
          <p className="kol-reader-nav">A good book is a place to begin again.</p>
          <p className="kol-reader-label">Your library. Your pace.</p>
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
