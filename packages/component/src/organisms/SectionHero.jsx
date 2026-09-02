import { isValidElement } from 'react'
import { FULL_BLEED, bleedClass } from './sectionBleed.js'
import { surfaceClass } from '../utilities/sectionSurface.js'
import HlsVideo from '../atoms/HlsVideo.jsx'
import Image from '../atoms/Image.jsx'
import OverlayGlassPanel from '../utilities/OverlayGlassPanel.jsx'
import AssetPlaceholder from '../utilities/AssetPlaceholder.jsx'
import ContentMedia from '../molecules/ContentMedia.jsx'
import SectionText from '../molecules/SectionText.jsx'
import FeaturedCarousel from './FeaturedCarousel.jsx'
import useSectionTheme from '../hooks/useSectionTheme.js'

/* Height presets (SectionHeroRound2, user ruling 2026-08-26): three tiers in
 * viewport units, each with a phone value the DS picks. `full` sits UNDER a
 * fixed navbar — the bar floats over the media — so consumers drop their
 * pt-14 wrapper. dvh, not vh: a phone's URL bar would otherwise push the
 * hero's foot off screen. `lg` / `md` / `screen` stay as aliases; anything
 * else is passed through as a class string. */
const HEIGHTS = {
  full: 'h-dvh',
  80: 'h-[70svh] md:h-[80vh]',
  60: 'h-[50svh] md:h-[60vh]',
  40: 'h-[35svh] md:h-[40vh]',
  screen: 'h-dvh',
  lg: 'h-[440px] md:h-[640px]',
  md: 'h-[320px] md:h-[440px]',
}

/* The SPLIT variant's presets as LITERALS (SectionHeroSplitHeight, kol-website
 * 2026-08-26). 0.76.0 rewrote HEIGHTS to min-h-* at runtime — a string no
 * source file carries, so Tailwind's scanner never emitted it and every
 * split preset was dead: the Studio hero rendered its text column's 175px.
 * A class Tailwind cannot see is not a class. */
const SPLIT_HEIGHTS = {
  full: 'min-h-dvh',
  80: 'min-h-[70svh] md:min-h-[80vh]',
  60: 'min-h-[50svh] md:min-h-[60vh]',
  40: 'min-h-[35svh] md:min-h-[40vh]',
  screen: 'min-h-dvh',
  lg: 'min-h-dvh',
  md: 'min-h-[50svh] md:min-h-[60vh]',
}

/**
 * Background layer: a media descriptor becomes a cover-fit Image / HlsVideo /
 * inert <video> (`.kol-full-bleed-hero-media` pins it absolute + object-cover
 * — CSS in @kol/theme); a ready ReactNode renders as-is and must position
 * itself (give it that same class).
 */
function MediaLayer({ media }) {
  if (!media) return null
  if (isValidElement(media) || typeof media !== 'object') return media

  const { src, kind = 'image', poster, srcSet, alt = '' } = media

  if (kind === 'video') {
    if (src && !src.endsWith('.m3u8')) {
      return (
        <video
          src={src}
          poster={poster}
          className="kol-full-bleed-hero-media"
          style={{ pointerEvents: 'none' }}
          autoPlay
          loop
          muted
          playsInline
          controls={false}
        />
      )
    }
    return <HlsVideo src={src} poster={poster} className="kol-full-bleed-hero-media" />
  }

  return (
    <Image
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? '100vw' : undefined}
      alt={alt}
      loading="eager"
      className="kol-full-bleed-hero-media"
    />
  )
}

