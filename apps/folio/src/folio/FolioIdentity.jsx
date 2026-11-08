/* Folio — A visual identity (Figma 228:12991) */
import { FolioFrame, Mark, Action, Jacket, ContinueCard, BOOKS, IN_PROGRESS, LABEL } from './parts'
import mark64 from './assets/mark-64.svg'
import fieldPoster from './assets/field-poster.svg'
import spineBlue from './assets/spine-blue.svg'
import spineTerracotta from './assets/spine-terracotta.svg'
import spineOchre from './assets/spine-ochre.svg'
import spineViolet from './assets/spine-violet.svg'

const PAIRINGS = ['Blue / navy', 'Terracotta / brown', 'Ochre / olive', 'Lilac / plum', 'Sage / forest', 'Rose / burgundy']
const PALETTE = [
  ['Paper', '#FAF9F5', 'Canvas', 'bg-folio-paper text-folio-ink'],
  ['Ink', '#262922', 'Primary text', 'bg-folio-ink text-folio-paper'],
  ['Muted', '#73766D', 'Supporting text', 'bg-folio-muted text-folio-paper'],
  ['Rule', '#D4D6CC', 'Dividers', 'bg-folio-rule text-folio-ink'],
  ['Surface', '#F0F0E9', 'Reading cards', 'bg-folio-surface text-folio-ink'],
  ['Mint', '#E0EEE2', 'Selection', 'bg-folio-mint text-folio-ink'],
  ['Reading green', '#365F49', 'Action / progress', 'bg-folio-green text-folio-paper'],
]
const SPINES = [[spineBlue, 35], [spineTerracotta, 49], [spineOchre, 63], [spineViolet, 77]]
const SPEC = 'text-[10px] text-folio-muted'

function SectionHead({ title, note }) {
  return (
    <div className="flex items-baseline justify-between whitespace-nowrap">
      <p className={LABEL}>{title}</p>
      <p className="text-[11px] text-folio-muted">{note}</p>
    </div>
  )
}

function World() {
  return (
    <div className="flex items-center gap-[48px]">
      <div className="flex w-[610px] shrink-0 flex-col gap-[28px]">
        <div className="flex items-center gap-[22px]">
          <p className="text-[208px] font-extrabold leading-none tracking-[-13px]">folio</p>
          <Mark src={mark64} size={64} />
        </div>
        <p className={SPEC}>INTER EXTRA BOLD, UI 38 px / 800 / −2 px</p>
        <div className={`flex gap-[24px] ${LABEL}`}><p>LITERARY.</p><p>PERSONAL.</p><p>ASSURED.</p></div>
        <p className="w-[540px] text-[15px] leading-[1.6] text-folio-muted">Warm paper. Clear structure. A shelf full of possibility. Familiar Folio, with a little more conviction.</p>
      </div>
      <div className="relative flex h-[390px] min-w-0 flex-1 flex-col justify-between overflow-hidden bg-[#a9c3d9] p-[32px]">
        {[72, 200, 328].map(t => <div key={t} className="absolute inset-x-0 h-[61px] bg-[#eeeadc]" style={{ top: t }} />)}
        <div className="absolute left-[440px] top-[83px] h-[290px] w-[280px]">
          <div className="absolute inset-[-16.55%_-17.14%]"><img alt="" src={fieldPoster} className="block size-full max-w-none" /></div>
        </div>
        <p className={`relative text-[#354e66] ${LABEL}`}>YOUR OWN LITTLE WORLD</p>
        <p className="relative text-[65px] font-bold leading-[1.02] tracking-[-3px]">A little room<br />for other<br />worlds.</p>
        <div className="relative flex justify-between whitespace-nowrap text-[10px] text-[#354e66]">
          <p className="font-semibold">YOUR LIBRARY. YOUR PACE.</p>
          <p>FOLIO / 02</p>
        </div>
      </div>
    </div>
  )
}

