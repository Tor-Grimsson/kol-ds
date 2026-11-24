/* /demo-4's chrome: the masthead (every shelf one click away, W7), search on kol-search (W8), the settings menu
   (theme W3 · palette W11.2 · accent W11.3 · reading size and family W1.2–1.3), and language flags (W1.5). */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, ButtonGroup, CommandOverlay, LabeledControl, QuantityInput, ShortcutsOverlay } from '@kolkrabbi/kol-component'
import { createIndex, search, highlightRanges } from '@kolkrabbi/kol-search'
import { IconLoader as KolIcon } from '@kolkrabbi/kol-icons'
import { FolioFrame, Mark } from './parts'
import { DOCS, SHELVES, bodyOf } from './shelf'
import { useSettings, setSettings, SIZES, KOL_LIGHTS, useSKey } from './settings'

/* Folio wears kolbox's look (plan-2026-11-23 W8.2): kolbox's colors are the theme variant on <html>, where its menus,
   dropdowns and windows (portalled to <body>) find it too; Folio's light or dark is the theme. What was there goes back on
   unmount, so /mockups, which never mounts a Frame, stays as it was. Folio's own inks are re-pointed at kolbox's in
   index.css under the same scope; the layout stays Folio's. */
export function useKolboxScope(theme) {
  useLayoutEffect(() => {
    const html = document.documentElement
    const was = { 'data-theme-variant': html.getAttribute('data-theme-variant'), 'data-theme': html.getAttribute('data-theme') }
    html.setAttribute('data-theme-variant', 'kolbox')
    html.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light')
    return () => Object.entries(was).forEach(([k, v]) => (v == null ? html.removeAttribute(k) : html.setAttribute(k, v)))
  }, [theme])
}

/* the frame, carrying the viewer's theme, palette and accent; full width (W1.1) */
export function Frame({ children }) {
  const s = useSettings()
  useKolboxScope(s.theme)
  const attrs = {
    'data-folio-theme': s.theme,
    'data-folio-palette': s.palette,
    'data-folio-accent': s.accent,
    /* the KOL palette's two picks */
    ...(s.palette === 'kol' ? { style: {
      '--kol-folio-kol-light': s.kolLight,
      '--kol-folio-kol-dark': s.kolDark,
      ...(KOL_LIGHTS.find(([, hex]) => hex === s.kolLight)?.[2] ? { '--kol-folio-kol-surface': KOL_LIGHTS.find(([, hex]) => hex === s.kolLight)[2] } : {}),
    } } : {}),
  }
  return <FolioFrame className="max-w-none" attrs={attrs}>{children}</FolioFrame>
}

/* ── language flags (kol-icons' external flags) ── */
const FLAG = { IS: 'flag-is', EN: 'flag-gb', DE: 'flag-de' }
export function Flags({ langs = [], size = 14 }) {
  if (!langs.length) return <span className="kol-folio-meta-sm text-folio-muted">—</span>
  return (
    <span className="inline-flex items-center gap-[4px]">
      {langs.map((l) => FLAG[l]
        ? <span key={l} role="img" aria-label={l} title={l} className="inline-flex overflow-hidden rounded-[2px] shadow-[0_0_0_1px_var(--kol-folio-rule)]"><KolIcon name={FLAG[l]} size={size} /></span>
        : <span key={l} className="kol-folio-meta-sm text-folio-muted">{l}</span>)}
    </span>
  )
}

/* ── the language toggle (plan library-connections W4): a text read in Icelandic and English shows both flags on its title
   row; the lit one is the language on the page, a click on the other swaps the text in place ── */
export function LangToggle({ langs = [], lang, onLang, size = 18 }) {
  if (langs.length < 2) return null
  return (
    <span className="inline-flex items-center gap-[8px]" role="group" aria-label="Language">
      {langs.map((l) => (
        <button key={l} type="button" onClick={() => onLang(l)} aria-pressed={l === lang} title={l}
          className={`inline-flex overflow-hidden rounded-[2px] shadow-[0_0_0_1px_var(--kol-folio-rule)] transition-opacity ${l === lang ? '' : 'opacity-40 hover:opacity-80'}`}>
          <KolIcon name={FLAG[l] ?? 'globe'} size={size} />
        </button>
      ))}
    </span>
  )
}

