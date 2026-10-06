import { useState } from 'react'
import { getTagColor } from '@kolkrabbi/kol-markdown'
import { useLocation } from 'react-router-dom'
import RailSection from './RailSection.jsx'
import RailRow from './RailRow.jsx'

const hueOf = (tag) => { const c = getTagColor(tag); return c === 'dark' ? undefined : `var(--kol-palette-${c})` }

/**
 * RightRail — THE right rail. One component, every route.
 *
 * WHY IT EXISTS (user ruling 2026-08-01). The rail was TWO components:
 * `AutoToc` in the showcase's ShellChrome served every non-vault page, and
 * `DocReaderSidebar` in DocumentationReader overrode it through
 * ShellTocContext on a vault route. They disagreed about which sections exist —
 * one had Top tags and no Related, the other had Related and tag chips and no
 * Top tags — so sections appeared and vanished as you moved, and an edit to one
 * rail was invisible in the other. That is the same two-systems fault the rail
 * LADDER (RailSection) and the rail ROW (RailRow) were each built to end, one
 * level further out.
 *
 * THE SECTION SET IS FIXED — *"these are not conditional, they should be
 * STANDARDISED"*. Every section renders on every route. A section with nothing
 * in it renders with `(0)` and an empty body; it does not disappear, because a
 * rail whose shape depends on its content teaches the reader nothing.
 *
 *   THIS PAGE  ── Contents        the headings of the open document
 *   LINKS      ── Quick actions   what you can do from here
 *              ── Tags            THIS page's tags first and brighter, then
 *                                 the rest of the system underneath
 *              ── Related         other documents this one names, and its
 *                                 sources
 *
 * `LINKS`, after one turn as `TOOLS` (2026-08-01). The left rail already has a
 * `TOOLS` category — the routes the app serves — so the same word sat on the
 * same rung in both rails meaning two unrelated things. The right rail's is the
 * one that moved: its contents ARE destinations plus the actions that reach
 * them, and the left rail's TOOLS is a fixed route list that cannot be renamed
 * without lying about what it holds.
 *
 * ONE Tags section, not two. `Tags` and `Top tags` were separate groups saying
 * the same word twice; a reader had to learn which was which. They are one list
 * now, ordered: this page's own tags at the top carrying `emphasis` ink, the
 * system's most-used underneath at the resting stop. Order and ink carry the
 * distinction the two headings used to.
 *
 * THE DIV RULE — *"sometimes you group things sometimes not, there is no rule
 * in the madness"*. There is one now, and it is applied without exception:
 *
 *   1. An L1 category ALWAYS wraps its groups in `.shell-rail-stack-inner`.
 *   2. An L2 group ALWAYS wraps its rows in `nav.shell-nav-items`.
 *   3. Nothing else wraps anything. No bare children at a rung, no conditional
 *      wrapper, no `<div>` added because one section happened to need spacing.
 *
 * Spacing therefore comes from exactly two classes, both theme-owned, and a
 * section cannot acquire its own geometry by accident.
 *
 * @param {Array}    toc          [{ id, label, sub }] — headings of the open doc
 * @param {string}   [activeId]   the heading currently in view (the caller owns
 *                                the scroll spy; both rails must agree on it)
 * @param {Array}    related      [{ id, href, label }] — label is the target's
 *                                own SHORT title, never a wikilink display text
 * @param {Array}    actions      [{ id, label, icon, to?, href?, onClick? }] — `href` for an action that leaves the site
 * @param {Array}    topTags      [{ tag, count }] — the way in, not a dump
 * @param {Array}    tags         [string] — this page's own tags
 * @param {Function} renderTag    (tag) => node — the chip renderer, injected so
 *                                this package does not reach into kol-component
 * @param {Function} onTagClick   (tag) => void
 */
const PINS_KEY = 'kol-rail-pins'
const readPins = () => {
  try { return JSON.parse(localStorage.getItem(PINS_KEY) || '[]') } catch { return [] }
}
const writePins = (pins) => {
  try { localStorage.setItem(PINS_KEY, JSON.stringify(pins)) } catch { /* private mode */ }
}

