import { createRef } from 'react'
import { Table } from '@kolkrabbi/kol-component'
import DocLayout from '../lib/DocLayout.jsx'
import DocHeader, { DocSection } from '../lib/DocHeader.jsx'
import { LiveValue, LiveClassValue, LiveNodeValue, LiveNodeFace } from '../lib/resolve-css-var.jsx'
import { TYPOGRAPHY_SECTIONS } from '../data/typography.js'

/**
 * FoundationsTypography — the KOL typography reference, ported from the brand
 * app's Reference.jsx. Data lives in src/data/typography.js (verbatim mirror
 * of the brand data file); TYPE_COLUMNS + section rendering are ported
 * faithfully. Sizes and families resolve live from the installed theme CSS —
 * no px values are duplicated here, only token paths.
 */

// ─── Ported cell primitives (Reference.jsx) ──────────────────────

const TokenName = ({ children }) => (
  <code className="kol-helper-12 text-emphasis">{children}</code>
)

// ─── Prose specimens ─────────────────────────────────────────────
// One REAL rendered node per prose role, keyed by the row's `class` from
// src/data/typography.js. Element roles render the actual element inside an
// actual .kol-prose container (descendant selectors need the real ancestry);
// the .kol-prose-* section-head classes render standalone — their CSS
// contract forbids nesting them in .kol-prose (the descendant p/h rules
// would override them). The Face/Weight/Size/LH/LS (live) cells read
// getComputedStyle off these very nodes via the shared refs.

const specimen = (render) => {
  const ref = createRef()
  return { ref, render: () => render(ref) }
}

const SPECIMENS = {
  '.kol-prose-display':    specimen((ref) => <h1 ref={ref} className="kol-prose-display">Sample display</h1>),
  '.kol-prose-display-md': specimen((ref) => <h2 ref={ref} className="kol-prose-display-md">Sample display-md</h2>),
  '.kol-prose-title':      specimen((ref) => <h1 ref={ref} className="kol-prose-title">Sample title</h1>),
  '.kol-prose h1':         specimen((ref) => <div className="kol-prose"><h1 ref={ref}>Sample heading-01</h1></div>),
  '.kol-prose h2':         specimen((ref) => <div className="kol-prose"><h2 ref={ref}>Sample heading-02</h2></div>),
  '.kol-prose h3':         specimen((ref) => <div className="kol-prose"><h3 ref={ref}>Sample heading-03</h3></div>),
  '.kol-prose h4':         specimen((ref) => <div className="kol-prose"><h4 ref={ref}>Sample heading-04</h4></div>),
  '.kol-prose h5':         specimen((ref) => <div className="kol-prose"><h5 ref={ref}>Sample heading-05</h5></div>),
  '.kol-prose h6':         specimen((ref) => <div className="kol-prose"><h6 ref={ref}>Sample heading-06</h6></div>),
  '.kol-prose-lede':       specimen((ref) => <p ref={ref} className="kol-prose-lede">Sample lede</p>),
  '.kol-prose-tagline':    specimen((ref) => <p ref={ref} className="kol-prose-tagline">Sample tagline</p>),
  '.kol-prose p':          specimen((ref) => <div className="kol-prose"><p ref={ref}>Sample body copy</p></div>),
  '.kol-prose blockquote p':    specimen((ref) => <div className="kol-prose"><blockquote><p ref={ref}>Sample quote</p></blockquote></div>),
  '.kol-prose blockquote cite': specimen((ref) => <div className="kol-prose"><blockquote><cite ref={ref}>Sample cite</cite></blockquote></div>),
  '.kol-prose-label':      specimen((ref) => <p ref={ref} className="kol-prose-label">Sample label</p>),
  '.kol-prose code':       specimen((ref) => <div className="kol-prose"><p><code ref={ref}>Sample code</code></p></div>),
  '.kol-prose pre':        specimen((ref) => <div className="kol-prose"><pre ref={ref}><code>Sample code block</code></pre></div>),
  '.kol-prose ul li':      specimen((ref) => <div className="kol-prose"><ul><li ref={ref}>Sample list item</li></ul></div>),
}

/** Cell factory — a live computed value off the row's specimen node. */
const liveCell = (prop) => (r) =>
  SPECIMENS[r.class] ? <LiveNodeValue nodeRef={SPECIMENS[r.class].ref} prop={prop} /> : '—'

// ─── Typography column factories ─────────────────────────────────
// Keyed by name. Data file (src/data/typography.js) references these
// via string keys on each table's `columns` field. JSX render funcs can't live
// in pure data files; this is the bridge.

