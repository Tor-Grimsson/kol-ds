import { useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ShellLayout, ShellSidebar, RailSection, RailRow, buildTagCounts, useTagMode, TagPath } from '@kolkrabbi/kol-workshop'
import { Asset } from '@kolkrabbi/kol-brand/svg'
import { HEADER_ICON } from '@kolkrabbi/kol-framework'
import { SegmentedToggle, useScrollSpy } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import { useGrouping } from './grouping.jsx'
import { SHELL_ROUTES, isShellTabActive, buildShellSearchItems, componentTreeRoutes, admittedVaultTree } from '../nav/shell-nav.js'
import { TAG_INVENTORY } from '../nav/vault.js'
import { anyComponentsAdmitted } from '../nav/admitted.js'
import useEmbed from './useEmbed.js'

/**
 * ShellChrome — the showcase's chrome, mounted ONCE as a route-level layout.
 *
 * Replaces the old per-page model where 11 pages imported DocLayout (which
 * itself rendered TopBar + sidebar + TOC) and 3 imported TopBar directly:
 * fourteen copies of the same decision, which is how they drifted. Pages are
 * now content only and render into the shell's <Outlet/>.
 *
 * The TOC is DERIVED, never passed. Every docs framework (Docusaurus, Nextra,
 * Starlight) walks the rendered headings instead of asking each page for an
 * array — the hand-written arrays here went stale against their own headings.
 */

/* Auto-TOC: read the headings the page actually rendered. Runs after paint on
 * every navigation, and again when the main column mutates (async demos,
 * lazily-mounted sections). ids are required — a heading without one can't be
 * linked, so it's skipped rather than silently mis-anchored. */
