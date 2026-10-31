import { useState } from 'react'
import { Button, DocsToc, Pill as KolPill, TabsRow } from '@kolkrabbi/kol-component'
import { typeLab } from './typeLab.js'
import { useLayoutType } from './layoutScope.jsx'

/* taxonomy-ok: organism — a type exploration: one of four boards (scale · styles · article · sheet) over a TypeLab value */

/**
 * LayoutType — a type exploration, drawn from a TypeLab value: the scale (every role on its styleholder, with the rail),
 * the styles (the rich-text board), an article, and the specimen sheet. kol-atlas's identity lab (apps/lab t1-type.jsx,
 * 2026-10-29), carried class for class (LayoutGroup, 2026-10-31): its `--lab-*` vars are the props, its own copy and the
 * Lab bar are left out. The board copy is the Figma references', verbatim. The role classes (`.t-<role>`) are written by
 * `typeLabCss` and scoped to this layout.
 *
 * @param {string} view     `scale` (default) · `styles` · `article` · `sheet` · `faces`
 * @param {Object} type     a TypeLab value (`DEFAULT_TYPE_LAB` shape: base, ratio, leading, roles)
 * @param {Object} faces    `{ display, heading, text, mono }`, each `{ family, label }` — the faces the roles are set in
 * @param {string} accent   the link underline and the sheet's eyebrow (default the KOL accent)
 * @param {string[]} images photos for the styles figure, the article's callout and its figure, in that order; an empty slot is a plain plate
 * @param {Object} sheet    the sheet's copy: `{ eyebrow, word, faces: [{ face, name?, body: [string] }], weights: [[name, weight]] }`
 * @param {Array}  faceOptions `faces` view: the faces to switch between, `[{ id, label, family, href? }]` — `href` a stylesheet
 *                         that loads the face (default: Inter · Geist · IBM Plex Sans · Public Sans · Noto Sans · Montserrat, Google Fonts)
 *
 * `view="faces"` (2026-10-31, the user's go): "UI font options — one type scale, six faces" (the canvas
 * claude.ai/artifact/HQ8k3AtTt8QgP7sYvYbLXs, Main board, carried class for class; its inks are KOL's) — ONE sheet with a face
 * switch, never a copy per face: Display D1–D3 and Heading H1–H6 at 800, then Subheading, Text, Utility and Label. The same
 * scale is the Figma library's `ui/D1…H6` styles and its `ui-font` collection (page 13-ui-font).
 */
export default function LayoutType({ view = 'scale', type, faces = {}, accent = 'var(--kol-accent-primary)', images = [], sheet, faceOptions = UI_FACES, className = '' }) {
  const t = useLayoutType({ type, faces })
  const lab = typeLab(type)
  const View = VIEWS[view] ?? VIEWS.scale
  return (
    <div className={`${t.className} ${className}`.trim()} style={{ '--kol-layout-accent': accent }}>
      {t.style}
      <View lab={lab} faces={faces} accent={accent} images={images} sheet={sheet} faceOptions={faceOptions} />
    </div>
  )
}

/* A frame as on the canvas: 1200 wide, light paper, padding 96/64. `article`: the reading frame of the Article reference
 * (Figma 3.2 Brand – Section – Type 724:62332), 960 wide with the content at 800 */
const Board = ({ article, className = 'px-16 py-24', children }) => (
  <div data-theme="light" className={`mx-auto flex w-full flex-col bg-[var(--kol-surface-primary)] ${article ? 'max-w-[960px] px-20 py-24' : `max-w-[1200px] ${className}`}`}>{children}</div>
)

/* a box inside the paper: a dark plane (KOL's dark surface) or KOL's 4% fill (--kol-fg-04, the opacity ladder) */
const Plane = ({ dark, as: Tag = 'div', className = '', children }) => (
  <Tag data-theme={dark ? 'dark' : undefined} className={`${dark ? 'bg-[var(--kol-surface-primary)]' : 'bg-[var(--kol-fg-04)]'} ${className}`}>{children}</Tag>
)

