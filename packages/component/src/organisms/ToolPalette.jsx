import { Icon } from '@kolkrabbi/kol-icons'
import Button from '../atoms/Button.jsx'
import Divider from '../atoms/Divider.jsx'
import SplitToolButton from '../molecules/SplitToolButton.jsx'

/**
 * ToolPalette — the editor's tool bar as one row (kol-fxr `shell/panels/ToolPalette.jsx`,
 * editor-panels-the-held-specs A3, 2026-09-25). Four kinds of cell, all on one pinned-square rung:
 *
 * - `tool` — arms a mode; lit while `activeId` is its id
 * - `action` — a one-shot operation (flip, rotate, duplicate)
 * - `split` — a fold of variants: `SplitToolButton`. A fold of TOOLS arms (Shape); a fold with
 *   `action: true` runs its variants instead, the trigger re-running the last-picked one
 *   (Boolean); a variant with `action: true` inside a tool fold is a one-shot row (Text →
 *   Kinetic type)
 * - `divider` — a hairline between groups
 *
 * The store is the consumer's (the source read `useTool` + `useComposeState` directly): what
 * is armed, what each action does and **when an item is disabled** — needs a selection, needs
 * two booleanable layers — all arrive in `items` and are never inferred here.
 *
 * `min-w-0 overflow-x-auto`: at a narrow width the row scrolls in its own box instead of
 * painting over the rail beside it, as the source learned.
 *
 * @param {Object} props
 * @param {Array<{kind: 'tool'|'action'|'split'|'divider', id?: string, icon?: string, label?: string, shortcut?: string, disabled?: boolean, action?: boolean, variants?: Array<{id: string, label: string, icon: string, shortcut?: string, action?: boolean}>}>} props.items - The row, left to right
 * @param {string} props.activeId - The armed tool's id — a `tool` item's, or any variant's of a tool fold
 * @param {Function} props.onSelect - (id) => void — a tool (or a tool variant) was armed
 * @param {Function} props.onAction - (id) => void — an action (or an action variant) was run
 * @param {'xs'|'sm'|'md'|'lg'} props.size - The rung — 22 · 26 · 32 · 40 (default: 'md', the source's 32)
 * @param {ElementType} props.iconComponent - Glyph renderer receiving `{ name, size, className, style }` (default: DS `Icon`)
 * @param {string} props.className - Additional classes on the row
 */
const blur = (e) => e.currentTarget.blur()

const ToolPalette = ({
  items = [],
  activeId,
  onSelect,
  onAction,
  size = 'md',
  iconComponent = Icon,
  className = '',
}) => (
  <div className={`flex items-center gap-1 min-w-0 overflow-x-auto ${className}`.trim()}>
    {items.map((it, i) => {
      if (it.kind === 'divider') return <Divider key={`d${i}`} variant="vertical" height={20} className="mx-1.5 shrink-0" />
      const tip = it.shortcut ? `${it.label} (${it.shortcut})` : it.label
      if (it.kind === 'split') {
        const variants = (it.variants ?? []).map((v) => (v.action && !it.action ? { ...v, onSelect: () => onAction?.(v.id) } : v))
        const run = (id) => (it.action ? onAction : onSelect)?.(id)
        return (
          <SplitToolButton key={it.id} variants={variants} value={activeId} size={size} iconComponent={iconComponent}
            active={!it.action && variants.some((v) => v.id === activeId && !v.action)}
            onChange={run} onTrigger={it.action ? run : undefined}
            disabled={it.disabled} blurOnClick aria-label={it.label} />
        )
      }
      const isTool = it.kind === 'tool'
      return (
        <Button key={it.id} variant="ghost" size={size} quiet iconOnly={it.icon} iconComponent={iconComponent}
          pressed={isTool ? activeId === it.id : undefined} disabled={it.disabled}
          aria-label={it.label} title={tip}
          onClick={(e) => { (isTool ? onSelect : onAction)?.(it.id); blur(e) }} />
      )
    })}
  </div>
)

export default ToolPalette
