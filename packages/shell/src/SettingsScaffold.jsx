import { useState } from 'react'
import { ContentFilters, IconFrame } from '@kolkrabbi/kol-component'
import PageShell from './PageShell.jsx'
import { PageHeader } from '@kolkrabbi/kol-component'

/**
 * SettingsScaffold — the settings-page idiom both shells re-implemented inline:
 * fixed PageShell, a PageHeader masthead, one header row, then a scrolling body.
 * Content is consumer-authored via `renderContent` — sections/rows are content,
 * not markup.
 *
 * THE HEADER ROW IS `ContentFilters`, THE ACTUAL ORGANISM (user ruling
 * 2026-08-30, taken from kol-fxr's approved `/settings`). It was a local
 * TabStrip + Divider, which made this a THIRD header shape in the estate beside
 * PageHeader and ContentFilters — on the one page type every app has. fxr hand-
 * wrote a lookalike to the organism's grammar and it drifted inside the hour:
 * the organism's search is `size="md" iconSize={16} fieldHeight={28}`, and a
 * copy passing none of those renders a different pill in the same row one page
 * over. The user caught it as *"2 different content filters in settings and
 * effexor home why"*.
 *
 * A row that looks like ContentFilters must BE ContentFilters.
 *
 * What that buys over the tab strip it replaces: search across the settings rows
 * (`searchKeys` — a row's own label matches, so `loop`, `aspect`, `undo` all
 * land), filter groups, the view strip, and `trailingActions` for a page's own
 * controls. A TabStrip could carry none of it.
 *
 * Body building blocks live in **kol-component**, not here:
 * `LabeledControlSection` (the eyebrow-headed section) and `SettingsRow` (the
 * 160px label column). This file used to export its own `SettingsSection` +
 * `LabelRow` — a second implementation of that pair, and the DS does not ship
 * two of one thing (user ruling 2026-08-30: "dont ship duplicate components").
 * Both retired to `_tmp/2026-08-30-shell-settings-duplicates/`.
 *
 * The DRAWER is the page's other half and is also kol-component's:
 * `SettingsPanel` (ShellDrawer underneath — scrim, Escape, focus trap, scroll
 * lock). Render page and drawer from ONE definition; that is what stops the two
 * surfaces drifting. Put its opener in `header.actions`.
 *
 * Shortcuts single-source: both repos hand-maintained the shortcut list twice
 * (settings + overlay) and both pairs drifted. Feed ONE array to both your
 * `ShortcutsOverlay` and `SettingsShortcuts`.
 *
 * @param {Array}     props.tabs            `[{ value, label, title, subtitle, row }]` — title/subtitle feed the masthead, label the strip. `row: 'layout'` puts an entry on the SECOND row (fxr's ABOUT / REPO); default is the view strip
 * @param {string}    props.defaultTab
 * @param {Function}  props.renderContent   `(tabValue, filteredItems) => node` — the scrolling body
 * @param {Object}    props.header          PageHeader props spread onto the masthead (`voice`, `size`, `titleClass`, `eyebrow`, `actions`)
 * @param {string}    props.title           the filter row's own title (default `Preferences`)
 * @param {Array}     props.items           rows to search/filter over; omit and the row is chrome only
 * @param {Array}     props.filterGroups    ContentFilters groups
 * @param {Array}     props.searchKeys      which keys `items` are searched on
 * @param {ReactNode|Function} props.trailingActions the page's own controls, right of the row.
 *                                  A FUNCTION receives `(tab, setTab)` — for a control that has to
 *                                  move the page, e.g. an icon pair that jumps back to Settings
 * @param {string}    props.tone            forwarded to ContentFilters (`sunken` is fxr's approved page)
 * @param {ReactNode} props.picker         the app's own picker for the masthead cluster —
 *                                          fxr opens a chrome, kol-r2b2 a bucket. Optional
 * @param {ReactNode} props.themeToggle     the app's ThemeToggle node. A NODE, not rendered
 *                                          here, because it lives in kol-framework and shell
 *                                          dropped that peer in 0.16.0
 * @param {Function}  props.onOpenSettings  the gear's handler — opens the app's settings
 *                                          drawer. The scaffold draws the control
 * @param {Object}    props.filtersProps    escape hatch — anything else the organism takes
 */
