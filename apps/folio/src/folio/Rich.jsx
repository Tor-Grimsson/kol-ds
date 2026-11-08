/* Folio's rich-text editor (plan W14, Figma 238:14996 · 243:215 · 243:216): a document written like a word processor
   and saved as .html. Header · menus · formatting toolbar · ruler · the page · footer, 1:1 from the frame. The page is
   a contentEditable; formatting goes through the browser's editing commands, so ⌘Z / ⇧⌘Z are the browser's own
   history. Fonts come from Google Fonts (google-fonts.json, scripts/google-fonts.mjs); the families a document uses are
   saved with it as one <link>, so the reader loads them too. */
import { useEffect, useMemo, useRef, useState } from 'react'
import { IconLoader, ModalShell } from '@kolkrabbi/kol-component'
import { Choice } from './Chrome'
import { useSettings } from './settings'
import GOOGLE from './google-fonts.json'

/* ── fonts ── */
const SYSTEM = [['Inter', 'Sans Serif', '400 400i 700 700i'], ['Arial', 'Sans Serif', '400 400i 700 700i'], ['Georgia', 'Serif', '400 400i 700 700i'], ['Helvetica', 'Sans Serif', '400 400i 700 700i'], ['Times New Roman', 'Serif', '400 400i 700 700i']]
const SYSTEM_NAMES = new Set(SYSTEM.map(([f]) => f))
export const FONTS = [...SYSTEM, ...GOOGLE.filter(([f]) => !SYSTEM_NAMES.has(f))]
const WEIGHT = { 100: 'Thin', 200: 'Extra Light', 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'Semi Bold', 700: 'Bold', 800: 'Extra Bold', 900: 'Black' }
const styleName = (v) => { const w = parseInt(v, 10); const i = v.endsWith('i'); return w === 400 && i ? 'Italic' : `${WEIGHT[w] ?? w}${i ? ' Italic' : ''}` }
const isGoogle = (family) => !SYSTEM_NAMES.has(family) && GOOGLE.some(([f]) => f === family)
const cssUrl = (families) => `https://fonts.googleapis.com/css2?${families.map((f) => {
  const v = (GOOGLE.find(([g]) => g === f)?.[2] ?? '400').split(' ')
  const pairs = v.map((x) => [x.endsWith('i') ? 1 : 0, parseInt(x, 10)]).sort((a, b) => a[0] - b[0] || a[1] - b[1])
  return `family=${encodeURIComponent(f).replace(/%20/g, '+')}:ital,wght@${pairs.map((p) => p.join(',')).join(';')}`
}).join('&')}&display=swap`
/* load a family into this page (once) */
const loaded = new Set()
export function loadFont(family) {
  if (!isGoogle(family) || loaded.has(family)) return
  loaded.add(family)
  document.head.appendChild(Object.assign(document.createElement('link'), { rel: 'stylesheet', href: cssUrl([family]) }))
}
/* the Google families a document uses → one <link> saved at its head; strip it again on load */
const FONT_LINK = /^<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>\n?/
export const familiesIn = (html) => [...new Set([...html.matchAll(/font-family:\s*&quot;([^&]+)&quot;|font-family:\s*"([^"]+)"|font-family:\s*([^;",]+)/g)].map((m) => (m[1] ?? m[2] ?? m[3]).trim()))].filter(isGoogle)
export const withFonts = (html) => { const f = familiesIn(html); return f.length ? `<link rel="stylesheet" href="${cssUrl(f)}">\n${html}` : html }
export const withoutFonts = (html) => html.replace(FONT_LINK, '')

/* ── the editing commands ── */
const run = (cmd, value) => { document.execCommand('styleWithCSS', false, true); document.execCommand(cmd, false, value) }
/* style the selection (a span around it); with nothing selected, the block the caret is in.
   ponytail: a selection across paragraphs is wrapped as one span — fine for runs of text, not for a whole multi-block range */