/* a photo, cropped to the slot; without one, the slot as a plain plate on KOL's 4% fill */
const Photo = ({ src, ratio = '800 / 440' }) => (src
  ? <img src={src} alt="" className="block w-full object-cover" style={{ aspectRatio: ratio }} />
  : <div className="block w-full bg-[var(--kol-fg-04)]" style={{ aspectRatio: ratio }} />)

/* running text: bold at KOL's strong level (what KOL gives <strong>), italic in the face's own italic */
const RUN = '[&_b]:font-bold [&_b]:text-[var(--kol-layout-ink-strong)] [&_i]:italic'

/* the role's name: KOL's static label chip (JetBrains mono), not one of the type roles */
const Pill = ({ children }) => <KolPill className="self-start">{children}</KolPill>

/* ── scale: the Styles – Type board (Figma 2.1 Brand – Styles – Type 3:11394), section for section ──
 * Headings and Paragraph: a styleholder per role (its pill, the specimen at 800 less the reference's right inset, a 368
 * companion). Then the paragraph sizes, inline bold / italic / link and the utilities (block quote, lists), each with
 * its spec line under it. The reference's copy is kept; its specs are read off the TypeLab value. */

const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id orci in velit cursus consequat. Donec elementum euismod maximus. Nulla purus mi, tempus et dui vitae, auctor tincidunt dolor.'
const LOREM_UT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sollicitudin, diam ut efficitur pharetra, mauris augue sodales sapien, in tempus lectus lorem quis est.'
const QUIVER = 'A quivering Texas zombie fought republic linked jewelry. The five boxing wizards jump quickly.'
const WIZARDS = 'The five boxing wizards jump quickly'
const DYN = 'Dynamically maintain high standards in solutions without prospective potentialities. Enthusiastically repurpose extensive processes rather than vertical partnerships.'
const DISPLAY = [
  ['display-1', 'Jump really high'],
  ['display-2', 'Zelda might fix the job growth plans very quickly'],
]
const HEADINGS = [
  ['h1', 'Zelda might fix the job growth plans very quickly on Monday.'],
  ['h2', QUIVER], ['h3', QUIVER], ['h4', QUIVER],
  ['h5', WIZARDS], ['h6', WIZARDS], ['eyebrow', WIZARDS], ['label', WIZARDS],
]
const TEXTS = [['quote', DYN], ['lead', DYN], ['body', LOREM], ['small', LOREM], ['caption', LOREM], ['data', LOREM]]
const LIST = ['Lorem ipsum dolor sit amet consectetur.', 'Ut sollicitudin, diam ut efficitur pharetra, mauris augue sodales.', 'Sapien in tempus lectus lorem quis est.']

/* a styleholder: 24 over, 56 under; the pill, then the specimen and its companion 32 apart */
function Styleholder({ k, text, large }) {
  return (
    <div id={`scale-${k}`} className="flex w-[800px] max-w-full scroll-mt-16 flex-col items-start gap-6 pt-6 pb-14">
      <Pill>t-{k}</Pill>
      <div className="flex w-full flex-col gap-8">
        {large ? (
          <>
            <p className={`t-${k} pr-[140px]`}>{text}</p>
            <p className="t-small max-w-[368px]">{LOREM}</p>
          </>
        ) : <p className={`t-${k} max-w-[368px]`}>{text}</p>}
      </div>
    </div>
  )
}

/* a section's label: the name, 16 above its hairline; `narrow` is the reference's 560 (the later sections) */
const SectionLabel = ({ narrow, children }) => (
  <div className={`flex w-full flex-col gap-4 ${narrow ? 'max-w-[560px]' : ''}`}>
    <p className="font-[family-name:var(--kol-font-family-sans)] text-[24px] font-semibold leading-[32px] text-[var(--kol-fg-emphasis)]">{children}</p>
    <div className="h-px w-full bg-[var(--kol-fg-subtle)]" />
  </div>
)

/* an item with its spec line: 12 under the item, the line's own hairline 4 under its text */
const Specced = ({ id, label, children }) => (
  <div id={id} className="flex w-[800px] max-w-full scroll-mt-16 flex-col gap-3">
    {children}
    <div className="flex flex-col gap-1">
      <p className="kol-mono-12 uppercase text-[var(--kol-fg-meta)]">{label}</p>
      <div className="h-px w-full bg-[var(--kol-fg-subtle)]" />
    </div>
  </div>
)

