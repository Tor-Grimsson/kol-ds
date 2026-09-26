/**
 * SectionText — the ruled text block of the SECTION family (SectionSet,
 * kol-website 2026-08-26): label · headline · body · actions, every slot
 * opt-in — an omitted slot renders nothing. The section-tier twin of
 * ContentText: the card family solved "every organism types its own kicker /
 * heading / body by hand" on 2026-08-15, and the sections had the same
 * disease — zero shared text primitive across hero, split, cards band, CTA.
 *
 * Type by ROLE, never a threaded class (DS ruling 2026-08-15): `headlineSize`
 * picks one type class for the headline. `pull` is the split's display pull
 * (`.kol-section-text-pull`, the old `.kol-feature-split-pull`).
 *
 * Every default class is a SEAM (the ContentText pattern): pass `labelClass`
 * / `bodyClass` / `actionsClass` to replace the string whole — that is how
 * SectionHero's eyebrow and SectionCta's rows wear their own voices on the
 * same anatomy. THE LABEL IS UPPERCASE BY ROLE (user ruling 2026-08-26):
 * an eyebrow is caps by design language, so the span carries
 * `.kol-section-text-eyebrow`; headline, body and actions render as authored.
 *
 * @param {ReactNode} eyebrow      the eyebrow — THE EYEBROW HAS ONE NAME (2026-08-27); `label` is its alias
 * @param {ReactNode} headline     the heading
 * @param {'pull'|'display-01'|'display-02'|'display-03'|'display-04'|'heading-01'|'heading-02'|'heading-03'|'heading-04'|'heading-05'} [headlineSize='heading-02']
 * @param {string}    [headlineAs='h2']  element for the headline
 * @param {'auto'|'upper'} [headlineCase='auto']  `upper` = the caps role (`.kol-section-text-caps`) —
 *                    a title card; the split hero sets it (SectionHeroNoOverrides, 2026-08-26:
 *                    a ROLE on the molecule, never a hero-side class)
 * @param {ReactNode} body         lede / paragraph(s)
 * @param {ReactNode} actions      row of Buttons / links / Tags
 * @param {'start'|'center'} [align='start']  text-align + item alignment
 * @param {string}    [gap='gap-4']  inner rhythm (a Tailwind gap step)
 * @param {ReactNode} children     extra slots rendered between body and actions
 *                                 (the split's stats strip)
 * @param {string}    eyebrowClass (alias labelClass) · bodyClass · actionsClass  full class overrides (eyebrow default: the hero's `kol-helper-12 text-meta`)
 * @param {object}    slotClass    extra classes per slot — `{ eyebrow, headline, body, actions }` (`label` still read)
 *                                 (SectionRevealSeams, 2026-08-26: a consumer's reveal system
 *                                 stamps `reveal` on each part; nothing animates in the DS)
 * @param {object}    slotStyle    inline style per slot — `{ headline: { '--reveal-delay': '0.1s' } }`
 * @param {string}    className    extra classes on the block
 */
export const HEADLINE_ROLE = {
  pull: 'kol-section-text-pull',
  'display-01': 'kol-sans-display-01',
  'display-02': 'kol-sans-display-02',
  'display-03': 'kol-sans-display-03',
  'display-04': 'kol-sans-display-04',
  'heading-01': 'kol-sans-heading-01',
  'heading-02': 'kol-sans-heading-02',
  'heading-03': 'kol-sans-heading-03',
  'heading-04': 'kol-sans-heading-04',
  'heading-05': 'kol-sans-heading-05',
}

