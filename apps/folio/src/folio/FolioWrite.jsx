/* Folio — the document editor (Figma 234:14649 · 236:1146), /demo-4/new and /demo-4/edit/<collection>/<id>. Source and
   preview side by side (Write · Split · Preview), Markdown shortcuts, autosave, Export (.md) and Done. Built locally in the
   Folio look; the frame's Input · Button · SegmentedToggle are local here too. Writes go through record's dev server
   (vite.config.js folioEditPlugin), so the editor lives on his machine only. */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import Rich, { withFonts, withoutFonts } from './Rich'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Icon } from './parts'
import { SHELVES, findDoc } from './shelf'
import { Frame, Masthead, SearchOverlay, useSearchKey, Choice } from './Chrome'
import { ago, useSKey, useSettings, setSettings, CanvasTheme } from './settings'
import Fence, { fenceOf, CodeLine, CODE_LANGS, prismOf } from './Fence'
import { MenuBar, ToolRow, FindBar, StatusBar, NewOverlay, LibraryTree, ContextMenu, CommandPalette, Tool as Btn } from './EditorChrome'
import CodeEditor, { formatDocument } from './CodeEditor'
import { undo as cmUndo, redo as cmRedo, toggleComment, selectAll as cmSelectAll } from '@codemirror/commands'
import { foldAll, unfoldAll } from '@codemirror/language'
import { nextDiagnostic, openLintPanel } from '@codemirror/lint'
import { Figure, ImagePicker, embeds, pastedImage } from './Media'
import { urlOf } from './shelf'
import { client } from './client'

/* the data seam (client.js): record's dev-server endpoints, now the client's verbs */
const post = (verb, body) => client()[verb](body)

/* the source, line by line, with the Markdown marks in the accent (the frame's green lines) */
const MARKED = /^(#{1,6}\s|>|```|\[.*\]\(.*\)\s*$)/
/* inside a line: `code`, **bold**, *italic*, [links](…) — same characters, only coloured, so the caret stays aligned */
const TOKEN = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)]*\))/g
const Tokens = ({ line }) => line.split(TOKEN).map((part, i) => (i % 2 ? <span key={i} className="text-folio-green">{part}</span> : part))
const STARTER = '# Untitled\n\nA first line.\n'
const BUCKET_LABEL = { r2: 'Media', private: 'Private' }
/* three formats (user, 2026-11-04: "Markdown, Text, Code"); Text is rich or plain, switched any time like TextEdit's
   Make Plain Text ⇧⌘T — not a choice made once */
const FORMATS = [['md', 'Markdown'], ['text', 'Text'], ['code', 'Code']]
const kindOf = (f) => (f === 'rich' || f === 'txt' ? 'text' : f)
const toPlain = (html) => { const d = document.createElement('div'); d.innerHTML = html.replace(/<\/(p|h\d|li|blockquote|div)>/gi, '$&\n'); return (d.textContent ?? '').replace(/\n{3,}/g, '\n\n') }
/* a new file's first lines, per format and language (16.4) */
const CODE_START = { js: '// untitled.js\n\n', jsx: 'export default function Untitled() {\n  return <div />\n}\n', ts: '// untitled.ts\n\n', json: '{\n  \n}\n', css: '/* untitled.css */\n\n', py: '# untitled.py\n\n', sh: '#!/usr/bin/env bash\n\n', yaml: '# untitled.yaml\n\n' }
const starterOf = (f, ext) => (f === 'md' ? STARTER : f === 'code' ? CODE_START[ext] ?? '' : '')
const extOf = (f, ext) => ({ md: 'md', txt: 'txt', rich: 'html' }[f] ?? ext)
/* code: brackets and quotes close themselves */
const PAIRS = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' }
const toRich = (text) => text.replace(/\n$/, '').split('\n').map((l) => `<p>${l ? l.replace(/&/g, '&amp;').replace(/</g, '&lt;') : '<br>'}</p>`).join('')

/* a source line with every find match marked (same characters, so the caret stays aligned) */
const Found = ({ line, finder }) => {
  finder.lastIndex = 0
  const parts = []
  let at = 0
  for (const m of line.matchAll(finder)) {
    parts.push(line.slice(at, m.index), <mark key={m.index} className="rounded-[2px] bg-[color-mix(in_oklab,var(--color-folio-green)_30%,transparent)] text-inherit">{m[0]}</mark>)
    at = m.index + m[0].length
  }
  parts.push(line.slice(at))
  return parts
}

/* one Markdown shortcut: wrap the selection, or start the line */
const SHORTCUTS = [
  { label: 'Heading', icon: 'heading-6', line: '## ' },
  { label: 'Bold', icon: 'bold', wrap: ['**', '**'] },
  { label: 'Italic', icon: 'italic-a', wrap: ['*', '*'] },
  { label: 'Link', icon: 'link', wrap: ['[', '](https://)'] },
  { label: 'List', icon: 'list-bullet', line: '- ' },
  { label: 'Code', icon: 'code', wrap: ['`', '`'] },
  /* a fence: ``` and the language on the first line, the code, ``` on its own line */
  { label: 'Code block', icon: 'code', block: true },
]

/* the preview, set as the frame's right pane */
const PREVIEW = {
  h1: ({ children }) => <h1 className="text-[34px] font-bold leading-[38px] tracking-[-1.2px]">{children}</h1>,
  h2: ({ children }) => <h2 className="mt-[16px] text-[20px] font-bold leading-[26px]">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-[8px] text-[16px] font-bold leading-[22px]">{children}</h3>,
  p: ({ node, children }) => (node?.children?.length === 1 && node.children[0].tagName === 'img' ? <>{children}</> : <p className="text-[14px] leading-[22px] [h1+&]:text-folio-muted">{children}</p>),
  ul: ({ children }) => <ul className="flex list-disc flex-col pl-[18px] text-[14px] leading-[28px] marker:text-folio-ink">{children}</ul>,
  ol: ({ children }) => <ol className="flex list-decimal flex-col pl-[18px] text-[14px] leading-[28px]">{children}</ol>,
  strong: ({ children }) => <b className="font-semibold">{children}</b>,
  blockquote: ({ children }) => <blockquote className="border-l-2 border-folio-green bg-folio-mint px-[20px] py-[13px] text-[14px] leading-[22px] text-folio-green [&_p]:text-folio-green">{children}</blockquote>,
  pre: ({ children }) => {
    const fence = fenceOf(children)
    return fence ? <Fence {...fence} /> : <pre className="overflow-x-auto bg-[color-mix(in_oklab,var(--color-folio-ink)_6%,var(--color-folio-paper))] px-[16px] py-[12px] font-[family-name:var(--kol-font-family-mono)] text-[12px] leading-[24px] [&_code]:bg-transparent [&_code]:p-0">{children}</pre>
  },
  code: ({ children }) => <code className="rounded-[3px] bg-[color-mix(in_oklab,var(--color-folio-ink)_8%,transparent)] px-[5px] py-[1px] font-[family-name:var(--kol-font-family-mono)] text-[12px]">{children}</code>,
  a: ({ href, children }) => <a href={href} target="_blank" rel="noreferrer" className="text-[14px] leading-[22px] text-folio-green underline">{children}</a>,
  table: ({ children }) => <table className="w-full border-collapse text-[13px]">{children}</table>,
  th: ({ children }) => <th className="border-b border-folio-ink py-[6px] pr-[12px] text-left">{children}</th>,
  td: ({ children }) => <td className="border-b border-folio-rule py-[6px] pr-[12px] align-top">{children}</td>,
  hr: () => <hr className="border-folio-rule" />,
  img: (props) => <Figure {...props} />,
}

/* a local Input, Button and SegmentedToggle at the frame's sizes (32px tall, 3px corners) */
const Field = (props) => <input {...props} className={`kol-reader-meta h-[32px] rounded-[3px] border border-folio-rule bg-folio-paper px-[10px] text-folio-ink outline-none focus:border-folio-green ${props.className ?? ''}`} />
const Tool = ({ icon, children, ...rest }) => (
  <button type="button" {...rest} className="kol-reader-meta flex h-[32px] shrink-0 items-center gap-[8px] whitespace-nowrap rounded-[3px] px-[10px] font-semibold text-folio-ink hover:bg-folio-surface">
    {icon && <Icon name={icon} />}{children}
  </button>
)

/* the shortcut reference the rail lists */
const KEYS = [
  ['Heading', '## Title', ''], ['Bold', '**text**', '⌘B'], ['Italic', '*text*', '⌘I'], ['Link', '[text](url)', '⌘K'],
  ['List', '- item', ''], ['Inline code', '`code`', ''], ['Code block', '``` … ```', ''], ['Quote', '> text', ''],
  ['Image', '![caption](url)', ''], ['Image from the bucket', '![[name.png]]', ''], ['… with a width', '![[name.png|300]]', ''], ['… with a caption', '![[name.png|Caption]]', ''],
  ['Save now', '', '⌘S'], ['Shortcuts (opens the rail)', '', 'S or ⌥S'], ['Settings rail', '', ','],
]

