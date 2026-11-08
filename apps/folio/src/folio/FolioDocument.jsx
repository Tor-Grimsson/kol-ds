/* Folio — a chapter of a book from the real Library (/demo-4/<collection>/<id>). A book of chapters reads in the ebook
   reader (Figma 228:13788), a single piece in the article reader (228:13639) — plan W9. Full width (W1.1): the book's
   contents on the left edge, its cover and originals on the right, the text between at a reading measure. */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FileQuickLook } from '@kolkrabbi/kol-component'
import { Icon } from './parts'
import { VOLUMES, findDoc, bodyOf, urlOf, docByKey } from './shelf'
import { fmtDate } from '../lib/catalogue'
import { relatedOf, tagsOfBook, tagSlug } from '../lib/books'
import { Frame, Masthead, SearchOverlay, useSearchKey, Flags, LangToggle } from './Chrome'
import { Cover } from './FolioShelf'
import Fence, { fenceOf, prismOf } from './Fence'
import { Figure, Player, mediaKind } from './Media'
import { useSettings, setSettings, saveReading } from './settings'
import { LibraryTree } from './EditorChrome'
import { client } from './client'

const SIGNIN = client().read('signin')
const TIMELINE = client().read('timeline')
const slug = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const textOf = (children) => (Array.isArray(children) ? children.map(textOf).join('') : typeof children === 'object' && children ? textOf(children.props?.children) : String(children ?? ''))

/* the markdown, set in the reader's family; text runs at the measure, tables and code use the column (breakout grid) */
const MD = {
  h1: ({ children }) => <h2 id={slug(textOf(children))} className="scroll-mt-[24px]">{children}</h2>,
  h2: ({ children }) => <h2 id={slug(textOf(children))} className="scroll-mt-[24px]">{children}</h2>,
  h3: ({ children }) => <h3 id={slug(textOf(children))} className="scroll-mt-[24px]">{children}</h3>,
  h4: ({ children }) => <h4 className="text-folio-muted">{children}</h4>,
  ul: ({ children }) => <ul className="flex list-disc flex-col gap-[0.5em] pl-[1.5em] marker:text-folio-green">{children}</ul>,
  ol: ({ children }) => <ol className="flex list-decimal flex-col gap-[0.5em] pl-[1.5em] marker:font-semibold marker:text-folio-green">{children}</ol>,
  blockquote: ({ children }) => <blockquote className="flex flex-col gap-[16px] border-l-3 border-folio-green py-[4px] pl-[24px]">{children}</blockquote>,
  a: ({ href = '', children }) => mediaKind(href) ? <Player href={href}>{children}</Player> : href.startsWith('/')
    /* a link into the library stays in Folio: the same document at Folio's address */
    ? <Link to={href.replace(/^\/library\/(?=[^/]+\/)/, '/')} className="text-folio-green underline decoration-1 underline-offset-2 hover:decoration-2">{children}</Link>
    : <a href={href} target="_blank" rel="noreferrer" className="text-folio-green underline decoration-1 underline-offset-2 hover:decoration-2">{children}</a>,
  strong: ({ children }) => <b className="font-bold">{children}</b>,
  hr: () => <hr className="border-folio-rule" />,
  img: (props) => <Figure {...props} />,
  /* a paragraph that only holds an image is the figure itself */
  p: ({ node, children }) => (node?.children?.length === 1 && node.children[0].tagName === 'img' ? <>{children}</>
    /* a paragraph holding a player is a block: the player's boxes are not allowed inside a <p> */
    : node?.children?.some((c) => c.tagName === 'a' && mediaKind(c.properties?.href)) ? <div className="flex flex-col">{children}</div> : <p>{children}</p>),
  table: ({ children }) => <div data-wide className="overflow-x-auto"><table className="w-full border-collapse">{children}</table></div>,
  th: ({ children }) => <th className="border-b-2 border-folio-ink py-[8px] pr-[16px] text-left text-folio-muted">{children}</th>,
  td: ({ children }) => <td className="border-b border-folio-rule py-[10px] pr-[16px] align-top">{children}</td>,
  /* indented passages in the old archive files parse as code blocks — they read as text, wrapped */
  pre: ({ children }) => {
    const fence = fenceOf(children)
    return fence ? <Fence {...fence} /> : <div data-wide className="whitespace-pre-wrap break-words bg-folio-surface p-[20px]">{children}</div>
  },
  code: ({ children }) => <code className="rounded-[3px] bg-folio-surface px-[4px]">{children}</code>,
}