const TYPE_COLUMNS = {
  family: [
    { accessor: 'token', header: 'Token', render: (r) => <TokenName>{r.token}</TokenName> },
    { accessor: 'role',  header: 'Role' },
    { accessor: 'cut',   header: 'Cut (live)', render: (r) => <span><LiveValue token={r.token} /></span> },
  ],
  sans: [
    { accessor: 'cls',    header: 'Class',  render: (r) => <TokenName>{r.cls}</TokenName> },
    { accessor: 'sample', header: 'Sample',
      render: (r) => <span className={r.cls.replace(/^\./, '')}>Sample {r.cls.split('-').slice(-2).join('-')}</span> },
    { accessor: 'size',   header: 'Size',   render: (r) => r.tokenName ? <LiveValue token={r.tokenName} /> : '—' },
    { accessor: 'family', header: 'Family' },
    { accessor: 'weight', header: 'Weight (live)', render: (r) => <LiveClassValue cls={r.cls} prop="font-weight" /> },
  ],
  prose: [
    { accessor: 'role',   header: 'Role' },
    { accessor: 'class',  header: 'Class',  render: (r) => <TokenName>{r.class}</TokenName> },
    { accessor: 'sample', header: 'Sample', render: (r) => SPECIMENS[r.class]?.render() ?? '—' },
    { accessor: 'face',   header: 'Face (live)',
      render: (r) => SPECIMENS[r.class] ? <LiveNodeFace nodeRef={SPECIMENS[r.class].ref} /> : '—' },
    { accessor: 'family', header: 'Family (spec)' },
    { accessor: 'weight', header: 'Weight (live / spec)',
      render: (r) => SPECIMENS[r.class]
        ? <span><LiveNodeValue nodeRef={SPECIMENS[r.class].ref} prop="font-weight" /> / {r.weight}</span>
        : String(r.weight) },
    { accessor: 'size', header: 'Size (live)', render: liveCell('font-size') },
    { accessor: 'lh',   header: 'LH (live)',   render: liveCell('line-height') },
    { accessor: 'ls',   header: 'LS (live)',   render: liveCell('letter-spacing') },
  ],
  mono: [
    { accessor: 'cls',    header: 'Class',  render: (r) => <TokenName>{r.cls}</TokenName> },
    { accessor: 'sample', header: 'Sample',
      render: (r) => <span className={r.cls.replace(/^\./, '')}>{r.cls.replace(/^\./, '')}</span> },
    { accessor: 'size',   header: 'Size (live)',   render: (r) => <LiveClassValue cls={r.cls} prop="font-size" /> },
    { accessor: 'weight', header: 'Weight (live)', render: (r) => <LiveClassValue cls={r.cls} prop="font-weight" /> },
    { accessor: 'lh',     header: 'LH (live)',     render: (r) => <LiveClassValue cls={r.cls} prop="line-height" /> },
    { accessor: 'ls',     header: 'LS (live)',     render: (r) => <LiveClassValue cls={r.cls} prop="letter-spacing" /> },
  ],
  descriptors: [
    { accessor: 'name',   header: 'Name',   render: (r) => <TokenName>.text-{r.name}</TokenName> },
    { accessor: 'pct',    header: '%',      render: (r) => `${r.pct}%` },
    { accessor: 'sample', header: 'Sample',
      render: (r) => <span className={`text-${r.name} font-mono`}>The quick brown fox</span> },
    { accessor: 'token',  header: 'Token',  render: (r) => <TokenName>{r.token}</TokenName> },
    { accessor: 'role',   header: 'Use' },
  ],
  cuts: [
    { accessor: 'family',  header: 'Family',  render: (r) => <TokenName>{r.family}</TokenName> },
    { accessor: 'weights', header: 'Weights' },
    { accessor: 'use',     header: 'Use' },
  ],
}

// ─── Section renderer ────────────────────────────────────────────
// Ported from Reference.jsx's SystemSection; PageSection (brand chapter
// chrome) becomes DocSection (the docs-shell section contract). DocSection's
// column gap replaces the brand mt-8 spacing.

function SystemSection({ section, columnsDict }) {
  return (
    <DocSection id={section.id} title={section.title} lede={section.intro}>
      {section.reasoning && (
        <div className="kol-prose max-w-[65ch]">
          <p className="text-meta">{section.reasoning}</p>
        </div>
      )}
      {section.tables.map((t, i) => (
        <Table
          key={`${section.id}-${i}`}
          caption={t.caption}
          columns={typeof t.columns === 'string' ? columnsDict[t.columns] : t.columns}
          rows={t.rows}
          variant="simple"
        />
      ))}
    </DocSection>
  )
}

// ─── Page ────────────────────────────────────────────────────────

const TOC = TYPOGRAPHY_SECTIONS.map((s) => ({ id: s.id, label: s.title }))

export default function FoundationsTypography() {
  return (
    <DocLayout wide toc={TOC}>
      <DocHeader
        eyebrow="KOL · Foundations"
        title="Typography"
        lede="Three sans cuts and one mono: family tokens, sans atomic classes, the .kol-prose container, the two mono scales, the reading-hierarchy descriptors, and every cut loaded. Sizes and families resolve live from the theme CSS — no px values are duplicated here, only token paths."
      />

      {/* Typography — data-driven from src/data/typography.js. Each
       * section carries its own label, intro, reasoning prose, and tables
       * (with a string `columns` key that resolves to TYPE_COLUMNS above). */}
      {TYPOGRAPHY_SECTIONS.map((section) => (
        <SystemSection key={section.id} section={section} columnsDict={TYPE_COLUMNS} />
      ))}
    </DocLayout>
  )
}