export default function SectionText({
  eyebrow,
  label,
  headline,
  headlineSize = 'heading-02',
  headlineAs: Headline = 'h2',
  headlineCase = 'auto',
  headlineClass,
  body,
  actions,
  align = 'start',
  gap = 'gap-4',
  children,
  /* ONE eyebrow voice across the set (SectionTextLabelVoice, user 2026-08-26:
   * "closer to the hero eyebrow") — the hero's helper-12 / meta, small and
   * quiet, not the split's mono-18 accent kicker. Uppercase stays: that is
   * the eyebrow ROLE (ruled the same day), on `.kol-section-text-eyebrow`. */
  eyebrowClass,
  labelClass,
  bodyClass = 'kol-section-text-body',
  actionsClass = 'flex flex-wrap gap-4',
  /* ACTIONS ON THE BODY'S BASELINE (page-header-one-masthead, 2026-09-03).
   * Default `below` is the section stack every organism renders. `inline` puts
   * the cluster in ONE flex row with the body, which is the only way to land it
   * on the body's first baseline rather than the headline's — flexbox exposes a
   * flex item's first baseline, so they have to share a row.
   *
   * The cluster contributes NO HEIGHT there: a flex row takes its tallest
   * child, so `sm` controls (26px) against a one-line `kol-mono-14` (18px) made
   * the block 10px taller — measured across two apps, and the masthead is the
   * one block every page shares, so a page with a control cluster sat lower
   * than one without. `h-0 self-center` makes the children overflow a
   * zero-height box symmetrically; the row's height is the TEXT's, at any rung.
   * Horizontal layout is untouched, so a long body cannot run under the
   * controls (PageHeaderTrailingSlot / PageHeaderActionsGrowsBlock, carried in
   * from `PageHeader` when it became a composition of this base). */
  actionsPlacement = 'below',
  slotClass = {},
  slotStyle = {},
  className = '',
  /* the ROOT's own style — a composition that owns its rhythm needs it
     (PageHeader's `--kol-page-header-mb`). `slotStyle` reaches the slots; this
     was the one box it could not reach. */
  style,
}) {
  /* `label` / `labelClass` / slot key `label` = aliases of `eyebrow` (2026-08-27) */
  const eb = eyebrow ?? label
  const ebClass = eyebrowClass ?? labelClass ?? 'kol-helper-12 text-meta'
  const cls = (base, slot) => `${base} ${slotClass[slot] ?? (slot === 'eyebrow' ? slotClass.label : undefined) ?? ''}`.trim()
  const alignCls = align === 'center' ? 'items-center text-center' : 'items-start text-left'
  const inlineActions = actionsPlacement === 'inline' && !!actions && !!body
  const bodyNode = body && (typeof body === 'string'
    ? <p className={cls(bodyClass, 'body')} style={slotStyle.body}>{body}</p>
    : <div className={cls(bodyClass, 'body')} style={slotStyle.body}>{body}</div>)
  const cluster = actions && (
    <div className={cls(`${actionsClass} shrink-0 h-0 self-center`, 'actions')} style={slotStyle.actions}>{actions}</div>
  )
  return (
    <div className={`kol-section-text flex flex-col ${gap} ${alignCls} ${className}`.replace(/\s+/g, ' ').trim()} style={style}>
      {/* `kol-section-text-eyebrow` = uppercase by ROLE (kol-theme ≥0.55.0);
        * `labelClass` is the voice riding beside it */}
      {eb && <span className={cls(`kol-section-text-eyebrow ${ebClass}`, 'eyebrow')} style={slotStyle.eyebrow ?? slotStyle.label}>{eb}</span>}
      {headline && <Headline className={cls(`kol-section-text-headline ${headlineClass ?? (HEADLINE_ROLE[headlineSize] ?? HEADLINE_ROLE['heading-02'])}${headlineCase === 'upper' ? ' kol-section-text-caps' : ''}`, 'headline')} style={slotStyle.headline}>{headline}</Headline>}
      {bodyNode && (inlineActions
        ? (
          /* SELF-STRETCH (the Hub review, 2026-09-26 — user, on fxr's /settings: "there should
           * have been space between … on the right edge"). The column is `items-start`, so this
           * row shrank to its content and `justify-between` had no room to act: the cluster sat
           * against the subtitle on every PageHeader with actions. */
          <div className="flex self-stretch items-baseline justify-between gap-6">
            {bodyNode}
            {cluster}
          </div>
        )
        : bodyNode)}
      {children}
      {/* inline with no body → the cluster shares the HEADLINE's row instead */}
      {actions && !inlineActions && <div className={cls(actionsClass, 'actions')} style={slotStyle.actions}>{actions}</div>}
    </div>
  )
}
