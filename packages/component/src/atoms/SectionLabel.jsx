import { Icon } from '@kolkrabbi/kol-icons'

export default function SectionLabel({
  text,
  size = 'md',
  className = ''
}) {
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
        <Icon
          name="arrow-downright"
          size={config.iconSize}
          className="icon-default"
          style={{ position: 'absolute' }}
        />
        <Icon
          name="arrow-downright"
          size={config.iconSize}
          className="icon-hover"
          style={{ position: 'absolute' }}
        />
      </span>
    </div>
  )
}
