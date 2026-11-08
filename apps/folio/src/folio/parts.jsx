/* Folio — local parts for the /demo-3 proposal (Figma zzzb4WqmCsDTPlP95Weo2M, section 228:12990).
   Built straight from the frames; no KOL components. Icons are the kol-icon-set glyphs the frames use. */
import { Link } from 'react-router-dom'
import { IconLoader as KolIcon } from '@kolkrabbi/kol-icons'
import markSrc from './assets/mark.svg'
import fieldBlue from './assets/field-blue.svg'
import fieldOchre from './assets/field-ochre.svg'
import fieldViolet from './assets/field-violet.svg'
import fieldSage from './assets/field-sage.svg'
import fieldRose from './assets/field-rose.svg'

export const LABEL = 'text-[10px] font-semibold tracking-[1.1px]'
export const SECTION = 'text-[28px] font-bold tracking-[-0.8px]'
export const PROSE = 'text-[20px] leading-[1.65]'

/* the face is the DS's Inter (kol-theme ≥ 0.211, /fonts/inter); `attrs` carries /demo-4's theme, palette, accent */
export function FolioFrame({ className = 'max-w-[1440px]', attrs, children }) {
  return (
    <div {...attrs} className="min-h-screen bg-folio-paper font-folio leading-[1.21] text-folio-ink">
      <div className={`mx-auto flex flex-col ${className}`}>{children}</div>
    </div>
  )
}

export const Icon = ({ name, size = 16 }) => <KolIcon name={name} size={size} />

export function Mark({ src = markSrc, size = 24 }) {
  /* the mark is drawn in ink; on Folio's night paper it turns with the ink */
  return <img alt="" src={src} width={size} height={size} className="block shrink-0 [[data-folio-theme=dark]_&]:invert" />
}

export function Wordmark({ to = '/mockups' }) {
  return (
    <Link to={to} className="flex items-center gap-[10px]">
      <span className="text-[38px] font-extrabold tracking-[-2px]">folio</span>
      <Mark />
    </Link>
  )
}

export function Profile() {
  return (
    <div className="flex size-[34px] items-center justify-center rounded-full border border-folio-rule bg-folio-surface text-[11px] font-bold">JL</div>
  )
}

export function Action({ children, glyph, primary }) {
  const tone = primary ? 'border-folio-green bg-folio-green text-folio-paper' : 'border-folio-rule bg-folio-paper text-folio-ink'
  return (
    <button type="button" className={`flex h-[42px] shrink-0 items-center gap-[12px] whitespace-nowrap rounded-[3px] border px-[16px] ${tone}`}>
      <span className="text-[12px] font-semibold">{children}</span>
      <span className="text-[16px]">{glyph}</span>
    </button>
  )
}

/* ── the abstract jacket: drawn once at the shelf size, scaled to any width ── */

const J = { w: 201.33, h: 281.862 }

const Band = ({ top, h, color, left = 0, w = J.w }) => (
  <div className="absolute" style={{ top, left, width: w, height: h, background: color }} />
)

const Field = ({ src, box: [left, top, width, height], inset }) => (
  <div className="absolute" style={{ left, top, width, height }}>
    <div className="absolute" style={{ inset }}><img alt="" src={src} className="block size-full max-w-none" /></div>
  </div>
)

