/**
 * SectionText — The label, headline and body block. the ruled text block of the SECTION family (SectionSet,
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
 * @param {'inline'|'below'|'head'} actionsPlacement  where the cluster sits — a level's default; `head` puts it on the headline's row whatever the body
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
 * @param {'page'|'app'|'section'|'content'|'document'} [variant]  THE HEADER VARIANTS (was `level` until 2026-10-31 — user: `variant`
 *                    is the only word for a variant; `level` stays a deprecated alias on the retirement ledger) (2026-10-22, user: *"rename PageHeader to
 *                    something that describes section text elements"* — PageHeader is now an alias of this). A
 *                    level fills the role defaults; any explicit prop still wins. page = h1 display-01 over
 *                    `.kol-header-lede` — the hero; app = h1 display-01 at 46/60 over `.kol-header-lede-app`;
 *                    section = h2 display-03 over `.kol-header-lede-section`; content = h3 heading-04 under a
 *                    `kol-eyebrow`, over body-01 fg-64 at 64ch — a section of a page's CONTENT (a dev tab's
 *                    sections, DevSectionHeader, kol-fxr); document = h1 36/1.2 bold display face over a 15/1.6 body-face lede
 *                    to 724px — a document's own page (DocumentIndex). A level sets actions inline, and the bottom rhythm
 *                    to `--kol-page-header-mb` (40px; content 16px). Unset = the section family as before.
 * @param {ReactNode} media        a mark above the eyebrow (a logo, an SVG) — with a `level` only
 * @param {ReactNode} meta         a fact at the far end of the HEADLINE's row (float-everything W9 row 140, 2026-11-04 —
 *                    `Website traffic · kolkrabbi.io · Umami`): the source or scope, in mono on fg-64 (`kol-float-timecode`
 *                    under `variant="float"`, else `kol-mono-12 text-meta`), baseline-aligned with the title. Unset, nothing
 * `variant="float"` — the float page header (see SECTION_TEXT_LEVELS.float).
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

/* ONE HEADER, FIVE LEVELS (Round 11 + PageHeaderAppLevel, carried from PageHeader whole). `title` is the
 * headline's type, `lede` the body's; the rest default the block for that level. */
export const SECTION_TEXT_LEVELS = {
  page: { title: 'kol-sans-display-01', lede: 'kol-header-lede' },
  app: { title: 'kol-sans-display-01 text-[46px] md:text-[60px]', lede: 'kol-header-lede-app' },
  section: { title: 'kol-sans-display-03', lede: 'kol-header-lede-section', as: 'h2' },
  /* content (DevSectionHeader, kol-fxr 2026-10-22 — the user's approved look: *"maybe title and description is
   * one step bigger?"*; never `kol-helper-*` for a paragraph) */
  content: { title: 'kol-sans-heading-04', lede: 'kol-sans-body-01 text-fg-64', eyebrow: 'kol-eyebrow text-fg-48', as: 'h3', gap: 'gap-2', mb: '16px', measure: '64ch' },
  /* document (DocumentIndexFigma, kol-atlas 2026-10-31) — the Research page header, the workspace sheet's: 36/1.2 bold
   * display face at −0.005em, 12 under it; the lede 15/1.6 in the body face to a 724 edge */
  document: { title: 'font-[family-name:var(--kol-font-family-sans)] text-[36px] font-bold leading-[1.2] tracking-[-0.005em]', lede: 'm-0 font-[family-name:var(--kol-font-family-sans-neutral)] text-[15px] leading-[1.6] text-fg-96', measure: '724px' },
  /* float (float-everything W9 row 135, 2026-11-04 — kol-float--style 48:4542): the float page header — the eyebrow in
   * mono (`kol-float-ruler`, fg-64, `STUDIO / WORKSPACE`), the title in `kol-float-sheet` (Inter 38/500), the subtitle
   * in `kol-float-body` on fg-64; 8 between, 24 under. A section heading on the float is this with
   * `headlineClass="kol-float-window"` and a `meta` (row 140). */
  float: { title: 'kol-float-sheet', lede: 'kol-float-body text-fg-64', eyebrow: 'kol-float-ruler text-fg-64', gap: 'gap-2', mb: '24px' },
}

