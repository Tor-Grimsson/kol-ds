import SectionText from './SectionText.jsx'
/**
 * PageHeader — The page masthead. the page's masthead: an optional eyebrow, the title, and a
 * sub-line.
 *
 * LIVES IN kol-component SINCE 2026-09-03 (page-header-one-masthead,
 * kol-client-olina; user: *"these are serving the same purpose, why aren't they
 * the same component different variants?"*). It shipped from `kol-shell`, which
 * is the APP-shell tier — rails, drawers, the portal frame — so a site with no
 * shell could not take it without installing the whole package for one header,
 * and hand-built the masthead out of `SectionText` instead. kolkrabbi.io's
 * `/prints` and `/work` did exactly that, `/prints` carrying a comment
 * explaining it was reproducing `/work`'s block "in its wrapper verbatim" — a
 * consumer restating a rule the component should own.
 *
 * The rest of the catalog stack — `ContentFilters`, `ContentCollection`,
 * `ContentCard`, `SectionText` — was already here, so this reunites it: one
 * import for the whole page, site or app. Nothing circular: `kol-shell` peers on
 * `kol-component` at `>=0.127.0`, so every shell consumer already had it.
 * This overrides ARCHITECTURE §3's list, which named it kol-shell's.
 *
 * ONE SCALE since 2026-10-18 (Round 11): the app/site split, `size` sm–xl and the mono voice are
 * retired — `level` page | section is the only choice (see the block under this one).
 *
 * `eyebrow` is the small label above the title (kol-website's "USE CASES").
 * It self-hides when unset, so an app page passes nothing and gets nothing.
 *
 * @param {ReactNode} eyebrow   small label above the title
 * @param {ReactNode} title
 * @param {ReactNode} subtitle  the lede under the title (`description` is its other name)
 * @param {'page'|'app'|'section'} level  ONE HEADER (Round 11, approved 2026-10-18): page = h1
 *                    display-01 over `.kol-header-lede` (22/28 Light) — the hero; app = h1 display-01 at
 *                    46/60 (`text-[46px] md:text-[60px]`) over `.kol-header-lede-app` (19/26 Light) — the app tier's pages; section = h2
 *                    display-03 over `.kol-header-lede-section` (16/24 Light +0.5px). Default `page`.
 *                    Classes per level: `PAGE_HEADER_ROLES`.
 * @param {ReactNode} media     a mark above the eyebrow (a logo, an SVG) — shown only when passed
 * @param {ReactNode} description  the subtitle's other name — the header's description
 * @param {string}    titleClass  replaces the title role whole (the ContentText seam)
 * @param {ReactNode} actions   a control cluster on the SUBTITLE's first baseline — on the title's
 *                    when there is no subtitle (PageHeaderTrailingSlot, kol-website 2026-08-28;
 *                    kol-r2b2's header is the reference: wordmark left, controls right, on the
 *                    line). Without it the consumer wrapped the header in a flex row and got the
 *                    h1's baseline, or re-rendered the subtitle as a bare <p> off copied classes
 *                    with an `!important` on the margin — a DS text role re-implemented outside.
 * @param {string}    subtitleMaxWidth  the lede's measure (e.g. '800px' or '60ch'), a prop
 *                    instead of a consumer selector reaching inside
 * size · voice · register · masthead — retired 2026-10-18, accepted and ignored.
 * The bottom rhythm is `--kol-page-header-mb` (default 40px): inline, as before, but through a
 * variable a consumer can re-point where an inline literal could only be `!important`-ed.
 */
/* ONE HEADER (Round 11 made the default, user 2026-10-18 — "did we not update any of the apps that
 * use it?"). 0.267.0 shipped the approved header behind `register="site"` + `size="xl"` and left the
 * defaults alone, so no app moved: monitor's Home still wore the mono masthead. Now the level is the
 * only choice — page = display-01 over the 22/28 lede, section = display-03 over the 16/24 lede — and
 * `size` · `voice` · `register` · `masthead` are accepted and ignored, so every caller (and every
 * Shell's masthead) renders the one header with no edit. `titleClass` stays the seam. */
/* THREE LEVELS since 0.277.0 (PageHeaderAppLevel, kol-monitor — user: *"that display is fine for Section
 * Hero like in brand but not for EVERYTHING ELSE that uses the mono"*). `app` sits BETWEEN page and section,
 * in their family (0.278.0 — user: *"did I ask for mono?!?! … MAKE THE TEXT SMALLER … SO THAT IT IS BETWEEN
 * SECTION AND PAGE"*; 0.277.0 had made it mono): page's display-01 at 46 · 60 (from 768) in Tailwind,
 * no new style (0.279.0), over a 19/26 light lede. The app tier's Home ·
 * Library · Settings · Dev pages, which kol-shell defaults to it. Exported so a page drawing its own title
 * (monitor's Create inputs) matches the level. */
export const PAGE_HEADER_ROLES = {
  page: { title: 'kol-sans-display-01', lede: 'kol-header-lede' },
  app: { title: 'kol-sans-display-01 text-[46px] md:text-[60px]', lede: 'kol-header-lede-app' },
  section: { title: 'kol-sans-display-03', lede: 'kol-header-lede-section' },
}

export default function PageHeader({ eyebrow, title, subtitle, description, actions, subtitleMaxWidth, level = 'page', media, titleClass, className = '' }) {
  const section = level === 'section'
  const roles = PAGE_HEADER_ROLES[level] ?? PAGE_HEADER_ROLES.page
  const header = (
    /* the block owns its own rhythm — margins inline, never in a shared type
       class, which leaks estate-wide (ShellHeaderFilterRefinements, 2026-08-15) */
    <SectionText
      eyebrow={eyebrow}
      headline={title}
      headlineAs={section ? 'h2' : 'h1'}
      headlineClass={`text-fg-96 ${titleClass ?? roles.title}`}
      body={subtitle ?? description}
      bodyClass={`${roles.lede} min-w-0`}
      actions={actions}
      actionsPlacement="inline"
      actionsClass="flex items-center gap-4"
      /* HELPER, not mono (user ruling 2026-08-15). An eyebrow is single-line
         chrome — the whole definition of the `kol-helper-*` ramp — and it
         carries its own tracking, so no inline letter-spacing. Off `oq-64`:
         under half the ink read as disabled rather than quiet, and this is a
         live label, not a footnote. */
      eyebrowClass="kol-helper-12 text-oq-64"
      gap="gap-3"
      slotStyle={{ body: { maxWidth: subtitleMaxWidth } }}
      className={className}
      style={media ? undefined : { marginBottom: 'var(--kol-page-header-mb, 40px)' }}
    />
  )
  if (!media) return header
  return (
    <div className="flex flex-col gap-4" style={{ marginBottom: 'var(--kol-page-header-mb, 40px)' }}>
      <span className="inline-flex text-emphasis">{media}</span>
      {header}
    </div>
  )
}
