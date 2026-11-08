/* Folio — Ebook reader (Figma 228:13788) */
import { Link } from 'react-router-dom'
import { FolioFrame, Wordmark, Icon, LABEL, SECTION, PROSE } from './parts'
import rhythm from './assets/rhythm.svg'

const CONTENTS = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth']
const CURRENT = 2

function Masthead() {
  return (
    <header className="flex h-[88px] items-center justify-between border-b border-folio-ink px-[56px]">
      <div className="flex items-center gap-[32px] whitespace-nowrap">
        <Wordmark />
        <Link to="/mockups" className="flex items-center gap-[10px] text-[13px] font-medium"><Icon name="arrow-left" />My library</Link>
        <span className="h-[24px] w-px bg-folio-rule" />
        <p className="text-[13px] text-folio-muted">The Waves / Virginia Woolf</p>
      </div>
      <div className="flex items-center gap-[12px] text-[13px] font-semibold">
        <button type="button" className="flex h-[40px] items-center whitespace-pre rounded-[3px] border border-folio-mint bg-folio-mint px-[14px] text-folio-green">{'☰  Contents'}</button>
        <button type="button" aria-label="Search book" className="flex size-[40px] items-center justify-center rounded-[3px] border border-folio-rule"><Icon name="search" size={18} /></button>
        <button type="button" aria-label="Bookmark page" className="flex size-[40px] items-center justify-center rounded-[3px] border border-folio-rule"><Icon name="bookmark" size={18} /></button>
        <button type="button" className="flex h-[40px] items-center whitespace-pre rounded-[3px] border border-folio-rule bg-folio-paper px-[14px]">{'Aa  Reading settings'}</button>
      </div>
    </header>
  )
}

function ContentsRail() {
  return (
    <aside className="flex w-[224px] shrink-0 flex-col gap-[28px]">
      <div className="flex flex-col gap-[14px]">
        <p className={`${LABEL} text-folio-muted`}>IN YOUR LIBRARY / EPUB</p>
        <p className={SECTION}>The Waves</p>
        <p className="text-[13px] text-folio-muted">Virginia Woolf</p>
      </div>
      <nav className="flex flex-col gap-[6px]">
        <div className="flex justify-between border-b border-folio-ink pb-[15px]">
          <p className="text-[13px] font-bold">Contents</p>
          <p className="text-[11px] text-folio-muted">09</p>
        </div>
        {CONTENTS.map((name, i) => (
          <a key={name} href="#" className={`flex gap-[14px] rounded-[3px] px-[12px] py-[13px] ${i === CURRENT ? 'bg-folio-mint text-folio-green' : 'bg-folio-paper'}`}>
            <span className={`text-[11px] ${i === CURRENT ? '' : 'text-folio-muted'}`}>{String(i + 1).padStart(2, '0')}</span>
            <span className={`min-w-0 flex-1 text-[13px] ${i === CURRENT ? 'font-bold' : ''}`}>{name} interlude</span>
          </a>
        ))}
      </nav>
      <div className="flex flex-col gap-[12px] border-t border-folio-rule pt-[19px]">
        <div className="flex justify-between text-[11px]">
          <p className="text-folio-muted">Through the book</p>
          <p className="font-bold text-folio-green">42%</p>
        </div>
        <div className="h-[4px] bg-folio-rule"><div className="h-full w-[94px] bg-folio-green" /></div>
        <p className="text-[11px] text-folio-muted">Reading position saved</p>
      </div>
    </aside>
  )
}