const PAPER = '#eeeadc'
const ART = {
  blue: <>
    <Field src={fieldBlue} box={[49.26, 128.51, 107.09, 117.799]} inset="-16.36% -18%" />
    {[224.89, 167.06, 109.23].map(t => <Band key={t} top={t} h={28.914} color={PAPER} />)}
  </>,
  terracotta: <>
    <div className="absolute blur-[9.638px]" style={{ left: 47.12, top: 130.65, width: 107.09, height: 95.31, background: '#d98657' }} />
    {[223.82, 165.99, 108.16].map(t => <Band key={t} top={t} h={31.056} color="#e9a1a3" />)}
  </>,
  ochre: <>
    <Field src={fieldOchre} box={[46.05, 122.08, 109.232, 107.09]} inset="-19% -18.63%" />
    <Band top={161.71} h={119.941} color={PAPER} />
  </>,
  violet: <>
    <Field src={fieldViolet} box={[58.9, 134.93, 87.814, 117.799]} inset="-12.73% -17.07%" />
    {[250.59, 222.75, 194.9, 167.06, 139.22, 111.37].map(t => <Band key={t} top={t} h={12.851} color="#e5d9e8" />)}
  </>,
  sage: <>
    <Field src={fieldSage} box={[10.71, 164.92, 175.628, 74.963]} inset="-24.29% -10.37%" />
    {[152.07, 82.46, 12.85].map(l => <Band key={l} top={111.37} left={l} w={32.127} h={171.345} color="#dae2cd" />)}
  </>,
  rose: <>
    <Field src={fieldRose} box={[42.84, 134.93, 117.799, 107.09]} inset="-21% -19.09%" />
    <Band top={217.39} h={27.844} color="#eeddd6" />
    <Band top={117.8} h={66.396} color={PAPER} />
  </>,
}

/* the same six patterns, drawn in any colourway (/demo-4's generated covers): the soft field is a blurred ellipse in the
   colourway's field colour — the blur each edition's SVG carries — so a pattern can wear another edition's colours */
const Glow = ({ box: [left, top, width, height], blur, color, rect }) => (
  <div className="absolute" style={{ left, top, width, height, background: color, filter: `blur(${blur}px)`, borderRadius: rect ? 0 : '50%' }} />
)
const PATTERN = {
  blue: (c) => <>
    <Glow box={[49.26, 128.51, 107.09, 117.799]} blur={9.638} color={c.field} />
    {[224.89, 167.06, 109.23].map(t => <Band key={t} top={t} h={28.914} color={c.paper} />)}
  </>,
  terracotta: (c) => <>
    <Glow box={[47.12, 130.65, 107.09, 95.31]} blur={9.638} color={c.field} rect />
    {[223.82, 165.99, 108.16].map(t => <Band key={t} top={t} h={31.056} color={c.band} />)}
  </>,
  ochre: (c) => <>
    <Glow box={[46.05, 122.08, 109.232, 107.09]} blur={10.174} color={c.field} />
    <Band top={161.71} h={119.941} color={c.paper} />
  </>,
  violet: (c) => <>
    <Glow box={[58.9, 134.93, 87.814, 117.799]} blur={7.496} color={c.field} />
    {[250.59, 222.75, 194.9, 167.06, 139.22, 111.37].map(t => <Band key={t} top={t} h={12.851} color={c.band} />)}
  </>,
  sage: (c) => <>
    <Glow box={[10.71, 164.92, 175.628, 74.963]} blur={9.103} color={c.field} />
    {[152.07, 82.46, 12.85].map(l => <Band key={l} top={111.37} left={l} w={32.127} h={171.345} color={c.band} />)}
  </>,
  rose: (c) => <>
    <Glow box={[42.84, 134.93, 117.799, 107.09]} blur={11.245} color={c.field} />
    <Band top={217.39} h={27.844} color={c.band} />
    <Band top={117.8} h={66.396} color={c.paper} />
  </>,
}
export const PATTERNS = Object.keys(PATTERN)

export function Jacket({ book, width }) {
  const s = width / J.w
  return (
    <div className="relative shrink-0 overflow-hidden rounded-[1px]" style={{ width, height: J.h * s }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: J.w, height: J.h, background: book.bg, color: book.ink, transform: `scale(${s})` }}>
        <p className="absolute left-[14.99px] top-[262.37px] w-[176.699px] truncate text-[6.961px] font-semibold tracking-[0.1606px]">{book.foot ?? book.author.toUpperCase()}</p>
        <div className="absolute left-[14.99px] top-[38.55px] w-[175.628px] font-bold leading-[1.02] tracking-[-0.8567px]" style={{ fontSize: book.titleSize ?? 25.702 }}>
          {book.cover
            ? book.cover.map(line => <p key={line}>{line}</p>)
            : <p className="line-clamp-2 break-words">{book.coverTitle ?? book.title}</p>}
          {book.subtitle && <p className="mt-[5px] line-clamp-2 text-[9px] font-semibold leading-[1.25] tracking-[0.1px]">{book.subtitle}</p>}
        </div>
        <p className="absolute left-[14.99px] top-[13.92px] w-[171.345px] text-[6.961px] font-semibold tracking-[0.8567px]">{book.series ?? 'THE FOLIO EDITIONS'}</p>
        {book.colours ? PATTERN[book.pattern](book.colours) : ART[book.art]}
      </div>
    </div>
  )
}

