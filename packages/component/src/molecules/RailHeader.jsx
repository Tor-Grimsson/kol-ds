import Header from './Header.jsx'

/* taxonomy-ok: molecule — the rail kit's title line; `variant="float"` is Header variant="property" */

/**
 * RailHeader — the rail kit's title line (RailKit 2026-10-24): title (helper-14 uppercase), a subtitle, the header's
 * actions before the × (which Rail draws). The node Rail's `header` slot takes it; SettingsPanel wears it.
 *
 * `variant="float"` is `Header variant="property"` (plan-2026-11-12-one-header W1.1) — deprecated under this name, on the
 * retirement ledger: `actions` → `end`, `collapsedV` / `onCollapseV` (the old `folded` / `onFold` still accepted).
 * The default line stays here: it is not one of Header's four variants.
 *
 * `variant="kolbox"` (W31.2 batch 5): kolbox's rail header, with `leading` and `size` md · sm (below).
 *
 * @param {'default'|'float'|'kolbox'} [variant='default']
 * @param {ReactNode} [title] · {ReactNode} [subtitle] · {ReactNode} [actions] · {string} [className]
 */
export default function RailHeader({ variant = 'default', title, subtitle, actions, leading, size = 'md', collapsedV, onCollapseV, folded, onFold, className = '' }) {
  /* kolbox (plan-2026-11-18-kolbox-system W31.2 batch 5, 2026-11-18): kolbox's RailHeader, carried from
   * apps/kolbox/src/ui/RailHeader.jsx: a `leading` slot, the title, the `subtitle` as a quiet meta line at the right,
   * the actions; inset 16. `size` md the plain header (48 high), sm the document header (the file's RailHeader 61:11315:
   * 65 high as Figma's, the title on the document voice 13 / 22; below). */
  if (variant === 'kolbox') {
    const sm = size === 'sm'
    return (
      <div className={`kol-rail-header--kolbox flex items-center ${sm ? 'items-start! gap-2 pt-[13px] pb-[9px] pr-2 pl-4' : 'h-12 gap-2 px-4'} ${className}`.trim()} data-rail-header>
        {leading}
        {sm ? (
          /* sm, the document header: the subtitle is a quiet line UNDER the title, as his reference draws it (2026-11-19);
             the header grows by that line only when there is one. As Figma's file header measures (plan-2026-11-23-editor-
             measured-against-figma W3): 240 x 65, the title row 22 at 13 down, 5 to the line, the line 16, 9 under it; 16
             left, 8 right, the actions 8 down */
          <span className="flex! h-auto! min-w-0 flex-1 flex-col">
            <span className="kol-rail-header-title--sm flex h-[22px] min-w-0 items-center">{title}</span>
            {subtitle && <span className="kol-rail-header-sub truncate">{subtitle}</span>}
          </span>
        ) : (
          <>
            <span className="kol-rail-header-title--md min-w-0 truncate">{title}</span>
            <span className="kol-rail-header-meta min-w-0 flex-1 truncate text-right">{subtitle}</span>
          </>
        )}
        {actions && <span className={`flex shrink-0 items-center ${sm ? '-mt-[5px]' : '-mr-1'}`}>{actions}</span>}
      </div>
    )
  }
  if (variant !== 'float') {
    return (
      <div className={`flex min-w-0 items-center gap-2 ${className}`.trim()}>
        <div className="flex min-w-0 flex-1 flex-col">
          {title && <span className="kol-helper-14 uppercase text-emphasis">{title}</span>}
          {subtitle && <span className="kol-mono-12 text-meta">{subtitle}</span>}
        </div>
        {actions}
      </div>
    )
  }
  return <Header variant="property" title={title} end={actions} collapsedV={collapsedV ?? folded ?? false} onCollapseV={onCollapseV ?? onFold} className={className} />
}