/**
 * SectionHero — the full-bleed media hero: cover-fit background media (image
 * or video) filling a fixed-height section, an optional surface scrim, and
 * the text in a glass panel over it. `FullBleedHero` is this component under
 * its old name (alias kept).
 *
 * TWO WAYS IN, ONE ANATOMY (SectionSet, 2026-08-26). Pass `label` / `headline`
 * / `body` / `actions` and the hero renders them as `SectionText` inside its
 * own `OverlayGlassPanel` — the composed route. Pass `panel` (or children) and
 * the hero renders your node exactly as before — the escape hatch, and what
 * every existing call site does; nothing there moves.
 *
 * TWO VARIANTS (user ask 2026-08-26). `media` (default): the cover-fit hero
 * above. `split`: the whole viewport in two halves — media fills one edge to
 * edge (no media → AssetPlaceholder), the text sits centred in the other, no
 * glass panel, headline UPPERCASE by role (`.kol-section-text-caps`). It is
 * SectionSplit blown up to 100vh/100vw with no padding, no ratio, no cap.
 * `align` picks the media side there ('left' default · 'right'); below `md`
 * the halves stack, media first.
 *
 * ROUND 2 (SectionHeroRound2, kol-website 2026-08-26 — "maintain ONE hero
 * component"): `height` presets `full` · `80` · `60` in viewport units;
 * `justify="end"` pins the content to the foot (StackHero's items-end +
 * pb ramp); `veil` lays the bottom-heavy gradient over the media (the same
 * device as the split's caption veil); `foot` + `overlap` render a node
 * across the fold with the negative margin owned here; `media` as an ARRAY
 * turns the hero into the carousel (FeaturedCarousel is the engine — one
 * glass panel per slide, autoplay, prev/next); and NO media renders the
 * composed text on the surface with no glass panel — the text-only hero.
 *
 * @param {'inverse'|'light'|'dark'} theme  the section's theme scope (SectionThemeInverse, 2026-08-27):
 *   `inverse` = the paired theme of the nearest live one, following the toggle;
 *   `light` / `dark` pinned; omit to inherit. Stamps `data-theme` on the root and
 *   paints its surface — every token inside resolves to the other theme's.
 * @param {'media'|'split'} variant
 * @param {ReactNode|{src, kind, poster, srcSet, alt}|Array} media  background (media) / the half (split) / an ARRAY of slides → carousel
 * @param {number}    overlayOpacity 0–100 surface-primary scrim over the media (default 0)
 * @param {boolean}   veil           bottom-heavy gradient over the media
 * @param {'center'|'end'} justify   content vertically centred, or pinned to the foot (with `foot`: `overlap` + 32px, 48 from md — the text sits just above the card; without: the pb ramp)
 * @param {ReactNode} foot           a node rendered across the hero's bottom edge
 * @param {number}    overlap        how far `foot` rises into the hero, px (default 250); published on the section as `--kol-section-foot-overlap`
 * @param {boolean}   autoPlay · {number} autoPlayInterval · {'stack'|'header'} navPosition  carousel only
 * @param {Function}  renderTitle · {string} ctaLabel · {Function} onNavigate · {boolean} showTitle · showDescription · showCta ·
 *                    {string} titleClassName · descriptionClassName · {Object} options  carousel only — FeaturedCarousel's
 *                    seams, forwarded whole (SectionHeroCarouselSeams, 2026-08-26: the foundry index sets each
 *                    slide's title in the typeface's own font and routes the CTA through the SPA)
 * @param {string}    height         'full' | '80' | '60' | '40' (viewport tiers) · 'lg' | 'md' | 'screen' (aliases) · or a height class string
 * @param {ReactNode} eyebrow (alias label) · headline · body · actions  the composed text (SectionText)
 * @param {object}    slotClass · slotStyle  per-slot class / style, forwarded to SectionText (a consumer's reveal seam)
 * @param {string}    headlineSize   role; defaults per variant — media 'display-04', split 'heading-02'
 * @param {string}    gap            SectionText's inner rhythm, forwarded as given (no hero default)
 * @param {string}    [panelMaxWidth='max-w-[440px]']  the glass panel's cap on the composed route
 * @param {object}    panelProps     everything else on the glass panel (user ask 2026-08-26):
 *                                   `padding` ('px-6 py-8') · `maxWidth` · `surfaceOpacity`
 *                                   (80) · `blur` ('1px') · `gap` · `className`
 * @param {ReactNode} panel          a caller-authored content node; wins over the text props and children
 * @param {ReactNode} children       fallback content slot
 * @param {string}    align          media: 'center' | 'start' | 'end' — placement of the content ·
 *                                   split: 'left' | 'right' — the media side
 * @param {boolean}   fullBleed      span the full viewport width (100vw breakout) — split
 * @param {string}    className      extra classes on the section
 * @param {'primary'|'secondary'|'tertiary'|'inverse'|'auto'|'none'|string} background  the section's surface
 *   (SectionBackgroundProp, 2026-08-27) — a named surface, `none`, or a raw utility / token string; default = what it painted before
 */
