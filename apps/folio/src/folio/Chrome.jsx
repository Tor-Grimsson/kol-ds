/* /demo-4's chrome: the masthead (every shelf one click away, W7), search on kol-search (W8), the settings menu
   (theme W3 · palette W11.2 · accent W11.3 · reading size and family W1.2–1.3), and language flags (W1.5). */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ModalShell } from '@kolkrabbi/kol-component'
import { createIndex, search, highlightRanges } from '@kolkrabbi/kol-search'
import { IconLoader as KolIcon } from '@kolkrabbi/kol-icons'
import { FolioFrame, Mark, Icon } from './parts'
import { DOCS, SHELVES, bodyOf } from './shelf'
import { useSettings, setSettings, SIZES, ACCENTS, KOL_LIGHTS, KOL_DARKS, useSKey } from './settings'
import './reader.css'

/* the frame, carrying the viewer's theme, palette and accent; full width (W1.1) */
export function Frame({ children }) {
  const s = useSettings()
  const attrs = {
    'data-folio-theme': s.theme,
    'data-folio-palette': s.palette,
    'data-folio-accent': s.accent,
    /* the KOL palette's two picks */
    ...(s.palette === 'kol' ? { style: {
      '--folio-kol-light': s.kolLight,
      '--folio-kol-dark': s.kolDark,
      ...(KOL_LIGHTS.find(([, hex]) => hex === s.kolLight)?.[2] ? { '--folio-kol-surface': KOL_LIGHTS.find(([, hex]) => hex === s.kolLight)[2] } : {}),
    } } : {}),
  }
  return <FolioFrame className="max-w-none" attrs={attrs}>{children}</FolioFrame>
}