export const BOOKS = [
  { title: 'The Waves', cover: ['The', 'Waves'], author: 'Virginia Woolf', genre: 'Fiction', art: 'blue', bg: '#a9c3d9', ink: '#354e66', status: 'Reading, 42%', reading: true, added: 'Today' },
  { title: 'A Room of One’s Own', cover: ['A Room of', 'One’s Own'], author: 'Virginia Woolf', genre: 'Essays', art: 'terracotta', bg: '#d9806b', ink: '#4c302b', status: 'Reading, 18%', reading: true, added: 'Today' },
  { title: 'The Garden Party', cover: ['The Garden', 'Party'], author: 'Katherine Mansfield', genre: 'Fiction', art: 'ochre', bg: '#e9cb7e', ink: '#51543a', status: 'Unread', added: 'Oct 29, 2026' },
  { title: 'The Metamorphosis', cover: ['The', 'Metamorphosis'], author: 'Franz Kafka', genre: 'Fiction', art: 'violet', bg: '#c5b7d5', ink: '#453a55', titleSize: 21.418, status: '✓ Finished', added: 'Oct 27, 2026' },
  { title: 'The Enchanted April', cover: ['The Enchanted', 'April'], author: 'Elizabeth von Arnim', genre: 'Fiction', art: 'sage', bg: '#9ebaa5', ink: '#304c3e', status: 'Unread', added: 'Oct 24, 2026' },
  { title: 'Letters to a Young Poet', cover: ['Letters to a', 'Young Poet'], author: 'Rainer Maria Rilke', genre: 'Poetry', art: 'rose', bg: '#deb7bc', ink: '#623b43', status: '✓ Finished', added: 'Oct 22, 2026' },
]

export const IN_PROGRESS = [
  { book: BOOKS[0], context: 'THE THIRD INTERLUDE', page: 'Page 125 of 297', pct: 42, last: 'Last read 2 hours ago' },
  { book: BOOKS[1], context: 'CHAPTER TWO', page: 'Page 20 of 112', pct: 18, last: 'Last read yesterday' },
]

export function ContinueCard({ book, context, page, pct, last, className = 'flex-1' }) {
  return (
    <div className={`flex min-w-0 items-center gap-[24px] border-t border-folio-rule bg-folio-surface px-[20px] pb-[20px] pt-[19px] ${className}`}>
      <Jacket book={book} width={94} />
      <div className="flex min-w-0 flex-1 flex-col gap-[9px]">
        <div className="flex items-start justify-between whitespace-nowrap">
          <p className={`${LABEL} text-folio-muted`}>{context}</p>
          <p className="text-[17px]">…</p>
        </div>
        <p className="text-[25px] font-bold tracking-[-0.7px]">{book.title}</p>
        <p className="text-[11px] text-folio-muted">{book.author}</p>
        <div className="flex justify-between text-[11px]">
          <p className="text-folio-muted">{page}</p>
          <p className="font-bold text-folio-green">{pct}%</p>
        </div>
        <div className="h-[4px] w-full bg-folio-rule"><div className="h-full bg-folio-green" style={{ width: `${pct}%` }} /></div>
        <div className="flex items-center justify-between whitespace-nowrap">
          <Link to="/mockups/reader" className="flex gap-[12px] rounded-[3px] bg-folio-mint px-[11px] py-[7px] text-folio-green">
            <span className="text-[11px] font-semibold">Resume reading</span>
            <span className="text-[12px]">→</span>
          </Link>
          <p className="text-[10px] text-folio-muted">{last}</p>
        </div>
      </div>
    </div>
  )
}
