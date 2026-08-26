/* content-item-live — the unification page 1:1, rendered by the REAL components.
 * Bundle: esbuild content-item-live.entry.jsx --bundle --format=iife
 *         --jsx=automatic --minify   → inline into content-item-live.html */
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import ContentText from '/Users/biskup/dev/projects/kol-ds-ui/packages/component/src/molecules/ContentText.jsx'
import ContentMedia from '/Users/biskup/dev/projects/kol-ds-ui/packages/component/src/molecules/ContentMedia.jsx'
import ContentItem from '/Users/biskup/dev/projects/kol-ds-ui/packages/component/src/molecules/ContentItem.jsx'
import ContentCollection from '/Users/biskup/dev/projects/kol-ds-ui/packages/component/src/organisms/ContentCollection.jsx'
import ContentFilters from '/Users/biskup/dev/projects/kol-ds-ui/packages/component/src/organisms/ContentFilters.jsx'
import ListingCard from '/Users/biskup/dev/projects/kol-ds-ui/packages/content/src/ListingCard.jsx'

/* ═══ shared data — verbatim from content-card-unification.html ═══ */

const RATIO_USE = {
  '1 / 1': 'default — file/asset',
  '16 / 9': 'article',
  '4 / 5': 'export-specs set',
  '3 / 4': 'work',
  '1 / 1.41421': 'A4 — catalog, print',
}
const MEDIA_RATIOS = ['1 / 1', '16 / 9', '4 / 5', '3 / 4', '1 / 1.41421']

const TYPE = {
  'kol-helper-12':       ['12', '1',    '.06em', 'mono 500'],
  'kol-mono-10':         ['10', '14px', '—',     'mono 400'],
  'kol-mono-12':         ['12', '16px', '—',     'mono 400'],
  'kol-mono-14':         ['14', '18px', '—',     'mono 400'],
  'kol-mono-20':         ['20', '26px', '—',     'mono 400'],
  'kol-sans-heading-03': ['32', '120%', '—',     'sans-compact 500'],
  'kol-sans-heading-05': ['20', '125%', '—',     'sans-compact 500'],
  'kol-sans-display-02': ['44', '100%', '—',     'sans-narrow 600'],
  'kol-sans-display-03': ['36', '100%', '—',     'sans-narrow 600'],
}
const INKPC = { 'text-emphasis': '100', 'text-body': '64', 'text-meta': '48' }

const BP_LABEL = { mobile: '< 768', tablet: '768 – 1023', desktop: '1024 +' }
const BP_ORDER = ['mobile', 'tablet', 'desktop']

/* ONE string set — only styling changes between variants */
const C = {
  kicker: 'Field notes',
  title: 'Kolkrabbi Identity',
  body: 'Why two ways to say one thing diverge.',
  meta: '15 Aug 2026 • 4 min',
  date: '15 Aug 2026',
  read: '4 min',
  a: '2026-08-15',
  b: '2.4 MB',
}

/* ruled ramp annotations — [slot, class, ink] per line; 'group'/'between' wrap */
const HI = 'text-emphasis', MID = 'text-body', LO = 'text-meta'
const RAMP = {
  default: {
    card: [['title', 'kol-helper-12', HI], ['group', ['date', 'kol-helper-12', LO], ['size', 'kol-helper-12', MID]]],
    row:  [['line', ['title', 'kol-helper-12', HI], ['date', 'kol-helper-12', LO], ['size', 'kol-helper-12', MID]]],
    note: 'ONE size for everything — title and meta identical; hierarchy is ink only. Row is one table-like line.',
  },
  catalog: {
    card: [['title', 'kol-mono-14', HI], ['detail', 'kol-mono-10', LO]],
    row:  [['between', ['title', 'kol-mono-12', HI], ['detail', 'kol-mono-10', LO]]],
    note: 'title steps by form — card mono-14, row mono-12. Detail mono-10 in both. Row is a between-header.',
  },
  print: {
    card: [['title', 'kol-mono-14', MID], ['detail', 'kol-mono-10', LO]],
    row:  [['between', ['title', 'kol-mono-10', MID], ['detail', 'kol-mono-10', LO]]],
    note: 'derived from catalog — shares the A4 frame and the title+detail pair. Title ink body.',
  },
  article: {
    card: [['kicker', 'kol-helper-12', MID], ['title', 'kol-sans-heading-03', HI], ['body', 'kol-mono-14', MID], ['group', ['date', 'kol-helper-12', LO], ['size', 'kol-helper-12', MID]]],
    row:  [['kicker', 'kol-helper-12', MID], ['title', 'kol-sans-heading-05', HI], ['body', 'kol-mono-14', MID], ['group', ['date', 'kol-helper-12', LO], ['size', 'kol-helper-12', MID]]],
    note: 'line 3 unified — mono-14 · body in both. Title still steps: heading-03 card, heading-05 row.',
  },
  work: {
    card: [['title', 'kol-sans-display-02', HI], ['body', 'kol-mono-14', MID], ['meta', 'kol-mono-12', MID]],
    row:  [['body', 'kol-mono-14', MID], ['title', 'kol-sans-display-03', HI], ['meta', 'kol-mono-12', MID]],
    note: 'ONE title family both forms (display, narrow 600) — display-02 card, display-03 row. Row structure unchanged: line 2 stays the big line and carries the title.',
  },
  typeface: {
    card: [['title', 'kol-mono-20', HI], ['body', 'kol-mono-14', MID], ['date', 'kol-mono-12', MID]],
    row:  [['between', ['title', 'kol-mono-14', HI], ['date', 'kol-mono-12', MID]], ['body', 'kol-mono-14', MID]],
    note: 'unified — ONE family (mono 400). Row keeps the shipped shape: header.between (title left, date right) + body below.',
  },
}

