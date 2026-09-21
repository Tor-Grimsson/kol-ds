import SectionText from './SectionText.jsx'
/**
 * PageHeader — the page's masthead: an optional eyebrow, the title, and a
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
 * TWO SCALES, because two things were being called a page header. An app page
 * (monitor's Library, mirror's settings) wears a compact heading; a SITE page
 * (kol-website's /work) opens on the display scale and the difference is not a
 * preference, it is which register you are in. `size` picks:
 *
 *   sm   kol-sans-heading-03  32px — app chrome, a titled panel
 *   md   kol-sans-display-03  36 / 42 / 48px — the default page masthead
 *   lg   kol-sans-display-02  44 / 56 / 64px — a landing or section opener
 *
 * The title used to be `kol-heading-sm`, a retired t-shirt stop with NO rule
 * anywhere in kol-theme, so every page title in every shell app fell through to
 * the browser's default h1 (found 2026-08-15). It was mapped to heading-03,
 * which was still too quiet for a page — hence the scale.
 *
 * `eyebrow` is the small label above the title (kol-website's "USE CASES").
 * It self-hides when unset, so an app page passes nothing and gets nothing.
 *
 * @param {ReactNode} eyebrow   small label above the title
 * @param {ReactNode} title
 * @param {ReactNode} subtitle  mono line under the title
 * @param {'app'|'site'} register  which REGISTER the masthead is in (default `app`).
 *                    The registers differ in the sub-line's voice and nothing else — the
 *                    title roles, the sizes and the actions baseline are shared, which is
 *                    what made this one component rather than two:
 *                      app   mono sub-line (`kol-mono-14`) — an app page's masthead. The
 *                            default, so no shell page moves.
 *                      site  sans lede (`kol-sans-body-01`) — what kolkrabbi.io's `/prints`
 *                            and `/work` build by hand today.
 * @param {string}    size      sm | md | lg (default md)
 * @param {'sans'|'mono'} voice  the title's family (default sans). `mono` = the
 *                    app tier's masthead (PageHeaderMonoTitle, kol-fxr 2026-08-27 —
 *                    user ruling: kol-monitor's JetBrains Mono 32 / 500 is the look):
 *                    kol-mono-heading-03 · kol-mono-display-03 · kol-mono-display-02
 *                    (kol-theme ≥0.67.0). The subtitle stays kol-mono-14.
 * @param {string}    titleClass  replaces the title role whole (the ContentText seam)
 * @param {ReactNode} actions   a control cluster on the SUBTITLE's first baseline — on the title's
 *                    when there is no subtitle (PageHeaderTrailingSlot, kol-website 2026-08-28;
 *                    kol-r2b2's header is the reference: wordmark left, controls right, on the
 *                    line). Without it the consumer wrapped the header in a flex row and got the
 *                    h1's baseline, or re-rendered the subtitle as a bare <p> off copied classes
 *                    with an `!important` on the margin — a DS text role re-implemented outside.
 * @param {string}    subtitleMaxWidth  the lede's measure (e.g. '800px' or '60ch'), a prop
 *                    instead of a consumer selector reaching inside
 * The bottom rhythm is `--kol-page-header-mb` (default 40px): inline, as before, but through a
 * variable a consumer can re-point where an inline literal could only be `!important`-ed.
 */
/* the title role per size and voice — the one thing PageHeader knows that the
 * base does not, because the base's ladder is the SECTION scale */
const TITLE = {
  sans: { sm: 'kol-sans-heading-03', md: 'kol-sans-display-03', lg: 'kol-sans-display-02' },
  mono: { sm: 'kol-mono-heading-03', md: 'kol-mono-display-03', lg: 'kol-mono-display-02' },
}
/* the ONE thing the registers disagree about */
const LEDE = { app: 'kol-mono-14', site: 'kol-sans-body-01' }

export default function PageHeader({ eyebrow, title, subtitle, actions, subtitleMaxWidth, size = 'md', voice = 'sans', register = 'app', titleClass, className = '' }) {
  const roles = TITLE[voice] ?? TITLE.sans
  return (
    /* the block owns its own rhythm — margins inline, never in a shared type
       class, which leaks estate-wide (ShellHeaderFilterRefinements, 2026-08-15) */
    <SectionText
      eyebrow={eyebrow}
      headline={title}
      headlineAs="h1"
      headlineClass={`text-fg-96 ${titleClass ?? roles[size] ?? roles.md}`}
      body={subtitle}
      bodyClass={`text-oq-64 ${LEDE[register] ?? LEDE.app} min-w-0`}
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
      style={{ marginBottom: 'var(--kol-page-header-mb, 40px)' }}
    />
  )
}