/* the Rail's Shortcuts: [group, [[what, keys, markdown?]]] for the format in front of him */
function shortcutsFor(format) {
  const everywhere = ['Everywhere', [
    ['Save now', '⌘S'], ['Undo', '⌘Z'], ['Redo', '⇧⌘Z'], ['Cut, copy, paste', '⌘X ⌘C ⌘V'], ['Select all', '⌘A'],
    ['Find & replace', '⌘F'], ['Next, previous match', '↩ ⇧↩'], ['Command list', '⇧⌘P or F1'], ['Open the Rail at Shortcuts', 'S or ⌥S'],
    ['The menu for what is under the pointer', 'right-click'],
  ]]
  const bands = ['Show and hide', [['Writing mode', keyOf('W')], ...BANDS.filter(([k]) => k !== 'ruler' || format === 'Rich text').map(([, l, key]) => [l, keyOf(key)])]]
  const own = format === 'Markdown' ? ['Markdown', [
    ['Bold', '⌘B'], ['Italic', '⌘I'], ['Link', '⌘K'], ['Indent, outdent', 'Tab ⇧Tab'],
    ...KEYS.filter(([what]) => !['Save now', 'Shortcuts (opens the rail)', 'Settings rail', 'Bold', 'Italic', 'Link'].includes(what)).map(([what, md, key]) => [what, key, md]),
  ]] : format === 'Rich text' ? ['Text', [
    ['Bold, italic, underline', '⌘B ⌘I ⌘U'], ['Make plain text', '⇧⌘T'],
  ]] : format === 'Plain text' ? ['Text', [
    ['Make rich text', '⇧⌘T'], ['Indent, outdent', 'Tab ⇧Tab'],
  ]] : ['Code', [
    ['Indent, outdent', 'Tab ⇧Tab'], ['Indent, outdent the lines', '⌘] ⌘['], ['Re-indent the selection', '⌥⌘\\'],
    ['Comment line', '⌘/'], ['Block comment', '⇧⌥A'], ['Format document', '⇧⌥F'],
    ['Fold, unfold here', '⌥⌘[ ⌥⌘]'], ['Fold all, unfold all', '⌃⌥[ ⌃⌥]'],
    ['Move line up, down', '⌥↑ ⌥↓'], ['Copy line up, down', '⇧⌥↑ ⇧⌥↓'], ['Delete line', '⇧⌘K'], ['New line below', '⌘↩'],
    ['Matching bracket', '⇧⌘\\'], ['Select the enclosing block', '⌘I'], ['Undo the last selection', '⌘U'],
    ['Next problem', 'F8'], ['List of problems', '⇧⌘M'],
  ]]
  return [own, everywhere, bands]
}

/* Details (user, 2026-11-04: "yes detail button"): the frontmatter the library reads — date, language, description —
   as a form; it writes or updates the --- block at the top and leaves every other line of it as it was */
