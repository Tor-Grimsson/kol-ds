import { IconLoader } from '@kolkrabbi/kol-icons'

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
 * row to fg-16 with the emphasis ink (the selection rule — translucent, so glass shows through); `open` is the parent
 * of the active row: the emphasis ink, no lift. `count` sits right in mono (`kol-float-ruler`, fg-64). A row with
 * `expanded` defined draws the chevron at its end — right when shut, down when open — and `onToggle` is its press.
 *
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

export default function TreeRow({ size = 'sm', icon, label, count, active = false, open = false, expanded, onToggle, depth = 0, href, onClick, trailing, className = '', ...rest }) {
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
      className={`group flex w-full ${S.h} shrink-0 items-center gap-2.5 rounded-[var(--kol-float-list-r)] pr-2.5 text-left no-underline cursor-pointer focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)] ${active ? 'bg-fg-16' : 'hover:bg-fg-08'} ${className}`.trim()}
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
