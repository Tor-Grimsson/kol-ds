import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CodeBlock } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import PreviewCard from './PreviewCard.jsx'
import { setsOf, usedIn } from './set-membership.js'
import { getComponentBySlug, COMPONENTS_AZ, slugify } from '../nav/registry.js'
import SOURCES from '../usage/component-sources.json'
import ORIGINS from '../usage/component-origins.json'
import STYLING from '../usage/styling.json'
import COMPOSITION from '../usage/composition-index.json'

/* WHAT A COMPONENT IS BUILT FROM, AND WHAT IS BUILT FROM IT (user 2026-10-02: *"components dont
 * list their dependencies and nested components? they should be interconnected no?"*). Game
 * Picker renders `Dropdown` and its page never said so: `composes` came from docs-meta.json, which
 * covers kol-component only. The composition index reads every package's source, so both
 * directions come from it — one derivation, read both ways. Only names with a page are kept. */
const stemOf = (file) => file.split('/').pop().replace(/\.\w+$/, '')
const USES = {}
const USED_BY = {}
for (const [file, list] of Object.entries(COMPOSITION)) {
  if (!/(^|\/)packages\/[^/]+\/src\//.test(file)) continue
  const from = stemOf(file)
  for (const { target } of list) {
    if (target === from) continue
    ;(USES[from] ||= new Set()).add(target)
    ;(USED_BY[target] ||= new Set()).add(from)
  }
}
const pagesOf = (names) => [...(names ?? [])]
  .map((n) => getComponentBySlug(slugify(n)))
  .filter(Boolean)
  .sort((a, b) => a.displayName.localeCompare(b.displayName))

/* WHAT IT IS BUILT FROM, READ FROM ITS SOURCE (LayoutGroup, 2026-10-31 — kol-atlas: *"/components/document-index shows none
 * of what it is built from (SectionText, the icons, the text styles)"*). The composition index above is mined with the
 * estate scan (extract-usage), so a component newer than the last scan listed nothing, and it never held icons or type
 * classes. The page now reads the component's own file (lazily, only the one it shows): every component it renders, the
 * kol-icons it names and the kol type classes it sets. A part with no page of its own (a file-local card, an alias such
 * as PageHeader) is walked into, so what it renders is listed in its place. */
const RAW = import.meta.glob('../../../packages/*/src/**/*.{js,jsx}', { query: '?raw', import: 'default' })
const rawKey = (file) => `../../../${file}`
const join = (from, rel) => {
  const parts = from.split('/').slice(0, -1)
  for (const seg of rel.split('/')) { if (seg === '..') parts.pop(); else if (seg !== '.') parts.push(seg) }
  const f = parts.join('/')
  return [f, `${f}.jsx`, `${f}.js`].find((x) => RAW[rawKey(x)]) ?? null
}
/* the file an import points at: relative, or a package's own src path; a bare package name resolves per name (SOURCES) */
const target = (from, spec) => {
  if (spec.startsWith('.')) return join(from, spec)
  const m = /^@kolkrabbi\/kol-([a-z-]+)\/src\/(.+)$/.exec(spec)
  return m ? join(`packages/${m[1]}/src/x`, `./${m[2]}`) : null
}
async function readParts(file, seen = new Set(), depth = 0) {
  const out = { components: new Set(), icons: new Set(), type: new Set() }
  if (!file || seen.has(file) || !RAW[rawKey(file)]) return out
  seen.add(file)
  const src = await RAW[rawKey(file)]()
  for (const m of src.matchAll(/\b(kol-(?:sans|mono|helper|doc|prose|display|serif)-[a-z0-9-]+)/g)) out.type.add(m[1])
  for (const m of src.matchAll(/<Icon\b[^>]*?\bname="([a-z0-9-]+)"|\bicon[=:]\s*["']([a-z0-9-]+)["']/g)) out.icons.add(m[1] ?? m[2])
  /* imported names that the file renders as an element */
  const imports = []
  for (const m of src.matchAll(/import\s+([^'"]+?)\s+from\s+['"]([^'"]+)['"]/g)) {
    const [clause, spec] = [m[1], m[2]]
    const def = /^([A-Z]\w*)/.exec(clause)?.[1]
    if (def) imports.push({ local: def, name: def, spec })
    for (const n of /\{([^}]*)\}/.exec(clause)?.[1].split(',') ?? []) {
      const [name, local = name] = n.trim().split(/\s+as\s+/)
      if (/^[A-Z]/.test(local)) imports.push({ local, name, spec })
    }
  }
  const rendered = (n) => new RegExp(`<${n}[\\s/>]`).test(src)
  const walk = []
  for (const { local, name, spec } of imports) {
    if (!rendered(local) || local === 'Icon') continue
    const page = getComponentBySlug(slugify(name))
    const at = target(file, spec) ?? SOURCES[name]
    /* an alias on the retirement ledger (its file opens `@deprecated`, as PageHeader → SectionText) lists what it renders */
    const alias = page && at && RAW[rawKey(at)] && /@deprecated/.test((await RAW[rawKey(at)]()).match(/\/\*\*[\s\S]*?\*\//)?.[0] ?? '')
    if (page && !alias) { out.components.add(page.slug); continue }
    if (depth < 2) walk.push(at)
  }
  for (const f of walk) {
    const sub = await readParts(f, seen, depth + 1)
    sub.components.forEach((c) => out.components.add(c)); sub.icons.forEach((c) => out.icons.add(c)); sub.type.forEach((c) => out.type.add(c))
  }
  return out
}

function useSourceParts(name) {
  const [parts, setParts] = useState(null)
  useEffect(() => {
    let live = true
    setParts(null)
    readParts(name ? SOURCES[name] : null).then((p) => { if (live) setParts(p) })
    return () => { live = false }
  }, [name])
  return parts
}

const chipRow = (list) => (
  <ul className="flex flex-wrap gap-2">{list.map((x) => <li key={x}><code className="kol-table-token">{x}</code></li>)}</ul>
)

/** The lists on a component page — what it renders (its components, icons and text styles) and what renders it — the
 *  components each a link. */
export function Nested({ component, Heading }) {
  const parts = useSourceParts(component.name)
  const nested = pagesOf(new Set([...(USES[component.name] ?? []), ...[...(parts?.components ?? [])].map((slug) => getComponentBySlug(slug)?.name)].filter((n) => n && n !== component.name)))
  const rows = [
    ['Nested components', nested],
    ['Used by', pagesOf(USED_BY[component.name])],
  ].filter(([, list]) => list.length)
  /* flat siblings, like every other section of the page — the heading carries the section air */
  return (
    <>
      {rows.map(([title, list]) => (
        <Fragment key={title}>
          <Heading>{title}</Heading>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {list.map((c) => (
              <li key={c.slug} className="kol-doc-body">
                <Link className="underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64" to={`/components/${c.slug}`}>{c.displayName}</Link>
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
      {parts?.icons.size > 0 && <><Heading>Nested icons</Heading>{chipRow([...parts.icons].sort())}</>}
      {parts?.type.size > 0 && <><Heading>Nested text styles</Heading>{chipRow([...parts.type].sort().map((c) => `.${c}`))}</>}
    </>
  )
}

/**
 * The furniture a component doc carries regardless of how its body is authored.
 *
 * Extracted from ComponentPage.jsx (2026-07-30) because the MDX path rendered
 * header + body only: every converted component silently lost its source-mined
 * meta rows, its props-table merge and its prev/next pager. A conversion must
 * never be a regression, so both paths now render from ONE definition.
 */

/* API rows = authored ∪ generated (scripts/extract-api.mjs). Authored rows keep
 * their curated order + descriptions; generated rows fill defaults and append
 * the props the hand-authored table missed (the drift this kills). react-docgen
 * on plain JS only sees defaulted props reliably, so neither side is complete
 * alone — and 13 components (render-null utilities, class components, aliased
 * re-exports) still resolve to no definition at all. */
export function mergeApi(authored = [], generated = []) {
  if (!generated.length) return authored
  const gen = new Map(generated.map((r) => [r.prop, r]))
  const rows = authored.map((a) => {
    const g = gen.get(a.prop)
    /* GENERATED WINS on the machine-derived fields (2026-07-30 drift ruling).
     * `type` and `def` are facts react-docgen reads off the source; `desc` is
     * prose a human writes. This used to prefer the authored value for all
     * three, so a default that changed in the source kept rendering its old
     * value forever — ThemeToggle shipped `fill: subtle` for a day after the
     * source said `none`, in the same file whose prose table announced the
     * flip. Author prose still wins; author FACTS no longer outrank the file. */
    return g ? {
      prop: a.prop,
      type: g.type && g.type !== '—' ? g.type : a.type,
      def: g.def && g.def !== '—' ? g.def : a.def,
      desc: a.desc || g.desc,
    } : a
  })
  const have = new Set(authored.map((a) => a.prop))
  for (const g of generated) if (!have.has(g.prop)) rows.push(g)
  return rows
}

/* Source-mined meta under the preview (scripts/extract-docs-meta.mjs):
 * D1 — the kol type classes the component renders text with, so system
 * conformance vs freestyle Tailwind is visible at a glance;
 * D2 — a "Composes" row linking the KOL components it nests. */
/* THE STYLING CONTRACT (user ruling 2026-08-01). A component page carried
 * frontmatter, tags, install, usage prose and props — and said nothing about
 * the classes it emits or the tokens it reads, which is the half a design
 * system exists to define. GENERATED (scripts/extract-styling.mjs), never
 * authored: an authored block is a second copy of the stylesheet, and it
 * drifts the first time someone edits CSS without opening the doc. */
function StylingRows({ name }) {
  const s = name ? STYLING[name] : null
  if (!s) return null
  const chips = [...(s.classes ?? []), ...(s.dynamic ?? [])]
  if (!chips.length && !s.tokens?.length) return null
  /* .kol-table-token is THE token chip — the one the tables already use
   * (kol-components-organisms.css). These rows hand-rolled a near-identical
   * one in Tailwind, which is how two chip looks existed for one concept. */
  const chip = 'kol-table-token'
  return (
    <>
      {chips.length > 0 && (
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="kol-doc-eyebrow shrink-0">Classes</span>
          {chips.map((c) => <code key={c} className={chip}>.{c}</code>)}
        </div>
      )}
      {s.tokens?.length > 0 && (
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="kol-doc-eyebrow shrink-0">Tokens</span>
          {s.tokens.map((t) => <code key={t} className={chip}>{t}</code>)}
        </div>
      )}
    </>
  )
}

/**
 * buildProvenance — a component's SOURCE / IMPORTED FROM / TYPE STYLES /
 * CLASSES / TOKENS / COMPOSES as ordinary frontmatter fields.
 *
 * This was `MetaRows`, a second metadata panel rendered directly beneath the
 * frontmatter panel in its own grammar — two blocks of the same class of
 * information (user ruling 2026-08-01). It returns DATA now; DocsFrontmatter
 * owns the rendering, so these fields inherit the icon column, the label
 * column and the chip treatment instead of re-implementing them.
 */
export function buildProvenance(component) {
  const { meta, name } = component || {}
  const out = {}
  const source = name ? SOURCES[name] : null
  const origin = name ? ORIGINS[name] : null
  const styling = name ? STYLING[name] : null

  if (source) out.source = source
  if (origin) out.imported_from = origin.date ? `${origin.source} · ${origin.date}` : origin.source
  if (meta?.typeClasses?.length) out.type_styles = meta.typeClasses.map((t) => `.${t}`)
  const classes = [...(styling?.classes ?? []), ...(styling?.dynamic ?? [])]
  if (classes.length) out.classes = classes.map((c) => `.${c}`)
  if (styling?.tokens?.length) out.tokens = styling.tokens
  /* docs-meta covers kol-component only; the composition index covers every package */
  const composes = [...new Set([...(meta?.composes ?? []), ...pagesOf(USES[name]).map((c) => c.name)])]
  if (composes.length) out.composes = composes
  /* the OTHER direction of set membership — ContentFilters is in two sets and
   * its page never said so (user ruling 2026-08-01) */
  const sets = name ? setsOf(name) : []
  if (sets.length) out.in_sets = sets.map((s) => s.title)
  /* the WIDER answer, separate from in_sets so neither misleads: ContentFilters
   * is composed by four surfaces and by zero sets */
  const used = name ? usedIn(name) : []
  if (used.length) out.used_in = used
  return out
}

/* ONE code idiom (user ruling 2026-07-30): every code surface on a doc page is
 * THE CodeBlock — no bespoke pre/copy twins racing it. CodeLine renders a
 * single line through it; InstallBlock is the pm-tab row above one. */
export function CodeLine({ text, language = 'jsx' }) {
  return (
    <div className="max-w-[var(--kol-content-panel)]">
      <CodeBlock code={text} language={language} />
    </div>
  )
}

const PMS = { pnpm: 'pnpm add', npm: 'npm install', yarn: 'yarn add', bun: 'bun add' }

const PM_TABS = Object.keys(PMS).map((k) => ({ key: k, label: k }))

/* A CALL to PreviewCard, not a sibling (user ruling 2026-08-01). This used to
 * hand-write a tab row whose class string was byte-identical to PreviewCard's,
 * in a different frame — one construct, two copies, two looks. `chrome="flush"`
 * because the CodeBlock below brings its own frame. */
export function InstallBlock({ pkg }) {
  return (
    <PreviewCard
      chrome="flush"
      tabsLabel="Package manager"
      tabs={PM_TABS}
      /* the block owns the space under its tab row (2026-10-01): it used to be the code block's
       * own margin, and with that zeroed in the doc frame the rule sat glued to the code */
      renderTab={(pm) => <div className="pt-6"><CodeBlock code={`${PMS[pm]} ${pkg}`} language="bash" /></div>}
    />
  )
}

/* Prev / next through the A→Z order (matches the sidebar within groups). */
export function Pager({ slug }) {
  const i = COMPONENTS_AZ.findIndex((x) => x.slug === slug)
  const prev = i > 0 ? COMPONENTS_AZ[i - 1] : null
  const next = i >= 0 && i < COMPONENTS_AZ.length - 1 ? COMPONENTS_AZ[i + 1] : null
  return (
    /* capped at the panel like the tables and code above it (2026-10-01 — the rule ran the full
     * column past a panel-capped table, which read as padding nobody could find), with more air
     * above; the arrows are the icon set's, not typed characters */
    <nav className="mt-6 flex max-w-[var(--kol-content-panel)] items-center justify-between gap-3 border-t border-fg-08 pt-6">
      {/* mono, not sans — nav chrome is mono-dominated (user ruling 2026-07-30) */}
      {prev ? (
        <Link to={`/components/${prev.slug}`} className="group flex flex-col gap-0.5 text-left">
          <span className="kol-mono-12 text-meta inline-flex items-center gap-1.5"><Icon name="arrow-left" size={12} />Prev</span>
          <span className="kol-mono-14 text-body group-hover:text-emphasis">{prev.displayName}</span>
        </Link>
      ) : <span />}
      {next ? (
        <Link to={`/components/${next.slug}`} className="group flex flex-col gap-0.5 text-right">
          <span className="kol-mono-12 text-meta inline-flex items-center justify-end gap-1.5">Next<Icon name="arrow-right" size={12} /></span>
          <span className="kol-mono-14 text-body group-hover:text-emphasis">{next.displayName}</span>
        </Link>
      ) : <span />}
    </nav>
  )
}