export default function SettingsScaffold({
  tabs = [],
  defaultTab,
  renderContent,
  header,
  title = 'Preferences',
  items,
  filterGroups,
  searchKeys,
  trailingActions,
  tone = 'sunken',
  picker,
  themeToggle,
  onOpenSettings,
  filtersProps,
}) {
  const [tab, setTab] = useState(defaultTab ?? tabs[0]?.value)
  const active = tabs.find((t) => t.value === tab)

  /* ONE PAGE SELECTOR DRAWN ACROSS TWO ROWS (SettingsScaffoldTabRows, kol-fxr
   * 2026-08-30). fxr's SETTINGS above the rule and ABOUT / REPO below it are not
   * two selectors — they are one set of destinations, split because the user
   * ruled the side pages down to the smaller row. `row: 'layout'` says which.
   *
   * Both strips read and write the SAME `tab`, which is the whole point: before
   * this, a page wanting both rows had to hand ContentFilters its own state
   * through `filtersProps` and the scaffold's `tab` went dead — so
   * `renderContent`'s first argument was a lie, and the masthead only got the
   * right title because `header` happens to spread after it. */
  const viewTabs = tabs.filter((t) => t.row !== 'layout')
  const layoutTabs = tabs.filter((t) => t.row === 'layout')

  /* THE MASTHEAD CLUSTER — picker · theme toggle · gear, in that order, on the
   * subtitle's baseline (user ruling 2026-08-30, off kol-fxr's approved page;
   * kol-r2b2's row 1 is the same shape). It was a raw `header.actions` slot, so
   * fxr and r2b2 each hand-built it and kol-mirror and kol-monitor passed
   * NOTHING — which is the whole of why the three settings pages did not match.
   * Order, gap and tone are the scaffold's now; only the picker's contents are
   * the app's.
   *
   * `themeToggle` is a NODE rather than drawn here: it lives in kol-framework,
   * and shell dropped that peer in 0.16.0. The gear is `IconFrame`, which is a
   * peer, so the DS rules its glyph, tone and size.
   *
   * Pass none of the three and no cluster renders — mirror and monitor are
   * untouched until they opt in. An explicit `header.actions` still wins. */
  const cluster = picker || themeToggle || onOpenSettings ? (
    <div className="flex items-center gap-2">
      {picker}
      {themeToggle}
      {onOpenSettings && (
        <IconFrame
          name="settings-01"
          variant="primary"
          tone={tone}
          size="sm"
          onClick={onOpenSettings}
          title="Display settings"
          aria-label="Display settings"
        />
      )}
    </div>
  ) : null

  return (
    <PageShell mode="fixed">
      {/* `header` is spread onto the PageHeader (PageHeaderMonoTitle addendum,
        * kol-fxr 2026-08-27): a consumer could not reach this title at all —
        * `voice="mono"`, `size`, `titleClass`, `eyebrow` all pass through.
        * `actions` is where the drawer opener goes. */}
      <PageHeader
        title={active?.title}
        subtitle={active?.subtitle}
        actions={cluster}
        {...header}
      />
      <ContentFilters
        tone={tone}
        title={title}
        items={items ?? []}
        totalCount={items?.length ?? 0}
        filterGroups={filterGroups}
        searchKeys={searchKeys}
        /* A NODE cannot reach the tab it sits beside. fxr's OPTIONS /
         * SHORTCUTS pair stays visible on About and Repo (user 2026-08-28 — the
         * row is the page's furniture, and hiding it made the header jump a
         * line on every leave), and picking either one must return you to
         * Settings. Owning `tab` here took that away: the pair changed the
         * settings view while you sat on About and you had to click SETTINGS
         * yourself (SettingsScaffoldTabFromTrailing, 2026-08-30).
         *
         * A render prop, not a controlled `tab`/`onTabChange` pair: the
         * controlled shape hands page state back to the consumer, which is
         * precisely what 0.23.0 removed. This hands out a setter and leaves the
         * state where the last ticket put it. A plain node still works. */
        trailingActions={typeof trailingActions === 'function' ? trailingActions(tab, setTab) : trailingActions}
        /* THE TABS ARE THE VIEW STRIP — the same row fxr's SETTINGS and the home
         * page's RECENT / SAVED run on, not a strip of our own. That is the
         * whole point: one row grammar, not a settings dialect of it. */
        viewModeOptions={viewTabs.length ? viewTabs : undefined}
        viewMode={tab}
        onViewModeChange={setTab}
        /* a strip whose options do not contain the active tab simply shows
         * nothing lit — which is correct: on ABOUT, the SETTINGS strip has no
         * selection to draw. */
        layoutOptions={layoutTabs.length ? layoutTabs : undefined}
        layout={tab}
        onLayoutChange={setTab}
        renderItem={(filtered) => (
          <div style={{ flex: 1, overflow: 'auto', paddingTop: 4, paddingBottom: 4 }}>
            {renderContent?.(tab, filtered)}
          </div>
        )}
        {...filtersProps}
      />
    </PageShell>
  )
}
