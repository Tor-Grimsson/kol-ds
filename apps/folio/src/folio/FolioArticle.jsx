/* Folio — Article reader (Figma 228:13639) */
import { Link } from 'react-router-dom'
import { FolioFrame, Wordmark, Profile, Icon, LABEL, SECTION, PROSE } from './parts'
import fieldLead from './assets/field-lead.svg'
import thumbViolet from './assets/thumb-violet.svg'
import thumbSage from './assets/thumb-sage.svg'

const SECTIONS = ['A place, not a list', 'Make room for attention', 'Leave a way back']
const PRINCIPLES = [
  ['Give each text a home.', 'Keep the title, author and reading position together. Recognition is faster than reconstruction.'],
  ['Let the words set the pace.', 'Use a comfortable line length, generous leading and a clear pause between paragraphs.'],
  ['Make stopping feel safe.', 'Save the place without ceremony. A reader should not need to finish a chapter to leave it well.'],
]
const RELATED = [
  [thumbViolet, 'READING CULTURE / 4 MIN', 'The life of a saved sentence', 'On highlights, memory and the pleasure of returning.'],
  [thumbSage, 'DIGITAL LIBRARIES / 6 MIN', 'A shelf with room to grow', 'Collecting books without turning reading into a task.'],
]

function Masthead() {
  return (
    <header className="flex h-[88px] items-center justify-between border-b border-folio-ink px-[56px]">
      <Wordmark />
      <nav className="flex items-center gap-[30px] whitespace-nowrap text-[13px]">
        <Link to="/mockups" className="font-medium text-folio-muted">My library</Link>
        <span className="font-medium text-folio-muted">Collections</span>
        <span className="font-medium text-folio-muted">Highlights</span>
        <Link to="/mockups/article" className="flex h-[40px] items-center rounded-[3px] border border-folio-mint bg-folio-mint px-[14px] font-semibold text-folio-green">Reading journal</Link>
      </nav>
      <div className="flex items-center gap-[20px]">
        <Icon name="search" size={18} />
        <Profile />
      </div>
    </header>
  )
}

function Introduction() {
  return (
    <div className="flex flex-col gap-[32px] px-[56px] pb-[48px] pt-[32px]">
      <div className="flex items-center justify-between whitespace-nowrap">
        <Link to="/mockups/article" className="flex items-center gap-[10px] text-[12px] font-semibold"><Icon name="arrow-left" />Reading journal</Link>
        <p className={`${LABEL} text-folio-muted`}>FIELD NOTES / READING &amp; DESIGN</p>
      </div>
      <div className="flex flex-col gap-[24px] pt-[12px]">
        <h1 className="w-[1140px] max-w-full text-[72px] font-bold leading-none tracking-[-3.4px]">A library is a place,<br />not a list.</h1>
        <div className="flex items-end gap-[72px]">
          <p className="w-[944px] shrink-0 text-[25px] leading-[1.4] tracking-[-0.5px]">What changes when we design a digital bookshelf around the experience of reading, rather than the business of keeping track?</p>
          <div className="flex min-w-0 flex-1 flex-col gap-[8px] whitespace-nowrap">
            <p className="text-[13px] font-semibold">By Folio studio</p>
            <p className="text-[12px] text-folio-muted">01 November 2026, 5 min read</p>
            <p className="text-[11px] text-folio-muted">Original demo editorial</p>
          </div>
        </div>
      </div>
      <figure className="flex flex-col gap-[12px]">
        <div className="relative h-[376px] w-full overflow-hidden bg-[#a9c3d9]">
          {[70, 182, 294].map(t => <div key={t} className="absolute inset-x-0 h-[56px] bg-[#eeeadc]" style={{ top: t }} />)}
          <div className="absolute left-[764px] top-[36px] size-[330px]">
            <div className="absolute inset-[-15.76%]"><img alt="" src={fieldLead} className="block size-full max-w-none" /></div>
          </div>
          <p className={`absolute left-[32px] top-[28px] text-[#354e66] ${LABEL}`}>FOLIO / FIELD NOTES</p>
          <p className="absolute left-[32px] top-[116px] w-[630px] text-[64px] font-bold leading-[1.02] tracking-[-3px]">A little room<br />for attention.</p>
          <p className={`absolute left-[32px] top-[338px] text-[#354e66] ${LABEL}`}>STRUCTURE, SOFTENED.</p>
          <p className="absolute left-[1214px] top-[338px] text-[10px] text-[#354e66]">STUDY / 03</p>
        </div>
        <figcaption className="flex items-start justify-between whitespace-nowrap text-folio-muted">
          <p className="text-[12px]">Fig. 01 — A shared rhythm, with space for something unexpected. An original Folio graphic study.</p>
          <p className="text-[11px]">Folio / Abstract editions</p>
        </figcaption>
      </figure>
    </div>
  )
}

