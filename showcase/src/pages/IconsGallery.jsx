import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { IconBrowser } from '@kolkrabbi/kol-styleguide'
import { PageHeader } from '@kolkrabbi/kol-component'
import { DocHeader } from '@kolkrabbi/kol-workshop'
import HomeDoc from '../lib/HomeDoc.jsx'
import { findCategory } from '../nav/icon-categories.js'
import { ICON_SETS, label, byOrder } from '../nav/icon-sets.js'
import ChapterHome from '../lib/ChapterHome.jsx'
import { getCut, getTags } from '@kolkrabbi/kol-icons'

const DEFAULT_SET = 'kol-icon-set-interface'

/* TYPE — Stroke | Solid, the set's own fact (kol-icons ≥0.24.0 `getCut`, IconSetCut
 * 2026-08-27 — user: "TYPE (stroke solid)? then TAGS"). Chip labels are cased here. */
const CUT_LABEL = { stroke: 'Stroke', solid: 'Solid', color: 'Color' }
const TYPES = ['Stroke', 'Solid', 'Color']

/* the browser — filter row, controls, plates — is kol-styleguide's IconBrowser since 2026-10-31 (LayoutGroup: kol-atlas's
 * icon view was a second copy of it); this page keeps the set's routing, home and groups */
/**
 * IconsGallery — THE icons page: `/icons` carries no segment and takes the
 * default set; `/icons/:set` names one.
 *
 * PORTED VERBATIM from kol-website `apps/brand/src/pages/IconsGallery.jsx`
 * (user 2026-08-27: "brand/icons is a much nicer icon display"; made THE
 * page 2026-09-02 when the showcase's own grouped list was retired for
 * hand-rolling chrome the DS ships). Only the imports are adapted — brand's
 * page frame, title hook and keyline component → a plain section and the
 * showcase's icon-controls — plus two deliberate deviations, both in the
 * header cluster: a SET Dropdown (the showcase ships two sets and the picker
 * has to be visible, not only a URL), and brand's stub settings button
 * dropped (an empty onClick is not a control). And one for the phone: the
 * cluster WRAPS and the size Dropdown is `w-24`, not brand's `w-48` — at 390
 * the row measured 364px in a 342px track and scrolled `main` sideways; the
 * values are two or three digits, the width was a wide-header aesthetic.
 * Everything else is class-for-class.
 *
 * The app tier's catalog page, as kol-monitor / kol-mirror / kol-fxr render it
 * (user 2026-08-27): the shell `PageHeader`, `ContentFilters` (title · filter ·
 * search, the gallery's own controls in the header's right slot, LIST / GRID
 * under the divider), `ContentCollection` six across, `ContentCard catalog`
 * with the glyph in the media slot, its name as the title and its group as
 * the detail; the list form is `ContentRow catalog`. The folder groups are
 * filter chips, one at a time — no per-group sections, no dividers.
 *
 * The controls are the one thing the family does not own, and they ride the
 * seam kol-r2b2's FileList uses for its own: ground and guide are icon
 * `ViewToggle`s, size is a `Dropdown`.
 */
export default function IconsGallery() {
  const { set, group } = useParams()
  const meta = ICON_SETS[set ?? DEFAULT_SET]

  /* the URL's last segment is a category first (Round 15), then a group */
  const category = set && group ? findCategory(set, group) : null
  const orderedFolders = useMemo(() => {
    if (!meta) return []
    /* a group's page shows that group only (W3, 2026-09-30); a category's page shows its groups */
    return Object.keys(meta.groups).filter((f) => category ? category.groups.includes(f) : !group || f === group).sort(byOrder)
  }, [meta, group, category])

  /* `group` carries the DISPLAY label so the chips read as the gallery always
   * labelled them ("Add / remove", not "add-remove"). */
  const items = useMemo(
    () => orderedFolders.flatMap((folder) =>
      meta.groups[folder].map((name) => ({ name, group: label(folder), folder, type: CUT_LABEL[getCut(name)] ?? 'Stroke', tags: getTags(name) }))),
    [orderedFolders, meta],
  )

  /* /icons IS THE ICONS HOME (2026-09-30): it rendered the default set a second time */
  if (!set) {
    return <ChapterHome home="icons" title="Sets" noteHeader="Holds" items={Object.entries(ICON_SETS).map(([k, x]) => ({ to: `/icons/${k}`, label: x.title, note: `${Object.keys(x.groups).length} groups · ${Object.values(x.groups).flat().length} icons` }))} />
  }

  if (!meta || (group && !meta.groups[group] && !category)) {
    return (
      <section id="icons-gallery">
        <PageHeader size="sm" voice="mono" title="Unknown set" />
        <p className="kol-mono-12 text-fg-48 mt-6">No icon set named “{set}”{group ? ` with a group “${group}”` : ''}.</p>
      </section>
    )
  }

  return (
    <section id={`icons-${set ?? DEFAULT_SET}`} className="flex flex-col gap-10 pb-24">
      {/* ONE HEADER (W8, 2026-09-30 — user: "icons could and should also fix the layout, its clashing
        * content filters and a specific style setup for entire page"). The page stacked TWO headers —
        * the gallery's own (title, a SET picker, size, a theme toggle) over ContentFilters' (title,
        * filter, search, ground, guide) — and split its controls between them. Now the page's title
        * is its home (a group page: a DocHeader), and every control rides the one filter row. The
        * set picker went: the rail and the Icons home list the sets; the theme toggle went: the
        * shell header has the one. */}
      {group
        ? <DocHeader eyebrow={meta.title} title={category ? category.name : label(group)} lede={category ? `${items.length} icons in ${category.groups.length} groups. Click any icon to copy its name.` : `${items.length} icons in the ${label(group)} group. Click any icon to copy its name.`} />
        : <HomeDoc key={set ?? DEFAULT_SET} id={set ?? DEFAULT_SET} />}

      <IconBrowser
        items={items}
        /* TYPE first — the short group takes the first column; TAGS flows after it */
        filterGroups={[
          { label: 'Type', key: 'type', values: TYPES },
          /* a category's page keeps the Tags chips — its groups */
          ...(group && !category ? [] : [{ label: 'Tags', key: 'group', values: orderedFolders.map(label) }]),
        ]}
      />
    </section>
  )
}