const FM = /^---\n([\s\S]*?)\n---\n?/
const readFm = (src) => Object.fromEntries((FM.exec(src)?.[1] ?? '').split('\n').map((l) => /^([\w-]+):\s*(.*)$/.exec(l)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
function writeFm(src, fields) {
  const block = FM.exec(src)?.[1] ?? ''
  const lines = block ? block.split('\n') : []
  for (const [k, v] of Object.entries(fields)) {
    const at = lines.findIndex((l) => l.startsWith(`${k}:`))
    const line = `${k}: ${/[:#]/.test(v) ? JSON.stringify(v) : v}`
    if (!v) { if (at >= 0) lines.splice(at, 1) } else if (at >= 0) lines[at] = line; else lines.push(line)
  }
  const rest = src.replace(FM, '')
  return lines.length ? `---\n${lines.join('\n')}\n---\n${rest}` : rest
}
const LANGS = ['is', 'en', 'de']

/* the editor's settings rail (user, 2026-11-04: "siderail settings … where we can reference"): the shortcut reference,
   the details (written live into the --- block) and the document — shelf, format, file, counts. Toggled from the
   toolbar; its open state is kept per viewer. */
function EditorRail({ source, onApply, isMd, shelf, onShelf, format, fileName, words, lines }) {
  const fm = readFm(source)
  const langs = (fm.lang ?? '').toLowerCase().split(/[-,\s]+/).filter(Boolean)
  const set = (fields) => onApply(writeFm(source, { date: fm.date ?? '', lang: langs.join(', '), description: fm.description ?? '', ...fields }))
  const Head = ({ children }) => <p className="kol-reader-label border-b border-folio-ink pb-[10px] text-folio-muted">{children}</p>
  return (
    <aside aria-label="Editor settings" className="flex min-h-0 min-w-0 flex-col gap-[28px] overflow-y-auto overscroll-contain border-l border-folio-rule px-[24px] pb-[40px] pt-[24px]">
      <div className="flex flex-col gap-[10px]">
        <Head>Document</Head>
        <div className="kol-reader-meta flex items-center justify-between gap-[12px]"><span className="text-folio-muted">Shelf</span>
          <Choice label="Shelf" align="right" value={shelf} onChange={onShelf} options={SHELVES.map((x) => [x.id, x.label])} />
        </div>
        <p className="kol-reader-meta flex justify-between"><span className="text-folio-muted">Format</span><span>{format}</span></p>
        <p className="kol-reader-meta flex justify-between gap-[12px]"><span className="text-folio-muted">File</span><span className="truncate">{fileName}</span></p>
        <p className="kol-reader-meta flex justify-between"><span className="text-folio-muted">Length</span><span>{words} words, {lines} lines</span></p>
      </div>
      {isMd && (
        <div className="flex flex-col gap-[12px]">
          <Head>Details</Head>
          <label className="flex flex-col gap-[6px]">
            <span className="kol-reader-meta text-folio-muted">Date</span>
            <Field type="date" value={/^\d{4}-\d{2}-\d{2}$/.test(fm.date ?? '') ? fm.date : ''} onChange={(e) => set({ date: e.target.value })} />
          </label>
          <div className="flex flex-col gap-[6px]">
            <span className="kol-reader-meta text-folio-muted">Language</span>
            <div className="flex gap-[6px]">
              {LANGS.map((l) => {
                const on = langs.includes(l)
                return <button key={l} type="button" aria-pressed={on} onClick={() => set({ lang: (on ? langs.filter((x) => x !== l) : [...langs, l]).join(', ') })} className={`kol-reader-control h-[32px] flex-1 rounded-[3px] border uppercase ${on ? 'border-folio-green bg-folio-mint text-folio-green' : 'border-folio-rule text-folio-muted hover:text-folio-ink'}`}>{l}</button>
              })}
            </div>
          </div>
          <label className="flex flex-col gap-[6px]">
            <span className="kol-reader-meta text-folio-muted">Description</span>
            <textarea value={fm.description ?? ''} onChange={(e) => set({ description: e.target.value })} rows={3} className="kol-reader-meta resize-none rounded-[3px] border border-folio-rule bg-folio-paper p-[10px] text-folio-ink outline-none focus:border-folio-green" />
          </label>
        </div>
      )}
      {/* every key the editor answers to, for this format (user, 2026-11-04: "its called SHORTCUTS") */}
      <div className="flex flex-col gap-[2px]">
        <Head>Shortcuts</Head>
        {shortcutsFor(format).map(([group, rows]) => (
          <div key={group} className="flex flex-col">
            <p className="kol-reader-meta pb-[4px] pt-[14px] font-semibold text-folio-muted">{group}</p>
            {rows.map(([what, keys, md]) => (
              <div key={what} className="kol-reader-meta grid grid-cols-[1fr_auto] items-baseline gap-x-[10px] py-[6px]">
                <span className="font-semibold">{what}{md && keys && <span className="ml-[6px] font-normal text-folio-muted">{keys}</span>}</span>
                {md ? <code className="font-[family-name:var(--kol-font-family-mono)] text-folio-green">{md}</code> : <span className="text-folio-muted">{keys}</span>}
              </div>
            ))}
          </div>
        ))}
        <p className="kol-reader-meta mt-[10px] text-folio-muted">Letters work as they are when you are not typing; while writing, hold ⌥ with the letter.</p>
      </div>
    </aside>
  )
}

/* each open document's working state for this browser session — its source, caret and undo history — so switching
   tabs (13.3) never loses a word; keyed by its address */
/* kept in sessionStorage, so the reload Vite does when a new file joins the library loses nothing */
const SESSION = {
  all() { try { return JSON.parse(sessionStorage.getItem('folio-write') ?? '{}') } catch { return {} } },
  get(k) { return k ? this.all()[k] : undefined },
  set(k, v) {
    const all = this.all()
    all[k] = { ...v, hist: v.hist && { past: v.hist.past.slice(-60), future: v.hist.future.slice(-60), at: 0 } }
    try { sessionStorage.setItem('folio-write', JSON.stringify(all)) } catch { /* full or blocked */ }
  },
  delete(k) { const all = this.all(); delete all[k]; try { sessionStorage.setItem('folio-write', JSON.stringify(all)) } catch { /* blocked */ } },
}
/* a new document keeps its component when its first save gives it an address (no remount, no lost caret) */
export const ALIAS = { from: null, to: null, keys: {} }
const BOOT = Math.random().toString(36).slice(2)
/* addresses a document has left (Text switched rich ⇄ plain) — never re-added as a tab */
const MOVED = new Set()

/* 19.7 — every band shows or hides on one letter, like S and comma: the bare key outside a field, ⌥ and the key while
   writing (user, 2026-11-04: "T tabs H header M menu B toolbar F footer L library rail is , and R ruler"). The Rails
   keep their own settings (Library · Rail buttons); the rest live in `hidden`. */
const BANDS = [['tabs', 'Tabs', 'T'], ['head', 'Document header', 'H'], ['menus', 'Menu bar', 'M'], ['tools', 'Toolbar', 'B'], ['foot', 'Footer', 'F'], ['tree', 'Library', 'L'], ['rail', 'Rail', ','], ['ruler', 'Ruler', 'R']]
const RAILS = { tree: 'editorTree', rail: 'editorRail' }
const flipBand = (k) => setSettings((st) => (RAILS[k] ? { [RAILS[k]]: !st[RAILS[k]] } : { hidden: { ...st.hidden, [k]: !st.hidden?.[k] } }))
/* W — writing mode ("take Tabs, Header and Menu and close rails if open"); W again puts back what was there */
const flipWriting = () => setSettings((st) => (st.writing
  ? { ...st.writing, writing: null }
  : { writing: { hidden: st.hidden ?? {}, editorTree: st.editorTree, editorRail: st.editorRail }, hidden: { ...st.hidden, tabs: true, head: true, menus: true }, editorTree: false, editorRail: false }))
const keyOf = (key) => (key === ',' ? ',' : `${key} or ⌥${key}`)

/* the document tabs (13.3), kept per viewer: [{ path, label }] */
function useTabs(path, label) {
  const { openDocs = [] } = useSettings()
  useEffect(() => {
    if (!path || MOVED.has(path)) return
    setSettings((st) => {
      const list = st.openDocs ?? []
      const at = list.findIndex((t) => t.path === path)
      const tab = { path, label }
      const next = at >= 0 ? list.map((t, i) => (i === at ? tab : t)) : [...list, tab]
      /* a bare /demo-4/new tab (before 19.1 gave each new document its own address) leads nowhere — dropped */
      return { openDocs: next.filter((t, i) => t.path !== '/new' && next.findIndex((x) => x.path === t.path) === i) }
    })
  }, [path, label])
  return openDocs
}

/* each document its own editor: an address is its key; every visit to /demo-4/new is a new document (the router's
   location key), and a new document keeps its editor through its first save (ALIAS) */
export default function FolioWriteRoute() {
  const { pathname, key, search } = useLocation()
  /* the first location of a page load is keyed "default" by the router — give it this load's own id; once it is
     chosen, a new document carries that id as ?d= (19.1), so its tab returns to it instead of starting another */
  const d = pathname === '/new' ? new URLSearchParams(search).get('d') : null
  const k = ALIAS.keys[pathname] ?? (pathname === '/new' ? `new:${d ?? (key === 'default' ? BOOT : key)}` : pathname)
  return <FolioWrite key={k} routeKey={k} />
}

function FolioWrite({ routeKey }) {
  const { collection } = useParams()
  const id = useParams()['*']
  const existing = collection ? findDoc(collection, id) : null
  const navigate = useNavigate()
  const [searching, setSearching] = useState(false)
  useSearchKey(setSearching)

  const location = useLocation()
  const isNew = location.pathname === '/new'
  const memory = isNew ? SESSION.get(routeKey) : (SESSION.get(location.pathname) ?? SESSION.get(routeKey))
  /* W18 — the right half of a split is this editor in a frame (?pane): no tabs of its own */
  const pane = new URLSearchParams(location.search).has('pane')
  /* 16.3 — a new document asks what it is first */
  const [choosing, setChoosing] = useState(isNew && !memory && !pane)
  /* this document's address: a new one is /demo-4/new?d=<its id> */
  const here = isNew ? `/new?d=${routeKey.slice(4)}` : location.pathname
  useEffect(() => { if (isNew && !choosing && !pane && location.pathname + location.search !== here) navigate(here, { replace: true }) }, [choosing])
  const [file, setFile] = useState(memory?.file ?? existing?.file ?? null)
  const [where, setWhere] = useState(memory?.where ?? (existing ? { collection: existing.collection, id: existing.id } : null))
  const [source, setSource] = useState(memory?.source ?? existing?.source ?? STARTER)
  const [name, setName] = useState(memory?.name ?? (existing ? existing.id.split('/').pop() : ''))
  const [shelf, setShelf] = useState(memory?.shelf ?? existing?.own?.shelf ?? existing?.shelf ?? 'self')
  const [mode, setMode] = useState('split')
  const { editorRail: rail, editorTree: tree, editorPair: pair, theme, palette, accent, canvas = 'match', hidden = {}, writing, codeZoom = 100, codeMap = false } = useSettings()
  /* View → Canvas: the writing surface light or dark whatever the theme; the chrome keeps the theme */
  const canvasTheme = canvas === 'match' ? theme : canvas
  useSKey(() => setSettings({ editorRail: true }))
  /* 19.7 — the band letters and W (the rule useSKey keeps: bare outside a field, ⌥ while writing); 19.5 — ⇧⌘P or F1 opens the command list */
  const [commands, setCommands] = useState(false)
  useEffect(() => {
    const codes = Object.fromEntries(BANDS.filter(([, , key]) => key !== ',').map(([k, , key]) => [`Key${key}`, k]))
    const on = (e) => {
      if (e.key === 'F1' || ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'p')) { e.preventDefault(); setCommands(true); return }
      const band = codes[e.code], writing = e.code === 'KeyW'
      if ((!band && !writing) || e.metaKey || e.ctrlKey || e.shiftKey) return
      if (!e.altKey && e.target?.closest?.('input, textarea, select, [contenteditable="true"], [contenteditable=""]')) return
      e.preventDefault(); writing ? flipWriting() : flipBand(band)
    }
    addEventListener('keydown', on)
    return () => removeEventListener('keydown', on)
  }, [])
  useSKey(() => setSettings((st) => ({ editorRail: !st.editorRail })), ['Comma'])
  /* the format (user, 2026-11-04): Markdown, Plain text or Code — chosen before the first save; after it, the file's
     extension decides */
  const [format, setFormat] = useState(memory?.format ?? existing?.format ?? 'md')
  const [ext, setExt] = useState(memory?.ext ?? existing?.ext ?? 'js')
  const isMd = format === 'md'
  const isRich = format === 'rich'
  const extension = extOf(format, ext)
  const [saved, setSaved] = useState(existing ? Date.now() : null)
  const [state, setState] = useState('')
  const [, tick] = useState(0)
  const area = useRef(null)
  /* the Code format's CodeMirror view (CodeEditor.jsx) and what its check found */
  const codeView = useRef(null)
  const [problems, setProblems] = useState({ errors: 0, warnings: 0 })
  const scroller = useRef(null)
  const dirty = useRef(false)

  const title = (isMd && /^#\s+(.+)$/m.exec(source)?.[1]?.trim()) || (isRich && /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(source)?.[1]?.replace(/<[^>]+>/g, '').trim()) || existing?.title || (name ? name.replace(/\.\w+$/, '') : 'Untitled')
  const lines = source.split('\n')
  const words = (source.match(/[\p{L}\p{N}’'-]+/gu) ?? []).length
  const shelfLabel = SHELVES.find((s) => s.id === shelf)?.label ?? shelf
  const fileName = `${(name || title).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/\.\w+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'untitled'}.${extension}`

  /* autosave: a second after the last keystroke; a new document is created on its first save */
  const save = async () => {
    setState('Saving…')
    try {
      if (!file) {
        const made = await post('create', { name: fileName, ext: extension, title, shelf, source: isRich ? withFonts(source) : source })
        setFile(made.file); setWhere({ collection: made.collection, id: made.id })
        const to = `/edit/${made.collection}/${made.id}`
        ALIAS.from = location.pathname; ALIAS.to = to; ALIAS.keys[to] = routeKey
        /* 19.6 — the render between this save and the address change must not add the old address back as a second tab */
        MOVED.add(here)
        SESSION.set(to, { source, file: made.file, where: { collection: made.collection, id: made.id }, hist: hist.current, format, ext, name, shelf, sel: caret() })
        setSettings((st) => {
          const next = (st.openDocs ?? []).map((t) => (t.path === here ? { ...t, path: to } : t))
          return { openDocs: next.filter((t, i) => next.findIndex((x) => x.path === t.path) === i) }
        })
        navigate(to, { replace: true })
      } else {
        await post('save', { file, source: isRich ? withFonts(source) : source })
        if (where && shelf !== existing?.shelf) await post('meta', { key: `${where.collection}/${where.id}`, ...(existing?.own ?? {}), shelf })
      }
      dirty.current = false
      setSaved(Date.now()); setState('')
    } catch (e) { setState(`Not saved — ${e.message}`) }
  }
  useEffect(() => {
    if (!dirty.current) return
    const t = setTimeout(save, 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, shelf])
  useEffect(() => { const t = setInterval(() => tick((n) => n + 1), 30000); return () => clearInterval(t) }, [])

  /* undo / redo (13.2): the editor's own history — a shortcut, a paste, Details or an image is one step; typing joins
     the step before it until a pause of 800ms */
  const hist = useRef(memory?.hist ?? { past: [], future: [], at: 0 })
  const [, bump] = useState(0)
  const caret = () => [area.current?.selectionStart ?? 0, area.current?.selectionEnd ?? 0]
  const edit = (next, selStart, selEnd) => {
    const h = hist.current
    const now = Date.now()
    const typing = selStart == null
    if (!(typing && h.typing && now - h.at < 800)) { h.past.push({ source, sel: caret() }); if (h.past.length > 300) h.past.shift() }
    h.future = []; h.at = now; h.typing = typing
    dirty.current = true
    setSource(next); bump((n) => n + 1)
    /* the caret lands in the same commit as the text (a frame later, a fast next key would land at the end) */
    if (selStart != null) pendingSel.current = [selStart, selEnd ?? selStart]
  }
  const pendingSel = useRef(null)
  useLayoutEffect(() => {
    if (!pendingSel.current || !area.current) return
    area.current.focus(); area.current.setSelectionRange(...pendingSel.current)
    pendingSel.current = null
  })
  const travel = (from, to) => {
    const h = hist.current
    const step = h[from].pop()
    if (!step) return
    h[to].push({ source, sel: caret() }); h.typing = false
    dirty.current = true
    setSource(step.source); bump((n) => n + 1)
    requestAnimationFrame(() => { area.current?.focus(); area.current?.setSelectionRange(...step.sel) })
  }
  const undo = () => travel('past', 'future')
  const redo = () => travel('future', 'past')
  useEffect(() => { SESSION.set(file && location.pathname !== '/new' ? location.pathname : routeKey, { source, file, where, hist: hist.current, format, ext, name, shelf, sel: caret() }) })
  useEffect(() => { if (memory?.sel) requestAnimationFrame(() => { area.current?.focus(); area.current?.setSelectionRange(...memory.sel) }) }, [])
  const shortcut = (s) => {
    const el = area.current
    const a = el?.selectionStart ?? source.length
    const b = el?.selectionEnd ?? source.length
    if (s.line) {
      const start = source.lastIndexOf('\n', a - 1) + 1
      edit(source.slice(0, start) + s.line + source.slice(start), a + s.line.length, b + s.line.length)
    } else if (s.block || (s.label === 'Code' && source.slice(a, b).includes('\n'))) {
      /* the caret lands after the opening ``` — type the language there */
      const lead = a > 0 && source[a - 1] !== '\n' ? '\n' : ''
      const block = `${lead}\`\`\`\n${source.slice(a, b) || ''}\n\`\`\`\n`
      edit(source.slice(0, a) + block + source.slice(b), a + lead.length + 3)
    } else {
      const [l, r] = s.wrap
      edit(source.slice(0, a) + l + source.slice(a, b) + r + source.slice(b), a + l.length, b + l.length)
    }
  }
  /* a heading level for the caret's line, H1–H6, or 0 for body text — it replaces the line's own #s */
  const heading = (n) => {
    const a = area.current?.selectionStart ?? 0
    const start = source.lastIndexOf('\n', a - 1) + 1
    const old = /^#{1,6}\s+/.exec(source.slice(start))?.[0] ?? ''
    const mark = n ? `${'#'.repeat(n)} ` : ''
    edit(source.slice(0, start) + mark + source.slice(start + old.length), Math.max(start + mark.length, a - old.length + mark.length))
  }
  /* Tab indents (a selection: every line; ⇧Tab outdents); in code, Enter keeps the indent and brackets close themselves */
  const codeKey = (e) => {
    const el = area.current
    const a = el.selectionStart, b = el.selectionEnd
    const start = source.lastIndexOf('\n', a - 1) + 1
    if (e.key === 'Tab') {
      e.preventDefault()
      if (a === b && !e.shiftKey) return edit(source.slice(0, a) + '  ' + source.slice(b), a + 2)
      const block = source.slice(start, b)
      const out = e.shiftKey ? block.replace(/^ {1,2}/gm, '') : block.replace(/^/gm, '  ')
      return edit(source.slice(0, start) + out + source.slice(b), start, start + out.length)
    }
    if (format !== 'code' || e.altKey) return
    if (e.key === 'Enter') {
      e.preventDefault()
      const indent = /^[ \t]*/.exec(source.slice(start, a))[0]
      if ('([{'.includes(source[a - 1] || 'x') && PAIRS[source[a - 1]] === source[b]) return edit(`${source.slice(0, a)}\n${indent}  \n${indent}${source.slice(b)}`, a + indent.length + 3)
      const ins = `\n${indent}${/[({[:]$/.test(source.slice(start, a).trimEnd()) ? '  ' : ''}`
      return edit(source.slice(0, a) + ins + source.slice(b), a + ins.length)
    }
    /* typing the closer that is already there steps over it */
    if (a === b && source[a] === e.key && /[)\]}"'`]/.test(e.key)) { e.preventDefault(); el.setSelectionRange(a + 1, a + 1); return }
    if (PAIRS[e.key] && !(e.key in { '"': 1, "'": 1, '`': 1 } && a === b && /\w/.test(source[a - 1] ?? ''))) {
      e.preventDefault()
      return edit(source.slice(0, a) + e.key + source.slice(a, b) + PAIRS[e.key] + source.slice(b), a + 1, b + 1)
    }
    if (e.key === 'Backspace' && a === b && source[a] && PAIRS[source[a - 1]] === source[a]) { e.preventDefault(); edit(source.slice(0, a - 1) + source.slice(a + 1), a - 1) }
  }
  const onKey = (e) => {
    if (!(e.metaKey || e.ctrlKey)) return codeKey(e)
    const k = e.key.toLowerCase()
    const s = { b: SHORTCUTS[1], i: SHORTCUTS[2], k: SHORTCUTS[3] }[k]
    if (s) { e.preventDefault(); shortcut(s) }
    if (k === 's') { e.preventDefault(); save() }
    if (k === 't' && e.shiftKey) { e.preventDefault(); switchText(); return }
    if (k === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo() }
    if (k === 'y') { e.preventDefault(); redo() }
    if (k === 'f') { e.preventDefault(); setFinding(true) }
  }
  /* 19.9 — the page's own right-click menu everywhere, in place of the browser's; text fields keep the browser's */
  const [ctx, setCtx] = useState(null)
  const closeCtx = useCallback(() => setCtx(null), [])
  const openCtx = (e, items) => {
    if (e.target.closest?.('input, select, [role=dialog], [role=menu]')) return
    e.preventDefault(); e.stopPropagation()
    setCtx({ x: e.clientX, y: e.clientY, items })
  }
  const clip = async (kind) => {
    const v = codeView.current
    if (v) {
      const { from, to } = v.state.selection.main
      if (kind === 'paste') { const text = await navigator.clipboard.readText().catch(() => null); if (text != null) v.dispatch(v.state.replaceSelection(text)) }
      else { await navigator.clipboard.writeText(v.state.sliceDoc(from, to)).catch(() => {}); if (kind === 'cut') v.dispatch({ changes: { from, to } }) }
      v.focus(); return
    }
    const el = area.current
    const a = el.selectionStart, b = el.selectionEnd
    if (kind === 'paste') {
      const text = await navigator.clipboard.readText().catch(() => null)
      if (text != null) edit(source.slice(0, a) + text + source.slice(b), a + text.length)
      return
    }
    await navigator.clipboard.writeText(source.slice(a, b)).catch(() => {})
    if (kind === 'cut') edit(source.slice(0, a) + source.slice(b), a)
  }
  /* a pasted image link becomes ![](link); the Image button opens the bucket picker and inserts ![[key]] */
  const [picking, setPicking] = useState(false)
  const onPaste = (e) => {
    if (!isMd) return
    const md = pastedImage(e.clipboardData.getData('text/plain'))
    if (!md) return
    e.preventDefault()
    const a = area.current.selectionStart, b = area.current.selectionEnd
    edit(source.slice(0, a) + md + source.slice(b), a + 2, a + 2)
  }
  const insertImage = (f) => {
    setPicking(false)
    const el = area.current
    const a = el?.selectionStart ?? source.length, b = el?.selectionEnd ?? source.length
    /* a private file by its key (resolved through the sign-in), a public one by its full link */
    const md = f.url ? `![](${f.url})` : `![[${f.key}]]`
    edit(source.slice(0, a) + md + source.slice(b), a + md.length)
  }
  /* find & replace (13.4) */
  const [finding, setFinding] = useState(false)
  const [find, setFind] = useState('')
  const [repl, setRepl] = useState('')
  const [matchCase, setMatchCase] = useState(false)
  const [hit, setHit] = useState(0)
  const finder = useMemo(() => (find ? new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), matchCase ? 'g' : 'gi') : null), [find, matchCase])
  const hits = useMemo(() => (finder ? [...source.matchAll(finder)].map((m) => m.index) : []), [finder, source])
  const goTo = (n) => {
    if (!hits.length) return
    const i = (n + hits.length) % hits.length
    setHit(i)
    const a = hits[i]
    if (codeView.current) { codeView.current.dispatch({ selection: { anchor: a, head: a + find.length }, scrollIntoView: true }); codeView.current.focus(); return }
    area.current?.focus(); area.current?.setSelectionRange(a, a + find.length)
    const line = source.slice(0, a).split('\n').length - 1
    const sec = scroller.current?.closest('section')
    const row = scroller.current?.children[0]?.children[line]
    if (sec && row) sec.scrollTop = row.offsetTop - sec.clientHeight / 3
  }
  const replaceOne = () => {
    if (!hits.length) return
    const a = hits[hit % hits.length]
    edit(source.slice(0, a) + repl + source.slice(a + find.length), a, a + repl.length)
  }
  const replaceAll = () => { if (finder && hits.length) edit(source.replace(finder, () => repl), 0, 0) }

  /* the document tabs (13.3) */
  const tabLabel = file ? file.split('/').pop() : fileName
  const tabs = useTabs(choosing || pane ? null : here, tabLabel)
  const openTab = async (path) => { if (path === here) return; if (dirty.current) await save(); navigate(path) }
  const closeTab = (path) => {
    if (path === here && dirty.current && !confirm('This document has unsaved changes. Close it anyway?')) return
    const list = tabs.filter((t) => t.path !== path)
    SESSION.delete(path)
    setSettings({ openDocs: list, ...(pair === path ? { editorPair: null } : {}) })
    if (path === here) navigate(list.at(-1)?.path ?? '/')
  }
  /* 19.8 — another document beside this one: from a tab's menu, View → Split with…, the tree, or a tab dropped on the right half */
  const openBeside = (path, label) => path !== here && setSettings((st) => ({
    openDocs: (st.openDocs ?? []).some((t) => t.path === path) ? st.openDocs : [...(st.openDocs ?? []), { path, label }],
    editorPair: path,
  }))
  const closeOthers = async (path) => { await openTab(path); setSettings((st) => ({ openDocs: (st.openDocs ?? []).filter((t) => t.path === path), editorPair: null })) }
  const [drop, setDrop] = useState(false)
  const TAB = 'text/x-folio-tab'
  const rightHalf = (e) => { const r = e.currentTarget.getBoundingClientRect(); return e.clientX > r.left + r.width / 2 }

  const exportMd = () => {
    const out = isRich ? `<!doctype html>\n<html><head><meta charset="utf-8"><title>${title}</title></head><body>\n${withFonts(source)}\n</body></html>\n` : source
    const url = URL.createObjectURL(new Blob([out], { type: isRich ? 'text/html' : isMd ? 'text/markdown' : 'text/plain' }))
    Object.assign(document.createElement('a'), { href: url, download: fileName }).click()
    URL.revokeObjectURL(url)
  }
  /* W15 — a snapshot of the saved file in a bucket (Media or Private); the library copy stays the one he edits */
  const [shared, setShared] = useState(null)
  const toBucket = async (bucket) => {
    if (dirty.current || !file) await save()
    setState(`Saving to ${BUCKET_LABEL[bucket]}…`)
    try {
      const out = await post('upload', { bucket, name: file ? file.split('/').pop() : fileName, source: isRich ? withFonts(source) : source, type: isRich ? 'text/html' : isMd ? 'text/markdown' : 'text/plain' })
      setShared({ bucket, url: out.url }); setState('')
    } catch (e) { setState(`Not in ${BUCKET_LABEL[bucket]} — ${e.message}`) }
  }
  const sharedLink = shared && <a href={shared.url} target="_blank" rel="noreferrer" className="kol-reader-meta text-folio-green underline">In {BUCKET_LABEL[shared.bucket]} ↗</a>

  const done = async () => {
    if (dirty.current || !file) await save()
    if (pane) { setSettings({ editorPair: null }); return }
    navigate(where ? `/${where.collection}/${where.id}` : '/')
  }

  const body = useMemo(() => embeds(source.replace(/^---\n[\s\S]*?\n---\n?/, ''), urlOf), [source])
  if (!import.meta.env.DEV) {
    return (
      <Frame>
        <Masthead onSearch={() => setSearching(true)} />
        <p className="kol-reader-body px-[56px] py-[64px] text-folio-muted">Writing lives on the dev machine — this copy of the library is read-only.</p>
      </Frame>
    )
  }

  /* 16.2 — any format to any other, from every format, before or after the first save. A saved file changes its
     extension in place (only the ones written here — the library's own Markdown stays Markdown). Text is rich or plain
     (TextEdit's Make Plain Text, ⇧⌘T). */
  const canConvert = !file || file.includes('/documents/new/')
  async function convertTo(f, lang) {
    const to = f === 'text' ? (kindOf(format) === 'text' ? format : 'rich') : f
    const toExt = to === 'code' ? (lang ?? (format === 'code' ? ext : 'js')) : extOf(to)
    if (to === format && toExt === extension) return
    const fresh = !source.trim() || source === starterOf(format, ext)
    const next = fresh ? starterOf(to, toExt)
      : to === 'rich' ? (format === 'rich' ? source : toRich(source))
        : format === 'rich' ? toPlain(withoutFonts(source)) : source
    hist.current = { past: [], future: [], at: 0 }
    const nextExt = to === 'code' ? toExt : ext
    if (file) {
      try {
        const made = await post('convert', { file, ext: toExt, source: to === 'rich' ? withFonts(next) : next })
        const path = `/edit/${made.collection}/${made.id}`
        ALIAS.keys[path] = routeKey
        MOVED.add(location.pathname); MOVED.delete(path)
        setSettings((st) => ({ openDocs: (st.openDocs ?? []).map((t) => (t.path === here ? { path, label: made.file.split('/').pop() } : t)) }))
        setFile(made.file); setWhere({ collection: made.collection, id: made.id })
        SESSION.set(path, { source: next, file: made.file, where: { collection: made.collection, id: made.id }, hist: hist.current, format: to, ext: nextExt, name, shelf })
        navigate(path, { replace: true })
      } catch (e) { setState(`Not changed — ${e.message}`); return }
    }
    dirty.current = false
    setSource(next); setFormat(to); setExt(nextExt)
  }
  const switchText = () => kindOf(format) === 'text' && convertTo(format === 'rich' ? 'txt' : 'rich')
  const choose = (f, e) => {
    setChoosing(false)
    setFormat(f); if (e) setExt(e)
    setSource(starterOf(f, e ?? ext))
    hist.current = { past: [], future: [], at: 0 }
  }

  const showSource = !isMd || mode !== 'preview'
  const showPreview = isMd && mode !== 'write'
  const langLabel = CODE_LANGS.find(([e]) => e === ext)?.[2] ?? ext
  const insertText = (t) => { if (codeView.current) { codeView.current.dispatch(codeView.current.state.replaceSelection(t)); codeView.current.focus(); return } const a = area.current?.selectionStart ?? source.length, b = area.current?.selectionEnd ?? source.length; edit(source.slice(0, a) + t + source.slice(b), a + t.length) }
  const today = () => new Date().toISOString().slice(0, 10)

  /* 19.7 — the bands he can hide, in his numbering */
  const shown = (k) => (k === 'tree' ? Boolean(tree) : k === 'rail' ? Boolean(rail) : !hidden[k])
  const bandItems = [['Writing mode', flipWriting, keyOf('W'), Boolean(writing)], ...BANDS.map(([k, l, key]) => (k === 'ruler' && !isRich ? null : [l, () => flipBand(k), keyOf(key), shown(k)])).filter(Boolean)]
  const splitItems = () => [
    ...tabs.filter((t) => t.path !== here).map((t) => [`Split with ${t.label}`, () => openBeside(t.path, t.label), '', t.path === paired]),
    ...(paired ? [['Close split', () => setSettings({ editorPair: null })]] : []),
  ]
  const chromeItems = () => [
    ['New document…', () => navigate('/new')], ['Back to library', done], '-',
    ...bandItems,
    ...(splitItems().length ? ['-', ...splitItems()] : []),
  ]

  /* ── the one shell (W16): every format hands in its own parts — `m` — and wears the same chrome ── */
  const shell = (m) => {
    const menus = [
      ['File', [['New document…', () => navigate('/new')], ['Save', save, '⌘S'], [`Export .${extension}`, exportMd], '-', ['Save to Media', () => toBucket('r2')], ['Save to Private', () => toBucket('private')], '-', ['Back to library', done]]],
      ['Edit', [['Undo', m.undo, '⌘Z'], ['Redo', m.redo, '⇧⌘Z'], '-', ...m.edit, '-', ['Find & replace', () => setFinding(true), '⌘F']]],
      ['Insert', m.insert],
      ['Format', [
        ...FORMATS.map(([f, l]) => [l, canConvert ? () => convertTo(f) : null, '', kindOf(format) === f]),
        ...(kindOf(format) === 'text' ? ['-', [format === 'rich' ? 'Make Plain Text' : 'Make Rich Text', switchText, '⇧⌘T']] : []),
        ...(m.format.length ? ['-', ...m.format] : []),
      ]],
      ['View', [...m.view, ...(m.view.length ? ['-'] : []), ...[['match', 'Canvas matches the theme'], ['light', 'Light canvas'], ['dark', 'Dark canvas']].map(([v, l]) => [l, () => setSettings({ canvas: v }), '', canvas === v]), '-', ...bandItems, ...(splitItems().length ? ['-', ...splitItems()] : [])]],
      ['Tools', [[`${m.stats.words} words, ${m.stats.chars} characters`], '-', ['Find & replace', () => setFinding(true), '⌘F'], ...(m.tools ?? []), '-', ['Command list…', () => setCommands(true), '⇧⌘P']]],
      ['Help', [['Undo, redo', null, '⌘Z ⇧⌘Z'], ['Save, find', null, '⌘S ⌘F'], ...m.help, ['Rail', null, ','], ['Writing mode', null, 'W'], ['Show or hide a band', null, 'T H M B F L , R'], ['Command list', null, '⇧⌘P or F1']]],
    ]
    const iconBtn = 'flex size-[32px] items-center justify-center rounded-[3px] hover:bg-folio-surface disabled:opacity-30'
    return <>
      {commands && <CommandPalette menus={menus} onClose={() => setCommands(false)} />}
      {!hidden.menus && <MenuBar menus={menus}>
        <Tool icon="search" aria-pressed={finding} onClick={() => setFinding(!finding)}>Find &amp; replace</Tool>
        <Tool icon="folder-tree" aria-pressed={Boolean(tree)} onClick={() => setSettings({ editorTree: !tree })}>Library</Tool>
        <Tool icon="panel-right" aria-pressed={Boolean(rail)} onClick={() => setSettings({ editorRail: !rail })}>Rail</Tool>
      </MenuBar>}
      {!hidden.tools && <ToolRow>{m.toolbar}
        {/* Undo · Redo at the toolbar's right end, under Rail (user, 2026-11-04) */}
        <div className="-mr-[8px] ml-auto flex shrink-0 items-center gap-[4px]">
          <button type="button" aria-label="Undo" title="Undo ⌘Z" disabled={m.canUndo === false} onMouseDown={(e) => e.preventDefault()} onClick={m.undo} className={iconBtn}><Icon name="undo" /></button>
          <button type="button" aria-label="Redo" title="Redo ⇧⌘Z" disabled={m.canRedo === false} onMouseDown={(e) => e.preventDefault()} onClick={m.redo} className={iconBtn}><Icon name="redo" /></button>
        </div>
      </ToolRow>}
      {finding && <FindBar find={find} setFind={(v) => { setFind(v); setHit(0) }} repl={repl} setRepl={setRepl} matchCase={matchCase} setMatchCase={setMatchCase}
        count={m.find.count} onPrev={m.find.prev} onNext={m.find.next} onReplace={m.find.replaceOne} onReplaceAll={m.find.replaceAll} onClose={() => setFinding(false)} />}
      <div className="grid min-h-0 flex-1 overflow-hidden" style={{ gridTemplateColumns: `${tree ? 'minmax(0,300px) ' : ''}minmax(420px,1fr)${rail ? ' minmax(0,300px)' : ''}` }}>
        {tree && <LibraryTree current={location.pathname} onContext={(e, path, label) => openCtx(e, [['Open', () => openTab(path)], ['Open beside', path === here ? null : () => openBeside(path, label)]])} />}
        <CanvasTheme.Provider value={canvasTheme}><div data-folio-theme={canvasTheme} data-folio-palette={palette} data-folio-accent={accent} className="flex min-h-0 min-w-0 flex-col bg-folio-paper text-folio-ink"
          onContextMenu={(e) => openCtx(e, [['Undo', m.undo, '⌘Z'], ['Redo', m.redo, '⇧⌘Z'], '-', ...m.edit, ...(m.context ?? (m.format.length && format !== 'code' ? ['-', ...m.format] : [])), '-', ['Find & replace', () => setFinding(true), '⌘F']])}>{m.surface}</div></CanvasTheme.Provider>
        {rail && <EditorRail source={source} onApply={(next) => edit(next)} isMd={isMd} shelf={shelf} onShelf={(v) => { dirty.current = true; setShelf(v) }}
          format={{ md: 'Markdown', rich: 'Rich text', txt: 'Plain text', code: `${langLabel} code` }[format]} fileName={file ? file.split('/').pop() : fileName} words={m.stats.words} lines={m.stats.lines} />}
      </div>
      {!hidden.foot && <StatusBar left={`${m.stats.words} words      ${m.stats.chars} characters      ${m.stats.lines} ${isRich ? 'paragraphs' : 'lines'}`}>
        <span title={canConvert ? 'Change the format' : 'A library Markdown file stays Markdown'}>
          <Choice label="Format" align="bottom-right" value={kindOf(format)} disabled={!canConvert} onChange={convertTo} options={FORMATS} />
        </span>
        {format === 'code' && <Choice label="Language" align="bottom-right" value={ext} disabled={!canConvert} onChange={(e) => convertTo('code', e)} options={CODE_LANGS.map(([e, , label]) => [e, label])} />}
        {m.status}
      </StatusBar>}
    </>
  }

  /* the plain surfaces: Markdown (source + preview), plain text and code share the textarea editor */
  const isCode = format === 'code'
  const cm = (fn) => () => { const v = codeView.current; if (v) { fn(v); v.focus() } }
  /* 19.5 — Code's own tools: on its toolbar row, in Tools, in the right-click menu and the command list */
  const codeTools = [['Format document', cm(formatDocument), '⇧⌥F'], ['Check', cm((v) => { openLintPanel(v); nextDiagnostic(v) })], ['Comment line', cm(toggleComment), '⌘/'], ['Fold all', cm(foldAll), '⌃⌥['], ['Unfold all', cm(unfoldAll), '⌃⌥]']]
  const zoomTo = (z) => setSettings({ codeZoom: Math.max(50, Math.min(200, z)) })
  const plain = () => shell({
    undo: isCode ? cm(cmUndo) : undo, redo: isCode ? cm(cmRedo) : redo,
    canUndo: isCode ? undefined : hist.current.past.length > 0, canRedo: isCode ? undefined : hist.current.future.length > 0,
    tools: isCode ? codeTools : [],
    context: isCode ? ['-', ...codeTools] : undefined,
    stats: { words, chars: source.length, lines: lines.length },
    find: { count: find ? (hits.length ? `${Math.min(hit + 1, hits.length)} of ${hits.length}` : 'none') : '', next: () => goTo(hit + 1), prev: () => goTo(hit - 1), replaceOne, replaceAll },
    edit: [['Cut', () => clip('cut'), '⌘X'], ['Copy', () => clip('copy'), '⌘C'], ['Paste', () => clip('paste'), '⌘V'], ['Select all', isCode ? cm(cmSelectAll) : () => { area.current?.focus(); area.current?.select() }, '⌘A']],
    insert: isMd
      ? [['Image…', () => setPicking(true)], ['Link', () => shortcut(SHORTCUTS[3]), '⌘K'], ['Code block', () => shortcut(SHORTCUTS[6])], ['Horizontal rule', () => insertText('\n---\n')], '-', ['Date', () => insertText(today())]]
      : [['Date', () => insertText(today())], ['Date and time', () => insertText(new Date().toLocaleString('en-GB'))]],
    format: isMd ? [...[1, 2, 3, 4, 5, 6].map((n) => [`Heading ${n}`, () => heading(n)]), ['Body text', () => heading(0)], '-', ['Bold', () => shortcut(SHORTCUTS[1]), '⌘B'], ['Italic', () => shortcut(SHORTCUTS[2]), '⌘I'], ['Inline code', () => shortcut(SHORTCUTS[5])], ['List', () => shortcut(SHORTCUTS[4])], ['Quote', () => shortcut({ line: '> ' })]]
      : format === 'code' ? CODE_LANGS.map(([e, , label]) => [label, canConvert ? () => convertTo('code', e) : null, '', ext === e]) : [],
    view: isMd ? [['Write', () => setMode('write'), '', mode === 'write'], ['Split', () => setMode('split'), '', mode === 'split'], ['Preview', () => setMode('preview'), '', mode === 'preview']]
      : isCode ? [['Minimap', () => setSettings({ codeMap: !codeMap }), '', codeMap], '-', ['Zoom in', () => zoomTo(codeZoom + 10)], ['Zoom out', () => zoomTo(codeZoom - 10)], ['Actual size', () => zoomTo(100)]] : [],
    help: isMd ? [['Bold, italic, link', null, '⌘B ⌘I ⌘K']] : format === 'code' ? [['Indent, outdent', null, 'Tab ⇧Tab'], ['Comment line', null, '⌘/'], ['Fold, unfold here', null, '⌥⌘[ ⌥⌘]']] : [['Make Rich Text', null, '⇧⌘T']],
    toolbar: isMd ? <>
      {/* the mode tabs sit on the toolbar's bottom rule (13.1) */}
      <div role="tablist" aria-label="Mode" className="-mb-px mr-[32px] flex shrink-0 gap-[24px] self-stretch">
        {[['write', 'Write'], ['split', 'Split'], ['preview', 'Preview']].map(([md, label]) => (
          <button key={md} type="button" role="tab" aria-selected={mode === md} onClick={() => setMode(md)} className={`kol-reader-control flex items-center ${mode === md ? 'text-folio-ink shadow-[inset_0_-2px_0_var(--color-folio-ink)]' : 'font-normal text-folio-muted hover:text-folio-ink'}`}>{label}</button>
        ))}
      </div>
      <Choice label="Heading" value={<><Icon name="heading-6" />Heading</>} onChange={heading} options={[...[1, 2, 3, 4, 5, 6].map((n) => [n, `Heading ${n}`]), [0, 'Body text']]}
        className="kol-reader-meta h-[32px] shrink-0 gap-[8px] whitespace-nowrap px-[10px] font-semibold hover:bg-folio-surface hover:text-folio-ink" />
      {SHORTCUTS.slice(1).map((sc) => <Tool key={sc.label} icon={sc.icon} onMouseDown={(e) => e.preventDefault()} onClick={() => shortcut(sc)}>{sc.label}</Tool>)}
      <Tool icon="image" onClick={() => setPicking(true)}>Image</Tool>
    </> : format === 'txt' ? <>
      <Tool onClick={switchText} title="⇧⌘T">Make Rich Text</Tool>
      <p className="kol-reader-meta ml-[8px] text-folio-muted">Plain text — no formatting, nothing to preview.</p>
    </> : <div className="-ml-[10px] flex items-center gap-[8px]">
      {codeTools.map(([label, fn, keys]) => <Btn key={label} title={keys} onClick={fn}>{label}</Btn>)}
      <span className="mx-[4px] h-[20px] w-px shrink-0 bg-folio-rule" />
      <Btn icon="search" onClick={() => setCommands(true)} title="⇧⌘P or F1">Commands</Btn>
    </div>,
    status: isCode ? <>
      <button type="button" onClick={cm((v) => { openLintPanel(v); nextDiagnostic(v) })} title="Go to the next problem" className={`flex items-center gap-[10px] tabular-nums ${problems.errors ? 'text-[#c0392b]' : 'text-folio-muted'} hover:text-folio-ink`}>
        <span>ⓧ {problems.errors}</span><span className={problems.warnings ? 'text-[#b7791f]' : ''}>⚠ {problems.warnings}</span>
      </button>
      <span className="flex items-center">
        <Btn aria-label="Zoom out" onClick={() => zoomTo(codeZoom - 10)} className="w-[32px] justify-center px-0">−</Btn>
        <span className="w-[48px] text-center tabular-nums">{codeZoom}%</span>
        <Btn aria-label="Zoom in" onClick={() => zoomTo(codeZoom + 10)} className="w-[32px] justify-center px-0">+</Btn>
      </span>
      <span className="text-folio-muted">{'UTF-8      LF'}</span>
    </> : <span className="text-folio-muted">{'UTF-8      LF'}</span>,
    surface: isCode ? (
      <section className="flex min-h-0 min-w-0 flex-1 flex-col pt-[24px]" onKeyDown={(e) => {
        if (e.code === 'KeyF' && e.altKey && e.shiftKey && !e.metaKey) { e.preventDefault(); cm(formatDocument)(); return }
        if (!(e.metaKey || e.ctrlKey)) return
        const k = e.key.toLowerCase()
        if (k === 's') { e.preventDefault(); save() }
        if (k === 'f') { e.preventDefault(); setFinding(true) }
      }}>
        <div className="flex items-baseline justify-between px-[56px] pb-[18px]">
          <p className="font-[family-name:var(--kol-font-family-mono)] text-[12px] font-medium uppercase leading-[12px] tracking-[0.72px] text-folio-muted">Source</p>
          <p className="kol-reader-meta text-folio-muted">{tabLabel}</p>
        </div>
        <CodeEditor value={source} onChange={(v) => { if (v === source) return; dirty.current = true; setSource(v) }} ext={ext} dark={canvasTheme === 'dark'} zoom={codeZoom} minimap={codeMap} viewRef={codeView} onProblems={setProblems} />
      </section>
    ) : (
      <div className="grid min-h-0 flex-1" style={{ gridTemplateColumns: showSource && showPreview ? '1fr 1fr' : '1fr' }}>
        {showSource && (
          <section className="flex min-h-0 min-w-0 flex-col overflow-y-auto overscroll-contain px-[56px] pb-[40px] pt-[24px] [&+section]:border-l [&+section]:border-folio-rule">
            <div className="flex items-baseline justify-between pb-[34px]">
              <p className="font-[family-name:var(--kol-font-family-mono)] text-[12px] font-medium uppercase leading-[12px] tracking-[0.72px] text-folio-muted">Source</p>
              <p className="kol-reader-meta text-folio-muted">{isMd ? 'Plain text, with a little structure.' : tabLabel}</p>
            </div>
            {/* the highlighted lines sit under a transparent textarea with the same metrics, so the caret writes on them */}
            <div ref={scroller} className="relative font-[family-name:var(--kol-font-family-mono)] text-[14px] leading-[24px]">
              <div aria-hidden className="pointer-events-none">
                {lines.map((line, n) => (
                  <div key={n} className="grid grid-cols-[48px_1fr]">
                    <span className="select-none text-[12px] tabular-nums text-folio-muted">{String(n + 1).padStart(2, ' ')}</span>
                    <span className={`whitespace-pre-wrap break-words ${isMd && MARKED.test(line) ? 'text-folio-green' : ''}`}>{line ? (finding && finder && line.search(finder) >= 0 ? <Found line={line} finder={finder} /> : format === 'code' ? <CodeLine language={prismOf(ext)} line={line} /> : !isMd ? line : MARKED.test(line) ? line : <Tokens line={line} />) : '​'}</span>
                  </div>
                ))}
              </div>
              <textarea ref={area} value={source} onChange={(e) => edit(e.target.value)} onKeyDown={onKey} onPaste={onPaste} spellCheck={format !== 'code'} aria-label="Source"
                className="absolute inset-y-0 left-[48px] right-0 resize-none overflow-hidden whitespace-pre-wrap break-words bg-transparent p-0 text-transparent caret-folio-ink outline-none selection:bg-[color-mix(in_oklab,var(--color-folio-green)_22%,transparent)] selection:text-transparent" />
            </div>
          </section>
        )}
        {showPreview && (
          <section className="min-h-0 min-w-0 overflow-y-auto overscroll-contain border-l border-folio-rule bg-folio-surface px-[56px] pb-[40px] pt-[24px]">
            <div className="flex items-baseline justify-between pb-[30px]">
              <p className="font-[family-name:var(--kol-font-family-mono)] text-[12px] font-medium uppercase leading-[12px] tracking-[0.72px] text-folio-muted">Preview</p>
              <p className="kol-reader-meta text-folio-muted">How your document reads</p>
            </div>
            <div className="flex max-w-[608px] flex-col gap-[20px] font-folio">
              <Markdown remarkPlugins={[remarkGfm]} components={PREVIEW}>{body}</Markdown>
            </div>
          </section>
        )}
      </div>
    ),
  })

  /* W18 — a second document beside this one: the paired tab opens in a frame on the right */
  const paired = !pane && pair && pair !== here && tabs.some((t) => t.path === pair) ? pair : null

  const editor = <>
    {/* ── document identity ── */}
    {!hidden.head && <div className="flex shrink-0 items-end justify-between gap-[32px] px-[56px] pb-[17px] pt-[24px]">
      <div className="flex min-w-0 flex-col gap-[16px]">
        <p className="kol-reader-meta flex items-center gap-[8px] whitespace-pre text-folio-muted">
          <Link to={where ? `/${where.collection}/${where.id}` : '/'} className="flex items-center gap-[8px] hover:text-folio-ink"><Icon name="arrow-left" />My library</Link>
          {'   /   '}{existing ? existing.title : title === 'Untitled' ? 'New document' : title}
        </p>
        <div className="flex items-center gap-[23px]">
          <Field aria-label="File name" value={file ? file.split('/').pop() : name} placeholder={fileName} readOnly={Boolean(file)} onChange={(e) => setName(e.target.value)} className="w-[280px]" />
          <p className="kol-reader-meta flex items-center gap-[8px] text-folio-green" role="status">
            {state || (saved ? <><Icon name="check" size={14} />Saved {ago(saved)}</> : 'Not saved yet')}
          </p>
          {sharedLink}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-[24px]">
        <div className="flex gap-[4px]">
          <span className="flex items-center px-[8px]"><Choice label="Save to bucket" align="right" value="Save to bucket" onChange={toBucket} options={client().read('buckets').filter((b) => b.upload).sort((a, b) => a.upload - b.upload).map((b) => [b.id, `${b.label}, ${b.host}`])} className="kol-reader-meta" /></span>
          <Tool icon="download" onClick={exportMd}>Export</Tool>
          <button type="button" onClick={done} className="kol-reader-meta h-[32px] rounded-[3px] bg-folio-green px-[16px] font-semibold text-folio-paper">Done</button>
        </div>
        <p className="kol-reader-meta flex items-center gap-[6px] text-folio-muted">
          In My library<span aria-hidden>/</span>
          <Choice label="Shelf" align="right" value={shelf} onChange={(v) => { dirty.current = true; setShelf(v) }} options={SHELVES.map((x) => [x.id, x.label])} />
        </p>
      </div>
    </div>}

    {isRich
      ? <Rich key={routeKey} source={source} find={find} repl={repl} matchCase={matchCase} onFind={() => setFinding(true)} onSave={save} onPlain={switchText}
          onInput={(html) => { if (html === source) return; dirty.current = true; setSource(html) }}>
          {(r) => shell({ ...r, edit: r.menus.edit, insert: r.menus.insert, format: r.menus.format, view: r.menus.view, help: [...r.menus.help, ['Make Plain Text', null, '⇧⌘T']] })}
        </Rich>
      : plain()}
  </>

  return (
    <Frame>
      <SearchOverlay open={searching} onClose={() => setSearching(false)} />
      {/* the editor fills the window and never scrolls as a page — source and preview scroll inside; no masthead here,
          the breadcrumb leads back (user, 2026-11-04) */}
      <div className="flex h-screen flex-col overflow-hidden" onContextMenu={(e) => openCtx(e, chromeItems())}>

      {/* ── document tabs (13.3); a tab opened beside this one is chained to it (W18) ── */}
      {!pane && !hidden.tabs && (
        <div role="tablist" aria-label="Open documents" className="flex h-[44px] shrink-0 items-end gap-[2px] overflow-x-auto bg-folio-surface px-[56px] [scrollbar-width:none]">
          {tabs.map((t) => {
            const on = t.path === here
            const chained = paired && (on || t.path === paired)
            return (
              <span key={t.path} role="tab" aria-selected={on} draggable={!on} onDragStart={(e) => e.dataTransfer.setData(TAB, JSON.stringify(t))}
                onContextMenu={(e) => openCtx(e, [
                  ...(on ? (paired ? [['Close split', () => setSettings({ editorPair: null })]] : []) : [t.path === paired ? ['Close split', () => setSettings({ editorPair: null })] : ['Open beside', () => openBeside(t.path, t.label)]]),
                  ['Close', () => closeTab(t.path)], ['Close other tabs', tabs.length > 1 ? () => closeOthers(t.path) : null], '-', ['New document…', () => navigate('/new')]])}
                className={`group flex h-[36px] shrink-0 items-center gap-[8px] rounded-t-[3px] pl-[14px] pr-[6px] ${chained ? 'shadow-[inset_0_2px_0_var(--color-folio-green)]' : ''} ${on || t.path === paired ? 'bg-folio-paper' : 'hover:bg-[color-mix(in_oklab,var(--color-folio-ink)_5%,var(--color-folio-surface))]'}`}>
                <button type="button" onClick={() => { if (t.path === paired) setSettings({ editorPair: here }); openTab(t.path) }} className={`kol-reader-meta max-w-[220px] truncate ${on ? 'font-semibold text-folio-ink' : 'text-folio-muted'}`}>{t.label}</button>
                {on && (dirty.current || state === 'Saving…') && <span aria-label="Unsaved changes" className="size-[6px] rounded-full bg-folio-ink" />}
                {!on && t.path !== paired && <button type="button" aria-label={`Open ${t.label} beside`} title="Open beside" onClick={() => setSettings({ editorPair: t.path })} className="flex size-[20px] items-center justify-center rounded-[3px] text-folio-muted opacity-0 hover:bg-folio-surface group-hover:opacity-100"><Icon name="panel-right" size={12} /></button>}
                <button type="button" aria-label={`Close ${t.label}`} onClick={() => closeTab(t.path)} className="flex size-[20px] items-center justify-center rounded-[3px] text-folio-muted opacity-60 hover:bg-folio-surface hover:opacity-100"><Icon name="x" size={12} /></button>
              </span>
            )
          })}
          {paired && <button type="button" onClick={() => setSettings({ editorPair: null })} className="kol-reader-meta flex h-[36px] shrink-0 items-center gap-[6px] px-[12px] text-folio-muted hover:text-folio-ink"><Icon name="panel-right" size={12} />Close split</button>}
          <Link to="/new" className="kol-reader-meta flex h-[36px] shrink-0 items-center gap-[6px] px-[12px] text-folio-muted hover:text-folio-ink"><Icon name="plus" size={12} />New</Link>
        </div>
      )}

      <div className="relative flex min-h-0 flex-1 flex-col"
        onDragOver={(e) => { if (!e.dataTransfer.types.includes(TAB)) return; e.preventDefault(); setDrop(rightHalf(e)) }}
        onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDrop(false) }}
        onDrop={(e) => { const raw = e.dataTransfer.getData(TAB); setDrop(false); if (!raw) return; e.preventDefault(); const t = JSON.parse(raw); if (rightHalf(e)) openBeside(t.path, t.label) }}>
      {paired ? (
        <div className="flex min-h-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col">{editor}</div>
          {/* ponytail: the second document is the same editor in a frame — its own state, the library and settings shared
              through storage; one component tree holding two documents when a frame gets in the way */}
          <iframe title="The document beside" src={`${paired}${paired.includes('?') ? '&' : '?'}pane`} className="min-w-0 flex-1 border-l border-folio-rule bg-folio-paper" />
        </div>
      ) : editor}
      {drop && <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-40 w-1/2 border-2 border-folio-green bg-[color-mix(in_oklab,var(--color-folio-green)_12%,transparent)]" />}
      </div>

      {picking && <ImagePicker urlOf={urlOf} onPick={insertImage} onClose={() => setPicking(false)} />}
      {choosing && <NewOverlay onPick={choose} onClose={() => setChoosing(false)} />}

      {ctx && <ContextMenu at={ctx} items={ctx.items} onClose={closeCtx} />}
      </div>
    </Frame>
  )
}
