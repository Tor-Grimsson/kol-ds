import { IconLoader } from '@kolkrabbi/kol-icons'
import KolboxGlyph from '../utilities/kolboxGlyph.jsx'

/* taxonomy-ok: molecule — nests kol-icons's Icon. */

/**
 * TreeRow — One row of a float tree: glyph · name · count · chevron. (float-everything W8 rows 120 · 122 · 123,
 * 2026-11-04 — kol-float--style 48:3564 tree row, 48:3606 nav item, 48:3904 flyout row.) The navigation rows of the
 * float are one row at four sizes, so the sidebar, its flyout and the drawer read as one list:
 *
 *   xs  26 · glyph 14 · `kol-float-label` (11)  — a drawer's child row
 *   sm  32 · glyph 15 · `kol-float-hint` (12)   — a tree's row, the sidebar's child row
 *   md  34 · glyph 16 · `kol-float-hint` (12)   — a flyout's destination (`FlyoutRow`)
 *   lg  40 · glyph 18 · Inter 13               — the sidebar's nav item
 *
 * On the list radius (`--kol-float-list-r`), 10 in. At rest the name is fg-64 and the glyph oq-64; `active` lifts the
 * row to fg-12 with the emphasis ink (hover fg-04 — his LayerStack board pick C, 2026-11-12) (the selection rule — translucent, so glass shows through); `open` is the parent
 * of the active row: the emphasis ink, no lift. `count` sits right in mono (`kol-float-ruler`, fg-64). A row with
 * `expanded` defined draws the chevron at its end — right when shut, down when open — and `onToggle` is its press.
 *
 * `variant="kolbox"` (W31.2 batch 5): kolbox's ListRow, below.
 *
 * `variant="folio"` (Folio migration batch D): Folio's library tree rows, below; `linkComponent` is its router seam.
 *
 * @param {'default'|'kolbox'|'folio'} [variant]
 * @param {'xs'|'sm'|'md'|'lg'} [size='sm']
 * @param {string}    [icon]
 * @param {ReactNode} label
 * @param {ReactNode} [count]
 * @param {boolean}   [active]
 * @param {boolean}   [open]      the active row's parent — bright, not lifted
 * @param {boolean}   [expanded]  defined → the chevron; true = down
 * @param {Function}  [onToggle]  the chevron's press (else the row's own)
 * @param {number}    [depth=0]   indent, 16 per level
 * @param {string}    [href]      renders an anchor
 * @param {Function}  [onClick]
 * @param {ReactNode} [trailing]  controls at the end (LayerRow's eye and lock)
 * @param {string}    [className]
 */
export const TREE_ROW = {
  xs: { h: 'h-[26px]', ic: 14, type: 'kol-float-label' },
  sm: { h: 'h-8', ic: 15, type: 'kol-float-hint' },
  md: { h: 'h-[34px]', ic: 16, type: 'kol-float-hint' },
  lg: { h: 'h-10', ic: 18, type: 'font-[family-name:var(--kol-font-family-float)] text-[13px] leading-[18px]' },
}

function TreeRowDefault({ size = 'sm', icon, label, count, active = false, open = false, expanded, onToggle, depth = 0, href, onClick, trailing, className = '', ...rest }) {
  const S = TREE_ROW[size] ?? TREE_ROW.sm
  const bright = active || open
  const Tag = href ? 'a' : 'button'
  const toggle = expanded !== undefined && (
    <span
      role={onToggle ? 'button' : undefined}
      aria-label={onToggle ? (expanded ? 'Collapse' : 'Expand') : undefined}
      onClick={onToggle ? (e) => { e.preventDefault(); e.stopPropagation(); onToggle() } : undefined}
      className="inline-flex shrink-0 text-oq-64"
    >
      <IconLoader name={expanded ? 'chevron-down' : 'chevron-right'} size={12} />
    </span>
  )
  return (
    <Tag
      {...(href ? { href } : { type: 'button' })}
      onClick={onClick ?? (expanded !== undefined && !href ? onToggle : undefined)}
      aria-current={active ? 'page' : undefined}
      aria-expanded={expanded}
      className={`group flex w-full ${S.h} shrink-0 items-center gap-2.5 rounded-[var(--kol-float-list-r)] pr-2.5 text-left no-underline cursor-pointer focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)] ${active ? 'bg-fg-12' : 'hover:bg-fg-04'} ${className}`.trim()}
      style={{ paddingLeft: 10 + depth * 16 }}
      {...rest}
    >
      {icon && <IconLoader name={icon} size={S.ic} className={`shrink-0 ${bright ? 'text-oq-96' : 'text-oq-64 group-hover:text-oq-96'}`} />}
      <span className={`${S.type} min-w-0 flex-1 truncate ${bright ? 'text-fg-emphasis' : 'text-fg-64 group-hover:text-fg-emphasis'}`}>{label}</span>
      {count != null && <span className="kol-float-ruler shrink-0 tabular-nums text-fg-64">{count}</span>}
      {trailing}
      {toggle}
    </Tag>
  )
}