function useHeadings() {
  const { pathname } = useLocation()
  const [items, setItems] = useState([])

  useEffect(() => {
    const main = document.getElementById('main')
    if (!main) return undefined

    const read = () => {
      /* The anchor can sit on the heading OR on its wrapping section — DocKit's
       * DocSection puts the id on <section> and the h2 inside it. Take either;
       * skip headings with no anchor anywhere (nothing to link to).
       *
       * SPECIMENS ARE NOT THE PAGE (2026-07-30). A heading rendered INSIDE a
       * demo or a type specimen is sample content — it describes the component
       * being shown, not the document showing it. Two leaks came from counting
       * them: the typography page's `<h2>Sample display-md</h2>` specimens sat
       * inside `DocSection id="prose"`, so three TOC rows appeared all pointing
       * at `#prose`; and the DocsToc demo renders its own `<section id>` + h3,
       * injecting four rows named after another component's fake TOC. Anything
       * inside a preview stage or a demo is excluded at the source. */
      const found = [...main.querySelectorAll('h2, h3')]
        .filter((h) => !h.closest('[data-toc-skip], .kol-doc-figure, .kol-demo-stage'))
        .map((h) => {
          const id = h.id || h.closest('section[id]')?.id
          return id ? { id, label: h.textContent.trim(), sub: h.tagName === 'H3' } : null
        })
        .filter(Boolean)
      setItems((prev) =>
        prev.length === found.length && prev.every((p, i) => p.id === found[i].id) ? prev : found
      )
    }

    read()
    const observer = new MutationObserver(read)
    observer.observe(main, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [pathname])

  return items
}

function AutoToc() {
  const headings = useHeadings()
  const navigate = useNavigate()
  const { openTagMode } = useTagMode()
  const [collapsed, setCollapsed] = useState(false)
  const [actionsCollapsed, setActionsCollapsed] = useState(false)
  const [tagsCollapsed, setTagsCollapsed] = useState(false)
  /* The rail had NO tags at all (user 2026-08-01). DocumentationReader carries
   * a Tags section on vault routes and this rail — every OTHER page — carried
   * none: the same two-right-rails fault as Quick actions, one section over.
   * Top by count, so the rail is an entry point into the tag system rather
   * than a dump of all 35. */
  const topTags = useMemo(() => buildTagCounts(TAG_INVENTORY).slice(0, 12), [])
  /* The spy `DocsToc` already uses (kol-component). Reused rather than a second
   * observer: the two rails must agree on which heading is current. */
  const activeId = useScrollSpy(headings.map((h) => h.id), { root: '#main' })
  /* ONE rail system (user 2026-07-30): the right rail IS the left rail —
   * identical row idiom (shell-nav-item + kol-mono-14), identical section
   * label (kol-doc-eyebrow), identical HEADER. That header now uses the left
   * rail's own eyebrow class rather than borrowing `.shell-nav-group-header`
   * (the nav row) + `.shell-sidebar-label` — the composition that made this
   * eyebrow's box disagree with the left rail's. No chevron drawn (user ruling
   * 2026-08-01); the whole row is still the toggle. */
  if (headings.length === 0) return null
  return (
    <div className="flex flex-col gap-6 pr-2">
      {/* L1, the same rung the left rail's DOCUMENTATION/TOOLS sits on, from
        * the same component — so the label and the box are identical in both
        * rails. This header used to be hand-written here and hand-written
        * differently over there, which is how the two rails drifted. No count:
        * an eyebrow names its material, it does not tally it (user ruling
        * 2026-08-01). */}
      <RailSection level={1} label="This page">
        {/* The MIDDLE RUNG, which this rail never had (user ruling 2026-08-01).
          * The left rail runs eyebrow → group → rows; this one ran eyebrow →
          * rows, so it had nowhere to put a chevron or a count — the two rails
          * were a rung apart, which is what made them read as different
          * systems. `Contents` is the group; the headings are its rows. */}
        <RailSection
          level={2}
          label="Contents"
          count={headings.length}
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          icon={Icon}
        >
          {/* ACTIVE ON BOTH RAILS (user ruling 2026-08-01). The left tree
            * highlighted the current page and this rail highlighted nothing —
            * same rung, one state. A hash link is invisible to react-router,
            * so the scroll spy supplies it. */}
          <nav className="shell-nav-items">
            {headings.map((h) => (
              <RailRow key={h.id} href={`#${h.id}`} active={h.id === activeId} sub={h.sub}>
                {h.label}
              </RailRow>
            ))}
          </nav>
        </RailSection>

        {/* THE SAME FOUR SECTIONS THE VAULT READER HAS (user 2026-08-01:
          * "everything we had in right sidebar is now gone"). It was never
          * deleted — DocReaderSidebar carries Related/Quick actions/Tags/Graph
          * on vault routes, and this rail, which serves every OTHER page, only
          * ever had Contents. Two right rails with different sections is the
          * same two-systems fault one surface over. */}
        <RailSection
          level={2}
          label="Quick actions"
          collapsed={actionsCollapsed}
          onToggle={() => setActionsCollapsed((c) => !c)}
          icon={Icon}
        >
          <nav className="shell-nav-items">
            <RailRow onClick={() => navigate(-1)} icon={<Icon name="arrow-left" size={14} />}>Back</RailRow>
            <RailRow to="/documentation" icon={<Icon name="book-open" size={14} />}>All documentation</RailRow>
            <RailRow to="/components" icon={<Icon name="grid" size={14} />}>View components</RailRow>
            <RailRow
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              icon={<Icon name="copy" size={14} />}
            >
              Copy path
            </RailRow>
            <RailRow
              onClick={() => openTagMode(null, { view: 'graph' })}
              icon={<Icon name="polygon" size={14} />}
            >
              Graph view
            </RailRow>
          </nav>
        </RailSection>

        <RailSection
          level={2}
          label="Tags"
          count={topTags.length}
          collapsed={tagsCollapsed}
          onToggle={() => setTagsCollapsed((c) => !c)}
          icon={Icon}
        >
          <nav className="shell-nav-items">
            {topTags.map(({ tag, count }) => (
              <RailRow
                key={tag}
                onClick={() => openTagMode(tag)}
                icon={<Icon name="hash-02" size={14} />}
                trailing={count}
              >
                <TagPath tag={tag} />
              </RailRow>
            ))}
          </nav>
        </RailSection>
      </RailSection>
    </div>
  )
}

/* The brand pair: KOLKRABBI wordmark in the logo slot (reserves the 256px rail
 * column, links home) + the WORKSHOP wordmark as the surface mark — the same
 * pair ShellLayout ships as its package default.
 *
 * This slot held a typed `KOL DS` span, on a comment claiming no drawn asset
 * existed. One did: `wordmark-workshop.svg`, in kol-brand the whole time,
 * auto-registered by AssetLoader's glob. The typed placeholder wrapped to two
 * lines in the header. Drawn asset over typed text, always. */
function ShowcaseBrand() {
  return (
    <>
      <Link to="/" className="shell-header-logo hidden md:flex shrink-0 items-center text-emphasis lg:w-64">
        <Asset name="kol-wordmark" title="Kolkrabbi" className="inline-flex [&>svg]:h-6 [&>svg]:w-auto" />
      </Link>
      <Link to="/" className="shell-header-logo flex items-center text-emphasis">
        <Asset name="wordmark-workshop" title="Workshop" className="inline-flex [&>svg]:h-6 [&>svg]:w-auto" />
      </Link>
    </>
  )
}

function ShowcaseSidebar({ onNavigate }) {
  const { mode, setMode } = useGrouping()
  const cmpRoutes = useMemo(() => componentTreeRoutes(mode), [mode])
  /* The admission gate reaches the two derived trees as well as the tabs — a
   * grouping toggle over an empty tree, or a Documentation tree under a held
   * Documentation tab, would be the same drift the gate exists to stop. */
  const showComponents = anyComponentsAdmitted()
  /* Per-CHAPTER now, not per-surface (2026-07-31): admitting Foundations opens
   * chapter 01 inside Documentation rather than a top-level "Foundations"
   * category. The label said SHOWCASE — the app's name, not a body of
   * material — over a tree of chapters; see
   * docs/operations/04-content-pipeline/02-taxonomy.md. */
  const vaultTree = useMemo(() => admittedVaultTree(), [])
  const showVault = vaultTree.length > 0
  /* TOOLS is not a category — it is the routes the app serves (Blocks, Sets,
   * References, Quarantine). Rendered only when it holds something. */
  const showTools = SHELL_ROUTES.length > 0
  return (
    <div className="flex flex-col gap-6">
      {/* ORDER IS THE LAW, not an accident of JSX (2026-08-01).
        * `docs/documentation/04-compositions/02-shells.md:165` has said
        * "Documentation · Components · Tools" since 2026-07-31 and this file
        * rendered it exactly backwards — Tools, the routes the app serves,
        * standing above the body of material. Nothing gated section order, so
        * it drifted the day it was written. `validate:rails` R4 asserts it now.
        *
        * THE VAULT — the repo's docs/ library as CATEGORY → chapter → page,
        * filtered to admitted chapters. */}
      {showVault && (
        <ShellSidebar routes={vaultTree} basePath="/" label="Documentation" onNavigate={onNavigate} />
      )}
      {showComponents && (
        <>
          <div>
            <p className="shell-sidebar-label kol-doc-eyebrow">Group by</p>
            <SegmentedToggle
              options={[{ value: 'atomic', label: 'Atomic' }, { value: 'function', label: 'Function' }]}
              value={mode}
              onChange={setMode}
              size="sm"
            />
          </div>
          <ShellSidebar routes={cmpRoutes} basePath="/" label="Components" labelTo="/components" onNavigate={onNavigate} />
        </>
      )}
      {showTools && (
        <ShellSidebar routes={SHELL_ROUTES} basePath="/" label="Tools" labelTo="/" onNavigate={onNavigate} />
      )}
    </div>
  )
}

const REPO = 'https://github.com/Tor-Grimsson/kol-ds'

export default function ShellChrome() {
  const { pathname } = useLocation()
  const embedded = useEmbed()
  const { openTagMode } = useTagMode()

  /* ONE search (2026-07-30 reachability rule). Tags used to live in a second,
   * separate search box inside the tag overlay — a global search NUMBER 2 that
   * knew nothing about this one, and that you could only reach by first
   * clicking a tag somewhere. Tags are rows here now, carrying an `action`
   * instead of an `href` because selecting one toggles state rather than
   * navigating. Built HERE rather than in shell-nav.js because the closure
   * needs the tag context, and a plain module can't hold a hook. */
  const searchItems = useMemo(() => {
    const tags = buildTagCounts(TAG_INVENTORY).map(({ tag, count }) => ({
      id: `tag-${tag}`,
      label: tag,
      sectionLabel: 'Tags',
      keywords: [`${count} docs`],
      action: () => openTagMode(tag),
    }))
    return [...buildShellSearchItems(), ...tags]
  }, [openTagMode])

  /* ?embed=1 — main content only, for iframing showcase pages into other
   * repos. The shell is fixed inset-0 with its own scroll regions, so embed
   * bypasses it entirely rather than trying to hide its parts. */
  if (embedded) {
    return (
      <main id="main" className="min-h-dvh w-full">
        <div
          className="mx-auto w-full min-w-0 max-w-[var(--kol-content-shell)]"
          style={{ padding: 'var(--kol-pad-section-y) var(--kol-pad-section-x)' }}
        >
          <Outlet />
        </div>
      </main>
    )
  }

  return (
    <ShellLayout
      routes={SHELL_ROUTES}
      basePath="/"
      brand={<ShowcaseBrand />}
      isActive={isShellTabActive(pathname)}
      renderSidebar={({ onNavigate }) => <ShowcaseSidebar onNavigate={onNavigate} />}
      defaultTocContent={<AutoToc />}
      searchItems={searchItems}
      actions={
        <a
          href={REPO}
          className="inline-flex h-9 w-9 items-center justify-center rounded text-fg-64 transition-colors hover:bg-fg-08 hover:text-emphasis"
          aria-label="GitHub"
        >
          <Icon name="social-github" size={HEADER_ICON} />
        </a>
      }
    />
  )
}