function Editions() {
  return (
    <section className="flex flex-col gap-[24px] border-t border-folio-ink pt-[25px]">
      <SectionHead title="01 / A RHYTHM OF OTHER WORLDS" note="Broad stripes. Soft fields. No literal illustrations." />
      <div className="flex gap-[24px]">
        {BOOKS.map((book, i) => (
          <div key={book.title} className="flex min-w-0 flex-1 flex-col gap-[12px]">
            <Jacket book={book} width={225.33} />
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold">{PAIRINGS[i]}</p>
              <span className="size-[14px]" style={{ background: book.ink }} />
            </div>
            <p className="text-[9px] text-folio-muted">{`${book.bg} / ${book.ink}`.toUpperCase()}</p>
          </div>
        ))}
      </div>
      <div className="flex items-start gap-[48px]">
        <p className="w-[425px] shrink-0 text-[26px] font-bold leading-[1.15] tracking-[-0.8px]">Structure, softened.</p>
        <p className="min-w-0 flex-1 text-[12px] leading-[1.65] text-folio-muted">Repeat broad bands, then interrupt the rhythm with a diffused field. Keep the jacket title on a quiet area; let the lower field carry the abstraction. One shared grid, six distinct moods. All artwork is built from editable shapes and blur effects.</p>
      </div>
    </section>
  )
}

