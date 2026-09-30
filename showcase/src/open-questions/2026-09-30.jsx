import { Link } from 'react-router-dom'
import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'
import { SelectionOverlay, Tooltip, IconFrame } from '@kolkrabbi/kol-component'

/* Round 1 — answered by the user 2026-09-30. A round is never edited after it is answered: the
 * answers are recorded on it and it stays as the record. The next set of questions is a new file
 * in this folder. */
export const meta = {
  round: 1,
  date: '2026-09-30',
  title: 'Accent, search rows, tooltips, apps nesting',
  status: 'answered',
}

const Answer = ({ children }) => (
  <p className="kol-doc-body rounded border border-fg-16 px-4 py-3">
    <span className="text-emphasis">Answered 2026-09-30 — </span>{children}
  </p>
)

/**
 * Open questions — decisions still waiting on the user, laid out as live specimens (2026-09-30,
 * user: *"I dont want to make a rule without visual context … maybe fg-24 is great, I JUST NEED
 * TO SEE IT"*). A visual call written as prose is read two ways and the wrong reading gets baked
 * into a plan, so each question here shows its options side by side, rendered by the real tokens
 * and components. Nothing on this page is a ruling: the pick is made here, moves into the plan,
 * and the question leaves the page.
 *
 * Each question carries a stable anchor (`#q1` …) so the audit can link straight to it.
 */

const card = 'flex min-w-0 flex-col gap-3 rounded border border-fg-08 p-4'
const name = 'kol-doc-body text-emphasis'
const metaCls = 'kol-mono-12 text-subtle'

const SAMPLE = 'Select any of this text to see the highlight live — or read the painted copy below it.'

/* Q1 — one accent, three candidates. `--kol-accent-primary` is set on the card, so the real
 * SelectionOverlay inside paints whatever the candidate is; the text selection reads the same
 * two variables through Tailwind's `selection:` variant. The tokens are DATA here — the subject
 * under test, like the swatches below — so they are named, and resolved in one place (`v`). */
const v = (token) => (token === 'inherit' ? token : `var(${token})`)
const ACCENTS = [
  {
    id: 'yellow',
    label: 'Yellow',
    token: '--kol-color-yellow-300',
    today: 'the showcase today — kol-brand-color.css sets the accent to the brand yellow',
    bg: '--kol-color-yellow-300',
    ink: '--kol-surface-primary',
  },
  {
    id: 'white',
    label: 'White',
    token: '--kol-surface-on-primary',
    today: 'the media app today — kol-theme’s own accent, with no brand layer on top',
    bg: '--kol-surface-on-primary',
    ink: '--kol-surface-primary',
  },
  {
    id: 'fg-24',
    label: 'Grey',
    token: '--kol-fg-24',
    today: 'written for apps inside AppShell (.kol-app-shell ::selection) — text keeps its own ink',
    bg: '--kol-fg-24',
    ink: 'inherit',
  },
]

function AccentCard({ a }) {
  return (
    <div className={card} style={{ '--kol-accent-primary': v(a.bg), '--q-sel': v(a.bg), '--q-ink': v(a.ink) }}>
      <div className="flex flex-col gap-1">
        <span className={name}>{a.label}</span>
        <span className={metaCls}>{a.token}</span>
      </div>
      <p className="kol-doc-body selection:bg-[var(--q-sel)] selection:text-[var(--q-ink)]">{SAMPLE}</p>
      <p className="kol-doc-body">
        <span style={{ background: v(a.bg), color: v(a.ink) }}>Painted: a selected line of text</span>
      </p>
      <div className="relative h-[140px] w-full overflow-hidden rounded border border-fg-08 bg-fg-04">
        <SelectionOverlay box={{ x: 32, y: 28, w: 150, h: 84 }} />
      </div>
      <p className={metaCls}>{a.today}</p>
    </div>
  )
}

/* Q2 — the darker teal/green remembered from recent work, used in one place. Not found in the
 * source by name, so the ramp's darker stops are shown instead; the pick (or "none of these —
 * it was in X") answers it. */
const GREENS = [
  { label: 'Teal 400', token: '--kol-color-teal-400' },
  { label: 'Teal 500', token: '--kol-color-teal-500' },
  { label: 'Green 400', token: '--kol-color-green-400' },
  { label: 'Green 500', token: '--kol-color-green-500' },
  { label: 'Teal 300', token: '--kol-color-teal-300' },
  { label: 'Palette green', token: '--kol-palette-green' },
]

/* Q3 — a search result row: today's background wash against the two proposals. */
const ROW = { title: 'App anatomy', meta: 'doc · Documentation · docs · 2026-09-29', desc: 'An app’s six layers, engine to fixture' }
const ROWS = [
  { label: 'Today', note: 'background wash on hover, no x padding', link: 'flex flex-col gap-1 py-3 hover:bg-fg-04', title: 'kol-doc-body text-emphasis' },
  { label: 'Underline', note: 'no wash; the title underlines and the row inks up', link: 'group flex flex-col gap-1 px-3 py-3 opacity-80 hover:opacity-100', title: 'kol-doc-body text-emphasis group-hover:underline underline-offset-4' },
  { label: 'Title up', note: 'as Underline, the title one step larger than its meta', link: 'group flex flex-col gap-1 px-3 py-3 opacity-80 hover:opacity-100', title: 'kol-doc-heading text-emphasis group-hover:underline underline-offset-4' },
]