function ArticleNav() {
  return (
    <aside className="flex w-[224px] shrink-0 flex-col gap-[24px]">
      <nav className="flex flex-col gap-[18px] border-t-2 border-folio-ink pt-[18px]">
        <p className={`${LABEL} text-folio-muted`}>IN THIS ARTICLE</p>
        {SECTIONS.map((name, i) => (
          <a key={name} href={`#s${i + 1}`} className={`flex items-start gap-[12px] py-[10px] ${i === 0 ? 'font-bold text-folio-green' : 'text-folio-muted'}`}>
            <span className="text-[11px]">{String(i + 1).padStart(2, '0')}</span>
            <span className="min-w-0 flex-1 text-[13px] leading-[1.5]">{name}</span>
          </a>
        ))}
      </nav>
      <div className="flex flex-col gap-[12px] border-t border-folio-rule pt-[23px] text-[12px] font-semibold">
        <button type="button" className="flex h-[42px] items-center gap-[10px] rounded-[3px] bg-folio-mint px-[14px] text-folio-green"><Icon name="bookmark" />Save to my library</button>
        <button type="button" className="flex h-[42px] items-center gap-[10px] rounded-[3px] border border-folio-rule px-[14px]"><Icon name="link" />Copy article link</button>
      </div>
    </aside>
  )
}

const Kicker = ({ children }) => <p className={`${LABEL} leading-[1.21] text-folio-muted`}>{children}</p>
const H2 = ({ children }) => <h2 className={`${SECTION} leading-[1.2]`}>{children}</h2>

function Body() {
  return (
    <article className="flex w-[720px] shrink-0 flex-col gap-[48px]">
      <section id="s1" className={`flex flex-col gap-[24px] ${PROSE}`}>
        <Kicker>01 / THE SHELF</Kicker>
        <H2>A place, not a list</H2>
        <p>A physical bookshelf does more than store books. It holds the one we meant to start, the one a friend pressed into our hands, and the one we cannot quite give away. Its order may be imperfect, but it is legible to us. We know where to look because we remember what it feels like to be there.</p>
        <p>Digital libraries often begin elsewhere: with a count, a filter and a table. Those tools are useful. They answer the question, What do I own? But they do not always help with the question that brings us back: <b className="font-bold">What do I want to spend time with?</b> The distinction is small enough to miss and important enough to design around.</p>
        <p>A shelf becomes a place when its contents feel recognisable and its next steps feel inviting. The cover, the title and a remembered passage can do more work than another category. Discovery does not always need a recommendation engine. Sometimes it needs a familiar book, seen again.</p>
        <blockquote className="flex flex-col gap-[16px] border-l-3 border-folio-green py-[4px] pl-[24px]">
          <p className="text-[25px] font-medium leading-[1.45] tracking-[-0.4px]">“The best reading interface is not the one we notice least. It is the one that asks least of us.”</p>
          <p className="text-[12px] leading-[1.6] text-folio-muted">Folio studio / A principle for the reading experience</p>
        </blockquote>
      </section>
      <section id="s2" className={`flex flex-col gap-[24px] ${PROSE}`}>
        <Kicker>02 / THE READING ROOM</Kicker>
        <H2>Make room for attention</H2>
        <p>Moving from the shelf to the page should feel like settling into a chair. The controls are still there, but their urgency changes. Search becomes a tool rather than a destination. Progress becomes a quiet reassurance, not a target. A bookmark should offer a way back without turning every pause into a task.</p>
        <p>Typography carries much of this transition. A bold heading can orient us quickly; a paragraph needs to sustain us slowly. The same type family can do both, provided its scale, line length and spacing change with the job. The point is not to make every screen look identical. It is to make every screen feel like part of the same world.</p>
        <ol className="flex flex-col gap-[24px] py-[8px]">
          {PRINCIPLES.map(([lead, rest], i) => (
            <li key={lead} className="flex items-start gap-[20px]">
              <span className="w-[24px] shrink-0 font-semibold text-folio-green">{i + 1}.</span>
              <p className="min-w-0 flex-1"><b className="font-bold">{lead}</b> {rest}</p>
            </li>
          ))}
        </ol>
        <p>This also gives visual character a more useful role. Broad bands establish a rhythm; a diffused field interrupts it. In a cover or a lead image, that tension can be expressive. Alongside a paragraph, it should fall quiet. <Link to="/mockups/identity" className="text-folio-green underline">The abstract editions ↗</Link> begin with that balance between structure and softness.</p>
        <aside className="flex flex-col gap-[12px] border-t-2 border-folio-green bg-folio-surface px-[24px] pb-[24px] pt-[22px]">
          <p className={`${LABEL} leading-[1.21] text-folio-muted`}>A NOTE ON COMFORT¹</p>
          <p className="text-[16px] leading-[1.65]">There is no single perfect reading setting. A clear default matters, but so does the freedom to change the size, measure or theme without losing your place.</p>
        </aside>
      </section>
      <section id="s3" className={`flex flex-col gap-[24px] ${PROSE}`}>
        <Kicker>03 / THE RETURN</Kicker>
        <H2>Leave a way back</H2>
        <p>Reading rarely happens in one uninterrupted sitting. It happens between other things: on a train, before sleep, while a meal is cooking. A good library respects those edges. It remembers enough that we do not have to, and it gives our unfinished books a visible, unembarrassed place to wait.</p>
        <p>A highlight is part of that memory, but a saved sentence is more useful with its surroundings intact. Show where it came from. Keep a route to the chapter. Leave space for a note that may make sense only to its reader. A library is not simply a collection of finished objects; it is a collection of relationships still being made.</p>
        <p>We can still count the books. We can still sort by author, format or date. But those are the shelves, not the whole room. The deeper task is to make a place that welcomes attention and allows departure: a little structure around the words, and enough freedom to find our own pace.</p>
        <div className="flex items-center gap-[12px] pt-[8px]">
          <span className="size-[8px] bg-folio-green" />
          <p className="text-[13px] font-semibold leading-[1.21] text-folio-green">Your library. Your pace.</p>
        </div>
      </section>
      <div className="flex flex-col gap-[24px] border-t border-folio-rule pt-[23px]">
        <p className="text-[12px] leading-[1.65] text-folio-muted"><b className="font-bold">1.</b> Comfort here means a reader’s own sense of ease, not a universal prescription. The ideas in this article are design observations, not research findings.</p>
        <div className="flex items-center gap-[20px]">
          <div className="flex size-[56px] shrink-0 items-center justify-center bg-folio-mint text-[30px] font-extrabold tracking-[-1.5px] text-folio-green">f.</div>
          <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
            <p className="text-[14px] font-bold">Folio studio</p>
            <p className="text-[13px] leading-[1.6] text-folio-muted">Original demo writing from the Folio design concept, exploring the spaces between books, people and interfaces.</p>
          </div>
        </div>
      </div>
    </article>
  )
}