/* `variant="kolbox"` (plan-2026-11-18-kolbox-system W31.2 batch 5, 2026-11-18): kolbox's ListRow (the file's ListRow
 * 27:9332), carried from apps/kolbox/src/ui/ListRow.jsx. Its four rows are `size`: xs 24 (the plain row, 8 in, a 16
 * glyph), sm 28 (HomeRail's row, a 20 glyph, 6 in), md 30 (the Styles rows, 6 in), lg 40 (the search modal's result, a
 * 20 glyph, 12 in). `active` is the field fill and, on xs and sm, the accent label with a 2 by 14 accent bar at the left
 * edge. `tree` is a 32 row (Figma's layer row, W3) with a 36 lead (the 12 chevron at its left, the 16 type glyph at its right), 8 in, and 24 of indent
 * per `depth`; `expanded` turns the chevron, and a row with no children (`expanded` undefined) keeps its place empty.
 * `onToggle` makes the chevron its own target (the row's click still selects). `dimmed`: the lead and label at 40%.
 * Glyphs are your icons by the set's name (KolboxGlyph). Other props land on the row's button. */
const TREE_ROW_KOLBOX = {
  xs: { row: 'h-6 gap-2', bar: 'before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0 before:h-3.5 before:w-0.5 before:rounded-xs', icon: 16, pad: 'var(--kol-spacing-2)' },
  sm: { row: 'relative h-7 gap-2.5', bar: 'before:absolute before:top-1.75 before:left-0 before:h-3.5 before:w-0.5', icon: 18, pad: '6px' },
  lg: { row: 'h-10 gap-3', bar: '', icon: 20, pad: 'var(--kol-spacing-3)' },
  md: { row: 'h-7.5 gap-2', bar: '', icon: 16, pad: '6px' },
}
function TreeRowKolbox({ size = 'xs', icon, label, depth = 0, tree: treeProp = false, expanded, onToggle, active = false, dimmed = false, disabled = false, onClick, trailing, count, href, linkComponent: Link = 'a', className = '', ...rest }) {
  const v = TREE_ROW_KOLBOX[size] ?? TREE_ROW_KOLBOX.xs
  /* Folio on kolbox (2026-11-22): a folder row (`expanded` defined) or a link row (`href`) of a caller that does not say
     `tree` is drawn on the tree lead, so a library tree's shelves and their documents share kolbox's layer tree's column;
     the folder's press is its toggle. `href` makes the row a link through `linkComponent` (a router's Link, given `to`;
     else an anchor). `count` (when the caller does not say `tree`) sits at the right in the meta role. */
  const implied = !treeProp && (expanded !== undefined || href != null)
  const tree = treeProp || implied
  const Tag = href != null ? Link : 'button'
  const own = href != null ? (Link === 'a' ? { href } : { to: href }) : { type: 'button', disabled }
  return (
    <Tag
      {...own}
      aria-current={active || undefined}
      aria-expanded={tree && expanded !== undefined ? expanded : undefined}
      onClick={onClick ?? (implied && expanded !== undefined ? onToggle : undefined)}
      className={`kol-tree-row--kolbox kol-tree-row--kolbox-${size} kol-tree-row--type-${tree ? 'xs' : size}${active ? ` is-active ${v.bar}` : ''} relative flex w-full min-w-0 shrink-0 items-center ${tree ? 'h-8 gap-2' : v.row} pr-2 text-left outline-none focus-visible:outline-solid focus-visible:outline-1 disabled:opacity-40 ${className}`.trim()}
      style={{ paddingLeft: `calc(${tree ? 'var(--kol-spacing-2)' : v.pad} + ${depth} * var(--kol-spacing-6))` }}
      {...rest}
    >
      {tree ? (
        <span className={`relative h-4 w-9 shrink-0 ${dimmed ? 'opacity-40' : ''}`}>
          {expanded !== undefined && (onToggle ? (
            <span
              role="button"
              aria-label={expanded ? 'Collapse' : 'Expand'}
              aria-expanded={expanded}
              onClick={(e) => { e.stopPropagation(); onToggle() }}
              onDoubleClick={(e) => e.stopPropagation()}
              className="kol-tree-row-toggle absolute -top-0.5 -left-1 flex size-5 items-center justify-center"
            >
              <KolboxGlyph name={expanded ? 'chevron-down' : 'chevron-right'} />
            </span>
          ) : <KolboxGlyph name={expanded ? 'chevron-down' : 'chevron-right'} className="absolute top-0.5 left-0" />)}
          {icon && <KolboxGlyph name={icon} className="kol-tree-row-type absolute top-0 right-0" />}
        </span>
      ) : icon && <KolboxGlyph name={icon} size={v.icon} className={size === 'sm' && !active ? 'kol-tree-row-icon--muted' : ''} />}
      <span className={`min-w-0 flex-1 truncate ${dimmed ? 'opacity-40' : ''}`}>{label}</span>
      {!treeProp && count != null && <span className="kol-tree-row-count--kolbox shrink-0 tabular-nums">{count}</span>}
      {trailing}
    </Tag>
  )
}
/* `variant="folio"` (Folio migration batch D, 2026-11-22): the library tree's two rows, carried from apps/folio's
 * EditorChrome.jsx LibraryTree. A row with `expanded` defined is a shelf: 32 high, 8 in, the 12 chevron leading (right
 * when shut, down when open), the label in the ink, `count` at the right in the muted ink, `onToggle` its press. A row
 * without is a document: 6 over and under, 28 in (under the shelf's label), truncated, the muted ink brightening on
 * hover; `active` is the mint fill and the green ink. `href` makes it a link, through `linkComponent` (a router's Link,
 * given `to`; else an anchor, given `href`). Type 11 / 400 (`kol-folio-meta`), in its own rule. Other props land on the
 * row (Folio's `title`, `onContextMenu`). */
function TreeRowFolio({ label, count, expanded, onToggle, active = false, href, linkComponent: Link = 'a', className = '', ...rest }) {
  const { variant: _v, ...own } = rest
  if (expanded !== undefined) return (
    <button type="button" aria-expanded={Boolean(expanded)} onClick={onToggle} className={`kol-tree-row--folio kol-tree-row--folio-shelf flex h-[32px] w-full items-center gap-[8px] rounded-[3px] px-[8px] text-left ${className}`.trim()} {...own}>
      <IconLoader name={expanded ? 'chevron-down' : 'chevron-right'} size={12} />{label}{count != null && <span className="kol-tree-row-count ml-auto">{count}</span>}
    </button>
  )
  const target = Link === 'a' ? { href } : { to: href }
  return <Link {...target} aria-current={active ? 'page' : undefined} className={`kol-tree-row--folio${active ? ' is-active' : ''} block truncate rounded-[3px] py-[6px] pl-[28px] pr-[8px] ${className}`.trim()} {...own}>{label}</Link>
}

export default function TreeRow(props) {
  if (props.variant === 'folio') return <TreeRowFolio {...props} />
  return props.variant === 'kolbox' ? <TreeRowKolbox {...props} /> : <TreeRowDefault {...props} />
}