/* text gaps as built (ContentText GAPS) — token · px */
const GAPS = {
  default: { card: 'spacing-3 · 12px', row: 'spacing-3 · 12px' },
  catalog: { card: 'spacing-2 · 8px', row: 'spacing-2 · 8px' },
  print: { card: 'spacing-2 · 8px', row: 'spacing-2 · 8px' },
  article: { card: 'spacing-3 · 12px', row: '10px (shipped literal)' },
  work: { card: 'spacing-2 · 8px', row: 'spacing-3 · 12px' },
  typeface: { card: 'spacing-2 · 8px', row: 'spacing-6 · 24px' },
}

const VARIANTS = ['default', 'catalog', 'print', 'article', 'work', 'typeface']

const FILES = [
  { title: 'Kolkrabbi Identity', date: '2026-08-15', size: '2.4 MB', kind: 'image' },
  { title: 'poster-spread.png', date: '2026-06-19', size: '1.2 MB', kind: 'image' },
  { title: 'reel-cut-04.mp4', date: '2026-06-21', size: '48 MB', kind: 'video' },
  { title: 'wordmark-final.svg', date: '2026-07-02', size: '18 KB', kind: 'vector' },
]

/* props per variant — the one string set mapped to the ruled slots */
const PROPS = {
  default: { title: C.title, date: C.a, size: C.b },
  catalog: { title: C.title, detail: C.body },
  print: { title: C.title, detail: C.body },
  article: { kicker: C.kicker, title: C.title, body: C.body, date: C.date, size: C.read },
  work: { title: C.title, body: C.body, meta: '2026' },
  typeface: { title: C.title, body: C.body, date: '2024' },
}

const SRC = {
  default: 'ContentItem.jsx — variant "default"',
  catalog: 'ContentItem.jsx — variant "catalog"',
  print: 'ContentItem.jsx — variant "print"',
  article: 'ContentItem.jsx — variant "article"',
  work: 'ContentItem.jsx — variant "work"',
  typeface: 'ContentItem.jsx — variant "typeface"',
}

/* ═══ chrome helpers — same shapes as the static page ═══ */

const Table = ({ head, rows }) => (
  <table>
    <tbody>
      <tr>{head.map((h) => <th key={h}>{h}</th>)}</tr>
      {rows.map((r, i) => (
        <tr key={i}>{r.map((c, j) => <td key={j} dangerouslySetInnerHTML={{ __html: c }} />)}</tr>
      ))}
    </tbody>
  </table>
)

const Sect = ({ num, children }) => (
  <div className="sect"><span className="num">{num}</span>{children}</div>
)

const kv = (k, v) => (
  <div key={k}><span style={{ opacity: 0.45 }}>{k}:</span> {v}</div>
)

/* value gutter — one entry per line, groups annotated as "group of N" */
const RATIOS = {
  default: '1 / 1', catalog: '1 / 1.41421', print: '1 / 1.41421',
  article: '16 / 9', work: '3 / 4', typeface: '1 / 1.41421',
}
const slotsOf = (lines) => lines.flatMap((e) =>
  typeof e[1] === 'string' ? [e[0]] : e.slice(1).map((p) => p[0])).join(' · ')