export default function RightRail({
  toc = [],
  activeId,
  related = [],
  actions = [],
  topTags = [],
  tags = [],
  renderTag,
  onTagClick,
  /* where every tag in use is listed (the showcase's /search/tags) — a row in the Tags section */
  tagsHref,
  icon: IconComponent,
}) {
  /* One collapse map, not a useState per section — a section added later must
   * not need a new hook at the top of this function. */
  const [collapsed, setCollapsed] = useState({})

  /* PINNED (2026-09-30, the names audit: *"add to quicklook or favorites … in the right sidebar
   * … maintain context-important documents during development … accessible until they dont need
   * to be"*). Any page can be pinned from Quick actions; the pins show on every page until
   * unpinned. Kept in this browser (localStorage) — a working set, not shared state. */
  const { pathname } = useLocation()
  const [pins, setPins] = useState(readPins)
  const isPinned = pins.some((p) => p.path === pathname)
  const togglePin = () => {
    const label = document.querySelector('#main h1, main h1, h1')?.textContent?.trim() || pathname
    const next = isPinned ? pins.filter((p) => p.path !== pathname) : [...pins, { path: pathname, label }]
    setPins(next)
    writePins(next)
  }
  /* TAGS ARE THEIR OWN SECTION (the showcase review W15, 2026-09-30 — user: "right sidebar has this
   * page, links, and inside links is tags? feel like maybe tags is its own thing? with tag graph and
   * all that"). The tag graph is a TAG view, so the caller's `graph` action moves out of Quick actions
   * and leads the Tags section; every caller already passes it under that id. */
  const graphAction = actions.find((a) => a.id === 'graph')
  const allActions = [
    ...actions.filter((a) => a.id !== 'graph'),
    { id: 'pin', label: isPinned ? 'Unpin' : 'Pin', icon: IconComponent ? <IconComponent name="pushpin" size={14} /> : null, onClick: togglePin },
  ]
  const tagViews = [
    ...(graphAction ? [graphAction] : []),
    ...(tagsHref ? [{ id: 'all-tags', label: 'All tags', to: tagsHref, icon: IconComponent ? <IconComponent name="hash-02" size={14} /> : null }] : []),
  ]
  const toggle = (key) => setCollapsed((c) => ({ ...c, [key]: !c[key] }))

  /* OWN TAGS ONLY, GROUPED BY NAMESPACE (2026-09-30, the names audit — ruled on the
   * recommendation). The rail used to follow a page's own tags with the space's top tags, so a
   * page with none (/docs/menus) still listed ten, none of them its own. The system's most-used
   * tags are a way IN, and belong on a home and the search page; `topTags` is accepted and
   * ignored so no consumer breaks. The namespace law stays in the data — the rail prints it once
   * as a group label and the leaf under it, instead of truncating the full path on every row. */
  const byNamespace = tags.reduce((m, tag) => {
    const [ns, ...rest] = String(tag).split('/')
    const leaf = rest.join('/') || ns
    ;(m[rest.length ? ns : ''] ||= []).push({ tag, leaf })
    return m
  }, {})
  void topTags
  void renderTag

  /* Every group is described here rather than spelled out in JSX below, so a
   * section cannot be present in one branch and missing in another — the exact
   * defect that split the two rails. */
  /* A chapter with nothing in it does not render (2026-09-30 — `Related (0)`). */
  const group = (key, label, count, children) => count === 0 ? null : (
    <RailSection
      level={2}
      label={label}
      count={count}
      collapsed={!!collapsed[key]}
      onToggle={() => toggle(key)}
      icon={IconComponent}
    >
      <nav className="shell-nav-items">{children}</nav>
    </RailSection>
  )

  return (
    <div className="shell-rail-stack">
      {/* A folded category shows its count, the same as the left rail (2026-09-30) */}
      <RailSection level={1} label="This page" count={toc.length}>
        <div className="shell-rail-stack-inner">
          {group('toc', 'Contents', toc.length,
            toc.map((h) => (
              <RailRow key={h.id} href={`#${h.id}`} active={h.id === activeId} sub={h.sub}>
                {h.label}
              </RailRow>
            ))
          )}
        </div>
      </RailSection>

      <RailSection level={1} label="Links" count={pins.length + allActions.length + related.length}>
        <div className="shell-rail-stack-inner">
          {group('pinned', 'Pinned', pins.length,
            pins.map((p) => (
              <RailRow key={p.path} to={p.path} icon={IconComponent ? <IconComponent name="pushpin" size={14} /> : null}>
                {p.label}
              </RailRow>
            ))
          )}

          {group('actions', 'Quick actions', allActions.length,
            allActions.map((a) => (
              <RailRow key={a.id} to={a.to} href={a.href} onClick={a.onClick} icon={a.icon}>
                {a.label}
              </RailRow>
            ))
          )}

          {/* Related carries SOURCES too (user ruling 2026-08-01) — a repo URL
            * or an external reference is another document this one names, and
            * splitting them made two sections that answer the same question. */}
          {group('related', 'Related', related.length,
            related.map((r) => (
              <RailRow key={r.id} to={r.href} href={r.url}>{r.label}</RailRow>
            ))
          )}
        </div>
      </RailSection>

      {/* TAGS — the views of the tag system, then this page's tags, a group per namespace */}
      {(tagViews.length > 0 || tags.length > 0) && (
        <RailSection level={1} label="Tags" count={tags.length}>
          <div className="shell-rail-stack-inner">
            {tagViews.length > 0 && (
              <nav className="shell-nav-items">
                {tagViews.map((a) => (
                  <RailRow key={a.id} to={a.to} href={a.href} onClick={a.onClick} icon={a.icon}>{a.label}</RailRow>
                ))}
              </nav>
            )}
            {Object.entries(byNamespace).map(([ns, list]) => <div key={`tags-${ns || 'flat'}`}>{group(`tags-${ns || 'flat'}`, ns ? ns.charAt(0).toUpperCase() + ns.slice(1) : 'Tags', list.length,
              list.map(({ tag, leaf }) => (
                <RailRow
                  key={`own-${tag}`}
                  onClick={() => onTagClick?.(tag)}
                  /* the hash wears the tag's namespace color (W17), the same hue its chip and graph node wear */
                  icon={IconComponent ? <span className="inline-flex" style={{ color: hueOf(tag) }}><IconComponent name="hash-02" size={14} /></span> : null}
                >
                  {leaf}
                </RailRow>
              ))
            )}</div>)}
          </div>
        </RailSection>
      )}
    </div>
  )
}