function styleSelection(page, css) {
  const sel = getSelection()
  if (!sel.rangeCount || !page.contains(sel.anchorNode)) return
  if (sel.isCollapsed) { const b = blockOf(page, sel.anchorNode); if (b) Object.assign(b.style, css); page.dispatchEvent(new Event('input', { bubbles: true })); return }
  const box = document.createElement('div')
  box.appendChild(sel.getRangeAt(0).cloneContents())
  /* the browser's insertHTML keeps it one undo step but rewrites inline styles (it drops font-style) — so the span goes
     in marked and takes its style after */
  document.execCommand('insertHTML', false, `<span data-rich-new>${box.innerHTML}</span>`)
  for (const el of page.querySelectorAll('[data-rich-new]')) { Object.assign(el.style, css); el.removeAttribute('data-rich-new') }
}
const blockOf = (page, node) => { let n = node?.nodeType === 1 ? node : node?.parentElement; while (n && n.parentElement !== page) n = n.parentElement; return n === page ? null : n }
/* the blocks the selection touches */
function blocksIn(page) {
  const sel = getSelection()
  if (!sel.rangeCount) return []
  const r = sel.getRangeAt(0)
  return [...page.children].filter((b) => r.intersectsNode(b))
}

/* ── small parts (the frame's Button nav md · Dropdown outline md) ── */
const Nav = ({ children, className = '', ...rest }) => (
  <button type="button" onMouseDown={(e) => e.preventDefault()} {...rest} className={`kol-reader-meta flex h-[32px] items-center justify-center rounded-[4px] px-[16px] text-folio-ink hover:bg-folio-surface aria-pressed:bg-folio-mint aria-pressed:text-folio-green disabled:opacity-40 ${className}`}>{children}</button>
)
const Drop = ({ children, w, ...rest }) => (
  <Choice {...rest} className={`kol-reader-meta h-[32px] justify-between rounded-[4px] border border-folio-rule px-[12px] ${w}`}>{children}</Choice>
)
const Rule = () => <span className="mx-[10px] h-[24px] w-px shrink-0 bg-folio-rule" />
const Align = ({ kind, on, onClick }) => {
  const w = { left: [17, 12, 17, 12], center: [17, 12, 17, 12], right: [17, 12, 17, 12], justify: [17, 17, 17, 17] }[kind]
  return (
    <button type="button" aria-label={`Align ${kind}`} aria-pressed={on} onMouseDown={(e) => e.preventDefault()} onClick={onClick} className={`relative size-[32px] shrink-0 rounded-[4px] ${on ? 'bg-folio-mint text-folio-green' : 'text-folio-ink hover:bg-folio-surface'}`}>
      {w.map((width, i) => <span key={i} className="absolute h-[1.5px] bg-current" style={{ width, top: 8 + i * 5, left: kind === 'center' ? (32 - width) / 2 : kind === 'right' ? 25 - width : 8 }} />)}
    </button>
  )
}
const Dialog = ({ title, onClose, children, footer }) => (
  <div className="fixed inset-0 z-50 flex items-start justify-center bg-[rgb(38_41_34/0.32)] px-[16px] pt-[12vh]" onMouseDown={onClose}>
    <ModalShell variant="bordered" role="dialog" aria-label={title} onMouseDown={(e) => e.stopPropagation()} onKeyDown={(e) => e.key === 'Escape' && onClose()} className="w-[480px] max-w-full overflow-hidden shadow-[0_2px_6px_-2px_rgb(0_0_0/0.3),0_8px_24px_-8px_rgb(0_0_0/0.4)] !border-folio-rule" style={{ background: 'var(--color-folio-paper)', color: 'inherit' }}>
      <div className="flex h-[64px] items-center justify-between border-b border-folio-rule pl-[24px] pr-[22px]">
        <p className="text-[18px] font-semibold leading-[22px]">{title}</p>
        <Nav aria-label="Close" onClick={onClose} className="w-[42px] px-0">×</Nav>
      </div>
      {children}
      {footer}
    </ModalShell>
  </div>
)
const Stepper = ({ label, sub, unit, value, onChange, step = 1 }) => (
  <div className="flex h-[52px] items-center px-[24px]">
    <span className="kol-reader-body w-[170px] text-[14px] leading-[22px]">{label}</span>
    <span className="kol-reader-body w-[106px] text-[14px] leading-[22px] text-folio-muted">{sub}</span>
    <input aria-label={`${label || ''} ${sub || ''}`.trim()} inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} className="kol-reader-meta h-[32px] w-[68px] rounded-[4px] border border-folio-rule bg-folio-paper px-[12px] outline-none focus:border-folio-green" />
    <span className="ml-[10px] flex w-[12px] flex-col">
      <button type="button" aria-label={`More ${label || sub}`} onClick={() => onChange(String(+(+value + step).toFixed(2)))} className="h-[14px] text-folio-ink"><IconLoader name="chevron-up" size={12} /></button>
      <button type="button" aria-label={`Less ${label || sub}`} onClick={() => onChange(String(Math.max(0, +(+value - step).toFixed(2))))} className="h-[14px] text-folio-ink"><IconLoader name="chevron-down" size={12} /></button>
    </span>
    <span className="kol-reader-meta ml-[16px] text-folio-muted">{unit}</span>
  </div>
)