function Classes({ variant, form, bp, item }) {
  const lines = RAMP[variant][form]
  const one = ([slot, cls, ink]) => {
    const t = TYPE[cls] || ['—', '—', '—', '—']
    return (
      <div key={slot}>
        {kv('type', cls.replace('kol-', ''))}{kv('size', t[0] + 'px')}{kv('line', t[1])}
        {kv('track', t[2])}{kv('family', t[3])}{kv('ink', ink.replace('text-', ''))}
        {kv('opacity', (INKPC[ink] || '—') + '%')}
      </div>
    )
  }
  const noStep = (v) => <>{v} <span style={{ opacity: 0.4 }}>(no step)</span></>
  /* the RULED box values, mirrored from ContentCard/ContentRow BOX maps */
  const CARD_BOX = {
    default: 'pad-card-sm (12)', catalog: 'pad-card-sm/md (12 16) · plate surface-primary border-t · card IS the A4 frame', print: 'card IS the A4 frame · image-only — text off by prop · keyline in media',
    article: '0 · media-gap spacing-4 (16) · no frame', work: 'pad-card-md (16) · text in the inverse drawer (media slot)', typeface: 'pad-card-lg (24) · canvas — details plate over the specimen',
  }
  const ROW_BOX = {
    default: 'spacing-2/0 (8 0) · thumb 48 · items-center · border-b', catalog: '8px 12px · no thumb · framed',
    print: '8px 12px · no thumb · framed', article: '0 · thumb 120 @ 16:9 · no frame',
    work: '16px · thumb 64 · framed', typeface: '24px · no thumb · framed',
  }
  const wraps = item
    ? [[ 'wraps', `${form === 'card' ? 'ContentCard' : 'ContentRow'} > ContentMedia @ ${form === 'card' ? RATIOS[variant] : 'thumb'} + ContentText[${slotsOf(lines)}]` ]]
    : []
  const boxVals = form === 'card'
    ? [...wraps, ['direction', 'column'], ['text gap', noStep(GAPS[variant].card)],
       ['box', noStep(CARD_BOX[variant])], ['radius', 'var(--kol-radius-sm)']]
    : [...wraps, ['direction', RAMP[variant].row[0]?.[0] === 'line' || RAMP[variant].row[0]?.[0] === 'between' ? 'row' : 'row → column'],
       ['text gap', noStep(GAPS[variant].row)],
       ['box', noStep(ROW_BOX[variant])], ['radius', 'sm on thumb']]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ lineHeight: 1.5, opacity: 0.8, marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid var(--kol-fg-08)' }}>
        <div style={{ opacity: 0.45 }}>box · {bp} {BP_LABEL[bp]} — flat by ruling</div>
        {boxVals.map(([k, v]) => kv(k, v))}
      </div>
      {lines.map((entry, i) => {
        if (entry[0] === 'group' || entry[0] === 'between' || entry[0] === 'line') {
          const parts = entry.slice(1)
          return (
            <div key={i} style={{ lineHeight: 1.5, opacity: 0.8 }}>
              <div style={{ opacity: 0.45 }}>line {i + 1} · {entry[0]} of {parts.length} — {parts.map((p) => p[0]).join(' + ')}</div>
              {parts.map((p, j) => <div key={j} style={{ marginTop: j ? 8 : 0 }}>{one(p)}</div>)}
            </div>
          )
        }
        return (
          <div key={i} style={{ lineHeight: 1.5, opacity: 0.8 }}>
            <div style={{ opacity: 0.45 }}>line {i + 1} · {entry[0]}</div>
            {one(entry)}
          </div>
        )
      })}
    </div>
  )
}

/* striped payload — same as the static page's PAYLOAD */
const Payload = () => (
  <div style={{ width: '100%', height: '100%',
    background: 'repeating-linear-gradient(45deg, var(--kol-fg-24) 0 7px, var(--kol-fg-12) 7px 14px)' }} />
)

/* the DOMAIN payloads — what each card actually carries, from the shipped
 * components (WorkCard drawer · PrintGridCard keyline · TypefaceLibraryItem
 * specimen). All consumer content, all through the media slot. */
const WorkMedia = () => (
  <>
    <Payload />
    <div className="absolute p-3" style={{ inset: 'auto 0 0 0',
      background: 'var(--kol-surface-inverse)', color: 'var(--kol-surface-on-inverse)' }}>
      {/* class-only seams — ink inherits from the inverse drawer */}
      <ContentText variant="work" form="card" title="Kolkrabbi" meta="Client · 2026"
        titleClass="kol-sans-display-02" metaClass="kol-mono-12" gap={4} />
    </div>
  </>
)
const PrintMedia = () => (
  <>
    <Payload />
    <div className="absolute rounded-[var(--kol-radius-sm)]"
      style={{ inset: 0, border: '1px solid var(--kol-fg-08)', pointerEvents: 'none' }} />
  </>
)
const TypefaceMedia = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
    <span style={{ position: 'absolute', left: 16, bottom: 16, fontSize: 76, lineHeight: 1 }}>Ðð</span>
  </div>
)
/* ═══ CURRENT — the §3 mockups, verbatim from content-card-unification.html ═══ */
const AP = (ratio, compact) => `
<div class="kol-asset-placeholder gbox flex flex-col items-center justify-center gap-1 w-full
     ${compact ? 'p-2' : 'p-6'} border border-dashed border-fg-24 rounded bg-fg-02 text-fg-48
     font-mono text-center" style="aspect-ratio:${ratio}">
  <span class="kol-helper-12 text-fg-48" style="letter-spacing:.12em">MISSING</span>
  ${compact ? '' : '<span class="kol-mono-12 text-fg-40" style="letter-spacing:.04em">preview</span>'}
</div>`;
const THUMB = (px) => `
<div class="kol-asset-placeholder gbox flex items-center justify-center shrink-0 border
     border-dashed border-fg-24 rounded bg-fg-02 text-fg-48 font-mono"
     style="width:${px}px;height:${px}px">
  <span class="kol-helper-12 text-fg-48">·</span></div>`;

