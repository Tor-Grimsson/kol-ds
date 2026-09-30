import { ContentCollection } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import PageHero from '@kolkrabbi/kol-framework/src/PageHero.jsx'
import PageSection from '@kolkrabbi/kol-framework/src/PageSection.jsx'
import LogoCard from './LogoCard.jsx'
import Swatch from './Swatch.jsx'
import BrandMark from './BrandMark.jsx'
import { brandSections, scrollToAnchor } from './brandBook.js'
import { typeSections } from './typeSpecimen.js'

/* taxonomy-ok: organism — the brand book's identity page: PageHero + PageSection chapters over LogoCard, Swatch and the type specimens */

/**
 * BrandBook — the BRAND page of the brand tool: the identity, one scrolling page of chapters
 * (About · Tone · Look · Logo · Lockups · Color · Typography) under a hero and a chapter index.
 *
 * kol-olina's apps/brand `pages/brand/*`, carried class-for-class; what was that client's copy now
 * comes from the manifest (`brand.book`, `brand.ramps`, `brand.type`, `brand.logos`). Sections with
 * nothing to show for the manifest are left out — see `brandSections`.
 *
 * @param {Object}   brand     a brand manifest (`@kolkrabbi/kol-brand-template` schema)
 * @param {Function} Logo      optional mark component, `<Logo variant="wordmark" />`
 * @param {Object}   logoSources  `{ [logoId]: rawSvg }` — drawn when no `Logo` is given
 */
export default function BrandBook({ brand, Logo, logoSources }) {
  const sections = brandSections(brand, 'brand')
  const mark = (id, props) => <BrandMark id={id} Logo={Logo} sources={logoSources} {...props} />
  const index = sections.filter((s) => s.nav)

  return (
    <>
      {sections.map((s) => {
        switch (s.key) {
          case 'hero': return <PageHero key={s.key} id={s.id} label={s.label} title={s.title} lede={s.lede} />
          case 'overview': return (
            <PageSection key={s.key} id={s.id} label={s.label} title={s.title} body={s.lede}>
              <SectionIndex sections={index} />
            </PageSection>
          )
          case 'logo': return (
            <PageSection key={s.key} id={s.id} label={s.label} title={s.title} body={s.lede}>
              <Prose blocks={s.blocks} />
              <div className="kol-grid mt-12">
                {s.marks.map((id) => <LogoCard key={id} logo={mark(id)} frame={false} />)}
              </div>
              <Prose blocks={s.after} />
            </PageSection>
          )
          case 'lockups': return (
            <PageSection key={s.key} id={s.id} label={s.label} title={s.title} body={s.lede}>
              <Prose blocks={s.blocks} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                {s.marks.map((id) => (
                  <LogoCard
                    key={id}
                    logo={mark(id)}
                    caption={brand?.logos?.find((l) => l.id === id)?.name ?? id}
                    className="[&_figcaption]:uppercase"
                  />
                ))}
              </div>
              <Prose blocks={s.after} />
            </PageSection>
          )
          case 'color': return <ColorSection key={s.key} s={s} ramps={brand?.ramps ?? []} />
          case 'typography': return <TypographySection key={s.key} s={s} brand={brand} />
          default: return (
            <PageSection key={s.key} id={s.id} label={s.label} title={s.title} body={s.lede}>
              <Prose blocks={s.blocks} />
              <Prose blocks={s.after} />
            </PageSection>
          )
        }
      })}
    </>
  )
}

/** Book copy → `.kol-prose`: a string is a paragraph, `{ h }` a sub-heading, `{ lead, text }` a
 *  paragraph opening on a bold lead. `head` renders inside the same block, after the copy. */
export function Prose({ blocks, head, className = 'mt-12' }) {
  if (!blocks?.length && !head) return null
  return (
    <div className={`kol-prose ${className}`}>
      {(blocks ?? []).map((b, i) => {
        if (typeof b === 'string') return <p key={i}>{b}</p>
        if (b.h) return <h3 key={i}>{b.h}</h3>
        return <p key={i}><strong>{b.lead}</strong> {b.text}</p>
      })}
      {head}
    </div>
  )
}

/** The page's chapters as cards — olina's CategoryIndex, read from the sections instead of a nav
 *  tree. The links are the sections' anchors; the click scrolls instead of setting the hash. */
export function SectionIndex({ sections }) {
  if (!sections.length) return null
  return (
    <ul className="mt-12 grid gap-2 grid-cols-1 md:grid-cols-2 max-w-panel">
      {sections.map((s) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            onClick={scrollToAnchor}
            className="kol-card kol-card-interactive flex items-center justify-between gap-4 px-4 py-3 no-underline group"
          >
            <span className="kol-mono-14 text-emphasis">{s.nav}</span>
            <Icon name="arrow-right" size={16} className="text-oq-48 group-hover:text-emphasis transition-colors" />
          </a>
        </li>
      ))}
    </ul>
  )
}

/* Color — the copy, then one swatch row per ramp under its label and note. The first ramp's
 * heading sits in the copy's own prose block (olina's Concept + Greyscale were one block); each
 * further ramp opens its own, as kol-website's hue ramps did. */