/* the record a document is (library.js DATED → the Records timeline row) */
const recordOf = (title) => TIMELINE.find((r) => r.title === title)

/* W2 — whether the originals can be read here: one probe of the first original with the sign-in cookie */
function useSignedIn(url) {
  const [state, setState] = useState('unknown')
  useEffect(() => {
    if (!url) return
    let live = true
    fetch(url, { method: 'HEAD', credentials: 'include' })
      .then((r) => live && setState(r.status === 401 || r.status === 403 ? 'out' : 'in'))
      .catch(() => live && setState('unknown'))
    return () => { live = false }
  }, [url])
  return state
}

/* W10 — remember how far down the text was read; on #resume, return there */
function useReadingPosition(doc, article) {
  const { hash } = useLocation()
  useEffect(() => {
    if (!doc) return
    let saved = null
    try { saved = JSON.parse(localStorage.getItem('folio-demo-4') ?? '{}')?.reading?.[doc.key] } catch { /* blocked storage */ }
    if (hash === '#resume' && saved) {
      requestAnimationFrame(() => {
        const el = article.current
        if (!el) return
        const top = el.offsetTop + Math.max(0, el.offsetHeight - innerHeight) * (saved.pct / 100)
        scrollTo({ top: Math.max(0, top) })
      })
    } else if (!hash) scrollTo({ top: 0 })
    let t = null
    const onScroll = () => {
      clearTimeout(t)
      t = setTimeout(() => {
        const el = article.current
        if (!el) return
        const span = Math.max(1, el.offsetHeight - innerHeight)
        saveReading(doc.key, Math.min(1, Math.max(0, (scrollY - el.offsetTop) / span)))
      }, 250)
    }
    saveReading(doc.key, saved ? saved.pct / 100 : 0)
    addEventListener('scroll', onScroll, { passive: true })
    return () => { clearTimeout(t); removeEventListener('scroll', onScroll) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc?.key])
}

export default function FolioDocument() {
  const { collection } = useParams()
  const id = useParams()['*']
  const doc = findDoc(collection, id)
  const s = useSettings()
  const [searching, setSearching] = useState(false)
  useSearchKey(setSearching)
  /* the open original belongs to this document — moving to another document closes it */
  const [opened, setOpened] = useState(null)
  const open = opened && opened.to === doc?.key ? opened.n : null
  const setOpen = (n) => setOpened(n == null ? null : { to: doc.key, n })
  const article = useRef(null)
  useReadingPosition(doc, article)
  const book = doc?.book
  /* W4: a text in Icelandic and English — the flags pick the version on the page; the choice holds while you read */
  const [lang, setLang] = useState(null)
  const langs = (doc?.twins ?? []).map((t) => t.lang)
  const shownLang = langs.includes(lang) ? lang : langs[0]
  const shown = (shownLang && docByKey(doc.twins.find((t) => t.lang === shownLang)?.key)) || doc
  const signed = useSignedIn(book?.originals[0] ? urlOf(book.originals[0]) : null)
  const headings = useMemo(() => (doc ? [...bodyOf(doc).matchAll(/^#{1,3}\s+(.+)$/gm)].map((m) => {
    const text = m[1].replace(/[*_`]/g, '').trim()
    return { text, id: slug(text) }
  }) : []), [doc])

  if (!doc) {
    return (
      <Frame>
        <Masthead onSearch={() => setSearching(true)} />
        <div className="flex flex-col gap-[16px] px-[56px] py-[64px]">
          <p className="kol-reader-section">No such document.</p>
          <Link to="/" className="kol-reader-body text-folio-green underline">Back to My library</Link>
        </div>
      </Frame>
    )
  }

  const chapters = book.chapters
  const ebook = chapters.length > 1
  const i = chapters.indexOf(doc)
  const prev = chapters[i - 1]
  const next = chapters[i + 1]
  const shelf = VOLUMES.filter((v) => v.shelf === book.shelf)
  const bi = shelf.indexOf(book)
  const nextBook = !next && shelf[bi + 1]
  const prevBook = !prev && shelf[bi - 1]
  const family = s.family === 'auto' ? (book.mono ? 'mono' : 'sans') : s.family
  const rec = book.records.map(recordOf).find(Boolean)
  const meta = <p className="kol-reader-meta flex items-center gap-[10px] text-folio-muted">{fmtDate(doc.date) || 'n.d.'}<Flags langs={doc.langs} />{doc.origin && <span>{doc.origin}</span>}</p>

  return (
    <Frame>
      <Masthead shelf={book.shelf} reading onSearch={() => setSearching(true)} />
      <SearchOverlay open={searching} onClose={() => setSearching(false)} />

      <div className="grid grid-cols-[264px_minmax(0,1fr)_264px] items-start gap-[56px] px-[56px] pb-[64px] pt-[40px]">
        {/* ── the left rail: the book's contents, then the shelf ── */}
        <aside className="sticky top-[24px] flex max-h-[calc(100vh-48px)] flex-col gap-[28px] overflow-y-auto overscroll-contain pb-[8px] [scrollbar-width:thin]">
          <div className="flex flex-col gap-[12px]">
            <p className="kol-reader-label text-folio-muted">In your library / {book.shelfLabel}</p>
            <p className="kol-reader-book break-words">{book.title}</p>
            <p className="kol-reader-body text-folio-muted">{ebook ? `${chapters.length} chapters` : doc.kind || book.call}</p>
          </div>
          <nav aria-label="Contents" className="flex flex-col gap-[4px]">
            <div className="flex justify-between border-b border-folio-ink pb-[15px]">
              <p className="kol-reader-nav font-bold">{ebook ? 'Contents' : 'In this document'}</p>
              <p className="kol-reader-meta text-folio-muted">{String(ebook ? chapters.length : headings.length).padStart(2, '0')}</p>
            </div>
            {ebook ? chapters.map((c, n) => {
              const on = c === doc
              return (
                <div key={c.key} className="flex flex-col">
                  <Link to={c.href} aria-current={on ? 'page' : undefined} className={`flex gap-[14px] rounded-[3px] px-[12px] py-[11px] ${on ? 'bg-folio-mint text-folio-green' : 'hover:bg-folio-surface'}`}>
                    <span className={`kol-reader-meta tabular-nums ${on ? '' : 'text-folio-muted'}`}>{String(n + 1).padStart(2, '0')}</span>
                    <span className={`kol-reader-nav min-w-0 flex-1 ${on ? 'font-bold' : 'font-normal'}`}>{c.chapter}</span>
                  </Link>
                  {on && headings.length > 0 && (
                    <div className="ml-[38px] flex flex-col border-l border-folio-rule py-[4px]">
                      {headings.map((h) => <a key={h.id} href={`#${h.id}`} className="kol-reader-meta py-[6px] pl-[12px] text-folio-muted hover:text-folio-ink">{h.text}</a>)}
                    </div>
                  )}
                </div>
              )
            }) : headings.length ? headings.map((h, n) => (
              <a key={h.id} href={`#${h.id}`} className="flex gap-[12px] rounded-[3px] px-[12px] py-[9px] text-folio-muted hover:bg-folio-surface hover:text-folio-ink">
                <span className="kol-reader-meta tabular-nums">{String(n + 1).padStart(2, '0')}</span>
                <span className="kol-reader-nav min-w-0 flex-1 font-normal">{h.text}</span>
              </a>
            )) : <p className="kol-reader-meta px-[12px] py-[9px] text-folio-muted">One piece, no headings.</p>}
          </nav>
          {ebook && (
            <div className="flex flex-col gap-[12px] border-t border-folio-rule pt-[19px]">
              <div className="kol-reader-meta flex justify-between">
                <p className="text-folio-muted">Through the book</p>
                <p className="font-bold text-folio-green">{i + 1} / {chapters.length}</p>
              </div>
              <div className="h-[4px] bg-folio-rule"><div className="h-full bg-folio-green" style={{ width: `${((i + 1) / chapters.length) * 100}%` }} /></div>
            </div>
          )}
          {/* 7.1 — the whole library as a tree, every shelf a folder (Notes-like); the same tree and toggle as the editor's */}
          {s.editorTree ? (
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-center justify-between border-b border-folio-ink pb-[15px]">
                <p className="kol-reader-nav font-bold">Library</p>
                <button type="button" aria-label="Hide library" title="Hide library" onClick={() => setSettings({ editorTree: false })} className="flex size-[28px] items-center justify-center rounded-[3px] text-folio-muted hover:bg-folio-surface hover:text-folio-ink"><Icon name="folder-tree" /></button>
              </div>
              <LibraryTree current={doc.href} reading className="-mx-[8px] [&>div:first-child]:px-[8px] [&_nav]:overflow-visible" />
            </div>
          ) : (
            <button type="button" onClick={() => setSettings({ editorTree: true })} className="kol-reader-nav flex items-center gap-[8px] text-folio-muted hover:text-folio-ink"><Icon name="folder-tree" />Show library</button>
          )}
        </aside>

        {/* ── the text ── */}
        <article ref={article} className="min-w-0">
          <div className="kol-reader-meta flex justify-between gap-[24px] whitespace-nowrap border-b border-folio-rule pb-[15px] text-folio-muted">
            <p className="kol-reader-label">{doc.call}</p>
            <p className="tabular-nums">{ebook ? `Chapter ${i + 1} / ${chapters.length}` : `${bi + 1} / ${shelf.length} on the shelf`}</p>
          </div>

          {ebook ? (
            <header className="mx-auto flex max-w-[72ch] flex-col gap-[18px] pb-[34px] pt-[40px]">
              <p className="kol-reader-label text-folio-muted">{book.title} / {String(i + 1).padStart(2, '0')}</p>
              <h1 className="kol-reader-chapter flex flex-wrap items-center gap-[16px] break-words">{doc.chapter}<LangToggle langs={langs} lang={shownLang} onLang={setLang} /></h1>
              {meta}
            </header>
          ) : (
            <header className="flex items-end gap-[48px] pb-[40px] pt-[40px]">
              <div className="flex min-w-0 flex-1 flex-col gap-[20px]">
                <p className="kol-reader-label text-folio-muted">{book.shelfLabel}{doc.kind && doc.kind !== book.shelfLabel ? ` / ${doc.kind}` : ''}</p>
                <h1 className="kol-reader-title flex flex-wrap items-center gap-[16px] break-words">{doc.title}<LangToggle langs={langs} lang={shownLang} onLang={setLang} /></h1>
                {meta}
              </div>
              {/* the lead figure (W12.1): the clipping when the document has one, else its cover */}
              <button type="button" onClick={() => book.originals.length && setOpen(0)} className="shrink-0" aria-label="Open the original">
                <Cover book={book} width={180} />
              </button>
            </header>
          )}

          {(
            doc.format === 'code' ? (
              <div className="mx-auto max-w-[120ch]"><Fence language={prismOf(doc.ext)} text={doc.source} /></div>
            ) : doc.format === 'rich' ? (
              /* his own rich-text page (W14), as he set it — its fonts come in with the <link> it was saved with */
              <div className="mx-auto max-w-[72ch] break-words [&_a]:text-folio-green [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-folio-rule [&_blockquote]:pl-[16px] [&_h1]:mb-[12px] [&_h1]:text-[32px] [&_h1]:font-bold [&_h1]:leading-[1.15] [&_h2]:mb-[10px] [&_h2]:text-[24px] [&_h2]:font-semibold [&_h3]:mb-[8px] [&_h3]:text-[19px] [&_h3]:font-semibold [&_hr]:my-[16px] [&_img]:max-w-full [&_ol]:list-decimal [&_ol]:pl-[24px] [&_p]:mb-[8px] [&_ul]:list-disc [&_ul]:pl-[24px]" dangerouslySetInnerHTML={{ __html: doc.source }} />
            ) : doc.format === 'txt' ? (
              <div data-family={family} style={{ '--kol-reader-size': `${s.size}px` }} className="kol-reader-prose mx-auto max-w-[72ch] whitespace-pre-wrap break-words">{doc.source}</div>
            ) :
            <div data-family={family} style={{ '--kol-reader-size': `${s.size}px` }} className="kol-reader-prose grid grid-cols-[1fr_min(72ch,100%)_1fr] gap-y-[1.2em] break-words [&>*]:col-start-2 [&>[data-wide]]:col-span-full [&>[data-wide]]:col-start-1">
              <Markdown remarkPlugins={[remarkGfm]} components={MD}>{bodyOf(shown)}</Markdown>
            </div>
          )}

          <div className="mx-auto mt-[48px] flex max-w-[72ch] flex-col gap-[12px]">
            <span className="kol-reader-label text-folio-muted">Tags</span>
            <span className="flex flex-wrap gap-x-[16px] gap-y-[8px]">
              {tagsOfBook(book).map((t) => <Link key={t} to={`/library/tag/${tagSlug(t)}`} className="kol-reader-nav text-folio-green hover:underline">{t}</Link>)}
            </span>
          </div>
          {relatedOf(book).length > 0 && (
            <div className="mx-auto mt-[48px] flex max-w-[72ch] flex-col gap-[12px]">
              <span className="kol-reader-label text-folio-muted">Related</span>
              <span className="flex flex-wrap gap-x-[24px] gap-y-[8px]">
                {relatedOf(book).map((b) => <Link key={b.id} to={VOLUMES.find((v) => v.id === b.id)?.href ?? b.to} className="kol-reader-nav font-semibold text-folio-green hover:underline">{b.title}</Link>)}
              </span>
            </div>
          )}
          <div className="mx-auto mt-[48px] flex max-w-[72ch] justify-between gap-[24px] border-t border-folio-ink pt-[27px]">
            {(prev || prevBook) ? (
              <Link to={(prev || prevBook).href} className="group flex min-w-0 items-center gap-[12px]">
                <Icon name="arrow-left" size={18} />
                <span className="flex min-w-0 flex-col gap-[6px]"><span className="kol-reader-label text-folio-muted">{prev ? 'Previous chapter' : 'Previous on the shelf'}</span><span className="kol-reader-nav truncate font-semibold group-hover:underline">{prev ? prev.chapter : prevBook.title}</span></span>
              </Link>
            ) : <span />}
            {(next || nextBook) && (
              <Link to={(next || nextBook).href} className="group flex min-w-0 items-center gap-[12px] text-right">
                <span className="flex min-w-0 flex-col items-end gap-[6px]"><span className="kol-reader-label text-folio-muted">{next ? 'Next chapter' : 'Next on the shelf'}</span><span className="kol-reader-nav truncate font-semibold group-hover:underline">{next ? next.chapter : nextBook.title}</span></span>
                <Icon name="arrow-right" size={18} />
              </Link>
            )}
          </div>
        </article>

        {/* ── the right rail: cover, originals, records ── */}
        <aside className="sticky top-[24px] flex flex-col gap-[24px] border-l border-folio-rule pl-[24px]">
          {/* an article shows its cover as the lead figure; the rail carries it for a book */}
          {ebook && <>
            <p className="kol-reader-label text-folio-muted">The cover</p>
            <Cover book={book} width={204} />
            <p className="kol-reader-body text-folio-muted">{`Generated — the ${book.shelfLabel} edition.`}</p>
          </>}
          {book.originals.length > 0 && (
            <div className={`flex flex-col gap-[10px] ${ebook ? 'border-t border-folio-rule pt-[23px]' : ''}`}>
              <p className="kol-reader-label text-folio-green">Originals</p>
              {book.originals.map((f, n) => (
                <button key={f.key} type="button" onClick={() => setOpen(n)} className="kol-reader-body cursor-pointer break-all text-left text-folio-ink underline decoration-folio-rule underline-offset-[3px] hover:text-folio-green hover:decoration-folio-green">{f.name ?? f.key.split('/').pop()}</button>
              ))}
              {signed === 'out' && (
                <p className="kol-reader-meta text-folio-muted">
                  The originals live in the private bucket. <a href={`${SIGNIN}?next=${encodeURIComponent(location.href)}`} className="text-folio-green underline">Sign in</a> to open them.
                </p>
              )}
            </div>
          )}
          {rec && (
            <div className="flex flex-col gap-[10px] border-t border-folio-rule pt-[23px]">
              <p className="kol-reader-label text-folio-green">In Records</p>
              <Link to={`/records/${rec.kind}`} className="kol-reader-body text-folio-ink underline decoration-folio-rule underline-offset-[3px] hover:text-folio-green hover:decoration-folio-green">{rec.title}, {rec.year}</Link>
            </div>
          )}
          {import.meta.env.DEV && (
            <div className="flex flex-col gap-[10px] border-t border-folio-rule pt-[23px]">
              <Link to={`/edit/${doc.collection}/${doc.id}`} className="kol-reader-control flex h-[40px] items-center justify-center rounded-[3px] border border-folio-rule hover:bg-folio-surface">Edit this document</Link>
            </div>
          )}
        </aside>
      </div>

      {open != null && <FileQuickLook files={book.originals} index={open} onIndex={setOpen} onClose={() => setOpen(null)} urlOf={urlOf} />}

      <footer className="flex h-[64px] items-center justify-between gap-[24px] whitespace-nowrap border-t border-folio-rule px-[56px]">
        <p className="kol-reader-meta truncate text-folio-muted">{book.title}</p>
        <p className="kol-reader-control font-normal">{ebook ? `Chapter ${i + 1} of ${chapters.length}` : `${bi + 1} of ${shelf.length}`} <b className="font-bold text-folio-green">/ {book.shelfLabel}</b></p>
        <p className="kol-reader-label text-folio-muted">Your library. Your pace.</p>
      </footer>
    </Frame>
  )
}