/* ═══ §3 ContentItem — composed, both forms ═══ */
const ITEMS = [
  { k: 'default', src: 'MediaCard.jsx · MediaRow.jsx', pkg: 'kol-component',
    consumers: 'MediaLibrary · kol-r2b2 · brand SlideDeckManager',
    card: `<div class="gbox rounded overflow-hidden border bg-fg-02" style="width:190px">${AP('1 / 1', true)}
      <div class="p-3 flex flex-col gap-3"><p class="kol-helper-12 text-emphasis truncate">poster-final.jpg</p>
      <p class="flex items-baseline" style="gap:16px"><span class="kol-helper-12 text-meta">2026-08-15</span><span class="kol-helper-12 text-body">2.4 MB</span></p></div></div>`,
    row: `<div class="gbox flex items-center gap-3 py-2 border-b" style="width:370px">${THUMB(48)}
      <span class="flex-1 min-w-0 kol-helper-12 text-emphasis truncate">poster-final.jpg</span>
      <span class="kol-helper-12 text-meta w-24 text-right">2026-08-15</span>
      <span class="kol-helper-12 text-body w-20 text-right">2.4 MB</span></div>` },
  { k: 'catalog', src: 'GridCard.jsx', pkg: 'kol-shell',
    consumers: 'monitor ×4 pages',
    card: `<div class="gbox bg-fg-04 border border-fg-04 overflow-hidden flex flex-col"
      style="width:190px;aspect-ratio:1 / 1.41421;border-radius:4px">
      <div class="flex-1 relative overflow-hidden">${AP('auto', true)}</div>
      <div class="bg-surface-primary border-t" style="padding:12px 16px">
      <div class="kol-mono-14 text-emphasis" style="margin-bottom:4px">Empty 7U</div>
      <div class="kol-mono-10 text-meta">7U — power, perf, patch</div></div></div>`,
    row: `<div class="gbox flex items-center justify-between px-3 rounded border border-fg-04 bg-surface-secondary"
      style="width:370px;height:36px"><span class="kol-mono-12 text-emphasis">Empty 7U</span>
      <span class="kol-mono-10 text-meta">power, perf</span></div>` },
  { k: 'print', src: 'PrintGridCard.jsx · PrintGridCardGsap.jsx', pkg: 'kol-store',
    consumers: 'kol-website prints (via its own fork)',
    card: `<div class="gbox relative overflow-hidden rounded bg-surface-secondary"
      style="width:190px;aspect-ratio:1 / 1.41421">${AP('auto', true)}
      <div class="absolute border border-fg-08 rounded" style="inset:0;pointer-events:none"></div></div>`,
    row: `<div class="gbox flex items-center justify-between rounded border border-fg-04 bg-surface-secondary"
      style="width:370px;height:36px;padding:0 12px"><span class="kol-mono-10 text-body">Meridian Drift</span>
      <span class="kol-mono-10 text-meta">A2 · edition of 30</span></div>` },
  { k: 'article', src: 'ListingCard.jsx', pkg: 'kol-content',
    consumers: 'kol-website Stack · StackLatest',
    card: `<div class="gbox" style="width:190px">${AP('16 / 9', true)}
      <div class="flex flex-col gap-2" style="margin-top:16px">
      <div class="kol-helper-12 text-body">Field notes</div>
      <h2 class="kol-sans-heading-03 text-emphasis">A note on token drift</h2>
      <p class="kol-mono-14 text-body">Why two ways to say one thing diverge.</p>
      <p class="flex items-baseline" style="gap:16px"><span class="kol-helper-12 text-meta">15 Aug 2026</span><span class="kol-helper-12 text-body">4 min</span></p></div></div>`,
    row: `<div class="gbox flex gap-6 items-start" style="width:370px">${THUMB(120)}
      <div class="flex flex-col min-w-0" style="gap:10px"><div class="kol-helper-12 text-body">Field notes</div>
      <h4 class="kol-sans-heading-05 text-emphasis">A note on token drift</h4>
      <p class="kol-mono-14 text-body">Why two ways to say one thing diverge.</p>
      <p class="flex items-baseline" style="gap:16px"><span class="kol-helper-12 text-meta">15 Aug 2026</span><span class="kol-helper-12 text-body">4 min</span></p></div></div>` },
  { k: 'work', src: 'WorkCard.jsx · WorkListItem.jsx', pkg: 'kol-content',
    consumers: 'kol-website Work · WorkDetail',
    card: `<div class="gbox rounded border border-fg-04 overflow-hidden relative" style="width:190px">
      ${AP('3 / 4', true)}<div class="absolute p-3" style="inset:auto 0 0 0;background:var(--kol-surface-inverse)">
      <div class="kol-sans-display-02" style="color:var(--kol-surface-on-inverse)">Kolkrabbi</div>
      <div class="kol-mono-12" style="color:var(--kol-surface-on-inverse);opacity:.64">Client · 2026</div></div></div>`,
    row: `<div class="gbox flex items-stretch gap-4 p-4 rounded bg-surface-secondary border border-fg-08 overflow-hidden"
      style="width:370px;min-height:96px">${THUMB(64)}
      <div class="flex flex-col gap-3 flex-1 min-w-0">
      <div class="kol-mono-14 text-body">Brand system</div>
      <div class="kol-sans-display-03 text-emphasis">Kolkrabbi Identity</div>
      <div class="kol-mono-12 text-body">2026</div></div></div>` },
  { k: 'typeface', src: 'TypefaceLibraryItem.jsx', pkg: 'kol-foundry',
    consumers: 'showcase demo — kol-website runs a fork',
    card: `<div class="gbox relative rounded border border-fg-08 bg-surface-primary overflow-hidden"
      style="width:190px;height:260px"><div class="p-4 flex flex-col gap-2"><h3 class="kol-mono-20 text-emphasis">TG Rót</h3>
      <div class="kol-mono-14 text-body">8 styles</div>
      <div class="kol-mono-12 text-body">2024</div></div>
      <div class="absolute flex items-end" style="inset:0;padding:16px">
      <span style="font-size:76px;line-height:1">Ðð</span></div></div>`,
    row: `<div class="gbox flex flex-col gap-4 p-6 rounded border border-fg-08 overflow-hidden" style="width:370px">
      <div class="flex items-baseline justify-between"><span class="kol-mono-14 text-emphasis">TG RÓT</span>
      <span class="kol-mono-12 text-body">2024</span></div>
      <div class="kol-mono-14 text-body">8 styles</div>
      <div class="truncate" style="font-size:30px;line-height:1.2">ABCDEFGHIJKLM</div></div>` },
];
const MOCKS = Object.fromEntries(ITEMS.map((it) => [it.k, it]))