function Margin() {
  return (
    <aside className="flex w-[240px] shrink-0 flex-col gap-[20px] border-l border-folio-rule pl-[24px] pt-[20px]">
      <p className={`${LABEL} text-folio-muted`}>THE IDEA IN BRIEF</p>
      <p className="text-[25px] font-bold leading-[1.2] tracking-[-0.7px]">Less managing. More reading.</p>
      <p className="text-[13px] leading-[1.65] text-folio-muted">A digital shelf should help us find a book, settle into its pages and return without friction.</p>
      <div className="flex flex-col gap-[10px] border-t border-folio-rule pt-[19px] text-[11px] text-folio-muted">
        <p>Reading culture</p>
        <p>Digital libraries</p>
        <p>Editorial design</p>
      </div>
    </aside>
  )
}

export default function FolioArticle() {
  return (
    <FolioFrame>
      <Masthead />
      <Introduction />
      <div className="flex items-start gap-[72px] px-[56px] pb-[64px]">
        <ArticleNav />
        <Body />
        <Margin />
      </div>
      <section className="flex flex-col gap-[28px] border-t border-folio-ink px-[56px] pb-[48px] pt-[31px]">
        <div className="flex items-baseline justify-between">
          <h2 className={`${SECTION} min-w-0 flex-1 leading-[1.2]`}>Stay a little longer</h2>
          <a href="#" className="text-[12px] font-semibold text-folio-green">All field notes ↗</a>
        </div>
        <div className="flex gap-[32px]">
          {RELATED.map(([src, kicker, title, dek]) => (
            <a key={title} href="#" className="flex min-w-0 flex-1 items-start gap-[24px] border-t border-folio-rule pt-[19px]">
              <img alt="" src={src} width={128} height={144} className="block shrink-0" />
              <div className="flex min-w-0 flex-1 flex-col gap-[14px]">
                <p className={`${LABEL} text-folio-muted`}>{kicker}</p>
                <p className="text-[25px] font-bold leading-[1.15] tracking-[-0.7px]">{title}</p>
                <p className="text-[13px] leading-[1.6] text-folio-muted">{dek}</p>
                <p className="flex items-center gap-[10px] text-[12px] font-semibold text-folio-green">Read field note<Icon name="arrow-right" /></p>
              </div>
            </a>
          ))}
        </div>
      </section>
      <footer className="flex h-[84px] items-center justify-between whitespace-nowrap border-t border-folio-rule px-[56px]">
        <p className="text-[28px] font-extrabold tracking-[-1.4px]">folio</p>
        <p className="text-[13px] text-folio-muted">A good book is a place to begin again.</p>
        <p className={`${LABEL} text-folio-muted`}>YOUR LIBRARY. YOUR PACE.</p>
      </footer>
    </FolioFrame>
  )
}