export default function SectionText({
  eyebrow,
  label,
  headline,
  headlineSize = 'heading-02',
  headlineAs,
  headlineCase = 'auto',
  headlineClass,
  body,
  actions,
  align = 'start',
  gap,
  children,
  /* ONE eyebrow voice across the set (SectionTextLabelVoice, user 2026-08-26:
   * "closer to the hero eyebrow") — the hero's helper-12 / meta, small and
   * quiet, not the split's mono-18 accent kicker. Uppercase stays: that is
   * the eyebrow ROLE (ruled the same day), on `.kol-section-text-eyebrow`. */
  eyebrowClass,
  labelClass,
  bodyClass,
  actionsClass,
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
  actionsPlacement,
  slotClass = {},
  slotStyle = {},
  className = '',
  /* the ROOT's own style — a composition that owns its rhythm needs it
     (PageHeader's `--kol-page-header-mb`). `slotStyle` reaches the slots; this
     was the one box it could not reach. */
  style,
  variant: variantProp,
  /* deprecated alias of `variant` (2026-10-31) */
  level,
  media,
  meta,
}) {
  /* a LEVEL fills the header defaults; an explicit prop always wins */
  const variant = variantProp ?? level
  const L = variant ? SECTION_TEXT_LEVELS[variant] ?? SECTION_TEXT_LEVELS.page : null
  const Headline = headlineAs ?? L?.as ?? (L ? 'h1' : 'h2')
  if (L) {
    headlineClass = `text-fg-96 ${headlineClass ?? L.title}`
    bodyClass ??= `${L.lede} min-w-0`
    actionsClass ??= 'flex items-center gap-4'
    actionsPlacement ??= 'inline'
    slotStyle = L.measure && !slotStyle.body?.maxWidth ? { ...slotStyle, body: { ...slotStyle.body, maxWidth: L.measure } } : slotStyle
    if (!media) style = { marginBottom: `var(--kol-page-header-mb, ${L.mb ?? '40px'})`, ...style }
  }
  gap ??= L?.gap ?? (L ? 'gap-3' : 'gap-4')
  bodyClass ??= 'kol-section-text-body'
  actionsClass ??= 'flex flex-wrap gap-4'
  actionsPlacement ??= 'below'
  /* `label` / `labelClass` / slot key `label` = aliases of `eyebrow` (2026-08-27) */
  const eb = eyebrow ?? label
  /* a level's eyebrow is HELPER, not mono (PageHeader's ruling 2026-08-15), off `oq-64`; content's is the
   * `kol-eyebrow` role */
  const ebClass = eyebrowClass ?? labelClass ?? (L ? L.eyebrow ?? 'kol-helper-12 text-oq-64' : 'kol-helper-12 text-meta')
  const cls = (base, slot) => `${base} ${slotClass[slot] ?? (slot === 'eyebrow' ? slotClass.label : undefined) ?? ''}`.trim()
  const alignCls = align === 'center' ? 'items-center text-center' : 'items-start text-left'
  const inlineActions = actionsPlacement === 'inline' && !!actions && !!body
  /* `head` — the cluster shares the HEADLINE's row whatever the body (the Hub's masthead button, user 2026-10-23:
   * *"more aligned like 'Studio'"* — it sat on the subtitle's line); centred on the title, not on its baseline */
  const headRow = actionsPlacement === 'head' && !!actions && !!headline
  const inlineHead = (actionsPlacement === 'inline' && !!actions && !body && !!headline) || headRow
  const titleNode = headline && <Headline className={cls(`kol-section-text-headline ${headlineClass ?? (HEADLINE_ROLE[headlineSize] ?? HEADLINE_ROLE['heading-02'])}${headlineCase === 'upper' ? ' kol-section-text-caps' : ''}`, 'headline')} style={slotStyle.headline}>{headline}</Headline>
  /* `meta` rides the headline's row, at its far end */
  const headlineNode = titleNode && meta
    ? <div className="flex self-stretch items-baseline justify-between gap-6">{titleNode}<span className={`${variant === 'float' ? 'kol-float-timecode text-fg-64' : 'kol-mono-12 text-meta'} shrink-0`}>{meta}</span></div>
    : titleNode
  const bodyNode = body && (typeof body === 'string'
    ? <p className={cls(bodyClass, 'body')} style={slotStyle.body}>{body}</p>
    : <div className={cls(bodyClass, 'body')} style={slotStyle.body}>{body}</div>)
  const cluster = actions && (
    <div className={cls(`${actionsClass} shrink-0 md:h-0 md:self-center`, 'actions')} style={slotStyle.actions}>{actions}</div>
  )
  const block = (
    <div className={`kol-section-text flex flex-col ${gap} ${alignCls} ${className}`.replace(/\s+/g, ' ').trim()} style={style}>
      {/* `kol-section-text-eyebrow` = uppercase by ROLE (kol-theme ≥0.55.0);
        * `labelClass` is the voice riding beside it */}
      {eb && <span className={cls(`kol-section-text-eyebrow ${ebClass}`, 'eyebrow')} style={slotStyle.eyebrow ?? slotStyle.label}>{eb}</span>}
      {headlineNode && (inlineHead
        ? (
          /* INLINE WITH NO BODY → the cluster shares the HEADLINE's row (the tool frame, 2026-09-27 —
           * a tool's masthead is its title with its controls on the right, apps/media's). This
           * comment used to sit on the fallthrough below, which stacked the cluster under the
           * headline instead: the docstring promised a row the code never drew. It WRAPS: on a
           * phone a wide cluster drops under the title rather than pushing the page sideways. */
          <div className={`flex flex-wrap self-stretch ${headRow ? 'items-center' : 'items-baseline'} justify-between gap-x-6 gap-y-3`}>
            {headlineNode}
            <div className={cls(`${actionsClass} shrink-0`, 'actions')} style={slotStyle.actions}>{actions}</div>
          </div>
        )
        : headlineNode)}
      {bodyNode && (inlineActions
        ? (
          /* SELF-STRETCH (the Hub review, 2026-09-26 — user, on fxr's /settings: "there should
           * have been space between … on the right edge"). The column is `items-start`, so this
           * row shrank to its content and `justify-between` had no room to act: the cluster sat
           * against the subtitle on every PageHeader with actions. */
          /* BELOW `md` THE CLUSTER DROPS UNDER THE BODY (kol-fxr 2026-10-09, HubSettingsHeaderAt390:
           * at 390 the cluster kept its natural width and left the lede ~110px, three lines). It
           * takes its own row there, with its real height; the zero-height trick is a desk rule. */
          <div className="flex flex-col md:flex-row self-stretch md:items-baseline md:justify-between gap-3 md:gap-6">
            {bodyNode}
            {cluster}
          </div>
        )
        : bodyNode)}
      {children}
      {actions && !inlineActions && !inlineHead && <div className={cls(actionsClass, 'actions')} style={slotStyle.actions}>{actions}</div>}
    </div>
  )
  if (!(L && media)) return block
  return (
    <div className="flex flex-col gap-4" style={{ marginBottom: `var(--kol-page-header-mb, ${L.mb ?? '40px'})` }}>
      <span className="inline-flex text-emphasis">{media}</span>
      {block}
    </div>
  )
}