/* ── search (W8): kol-search over every document's title, call number, kind, origin, shelf and its text ── */
const plain = (md) => md.replace(/[#>*_`|[\]()-]+/g, ' ').replace(/\s+/g, ' ').trim()
let INDEX = null
const indexOf = () => (INDEX ??= createIndex(DOCS.filter((d) => !d.hidden).map((d) => ({
  id: d.key,
  title: d.title,
  kind: d.shelfLabel,
  tags: [d.code, d.origin, ...d.langs, ...(d.tags ?? [])].filter(Boolean),
  keywords: [d.call, d.book?.title, d.chapter].filter(Boolean),
  headings: [...(d.source ?? '').matchAll(/^#{2,3}\s+(.+)$/gm)].map((m) => m[1]),
  description: d.book?.title ?? '',
  body: plain(bodyOf(d)),
  date: d.date,
  href: d.href,
  doc: d,
}))))
export const searchDocs = (q) => (q.trim() ? search(indexOf(), q).results : [])

/* the text with each matched range in <mark> */
export function Marked({ text = '', terms = [] }) {
  const ranges = highlightRanges(text, terms)
  if (!ranges.length) return text
  const out = []
  let at = 0
  ranges.forEach(([a, b], i) => {
    if (a > at) out.push(text.slice(at, a))
    /* kolbox marks a match as its search modal does: underlined, in the row's ink */
    out.push(<mark key={i} className="bg-transparent text-inherit underline decoration-2 underline-offset-[3px]">{text.slice(a, b)}</mark>)
    at = b
  })
  out.push(text.slice(at))
  return out
}

/* a window of the body around the first hit */
const snippet = (body, terms) => {
  /* NFC keeps the string's length, so an index here is an index into the body */
  const hay = body.normalize('NFC').toLowerCase()
  const i = Math.min(...terms.map((t) => hay.indexOf(t.normalize('NFC').toLowerCase())).filter((n) => n >= 0))
  if (!Number.isFinite(i)) return body.slice(0, 140)
  const from = Math.max(0, i - 60)
  return `${from ? '…' : ''}${body.normalize('NFC').slice(from, from + 160)}…`
}

/* the search modal (W8): CommandOverlay folio, this host keeps the query, the lit row and the rows */
export function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const results = useMemo(() => searchDocs(q).slice(0, 30), [q])
  const terms = q.trim().split(/\s+/).filter((t) => t && !t.includes(':') && !t.startsWith('-'))

  useEffect(() => { if (open) setActive(0) }, [open])
  const rows = results.map((r) => ({
    id: r.item.id,
    label: <Marked text={r.item.doc.book?.chapters.length > 1 ? r.item.doc.chapter : r.item.title} terms={terms} />,
    group: r.item.kind,
    hint: r.item.doc.book?.chapters.length > 1 ? `in ${r.item.doc.book.title}` : null,
    body: r.reasons.some((x) => x.field === 'body') ? <Marked text={snippet(r.item.body, terms)} terms={terms} /> : null,
    href: r.item.href,
  }))
  return (
    <CommandOverlay variant="kolbox" open={open} onClose={onClose} aria-label="Search the library" placeholder="Search every document — titles, call numbers, the text itself"
      query={q} onQueryChange={(v) => { setQ(v); setActive(0) }} results={rows} active={active} onActive={setActive}
      onSelect={(r) => { onClose(); navigate(r.href) }}
      empty={q.trim() && !results.length ? `Nothing in the library matches “${q}”.` : null} />
  )
}

/* ⌘K / ctrl+K anywhere on /demo-4 */
export function useSearchKey(setOpen) {
  useEffect(() => {
    const onKey = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen(true) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOpen])
}

/* ── settings menu ── */
export function SettingsMenu({ reading }) {
  const s = useSettings()
  const [open, setOpen] = useState(false)
  const box = useRef(null)
  useEffect(() => {
    if (!open) return
    const off = (e) => { if (!box.current?.contains(e.target)) setOpen(false) }
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', off); document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', off); document.removeEventListener('keydown', esc) }
  }, [open])
  /* , opens and closes the settings (user, 2026-11-04: "shortcut [,] for settings") */
  useSKey(() => setOpen((o) => !o), ['Comma'])
  const at = SIZES.indexOf(s.size)
  return (
    <div ref={box} className="relative">
      <Button variant="kolbox" aria-expanded={open} pressed={open} onClick={() => setOpen(!open)} className="whitespace-pre">{'Aa  Settings'}</Button>
      {open && (
        <div className="absolute right-0 top-[48px] z-40 flex w-[280px] flex-col gap-[18px] rounded-[3px] border border-folio-rule bg-folio-paper p-[18px] shadow-[0_16px_48px_rgb(0_0_0/0.14)]">
          {reading && <>
            <LabeledControl variant="kolbox" label="Text size">
              <QuantityInput variant="kolbox" down="A−" up="A+" downLabel="Smaller text" upLabel="Larger text" value={s.size} min={SIZES[0]} max={SIZES[SIZES.length - 1]} step={SIZES[1] - SIZES[0]} unit="px" onChange={(size) => setSettings({ size })} />
            </LabeledControl>
            <LabeledControl variant="kolbox" label="Typeface"><ButtonGroup layout="joined" variant="kolbox" ariaLabel="Typeface" value={s.family} onChange={(family) => setSettings({ family })} options={[{ value: 'auto', label: 'As set' }, { value: 'sans', label: 'Sans' }, { value: 'mono', label: 'Mono' }]} /></LabeledControl>
          </>}
          <LabeledControl variant="kolbox" label="Theme"><ButtonGroup layout="joined" variant="kolbox" ariaLabel="Theme" value={s.theme} onChange={(theme) => setSettings({ theme })} options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} /></LabeledControl>
        </div>
      )}
    </div>
  )
}