/* ── language flags (kol-icons' external flags) ── */
const FLAG = { IS: 'flag-is', EN: 'flag-gb', DE: 'flag-de' }
export function Flags({ langs = [], size = 14 }) {
  if (!langs.length) return <span className="kol-reader-meta-sm text-folio-muted">—</span>
  return (
    <span className="inline-flex items-center gap-[4px]">
      {langs.map((l) => FLAG[l]
        ? <span key={l} role="img" aria-label={l} title={l} className="inline-flex overflow-hidden rounded-[2px] shadow-[0_0_0_1px_var(--color-folio-rule)]"><KolIcon name={FLAG[l]} size={size} /></span>
        : <span key={l} className="kol-reader-meta-sm text-folio-muted">{l}</span>)}
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
          className={`inline-flex overflow-hidden rounded-[2px] shadow-[0_0_0_1px_var(--color-folio-rule)] transition-opacity ${l === lang ? '' : 'opacity-40 hover:opacity-80'}`}>
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
    out.push(<mark key={i} className="rounded-[2px] bg-folio-mint px-[1px] text-folio-green">{text.slice(a, b)}</mark>)
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

export function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const input = useRef(null)
  const results = useMemo(() => searchDocs(q).slice(0, 30), [q])
  const terms = q.trim().split(/\s+/).filter((t) => t && !t.includes(':') && !t.startsWith('-'))

  useEffect(() => { if (open) { setActive(0); setTimeout(() => input.current?.focus(), 0) } }, [open])
  if (!open) return null
  const go = (r) => { onClose(); navigate(r.item.href) }
  const onKey = (e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    if (e.key === 'Enter' && results[active]) go(results[active])
  }
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-[rgb(38_41_34/0.32)] px-[16px] pt-[12vh]" onMouseDown={onClose}>
      <ModalShell variant="bordered" role="dialog" aria-label="Search the library" className="max-h-[70vh] w-full max-w-[720px] overflow-hidden text-folio-ink shadow-[0_24px_64px_rgb(0_0_0/0.18)] !border-folio-rule" style={{ background: 'var(--color-folio-paper)', color: 'var(--color-folio-ink)' }} onMouseDown={(e) => e.stopPropagation()}>
        <label className="flex h-[56px] shrink-0 items-center gap-[12px] border-b border-folio-rule px-[18px]">
          <Icon name="search" size={18} />
          <input ref={input} value={q} onChange={(e) => { setQ(e.target.value); setActive(0) }} onKeyDown={onKey} placeholder="Search every document — titles, call numbers, the text itself" className="kol-reader-nav min-w-0 flex-1 bg-transparent font-normal outline-none placeholder:text-folio-muted" />
          <span className="kol-reader-meta text-folio-muted">esc</span>
        </label>
        <div className="overflow-y-auto">
          {q.trim() && !results.length && <p className="kol-reader-body px-[18px] py-[20px] text-folio-muted">Nothing in the library matches “{q}”.</p>}
          {results.map((r, i) => (
            <button key={r.item.id} type="button" onMouseEnter={() => setActive(i)} onClick={() => go(r)} className={`flex w-full flex-col gap-[6px] border-b border-folio-rule px-[18px] py-[14px] text-left ${i === active ? 'bg-folio-surface' : ''}`}>
              <span className="flex items-baseline justify-between gap-[16px]">
                <span className="kol-reader-shelf"><Marked text={r.item.doc.book?.chapters.length > 1 ? r.item.doc.chapter : r.item.title} terms={terms} /></span>
                <span className="kol-reader-label shrink-0 text-folio-muted">{r.item.kind}</span>
              </span>
              {r.item.doc.book?.chapters.length > 1 && <span className="kol-reader-meta text-folio-muted">in {r.item.doc.book.title}</span>}
              {r.reasons.some((x) => x.field === 'body') && <span className="kol-reader-body text-folio-muted"><Marked text={snippet(r.item.body, terms)} terms={terms} /></span>}
            </button>
          ))}
        </div>
      </ModalShell>
    </div>
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

/* ── a Folio dropdown (user, 2026-11-04: the native <select> reserved its longest option's width and opened the Mac
   menu): the button is as wide as its text, the list opens under it in the Folio look; Esc or a click outside closes ── */
export function Choice({ value, options, onChange, label, disabled, align = 'left', className = '' }) {
  const [open, setOpen] = useState(false)
  const box = useRef(null)
  useEffect(() => {
    if (!open) return
    const off = (e) => { if (!box.current?.contains(e.target)) setOpen(false) }
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    addEventListener('mousedown', off); addEventListener('keydown', esc)
    return () => { removeEventListener('mousedown', off); removeEventListener('keydown', esc) }
  }, [open])
  const current = options.find(([v]) => v === value)?.[1] ?? value
  return (
    <span ref={box} className="relative inline-flex">
      <button type="button" aria-label={label} aria-haspopup="listbox" aria-expanded={open} disabled={disabled} onClick={() => setOpen(!open)} className={`inline-flex items-center gap-[4px] rounded-[3px] text-folio-ink hover:text-folio-green disabled:cursor-default disabled:hover:text-folio-ink ${className}`}>
        {current}{!disabled && <span aria-hidden className="text-folio-muted">⌄</span>}
      </button>
      {open && (
        <span role="listbox" aria-label={label} className={`absolute z-50 flex min-w-[160px] flex-col rounded-[3px] border border-folio-rule bg-folio-paper py-[4px] shadow-[0_16px_48px_rgb(0_0_0/0.14)] ${/right/.test(align) ? 'right-0' : 'left-0'} ${/bottom/.test(align) ? 'bottom-[calc(100%+6px)]' : 'top-[calc(100%+6px)]'}`}>
          {options.map(([v, text]) => (
            <button key={v} type="button" role="option" aria-selected={v === value} onClick={() => { setOpen(false); onChange(v) }} className={`kol-reader-meta flex items-center gap-[8px] whitespace-nowrap px-[12px] py-[7px] text-left hover:bg-folio-surface ${v === value ? 'font-semibold text-folio-green' : 'text-folio-ink'}`}>
              <span className="w-[10px]">{v === value ? '✓' : ''}</span>{text}
            </button>
          ))}
        </span>
      )}
    </span>
  )
}

/* ── settings menu ── */
const Seg = ({ value, options, onChange, label }) => (
  <div className="flex flex-col gap-[8px]">
    <p className="kol-reader-label text-folio-muted">{label}</p>
    <div className="flex gap-[4px] rounded-[3px] border border-folio-rule p-[4px]">
      {options.map(([v, text]) => (
        <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)} className={`kol-reader-control flex-1 rounded-[2px] px-[10px] py-[7px] ${value === v ? 'bg-folio-mint text-folio-green' : 'text-folio-muted hover:text-folio-ink'}`}>{text}</button>
      ))}
    </div>
  </div>
)

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
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="kol-reader-nav flex h-[40px] items-center gap-[8px] whitespace-pre rounded-[3px] border border-folio-rule px-[14px] font-semibold hover:bg-folio-surface">{'Aa  Settings'}</button>
      {open && (
        <div className="absolute right-0 top-[48px] z-40 flex w-[280px] flex-col gap-[18px] rounded-[3px] border border-folio-rule bg-folio-paper p-[18px] shadow-[0_16px_48px_rgb(0_0_0/0.14)]">
          {reading && <>
            <div className="flex flex-col gap-[8px]">
              <p className="kol-reader-label text-folio-muted">Text size</p>
              <div className="flex items-center gap-[8px]">
                <button type="button" aria-label="Smaller text" disabled={at <= 0} onClick={() => setSettings({ size: SIZES[at - 1] })} className="kol-reader-control flex size-[36px] items-center justify-center rounded-[3px] border border-folio-rule disabled:opacity-40">A−</button>
                <p className="kol-reader-body flex-1 text-center tabular-nums">{s.size} px</p>
                <button type="button" aria-label="Larger text" disabled={at >= SIZES.length - 1} onClick={() => setSettings({ size: SIZES[at + 1] })} className="kol-reader-control flex size-[36px] items-center justify-center rounded-[3px] border border-folio-rule disabled:opacity-40">A+</button>
              </div>
            </div>
            <Seg label="Typeface" value={s.family} onChange={(family) => setSettings({ family })} options={[['auto', 'As set'], ['sans', 'Sans'], ['mono', 'Mono']]} />
          </>}
          <Seg label="Theme" value={s.theme} onChange={(theme) => setSettings({ theme })} options={[['light', 'Light'], ['dark', 'Dark']]} />
          <Seg label="Palette" value={s.palette} onChange={(palette) => setSettings({ palette })} options={[['folio', 'Folio'], ['kol', 'KOL']]} />
          {s.palette === 'kol' && [['Off-white', 'kolLight', KOL_LIGHTS], ['Dark', 'kolDark', KOL_DARKS]].map(([label, key, list]) => (
            <div key={key} className="flex flex-col gap-[8px]">
              <p className="kol-reader-label text-folio-muted">{label}</p>
              <div className="flex gap-[8px]">
                {list.map(([name, hex]) => (
                  <button key={name} type="button" title={name.startsWith('neutral') ? `--kol-${name} ${hex}` : `${name} ${hex}`} aria-label={`${name} ${hex}`} aria-pressed={s[key] === hex} onClick={() => setSettings({ [key]: hex })} className={`size-[28px] rounded-full border border-folio-rule ${s[key] === hex ? 'outline outline-2 outline-offset-2 outline-folio-ink' : ''}`} style={{ background: hex }} />
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-[8px]">
            <p className="kol-reader-label text-folio-muted">Accent</p>
            <div className="flex gap-[8px]">
              {ACCENTS.map((a) => (
                <button key={a} type="button" aria-label={a} aria-pressed={s.accent === a} data-folio-accent={a} onClick={() => setSettings({ accent: a })} className={`size-[28px] rounded-full bg-folio-green ${s.accent === a ? 'outline outline-2 outline-offset-2 outline-folio-ink' : ''}`} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── S: the shortcut list (as in every KOL app) ── */
const KEYS = [['Search the library', '⌘K'], ['This list', 'S, or ⌥S while writing'], ['Settings', ','], ['Close a panel or overlay', 'Esc'], ['In the editor: bold, italic, link, save', '⌘B ⌘I ⌘K ⌘S'], ['In the editor: the format menu', 'right-click a selection']]
export function KeysPanel() {
  const [open, setOpen] = useState(false)
  useSKey(() => setOpen((o) => !o))
  useEffect(() => {
    if (!open) return
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    addEventListener('keydown', esc)
    return () => removeEventListener('keydown', esc)
  }, [open])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(38_41_34/0.32)] px-[16px]" onMouseDown={() => setOpen(false)}>
      <ModalShell variant="bordered" role="dialog" aria-label="Shortcuts" onMouseDown={(e) => e.stopPropagation()} className="w-full max-w-[460px] gap-[4px] p-[20px] shadow-[0_24px_64px_rgb(0_0_0/0.18)] !border-folio-rule" style={{ background: 'var(--color-folio-paper)', color: 'inherit' }}>
        <p className="kol-reader-label pb-[10px] text-folio-muted">Shortcuts</p>
        {KEYS.map(([what, key]) => (
          <div key={what} className="flex items-baseline justify-between gap-[16px] border-t border-folio-rule py-[9px]">
            <span className="kol-reader-body">{what}</span>
            <kbd className="kol-reader-meta whitespace-nowrap font-[family-name:var(--kol-font-family-mono)] text-folio-green">{key}</kbd>
          </div>
        ))}
      </ModalShell>
    </div>
  )
}

/* ── the masthead ── */
export function Masthead({ shelf, reading, onSearch }) {
  return (
    <header className="flex h-[88px] shrink-0 items-center justify-between gap-[24px] border-b border-folio-ink px-[56px]">
      <KeysPanel />
      <Link to="/" className="flex items-center gap-[10px]">
        <span className="kol-reader-wordmark">folio</span>
        <Mark />
      </Link>
      <nav aria-label="Shelves" className="flex min-w-0 items-center gap-[4px] overflow-x-auto">
        {[{ id: 'all', label: 'My library' }, ...SHELVES].map((s) => {
          const on = (shelf ?? 'all') === s.id
          return (
            <Link key={s.id} to={s.id === 'all' ? '/' : `/?shelf=${s.id}`} aria-current={on ? 'page' : undefined} className={`kol-reader-nav whitespace-nowrap rounded-[3px] px-[12px] py-[11px] ${on ? 'bg-folio-mint font-bold' : 'text-folio-muted hover:text-folio-ink'}`}>{s.label}</Link>
          )
        })}
      </nav>
      <div className="flex shrink-0 items-center gap-[12px]">
        <button type="button" onClick={onSearch} className="kol-reader-nav flex h-[40px] items-center gap-[10px] rounded-[3px] border border-folio-rule px-[14px] text-folio-muted hover:bg-folio-surface hover:text-folio-ink">
          <Icon name="search" />Search<span className="kol-reader-meta">⌘K</span>
        </button>
        <SettingsMenu reading={reading} />
      </div>
    </header>
  )
}