/* KOL's TOC rail (DocsToc rail, as brand-hub runs it): a section per stop, its styles as the ticks under it. The rail's
 * names are its own; the section labels on the board stay the reference's */
const SIZES = [['small', 'Paragraph small'], ['body', 'Paragraph normal'], ['lead', 'Paragraph Large']]
const INLINE = [['scale-bold', 'Bold'], ['scale-italic', 'Italic'], ['scale-link', 'Link']]
const UTILITY = [['scale-blockquote', 'Block quote'], ['scale-bullets', 'Bullet list'], ['scale-numbered', 'Numbered list']]
const roleKids = (list) => list.map(([k]) => ({ id: `scale-${k}`, label: `t-${k}` }))
const SCALE_TOC = [
  { id: 'scale-display', label: 'Display', children: roleKids(DISPLAY) },
  { id: 'scale-headings', label: 'Headings', children: roleKids(HEADINGS) },
  { id: 'scale-paragraph', label: 'Paragraph', children: roleKids(TEXTS) },
  { id: 'scale-sizes', label: 'Sizes', children: SIZES.map(([k, name]) => ({ id: `scale-size-${k}`, label: name })) },
  { id: 'scale-inline', label: 'Inline', children: INLINE.map(([id, label]) => ({ id, label })) },
  { id: 'scale-utility', label: 'Utility', children: UTILITY.map(([id, label]) => ({ id, label })) },
]

function TypeScale({ lab }) {
  const role = (id) => lab.roles.find((r) => r.id === id)
  const spec = (id) => `${role(id).size}/${role(id).lh}`
  return (
    <>
    {/* outside the light paper: the rail is pinned to the page edge, so it takes the page's theme. Child ticks 16 apart (KOL draws them at 3), so the rail runs the page's height */}
    <DocsToc toc={SCALE_TOC} variant="rail" className="[&_.kol-toc-child]:h-4" />
    <Board className="p-16">
      <div className="flex flex-col gap-32 [&>[id]]:scroll-mt-16">
        <div id="scale-display" className="flex flex-col gap-24">
          <SectionLabel>Display</SectionLabel>
          <div className="flex flex-col">{DISPLAY.map(([k, text]) => <Styleholder key={k} k={k} text={text} large />)}</div>
        </div>

        <div id="scale-headings" className="flex flex-col gap-24">
          <SectionLabel>Headings</SectionLabel>
          <div className="flex flex-col">{HEADINGS.map(([k, text]) => <Styleholder key={k} k={k} text={text} large />)}</div>
        </div>

        <div id="scale-paragraph" className="flex flex-col gap-24">
          <SectionLabel>Paragraph</SectionLabel>
          <div className="flex flex-col">{TEXTS.map(([k, text]) => <Styleholder key={k} k={k} text={text} large={text === DYN} />)}</div>
        </div>

        <div id="scale-sizes" className="flex flex-col gap-24">
          <SectionLabel narrow>Paragraph</SectionLabel>
          <div className="flex flex-col gap-16">
            {SIZES.map(([k, name]) => (
              <Specced key={k} id={`scale-size-${k}`} label={`${name}  ${spec(k)}`}><p className={`t-${k}`}>{LOREM_UT}</p></Specced>
            ))}
          </div>
        </div>

        <div id="scale-inline" className="flex flex-col gap-24">
          <SectionLabel narrow>Paragraph</SectionLabel>
          <div className={`flex flex-col gap-16 ${RUN}`}>
            <Specced id="scale-bold" label={`Bold text - ${role('body').size}px / 700`}><p className="t-body">This is <b>bold text</b></p></Specced>
            <Specced id="scale-italic" label={`Italic text - ${role('body').size}px`}><p className="t-body">This is <i>italic text</i></p></Specced>
            <Specced id="scale-link" label={`Text link - ${role('body').size}px`}><p className="t-body">This is a <Link>hyperlink</Link></p></Specced>
          </div>
        </div>

        <div id="scale-utility" className="flex flex-col gap-24">
          <SectionLabel narrow>Utility</SectionLabel>
          <div className="flex flex-col gap-16">
            <Specced id="scale-blockquote" label="block quote"><BlockQuote>{LOREM_UT}</BlockQuote></Specced>
            <Specced id="scale-bullets" label="Bullet list"><ul className="t-body m-0 flex list-disc flex-col gap-1 px-6 [&_li]:ms-6">{LIST.map((x) => <li key={x}>{x}</li>)}</ul></Specced>
            <Specced id="scale-numbered" label="numbered list"><ol className="t-body m-0 flex list-decimal flex-col gap-1 px-6 [&_li]:ms-6">{LIST.map((x) => <li key={x}>{x}</li>)}</ol></Specced>
          </div>
        </div>
      </div>
    </Board>
    </>
  )
}

