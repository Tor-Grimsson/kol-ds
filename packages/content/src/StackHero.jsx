import { FullBleedHero } from '@kolkrabbi/kol-component'
import { Image } from '@kolkrabbi/kol-component'

/** Per-variant spacing presets — the only delta between StackHero and the
 *  folded-in StackHeroTall (taller viewport + deeper bottom padding). */
const VARIANTS = {
  default: { height: 'min-h-[80vh]', padBottom: 'pb-12' },
  tall: { height: 'min-h-[90vh]', padBottom: 'pb-32 sm:pb-40 lg:pb-48' },
}

/**
 * StackHero — full-bleed image hero with a bottom-anchored, centered title +
 * description under a bottom-up scrim. Built ON the DS FullBleedHero: the
 * background Image plus a tokenized gradient scrim are handed in as the hero's
 * media node, and the copy rides in the content slot pinned to the bottom.
 * `StackHeroTall` is folded in as `variant="tall"` — a spacing preset, not a
 * second file.
 *
 * De-branded: no CDN `src`/`srcSet` defaults, no brand-copy title/description
 * defaults, no dead `aspectRatio` prop. The scrim reads `--kol-surface-primary`
 * (theme-aware) instead of the hardcoded dark hex, and `objectFit`/
 * `objectPosition` are inline styles (no JIT-invisible dynamic class). The app
 * `reveal` entrance utility is dropped. Title/description authored as-is.
 *
 * @param {string} title           heading text
 * @param {string} description     sub text
 * @param {string} src             background image src
 * @param {string} srcSet          responsive srcSet
 * @param {string} sizes           `sizes` attribute (default '100vw')
 * @param {string} alt             alt text
 * @param {string} objectFit       CSS object-fit for the image (default 'cover')
 * @param {string} objectPosition  CSS object-position for the image (default 'center')
 * @param {'default'|'tall'} variant  spacing preset (default 'default')
 * @param {string} className       extra classes on the hero section
 */
export default function StackHero({
  title,
  description,
  src,
  srcSet,
  sizes = '100vw',
  alt = '',
  objectFit = 'cover',
  objectPosition = 'center',
  variant = 'default',
  className = '',
}) {
  const { height, padBottom } = VARIANTS[variant] ?? VARIANTS.default

  const media = (
    <>
      <Image
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading="eager"
        className="kol-full-bleed-hero-media"
        style={{ objectFit, objectPosition }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, var(--kol-surface-primary) 0%, transparent 100%)' }}
      />
    </>
  )

  return (
    <FullBleedHero
      media={media}
      height={height}
      align="center"
      className={className}
      panel={
        <div className={`self-end w-full max-w-[520px] lg:max-w-[30%] text-center mx-auto lg:mx-0 flex flex-col gap-1 ${padBottom}`}>
          <h1 className="kol-prose-display text-center">{title}</h1>
          <p className="kol-mono-14 text-center text-fg-80">{description}</p>
        </div>
      }
    />
  )
}