/* Q4 — tooltip copy. Hover each. */
const TIPS = [
  { label: 'Today', tip: 'Search · ⌘K or /' },
  { label: 'One word', tip: 'Search' },
]

/* Q5 — the apps tier as a hierarchy. Today /apps is a stack of tables; this is the nesting drawn
 * the way Docs › Shell & Layout draws its composition. */
const box = 'rounded border border-dashed border-fg-16 p-3'
const boxLabel = 'kol-mono-12 text-meta'

function AppsNesting() {
  return (
    <div className={`${box} flex flex-col gap-2`}>
      <span className={boxLabel}>Studio — Hub + Library · Create · Use</span>
      <div className={`${box} flex flex-col gap-2`}>
        <span className={boxLabel}>Hub — Home · Settings · the S sheet · walkthrough</span>
        <div className={`${box} flex flex-col gap-2`}>
          <span className={boxLabel}>Shell — rail · layout root · nav keys · phone bar</span>
          <div className="flex flex-wrap gap-2">
            <div className={`${box} flex-1`}><span className={boxLabel}>Catalog — masthead · filter · views · cards</span></div>
            <div className={`${box} flex-1`}><span className={boxLabel}>Tool — the work itself</span></div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className={`${box} flex-1`}><span className={boxLabel}>Engine — plain JS under everything</span></div>
        <div className={`${box} flex-1`}><span className={boxLabel}>Fixture — fake data the apps run on</span></div>
      </div>
    </div>
  )
}

export default function OpenQuestionsRound1() {
  usePageMeta({ tags: [], related: [] })
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader
        eyebrow="Open questions · Round 1 · 2026-09-30"
        title="Accent, search rows, tooltips, apps nesting"
        lede="Five visual calls, shown side by side and picked by eye. Answered — kept as the record."
      />

      <DocSection id="q1" title="Accent">
        <p className="kol-doc-body">
          One accent paints text selection and the editing overlays. Three candidates, each rendered with the real
          token. The audit links here from its color item.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {ACCENTS.map((a) => <AccentCard key={a.id} a={a} />)}
        </div>
        <Answer><strong>White.</strong> The accent is kol-theme&rsquo;s own (<code>--kol-surface-on-primary</code>), not the brand yellow.</Answer>
      </DocSection>

      <DocSection id="q2" title="Dark green">
        <p className="kol-doc-body">
          The darker teal or green from recent work, used in one place, is not in the source by name. These are the
          ramps&rsquo; darker stops. Pick one, or name where it was.
        </p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {GREENS.map((g) => (
            <div key={g.token} className={card}>
              <div className="h-16 w-full rounded" style={{ background: `var(${g.token})` }} />
              <span className={name}>{g.label}</span>
              <span className={metaCls}>{g.token}</span>
            </div>
          ))}
        </div>
        <Answer><strong>Dropped.</strong> Not found, so not relevant.</Answer>
      </DocSection>

      <DocSection id="q3" title="Search rows">
        <p className="kol-doc-body">A result row on <Link className="underline underline-offset-4" to="/search">the search page</Link>. Hover each.</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {ROWS.map((r) => (
            <div key={r.label} className={card}>
              <span className={name}>{r.label}</span>
              <a href="#q3" onClick={(e) => e.preventDefault()} className={`${r.link} border-t border-b border-fg-08`}>
                <span className={r.title}>{ROW.title}</span>
                <span className="kol-helper-12 text-subtle">{ROW.meta}</span>
                <span className="kol-doc-body">{ROW.desc}</span>
              </a>
              <span className={metaCls}>{r.note}</span>
            </div>
          ))}
        </div>
        <Answer><strong>Underline was drawn wrong</strong> — x padding only belongs with a background wash. Two valid options: wash <em>with</em> x padding, or underline with <em>no</em> x padding. <strong>Title up rejected.</strong> Which of the two is still open.</Answer>
      </DocSection>

      <DocSection id="q4" title="Tooltips">
        <p className="kol-doc-body">The header&rsquo;s search button. Hover each. Shortcuts would live in the S sheet only.</p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {TIPS.map((t) => (
            <div key={t.label} className={`${card} items-start`}>
              <span className={name}>{t.label}</span>
              <Tooltip label={t.tip}>
                <IconFrame name="search" variant="nav" size="md" aria-label="Search" />
              </Tooltip>
              <span className={metaCls}>{t.tip}</span>
            </div>
          ))}
        </div>
        <Answer><strong>One word.</strong> Already ruled, many times — shortcuts live in the S sheet only.</Answer>
      </DocSection>

      <DocSection id="q5" title="Apps nesting">
        <p className="kol-doc-body">
          <Link className="underline underline-offset-4" to="/apps">/apps</Link> explains the layers as tables. The
          same layers drawn as containers, the way <Link className="underline underline-offset-4" to="/docs/shell-and-layout">Shell &amp; Layout</Link> draws
          its composition:
        </p>
        <AppsNesting />
        <Answer><strong>Yes.</strong> Nested containers are a documented way of visual communication — named and reused beyond Apps.</Answer>
      </DocSection>
    </div>
  )
}