/* ── S: the shortcut list (as in every KOL app): ShortcutsOverlay folio, this host keeps S ── */
const KEYS = [{ label: 'Search the library', combo: '⌘K' }, { label: 'This list', combo: 'S, or ⌥S while writing' }, { label: 'Settings', combo: ',' }, { label: 'Close a panel or overlay', combo: 'Esc' }, { label: 'In the editor: bold, italic, link, save', combo: '⌘B ⌘I ⌘K ⌘S' }, { label: 'In the editor: the format menu', combo: 'right-click a selection' }]
export function KeysPanel() {
  const [open, setOpen] = useState(false)
  useSKey(() => setOpen((o) => !o))
  if (!open) return null
  return <ShortcutsOverlay variant="kolbox" shortcuts={KEYS} onClose={() => setOpen(false)} />
}

/* ── the masthead ── */
export function Masthead({ shelf, reading, onSearch }) {
  return (
    <header className="flex h-[88px] shrink-0 items-center justify-between gap-[24px] border-b border-folio-ink px-[56px]">
      <KeysPanel />
      <Link to="/" className="flex items-center gap-[10px]">
        <span className="kol-folio-wordmark">folio</span>
        <Mark />
      </Link>
      <nav aria-label="Shelves" className="flex min-w-0 items-center gap-[4px] overflow-x-auto">
        {[{ id: 'all', label: 'My library' }, ...SHELVES].map((s) => {
          const on = (shelf ?? 'all') === s.id
          return (
            <Link key={s.id} to={s.id === 'all' ? '/' : `/?shelf=${s.id}`} aria-current={on ? 'page' : undefined} className={`kol-folio-nav whitespace-nowrap rounded-[3px] px-[12px] py-[11px] ${on ? 'bg-folio-mint font-bold' : 'text-folio-muted hover:text-folio-ink'}`}>{s.label}</Link>
          )
        })}
      </nav>
      <div className="flex shrink-0 items-center gap-[12px]">
        <Button variant="kolbox" iconLeft="search" onClick={onSearch}>Search<span className="kol-kolbox-meta text-(--kol-oq-64)">⌘K</span></Button>
        <SettingsMenu reading={reading} />
      </div>
    </header>
  )
}
