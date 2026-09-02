import SectionCardItem from '../molecules/SectionCardItem.jsx'
import { FULL_BLEED } from './sectionBleed.js'
import { surfaceClass } from '../utilities/sectionSurface.js'
import SectionText, { HEADLINE_ROLE } from '../molecules/SectionText.jsx'
import useSectionTheme from '../hooks/useSectionTheme.js'
import { minHeightClass } from './sectionHeights.js'

/**
 * SectionCards — the "N-up feature cards" band: a `SectionText` header over a
 * responsive row of `SectionCardItem` cards, capped by an optional centred
 * action row. `FeaturesCardSection` is this component under its old name and
 * prop names (`headerLabel` → `headline`, `headerDescription` → `body`,
 * `ctas` → `actions`; alias kept).
 *
 * Every block is presence-gated (header on any text prop, cards on
 * `features.length`, actions on `actions`), so omitted slots emit no empty
 * nodes. Card links are plain anchors; pass `onNavigate` to intercept same-tab
 * navigations in an SPA. The label is uppercase by role; the rest as authored.
 *
 * @param {'inverse'|'light'|'dark'} theme  the section's theme scope (SectionThemeInverse, 2026-08-27):
 *   `inverse` = the paired theme of the nearest live one, following the toggle;
 *   `light` / `dark` pinned; omit to inherit. Stamps `data-theme` on the root and
 *   paints its surface — every token inside resolves to the other theme's.
 * @param {'full'|'80'|'60'|string} [height='60']  min-height on the family's ladder — full = 100dvh,
 *   80 = 70svh / 80vh, 60 = 50svh / 60vh (default), 40 = 35svh / 40vh; content stays vertically centred inside it
 * @param {{title, icon, visual, description, href, backgroundColor, imageAspectRatio, zoom}[]} features
 *   `zoom` is the per-card hover scale (default 1.03) — the right amount belongs to the ARTWORK,
 *   not the component: 3% reads correctly on a dense photographic visual and is invisible on sparse
 *   line-art, and one set can hold both (CardFeatureZoomScale, kol-website 2026-08-31).
 * @param {ReactNode} eyebrow (alias label) · headline · body   the header (heading-03 + mono lede by default)
 * @param {ReactNode} actions               centred action row under the cards
 * @param {Function}  onNavigate            (event, feature) => void
 * @param {string}    itemClassName         extra classes on every card (reveal seam)
 * @param {object|Function} itemStyle       inline style per card, or `(index) => style`
 * @param {object}    slotClass · slotStyle  per-slot class / style on the header text
 * @param {boolean}  [fullBleed=false]  the FILL breaks the page gutter while the content keeps it —
 *   the family's shared breakout (`sectionBleed.js`, SectionFamilyFullBleed, kol-website 2026-08-31).
 *   Any member of this family can be a filled surface, and a filled surface inside `.kol-page` has its
 *   colour clipped by the gutter on mobile. Viewport-relative, so unlike `.kol-full-bleed` it does not
 *   over-bleed in a parent with no gutter of its own. The section's horizontal padding re-insets the
 *   CONTENT, so only the fill moves. Default false — nothing renders differently until it is passed.
 * @param {string}    sectionClassName · wrapperClassName · cardsWrapperClassName · actionsClassName · headerClassName · headerTextWidthClass  layout seams
 * @param {'primary'|'secondary'|'tertiary'|'inverse'|'auto'|'none'|string} background  the section's surface
 *   (SectionBackgroundProp, 2026-08-27) — a named surface, `none`, or a raw utility / token string; default = what it painted before
 */
export default function SectionCards({
  fullBleed = false,
  coarseReveal = 'in-view',
  theme,
  background,
  height = '60',
  features = [],
  eyebrow,
  label,
  headline,
  headlineSize = 'heading-03',
  body,
  actions,
  onNavigate,
  /* the reveal seams (SectionRevealSeams, kol-website 2026-08-26): a
   * consumer's entrance system stamps a class + `--reveal-delay` per card;
   * `itemStyle` is an object or `(index) => object`. Nothing animates here. */
  itemClassName = '',
  itemStyle,
  slotClass,
  slotStyle,
  sectionClassName = '',
  /* the family's one cap — the shell's --kol-container-max ladder (2026-08-26) */
  wrapperClassName = 'w-full flex flex-col gap-8 md:gap-10 max-w-[var(--kol-container-max,var(--kol-content-shell,1800px))] mx-auto',
  cardsWrapperClassName = 'self-stretch inline-flex flex-col md:flex-row md:h-72 justify-start items-center gap-6',
  actionsClassName = 'pt-10 pb-24',
  headerClassName = 'w-full pt-[224px]',
  headerTextWidthClass = 'w-full md:w-[30%]',
}) {
  /* `label` = alias of `eyebrow` (2026-08-27) */
  const eb = eyebrow ?? label
  const [themeRef, themeStamp] = useSectionTheme(theme)
  return (
    <section ref={themeRef} data-theme={themeStamp} className={`${fullBleed ? FULL_BLEED : 'w-full'} flex flex-col justify-center ${minHeightClass(height)} ${surfaceClass(background, theme ? 'primary' : 'none')} ${sectionClassName}`.replace(/\s+/g, ' ').trim()}>
      <div className={wrapperClassName}>
        {(eb || headline || body) && (
          <SectionText
            eyebrow={eb}
            headline={headline}
            headlineSize={headlineSize}
            headlineAs="p"
            /* the heading's 32px line box (`flex items-center h-8`) and the
             * lede's 12px step, as the band has always drawn them */
            headlineClass={`${HEADLINE_ROLE[headlineSize] ?? HEADLINE_ROLE['heading-03']} flex items-center h-8`}
            body={body}
            bodyClass={`kol-mono-14 text-fg-64 ${headerTextWidthClass}`}
            labelClass="kol-helper-12 text-meta"
            gap="gap-3"
            slotClass={slotClass}
            slotStyle={slotStyle}
            className={headerClassName}
          />
        )}

        {features.length > 0 && (
          <div className={cardsWrapperClassName}>
            {features.map((feature, index) => (
              <SectionCardItem
                key={index}
                title={feature.title}
                icon={feature.icon}
                visual={feature.visual}
                description={feature.description}
                href={feature.href}
                backgroundColor={feature.backgroundColor}
                imageAspectRatio={feature.imageAspectRatio}
                zoom={feature.zoom}
                coarseReveal={coarseReveal}
                onNavigate={onNavigate ? (event) => onNavigate(event, feature) : undefined}
                className={itemClassName}
                style={typeof itemStyle === 'function' ? itemStyle(index) : itemStyle}
              />
            ))}
          </div>
        )}

        {actions && (
          <div className={`w-full flex flex-wrap items-center justify-center gap-4 ${actionsClassName}`.trim()}>
            {actions}
          </div>
        )}
      </div>
    </section>
  )
}