function ColorSection({ s, ramps }) {
  const heading = (r) => <><h3>{r.label}</h3>{r.note && <p>{r.note}</p>}</>
  const swatches = (r) => (
    <ContentCollection cols={{ sm: 2, md: 5 }} gap={16} className="mt-8">
      {(r.stops ?? []).map((st) => (
        <Swatch key={st.stop} hex={st.value} name={`${r.id}-${st.stop}`} anchor={st.stop === r.anchor} />
      ))}
    </ContentCollection>
  )
  return (
    <PageSection id={s.id} label={s.label} title={s.title} body={s.lede}>
      {ramps.map((r, i) => (
        <div key={r.id ?? i}>
          {i === 0
            ? <Prose blocks={s.blocks} head={heading(r)} />
            : <div className="kol-prose mt-12">{heading(r)}</div>}
          {swatches(r)}
        </div>
      ))}
      {!ramps.length && <Prose blocks={s.blocks} />}
      <Prose blocks={s.after} />
    </PageSection>
  )
}

function TypographySection({ s, brand }) {
  return (
    <PageSection id={s.id} label={s.label} title={s.title} body={s.lede}>
      <Prose blocks={s.blocks} />
      {/* Sans italic at display size — real italic cuts, fired by plain font-style: italic. */}
      <div className="mt-12 flex flex-col gap-2 py-3 border-b border-fg-08">
        <span className="kol-helper-12 text-meta uppercase tracking-wider">
          .kol-prose-display-md · sans narrow · roman + italic
        </span>
        <p className="kol-prose-display-md m-0">
          The quick <span className="italic">brown</span> fox jumps over the lazy dog
        </p>
      </div>

      {typeSections(brand).map((section) => (
        <div key={section.id} className="mt-12">
          <div className="kol-prose max-w-measure">
            <h3>{section.title}</h3>
            <p>{section.intro}</p>
            {section.reasoning && (
              <p className="text-meta italic">{section.reasoning}</p>
            )}
          </div>
          <div className="mt-8 flex flex-col gap-6">
            {section.rows.map((row, i) => (
              <TypeShowcase key={`${section.id}-${i}`} sectionId={section.id} row={row} />
            ))}
          </div>
        </div>
      ))}
      <Prose blocks={s.after} />
    </PageSection>
  )
}

/* One specimen row, adapted to its section (olina's brand-bits `TypeShowcase`, verbatim). */
function TypeShowcase({ sectionId, row }) {
  if (sectionId === 'sans-families') {
    return (
      <div className="flex flex-col gap-2 py-3 border-b border-fg-08">
        <span className="kol-helper-12 text-meta uppercase tracking-wider">{row.token}</span>
        <span className="text-emphasis" style={{ fontFamily: `var(${row.token})`, fontSize: 28 }}>
          {row.cut}
        </span>
        <span className="kol-helper-10 text-subtle">{row.role}</span>
      </div>
    )
  }

  if (sectionId === 'sans-atomic') {
    const cls = row.cls.replace(/^\./, '')
    return (
      <div className="flex flex-col gap-2 py-3 border-b border-fg-08">
        <span className="kol-helper-12 text-meta uppercase tracking-wider">
          {row.cls} · {row.family} · {row.weight}
        </span>
        <div className={cls}>The quick brown fox jumps over the lazy dog</div>
      </div>
    )
  }

  if (sectionId === 'prose') {
    const tag = (row.class.match(/h[1-6]|p|code|pre/) || [])[0]
    const word = row.role
    let sample
    if (tag === 'h1') sample = <h1>{word}</h1>
    else if (tag === 'h2') sample = <h2>{word}</h2>
    else if (tag === 'h3') sample = <h3>{word}</h3>
    else if (tag === 'h4') sample = <h4>{word}</h4>
    else if (tag === 'h5') sample = <h5>{word}</h5>
    else if (tag === 'h6') sample = <h6>{word}</h6>
    else if (tag === 'code') sample = <p>Inline <code>code</code> in body copy.</p>
    else if (tag === 'pre') sample = <pre>{`code block\nlines preserved`}</pre>
    else sample = <span className={row.class.replace(/^\./, '').replace(/^kol-prose /, '')}>{word}</span>
    return (
      <div className="flex flex-col gap-2 py-3 border-b border-fg-08">
        <span className="kol-helper-12 text-meta uppercase tracking-wider">
          {row.class} · {row.family} · {row.weight}
        </span>
        <div className="kol-prose">{sample}</div>
      </div>
    )
  }

  if (sectionId === 'mono') {
    const cls = row.cls.replace(/^\./, '')
    return (
      <div className="flex flex-col gap-2 py-3 border-b border-fg-08">
        <span className="kol-helper-10 text-meta uppercase tracking-wider">
          {row.cls} · weight {row.weight} · LH {typeof row.lh === 'number' ? `${row.lh}px` : row.lh} · LS {row.ls}
        </span>
        <span className={cls}>The quick brown fox jumps over the lazy dog</span>
      </div>
    )
  }

  if (sectionId === 'opacity' && row.name && row.pct !== undefined) {
    return (
      <div className="flex flex-col gap-2 py-3 border-b border-fg-08">
        <span className="kol-helper-12 text-meta uppercase tracking-wider">
          .text-{row.name} · {row.pct}% · {row.role}
        </span>
        <span className={`text-${row.name}`} style={{ fontSize: 18 }}>
          The quick brown fox jumps over the lazy dog
        </span>
      </div>
    )
  }

  return null
}