/* the reference's block quote: KOL's 4% fill, a 2px bar in a 4px rail, 64 in */
const BlockQuote = ({ children }) => (
  <blockquote className="m-0 flex w-full bg-[var(--kol-fg-04)]">
    <span className="relative w-1 shrink-0"><span className="absolute inset-y-0 right-0 w-0.5 bg-[var(--kol-layout-ink-emphasis)]" /></span>
    <p className="t-quote flex-1 p-16">{children}</p>
  </blockquote>
)

/* a link: emphasis ink, the accent underline */
const Link = ({ children }) => <a href="#" onClick={(e) => e.preventDefault()} className="text-[var(--kol-layout-ink-emphasis)] underline decoration-[var(--kol-layout-accent)] decoration-[1.5px] underline-offset-4">{children}</a>

/* ── styles: the Rich text board ───────────────────────────────── */

const RICH_A = 'A rich text element can be used with static or dynamic content. For static content, just drop it into any page and begin editing. For dynamic content, add a rich text field to any collection and then connect a rich text element to that field in the settings panel.'
const RICH_B = 'Voila!l For static content, just drop it into any page and begin editing. For dynamic content, add a rich text field to any collection and then connect a rich text element to that field in the settings panel.'
const RICH_LIST = [
  'A rich text element can be used with static or dynamic content.',
  'For static content, just drop it into any page and begin editing.',
  'For dynamic content, add a rich text field to any collection',
]

function TypeStyles({ images }) {
  return (
    <Board article>
      <div className="flex flex-col gap-4">
        {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((k, i) => (
          <div key={k} className="flex flex-col gap-4">
            <p className={`t-${k} ${i ? 'pt-4' : ''}`}>Heading {i + 1}</p>
            <p className="t-body">{RICH_A}</p>
            <p className="t-body">{RICH_B}</p>
          </div>
        ))}
        <blockquote className="my-6 flex flex-col gap-2 border-l-2 border-[var(--kol-fg-emphasis)] pl-10">
          <p className="t-quote italic">Recently, a team of security researchers announced their finding of a fifteen year old bug in Python’s tar file extraction functionality.</p>
          <p className="t-quote italic">The vulnerability was first disclosed in 2007 and tracked as CVE-2007-4559.</p>
        </blockquote>
        <p className="t-body">{RICH_A}</p>
        <p className="t-body">{RICH_B}</p>
        <figure className="m-0 flex flex-col gap-2 py-4">
          <Photo src={images[0]} />
          <figcaption className="t-caption text-center">This is a image caption</figcaption>
        </figure>
        <p className="t-h5">Heading 5</p>
        <ul className="t-body list-disc pl-16">{RICH_LIST.map((s) => <li key={s} className="mb-1">{s}</li>)}</ul>
        <p className="t-body">{RICH_B}</p>
        <ol className="t-body list-decimal pl-16">{RICH_LIST.map((s) => <li key={s} className="mb-1">{s}</li>)}</ol>
      </div>
    </Board>
  )
}

/* ── article: the Article board ─ */

