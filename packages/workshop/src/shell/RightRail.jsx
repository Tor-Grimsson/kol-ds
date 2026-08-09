import { useState } from 'react'
import RailSection from './RailSection.jsx'
import RailRow from './RailRow.jsx'

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
 * @param {Array}    actions      [{ id, label, icon, to?, onClick? }]
 * @param {Array}    topTags      [{ tag, count }] — the way in, not a dump
 * @param {Array}    tags         [string] — this page's own tags
 * @param {Function} renderTag    (tag) => node — the chip renderer, injected so
 *                                this package does not reach into kol-component
 * @param {Function} onTagClick   (tag) => void
 */
export default function RightRail({
  toc = [],
  activeId,
  related = [],
  actions = [],
  topTags = [],
  tags = [],
  renderTag,
  onTagClick,
  icon: IconComponent,
}) {
  /* One collapse map, not a useState per section — a section added later must
   * not need a new hook at the top of this function. */
  const [collapsed, setCollapsed] = useState({})
  const toggle = (key) => setCollapsed((c) => ({ ...c, [key]: !c[key] }))

  /* A tag shown as "this page's" must not repeat below as "the system's". */
  const own = new Set(tags)
  const otherTags = topTags.filter(({ tag }) => !own.has(tag))

  /* Every group is described here rather than spelled out in JSX below, so a
   * section cannot be present in one branch and missing in another — the exact
   * defect that split the two rails. */
  const group = (key, label, count, children) => (
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
      <RailSection level={1} label="This page">
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

      <RailSection level={1} label="Links">
        <div className="shell-rail-stack-inner">
          {group('actions', 'Quick actions', actions.length,
            actions.map((a) => (
              <RailRow key={a.id} to={a.to} onClick={a.onClick} icon={a.icon}>
                {a.label}
              </RailRow>
            ))
          )}

          {/* ONE list, two ranks. This page's tags lead and carry `emphasis`;
            * the system's most-used follow at the resting stop with their
            * count. `otherTags` filters out anything already shown above, so a
            * tag cannot appear twice in one list. */}
          {group('tags', 'Tags', tags.length + otherTags.length, (
            <>
              {tags.map((tag) => (
                <RailRow
                  key={`own-${tag}`}
                  onClick={() => onTagClick?.(tag)}
                  icon={IconComponent ? <IconComponent name="hash-02" size={14} /> : null}
                  className="shell-nav-item--own"
                >
                  {renderTag ? renderTag(tag) : tag}
                </RailRow>
              ))}
              {otherTags.map(({ tag, count }) => (
                <RailRow
                  key={`top-${tag}`}
                  onClick={() => onTagClick?.(tag)}
                  icon={IconComponent ? <IconComponent name="hash-02" size={14} /> : null}
                  trailing={count}
                  className="shell-nav-item--muted"
                >
                  {renderTag ? renderTag(tag) : tag}
                </RailRow>
              ))}
            </>
          ))}

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
    </div>
  )
}