function PaperAndInk() {
  return (
    <section className="flex flex-col gap-[24px] border-t border-folio-rule pt-[25px]">
      <SectionHead title="02 / PAPER & INK" note="A warm foundation. Green belongs to reading and action." />
      <div className="flex outline outline-folio-rule -outline-offset-1">
        {PALETTE.map(([name, hex, role, tone]) => (
          <div key={name} className={`flex h-[126px] min-w-0 flex-1 flex-col justify-between p-[16px] ${tone}`}>
            <p className="text-[12px] font-semibold">{name}</p>
            <div className="flex flex-col gap-[6px] text-[10px]"><p>{hex}</p><p>{role}</p></div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Type() {
  return (
    <section className="flex flex-col gap-[28px] border-t border-folio-ink pt-[27px]">
      <SectionHead title="03 / ONE FAMILY. A CLEAR HIERARCHY." note="Inter, 400 Regular / 500 Medium / 600 Semi Bold / 700 Bold / 800 Extra Bold" />
      <div className="flex items-start gap-[48px]">
        <div className="flex w-[760px] shrink-0 flex-col gap-[24px]">
          <p className="text-[15px] font-semibold">Inter / Bold</p>
          <p className="text-[92px] font-bold leading-[0.98] tracking-[-4.5px]">Stories stay.<br />Pages turn.</p>
          <p className={SPEC}>UI TITLE 72 / 700 / 100% / −3.4 px, PRESENTATION SPECIMEN 92 px</p>
          <p className="text-[25px] font-bold tracking-[-0.7px]">The Waves</p>
          <p className={SPEC}>READING TITLE 25 / 700 / Auto / −0.7 px</p>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[21px] border-l border-folio-rule pl-[32px]">
          <p className="text-[28px] font-bold tracking-[-0.8px]">Fresh on your shelf</p>
          <p className={SPEC}>SECTION 28 / 700 / Auto / −0.8 px</p>
          <p className="text-[16px] font-bold tracking-[-0.3px]">A Room of One’s Own</p>
          <p className={SPEC}>SHELF TITLE 16 / 700 / 120% / −0.3 px</p>
          <p className="text-[13px] leading-[1.5] text-folio-muted">Old favorites, new discoveries, and the next good chapter.</p>
          <p className={SPEC}>BODY 13 / 400, NAV 13 / 500, CONTROLS 12 / 600</p>
          <p className={`${LABEL} text-folio-muted`}>YOUR OWN LITTLE WORLD</p>
          <p className={SPEC}>LABEL 10 / 600 / +1.1 px, METADATA 10–11 / 400</p>
        </div>
      </div>
    </section>
  )
}

function InUse() {
  return (
    <section className="flex flex-col gap-[26px] border-t border-folio-rule pt-[27px]">
      <SectionHead title="04 / SAME WORLD. DIFFERENT SCALES." note="Rational grids, 1–2 px rules, 3 px controls, generous paper margins" />
      <div className="flex items-start gap-[32px]">
        <div className="flex w-[690px] shrink-0 flex-col gap-[18px]">
          <div className="flex items-center justify-between whitespace-nowrap">
            <p className="text-[25px] font-bold tracking-[-0.7px]">Pick up where you left off</p>
            <p className="text-[11px] text-folio-muted">2 in progress</p>
          </div>
          <ContinueCard {...IN_PROGRESS[0]} className="w-full" />
          <div className="flex gap-[12px]">
            <Action glyph="+" primary>Add a book</Action>
            <Action glyph="⌄">All collections</Action>
          </div>
          <p className={SPEC}>LIBRARY FRAGMENT, measured type, color and control recipes from the UI</p>
        </div>
        <div className="flex w-[254px] shrink-0 flex-col gap-[18px]">
          <div className="flex h-[290px] gap-[7px]">
            {SPINES.map(([src, top], i) => {
              const book = BOOKS[i]
              return (
                <div key={src} className="flex h-[290px] min-w-0 flex-1 flex-col justify-between overflow-hidden px-[10px] py-[16px]" style={{ background: book.bg, color: book.ink }}>
                  <p className="text-[12px] font-extrabold tracking-[-0.5px]">folio</p>
                  <div className="relative h-[174px] w-full overflow-hidden">
                    <div className="absolute left-0 h-[80px] w-[38px]" style={{ top }}>
                      <div className="absolute inset-[-12.5%_-26.32%]"><img alt="" src={src} className="block size-full max-w-none" /></div>
                    </div>
                    {[132, 88, 44, 0].map(t => <div key={t} className="absolute left-0 h-[18px] w-[38.25px] bg-[#eeeadc]" style={{ top: t }} />)}
                  </div>
                  <p className="text-[10px] font-bold">{String(i + 1).padStart(2, '0')}</p>
                </div>
              )
            })}
          </div>
          <p className="text-[10px] leading-[1.5] text-folio-muted">SPINE STUDIES, the same band rhythm, condensed</p>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[18px]">
          <div className="flex h-[290px] flex-col justify-between bg-folio-mint p-[26px]">
            <p className={`${LABEL} text-folio-green`}>YOUR OWN LITTLE WORLD</p>
            <p className="text-[37px] font-bold leading-[1.05] tracking-[-1.5px]">Leave a little<br />space for the<br />next good chapter.</p>
            <div className="flex items-center justify-between">
              <p className="text-[22px] font-extrabold tracking-[-1px] text-folio-green">folio</p>
              <Mark />
            </div>
          </div>
          <p className={SPEC}>READING NOTE, a bold voice, still inviting</p>
        </div>
      </div>
    </section>
  )
}

export default function FolioIdentity() {
  return (
    <FolioFrame className="max-w-[1600px] gap-[34px] px-[64px] pb-[32px] pt-[40px]">
      <div className={`flex justify-between whitespace-nowrap border-b-2 border-folio-ink pb-[18px] ${LABEL}`}>
        <p>FOLIO / A VISUAL IDENTITY</p>
        <p className="text-folio-muted">SWISS EDITORIAL EDITION — 02</p>
      </div>
      <World />
      <Editions />
      <PaperAndInk />
      <Type />
      <InUse />
      <div className="flex justify-between whitespace-nowrap border-t border-folio-ink pt-[23px] text-[10px] text-folio-muted">
        <p>New abstract compositions. The same little world. Folio — Swiss editorial edition.</p>
        <p className="font-semibold tracking-[1.1px]">FOLIO / VISUAL NOTES / 02</p>
      </div>
    </FolioFrame>
  )
}