/* ── the font chooser (243:215) ── */
function FontChooser({ family, variant, size, onDone, onClose }) {
  const [q, setQ] = useState('')
  const [f, setF] = useState(family)
  const [v, setV] = useState(variant)
  const list = useMemo(() => { const n = q.trim().toLowerCase(); return (n ? FONTS.filter(([x]) => x.toLowerCase().includes(n)) : FONTS).slice(0, 200) }, [q])
  const styles = (FONTS.find(([x]) => x === f)?.[2] ?? '400').split(' ')
  useEffect(() => { loadFont(f) }, [f])
  const pick = (name) => { setF(name); const s = (FONTS.find(([x]) => x === name)?.[2] ?? '400').split(' '); if (!s.includes(v)) setV(s.includes('400') ? '400' : s[0]) }
  return (
    <Dialog title="Fonts" onClose={onClose}>
      <div className="px-[24px] pt-[16px]">
        <input autoFocus aria-label="Search fonts" placeholder="Search fonts" value={q} onChange={(e) => setQ(e.target.value)} className="kol-reader-meta h-[32px] w-full rounded-[4px] border border-folio-rule bg-folio-paper px-[16px] text-[14px] outline-none placeholder:text-folio-ink/50 focus:border-folio-green" />
      </div>
      <div className="mt-[16px] grid h-[196px] grid-cols-[264px_1fr]">
        <div className="flex min-h-0 flex-col border-r border-folio-rule">
          <p className="kol-reader-meta px-[24px] pb-[10px] text-folio-muted">Family, {FONTS.length} on Google Fonts</p>
          <div role="listbox" aria-label="Family" className="min-h-0 flex-1 overflow-y-auto pl-[16px] pr-[8px]">
            {list.map(([name, cat]) => (
              <button key={name} type="button" role="option" aria-selected={name === f} onClick={() => pick(name)} className={`flex h-[32px] w-full items-center justify-between px-[12px] text-left text-[14px] leading-[22px] ${name === f ? 'bg-folio-mint text-folio-green' : 'hover:bg-folio-surface'}`}>
                <span className="truncate">{name}</span><span className="kol-reader-meta-sm shrink-0 text-folio-muted">{SYSTEM_NAMES.has(name) ? '' : cat}</span>
              </button>
            ))}
            {!list.length && <p className="kol-reader-meta px-[12px] py-[8px] text-folio-muted">No family matches “{q}”.</p>}
          </div>
        </div>
        <div className="flex min-h-0 flex-col">
          <p className="kol-reader-meta px-[16px] pb-[10px] text-folio-muted">Style</p>
          <div role="listbox" aria-label="Style" className="min-h-0 flex-1 overflow-y-auto px-[8px]">
            {styles.map((s) => (
              <button key={s} type="button" role="option" aria-selected={s === v} onClick={() => setV(s)} style={{ fontFamily: `"${f}"`, fontWeight: parseInt(s, 10), fontStyle: s.endsWith('i') ? 'italic' : 'normal' }} className={`flex h-[32px] w-full items-center px-[12px] text-left text-[14px] leading-[22px] ${s === v ? 'bg-folio-mint text-folio-green' : 'hover:bg-folio-surface'}`}>{styleName(s)}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-[12px] flex items-end justify-between border-t border-folio-rule px-[24px] pb-[24px] pt-[16px]">
        <div>
          <p className="text-[20px] leading-[28px]" style={{ fontFamily: `"${f}"`, fontWeight: parseInt(v, 10), fontStyle: v.endsWith('i') ? 'italic' : 'normal' }}>The quick brown fox</p>
          <p className="kol-reader-meta mt-[8px] text-folio-muted">{`${f} ${styleName(v)}, ${size} pt`}</p>
        </div>
        <button type="button" onClick={() => onDone(f, v)} className="kol-reader-meta h-[32px] rounded-[4px] bg-folio-green px-[16px] text-folio-paper">Done</button>
      </div>
    </Dialog>
  )
}

/* ── paragraph spacing (243:216) ── */
function SpacingDialog({ initial, onApply, onClose }) {
  const [s, set] = useState(initial)
  const field = (k) => ({ value: s[k], onChange: (v) => set({ ...s, [k]: v }) })
  return (
    <Dialog title="Paragraph spacing" onClose={onClose} footer={
      <div className="flex h-[80px] items-center justify-end gap-[28px] border-t border-folio-rule pr-[33px]">
        <Nav onClick={onClose}>Cancel</Nav>
        <button type="button" onClick={() => onApply(s)} className="kol-reader-meta h-[32px] rounded-[4px] bg-folio-green px-[16px] text-folio-paper">Apply</button>
      </div>
    }>
      <div className="py-[16px]">
        <Stepper label="Line height multiple" unit="times" step={0.05} {...field('multiple')} />
        <Stepper label="Minimum line height" unit="pt" {...field('min')} />
        <Stepper label="Maximum line height" unit="pt" {...field('max')} />
        <Stepper label="Inter-line spacing" unit="pt" {...field('inter')} />
        <span className="mx-[24px] my-[10px] block h-px bg-folio-rule" />
        <Stepper label="Paragraph spacing" sub="Before" unit="pt" {...field('before')} />
        <Stepper label="" sub="After" unit="pt" {...field('after')} />
      </div>
    </Dialog>
  )
}
/* line height = multiple × size + inter-line spacing, held between the minimum and maximum (0 = none) */
function applySpacing(blocks, { multiple, min, max, inter, before, after }) {
  for (const b of blocks) {
    const fs = parseFloat(getComputedStyle(b).fontSize)
    let lh = (+multiple || 1) * fs * 1.25 + (+inter || 0)
    if (+min) lh = Math.max(lh, +min)
    if (+max) lh = Math.min(lh, +max)
    Object.assign(b.style, { lineHeight: `${Math.round(lh * 100) / 100}px`, marginTop: `${+before || 0}px`, marginBottom: `${+after || 0}px` })
    b.dataset.spacing = multiple
  }
}

/* ── the ruler: a tick every 16px, a number every 64 (one per "cm"), markers at the margins ── */
const Ruler = ({ width }) => (
  <div className="relative h-[40px] shrink-0 overflow-hidden border-b border-folio-rule bg-folio-surface" aria-hidden>
    <div className="absolute inset-y-0" style={{ left: 'var(--rich-left)', width }}>
      {[[64, 0, 10, 'muted'], [64, 32, 7, 'rule'], [16, 0, 4, 'rule']].map(([every, at, h, c]) => (
        <div key={`${every}${at}`} className="absolute inset-x-0 top-0" style={{ height: h, left: at, backgroundImage: `repeating-linear-gradient(90deg, var(--color-folio-${c}) 0 1px, transparent 1px ${every}px)` }} />
      ))}
      {Array.from({ length: Math.floor(width / 64) + 1 }, (_, i) => <span key={i} className="kol-reader-meta absolute top-[15px] -translate-x-1/2 text-folio-muted" style={{ left: i * 64 }}>{i}</span>)}
      <span className="absolute top-0 -translate-x-1/2 text-[10px] leading-[12px] text-folio-green">▼</span>
      <span className="absolute top-0 -translate-x-1/2 text-[10px] leading-[12px] text-folio-green" style={{ left: width }}>▼</span>
    </div>
  </div>
)

/* the views (W14.5): wrap fills the window; one up is a page; two up a spread, the text running on into the second page */
const VIEWS = [['wrap', 'Wrap'], ['one', 'One up'], ['two', 'Two up']]
const PAGE = 794


/* the rich editor's own parts — its menus' items, the formatting toolbar, the ruler and page, the page view and zoom —
   handed to the editor's one shell (W16, EditorChrome.jsx) through `children`, so every format wears the same chrome */
export default function Rich({ source, onInput, find, repl, matchCase, onFind, onSave, onPlain, children }) {
  const page = useRef(null)
  const canvas = useRef(null)
  const { hidden = {} } = useSettings()
  const [st, setSt] = useState({})
  const [view, setView] = useState(() => { try { return localStorage.getItem('folio-rich-view') || 'wrap' } catch { return 'wrap' } })
  const [zoom, setZoom] = useState(100)
  const [dialog, setDialog] = useState(null)
  const [color, setColor] = useState('#262922')
  const [width, setWidth] = useState(1280)
  const saved = useRef(null)

  /* the page's content is set once; after that it is the page's own (an uncontrolled editor) */
  useEffect(() => {
    const html = withoutFonts(source || '')
    page.current.innerHTML = html.trim() ? html : '<p><br></p>'
    familiesIn(html).forEach(loadFont)
    document.execCommand('defaultParagraphSeparator', false, 'p')
    page.current.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => { try { localStorage.setItem('folio-rich-view', view) } catch { /* blocked */ } }, [view])
  const [room, setRoom] = useState(1440)
  useEffect(() => {
    const ro = new ResizeObserver(() => { if (!page.current || !canvas.current) return; setWidth(page.current.clientWidth - 112); setRoom(canvas.current.clientWidth) })
    ro.observe(page.current); ro.observe(canvas.current)
    return () => ro.disconnect()
  }, [])

  /* the toolbar follows the caret */
  useEffect(() => {
    const read = () => {
      const sel = getSelection()
      if (!sel.rangeCount || !page.current?.contains(sel.anchorNode)) return
      saved.current = sel.getRangeAt(0).cloneRange()
      const el = sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement
      const cs = getComputedStyle(el)
      const q = (c) => document.queryCommandState(c)
      const block = blockOf(page.current, el)
      setSt({
        bold: q('bold'), italic: q('italic'), underline: q('underline'), strike: q('strikeThrough'),
        align: q('justifyCenter') ? 'center' : q('justifyRight') ? 'right' : q('justifyFull') ? 'justify' : 'left',
        list: q('insertUnorderedList') ? 'ul' : q('insertOrderedList') ? 'ol' : 'none',
        family: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
        weight: parseInt(cs.fontWeight, 10), ital: cs.fontStyle === 'italic',
        size: Math.round(parseFloat(cs.fontSize)),
        spacing: block?.dataset.spacing ?? '1.0',
      })
    }
    document.addEventListener('selectionchange', read)
    return () => document.removeEventListener('selectionchange', read)
  }, [])

  const changed = () => onInput(page.current.innerHTML)
  /* every command acts on the page's selection — put it back first when a dialog or a field had the focus */
  const act = (fn) => () => {
    const away = document.activeElement !== page.current
    page.current.focus()
    if (away && saved.current) { const s = getSelection(); s.removeAllRanges(); s.addRange(saved.current) }
    fn(); changed()
  }
  const cmd = (c, v) => act(() => run(c, v))
  const variant = `${st.weight ?? 400}${st.ital ? 'i' : ''}`
  const setFont = (family, v = variant) => act(() => { loadFont(family); styleSelection(page.current, { fontFamily: `"${family}"`, fontWeight: parseInt(v, 10), fontStyle: v.endsWith('i') ? 'italic' : 'normal' }) })()
  const setStyle = (v) => act(() => styleSelection(page.current, { fontWeight: parseInt(v, 10), fontStyle: v.endsWith('i') ? 'italic' : 'normal' }))()
  const setSize = (px) => act(() => styleSelection(page.current, { fontSize: `${px}px` }))()
  const setSpacing = (s) => act(() => applySpacing(blocksIn(page.current).length ? blocksIn(page.current) : [blockOf(page.current, saved.current?.startContainer)].filter(Boolean), s))()
  const text = page.current?.innerText ?? withoutFonts(source).replace(/<[^>]+>/g, ' ')
  const stats = { words: (text.match(/[\p{L}\p{N}’'-]+/gu) ?? []).length, chars: text.replace(/\n/g, '').length, lines: page.current ? page.current.children.length : 1 }

  /* find & replace on the page (the browser's own find, inside the page) */
  const look = (back) => window.find(find, matchCase, back, false) && page.current.contains(getSelection().anchorNode)
  const next = (back = false) => { if (!find) return; page.current.focus(); if (!look(back)) { const r = document.createRange(); r.selectNodeContents(page.current); r.collapse(!back); const s = getSelection(); s.removeAllRanges(); s.addRange(r); look(back) } }
  const same = (a) => (matchCase ? a === find : a.toLowerCase() === find.toLowerCase())
  const replaceOne = () => { const s = getSelection(); if (find && same(s.toString()) && page.current.contains(s.anchorNode)) { document.execCommand('insertText', false, repl); changed() } next() }
  const replaceAll = () => { if (!find) return; page.current.focus(); getSelection().collapse(page.current, 0); let n = 0; while (n < 2000 && look(false)) { document.execCommand('insertText', false, repl); n++ } changed() }
  const found = find ? (text.match(new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), matchCase ? 'g' : 'gi')) ?? []).length : null

  const onKey = (e) => {
    const k = e.key.toLowerCase()
    if (!(e.metaKey || e.ctrlKey)) return
    if (k === 't' && e.shiftKey) { e.preventDefault(); onPlain(); return }
    if (k === 's') { e.preventDefault(); onSave() }
    if (k === 'f') { e.preventDefault(); onFind() }
    if (k === 'u') { e.preventDefault(); cmd('underline')() }
  }

  const menus = {
    edit: [['Cut', cmd('cut'), '⌘X'], ['Copy', cmd('copy'), '⌘C'], ['Select all', cmd('selectAll'), '⌘A']],
    insert: [['Link…', act(() => { const u = prompt('Link to'); if (u) run('createLink', u) }), '⌘K'], ['Image from a link…', act(() => { const u = prompt('Image link'); if (u) run('insertImage', u) })], ['Horizontal rule', cmd('insertHorizontalRule')], '-', ['Bulleted list', cmd('insertUnorderedList')], ['Numbered list', cmd('insertOrderedList')]],
    format: [['Bold', cmd('bold'), '⌘B'], ['Italic', cmd('italic'), '⌘I'], ['Underline', cmd('underline'), '⌘U'], ['Strikethrough', cmd('strikeThrough')], '-', ['Heading 1', cmd('formatBlock', 'h1')], ['Heading 2', cmd('formatBlock', 'h2')], ['Heading 3', cmd('formatBlock', 'h3')], ['Paragraph', cmd('formatBlock', 'p')], ['Quote', cmd('formatBlock', 'blockquote')], '-', ['Paragraph spacing…', () => setDialog('spacing')], ['Fonts…', () => setDialog('fonts')], ['Clear formatting', cmd('removeFormat')]],
    view: [...VIEWS.map(([v, l]) => [l, () => setView(v), '', view === v]), '-', ['Zoom in', () => setZoom((z) => Math.min(200, z + 10))], ['Zoom out', () => setZoom((z) => Math.max(50, z - 10))], ['Actual size', () => setZoom(100)]],
    help: [['Bold, italic, underline', null, '⌘B ⌘I ⌘U']],
  }

  const toolbar = <>
    <Drop label="Font" w="w-[110px]" value={st.family ?? 'Inter'} onChange={(v) => (v === '…' ? setDialog('fonts') : setFont(v))} options={[...new Set([st.family ?? 'Inter', 'Inter', 'Arial', 'Georgia', 'Helvetica', 'Times New Roman'])].map((f) => [f, f]).concat([['…', 'More fonts…']])} />
    <Drop label="Style" w="w-[111px]" value={variant} onChange={setStyle} options={(FONTS.find(([f]) => f === st.family)?.[2] ?? '400 400i 700 700i').split(' ').map((v) => [v, styleName(v)])} />
    <Drop label="Size" w="w-[97px]" value={st.size ?? 16} onChange={setSize} options={[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72].map((n) => [n, `${n} pt`])} />
    <Rule />
    <Nav aria-label="Bold" aria-pressed={!!st.bold} onClick={cmd('bold')} className="w-[44px] px-0 font-bold">B</Nav>
    <Nav aria-label="Italic" aria-pressed={!!st.italic} onClick={cmd('italic')} className="w-[38px] px-0 italic">I</Nav>
    <Nav aria-label="Underline" aria-pressed={!!st.underline} onClick={cmd('underline')} className="w-[46px] px-0 underline">U</Nav>
    <Nav aria-label="Strikethrough" aria-pressed={!!st.strike} onClick={cmd('strikeThrough')} className="w-[44px] px-0 line-through">S</Nav>
    <label aria-label="Text colour" className="relative flex h-[32px] w-[43px] shrink-0 cursor-pointer items-center justify-center rounded-[4px] hover:bg-folio-surface">
      <span className="kol-reader-meta -mt-[4px]">A</span>
      <span className="absolute bottom-[4px] left-[8px] h-[3px] w-[27px]" style={{ background: color }} />
      <input type="color" value={color} onChange={(e) => { setColor(e.target.value); cmd('foreColor', e.target.value)() }} className="absolute inset-0 cursor-pointer opacity-0" />
    </label>
    <Rule />
    <div className="flex gap-[2px]">{['left', 'center', 'right', 'justify'].map((a) => <Align key={a} kind={a} on={(st.align ?? 'left') === a} onClick={cmd({ left: 'justifyLeft', center: 'justifyCenter', right: 'justifyRight', justify: 'justifyFull' }[a])} />)}</div>
    <span className="w-[6px] shrink-0" />
    <Drop label="List" w="w-[102px]" value={st.list ?? 'none'} onChange={(v) => cmd(v === 'ol' || (v === 'none' && st.list === 'ol') ? 'insertOrderedList' : 'insertUnorderedList')()} options={[['none', '•  List'], ['ul', '•  Bulleted'], ['ol', '1.  Numbered']]} />
    <Drop label="Spacing" w="w-[136px]" value={st.spacing ?? '1.0'} onChange={(v) => (v === 'custom' ? setDialog('spacing') : setSpacing({ multiple: v, min: 0, max: 0, inter: 0, before: 0, after: 0 }))} options={[['1.0', 'Spacing  1.0'], ['1.15', 'Spacing  1.15'], ['1.5', 'Spacing  1.5'], ['2.0', 'Spacing  2.0'], ['custom', 'Custom…']]} />
    <Nav onClick={() => setDialog('fonts')}>Fonts…</Nav>
  </>

  const pageClass = view === 'wrap' ? 'min-h-full w-full px-[56px] py-[32px]'
    : view === 'one' ? 'mx-auto my-[40px] min-h-[1123px] px-[80px] py-[72px] shadow-[0_2px_6px_-2px_rgb(0_0_0/0.18),0_8px_24px_-8px_rgb(0_0_0/0.22)]'
      /* page one fills before page two (column-fill auto on a page's height).
         ponytail: past two pages the text runs on to the right; real pagination when a document gets that long */
      : 'mx-auto my-[40px] h-[1123px] px-[80px] py-[72px] [column-count:2] [column-fill:auto] [column-gap:160px] [column-rule:1px_solid_var(--color-folio-rule)] shadow-[0_2px_6px_-2px_rgb(0_0_0/0.18),0_8px_24px_-8px_rgb(0_0_0/0.22)]'
  const pageWidth = view === 'wrap' ? undefined : view === 'one' ? PAGE : PAGE * 2
  /* a page or a spread wider than the window is fitted to it, then zoomed */
  const scale = (zoom / 100) * (pageWidth ? Math.min(1, (room - 80) / pageWidth) : 1)

  const surface = (
    <div ref={canvas} className="flex min-h-0 flex-1 flex-col overflow-hidden" style={{ '--rich-left': view === 'wrap' ? `${56 * scale}px` : `${Math.max(0, (room - pageWidth * scale) / 2) + 80 * scale}px` }}>
      {!hidden.ruler && <Ruler width={(view === 'wrap' ? width : (pageWidth - 160)) * scale} />}
      <div className={`min-h-0 flex-1 overflow-auto ${view === 'wrap' ? 'bg-[var(--folio-page)]' : 'bg-folio-surface'}`}>
        <div ref={page} contentEditable suppressContentEditableWarning spellCheck aria-label="Document" role="textbox" aria-multiline
          onInput={changed} onKeyDown={onKey} onBlur={changed}
          style={{ zoom: scale, width: pageWidth }}
          className={`rich-page bg-[var(--folio-page)] text-[16px] leading-[1.25] text-[var(--folio-page-ink)] caret-folio-ink outline-none [&_a]:text-folio-green [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-folio-rule [&_blockquote]:pl-[16px] [&_h1]:mb-[12px] [&_h1]:text-[32px] [&_h1]:font-bold [&_h1]:leading-[1.15] [&_h2]:mb-[10px] [&_h2]:text-[24px] [&_h2]:font-semibold [&_h3]:mb-[8px] [&_h3]:text-[19px] [&_h3]:font-semibold [&_hr]:my-[16px] [&_hr]:border-folio-rule [&_img]:max-w-full [&_ol]:list-decimal [&_ol]:pl-[24px] [&_p]:mb-[8px] [&_ul]:list-disc [&_ul]:pl-[24px] ${pageClass}`} />
      </div>
    </div>
  )

  const status = <>
    <Choice label="Page view" align="bottom-right" value={view} onChange={setView} options={VIEWS} className="kol-reader-meta" />
    <span className="flex items-center">
      <Nav aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(50, z - 10))} className="w-[32px] px-0">−</Nav>
      <span className="kol-reader-meta w-[48px] text-center tabular-nums">{zoom}%</span>
      <Nav aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(200, z + 10))} className="w-[32px] px-0">+</Nav>
    </span>
  </>

  return <>
    {children({ menus, toolbar, surface, status, stats, undo: cmd('undo'), redo: cmd('redo'), find: { count: find ? (found ? `${found} found` : 'none') : '', next: () => next(), prev: () => next(true), replaceOne, replaceAll } })}
    {dialog === 'fonts' && <FontChooser family={st.family ?? 'Inter'} variant={variant} size={st.size ?? 16} onClose={() => setDialog(null)} onDone={(f, v) => { setDialog(null); setFont(f, v) }} />}
    {dialog === 'spacing' && <SpacingDialog initial={{ multiple: st.spacing ?? '1.0', min: '0', max: '0', inter: '0', before: '0', after: '0' }} onClose={() => setDialog(null)} onApply={(s) => { setDialog(null); setSpacing(s) }} />}
  </>
}