function Chapter() {
  return (
    <article className="flex w-[720px] shrink-0 flex-col gap-[32px]">
      <div className="flex justify-between whitespace-nowrap border-b border-folio-rule pb-[15px] text-folio-muted">
        <p className={LABEL}>THE WAVES / INTERLUDE 03</p>
        <p className="text-[11px]">125 / 297</p>
      </div>
      <div className="flex flex-col gap-[18px] pb-[10px] pt-[16px]">
        <p className={`${LABEL} text-folio-muted`}>03 / SAMPLE READING TEXT</p>
        <h1 className="text-[56px] font-bold leading-[1.05] tracking-[-2.4px]">The third<br />interlude</h1>
        <p className="text-[12px] leading-[1.6] text-folio-muted">Original demonstration prose by Folio for this reader layout. Not text from Virginia Woolf’s novel. Contents and pagination are illustrative.</p>
      </div>
      <div className={`flex flex-col gap-[24px] ${PROSE}`}>
        <p>By the time I reached the water, the town had begun to open its windows. A chair scraped against a kitchen floor; somewhere a radio was finding a station. These small sounds crossed the street and faded at the wall of the harbour, where the morning seemed to have a different measure.</p>
        <p>I had brought a book, but for a while I left it closed. There was pleasure in holding a place without needing to move beyond it. The paper kept the warmth of my hand. On the opposite shore, a line of houses appeared and disappeared as the light changed, each familiar shape becoming briefly unfamiliar.</p>
        <p>We tend to remember a journey by its arrivals. <b className="font-bold">The intervals do their work more quietly.</b> A pause at a crossing, the slow passage of a cloud, a sentence read twice: none of these would make a useful itinerary. Yet they were the things that returned to me when I thought of that summer.</p>
        <div className="flex flex-col gap-[10px] border-l-3 border-folio-green bg-folio-mint p-[20px]">
          <p>Attention is not always a matter of looking harder. Sometimes it is simply a willingness to remain.</p>
          <p className="text-[11px] font-semibold leading-[1.21] text-folio-green">Your highlight, Note 1</p>
        </div>
        <p>The tide was turning, although I could not have said exactly when it had begun. A rope that had hung loose was now drawn straight. I noticed it only because I had stopped watching for a change. There is a kind of understanding that arrives after the watching is over.</p>
      </div>
      <div className={`flex flex-col gap-[24px] pt-[12px] ${PROSE}`}>
        <h2 className={`${SECTION} leading-[1.2]`}>A place to return to</h2>
        <p>When I opened the book at last, the first sentence seemed to belong to the place where I was sitting. Not because it described the sea, or the town, or anything I could point to. It gave a shape to the feeling of being there: present, but with room enough for another world beside this one.</p>
        <blockquote className="flex flex-col gap-[16px] border-l-3 border-folio-green py-[4px] pl-[24px]">
          <p className="text-[25px] font-medium leading-[1.45] tracking-[-0.4px]">“A page can hold our place even while the world continues around it.”</p>
          <p className="text-[12px] leading-[1.6] text-folio-muted">From this original sample interlude</p>
        </blockquote>
        <p>I read until the shadow of the wall had moved across my shoes. Then I folded the small slip of paper that marked my place and stood up. Nothing remarkable had happened. For once, that did not seem like something missing from the day.</p>
      </div>
      <p className="border-t border-folio-rule pt-[19px] text-[12px] leading-[1.65] text-folio-muted">
        <b className="font-bold">1.</b> A reader’s note: notice the change from watching to remaining. <a href="#" className="text-folio-green underline">View in highlights ↗</a>
      </p>
      <div className="flex justify-between border-t border-folio-ink pt-[27px] whitespace-nowrap">
        <a href="#" className="flex items-center gap-[12px]">
          <Icon name="arrow-left" size={18} />
          <span className="flex flex-col gap-[6px]"><span className="text-[10px] text-folio-muted">PREVIOUS INTERLUDE</span><span className="text-[13px] font-semibold">Second interlude</span></span>
        </a>
        <a href="#" className="flex items-center gap-[12px]">
          <span className="flex flex-col gap-[6px]"><span className="text-[10px] text-folio-muted">NEXT INTERLUDE</span><span className="text-[13px] font-semibold">Fourth interlude</span></span>
          <Icon name="arrow-right" size={18} />
        </a>
      </div>
    </article>
  )
}

function Margin() {
  return (
    <aside className="flex w-[240px] shrink-0 flex-col gap-[24px] border-l border-folio-rule pl-[24px]">
      <p className={`${LABEL} text-folio-muted`}>YOUR OWN LITTLE WORLD</p>
      <img alt="" src={rhythm} width={204} height={168} className="block" />
      <p className="text-[13px] leading-[1.6] text-folio-muted">A little room for the next good chapter.</p>
      <div className="flex flex-col gap-[12px] border-t border-folio-rule pt-[23px]">
        <p className="text-[11px] font-semibold text-folio-green">01 / READING NOTE</p>
        <p className="text-[13px] leading-[1.65] text-folio-muted">The intervals matter as much as the arrivals. A thought to take into the next chapter.</p>
        <p className="text-[11px] text-folio-muted">Your note, Page 125</p>
      </div>
    </aside>
  )
}

export default function FolioReader() {
  return (
    <FolioFrame>
      <Masthead />
      <div className="flex items-start gap-[72px] px-[56px] pb-[64px] pt-[40px]">
        <ContentsRail />
        <Chapter />
        <Margin />
      </div>
      <footer className="flex h-[64px] items-center justify-between border-t border-folio-rule px-[56px] whitespace-nowrap">
        <p className="text-[11px] text-folio-muted">The Waves, Virginia Woolf</p>
        <p className="whitespace-pre text-[12px]">{'Page 125 of 297 '}<b className="font-bold text-folio-green">{' / 42%'}</b></p>
        <p className={`${LABEL} text-folio-muted`}>YOUR LIBRARY. YOUR PACE.</p>
      </footer>
    </FolioFrame>
  )
}