const ABSURD = 'A man wants to earn money in order to be happy, and his whole effort and the best of a life are devoted to the earning of that money. Happiness is forgotten; the means are taken for the end.'
const CAMUS = '“A man wants to earn money in order to be happy, and his whole effort and the best of a life are devoted to the earning of that money. Happiness is forgotten; the means are taken for the end.”'
const VULN = 'This vulnerability could impact thousands of software projects yet many people are unfamiliar with the situation or how to handle it. That’s why, here at Secure Code Warrior, we’re giving you the opportunity to simulate exploiting this vulnerability yourself to see the  impact first-hand and get some hands-on experience in the mechanics of this persistent bug, so you can better protect your application!'
const SKETCH = 'I can sketch one by one all the aspects it is able to assume, all those likewise that have been attributed to it, this upbringing, this origin, this ardor or these silences, this nobility or this vileness. But aspects cannot be added up.'
const HEART = 'This very heart which is mine will forever remain indefinable to me. Between the certainty I have of my existence and the content I try to give to that assurance the gap will never be filled.'
const FUTURE = 'We live on the future: “tomorrow,” “later on,” “when you have made your way,” “you will understand when you are old enough.” Such irrelevancies are wonderful, for, after all, it’s a matter of dying. Yet a day comes when a man notices or says that he is thirty.'
const CODE = `function lorem(ipsum, dolor = 1) {
  const sit = ipsum == null ? 0 : ipsum.sit;
  dolor = sit - amet(dolor);
  return sit ? consectetur(ipsum, 0, dolor < 0 ? 0 : dolor) : [];
}`

const Callout = ({ dark, src }) => (
  <Plane dark={dark} className="grid grid-cols-[minmax(0,1fr)_320px] items-center gap-6 rounded-lg p-6">
    <div className="flex flex-col gap-4">
      <p className="t-small">{VULN}</p>
      <Button tone="inverted" radius="full" className="self-start">Try the Simulated Mission Now</Button>
    </div>
    <Photo src={src} ratio="4 / 3" />
  </Plane>
)

const Quote = ({ dark }) => (
  <Plane dark={dark} as="blockquote" className="m-0 flex flex-col gap-3 rounded-lg p-6">
    <p className="t-quote">{CAMUS}</p>
    <p className="t-quote">— Albert Camus, CEO, Sysiphus corp.</p>
  </Plane>
)

function TypeArticle({ images }) {
  return (
    <Board article>
      <article className={`flex flex-col gap-6 ${RUN}`}>
        <p className="t-eyebrow">2020-11-11, Liberace glorious</p>
        <Plane className="flex flex-col gap-2 rounded-lg p-6">
          <p className="t-label">tl;dr</p>
          <p className="t-small">Recently, a team of security researchers announced their finding of a fifteen year old bug in Python’s tar file extraction functionality. The vulnerability was first disclosed in 2007 and tracked as CVE-2007-4559. A note was added to the official Python documentation, but the bug itself was left unpatched.</p>
        </Plane>
        <div className="flex flex-col gap-2 pt-4">
          <h1 className="t-h2">Wonderful irrelevancies</h1>
          <p className="t-lead">The absurd is a lucid reason noting its limits</p>
        </div>
        <p className="t-body">Thus he asserts his youth. But simultaneously he situates himself in relation to time. He takes his place in it. He admits that he stands at a certain point on a curve that he acknowledges having to travel to its end. He belongs to time, and <b>by the horror that seizes him</b>, he recognizes his worst enemy.</p>
        <p className="t-body">{SKETCH} {HEART}</p>
        <Quote dark />
        <p className="t-h6">Happiness is forgotten; the means are taken for the end.</p>
        <Callout src={images[1]} />
        <p className="t-body">Likewise and during every day of an unillustrious life, time carries us. But a moment always comes when we have to carry it. We live on the future: <i>“tomorrow,” “later on,” “when you have made your way,” “you will understand when you are old enough.”</i> Such <b>irrelevancies are wonderful,</b> for, after all, it’s a matter of dying. Yet a day comes when a man notices or says that he is thirty.</p>
        <p className="t-body">Tomorrow, he was longing for tomorrow, whereas everything in him ought to reject it and consequentially <Link>that revolt of the flesh</Link> is the absurd.</p>
        <figure className="m-0 flex flex-col gap-2">
          <Photo src={images[2]} ratio="16 / 10" />
          <figcaption className="t-data border-l-2 border-[var(--kol-fg-emphasis)] pl-2">I know simply that the sky will last longer than I</figcaption>
        </figure>
        <p className="t-body">{FUTURE}</p>
        <h2 className="t-h3 pt-4">The absurd, a lucid reason</h2>
        <p className="t-h5">{ABSURD}</p>
        <p className="t-body">From the moment absurdity is recognized, it becomes a passion, the most harrowing of all. But whether or not one can live with one's passions, whether or not one can accept their law, which is to burn the heart they simultaneously exalt—that is the whole question.</p>
        <p className="t-body">{SKETCH}</p>
        <Quote />
        <p className="t-body"><Link>We live on the future:</Link> “tomorrow,” “later on,” “when you have made your way,” “you will understand when you are old enough.” Such irrelevancies are wonderful, for, after all, it’s a matter of dying. Yet a day comes when a man notices or says that he is thirty.</p>
        <Callout dark src={images[1]} />
        <pre className="t-data overflow-x-auto rounded-lg bg-[var(--kol-fg-04)] p-6">{CODE}</pre>
        <h2 className="t-h3 pt-4">Conclusion</h2>
        <p className="t-body">Of whom and of what can I say: "I know that"! This heart within me I can feel, and I judge that it exists. This world I can touch, and I likewise judge that it exists. There ends all my knowledge, and the rest is construction. For if I try to seize this self of which I feel sure, if I try to define and to summarize it, it is nothing but water slipping through my fingers.</p>
        <p className="t-caption border-t border-[var(--kol-fg-subtle)] pt-4">At Spasten various id, 2020-11-11, Liberace glorious</p>
      </article>
    </Board>
  )
}

