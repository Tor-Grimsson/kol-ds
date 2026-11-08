import { IconLoader } from '@kolkrabbi/kol-icons'

/**
 * SectionLabel — A section's name with its arrow.
 *
 * `variant="float"` (float-everything W5 row 68, 2026-11-04 — kol-float--style 46:1976): a rail section's header on the
 * float — the name in `kol-float-label` on fg-64, rendered as authored (`APPEARANCE`), and, when `onAdd` is given, a +
 * at the far end (14, oq-64, bright under the pointer) that adds an item to the section. No arrow, no rule.
 *
 * @param {ReactNode} text
 * @param {'sm'|'md'|'lg'} [size='md']  the default look's size
 * @param {'float'} [variant]
 * @param {Function} [onAdd]      float: the + control
 * @param {string}   [addLabel]   float: the +'s accessible name (default `Add`)
 * @param {string}   [className]
 */
export default function SectionLabel({
  text,
  size = 'md',
  variant,
  onAdd,
  addLabel = 'Add',
  className = ''
}) {
  if (variant === 'float') {
    return (
      <div className={`flex h-4 w-full items-center justify-between gap-2 ${className}`.trim()}>
        <span className="kol-float-label truncate text-fg-64">{text}</span>
        {onAdd && (
          <button type="button" aria-label={addLabel} onClick={onAdd} className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-oq-64 hover:text-oq-96 focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)] cursor-pointer">
            <IconLoader name="plus" size={14} />
          </button>
        )}
      </div>
    )
  }
  // Size variants: sm (16px), md (20px), lg (32px).
  // Migrated off the deleted legacy kol-label-* family (2026-07-15): current
  // helper/heading classes, no text-transform — labels render as authored.
  // (lg's old 'kol-heading-md' was a ghost class defined nowhere — rendered
  // 16px default; kol-sans-heading-03 is the real 32px scale.)
  const sizeConfig = {
    sm: {
      height: 'h-4',
      iconSize: 16,
      textClass: 'kol-helper-14'
    },
    md: {
      height: 'h-5',
      iconSize: 24,
      textClass: 'kol-helper-20'
    },
    lg: {
      height: 'h-8',
      iconSize: 40,
      textClass: 'kol-sans-heading-03'
    }
  }

  const config = sizeConfig[size] || sizeConfig.md

  return (
    <div className={`section-label-wrapper flex flex-row items-center gap-1 overflow-visible ${config.height} ${className}`}>
      <p className={`${config.textClass} text-auto`}>{text}</p>
      <span
        className="icon-swap-container"
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${config.iconSize}px`,
          height: `${config.iconSize}px`,
          overflow: 'hidden'
        }}
      >
        <IconLoader
          name="arrow-downright"
          size={config.iconSize}
          className="icon-default"
          style={{ position: 'absolute' }}
        />
        <IconLoader
          name="arrow-downright"
          size={config.iconSize}
          className="icon-hover"
          style={{ position: 'absolute' }}
        />
      </span>
    </div>
  )
}