const CARD_MEDIA = {
  default: <Payload />, catalog: <Payload />, print: <PrintMedia />,
  article: <Payload />, work: <WorkMedia />, typeface: <TypefaceMedia />,
}
/* work card: text lives in the drawer · print card: image-only (text off) */
const CARD_PROPS = { work: {}, print: {} }

/* ═══ the page ═══ */

function App() {
  const [bp, setBp] = useState('desktop')
  const [form, setForm] = useState('grid')

  const chipStyle = (on) => ({
    font: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit', cursor: 'pointer',
    padding: '5px 10px', borderRadius: 'var(--kol-radius-sm)',
    border: `1px solid ${on ? 'transparent' : 'var(--kol-fg-12)'}`,
    background: on ? 'var(--kol-surface-inverse)' : 'transparent',
    color: on ? 'var(--kol-surface-on-inverse)' : 'inherit',
    opacity: on ? 1 : 0.5,
  })

  return (
    <>
      <h1>The ContentCard system — live</h1>
      <p className="note">The REAL components — kol-component 0.46.0 rendered against the live cascade, not mockups. Plan: <b>docs/documentation/03-components/06-content-card-system.md</b></p>

      {/* ── §0 anatomy ── */}
      <Sect num="§0">Anatomy</Sect>
      <div className="anat">{`ContentCollection        layout · grid⇄list switch · container geometry · animation
└─ ContentItem         form="card" | "row" · variant · ratio · size · interaction
   ├─ ContentMedia     the preview box    — ratio · falls back to AssetPlaceholder
   └─ ContentText      the text block     — variant picks which slots render, and their order`}</div>

      {/* ── §1 ContentMedia ── */}
      <Sect num="§1">ContentMedia</Sect>
      <div className="sub">ratio</div>
      <div className="strip">
        {MEDIA_RATIOS.map((r) => (
          <div className="item" key={r} style={{ width: 132 }}>
            <div className="gbox"><ContentMedia ratio={r}><Payload /></ContentMedia></div>
            <span className="tag"><code>{r}</code><br />{RATIO_USE[r]}</span>
          </div>
        ))}
        <div className="item" style={{ width: 132 }}>
          <div className="gbox"><ContentMedia ratio="1 / 1" /></div>
          <span className="tag"><b>no payload</b><br />falls through to AssetPlaceholder</span>
        </div>
      </div>
      <div className="sub">props — as built (0.46.0)</div>
      <Table head={['prop', 'type', 'default', 'notes']} rows={[
        ['<code>children</code>', 'node', '—', 'the payload, rendered object-cover. Absent → AssetPlaceholder'],
        ['<code>ratio</code>', 'string', '<code>1 / 1</code>', 'free CSS aspect-ratio while the A4 question is open'],
      ]} />

      {/* ── §2 ContentText ── */}
      <Sect num="§2">ContentText</Sect>
      <div className="sub" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>breakpoint</span>
        {BP_ORDER.map((k) => (
          <button key={k} type="button" style={chipStyle(k === bp)} onClick={() => setBp(k)}>
            {k} {BP_LABEL[k]}
          </button>
        ))}
      </div>
      <table className="tv">
        <tbody>
          <tr>
            <th style={{ width: '7%' }}>variant</th>
            <th style={{ width: '27%' }}>card</th><th style={{ width: '12%' }}>card type · ink</th>
            <th style={{ width: '27%' }}>row</th><th style={{ width: '12%' }}>row type · ink</th>
            <th style={{ width: '15%' }}>read across</th>
          </tr>
          {VARIANTS.map((v) => (
            <tr key={v}>
              <td><b>{v}</b><br /><span className="path" style={{ marginTop: 4 }}>{SRC[v]}</span></td>
              <td><div className="gbox" style={{ padding: '10px 12px' }}><ContentText variant={v} form="card" {...PROPS[v]} /></div></td>
              <td><Classes variant={v} form="card" bp={bp} /></td>
              <td><div className="gbox" style={{ padding: '10px 12px' }}><ContentText variant={v} form="row" {...PROPS[v]} /></div></td>
              <td><Classes variant={v} form="row" bp={bp} /></td>
              <td><span className="tag">{RAMP[v].note}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="sub">ink — ruled: roles (emphasis · body · meta); raw fg-* only where no role fits</div>
      <Table head={['class', 'resolves to', 'strength', 'who uses it']} rows={[
        ['<code>text-emphasis</code>', '<code>--kol-fg-emphasis</code> → <code>--kol-surface-on-primary</code>', '<b>100%</b>', 'every title'],
        ['<code>text-body</code>', '<code>--kol-fg-body</code> → <code>--kol-fg-64</code>', '64%', 'body · size · work/typeface meta'],
        ['<code>text-meta</code>', '<code>--kol-fg-meta</code> → <code>--kol-fg-48</code>', '48%', 'date · detail'],
      ]} />

      {/* ── §3 ContentItem — CURRENT (mockup) vs NEW (live component) ── */}
      <Sect num="§3">ContentItem</Sect>
      <div className="sub" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>current vs new — both forms · breakpoint</span>
        {BP_ORDER.map((k) => (
          <button key={k} type="button" style={chipStyle(k === bp)} onClick={() => setBp(k)}>
            {k} {BP_LABEL[k]}
          </button>
        ))}
      </div>
      {VARIANTS.map((v) => {
        const m = MOCKS[v]
        return (
          <div key={v} style={{ marginBottom: 44 }}>
            <div style={{ fontSize: 12, marginBottom: 10 }}>
              <b>{v}</b> <span style={{ opacity: 0.45 }}>· current (as shipped) vs new (kol-component 0.46.0)</span><br />
              <span className="path">{m.src} → ContentItem.jsx</span>
            </div>
            {['card', 'row'].map((f) => (
              <div key={f} className="strip" style={{ marginBottom: 18 }}>
                <div className="item">
                  {v === 'article' ? (
                    /* the REAL shipped card — ListingCard from kol-content (Stack) */
                    <div className="gbox" style={{ width: f === 'card' ? 190 : 370 }}>
                      <ListingCard size={f === 'card' ? 'default' : 'mini'}
                        title={C.title} excerpt={C.body} date={C.date} readingTime={C.read} />
                    </div>
                  ) : (f === 'card' ? m.card : m.row)
                    ? <div dangerouslySetInnerHTML={{ __html: f === 'card' ? m.card : m.row }} />
                    : <div className="tag bad" style={{ padding: '20px 0', width: 370 }}>no current form</div>}
                  <span className="tag">{f} · current{v === 'article' ? ' — ListingCard (kol-content), live' : ''}</span>
                </div>
                <div className="item">
                  <div className="gbox" style={{ width: f === 'card' ? 190 : 370 }}>
                    {f === 'card'
                      ? <ContentItem form="card" variant={v} media={CARD_MEDIA[v]} {...(CARD_PROPS[v] ?? PROPS[v])} />
                      : <ContentItem form="row" variant={v} media={<Payload />} {...PROPS[v]} />}
                  </div>
                  <span className="tag">{f} · new</span>
                </div>
                <div style={{ width: 240 }}><Classes variant={v} form={f} bp={bp} item /></div>
              </div>
            ))}
          </div>
        )
      })}

      <div className="sub">props — as built (0.46.0)</div>
      <Table head={['prop', 'type', 'default', 'notes']} rows={[
        ['<code>form</code>', 'enum', '<code>card</code>', '<code>card</code> · <code>row</code> — the one switch'],
        ['<code>variant</code>', 'enum', '<code>default</code>', 'threads to ContentText — declared, never fallthrough'],
        ['<code>pad</code>', 'enum', 'ruled per variant', 'card only — explicit <code>--kol-pad-card-{sm,md,lg}</code> override (<code>size</code> is the text slot)'],
        ['<code>media</code> <code>ratio</code>', 'node / string', 'ruled per variant', 'no media → AssetPlaceholder; ratio stays free while A4 is open'],
        ['<code>thumb</code> <code>paddingY</code>', 'number', '<code>56</code> / <code>8</code>', 'row only — thumb edge px (0 hides), Y padding as a prop'],
        ['<code>selected</code> <code>onClick</code>', 'bool / fn', '<code>false</code>', 'selection border / whole-item target'],
        ['text slots', 'node', '—', '<code>title</code> · <code>body</code> · <code>kicker</code> · <code>detail</code> · <code>date</code> · <code>size</code> · <code>meta</code>'],
        ['<code>*Class</code> seams', 'string', 'ruled table', 'every slot class is a prop — TG-font consumers swap the class'],
      ]} />

      {/* ── §4 ContentCollection ── */}
      <Sect num="§4">ContentCollection</Sect>
      <div className="sub">container geometry — documented in GridCard’s header, implemented in every consumer</div>
      <Table head={['layout', 'columns', 'gap', 'where']} rows={[
        ['<code>grid</code>', '<code>repeat(6, 1fr)</code>', '<code>24px</code>', 'monitor’s catalog'],
        ['<code>list</code>', '<code>repeat(4, 1fr)</code>', '<code>8px</code>', 'monitor’s catalog'],
        ['<code>grid</code>', '<code>repeat(auto-fill, minmax(10rem, 1fr))</code>', '<code>16px</code>', 'MediaLibrary <code>.kol-media-grid</code>'],
        ['<code>grid</code>', '<code>1 / md:2 / lg:4</code>', '<code>24px</code>', 'prints + both foundry grids'],
        ['<code>grid</code>', '<code>1 / md:3</code>', '<code>24–32px</code>', 'kol-website Stack'],
      ]} />
      <p className="tag" style={{ marginTop: 10 }}>Five different answers. <b className="bad">Open:</b> one default with a <code>columns</code> prop, or a named set.</p>

      <div className="sub">live — ContentFilters over the collection (the real apparatus)</div>
      <ContentFilters
        items={FILES}
        title="Library"
        totalCount={FILES.length}
        filterGroups={[{ label: 'Kind', key: 'kind', values: [...new Set(FILES.map((i) => i.kind))] }]}
        layoutOptions={[{ value: 'list', label: 'LIST' }, { value: 'grid', label: 'GRID' }]}
        defaultLayout="grid"
        renderItem={(filtered, viewMode, layout) => (
          <ContentCollection form={layout === 'grid' ? 'grid' : 'list'}>
            {filtered.map((f) => (
              <ContentItem key={f.title} form={layout === 'grid' ? 'card' : 'row'} variant="default" media={<Payload />} title={f.title} date={f.date} size={f.size} />
            ))}
          </ContentCollection>
        )}
      />
      <div className="sub">props — as built (0.46.0)</div>
      <Table head={['prop', 'type', 'default', 'notes']} rows={[
        ['<code>form</code>', 'enum', '<code>grid</code>', '<code>grid</code> · <code>list</code> — the ONE switch; flip re-runs the stagger'],
        ['<code>min</code>', 'string', '<code>12rem</code>', 'grid track minimum — <code>repeat(auto-fill, minmax(min, 1fr))</code>'],
        ['<code>gap</code>', 'number', '<code>16</code>', 'px, both forms'],
        ['<code>stagger</code>', 'bool', '<code>true</code>', 'enter stagger on <code>--kol-ease-house</code>; off under reduced-motion. FLIP deferred'],
        ['<code>children</code>', 'node', '—', 'ContentItems (or anything) — the collection wraps each in its own <code>li</code>'],
      ]} />

      {/* ── §5 dependencies ── */}
      <Sect num="§5">Dependencies</Sect>
      <Table head={['dependency', 'state', 'where', 'notes']} rows={[
        ['<code>AssetPlaceholder</code>', '<span class="ok">exists</span>', 'component/utilities', 'the empty state for every media slot. <b class="bad">Needs a size step</b> — its <code>p-6</code> eats a card-scale tile (visible in §3)'],
        ['<code>Image</code> · <code>HlsVideo</code>', '<span class="ok">exists</span>', 'component', 'media payloads'],
        ['<code>Tag</code> · <code>Pill</code>', '<span class="ok">exists</span>', 'component/atoms', 'the <code>article</code> tag row'],
        ['<code>SelectIndicator</code>', '<span class="ok">exists</span>', 'component/molecules', 'named export of MediaCard — selection marker'],
        ['<code>TiltCard</code>', '<span class="ok">exists</span>', 'component/utilities', '<code>work</code> rides it through the media slot'],
        ['<code>EmptyState</code>', '<span class="ok">exists</span>', 'component/molecules', 'the collection’s empty result'],
        ['<code>usePrefersReducedMotion</code>', '<span class="ok">exists</span>', 'component/hooks', 'gates every animation'],
        ['<code>Icon</code>', '<span class="ok">exists</span>', 'kol-icons', 'actions, kind glyphs'],
        ['type ramp', '<span class="ok">shipped</span>', 'component/molecules', '<code>ContentText</code> 0.46.0 — the ruled ramp; every slot class a prop seam'],
        ['motion tokens', '<span class="ok">token</span>', 'kol-theme 0.43.0', '<code>--kol-ease-house</code> — the card curve, tokenised'],
        ['collection CSS', '<span class="ok">shipped</span>', 'kol-theme 0.43.0', '<code>.kol-collection-item</code> + keyframes, organisms sheet'],
      ]} />

      {/* ── §6 motion ── */}
      <Sect num="§6">Motion</Sect>
      <Table head={['curve', 'state', 'value', 'where']} rows={[
        ['<code>--kol-transition-fast/base/slow</code>', '<span class="ok">token</span>', '<code>cubic-bezier(0.4, 0, 0.2, 1)</code>', 'kol-theme.css'],
        ['<code>--kol-transition-spring</code>', '<span class="ok">token</span>', '<code>cubic-bezier(0.34, 1.56, 0.64, 1)</code>', 'kol-theme.css'],
        ['<code>--kol-ease-house</code>', '<span class="ok">token</span>', '<code>cubic-bezier(0.16, 1, 0.3, 1)</code>', 'kol-theme 0.43.0 — the 5 hardcoded call sites (GridCard · WorkCard · SearchInput · ContentFilters · WorkViewToggle) still to migrate'],
      ]} />

      {/* ── §7 breakpoints ── */}
      <Sect num="§7">Breakpoints</Sect>
      <Table head={['mechanism', 'state', 'value', 'where']} rows={[
        ['Tailwind media queries', '<span class="ok">the law</span>', '<code>p-4 md:p-6</code> · <code>w-16 md:w-28</code> · <code>grid-cols-1 md:grid-cols-2 lg:grid-cols-4</code>', 'WorkListItem · CardFeatureItem · prints + both foundry grids · Stack'],
        ['container queries', '<span class="bad">a second system</span>', '<code>@container (min-width: 540px)</code>', 'kol-dashboards <code>.dash-grid</code> — arguably correct for a card that must react to its column, not the page'],
        ['hardcoded px query', '<span class="bad">against the law</span>', '<code>data-cols</code> clamps 3/4 → span 2 under <b>539px</b>', 'kol-dashboards GridCard'],
      ]} />
      <div className="sub">responsive form</div>
      <Table head={['prop', 'responsive form', 'what it replaces']} rows={[
        ['<code>form</code>', '<code>form={{ base: "row", lg: "card" }}</code>', 'kills StackLatest\'s duplicate render. <b class="bad">Open:</b> responsive object, or a <code>ContentCollection</code>-level rule'],
        ['<code>columns</code>', '<code>columns={{ base: 1, md: 2, lg: 4 }}</code>', 'the four grid answers in §4 are all just this'],
        ['<code>size</code>', '<code>size={{ base: "sm", md: "md" }}</code>', 'covers <code>p-4 md:p-6</code> and <code>w-16 md:w-28</code> without per-card queries'],
      ]} />

      {/* ── §8 open rulings ── */}
      <Sect num="§8">Open rulings</Sect>
      <Table head={['concern', 'answers in the wild', 'the rule']} rows={[
        ['radius', '<code>rounded</code> · <code class="bad">borderRadius: 4</code> · <code class="bad">rounded-[2px]</code>', 'the token, never a literal. Every token <code>sm</code> and up is already 4px'],
        ['padding', '<code>p-3</code> · <code>12px 16px</code> · <code>p-4 md:p-6</code> · <code>p-6</code>', 'one scale, stepped by <code>size</code> — <code>--kol-pad-card-*</code> shipped'],
        ['row Y pad', '<code>py-2</code> hardcoded', 'a prop — shipped'],
        ['type', 'five different card/row pairs across six variants (§2)', '<span class="ok">ruled 2026-08-15</span> — the text table in 06-content-card-system.md; title steps, size only, one family'],
        ['ink', '<code>text-emphasis</code> (100%) vs <code>text-fg-96</code> (96%) on the same slot', '<span class="ok">ruled</span> — roles (<code>emphasis</code> · <code>body</code> · <code>meta</code>); raw stops only where no role fits'],
        ['ratio', '<code>1/1.41421</code> · <code>16/9</code> · <code>3/4</code> · <code>square</code> · <code>h-[500px]</code>', '<b class="bad">open</b> — export-specs is 9:16 · 3:5 · 4:5 · 1:1 · 5:4 · 5:3 · 16:9. A4 is in neither that nor the tokens'],
        ['container grid', 'five different column/gap pairs (§4)', '<b class="bad">open</b> — one default + <code>columns</code>, or a named set'],
        ['both forms', '<code>print</code> had no row and no text at all', 'every variant ships both; unused slots switch off by prop — shipped'],
        ['breakpoints', 'Tailwind queries · container queries · one hardcoded 539px', '<b class="bad">open</b> — Tailwind scale is the law, but the dashboards container query may be the right answer for a card sizing to its column. §7'],
        ['responsive form', 'StackLatest renders BOTH forms and hides one at <code>lg</code>', '<b class="bad">open</b> — <code>form</code>/<code>columns</code>/<code>size</code> take responsive objects, resolved in the collection'],
        ['naming', '<code>ListingCard</code> was renamed from <code>ArticleCard</code> on 2026-08-15', '<b class="bad">open</b> — <code>ContentCard</code> is now the generic listing card, so that rename needs revisiting with kol-website'],
      ]} />
    </>
  )
}

createRoot(document.getElementById('mount')).render(<App />)