/* ── sheet: the reference's type sheet (Figma client--collections-all 1:49213), on the faces handed in ──
 * eyebrow in the accent, the word in the display face at 160, the faces with what they carry, then the display face's
 * weight ladder: name left, the alphabet right. */

const WEIGHTS = [['Black', 900], ['Extra Bold', 800], ['Bold', 700], ['Semi Bold', 600], ['Medium', 500], ['Regular', 400]]
const ALPHABET = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '0123456789!@#$%^&*()[]?+']

function TypeSheet({ faces, accent, sheet = {} }) {
  const ink = 'text-[var(--kol-layout-ink-emphasis)]'
  const display = faces.display?.family
  const sheetFaces = sheet.faces ?? [{ face: 'display' }, { face: 'text' }]
  return (
    <Board>
      <div className="flex flex-col gap-32">
        <div className="flex flex-col gap-8 pt-[100px]">
          <p className="text-[28px] font-medium leading-[1.1] tracking-[-0.02em]" style={{ fontFamily: faces.text?.family, color: accent }}>{sheet.eyebrow ?? 'Display typeface'}</p>
          <p className={`text-[160px] font-bold leading-none tracking-[-0.02em] [text-box:trim-both_cap_alphabetic] ${ink}`} style={{ fontFamily: display }}>{sheet.word ?? 'Typography'}</p>
        </div>
        <div className="flex gap-8">
          {sheetFaces.map((f) => (
            <div key={f.face} className="flex flex-1 flex-col gap-6 pr-6">
              <p className="text-[28px] font-black leading-[30px] text-[var(--kol-layout-ink-emphasis)]" style={{ fontFamily: display }}>{f.name ?? faces[f.face]?.label}</p>
              <div className={`flex flex-col gap-4 text-[20px] leading-[1.1] tracking-[-0.02em] ${ink}`} style={{ fontFamily: faces[f.face]?.family }}>
                {(f.body ?? []).map((x) => <p key={x}>{x}</p>)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-32 flex flex-col gap-8">
        {(sheet.weights ?? WEIGHTS).map(([name, w]) => (
          <div key={w} className={`flex items-start justify-between text-[28.8px] ${ink}`} style={{ fontFamily: display, fontWeight: w }}>
            <p className="w-[194px] leading-none [text-box:trim-both_cap_alphabetic]">{name}</p>
            <p className="text-right leading-[1.3] [text-box:trim-both_cap_alphabetic]">{ALPHABET.map((l) => <span key={l} className="block">{l}</span>)}</p>
          </div>
        ))}
      </div>
    </Board>
  )
}

/* ── faces: one type scale, six faces (the UI font options canvas, Main board) ── */

const gf = (name, w = '400;500;600;700;800') => `https://fonts.googleapis.com/css2?family=${name.replace(/ /g, '+')}:wght@${w}&display=swap`
export const UI_FACES = [
  { id: 'inter', label: 'Inter', family: "'Inter', system-ui, sans-serif", href: gf('Inter') },
  { id: 'geist', label: 'Geist', family: "'Geist', system-ui, sans-serif", href: gf('Geist') },
  { id: 'ibm-plex-sans', label: 'IBM Plex Sans', family: "'IBM Plex Sans', system-ui, sans-serif", href: gf('IBM Plex Sans', '400;500;600;700') },
  { id: 'public-sans', label: 'Public Sans', family: "'Public Sans', system-ui, sans-serif", href: gf('Public Sans') },
  { id: 'noto-sans', label: 'Noto Sans', family: "'Noto Sans', system-ui, sans-serif", href: gf('Noto Sans') },
  { id: 'montserrat', label: 'Montserrat', family: "'Montserrat', system-ui, sans-serif", href: gf('Montserrat') },
]

const st = (size, lh, w, extra = {}) => ({ fontSize: size, lineHeight: `${lh}px`, fontWeight: w, ...extra })
const CAPS = { textTransform: 'uppercase', letterSpacing: '0.5px' }
const two = (wa, wb, ta, tb, size, lh) => [{ t: ta, left: 160, style: st(size, lh, wa) }, { t: tb, left: 480, style: st(size, lh, wb) }]
const four = (size, lh, extra) => [['Regular', 160, 400], ['Medium', 320, 500], ['Semi', 480, 600], ['Bold', 600, 700]].map(([t, left, w]) => ({ t, left, style: st(size, lh, w, extra) }))
const UI_SCALE = [
  { title: 'Display', bold: true, rows: [[1, 80, 88], [2, 72, 80], [3, 64, 72]].map(([n, s, l]) => ({ code: `D${n}`, h: 96, style: st(s, l, 800), words: two(600, 800, 'Semi', 'Bold', s, l), sp: '0', size: s, lh: l })) },
  { title: 'Heading', bold: true, rows: [[1, 56, 64], [2, 48, 56], [3, 44, 52], [4, 40, 48], [5, 36, 44], [6, 32, 40]].map(([n, s, l]) => ({ code: `H${n}`, h: 64, style: st(s, l, 800), words: two(500, 800, 'Medium', 'Extra Bold', s, l), sp: '0', size: s, lh: l })) },
  { title: 'Subheading', rows: [[1, 28, 36], [2, 24, 32], [3, 20, 24], [4, 18, 24], [5, 16, 20], [6, 14, 20]].map(([n, s, l]) => ({ code: `S${n}`, h: 32, style: st(s, l, 600), words: four(28, 36), sp: '0', size: s, lh: l })) },
  { title: 'Text', rows: [[1, 24, 36], [2, 20, 32], [3, 18, 28], [4, 16, 24], [5, 14, 20], [6, 12, 16]].map(([n, s, l]) => ({ code: `T${n}`, h: 32, style: st(s, l, 600), words: four(s, l), sp: '0', size: s, lh: l })) },
  { title: 'Utility', rows: [[1, 24, 26], [2, 20, 24], [3, 18, 24], [4, 16, 20], [5, 14, 18], [6, 12, 16], [7, 10, 12], [8, 8, 12]].map(([n, s, l]) => ({ code: `U${n}`, h: 32, style: st(s, l, 400), words: four(s, l), sp: '0', size: s, lh: l })) },
  { title: 'Label', rows: [[1, 24, 28], [2, 20, 24], [3, 18, 24], [4, 16, 20], [5, 14, 16], [6, 12, 16], [7, 10, 12], [8, 8, 12]].map(([n, s, l]) => ({ code: `L${n}`, h: 32, style: st(s, l, 400, CAPS), words: four(s, l, CAPS), sp: '0.5', size: s, lh: l })) },
]
const CHIPS = [[400, 'Regular'], [500, 'Medium'], [600, 'Semi Bold'], [700, 'Bold']]

function TypeFaces({ faceOptions }) {
  const [id, setId] = useState(faceOptions[0]?.id)
  const face = faceOptions.find((f) => f.id === id) ?? faceOptions[0]
  if (!face) return null
  const specimen = `fonts.google.com/specimen/${face.label.replace(/ /g, '+')}`
  return (
    <div className="flex flex-col gap-6">
      {face.href && <link rel="stylesheet" href={face.href} />}
      <TabsRow variant="text" size={12} tracked tabs={faceOptions.map((f) => ({ value: f.id, label: f.label }))} value={face.id} onChange={setId} ariaLabel="Face" className="gap-6" />
      <div data-theme="light" className="mx-auto box-border flex w-full max-w-[1696px] flex-col gap-32 bg-[var(--kol-surface-primary)] p-24 text-[var(--kol-fg-emphasis)]" style={{ fontFamily: face.family }}>
        <div className="box-border flex h-[608px] items-stretch justify-between overflow-hidden rounded-3xl bg-[var(--kol-fg-04)] p-16">
          <div className="flex flex-col items-start justify-between">
            <div className="flex flex-col gap-3">
              <p className="m-0 text-[64px] leading-[72px] font-extrabold">Styles</p>
              <a href={`https://${specimen}`} target="_blank" rel="noopener" className="text-[16px] leading-5 font-medium text-inherit opacity-60">{specimen}</a>
            </div>
            <div className="grid grid-cols-[repeat(2,minmax(0,192px))] gap-6">
              {CHIPS.map(([w, label]) => (
                <div key={w} className="box-border flex w-48 items-center gap-3 rounded-lg bg-[var(--kol-surface-primary)] p-2 shadow-[0_4px_24px_rgba(12,14,25,0.08)]">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-[var(--kol-fg-08)] text-[24px] leading-8" style={{ fontWeight: w }}>Aa</div>
                  <div className="flex flex-col gap-1 leading-[14px] whitespace-nowrap">
                    <span className="text-[14px]" style={{ fontWeight: w }}>{face.label}</span>
                    <span className="text-[12px] font-normal opacity-60">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex w-[480px] items-end justify-end">
            <span className="text-[380px] leading-[0.78] font-extrabold tracking-[-0.02em] whitespace-nowrap">Aa</span>
          </div>
        </div>

        <div className="flex flex-col gap-[88px]">
          <div className="flex h-6 items-end justify-between text-[20px] leading-6 font-medium">
            <div className="flex gap-16"><span className="w-24 opacity-60">Style</span><span className="opacity-60">Font</span></div>
            <div className="flex">{['Spacing', 'Size', 'Height'].map((h) => <span key={h} className="w-32 text-right opacity-60">{h}</span>)}</div>
          </div>
          <div className="flex flex-col gap-24">
            {UI_SCALE.map((sec) => (
              <div key={sec.title} className="flex flex-col gap-16">
                {sec.bold ? (
                  <div className="flex flex-col gap-4 opacity-40">
                    <div className="h-0 border-t border-current" />
                    <span className="text-[16px] leading-6 font-bold">{sec.title}</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 opacity-60">
                    <span className="text-[16px] leading-5 font-medium uppercase tracking-[0.5px] opacity-60">{sec.title}</span>
                    <div className="h-0 border-t border-current" />
                  </div>
                )}
                <div className="flex flex-col gap-6">
                  {sec.rows.map((r) => (
                    <div key={r.code} className="relative w-full" style={{ height: r.h }}>
                      <span className="absolute bottom-0 left-0 whitespace-nowrap" style={r.style}>{r.code}</span>
                      {r.words.map((w) => <span key={w.t} className="absolute bottom-0 whitespace-nowrap" style={{ left: w.left, ...w.style }}>{w.t}</span>)}
                      <div className="absolute right-0 bottom-0 flex text-[16px] leading-5 font-medium">
                        {[r.sp, r.size, r.lh].map((v, i) => <span key={i} className="w-32 text-right opacity-[0.36]">{v}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const VIEWS = { scale: TypeScale, styles: TypeStyles, article: TypeArticle, sheet: TypeSheet, faces: TypeFaces }
export const LAYOUT_TYPE_VIEWS = Object.keys(VIEWS)