export default function SectionHero({
  variant = 'media',
  theme,
  background,
  fullBleed = false,
  media,
  overlayOpacity = 0,
  veil = false,
  justify = 'center',
  foot,
  overlap = 250,
  autoPlay = false,
  autoPlayInterval = 5000,
  navPosition = 'stack',
  renderTitle,
  ctaLabel,
  onNavigate,
  showTitle,
  showDescription,
  showCta,
  titleClassName,
  descriptionClassName,
  options,
  height = 'lg',
  eyebrow,
  label,
  headline,
  /* per-variant DEFAULT only — the hero has no say in the text's voice
   * (SectionHeroNoOverrides, 2026-08-26): media 'display-04', split
   * 'heading-02'; the consumer's value wins */
  headlineSize,
  gap,
  body,
  actions,
  panelMaxWidth = 'max-w-[440px]',
  panelProps,
  slotClass,
  slotStyle,
  panel,
  children,
  align = 'center',
  className = '',
}) {
  /* `label` = alias of `eyebrow` (2026-08-27) */
  const eb = eyebrow ?? label
  const [themeRef, themeStamp] = useSectionTheme(theme)
  const themed = surfaceClass(background, theme ? 'primary' : 'none')

  if (variant === 'split') {
    const mediaFirst = align !== 'right'
    const bleed = bleedClass(fullBleed)
    const mediaNode = media == null
      ? <AssetPlaceholder radius={false} className="h-full w-full" />
      : isValidElement(media) || typeof media !== 'object'
        ? <ContentMedia ratio={null} radius={false} fit="cover" className="h-full">{media}</ContentMedia>
        : <MediaLayer media={media} />
    return (
      <section ref={themeRef} data-theme={themeStamp} className={`kol-section-hero-split grid grid-cols-1 md:grid-cols-2 ${themed} ${SPLIT_HEIGHTS[height] || height} ${bleed} ${className}`.replace(/\s+/g, ' ').trim()}>
        {/* the half sizes itself off the grid row (`h-full min-h-0`) so an
          * absolute media node — the descriptor's cover-fit img — fills it */}
        <div className={`relative h-full min-h-[50vh] overflow-hidden md:min-h-0 ${mediaFirst ? '' : 'md:order-2'}`.trim()}>{mediaNode}</div>
        <div className={`flex items-center justify-center p-10 ${mediaFirst ? '' : 'md:order-1'}`.trim()}>
          {/* BARE — the molecule's own voice; `headlineCase="upper"` is the
            * split hero's one trait, a role on SectionText (SectionHeroNoOverrides) */}
          <SectionText
            eyebrow={eb}
            headline={headline}
            headlineSize={headlineSize ?? 'heading-02'}
            headlineCase="upper"
            body={body}
            actions={actions}
            align="center"
            gap={gap}
            className="max-w-[var(--kol-content-column)]"
            slotClass={slotClass}
            slotStyle={slotStyle}
          />
        </div>
      </section>
    )
  }

  const heightCls = HEIGHTS[height] || height
  const alignCls =
    align === 'start' ? 'justify-start'
    : align === 'end' ? 'justify-end'
    : 'justify-center'
  const composed = eb || headline || body || actions

  /* the foot straddles the fold: the organism owns the negative margin */
  const withFoot = (hero) =>
    foot ? (
      <div className="kol-section-hero-wrap relative">
        {hero}
        <div className="relative z-20" style={{ marginTop: `-${overlap}px` }}>{foot}</div>
      </div>
    ) : hero

  /* CAROUSEL — an array of slides. FeaturedCarousel is the engine (embla,
   * autoplay ring, one glass panel per slide); the hero is its one home. A
   * slide is `{ src, kind, poster, alt, title, subtitle, description, href,
   * ctaLabel }` or the carousel's own `{ media, … }` shape. */
  if (Array.isArray(media)) {
    const items = media.map((s) => (s.media ? s : { ...s, media: { src: s.src, kind: s.kind, poster: s.poster, srcSet: s.srcSet, alt: s.alt } }))
    return withFoot(
      theme ? (
        <div ref={themeRef} data-theme={themeStamp} className={themed}>
          <FeaturedCarousel
            items={items}
            fullWidth
            rounded={false}
            showHeader={false}
            height={heightCls}
            autoPlay={autoPlay}
            autoPlayInterval={autoPlayInterval}
            navPosition={navPosition}
            {...Object.fromEntries(Object.entries({ renderTitle, ctaLabel, onNavigate, showTitle, showDescription, showCta, titleClassName, descriptionClassName, options }).filter(([, v]) => v !== undefined))}
            className={`kol-section-hero-carousel ${fullBleed ? FULL_BLEED : ''} ${className}`.replace(/\s+/g, ' ').trim()}
          >
            {children}
          </FeaturedCarousel>
        </div>
      ) : (
      <FeaturedCarousel
        items={items}
        fullWidth
        rounded={false}
        showHeader={false}
        height={heightCls}
        autoPlay={autoPlay}
        autoPlayInterval={autoPlayInterval}
        navPosition={navPosition}
        {...Object.fromEntries(Object.entries({ renderTitle, ctaLabel, onNavigate, showTitle, showDescription, showCta, titleClassName, descriptionClassName, options }).filter(([, v]) => v !== undefined))}
        className={`kol-section-hero-carousel ${fullBleed ? FULL_BLEED : ''} ${className}`.replace(/\s+/g, ' ').trim()}
      >
        {children}
      </FeaturedCarousel>
      ),
    )
  }

  const text = composed ? (
    /* BARE (SectionHeroNoOverrides, user 2026-08-26: "you think the purpose
     * of unifying components is to make OVERWRITES?") — the hero passes the
     * slots and nothing about their voice. The old glass hero's gap-6 /
     * body-02 / caps were pixel parity with a retired component, and parity
     * with it is not the bar; one voice across the set is. `gap` is the
     * consumer's if they want it. */
    <SectionText
      eyebrow={eb}
      headline={headline}
      headlineSize={headlineSize ?? 'display-04'}
      body={body}
      actions={actions}
      align={align === 'center' ? 'center' : 'start'}
      gap={gap}
      className={media == null ? `${panelMaxWidth} mx-auto` : ''}
      slotClass={slotClass}
      slotStyle={slotStyle}
    />
  ) : null
  /* no media → the TEXT-ONLY hero: the composed text on the surface, no glass
   * (FoundryLicensing's hero); with media, the glass panel over it */
  const content = panel ?? (composed
    ? (media == null ? text : (
        <OverlayGlassPanel maxWidth={panelMaxWidth} align={align === 'center' ? 'center' : 'start'} {...panelProps}>
          {text}
        </OverlayGlassPanel>
      ))
    : children)

  /* `justify="end"` + `foot` (SectionHeroFootClearance, kol-website
   * 2026-08-27 — user, dev vs live: "why can't you make it the same?"): the
   * foot rises `overlap` px into the hero, so the content's bottom inset is
   * the pb ramp PLUS the overlap — the text clears the card at any overlap.
   * The ramp is a custom property so the sum is one literal class; `overlap`
   * is published on the section as --kol-section-foot-overlap (0 without a
   * foot). */
  /* the bottom inset is never the `p-*` shorthand: `md:p-10` sits in a later
   * media query than a bare `pb-*` and would win it back at ≥768 (measured —
   * the old `pb-32 sm:pb-40` ramp lost to it between 768 and 1023 too). */
  /* WITH a foot the inset is `overlap` + one small gap — 32px, 48 from md
   * (SectionHeroFootGap, kol-website 2026-08-27: 0.86.0's ramp + overlap
   * floated the lede ~474px above the card; live sat it ~50px above). No
   * foot → the padding ramp, as before. */
  const justifyCls = justify === 'end'
    ? (foot
      ? 'items-end pb-[calc(var(--kol-section-foot-overlap)+2rem)] md:pb-[calc(var(--kol-section-foot-overlap)+3rem)]'
      : 'items-end pb-32 sm:pb-40 lg:pb-48 xl:pb-56')
    : 'items-center pb-6 md:pb-10'
  const footVar = foot ? { '--kol-section-foot-overlap': `${overlap}px` } : undefined

  return withFoot(
    <section ref={themeRef} data-theme={themeStamp} className={`kol-full-bleed-hero relative isolate w-full overflow-hidden ${themed} ${heightCls} ${fullBleed ? FULL_BLEED : ''} ${className}`.replace(/\s+/g, ' ').trim()} style={footVar}>
      <MediaLayer media={media} />
      {overlayOpacity > 0 && (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: 'var(--kol-surface-primary)', opacity: overlayOpacity / 100 }}
        />
      )}
      {veil && <div aria-hidden="true" className="kol-section-hero-veil absolute inset-0" />}
      <div className={`relative z-10 flex h-full w-full ${justifyCls} ${alignCls} px-6 pt-6 md:px-10 md:pt-10`}>
        {content}
      </div>
    </section>,
  )
}
